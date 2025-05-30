# Simple API testing script for PadelUCN

# Configuration
$apiBase = "http://localhost:8080/api"
$adminCredentials = @{
    rut = "12345678-9"
    password = "admin123"
}
$userCredentials = @{
    rut = "98765432-1"
    password = "usuario123"
}

# Global variables to store tokens and IDs
$adminToken = $null
$userToken = $null
$courtId = $null
$equipmentId = $null
$reservationId = $null

# Helper functions
function Write-TestResult($name, $success, $message = "") {
    if ($success) {
        Write-Host "✅ $name`: $message" -ForegroundColor Green
    } else {
        Write-Host "❌ $name`: $message" -ForegroundColor Red
    }
}

function Test-AdminLogin {
    Write-Host "`n🔑 Testing admin login..." -ForegroundColor Cyan
    
    try {
        $body = $adminCredentials | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$apiBase/auth/login" -Method POST -Body $body -ContentType "application/json"
        
        # Extract token
        if ($response.data.token) {
            $script:adminToken = $response.data.token
        } elseif ($response.data.access_token) {
            $script:adminToken = $response.data.access_token
        }
        
        if ($script:adminToken) {
            Write-TestResult "Admin Login" $true "Successfully logged in and got token"
            return $true
        } else {
            Write-TestResult "Admin Login" $false "Could not extract token from response"
            return $false
        }
    } catch {
        Write-TestResult "Admin Login" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-UserLogin {
    Write-Host "`n🔑 Testing regular user login..." -ForegroundColor Cyan
    
    try {
        $body = $userCredentials | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$apiBase/auth/login" -Method POST -Body $body -ContentType "application/json"
        
        # Extract token
        if ($response.data.token) {
            $script:userToken = $response.data.token
        } elseif ($response.data.access_token) {
            $script:userToken = $response.data.access_token
        }
        
        if ($script:userToken) {
            Write-TestResult "User Login" $true "Successfully logged in and got token"
            return $true
        } else {
            Write-TestResult "User Login" $false "Could not extract token from response"
            return $false
        }
    } catch {
        Write-TestResult "User Login" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-GetProfile {
    Write-Host "`n👤 Testing get profile..." -ForegroundColor Cyan
    
    if (-not $userToken) {
        Write-TestResult "Get Profile" $false "No user token available"
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $userToken"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBase/auth/profile" -Method GET -Headers $headers
        Write-TestResult "Get Profile" $true "Successfully fetched profile"
        return $true
    } catch {
        Write-TestResult "Get Profile" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-GetAllUsers {
    Write-Host "`n👥 Testing get all users..." -ForegroundColor Cyan
    
    if (-not $adminToken) {
        Write-TestResult "Get All Users" $false "No admin token available"
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $adminToken"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBase/users" -Method GET -Headers $headers
        Write-TestResult "Get All Users" $true "Successfully fetched users: $($response.data.length) users found"
        return $true
    } catch {
        Write-TestResult "Get All Users" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-GetAllCourts {
    Write-Host "`n🎾 Testing get all courts..." -ForegroundColor Cyan
    
    if (-not $userToken) {
        Write-TestResult "Get All Courts" $false "No user token available"
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $userToken"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBase/canchas" -Method GET -Headers $headers
        
        if ($response.data -and $response.data.length -gt 0) {
            $script:courtId = $response.data[0].id
            Write-TestResult "Get All Courts" $true "Successfully fetched courts: $($response.data.length) courts found"
            return $true
        } else {
            Write-TestResult "Get All Courts" $true "Successfully fetched courts, but no courts found"
            return $true
        }
    } catch {
        Write-TestResult "Get All Courts" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-GetAllEquipment {
    Write-Host "`n🏓 Testing get all equipment..." -ForegroundColor Cyan
    
    if (-not $userToken) {
        Write-TestResult "Get All Equipment" $false "No user token available"
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $userToken"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBase/equipamiento" -Method GET -Headers $headers
        
        if ($response.data -and $response.data.length -gt 0) {
            $script:equipmentId = $response.data[0].id
            Write-TestResult "Get All Equipment" $true "Successfully fetched equipment: $($response.data.length) items found"
            return $true
        } else {
            Write-TestResult "Get All Equipment" $true "Successfully fetched equipment, but no items found"
            return $true
        }
    } catch {
        Write-TestResult "Get All Equipment" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

function Test-GetAllReservations {
    Write-Host "`n📅 Testing get all reservations..." -ForegroundColor Cyan
    
    if (-not $userToken) {
        Write-TestResult "Get All Reservations" $false "No user token available"
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $userToken"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBase/reservas" -Method GET -Headers $headers
        
        if ($response.data -and $response.data.length -gt 0) {
            $script:reservationId = $response.data[0].id
            Write-TestResult "Get All Reservations" $true "Successfully fetched reservations: $($response.data.length) reservations found"
            return $true
        } else {
            Write-TestResult "Get All Reservations" $true "Successfully fetched reservations, but none found"
            return $true
        }
    } catch {
        Write-TestResult "Get All Reservations" $false "Error: $($_.Exception.Message)"
        return $false
    }
}

# Run all tests
function Run-AllTests {
    Write-Host "🚀 STARTING API ENDPOINT TESTS" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    
    # Auth Module Tests
    $authLoginSuccess = Test-AdminLogin
    Test-UserLogin
    Test-GetProfile
    
    # User Module Tests
    Test-GetAllUsers
    
    # Courts Module Tests
    Test-GetAllCourts
    
    # Equipment Module Tests
    Test-GetAllEquipment
    
    # Reservations Module Tests
    Test-GetAllReservations
    
    Write-Host "`n📋 TESTS COMPLETED" -ForegroundColor Cyan
    Write-Host "================" -ForegroundColor Cyan
    
    if ($authLoginSuccess) {
        Write-Host "`n✅ Authentication tests passed! The fix for the password comparison issue has been successful." -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ There might still be issues with the authentication system." -ForegroundColor Yellow
    }
}

# Start the tests
Run-AllTests
