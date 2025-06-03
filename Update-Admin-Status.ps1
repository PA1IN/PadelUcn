# Update-Admin-Status.ps1
Write-Host "Updating admin status for user with RUT 11111111-1"

$sqlQuery = @"
UPDATE usuario SET "isAdmin" = TRUE WHERE rut = '11111111-1';
SELECT rut, nombre, "isAdmin" FROM usuario WHERE rut = '11111111-1';
"@

$sqlQuery | Out-File -FilePath "update-query.sql" -Encoding UTF8

Write-Host "Copying SQL file to container..."
docker cp update-query.sql padelucn-postgres:/tmp/

Write-Host "Executing SQL query..."
docker exec -it padelucn-postgres psql -U ingeso -d padelucn -f /tmp/update-query.sql

Write-Host "Done!"
