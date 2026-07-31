from fastapi import APIRouter
from ..city_data import get_unified_city_context

router = APIRouter(prefix="/api/city-context", tags=["city-context"])

@router.get("")
def get_city_context(lat: float = 28.6139, lng: float = 77.2090):
    return get_unified_city_context(lat, lng, problem="", payload_data={})
