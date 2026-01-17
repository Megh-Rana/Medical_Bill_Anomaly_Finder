# Implant and Consumable Abuse Detection
# Detects NPPA price cap violations and illegal room-based markup

from typing import List, Dict
from .utils import load_database, normalize_text, contains_any


def detect_implant_abuse(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Detect implant and consumable pricing violations.
    
    Checks:
    - NPPA price caps for stents and knee/hip implants
    - Room category based markup (illegal)
    - Unspecified high-end implant billing
    
    Args:
        items: List of bill line items
        procedure_context: Dict with room_category key
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    nppa_data = load_database("nppa_price_caps")
    regulated_devices = nppa_data.get("nppa_regulated_devices", {})
    
    room_category = procedure_context.get("room_category", "").lower()
    
    # Track implants found for room-based markup detection
    implant_prices = []
    
    for item in items:
        item_name = item.get("item_name", "")
        unit_price = item.get("unit_price") or item.get("total_price", 0)
        
        if not item_name or not unit_price:
            continue
        
        # Check each regulated device category
        for device_category, device_data in regulated_devices.items():
            keywords = device_data.get("keywords", [])
            
            if not contains_any(item_name, keywords):
                continue
            
            # Found a regulated device
            price_caps = device_data.get("price_caps", {})
            
            # Find applicable cap based on implant type
            applicable_cap = _find_applicable_cap(item_name, price_caps)
            
            if applicable_cap:
                cap_price = applicable_cap["max_price"]
                cap_desc = applicable_cap["description"]
                
                if unit_price > cap_price:
                    anomalies.append({
                        "type": "S4",
                        "item": item_name,
                        "severity": "high",
                        "title": "NPPA price cap violated",
                        "explanation": (
                            f"₹{unit_price:,.0f} exceeds NPPA ceiling of ₹{cap_price:,.0f} "
                            f"for {cap_desc}. This violates Drug Price Control Order (DPCO)."
                        )
                    })
                
                implant_prices.append({
                    "name": item_name,
                    "price": unit_price,
                    "category": device_category
                })
            
            break  # Only match one device category per item
    
    # Check for room-based implant markup
    if room_category in ["deluxe", "suite", "private"] and implant_prices:
        # Flag if implant prices seem inflated for premium rooms
        anomalies.extend(_check_room_based_markup(implant_prices, room_category))
    
    # Check for unspecified high-end implants
    anomalies.extend(_check_unspecified_implants(items))
    
    return anomalies


def _find_applicable_cap(item_name: str, price_caps: Dict) -> Dict:
    """Find the applicable price cap based on implant type keywords."""
    normalized = normalize_text(item_name)
    
    # Stent types
    if "bare metal" in normalized or "bms" in normalized:
        return price_caps.get("bare_metal_stent", {})
    if "drug eluting" in normalized or "des" in normalized:
        return price_caps.get("drug_eluting_stent", {})
    if "bioresorbable" in normalized or "bvs" in normalized:
        return price_caps.get("bioresorbable_stent", {})
    
    # Knee types
    if "cruciate" in normalized:
        return price_caps.get("cruciate_retaining", {})
    if "posterior stabilized" in normalized or "ps " in normalized:
        return price_caps.get("posterior_stabilized", {})
    if "revision" in normalized:
        return price_caps.get("revision_knee", {})
    if "unicondylar" in normalized or "unicompartmental" in normalized:
        return price_caps.get("unicondylar", {})
    if "oxinium" in normalized or "oxidized zirconium" in normalized:
        return price_caps.get("oxidized_zirconium", {})
    
    # Hip types
    if "partial" in normalized and "cemented" in normalized:
        return price_caps.get("partial_cemented", {})
    if "partial" in normalized and "cementless" in normalized:
        return price_caps.get("partial_cementless", {})
    if "total" in normalized and "cemented" in normalized:
        return price_caps.get("total_cemented", {})
    if "hybrid" in normalized:
        return price_caps.get("total_hybrid", {})
    if "total" in normalized and "cementless" in normalized:
        return price_caps.get("total_cementless", {})
    
    # Default to highest cap if type not specified (for flagging unspec)
    if "stent" in normalized:
        return price_caps.get("drug_eluting_stent", {})
    if "knee" in normalized:
        return price_caps.get("revision_knee", price_caps.get("posterior_stabilized", {}))
    if "hip" in normalized:
        return price_caps.get("total_cementless", price_caps.get("total_cemented", {}))
    
    return {}


def _check_room_based_markup(implant_prices: List[Dict], room_category: str) -> List[Dict]:
    """Check for illegal room category based implant markup."""
    anomalies = []
    
    # This is a heuristic check - in reality would need to compare with 
    # same hospital's general ward prices
    for implant in implant_prices:
        # Flag if implant name doesn't specify enough detail
        if len(implant["name"].split()) < 3:
            anomalies.append({
                "type": "S5",
                "item": implant["name"],
                "severity": "medium",
                "title": "Review implant pricing for room-based markup",
                "explanation": (
                    f"Patient is in {room_category} room. Per NPPA guidelines, "
                    f"implant prices cannot vary based on room category. "
                    f"Verify this ₹{implant['price']:,.0f} charge is same as general ward rate."
                )
            })
    
    return anomalies


def _check_unspecified_implants(items: List[Dict]) -> List[Dict]:
    """Check for high-value implants without proper specification."""
    anomalies = []
    
    high_value_keywords = ["implant", "prosthesis", "stent", "graft"]
    
    for item in items:
        item_name = item.get("item_name", "")
        price = item.get("unit_price") or item.get("total_price", 0)
        
        if not contains_any(item_name, high_value_keywords):
            continue
        
        if price < 10000:  # Only check high-value items
            continue
        
        # Check if item has sufficient specification
        words = item_name.split()
        has_manufacturer = any(word.isupper() and len(word) > 2 for word in words)
        has_model = any(char.isdigit() for char in item_name)
        
        if not has_manufacturer and not has_model and len(words) < 4:
            anomalies.append({
                "type": "S4",
                "item": item_name,
                "severity": "medium",
                "title": "Unspecified high-value implant",
                "explanation": (
                    f"₹{price:,.0f} charged for implant without manufacturer/model details. "
                    f"Request itemized bill with manufacturer name, model, and serial number."
                )
            })
    
    return anomalies
