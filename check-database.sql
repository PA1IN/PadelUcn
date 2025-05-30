-- This PostgreSQL query script will check the current status of the database schema
-- Run this against your PostgreSQL database to verify table structure

-- List all tables in the current schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check structure of Usuario table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'Usuario'
ORDER BY ordinal_position;

-- Check structure of Cancha table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'Cancha'
ORDER BY ordinal_position;

-- Check structure of Equipamiento table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'Equipamiento'
ORDER BY ordinal_position;

-- Check structure of Reserva table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'Reserva'
ORDER BY ordinal_position;

-- Check structure of HistorialReserva table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'HistorialReserva'
ORDER BY ordinal_position;

-- Check structure of BoletaEquipamiento table
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'BoletaEquipamiento'
ORDER BY ordinal_position;

-- Count records in each table
SELECT 'Usuario' as table_name, COUNT(*) as record_count FROM "Usuario"
UNION ALL
SELECT 'Cancha' as table_name, COUNT(*) as record_count FROM "Cancha"
UNION ALL
SELECT 'Equipamiento' as table_name, COUNT(*) as record_count FROM "Equipamiento"
UNION ALL
SELECT 'Reserva' as table_name, COUNT(*) as record_count FROM "Reserva"
UNION ALL
SELECT 'HistorialReserva' as table_name, COUNT(*) as record_count FROM "HistorialReserva"
UNION ALL
SELECT 'BoletaEquipamiento' as table_name, COUNT(*) as record_count FROM "BoletaEquipamiento"
ORDER BY table_name;
