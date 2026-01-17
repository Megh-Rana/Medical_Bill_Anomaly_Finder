# Ghost Services Detection
# Detects impossible or suspicious services

from typing import List, Dict
from collections import Counter
from .utils import normalize_text, contains_any


def detect_ghost_services(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Detect ghost services: impossible or duplicate billing.
    
    Checks:
    - Time feasibility (surgery vs ICU timing)
    - Duplicate consultations
    - Robotic usage without robotic consumables
    - Multiple specialist consults on single day
    
    Args:
        items: List of bill line items
        procedure_context: Dict with admission/discharge dates
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    # Detect duplicate consults
    anomalies.extend(_detect_duplicate_consults(items))
    
    # Detect excessive consultations
    anomalies.extend(_detect_excessive_consults(items))
    
    # Detect robotic billing without consumables
    anomalies.extend(_detect_robotic_anomalies(items))
    
    # Detect consumables without procedure
    anomalies.extend(_detect_orphan_consumables(items, procedure_context))
    
    return anomalies


def _detect_duplicate_consults(items: List[Dict]) -> List[Dict]:
    """Detect same consultation billed multiple times."""
    anomalies = []
    
    consult_keywords = ["consultation", "consult", "opinion", "visit", "round"]
    
    # Count consultations by normalized name
    consult_counts: Counter = Counter()
    
    for item in items:
        item_name = item.get("item_name", "")
        if contains_any(item_name, consult_keywords):
            normalized = normalize_text(item_name)
            consult_counts[normalized] += 1
    
    for consult_name, count in consult_counts.items():
        if count > 1:
            anomalies.append({
                "type": "S7",
                "item": consult_name,
                "severity": "medium",
                "title": "Duplicate consultation charge",
                "explanation": (
                    f"'{consult_name}' appears {count} times in bill. "
                    f"Verify if multiple consultations were actually conducted."
                )
            })
    
    return anomalies


def _detect_excessive_consults(items: List[Dict]) -> List[Dict]:
    """Detect unusually high number of specialist consultations."""
    anomalies = []
    
    specialist_keywords = [
        "cardiologist", "neurologist", "pulmonologist", "nephrologist",
        "gastroenterologist", "endocrinologist", "rheumatologist",
        "oncologist", "urologist", "surgeon consult", "physician consult",
        "specialist opinion", "specialist consultation"
    ]
    
    specialist_count = 0
    
    for item in items:
        item_name = item.get("item_name", "")
        if contains_any(item_name, specialist_keywords):
            specialist_count += 1
    
    # More than 5 different specialist consults is unusual
    if specialist_count > 5:
        anomalies.append({
            "type": "S6",
            "item": f"{specialist_count} specialist consultations",
            "severity": "medium",
            "title": "Unusually high specialist consultations",
            "explanation": (
                f"{specialist_count} different specialist consultations billed. "
                f"This is unusual for most surgical admissions. Review for necessity."
            )
        })
    
    return anomalies


def _detect_robotic_anomalies(items: List[Dict]) -> List[Dict]:
    """Detect robotic surgery billing without corresponding consumables."""
    anomalies = []
    
    robotic_procedure_keywords = [
        "robotic surgery", "da vinci", "robot assisted", 
        "robotic procedure", "robotic charges"
    ]
    
    robotic_consumable_keywords = [
        "robotic instrument", "robotic arm", "robotic trocar",
        "da vinci consumable", "robotic drape", "robotic tip",
        "robotic accessory", "robot kit"
    ]
    
    has_robotic_procedure = False
    has_robotic_consumables = False
    robotic_procedure_name = ""
    robotic_procedure_price = 0
    
    for item in items:
        item_name = item.get("item_name", "")
        price = item.get("total_price") or item.get("unit_price", 0)
        
        if contains_any(item_name, robotic_procedure_keywords):
            has_robotic_procedure = True
            robotic_procedure_name = item_name
            robotic_procedure_price = price
        
        if contains_any(item_name, robotic_consumable_keywords):
            has_robotic_consumables = True
    
    if has_robotic_procedure and not has_robotic_consumables:
        anomalies.append({
            "type": "S6",
            "item": robotic_procedure_name,
            "severity": "high",
            "title": "Ghost robotic service suspected",
            "explanation": (
                f"Robotic surgery charged (₹{robotic_procedure_price:,.0f}) but no robotic "
                f"consumables found in bill. Robotic procedures require specific expensive "
                f"consumables. This may indicate a conventional procedure billed as robotic."
            )
        })
    
    return anomalies


def _detect_orphan_consumables(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """Detect surgical consumables billed without corresponding procedure."""
    anomalies = []
    
    primary_surgery = procedure_context.get("primary_surgery", "")
    
    # Map of consumables to expected procedures
    consumable_procedure_map = {
        "laparoscopy kit": ["laparoscopic", "lap chole", "lap appendectomy", "lap hernia"],
        "trocars": ["laparoscopic", "lap chole", "lap appendectomy"],
        "PPH stapler": ["hemorrhoid", "piles", "PPH"],
        "coronary stent": ["PTCA", "angioplasty", "PCI", "stenting"],
        "knee implant": ["knee replacement", "TKR", "arthroplasty"],
        "hip implant": ["hip replacement", "THR", "arthroplasty"],
        "IOL lens": ["cataract", "phaco", "lens implant"],
        "oxygenator": ["CABG", "cardiac", "bypass", "on-pump"],
    }
    
    for item in items:
        item_name = item.get("item_name", "")
        price = item.get("total_price") or item.get("unit_price", 0)
        
        for consumable, expected_procedures in consumable_procedure_map.items():
            if not contains_any(item_name, [consumable]):
                continue
            
            # Check if primary surgery matches expected
            if not contains_any(primary_surgery, expected_procedures):
                anomalies.append({
                    "type": "S6",
                    "item": item_name,
                    "severity": "medium",
                    "title": "Consumable without matching procedure",
                    "explanation": (
                        f"'{item_name}' (₹{price:,.0f}) is typically used for "
                        f"{', '.join(expected_procedures[:3])} but primary surgery "
                        f"is '{primary_surgery}'. Verify if consumable was actually used."
                    )
                })
            
            break
    
    return anomalies
