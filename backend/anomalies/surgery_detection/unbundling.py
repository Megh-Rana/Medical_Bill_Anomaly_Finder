# Unbundling Fraud Detection
# Detects items charged separately that should be included in surgery packages

from typing import List, Dict
from .utils import load_database, normalize_text, contains_any


def detect_unbundling_fraud(items: List[Dict], procedure_context: Dict) -> List[Dict]:
    """
    Detect unbundling fraud: charging package surgery PLUS separate consumables.
    
    Args:
        items: List of bill line items
        procedure_context: Dict with primary_surgery key
    
    Returns:
        List of anomaly dictionaries
    """
    anomalies = []
    
    primary_surgery = procedure_context.get("primary_surgery", "")
    if not primary_surgery:
        return anomalies
    
    bundling_rules = load_database("bundling_rules").get("bundling_rules", {})
    
    # Find applicable bundling rule
    applicable_rule = None
    rule_name = None
    
    for rule_key, rule_data in bundling_rules.items():
        applies_to = rule_data.get("applies_to", [])
        if contains_any(primary_surgery, applies_to):
            applicable_rule = rule_data
            rule_name = rule_key
            break
    
    if not applicable_rule:
        return anomalies
    
    # Check if bill has a package charge
    has_package = _has_package_charge(items, primary_surgery)
    
    if not has_package:
        # No package detected, unbundling check not applicable
        return anomalies
    
    # Get bundled items that should not be charged separately
    bundled_items = applicable_rule.get("bundled_items", [])
    alert_message = applicable_rule.get("alert_message", "Item typically included in package")
    severity = applicable_rule.get("severity", "high")
    
    # Track found unbundled items to avoid duplicates
    found_unbundled = set()
    
    for item in items:
        item_name = item.get("item_name", "")
        total_price = item.get("total_price") or item.get("unit_price", 0)
        
        if not item_name or not total_price:
            continue
        
        # Skip the package itself
        if _is_package_item(item_name):
            continue
        
        # Check if item should be bundled
        for bundled_item in bundled_items:
            if contains_any(item_name, [bundled_item]):
                normalized_bundled = normalize_text(bundled_item)
                
                if normalized_bundled not in found_unbundled:
                    found_unbundled.add(normalized_bundled)
                    
                    anomalies.append({
                        "type": "S2",
                        "item": item_name,
                        "severity": severity,
                        "title": "Possible unbundling fraud",
                        "explanation": (
                            f"{alert_message}. '{item_name}' (₹{total_price:,.0f}) "
                            f"is typically included in {rule_name.replace('_', ' ')} package."
                        )
                    })
                break
    
    return anomalies


def _has_package_charge(items: List[Dict], primary_surgery: str) -> bool:
    """Check if bill contains a surgery package charge."""
    package_keywords = [
        "package", "surgery charges", "procedure charges", "operation charges",
        "surgical package", "all inclusive", "bundled", "procedure package"
    ]
    
    surgery_normalized = normalize_text(primary_surgery)
    
    for item in items:
        item_name = item.get("item_name", "")
        total_price = item.get("total_price") or item.get("unit_price", 0)
        
        if not total_price or total_price < 5000:  # Packages are usually substantial
            continue
        
        # Check for package keywords
        if contains_any(item_name, package_keywords):
            return True
        
        # Check if surgery name is in item name (indicating main procedure charge)
        if surgery_normalized in normalize_text(item_name):
            return True
    
    return False


def _is_package_item(item_name: str) -> bool:
    """Check if item is the main package/surgery charge."""
    package_indicators = [
        "package", "surgery", "procedure", "operation",
        "package charge", "total charges"
    ]
    return contains_any(item_name, package_indicators)
