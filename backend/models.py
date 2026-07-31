import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(String, unique=True, index=True) # Auth Provider Subject ID (Clerk/Firebase ID)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="Analyst") # Administrator, City Planner, Government Official, Analyst
    preferences = Column(Text, nullable=True)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    location = Column(String)
    priority = Column(String) # Low, Medium, High, Critical
    description = Column(Text)
    
    # Optional parameters
    budget_limit = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    population_affected = Column(String, nullable=True)
    weather_condition = Column(String, nullable=True)
    additional_notes = Column(Text, nullable=True)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    city_context = Column(Text, nullable=True)
    api_data = Column(Text, nullable=True)
    decision_calculations = Column(Text, nullable=True)
    executive_report = Column(Text, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    scenarios = relationship("Scenario", back_populates="simulation", cascade="all, delete-orphan")
    uploads = relationship("UploadedFile", back_populates="simulation", cascade="all, delete-orphan")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"))
    name = Column(String)
    type = Column(String) # Infrastructure-First, AI/IoT-Driven, Policy/Community-Led
    description = Column(Text)
    
    # Ratings metrics
    cost_score = Column(Float)
    safety_score = Column(Float)
    time_score = Column(Float)
    sustainability_score = Column(Float)
    social_score = Column(Float)
    
    decision_score = Column(Float)
    confidence_meter = Column(Float)
    
    # Pros & Cons serialized as semi-colon delimited text
    pros = Column(Text)
    cons = Column(Text)
    
    simulation = relationship("Simulation", back_populates="scenarios")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"))
    filename = Column(String)
    size = Column(String)
    
    simulation = relationship("Simulation", back_populates="uploads")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"))
    title = Column(String)
    generated_date = Column(DateTime, default=datetime.datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
