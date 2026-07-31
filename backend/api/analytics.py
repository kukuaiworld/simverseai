from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Simulation, Scenario

import datetime

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("")
def get_analytics(db: Session = Depends(get_db)):
    total_simulations = db.query(Simulation).count()
    total_scenarios = db.query(Scenario).count()
    
    avg_score_query = db.query(func.avg(Scenario.decision_score)).scalar()
    avg_score = round(float(avg_score_query), 1) if avg_score_query is not None else None
    
    avg_sustain_query = db.query(func.avg(Scenario.sustainability_score)).scalar()
    avg_sustain = int(avg_sustain_query) if avg_sustain_query is not None else None
    
    critical_alerts = db.query(Simulation).filter(Simulation.priority == "critical").count()
        
    recent_simulations = db.query(Simulation).order_by(Simulation.created_at.desc()).limit(5).all()
    
    logs = []
    for sim in recent_simulations:
        scen_count = db.query(Scenario).filter(Scenario.simulation_id == sim.id).count()
        logs.append({
            "id": sim.id,
            "title": sim.title or "Downtown Corridor Gridlock",
            "category": sim.category or "Traffic Control",
            "location": sim.location or "Sector Alpha Core",
            "priority": sim.priority or "high",
            "scenariosCount": scen_count,
            "timestamp": sim.created_at.strftime("%Y-%m-%d %H:%M")
        })
        
    # Query dynamic category counts for chart allocations
    t_incidents = db.query(Simulation).filter(Simulation.category.ilike("%traffic%")).count()
    f_incidents = db.query(Simulation).filter(Simulation.category.ilike("%flood%")).count()
    p_incidents = db.query(Simulation).filter(Simulation.category.ilike("%power%")).count()
    tr_incidents = db.query(Simulation).filter(Simulation.category.ilike("%transit%")).count()
    w_incidents = db.query(Simulation).filter(Simulation.category.ilike("%waste%")).count()

    # Query last 7 days simulation trends
    today = datetime.datetime.utcnow()
    trends = []
    for i in range(6, -1, -1):
        d = today - datetime.timedelta(days=i)
        day_count = db.query(Simulation).filter(func.date(Simulation.created_at) == d.date()).count()
        trends.append(day_count)

    budget_alloc = [
        t_incidents * 15,
        f_incidents * 25,
        w_incidents * 10,
        p_incidents * 20
    ]
    if sum(budget_alloc) == 0:
        budget_alloc = []

    return {
        "kpis": {
            "activeSimulations": total_simulations,
            "aiRecommendations": total_scenarios,
            "highPriorityAlerts": critical_alerts,
            "avgDecisionScore": avg_score
        },
        "logs": logs,
        "charts": {
            "trafficTrends": trends if any(trends) else [],
            "incidents": [t_incidents, f_incidents, p_incidents, tr_incidents] if (t_incidents or f_incidents or p_incidents or tr_incidents) else [],
            "budgetAllocation": budget_alloc
        }
    }
