import json
import os

MRP_FILE = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "mrp_reference.json"
)

with open(MRP_FILE, "r") as f:
    MRP_DATA = json.load(f)

# Upper bound tolerance (hospital markup etc.)
MRP_MULTIPLIER = 1.5  # 150% of MRP


def detect_mrp_anomalies(items):
    anomalies = []

    for item in items:
        name = item.get("item_name", "").lower().strip()
        qty = item.get("quantity")
        unit = item.get("unit_price")
        category = item.get("category")

        if category != "medicine":
            continue

        if not unit or not qty:
            continue

        # Try direct match
        for ref_name, mrp in MRP_DATA.items():
            if ref_name in name:
                max_allowed = mrp * MRP_MULTIPLIER

                if unit > max_allowed:
                    anomalies.append({
                        "type": "A3",
                        "item": item.get("item_name"),
                        "severity": "high",
                        "title": "Price above MRP",
                        "explanation": (
                            f"Unit price ₹{unit} exceeds allowed "
                            f"₹{max_allowed:.2f} (MRP ₹{mrp})"
                        )
                    })
                break

    return anomalies
