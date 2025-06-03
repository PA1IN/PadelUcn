# Check-User22-JWT.ps1
# Script para verificar el token JWT del usuario 22222222-2

# Datos de login
$loginBody = @{
    rut = "22222222-2"
    password = "password123"
} | ConvertTo-Json

# Iniciar sesión y obtener token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json'

# Obtener el token
$token = $loginResponse.data.access_token

# Guardar el token
$token | Out-File -FilePath "user22-token.txt"
Write-Host "Token guardado en user22-token.txt"

# Decodificar el token
$tokenParts = $token.Split('.')
$payloadBase64 = $tokenParts[1].Replace('-', '+').Replace('_', '/')
while ($payloadBase64.Length % 4) { $payloadBase64 += '=' }
$payloadBytes = [System.Convert]::FromBase64String($payloadBase64)
$payload = [System.Text.Encoding]::UTF8.GetString($payloadBytes)

# Guardar el payload decodificado
$payload | Out-File -FilePath "user22-payload.json"
Write-Host "Payload decodificado guardado en user22-payload.json"

# Verificar isAdmin
$payloadObj = $payload | ConvertFrom-Json
if ($payloadObj.isAdmin -eq $true) {
    Write-Host "El usuario tiene privilegios de administrador: SÍ"
} else {
    Write-Host "El usuario tiene privilegios de administrador: NO"
}
