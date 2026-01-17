# Clinical Consistency Detection
# Validates billing against clinical requirements

from typing import List, Dict
from .utils import load_database, normalize_text, contains_any, extract_numbers


def detect_clinical_inconsistencies(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Detect clinical inconsistencies in billing.
    
    Checks:
    - Toric lens without documented astigmatism
    - SMILE LASIK with flap creation charges
    - Hair transplant graft counts beyond limits
    - Procedure-diagnosis matching
    
    Args:
        items: List of bill line items
        procedure_context: Dict with primary_surgery and diagnosis info
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    primary_surgery = procedure_context.get("primary_surgery", "")
    
    # Check toric lens consistency
    anomalies.extend(_check_toric_lens(items, procedure_context))
    
    # Check SMILE procedure consistency
    anomalies.extend(_check_smile_procedure(items, primary_surgery))
    
    # Check hair transplant graft limits
    anomalies.extend(_check_hair_transplant(items, primary_surgery))
    
    # Check bilateral procedure implant counts
    anomalies.extend(_check_bilateral_implants(items, primary_surgery))
    
    # Check ICU duration appropriateness
    anomalies.extend(_check_icu_duration(items, procedure_context))
    
    return anomalies


def _check_toric_lens(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """Check if toric IOL is billed without astigmatism."""
    anomalies = []
    
    toric_keywords = ["toric", "toric IOL", "toric lens", "astigmatism correcting"]
    
    has_toric = False
    toric_item_name = ""
    toric_price = 0
    
    for item in items:
        item_name = item.get("item_name", "")
        if contains_any(item_name, toric_keywords):
            has_toric = True
            toric_item_name = item_name
            toric_price = item.get("total_price") or item.get("unit_price", 0)
            break
    
    if has_toric:
        # Check if astigmatism is mentioned anywhere in the bill context
        diagnosis = procedure_context.get("diagnosis", "")
        primary_surgery = procedure_context.get("primary_surgery", "")
        
        astigmatism_indicators = ["astigmatism", "H52.2", "cylindrical", "cylinder power"]
        
        has_astigmatism = contains_any(diagnosis, astigmatism_indicators) or \
                         contains_any(primary_surgery, astigmatism_indicators)
        
        # If we can't verify astigmatism, flag for review
        if not has_astigmatism:
            anomalies.append({
                "type": "S8",
                "item": toric_item_name,
                "severity": "medium",
                "title": "Toric IOL without documented astigmatism",
                "explanation": (
                    f"Toric IOL (₹{toric_price:,.0f}) is designed to correct astigmatism. "
                    f"No astigmatism documentation found. Verify patient has >0.75D cylinder."
                )
            })
    
    return anomalies


def _check_smile_procedure(items: List[Dict], primary_surgery: str) -> List[Dict]:
    """Check SMILE procedure for invalid flap-related charges."""
    anomalies = []
    
    smile_keywords = ["SMILE", "small incision lenticule"]
    flap_keywords = ["flap creation", "microkeratome", "keratome blade", "flap", "corneal flap"]
    
    if not contains_any(primary_surgery, smile_keywords):
        return anomalies
    
    for item in items:
        item_name = item.get("item_name", "")
        price = item.get("total_price") or item.get("unit_price", 0)
        
        if contains_any(item_name, flap_keywords):
            anomalies.append({
                "type": "S8",
                "item": item_name,
                "severity": "high",
                "title": "SMILE procedure with flap charges",
                "explanation": (
                    f"SMILE is a flapless procedure - no corneal flap is created. "
                    f"'{item_name}' (₹{price:,.0f}) should not be billed for SMILE surgery."
                )
            })
    
    return anomalies


def _check_hair_transplant(items: List[Dict], primary_surgery: str) -> List[Dict]:
    """Check hair transplant for excessive graft counts."""
    anomalies = []
    
    hair_keywords = ["hair transplant", "FUE", "FUT", "follicular", "graft"]
    
    if not contains_any(primary_surgery, hair_keywords):
        return anomalies
    
    # Look for graft count in items
    for item in items:
        item_name = item.get("item_name", "")
        
        if not contains_any(item_name, ["graft", "follicle", "FUE", "FUT"]):
            continue
        
        # Extract numbers from item name
        numbers = extract_numbers(item_name)
        
        for num in numbers:
            num_int = int(num)
            
            # FUE typically max 5000 grafts, FUT max 6000
            if num_int > 5000:
                anomalies.append({
                    "type": "S10",
                    "item": item_name,
                    "severity": "high",
                    "title": "Hair transplant graft count exceeds clinical limit",
                    "explanation": (
                        f"{num_int} grafts exceeds typical single-session limit. "
                        f"FUE maximum is generally 4000-5000 grafts. Higher counts may indicate "
                        f"multiple sessions billed as one or inflated graft counts."
                    )
                })
            elif num_int > 4000:
                anomalies.append({
                    "type": "S10",
                    "item": item_name,
                    "severity": "medium",
                    "title": "High hair transplant graft count",
                    "explanation": (
                        f"{num_int} grafts is at the upper limit of single-session hair transplant. "
                        f"Verify this count is accurate and clinically appropriate."
                    )
                })
    
    return anomalies


def _check_bilateral_implants(items: List[Dict], primary_surgery: str) -> List[Dict]:
    """Check that bilateral procedures have correct implant counts."""
    anomalies = []
    
    bilateral_keywords = ["bilateral", "both", "b/l", "double"]
    
    is_bilateral = contains_any(primary_surgery, bilateral_keywords)
    
    if not is_bilateral:
        return anomalies
    
    # Count implants
    implant_keywords = ["implant", "prosthesis", "IOL", "lens"]
    implant_count = 0
    
    for item in items:
        item_name = item.get("item_name", "")
        qty = item.get("quantity", 1) or 1
        
        if contains_any(item_name, implant_keywords):
            implant_count += qty
    
    if implant_count == 1:
        anomalies.append({
            "type": "S8",
            "item": primary_surgery,
            "severity": "high",
            "title": "Bilateral procedure with single implant",
            "explanation": (
                f"Bilateral procedure '{primary_surgery}' requires 2 implants, "
                f"but only 1 implant found in bill. Verify if second side was operated."
            )
        })
    
    return anomalies


def _check_icu_duration(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """Check if ICU duration is appropriate for procedure complexity."""
    anomalies = []
    
    primary_surgery = procedure_context.get("primary_surgery", "")
    
    # Count ICU days from items
    icu_keywords = ["ICU", "intensive care", "ICCU", "HDU"]
    icu_days = 0
    
    for item in items:
        item_name = item.get("item_name", "")
        qty = item.get("quantity", 1) or 1
        
        if contains_any(item_name, icu_keywords):
            # Assume each line item is one day or use quantity
            icu_days += qty
    
    if icu_days == 0:
        return anomalies
    
    # Determine expected ICU based on procedure
    minor_procedures = ["cataract", "hernia", "appendectomy", "hemorrhoid", "piles", "LASIK", "SMILE"]
    major_procedures = ["CABG", "cardiac", "bypass", "valve replacement", "spine", "brain"]
    
    if contains_any(primary_surgery, minor_procedures) and icu_days > 1:
        anomalies.append({
            "type": "S8",
            "item": f"ICU - {icu_days} days",
            "severity": "medium",
            "title": "ICU for minor procedure",
            "explanation": (
                f"Minor procedure '{primary_surgery}' typically doesn't require ICU. "
                f"{icu_days} ICU days billed. Verify medical necessity."
            )
        })
    
    elif contains_any(primary_surgery, major_procedures) and icu_days > 10:
        anomalies.append({
            "type": "S8",
            "item": f"ICU - {icu_days} days",
            "severity": "medium",
            "title": "Prolonged ICU stay",
            "explanation": (
                f"{icu_days} ICU days is prolonged even for major surgery. "
                f"Review for complications or billing accuracy."
            )
        })
    
    return anomalies
