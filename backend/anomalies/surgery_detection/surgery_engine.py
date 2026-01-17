# Surgery Anomaly Detection Engine
# Main orchestrator for all surgery-related anomaly detection modules

from typing import List, Dict, Optional
from .price_band import detect_price_band_violations
from .unbundling import detect_unbundling_fraud
from .incompatibility import detect_incompatible_billing
from .implant_validator import detect_implant_abuse
from .ghost_services import detect_ghost_services
from .clinical_consistency import detect_clinical_inconsistencies


def detect_surgery_anomalies(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Main entry point for surgery anomaly detection.
    Orchestrates all detection modules and aggregates results.
    
    Args:
        items: List of bill line items, each with:
            - item_name: str
            - quantity: Optional[float]
            - unit_price: Optional[float]
            - total_price: Optional[float]
            - category: Optional[str]
        
        procedure_context: Dict with:
            - primary_surgery: str (required)
            - hospital_city: str (required for price band checks)
            - hospital_name: str (optional)
            - hospital_accreditation: str (nabh/jci/none, default: none)
            - room_category: str (optional)
            - admission_date: str (optional, ISO format)
            - discharge_date: str (optional, ISO format)
            - diagnosis: str (optional)
    
    Returns:
        List of anomaly dictionaries, each with:
            - type: str (S1-S10)
            - item: str
            - severity: str (low/medium/high/critical)
            - title: str
            - explanation: str
    """
    anomalies = []
    
    # Validate required context
    if not procedure_context.get("primary_surgery"):
        return anomalies
    
    # Set defaults
    if "hospital_accreditation" not in procedure_context:
        procedure_context["hospital_accreditation"] = "none"
    
    # Run all detection modules
    try:
        # S1: Price Band Violations
        anomalies.extend(detect_price_band_violations(items, procedure_context))
    except Exception as e:
        print(f"Warning: Price band detection failed: {e}")
    
    try:
        # S2: Unbundling Fraud
        anomalies.extend(detect_unbundling_fraud(items, procedure_context))
    except Exception as e:
        print(f"Warning: Unbundling detection failed: {e}")
    
    try:
        # S3: Incompatible Billing
        anomalies.extend(detect_incompatible_billing(items))
    except Exception as e:
        print(f"Warning: Incompatibility detection failed: {e}")
    
    try:
        # S4, S5: Implant Abuse
        anomalies.extend(detect_implant_abuse(items, procedure_context))
    except Exception as e:
        print(f"Warning: Implant validation failed: {e}")
    
    try:
        # S6, S7, S9: Ghost Services
        anomalies.extend(detect_ghost_services(items, procedure_context))
    except Exception as e:
        print(f"Warning: Ghost service detection failed: {e}")
    
    try:
        # S8, S10: Clinical Inconsistencies
        anomalies.extend(detect_clinical_inconsistencies(items, procedure_context))
    except Exception as e:
        print(f"Warning: Clinical consistency check failed: {e}")
    
    # Sort anomalies by severity
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    anomalies.sort(key=lambda x: severity_order.get(x.get("severity", "low"), 3))
    
    return anomalies


def get_anomaly_summary(anomalies: List[Dict]) -> Dict:
    """
    Generate a summary of detected anomalies.
    
    Args:
        anomalies: List of anomaly dictionaries
    
    Returns:
        Summary dict with counts by type and severity
    """
    summary = {
        "total_count": len(anomalies),
        "by_severity": {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        },
        "by_type": {}
    }
    
    anomaly_type_names = {
        "S1": "Price Band Violation",
        "S2": "Unbundling Fraud",
        "S3": "Incompatible Billing",
        "S4": "Implant Price Cap Violation",
        "S5": "Room-Based Implant Markup",
        "S6": "Ghost Service",
        "S7": "Duplicate Consult",
        "S8": "Clinical Inconsistency",
        "S9": "Missing Robotic Consumable",
        "S10": "Graft Count Violation"
    }
    
    for anomaly in anomalies:
        severity = anomaly.get("severity", "low")
        anomaly_type = anomaly.get("type", "unknown")
        
        summary["by_severity"][severity] = summary["by_severity"].get(severity, 0) + 1
        
        type_name = anomaly_type_names.get(anomaly_type, anomaly_type)
        summary["by_type"][type_name] = summary["by_type"].get(type_name, 0) + 1
    
    return summary
