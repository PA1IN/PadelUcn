-- SQL script to fix Reservation columns issue
-- Execute this script directly in pgAdmin or any PostgreSQL client connected to your database

-- 1. Add missing columns to reserva table
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS precio DECIMAL(10,2) NOT NULL DEFAULT 10000;
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS pagado BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Update historial_reserva check constraint to include payment states
ALTER TABLE historial_reserva DROP CONSTRAINT IF EXISTS historial_reserva_estado_check;
ALTER TABLE historial_reserva ADD CONSTRAINT historial_reserva_estado_check 
CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));

-- 3. Verify the changes were applied successfully
-- This will list the columns we just added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'reserva' AND column_name IN ('precio', 'pagado');

-- 4. Verify the constraint was updated
SELECT con.conname AS constraint_name, 
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con 
JOIN pg_class tbl ON tbl.oid = con.conrelid
WHERE tbl.relname = 'historial_reserva';