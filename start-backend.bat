@echo off
echo Starting VoxBridge FastAPI Backend...
cd /d "%~dp0backend"
set PATH=C:\nvm4w\nodejs;C:\Users\chint\AppData\Local\Programs\Python\Python311;C:\Users\chint\AppData\Local\Programs\Python\Python311\Scripts;%PATH%
venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
