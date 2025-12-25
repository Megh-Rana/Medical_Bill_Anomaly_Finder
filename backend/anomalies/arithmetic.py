def detect_arithmetic_anomalies(items):
    anomalies = []

    for item in items:
        name = item.get("item_name", "")
        qty = item.get("quantity")
        unit = item.get("unit_price")
        total = item.get("total_price")
        category = item.get("category")  # ✅ THIS WAS MISSING

        if qty is None or unit is None or total is None:
            continue

        calculated = qty * unit
        if calculated <= 0:
            continue

        delta = abs(calculated - total) / calculated

        # ---------- A1: Arithmetic mismatch ----------
        if delta > 0.05:
            anomalies.append({
                "type": "A1",
                "item": name,
                "severity": "low",
                "title": "Total mismatch",
                "explanation": (
                    f"Calculated ₹{calculated:.2f}, billed ₹{total:.2f}"
                )
            })

        # ---------- Q1: Unusually high quantity ----------
        if category == "medicine" and qty > 100:
            anomalies.append({
                "type": "Q1",
                "item": name,
                "severity": "high",
                "title": "Unusually high quantity",
                "explanation": f"{qty} units billed for a medicine item."
            })

    return anomalies
