# Check-Database.ps1
# This script connects to PostgreSQL and checks the table structure and user data

# Set your PostgreSQL connection details
$env:PGPASSWORD = "postgres"  # Change this if you have a different password
$pgUser = "postgres"
$pgHost = "localhost"
$pgPort = "5432"
$pgDatabase = "padel_ucn"  # Change this if your database has a different name

# Function to execute a PostgreSQL query
function Invoke-PostgreSQL {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Query
    )
    
    $result = & psql -U $pgUser -h $pgHost -p $pgPort -d $pgDatabase -c "$Query"
    return $result
}

# Check table structure of usuario table
Write-Host "Checking table structure for usuario table..." -ForegroundColor Cyan
Invoke-PostgreSQL "SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'usuario' ORDER BY ordinal_position;"

# Check user data
Write-Host "`nChecking user data..." -ForegroundColor Cyan
Invoke-PostgreSQL "SELECT id_usuario, rut, nombre_usuario, correo, LEFT(contraseña, 30) as contraseña_partial, telefono, saldo, is_admin FROM usuario;"

# Check if there's a mapping mismatch
Write-Host "`nChecking TypeORM entity mapping (looking for '@Column' definitions)..." -ForegroundColor Cyan
Get-Content -Path "backend\ingeso-back\src\modulos\usuario\entities\usuario.entity.ts" | Select-String -Pattern '@Column'
