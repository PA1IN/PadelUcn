# Script to directly fix the reserva table in the database
Write-Host "Fixing reserva table columns..." -ForegroundColor Green

# Create a temporary SQL file
$tempSqlFile = "temp_fix_reserva.sql"
@"
-- Add missing columns to reserva table
ALTER TABLE IF EXISTS "reserva" 
ADD COLUMN IF NOT EXISTS "precio" DECIMAL(10,2) NOT NULL DEFAULT 10000;

ALTER TABLE IF EXISTS "reserva"
ADD COLUMN IF NOT EXISTS "pagado" BOOLEAN NOT NULL DEFAULT FALSE;

-- Update historial_reserva check constraint
ALTER TABLE IF EXISTS "historial_reserva" DROP CONSTRAINT IF EXISTS "historial_reserva_estado_check";
ALTER TABLE IF EXISTS "historial_reserva" 
ADD CONSTRAINT "historial_reserva_estado_check" 
CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'reserva' AND column_name IN ('precio', 'pagado');
"@ | Out-File -FilePath $tempSqlFile -Encoding utf8

try {
    # Copy the SQL file to the container
    Write-Host "Copying SQL file to container..." -ForegroundColor Yellow
    docker cp $tempSqlFile padelucn-postgres:/tmp/fix_reserva.sql
    
    # Execute the SQL file in the container
    Write-Host "Executing SQL in the container..." -ForegroundColor Yellow
    docker exec -i padelucn-postgres psql -U ingeso -d padelucn -f /tmp/fix_reserva.sql
    
    # Restart backend container to apply changes
    Write-Host "Restarting backend container..." -ForegroundColor Yellow
    docker restart padelucn-backend
    
    Write-Host "Database fix completed!" -ForegroundColor Green
    Write-Host "Try accessing http://localhost:8080/api/reservas now" -ForegroundColor Cyan
} 
catch {
    Write-Host "Error occurred: $_" -ForegroundColor Red
}
finally {
    # Clean up temp file
    if (Test-Path $tempSqlFile) {
        Remove-Item $tempSqlFile
    }
}
