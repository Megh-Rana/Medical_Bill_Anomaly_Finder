# Surgery Detection Module
from .surgery_engine import detect_surgery_anomalies
from .price_band import detect_price_band_violations
from .unbundling import detect_unbundling_fraud
from .incompatibility import detect_incompatible_billing
from .implant_validator import detect_implant_abuse
from .ghost_services import detect_ghost_services
from .clinical_consistency import detect_clinical_inconsistencies

__all__ = [
    'detect_surgery_anomalies',
    'detect_price_band_violations',
    'detect_unbundling_fraud',
    'detect_incompatible_billing',
    'detect_implant_abuse',
    'detect_ghost_services',
    'detect_clinical_inconsistencies'
]
