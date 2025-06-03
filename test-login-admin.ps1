# test-login-admin.ps1 - PowerShell script to test login with admin user and extract JWT token

$body = @{
    rut = '11111111-1'
    password = 'password123'
} | ConvertTo-Json

try {
    Write-Host "Attempting to login with admin user (11111111-1)..."
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
    
    Write-Host "✅ Login successful!"
    Write-Host "Status: 200"
    
    # Get the token
    $token = $response.data.access_token
    
    if ($token) {
        Write-Host "Token received: ✓ Yes"
        
        # Save token to a file for later use
        $token | Out-File -FilePath 'admin-token.txt'
        Write-Host "Token saved to admin-token.txt"
        
        # Check if the token has isAdmin=true
        # Split the token parts
        $tokenParts = $token.Split('.')
        if ($tokenParts.Count -ge 2) {
            # Decode the payload (second part)
            $payloadBase64 = $tokenParts[1].Replace('-', '+').Replace('_', '/')
            # Add padding if needed
            while ($payloadBase64.Length % 4) { $payloadBase64 += '=' }
            
            $payloadBytes = [System.Convert]::FromBase64String($payloadBase64)
            $payload = [System.Text.Encoding]::UTF8.GetString($payloadBytes)
            
            Write-Host "Decoded token payload: $payload"
            
            # Convert to PowerShell object and check isAdmin
            $payloadObj = $payload | ConvertFrom-Json
            Write-Host "Is Admin: $(if ($payloadObj.isAdmin -eq $true) { 'Yes ✓' } else { 'No ✗' })"
        }
    } else {
        Write-Host "Token received: ✗ No"
        Write-Host "Full response data: $($response | ConvertTo-Json -Depth 3)"
    }
} catch {
    Write-Host "❌ Login request failed!"
    Write-Host "Error: $_"
}
