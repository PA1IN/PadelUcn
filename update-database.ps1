#!/usr/bin/env pwsh
# Script para actualizar la base de datos en Docker

Write-Host "Iniciando actualizacion de la base de datos para PadelUCN..." -ForegroundColor Green

# Verificar si los contenedores están en ejecución
$containersRunning = docker ps | Select-String -Pattern "padelucn-postgres"
if (-not $containersRunning) {
    Write-Host "Los contenedores no están en ejecución. Iniciando docker-compose..." -ForegroundColor Yellow
    docker-compose up -d
    # Esperar a que la base de datos esté lista
    Start-Sleep -Seconds 10
}
Write-Host "Aplicando nuevo esquema de base de datos..." -ForegroundColor Cyan
Get-Content backend/ingeso-back/database-schema-new.sql | docker exec -i padelucn-postgres psql -U ingeso -d padelucn

# Verificar resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host "Esquema de base de datos actualizado exitosamente!" -ForegroundColor Green
      # Preguntar si se quieren cargar datos de ejemplo
    $loadSampleData = Read-Host "¿Desea cargar datos de ejemplo? (s/n)"
    if ($loadSampleData -eq 's' -or $loadSampleData -eq 'S') {
        Write-Host "Cargando datos de ejemplo..." -ForegroundColor Cyan
        Get-Content backend/ingeso-back/sample-data-new.sql | docker exec -i padelucn-postgres psql -U ingeso -d padelucn
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Datos de ejemplo cargados exitosamente!" -ForegroundColor Green
        } else {
            Write-Host "Error al cargar los datos de ejemplo. Revise los mensajes anteriores." -ForegroundColor Red
        }
    }
} else {
    Write-Host "Error al actualizar el esquema de base de datos. Revise los mensajes anteriores." -ForegroundColor Red
}

Write-Host "Proceso de actualización completado." -ForegroundColor Green
