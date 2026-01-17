# backend/api.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

from anomalies.engine import detect_all_anomalies
from anomalies.category import infer_category
from anomalies.surgery_detection import detect_surgery_anomalies

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
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None
    category: Optional[str] = None

class AnalyzeRequest(BaseModel):
    items: List[BillItem]
    # Hospital context fields (optional for backward compatibility)
    hospital_name: Optional[str] = None
    hospital_city: Optional[str] = None
    hospital_accreditation: Optional[str] = "none"  # nabh/jci/none
    primary_surgery: Optional[str] = None
    room_category: Optional[str] = None
    bill_type: Optional[str] = "medicine"  # medicine or surgery

@app.post("/analyze")
def analyze_bill(payload: AnalyzeRequest):
    items = [item.dict() for item in payload.items]

    # Categorise items
    for item in items:
        item["category"] = infer_category(item["item_name"])

    # Run medicine anomaly detection
    anomalies = detect_all_anomalies(items)

    # If surgery context is provided, also run surgery detection
    if payload.bill_type == "surgery" and payload.primary_surgery:
        procedure_context = {
            "primary_surgery": payload.primary_surgery,
            "hospital_city": payload.hospital_city or "",
            "hospital_name": payload.hospital_name or "",
            "hospital_accreditation": payload.hospital_accreditation or "none",
            "room_category": payload.room_category or "",
        }
        surgery_anomalies = detect_surgery_anomalies(items, procedure_context)
        anomalies.extend(surgery_anomalies)

    return {
        "classified_items": items,
        "anomalies": anomalies
    }

@app.post("/analyze/surgery")
def analyze_surgery_bill(payload: AnalyzeRequest):
    """
    Endpoint specifically for surgery bill analysis.
    Requires primary_surgery and hospital_city for full detection.
    """
    items = [item.dict() for item in payload.items]

    # Categorise items
    for item in items:
        item["category"] = infer_category(item["item_name"])

    # Build procedure context
    procedure_context = {
        "primary_surgery": payload.primary_surgery or "",
        "hospital_city": payload.hospital_city or "",
        "hospital_name": payload.hospital_name or "",
        "hospital_accreditation": payload.hospital_accreditation or "none",
        "room_category": payload.room_category or "",
    }

    # Run both medicine and surgery detection
    anomalies = detect_all_anomalies(items)
    
    if payload.primary_surgery:
        surgery_anomalies = detect_surgery_anomalies(items, procedure_context)
        anomalies.extend(surgery_anomalies)

    # Sort by severity
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    anomalies.sort(key=lambda x: severity_order.get(x.get("severity", "low"), 3))

    return {
        "classified_items": items,
        "anomalies": anomalies,
        "procedure_context": procedure_context
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

@app.get("/cities")
def get_cities():
    """
    Get list of cities organized by tier for the frontend dropdown.
    """
    try:
        file_path = os.path.join(os.path.dirname(__file__), "data", "surgery", "pricing_tiers.json")
        with open(file_path, "r", encoding="utf-8") as f:
            pricing_data = json.load(f)
        
        tier_defs = pricing_data.get("tier_definitions", {})
        cities = []
        
        for tier_name, tier_data in tier_defs.items():
            tier_cities = tier_data.get("cities", [])
            if "_default" not in tier_cities:
                cities.extend(tier_cities)
        
        return sorted(set(cities))
    except Exception as e:
        print(f"Error loading cities: {e}")
        return []

