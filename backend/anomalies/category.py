# backend/anomalies/category.py

def infer_category(item_name: str) -> str:
    name = item_name.lower()

    # ---- MEDICINES ----
    medicine_keywords = [
        "tablet", "tab", "capsule", "cap", "syrup", "inj",
        "injection", "mg", "ml", "ointment", "cream", "drop"
    ]

    # ---- DIAGNOSTICS ----
    diagnostic_keywords = [
        "test", "scan", "x-ray", "xray", "mri", "ct",
        "ultrasound", "usg", "blood", "urine", "cbc",
        "lft", "kft", "ecg", "echo"
    ]

    # ---- ROOM / STAY ----
    room_keywords = [
        "room", "ward", "bed", "icu", "nicu",
        "day care", "stay", "rent"
    ]

    # ---- PROCEDURES ----
    procedure_keywords = [
        "surgery", "operation", "procedure",
        "stitch", "suturing", "dressing", "catheter"
    ]

    for kw in medicine_keywords:
        if kw in name:
            return "medicine"

    for kw in diagnostic_keywords:
        if kw in name:
            return "diagnostic"

    for kw in room_keywords:
        if kw in name:
            return "room"

    for kw in procedure_keywords:
        if kw in name:
            return "procedure"

    return "other"
