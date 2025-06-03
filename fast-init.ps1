# fast-init.ps1
# Script para inicializar rápidamente la base de datos

# Iniciar contenedores
docker-compose up -d

# Esperar a que PostgreSQL esté listo
Write-Host "Esperando a que la base de datos esté lista..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Ejecutar consulta para verificar que el backend está conectado
Write-Host "Verificando conexión a la API..." -ForegroundColor Yellow
Invoke-RestMethod http://localhost:8080/usuario -ErrorAction SilentlyContinue

# Vamos a probar el inicio de sesión directamente con el usuario admin
$body = @{
    "rut": "11111111-1",
    "password": "admin123"
}

$json = $body | ConvertTo-Json
Write-Host "Intentando iniciar sesión con el usuario admin..." -ForegroundColor Yellow
Invoke-RestMethod -Uri http://localhost:8080/login -Method Post -Body $json -ContentType "application/json" -ErrorAction SilentlyContinue
