import json
import re

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_numbers(text: str):
    return set(re.findall(r"\d+(?:\.\d+)?", text))

with open("data/tata_1mg_mrp.json", "r", encoding="utf-8") as f:
    RAW_DB = json.load(f)

MRP_DB = {}
BRAND_INDEX = {}

for key, val in RAW_DB.items():
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
