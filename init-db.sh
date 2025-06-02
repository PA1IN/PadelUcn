#!/bin/bash

# Script para inicializar la base de datos
PGPASSWORD=12342 psql -U ingeso -h localhost -p 5433 -d padelucn -f /tmp/schema.sql
PGPASSWORD=12342 psql -U ingeso -h localhost -p 5433 -d padelucn -f /tmp/data.sql
