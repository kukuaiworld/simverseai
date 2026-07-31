import requests
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/weather", tags=["weather"])

@router.get("")
def get_live_weather(lat: float = 28.6139, lng: float = 77.2090):
    try:
        # Calls Open-Meteo public forecast API requiring no private access tokens
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            current = data.get("current_weather", {})
            return {
                "status": "success",
                "temperature": current.get("temperature", 24.5),
                "windspeed": current.get("windspeed", 12.0),
                "winddirection": current.get("winddirection", 180),
                "weathercode": current.get("weathercode", 0)
            }
        else:
            raise HTTPException(status_code=response.status_code, detail="Weather provider error.")
    except Exception as e:
        # Return elegant default state on fetch failures
        return {
            "status": "fallback",
            "temperature": 26.0,
            "windspeed": 10.5,
            "winddirection": 150,
            "weathercode": 1
        }
