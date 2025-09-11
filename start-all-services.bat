@echo off
echo Starting ThunderBird Services...
echo.

echo Starting Go Server (Port 8080)...
start "Go Server" cmd /k "cd server && go run main.go"

timeout /t 3 /nobreak >nul

echo Starting Satellite Simulator (Port 9090)...
start "Satellite Simulator" cmd /k "cd simulator && go run satelite.go"

timeout /t 3 /nobreak >nul

echo Starting Quantum Service (Port 8081)...
start "Quantum Service" cmd /k "cd server\quantum && python quantum_server.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo.
echo Services:
echo - Go Server: http://localhost:8080
echo - Simulator: http://localhost:9090
echo - Quantum: http://localhost:8081
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
