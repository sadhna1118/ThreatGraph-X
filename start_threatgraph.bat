@echo off
title ThreatGraph X - Cyber Defense Platform
echo ========================================================
echo        THREATGRAPH X - STARTING PRODUCTION SERVICES
echo ========================================================
echo.

:: 1. Start Backend in separate window
echo [*] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "ThreatGraph X Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: 2. Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start Frontend in separate window
echo [*] Starting React 19 Frontend on http://localhost:5173 ...
start "ThreatGraph X Frontend" cmd /k "cd frontend && npm run dev"

:: 4. Wait 3 seconds and open browser automatically
timeout /t 3 /nobreak >nul
echo [+] Opening ThreatGraph X Web UI in your default browser...
start http://localhost:5173/

echo.
echo ========================================================
echo  ThreatGraph X is now LIVE!
echo  Frontend UI:   http://localhost:5173/
echo  Backend Docs:  http://127.0.0.1:8000/docs
echo  Credentials:   admin / AdminPass123!
echo ========================================================
pause
