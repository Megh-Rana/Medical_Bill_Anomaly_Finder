# backend/anomalies/category.py

def infer_category(item_name: str) -> str:
    name = item_name.lower()

    # ---- IMPLANTS ----
    implant_keywords = [
        "stent", "implant", "prosthesis", "iol", "lens implant",
        "knee implant", "hip implant", "pacemaker", "mesh"
    ]

    # ---- SURGICAL CONSUMABLES ----
    surgical_consumable_keywords = [
        "trocar", "stapler", "suture", "catheter", "cannula",
        "oxygenator", "guide wire", "balloon", "laser fiber",
        "laparoscopy kit", "robotic", "energy device"
    ]

    # ---- MEDICINES ----
    medicine_keywords = [
        "tablet", "tab", "capsule", "cap", "syrup", "inj",
        "injection", "mg", "ml", "ointment", "cream", "drop"
    ]

    # ---- DIAGNOSTICS ----
    diagnostic_keywords = [
        "test", "scan", "x-ray", "xray", "mri", "ct",
        "ultrasound", "usg", "blood", "urine", "cbc",
        "lft", "kft", "ecg", "echo", "angiography"
    ]

    # ---- ROOM / STAY ----
    room_keywords = [
        "room", "ward", "bed", "icu", "nicu",
        "day care", "stay", "rent", "iccu", "hdu"
    ]

    # ---- PROCEDURES / SURGERIES ----
    procedure_keywords = [
        "surgery", "operation", "procedure", "laparoscopic",
        "stitch", "suturing", "dressing", "catheter",
        "cabg", "ptca", "angioplasty", "cholecystectomy",
        "appendectomy", "hysterectomy", "arthroplasty",
        "replacement", "hernia repair", "cataract", "lasik"
    ]

    # ---- CONSULTATION ----
    consultation_keywords = [
        "consultation", "consult", "opinion", "visit", "round"
    ]

    # Check in order of specificity
    for kw in implant_keywords:
        if kw in name:
            return "implant"

    for kw in surgical_consumable_keywords:
        if kw in name:
            return "surgical_consumable"

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

    for kw in consultation_keywords:
        if kw in name:
            return "consultation"

    return "other"

