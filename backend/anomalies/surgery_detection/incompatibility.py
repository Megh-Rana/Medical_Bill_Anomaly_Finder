# Incompatible Billing Detection
# Detects mutually exclusive items billed together

from typing import List, Dict, Set, Tuple
from .utils import load_database, normalize_text, contains_any


def detect_incompatible_billing(items: List[Dict]) -> List[Dict]:
    """
    Detect mutually exclusive billing combinations.
    
    Examples:
    - Laser piles surgery + stapler gun (can't use both)
    - Laparoscopic surgery + open surgery retractors
    - Off-pump CABG + oxygenator/perfusionist
    
    Args:
        items: List of bill line items
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    incompatibility_data = load_database("incompatibility_matrix")
    incompatible_pairs = incompatibility_data.get("incompatible_pairs", [])
    
    # Extract all item names from bill
    item_names = [item.get("item_name", "") for item in items if item.get("item_name")]
    
    # Track found violations to avoid duplicates
    found_violations: Set[Tuple[str, str]] = set()
    
    for pair in incompatible_pairs:
        item1_patterns = pair.get("item1_patterns", [])
        item2_patterns = pair.get("item2_patterns", [])
        reason = pair.get("reason", "Mutually exclusive items billed together")
        severity = pair.get("severity", "high")
        
        # Find matches for both pattern groups
        match1 = _find_matching_item(item_names, item1_patterns)
        match2 = _find_matching_item(item_names, item2_patterns)
        
        if match1 and match2:
            # Create a canonical key to avoid duplicate reports
            violation_key = tuple(sorted([match1, match2]))
            
            if violation_key not in found_violations:
                found_violations.add(violation_key)
                
                anomalies.append({
                    "type": "S3",
                    "item": f"{match1} + {match2}",
                    "severity": severity,
                    "title": "Incompatible billing combination",
                    "explanation": reason
                })
    
    return anomalies


def _find_matching_item(item_names: List[str], patterns: List[str]) -> str:
    """Find the first item that matches any pattern."""
    for item_name in item_names:
        if contains_any(item_name, patterns):
            return item_name
    return ""
