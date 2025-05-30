#!/bin/bash
# Script para ejecutar comandos SQL en PostgreSQL

# Copiar los datos de contraseña antigua a la nueva
psql -U ingeso -d padelucn << EOF
UPDATE usuario SET password = "contrase??a";
ALTER TABLE usuario DROP COLUMN "contrase??a";
EOF

echo "Script de migración de datos completado"
