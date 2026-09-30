# ThreatGraph X - Troubleshooting Guide

## 1. Common Issues & Solutions

### Neo4j Connection Refused
- **Symptom**: `Failed to establish connection to bolt://localhost:7687`
- **Cause**: Neo4j container still initializing or authentication mismatch.
- **Resolution**:
  - Verify Neo4j status with `docker compose ps`.
  - Alternatively, set `USE_IN_MEMORY_GRAPH=true` in `.env` to enable zero-dependency NetworkX in-memory mode.

### Database Migration / Table Missing
- **Symptom**: `relation "events" does not exist`
- **Cause**: Database tables have not yet been auto-migrated on startup.
- **Resolution**:
  - The application automatically creates all tables on startup via SQLAlchemy `Base.metadata.create_all()`. Restart the backend service.

### CORS Errors in Frontend
- **Symptom**: `Cross-Origin Request Blocked`
- **Cause**: Frontend origin not listed in backend `CORS_ORIGINS`.
- **Resolution**:
  - Ensure `http://localhost:5173` (Vite dev) or `http://localhost:3000` (Docker) is present in `CORS_ORIGINS` in `.env`.
