import os
import requests
from typing import Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
LOCAL_SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key_1234567890")
LOCAL_ALGORITHM = "HS256"

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    # 1. Fallback default operator user context if auth headers are completely missing
    if not credentials:
        return {
            "id": 1,
            "auth_id": "user_mock_clerk_123",
            "email": "operator@simverse.gov",
            "role": "Administrator"
        }
        
    token = credentials.credentials
    
    # 2. Try to decode local JWT first
    try:
        payload = jwt.decode(token, LOCAL_SECRET_KEY, algorithms=[LOCAL_ALGORITHM])
        return {
            "id": 1, # Default mock DB primary key
            "auth_id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "Analyst")
        }
    except Exception:
        # If decoding local JWT fails, proceed to try Clerk JWT
        pass

    # 3. Clerk authentication check
    if CLERK_JWKS_URL:
        try:
            jwks = requests.get(CLERK_JWKS_URL).json()
            payload = jwt.decode(token, jwks, algorithms=["RS256"])
            return {
                "id": 1,
                "auth_id": payload.get("sub"),
                "email": payload.get("email"),
                "role": payload.get("role", "Analyst")
            }
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid authentication token credentials: {str(e)}"
            )

    # 4. Fallback to default operator role if Clerk is not configured
    return {
        "id": 1,
        "auth_id": "user_mock_clerk_123",
        "email": "operator@simverse.gov",
        "role": "Administrator"
    }
