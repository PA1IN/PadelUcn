# Script muy simple para verificar la autenticación

Write-Host "🔐 VERIFICACIÓN SIMPLE DE AUTENTICACIÓN" -ForegroundColor Cyan

$API_URL = "http://localhost:8080/api"

Write-Host "Probando login..." -ForegroundColor Yellow

$body = @{
    rut = "12345678-9"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Respuesta recibida:" -ForegroundColor Green
    $response | ConvertTo-Json
}
catch {
    Write-Host "Error en la petición: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}
