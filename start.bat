@echo off
echo Starting Birthday Bash Application...
echo.
echo Starting backend server on port 3001...
start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend on port 8080...
start "Frontend" cmd /k "npm run dev"
echo.
echo ========================================
echo Birthday Bash is starting!
echo ========================================
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:8080
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul
taskkill /FI "WINDOWTITLE eq Backend Server*" /T /F
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F
