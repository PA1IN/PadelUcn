# docker-query.ps1
# Script para ejecutar consultas SQL en el contenedor Docker de PostgreSQL

param (
    [Parameter(Mandatory=$true)]
    [string]$Query
)

$result = docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "$Query"
return $result
