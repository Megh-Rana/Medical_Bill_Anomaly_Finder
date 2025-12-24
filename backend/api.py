from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BillItem(BaseModel):
    item_name: str
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None

@app.post("/analyze")
def analyze_bill(items: List[BillItem]):
    anomalies = []

    for item in items:
        # dummy logic for now
        if item.unit_price and item.unit_price > 10:
            anomalies.append({
                "item": item.item_name,
                "issue": "Price above reference",
                "severity": "high",
                "explanation": "Charged price exceeds typical reference value"
            })

    return {
        "classified_items": items,
        "anomalies": anomalies
    }
