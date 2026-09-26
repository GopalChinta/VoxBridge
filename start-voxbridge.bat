@echo off
echo ==============================================
echo   Starting VoxBridge AI Platform Services
echo   "Speak. Translate. Connect."
echo ==============================================

start "VoxBridge Backend (FastAPI)" cmd /k "cd /d %~dp0 && start-backend.bat"
start "VoxBridge Frontend (Vite)" cmd /k "cd /d %~dp0 && start-frontend.bat"

echo.
echo VoxBridge services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://127.0.0.1:8000
echo - Swagger:  http://127.0.0.1:8000/docs
echo.
pause
