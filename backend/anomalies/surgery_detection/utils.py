# Surgery anomaly detection utilities
import json
import os
import re
from difflib import SequenceMatcher
from typing import Dict, List, Optional, Any

# Data directory path - go up from surgery_detection -> anomalies -> backend, then into data/surgery
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "surgery")

# Cache for loaded databases
_db_cache: Dict[str, Any] = {}

def load_database(db_name: str) -> Dict:
    """Load a JSON database file, with caching."""
    if db_name in _db_cache:
        return _db_cache[db_name]
    
    file_path = os.path.join(DATA_DIR, f"{db_name}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            _db_cache[db_name] = json.load(f)
        return _db_cache[db_name]
    return {}

def normalize_text(text: str) -> str:
    """Normalize text for matching: lowercase, remove special chars, collapse spaces."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def fuzzy_match(text: str, patterns: List[str], threshold: float = 0.75) -> bool:
    """Check if text matches any pattern using fuzzy matching."""
    normalized = normalize_text(text)
    
    for pattern in patterns:
        norm_pattern = normalize_text(pattern)
        
        # Exact containment
        if norm_pattern in normalized or normalized in norm_pattern:
            return True
        
        # Fuzzy matching
        ratio = SequenceMatcher(None, normalized, norm_pattern).ratio()
        if ratio >= threshold:
            return True
    
    return False

def contains_any(text: str, keywords: List[str]) -> bool:
    """Check if normalized text contains any of the keywords."""
    normalized = normalize_text(text)
    for keyword in keywords:
        if normalize_text(keyword) in normalized:
            return True
    return False

def get_city_tier(city: str) -> str:
    """Determine the tier of a city based on pricing tiers database."""
    pricing_tiers = load_database("pricing_tiers")
    tier_defs = pricing_tiers.get("tier_definitions", {})
    
    city_lower = city.lower().strip()
    
    for tier_name, tier_data in tier_defs.items():
        cities = [c.lower() for c in tier_data.get("cities", [])]
        if city_lower in cities:
            return tier_name
    
    # Default to tier3 for unknown cities
    return "tier3"

def get_tier_multiplier(city: str) -> float:
    """Get the price multiplier for a city's tier."""
    pricing_tiers = load_database("pricing_tiers")
    tier_defs = pricing_tiers.get("tier_definitions", {})
    
    tier = get_city_tier(city)
    return tier_defs.get(tier, {}).get("multiplier", 0.6)

def get_accreditation_premium(accreditation: str) -> float:
    """Get the accreditation premium percentage."""
    pricing_tiers = load_database("pricing_tiers")
    premiums = pricing_tiers.get("accreditation_premiums", {})
    
    accred_lower = accreditation.lower().strip() if accreditation else "none"
    return premiums.get(accred_lower, {}).get("premium_percent", 0) / 100

def find_procedure(surgery_name: str) -> Optional[Dict]:
    """Find a procedure in the database by name or alias."""
    procedures = load_database("procedure_database").get("procedures", [])
    normalized = normalize_text(surgery_name)
    
    for proc in procedures:
        # Check main name
        if normalize_text(proc["name"]) in normalized or normalized in normalize_text(proc["name"]):
            return proc
        
        # Check aliases
        for alias in proc.get("aliases", []):
            if normalize_text(alias) in normalized or normalized in normalize_text(alias):
                return proc
    
    return None

def extract_numbers(text: str) -> List[float]:
    """Extract all numbers from text."""
    if not text:
        return []
    return [float(x) for x in re.findall(r"\d+(?:\.\d+)?", str(text))]
