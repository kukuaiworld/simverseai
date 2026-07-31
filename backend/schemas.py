from pydantic import BaseModel, Field
from typing import List, Optional

class SimulationCreate(BaseModel):
    problem: str
    title: Optional[str] = "Downtown Traffic Optimization"
    category: Optional[str] = "Traffic Management"
    location: Optional[str] = "Central Station District"
    priority: Optional[str] = "high"
    latitude: Optional[float] = 28.6139
    longitude: Optional[float] = 77.2090
    
    # Optional constraints
    budget_limit: Optional[str] = None
    timeline: Optional[str] = None
    population_affected: Optional[str] = None
    weather_condition: Optional[str] = None
    additional_notes: Optional[str] = None
    uploaded_files: Optional[List[str]] = None

class ScenarioOut(BaseModel):
    id: str
    name: str
    type: str
    description: str
    metrics: dict
    confidenceMeter: int
    pros: List[str]
    cons: List[str]
    timeline: List[dict] = []
    policyChanges: List[str] = []
    riskMitigation: List[dict] = []
    
    decision_score: Optional[float] = None
    decision_score_explanation: Optional[str] = None
    confidence_reasoning: Optional[str] = None
    factors_breakdown: Optional[dict] = None

    class Config:
        from_attributes = True

class SimulationResponse(BaseModel):
    scenarios: List[ScenarioOut]
    source: str
    city_context: Optional[dict] = None
    decision_calculations: Optional[dict] = None
    executive_report: Optional[str] = None
