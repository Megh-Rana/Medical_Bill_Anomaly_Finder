# backend/anomalies/engine.py

from .category import infer_category
from .arithmetic import detect_arithmetic_anomalies
from .duplicates import detect_duplicate_anomalies
from .mrp import detect_mrp_anomalies

def detect_all_anomalies(items):
    anomalies = []

    # 🔹 Ensure every item has a category
    for item in items:
        if not item.get("category"):
            item["category"] = infer_category(item.get("item_name", ""))

    anomalies.extend(detect_arithmetic_anomalies(items))
    anomalies.extend(detect_duplicate_anomalies(items))
    anomalies.extend(detect_mrp_anomalies(items))

    return anomalies
