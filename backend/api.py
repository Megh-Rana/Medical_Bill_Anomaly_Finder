from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

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
    category: Optional[str]

class AnalyzeRequest(BaseModel):
    items: List[BillItem]

@app.post("/analyze")
def analyze_bill(payload: AnalyzeRequest):
    return {
        "classified_items": payload.items,
        "anomalies": []
    }
