# Force cleanup script for corrupted node_modules

Write-Host "Starting aggressive cleanup..." -ForegroundColor Yellow

# Stop OneDrive sync temporarily if possible
Write-Host "Attempting to pause OneDrive sync..."

# Remove .next folder
if (Test-Path ".next") {
    Write-Host "Removing .next folder..."
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove package-lock.json
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..."
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
}

# Aggressively remove node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules (this may take a moment)..."
    
    # Try method 1: PowerShell Remove-Item
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Try method 2: cmd rmdir if PowerShell fails
    if (Test-Path "node_modules") {
        Write-Host "Trying alternative removal method..."
        cmd /c "rmdir /s /q node_modules" 2>$null
    }
    
    # Try method 3: robocopy trick (fastest for large directories)
    if (Test-Path "node_modules") {
        Write-Host "Trying robocopy method..."
        $emptyDir = New-Item -ItemType Directory -Path ".\empty_temp" -Force
        robocopy ".\empty_temp" ".\node_modules" /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /nc /ns /np 2>$null
        Remove-Item -Path ".\empty_temp" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm install" -ForegroundColor Cyan
