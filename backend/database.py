import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Support PostgreSQL, fall back to local SQLite database for easy stand-alone execution
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./simverse.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency dependency provider for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
