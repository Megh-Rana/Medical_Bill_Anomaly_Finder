# Price Band Violation Detection
# Detects pricing that falls outside acceptable ranges based on city tier and accreditation

from typing import List, Dict, Optional
from .utils import (
    find_procedure, get_city_tier, get_tier_multiplier,
    get_accreditation_premium, normalize_text, contains_any
)


def detect_price_band_violations(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Detect pricing violations based on tier, accreditation, and procedure type.
    
    Args:
        items: List of bill line items
        procedure_context: Dict with keys:
            - primary_surgery: str
            - hospital_city: str
            - hospital_accreditation: str (nabh/jci/none)
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    # Get context
    primary_surgery = procedure_context.get("primary_surgery", "")
    hospital_city = procedure_context.get("hospital_city", "")
    accreditation = procedure_context.get("hospital_accreditation", "none")
    
    if not primary_surgery or not hospital_city:
        return anomalies
    
    # Find the procedure in database
    procedure = find_procedure(primary_surgery)
    if not procedure:
        return anomalies
    
    # Get pricing parameters
    tier = get_city_tier(hospital_city)
    tier_multiplier = get_tier_multiplier(hospital_city)
    accred_premium = get_accreditation_premium(accreditation)
    
    pricing = procedure.get("pricing", {})
    
    # Determine applicable price range
    tier_key = f"{tier}_private_range"
    price_range = pricing.get(tier_key)
    
    if not price_range:
        return anomalies
    
    base_min, base_max = price_range
    
    # Adjust for accreditation
    adjusted_max = base_max * (1 + accred_premium)
    cghs_base = pricing.get("cghs_base")
    
    # Find the surgery charge in bill items
    for item in items:
        item_name = item.get("item_name", "")
        total_price = item.get("total_price") or item.get("unit_price", 0)
        
        if not total_price:
            continue
        
        # Check if this is the surgery package/charge
        if not _is_surgery_charge(item_name, primary_surgery, procedure):
            continue
        
        # Check if price exceeds upper bound
        if total_price > adjusted_max:
            anomalies.append({
                "type": "S1",
                "item": item_name,
                "severity": "high",
                "title": "Price above acceptable range",
                "explanation": (
                    f"₹{total_price:,.0f} exceeds max of ₹{adjusted_max:,.0f} for {tier.upper()} city "
                    f"({accreditation.upper()} accredited). Expected range: ₹{base_min:,.0f} - ₹{adjusted_max:,.0f}"
                )
            })
        
        # Check if price is suspiciously below CGHS (possible quality concern or billing manipulation)
        elif cghs_base and total_price < cghs_base * 0.5:
            anomalies.append({
                "type": "S1",
                "item": item_name,
                "severity": "medium",
                "title": "Price suspiciously low",
                "explanation": (
                    f"₹{total_price:,.0f} is less than half the CGHS rate of ₹{cghs_base:,.0f}. "
                    f"This may indicate incomplete billing or quality concerns."
                )
            })
    
    # Check for robotic surgery premium appropriateness
    robotic_anomalies = _check_robotic_pricing(items, procedure, procedure_context)
    anomalies.extend(robotic_anomalies)
    
    return anomalies


def _is_surgery_charge(item_name: str, primary_surgery: str, procedure: Dict) -> bool:
    """Check if an item is the main surgery charge."""
    normalized = normalize_text(item_name)
    
    # Check against procedure name and aliases
    if normalize_text(procedure["name"]) in normalized:
        return True
    
    for alias in procedure.get("aliases", []):
        if normalize_text(alias) in normalized:
            return True
    
    # Common surgery charge patterns
    surgery_keywords = ["package", "surgery charge", "procedure charge", "operation charge"]
    if contains_any(item_name, surgery_keywords):
        return True
    
    return False


def _check_robotic_pricing(items: List[Dict], procedure: Dict, context: Dict) -> List[Dict]:
    """Check if robotic surgery premium is justified."""
    anomalies = []
    
    robotic_premium = procedure.get("pricing", {}).get("robotic_premium_percent")
    if not robotic_premium:
        return anomalies
    
    # Check if bill claims robotic surgery
    has_robotic_charge = False
    has_robotic_consumables = False
    robotic_item_name = ""
    
    robotic_keywords = ["robotic", "da vinci", "robot assisted", "robotic surgery"]
    robotic_consumable_keywords = ["robotic instrument", "robotic arm", "robotic trocar", "da vinci consumable"]
    
    for item in items:
        item_name = item.get("item_name", "")
        
        if contains_any(item_name, robotic_keywords):
            has_robotic_charge = True
            robotic_item_name = item_name
        
        if contains_any(item_name, robotic_consumable_keywords):
            has_robotic_consumables = True
    
    # Robotic charge without robotic consumables is suspicious
    if has_robotic_charge and not has_robotic_consumables:
        anomalies.append({
            "type": "S9",
            "item": robotic_item_name,
            "severity": "high",
            "title": "Robotic surgery billed without robotic consumables",
            "explanation": (
                "Robotic surgery requires specific consumables (robotic instruments, arms, trocars). "
                "Their absence suggests the procedure may have been conventional, not robotic."
            )
        })
    
    return anomalies
