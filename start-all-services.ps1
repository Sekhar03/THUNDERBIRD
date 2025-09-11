# ThunderBird Services Startup Script
Write-Host "Starting ThunderBird Services..." -ForegroundColor Green
Write-Host ""

# Start Go Server
Write-Host "Starting Go Server (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; go run main.go"

Start-Sleep -Seconds 3

# Start Satellite Simulator
Write-Host "Starting Satellite Simulator (Port 9090)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd simulator; go run satelite.go"

Start-Sleep -Seconds 3

# Start Quantum Service
Write-Host "Starting Quantum Service (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server\quantum; python quantum_server.py"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "- Go Server: http://localhost:8080" -ForegroundColor White
Write-Host "- Simulator: http://localhost:9090" -ForegroundColor White
Write-Host "- Quantum: http://localhost:8081" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
