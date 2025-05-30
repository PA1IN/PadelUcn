# Script PowerShell para verificar que la corrección de autenticación está funcionando
# Este script prueba el login con un usuario administrador y accede a un endpoint protegido

Write-Host "🔐 VERIFICACIÓN DE LA CORRECCIÓN DE AUTENTICACIÓN" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$API_URL = "http://localhost:8080/api"
$LOG_FILE = "auth-fix-verification.log"

# Eliminar archivo de log previo si existe
if (Test-Path $LOG_FILE) {
    Remove-Item $LOG_FILE
}

# Función para escribir en el log
function Write-Log {
    param(
        [string]$Message,
        [string]$ForegroundColor = "White"
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor
    Add-Content -Path $LOG_FILE -Value $Message
}

# Inicializar archivo de log
Add-Content -Path $LOG_FILE -Value "VERIFICACIÓN DE LA CORRECCIÓN DE AUTENTICACIÓN"
Add-Content -Path $LOG_FILE -Value "================================================="
Add-Content -Path $LOG_FILE -Value "Fecha: $(Get-Date)"
Add-Content -Path $LOG_FILE -Value "API URL: $API_URL`n"

# Probar login con usuario administrador
Write-Log "PRUEBA 1: LOGIN ADMINISTRADOR" -ForegroundColor Yellow

$loginData = @{
    rut = "12345678-9"
    password = "admin123"
} | ConvertTo-Json

Write-Log "Intentando login con RUT: 12345678-9" -ForegroundColor Gray

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method Post -Body $loginData -ContentType "application/json" -ErrorAction Stop
    
    Write-Log "Respuesta: $($loginResponse | ConvertTo-Json -Depth 4)" -ForegroundColor Gray
    
    # Verificar si la respuesta indica éxito
    if ($loginResponse.success -eq $false) {
        Write-Log "❌ LOGIN FALLIDO: $($loginResponse.message)" -ForegroundColor Red
        $token = $null
    }
    else {
        # Intentar extraer token en diferentes formatos
        $token = $null
        if ($loginResponse.data -and $loginResponse.data.token) {
            $token = $loginResponse.data.token
        }
        elseif ($loginResponse.data -and $loginResponse.data.access_token) {
            $token = $loginResponse.data.access_token
        }
        elseif ($loginResponse.token) {
            $token = $loginResponse.token
        }
        elseif ($loginResponse.access_token) {
            $token = $loginResponse.access_token
        }
        
        if ($token) {
            Write-Log "✅ LOGIN EXITOSO - Token obtenido" -ForegroundColor Green
            $tokenPreview = "$($token.Substring(0, [Math]::Min(15, $token.Length)))...$($token.Substring([Math]::Max(0, $token.Length - 10)))"
            Write-Log "Token: $tokenPreview" -ForegroundColor Gray
        }
        else {
            Write-Log "❌ No se pudo extraer el token de la respuesta" -ForegroundColor Red
        }
    }
}
catch {
    Write-Log "❌ ERROR en login: $_" -ForegroundColor Red
    Write-Log "StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    $token = $null
    
    # Intentar mostrar el cuerpo de la respuesta de error
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Log "Respuesta de error: $responseBody" -ForegroundColor Red
    }
    catch {
        Write-Log "No se pudo leer la respuesta de error" -ForegroundColor Red
    }
}

# Si obtuvimos token, probar un endpoint protegido
if ($token) {
    Write-Log "`nPRUEBA 2: ACCESO A ENDPOINT PROTEGIDO" -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Log "Intentando acceder a /api/users con token..." -ForegroundColor Gray
        
        $protectedResponse = Invoke-RestMethod -Uri "$API_URL/users" -Method Get -Headers $headers -ErrorAction Stop
        
        Write-Log "Respuesta: $($protectedResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        Write-Log "✅ ACCESO EXITOSO AL ENDPOINT PROTEGIDO" -ForegroundColor Green
    }
    catch {
        Write-Log "❌ ERROR al acceder al endpoint protegido: $_" -ForegroundColor Red
        Write-Log "StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        # Intentar mostrar el cuerpo de la respuesta de error
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Log "Respuesta de error: $responseBody" -ForegroundColor Red
        }
        catch {
            Write-Log "No se pudo leer la respuesta de error" -ForegroundColor Red
        }
    }
    
    # Probar el endpoint de perfil
    Write-Log "`nPRUEBA 3: OBTENER PERFIL" -ForegroundColor Yellow
    
    try {
        Write-Log "Intentando acceder a /api/auth/profile con token..." -ForegroundColor Gray
        
        $profileResponse = Invoke-RestMethod -Uri "$API_URL/auth/profile" -Method Get -Headers $headers -ErrorAction Stop
        
        Write-Log "Respuesta: $($profileResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        Write-Log "✅ PERFIL OBTENIDO EXITOSAMENTE" -ForegroundColor Green
    }
    catch {
        Write-Log "❌ ERROR al obtener perfil: $_" -ForegroundColor Red
        Write-Log "StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        # Intentar mostrar el cuerpo de la respuesta de error
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Log "Respuesta de error: $responseBody" -ForegroundColor Red
        }
        catch {
            Write-Log "No se pudo leer la respuesta de error" -ForegroundColor Red
        }
    }
    
    # Conclusión
    Write-Log "`n✅ VERIFICACIÓN COMPLETADA: LA CORRECCIÓN DE AUTENTICACIÓN ESTÁ FUNCIONANDO" -ForegroundColor Green
}
else {
    # Conclusión si no se obtuvo token
    Write-Log "`n❌ VERIFICACIÓN FALLIDA: NO SE PUDO OBTENER TOKEN DE AUTENTICACIÓN" -ForegroundColor Red
}

Write-Host "`nLos resultados detallados se han guardado en: $LOG_FILE" -ForegroundColor Cyan
