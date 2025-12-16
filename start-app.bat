@echo off
echo ==========================================
echo Starting Aayu AI App (Single Port Mode)
echo ==========================================
echo.
echo Phase 1: Building Frontend...
echo (This may take a minute...)
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo Phase 2: Starting Server...
echo The app should be available at: http://localhost:3000
echo Protocol: http
echo Port: 3000
echo.
node server/index.js
pause
