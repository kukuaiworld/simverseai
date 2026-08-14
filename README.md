🚀 SimVerse AI

Track: Smart India Solution
Project Name: SimVerse AI
Team Name: Vector Minds

👥 Team

Member| Contact| Role
Kuldeep Soni| 8949409100| Solution Design
Sonu Raika| 6378484084| Backend & AI

💡 About the Project

SimVerse AI is an AI-powered decision intelligence platform designed to help cities understand complex situations, simulate possible future scenarios, and make smarter, data-driven decisions.

The platform combines AI, real-time data, simulations, maps, and decision intelligence to provide actionable insights for smart-city planning and management.

🎯 Vision

To build an intelligent city simulation system that helps decision-makers predict, analyze, and respond to urban challenges before they happen.# SimVerse AI - Smart City Decision Intelligence Platform

SimVerse AI is a production-grade full-stack web application designed for municipal command centers, city planners, and government decision-makers. It enables users to simulate urban challenges, evaluate outcomes using Generative AI (Gemini), rank solutions based on weighted multi-criteria scores, and generate printable executive briefs.

---

## Technical Architecture

* **Frontend**: Next.js (React / TypeScript / Tailwind CSS) with proxy rewrites routing `/api/*` to the Python backend.
* **Backend**: FastAPI (Python) web framework with REST endpoints.
* **Database**: PostgreSQL (using SQLAlchemy ORM). Supports local SQLite fallback for standalone development.
* **AI Integration**: Google Gemini API SDK (`google-generativeai`).
* **Authentication**: Clerk JWT validation (with standalone mock fallback).
* **Containerization**: Docker & Docker Compose.

---

## Project Structure

```bash
├── app/                  # Next.js page routing and layout views
├── components/           # React dashboard, map, and matrix panels
├── backend/              # Python FastAPI backend
│   ├── api/              # REST routes (simulate, etc.)
│   ├── database.py       # SQLAlchemy engine session setup
│   ├── models.py         # SQLAlchemy postgres schema models
│   ├── schemas.py        # Pydantic schema serializers
│   ├── auth.py           # Clerk JWT auth helper
│   ├── main.py           # FastAPI entry point
│   ├── requirements.txt  # Python requirements
│   └── Dockerfile        # Python Docker build
├── Dockerfile            # Next.js Node Alpine Docker build
├── docker-compose.yml    # Docker Compose container link orchestration
└── next.config.ts        # Next.js proxy rewrites rules
```

---

## Deployment & Running Guide

### 1. Prerequisite Environments
Create a `.env` file in the root directory (or inject variables globally):
```env
GEMINI_API_KEY=your_google_gemini_api_key
CLERK_JWKS_URL=https://api.clerk.com/v1/jwks (optional)
```

### 2. Run using Docker Compose (Recommended)
Launch the entire stack (Next.js, FastAPI, PostgreSQL database) with a single command:
```bash
docker-compose up --build
```
* **Frontend Dashboard**: Accessible at [http://localhost:3000](http://localhost:3000)
* **Backend Swagger API Docs**: Accessible at [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL Engine**: Running on port `5432`

### 3. Local Standalone Development (Without Docker)

#### Start the FastAPI Backend:
1. Navigate to `/backend` and create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI Uvicorn server:
   ```bash
   python main.py
   ```
   *The backend will fall back to a local SQLite database (`simverse.db`) automatically.*

#### Start the Next.js Frontend:
1. In the root directory, install dependencies:
   ```bash
   npm install
   ```
2. Start the local Next.js server:
   ```bash
   npm run dev
   ```
   *Requests hitting `/api/*` will proxy to the backend on `http://127.0.0.1:8000`.*
