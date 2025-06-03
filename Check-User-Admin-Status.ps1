# Check-User-Admin-Status.ps1
# Script para verificar si un usuario tiene privilegios de administrador

# Credentials
$userRut = "22222222-2"
$userPassword = "password123"

# Datos de login
$loginBody = @{
    rut = $userRut
    password = $userPassword
} | ConvertTo-Json

Write-Host "Iniciando sesión con el usuario $userRut..." -ForegroundColor Yellow

try {
    # Iniciar sesión y obtener token
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json'
    
    Write-Host "¡Login exitoso!" -ForegroundColor Green
    
    # Extraer el token
    $token = $loginResponse.data.access_token
    
    if ($token) {
        Write-Host "Token recibido ✓" -ForegroundColor Green
        
        # Guardar el token para uso posterior
        $token | Out-File -FilePath "c:\Users\manue\OneDrive\Documentos\repo1\PadelUcn\user-token.txt"
        Write-Host "Token guardado en user-token.txt" -ForegroundColor Green
        
        # Decodificar el token
        $tokenParts = $token.Split('.')
        if ($tokenParts.Count -ge 2) {
            $payloadBase64 = $tokenParts[1].Replace('-', '+').Replace('_', '/')
            
            # Añadir padding si es necesario
            while ($payloadBase64.Length % 4) { $payloadBase64 += '=' }
            
            $payloadBytes = [System.Convert]::FromBase64String($payloadBase64)
            $payload = [System.Text.Encoding]::UTF8.GetString($payloadBytes)
            
            Write-Host "Contenido del token decodificado:" -ForegroundColor Green
            Write-Host $payload -ForegroundColor Cyan
            
            # Convertir a objeto PowerShell y verificar isAdmin
            $payloadObj = $payload | ConvertFrom-Json
            
            if ($payloadObj.isAdmin -eq $true) {
                Write-Host "¡El usuario tiene privilegios de administrador! ✓" -ForegroundColor Green
            } else {
                Write-Host "El usuario NO tiene privilegios de administrador ✗" -ForegroundColor Red
            }
        } else {
            Write-Host "No se pudo decodificar el token" -ForegroundColor Red
        }
    } else {
        Write-Host "No se pudo obtener el token" -ForegroundColor Red
    }
} catch {
    Write-Host "Error al iniciar sesión:" -ForegroundColor Red
    Write-Host "Estado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Detalle: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
