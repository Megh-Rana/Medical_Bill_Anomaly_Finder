def detect_duplicate_anomalies(items):
    anomalies = []
    seen = set()

    for item in items:
        key = (
            item.get("item_name", "").lower(),
            item.get("unit_price"),
            item.get("total_price")
        )

        if key in seen:
            anomalies.append({
                "type": "D1",
                "item": item.get("item_name"),
                "severity": "medium",
                "title": "Duplicate charge",
                "explanation": "Same item billed multiple times."
            })
        else:
            seen.add(key)

    return anomalies