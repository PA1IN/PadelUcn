# Reset Docker environment for PadelUCN and rebuild
Write-Host "Stopping and removing existing containers..." -ForegroundColor Yellow
docker-compose down -v

Write-Host "Removing Docker volume to ensure clean database..." -ForegroundColor Yellow
docker volume rm padelucn_padelucn_data 

Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host "Containers are starting up. Waiting 10 seconds for them to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 10

Write-Host "Checking container status:" -ForegroundColor Cyan
docker ps

Write-Host "Setup complete!" -ForegroundColor Green
