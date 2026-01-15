# backend/api.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

from anomalies.engine import detect_all_anomalies
from anomalies.category import infer_category

# Global variable to store medicine database
MEDICINE_DB = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class BillItem(BaseModel):
    item_name: str
    quantity: Optional[float]
    unit_price: Optional[float]
    total_price: Optional[float]
    category: Optional[str] = None

class AnalyzeRequest(BaseModel):
    items: List[BillItem]

@app.post("/analyze")
def analyze_bill(payload: AnalyzeRequest):
    items = [item.dict() for item in payload.items]

    # 🔹 Categorise here (single source of truth)
    for item in items:
        item["category"] = infer_category(item["item_name"])

    anomalies = detect_all_anomalies(items)

    return {
        "classified_items": items,
        "anomalies": anomalies
    }

@app.on_event("startup")
def load_medicine_data():
    """
    Load medicine database into memory on startup.
    """
    global MEDICINE_DB
    file_path = os.path.join(os.path.dirname(__file__), "data", "medicine_database.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            MEDICINE_DB = json.load(f)
        print(f"✅ Loaded {len(MEDICINE_DB)} medicines into memory.")
    else:
        print(f"⚠️ Warning: {file_path} not found. Autocomplete will be empty.")

@app.get("/medicines/search")
def search_medicines(q: str = ""):
    """
    Search for medicines by name. Returns top 20 matches.
    Prioritizes medicines that start with query over those that contain it.
    Case-insensitive substring search.
    """
    if not q or len(q) < 2:
        return []
    
    query = q.lower()
    starts_with = []
    contains = []
    
    for key, val in MEDICINE_DB.items():
        if key.startswith(query):
            starts_with.append(val["name"])
            if len(starts_with) >= 20:
                break
        elif query in key:
            contains.append(val["name"])
    
    # Combine: starts-with results first, then contains results
    results = starts_with + contains
    return results[:20]
