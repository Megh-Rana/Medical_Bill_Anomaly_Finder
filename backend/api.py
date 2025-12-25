# backend/api.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from anomalies.engine import detect_all_anomalies
from anomalies.category import infer_category

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
