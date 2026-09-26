@echo off
echo Starting VoxBridge Vite React Frontend...
cd /d "%~dp0frontend"
set PATH=C:\nvm4w\nodejs;C:\Windows\System32;%PATH%
call npm run dev
pause
