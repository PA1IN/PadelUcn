# Make-User-Admin.ps1
# Script para convertir un usuario regular en administrador

# Lee el token desde el archivo
$adminToken = Get-Content -Path "c:\Users\manue\OneDrive\Documentos\repo1\PadelUcn\admin-token.txt" -ErrorAction SilentlyContinue
if (-not $adminToken) {
    Write-Host "No se pudo leer el token. Asegúrate de haber iniciado sesión primero." -ForegroundColor Red
    exit 1
}

# El RUT del usuario que queremos convertir en administrador
$userRut = "22222222-2" # Cambia esto si quieres usar otro usuario

# Datos a enviar
$body = @{
    isAdmin = $true
} | ConvertTo-Json

# Headers
$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $adminToken"
}

Write-Host "Intentando convertir al usuario $userRut en administrador..." -ForegroundColor Yellow

try {
    # Primero probamos con el endpoint "admin/:rut"
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios/admin/$userRut" -Method Patch -Headers $headers -Body $body -ErrorAction SilentlyContinue
    Write-Host "¡Usuario $userRut actualizado exitosamente a administrador!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "Error con el endpoint admin/:rut. Intentando con el endpoint cambiar-admin/:rut..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios/cambiar-admin/$userRut" -Method Patch -Headers $headers -Body $body -ErrorAction SilentlyContinue
        Write-Host "¡Usuario $userRut actualizado exitosamente a administrador!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "Error al actualizar usuario:" -ForegroundColor Red
        Write-Host "Estado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $errorMessage = $_.ErrorDetails.Message
        if ($errorMessage) {
            Write-Host "Mensaje: $errorMessage" -ForegroundColor Red
        } else {
            Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host "`nSugerencias para solucionar:" -ForegroundColor Yellow
        Write-Host "1. Asegúrate que el servidor backend está en ejecución" -ForegroundColor Yellow
        Write-Host "2. Verifica que el token de administrador es válido y no ha expirado" -ForegroundColor Yellow
        Write-Host "3. Comprueba que la ruta del API es correcta" -ForegroundColor Yellow
        Write-Host "4. Verifica que el RUT del usuario existe en la base de datos" -ForegroundColor Yellow
        
        # Imprime toda la información del error para diagnóstico
        Write-Host "`nInformación completa del error:" -ForegroundColor Yellow
        $_ | Format-List * -Force
    }
}
