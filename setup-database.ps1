# Script para configurar la base de datos
Write-Host "Iniciando configuración de la base de datos..." -ForegroundColor Green

# Verificar que los contenedores estén corriendo
Write-Host "Verificando que los contenedores estén activos..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}"
if ($containers -notcontains "padelucn-postgres") {
    Write-Host "El contenedor padelucn-postgres no está en ejecución. Iniciando contenedores..." -ForegroundColor Red
    docker-compose up -d
    # Esperar a que el contenedor esté listo
    Start-Sleep -Seconds 5
}
else {
    Write-Host "Contenedor padelucn-postgres encontrado." -ForegroundColor Green
}

# Aplicar el esquema de la base de datos
Write-Host "Aplicando el esquema de la base de datos..." -ForegroundColor Yellow
$schemaSQL = Get-Content -Path "./backend/ingeso-back/database-schema-new.sql" -Raw
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "$schemaSQL"

# Verificar que las tablas se hayan creado
Write-Host "Verificando que las tablas se hayan creado..." -ForegroundColor Yellow
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "\dt"

# Cargar los datos de ejemplo
Write-Host "Cargando datos de ejemplo..." -ForegroundColor Yellow
$dataSQL = Get-Content -Path "./backend/ingeso-back/sample-data-new.sql" -Raw
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "$dataSQL"

# Verificar que los datos se hayan cargado
Write-Host "Verificando datos de usuario..." -ForegroundColor Yellow
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "SELECT * FROM usuario;"

Write-Host "Verificando datos de cancha..." -ForegroundColor Yellow
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "SELECT * FROM cancha;"

Write-Host "Verificando la estructura de la tabla transaccion..." -ForegroundColor Yellow
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "\d transaccion"

Write-Host "¡Configuración de la base de datos completada!" -ForegroundColor Green
