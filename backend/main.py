from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import simulate, auth_routes, analytics, weather, city_context
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Automatically initialize tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SimVerse AI Decision Intelligence API",
    description="Production-ready FastAPI backend managing city simulations, scenarios, and database logging.",
    version="1.0.0"
)

# Centralized exception handlers matching format specification
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.detail,
                "details": str(exc),
                "status": exc.status_code
            }
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "Internal Server Error",
                "details": str(exc),
                "status": 500
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "message": "Validation Error",
                "details": str(exc.errors()),
                "status": 422
            }
        }
    )

# Enable CORS for Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to target frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints routers
app.include_router(simulate.router)
app.include_router(auth_routes.router)
app.include_router(analytics.router)
app.include_router(weather.router)
app.include_router(city_context.router)

@app.get("/api/health", tags=["system"])
def health_check():
    return {
        "status": "healthy",
        "service": "SimVerse AI Core",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
