import os
import hashlib
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key_1234567890")
ALGORITHM = "HS256"

class AuthRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "Analyst"

def hash_password(password: str, salt: str = "simverse_salt_99") -> str:
    return hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        100000
    ).hex()

@router.post("/register")
def register(payload: AuthRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered.")
        
    hashed = hash_password(payload.password)
    user = User(
        email=payload.email,
        auth_id=payload.email, 
        role=payload.role or "Analyst",
        preferences=hashed # Storing hashed password in preferences field to reuse existing schema
    )
    db.add(user)
    db.commit()
    
    return {"status": "success", "message": "User registered successfully."}

@router.post("/login")
def login(payload: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")
        
    hashed = hash_password(payload.password)
    if user.preferences != hashed:
        raise HTTPException(status_code=400, detail="Invalid email or password.")
        
    # Generate JWT
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    token_data = {
        "sub": user.auth_id,
        "email": user.email,
        "role": user.role,
        "exp": expire
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "role": user.role
        }
    }
