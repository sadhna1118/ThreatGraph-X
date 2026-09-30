# ThreatGraph X - Deployment & Operations Guide

## 1. Prerequisites
- Docker & Docker Compose (v2.20+) OR
- Python 3.12+ and Node.js 20+

## 2. Quickstart with Docker Compose
```bash
# 1. Clone repository and setup environment
cp .env.example .env

# 2. Launch full infrastructure stack
docker compose up -d --build

# 3. Verify health status
docker compose ps

# 4. Seed 20,000 synthetic security events
docker compose exec backend python scripts/seed.py --events 20000

# 5. Access UI
# Web UI: http://localhost:3000
# API Docs: http://localhost:8000/docs
# Neo4j Browser: http://localhost:7474 (neo4j / threatgraph_password)
```

## 3. Local Standalone Development (Zero-Dependency Mode)
ThreatGraph X features an embedded lightweight fallback mode using SQLite and In-Memory NetworkX graph engine:
```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend Setup (in separate terminal)
cd frontend
npm install
npm run dev
```
