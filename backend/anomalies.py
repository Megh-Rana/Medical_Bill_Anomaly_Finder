from typing import List, Dict

def detect_anomalies(items: List[Dict]) -> List[Dict]:
    anomalies = []

    seen_items = {}

    for item in items:
        name = item.get("item_name", "").strip()
        qty = item.get("quantity")
        unit = item.get("unit_price")
        total = item.get("total_price")
        category = item.get("category")

        # ---------- S1: Missing critical fields ----------
        if not name or qty is None or total is None:
            anomalies.append({
                "type": "S1",
                "item": name or "Unknown",
                "severity": "info",
                "title": "Missing billing data",
                "explanation": "One or more required fields are missing."
            })
            continue

        # ---------- A1: Arithmetic mismatch ----------
        if unit is not None and qty is not None:
            calculated = qty * unit
            if calculated > 0:
                delta = abs(calculated - total) / calculated

                if delta > 0.05:
                    severity = (
                        "high" if delta > 0.5 else
                        "medium" if delta > 0.2 else
                        "low"
                    )
                    anomalies.append({
                        "type": "A1",
                        "item": name,
                        "severity": severity,
                        "title": "Total mismatch",
                        "explanation": (
                            f"Calculated ₹{calculated:.2f}, "
                            f"billed ₹{total:.2f}. "
                            "Possible discount, package pricing, or override."
                        )
                    })

        # ---------- A2: Zero or invalid unit price ----------
        if unit == 0 and total > 0:
            anomalies.append({
                "type": "A2",
                "item": name,
                "severity": "medium",
                "title": "Zero unit price",
                "explanation": "Unit price is zero but total is non-zero."
            })

        # ---------- D1: Exact duplicates ----------
        key = (name.lower(), unit, total)
        if key in seen_items:
            anomalies.append({
                "type": "D1",
                "item": name,
                "severity": "medium",
                "title": "Duplicate charge",
                "explanation": "Same item appears multiple times with identical pricing."
            })
        else:
            seen_items[key] = True

        # ---------- C1: Category mismatch (basic heuristics) ----------
        lname = name.lower()
        if category == "medicine" and any(x in lname for x in ["room", "bed", "ward"]):
            anomalies.append({
                "type": "C1",
                "item": name,
                "severity": "low",
                "title": "Category mismatch",
                "explanation": "Item appears to be a room or service charge."
            })

        if category == "diagnostic" and any(x in lname for x in ["tablet", "capsule", "syrup"]):
            anomalies.append({
                "type": "C1",
                "item": name,
                "severity": "low",
                "title": "Category mismatch",
                "explanation": "Item appears to be a medicine."
            })

        # ---------- T1: Duration heuristics ----------
        if "day" in lname or "room" in lname:
            if qty and qty > 30:
                anomalies.append({
                    "type": "T1",
                    "item": name,
                    "severity": "medium",
                    "title": "Unusual duration",
                    "explanation": "Number of billed days appears unusually high."
                })

    return anomalies
