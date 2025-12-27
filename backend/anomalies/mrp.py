import json
import re
from difflib import SequenceMatcher

# ---------- helpers ----------

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_numbers(text: str):
    return set(re.findall(r"\d+(?:\.\d+)?", text))

# ---------- load DB once ----------

with open("data/medicine_database.json", "r", encoding="utf-8") as f:
    RAW_DB = json.load(f)

MRP_DB = {}
BRAND_INDEX = {}

for _, val in RAW_DB.items():
    name = val["name"]
    price = val["price"]

    norm = normalize(name)
    nums = extract_numbers(norm)

    MRP_DB[norm] = {
        "price": price,
        "numbers": nums
    }

    brand = norm.split()[0]
    BRAND_INDEX.setdefault(brand, []).append(norm)

# ---------- matching ----------

def find_mrp(item_name: str):
    norm = normalize(item_name)
    nums = extract_numbers(norm)

    # Tier 1: exact
    if norm in MRP_DB:
        return MRP_DB[norm]["price"]

    brand = norm.split()[0]
    candidates = BRAND_INDEX.get(brand, [])

    # Tier 2: numeric-safe containment
    for c in candidates:
        db_nums = MRP_DB[c]["numbers"]

        # combo drug → subset allowed
        if len(db_nums) > 1:
            if not nums.issubset(db_nums):
                continue
        # single drug → exact match
        else:
            if nums != db_nums:
                continue

        if all(tok in c for tok in norm.split()):
            return MRP_DB[c]["price"]


    # Tier 3: guarded fuzzy
    best_score = 0
    best_price = None

    for c in candidates:
        if nums != MRP_DB[c]["numbers"]:
            continue

        score = SequenceMatcher(None, norm, c).ratio()
        if score > best_score:
            best_score = score
            best_price = MRP_DB[c]["price"]

    if best_score > 0.9:
        return best_price

    return None

# ---------- anomaly ----------

def detect_mrp_anomalies(items):
    anomalies = []

    for item in items:
        name = item.get("item_name")
        unit_price = item.get("unit_price")

        if not name or not unit_price:
            continue

        mrp = find_mrp(name)
        if not mrp:
            continue

        if unit_price > mrp * 1.05:
            anomalies.append({
                "type": "A3",
                "item": name,
                "severity": "high",
                "title": "Price above MRP",
                "explanation": (
                    f"Unit price ₹{unit_price} exceeds allowed ₹{mrp}"
                )
            })

    return anomalies
