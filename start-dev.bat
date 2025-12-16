@echo off
echo Starting Aayu AI Development Servers...
echo.

REM Start backend server in a new window
start "Backend Server" cmd /k "cd server && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server
echo Starting frontend...
bun run dev

pause
