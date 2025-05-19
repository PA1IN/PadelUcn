-- SQL script to fix missing columns in the reserva table

-- Step 1: Add missing columns to reserva table
ALTER TABLE IF EXISTS "reserva" 
ADD COLUMN IF NOT EXISTS "precio" DECIMAL(10,2) NOT NULL DEFAULT 10000,
ADD COLUMN IF NOT EXISTS "pagado" BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 2: Update historial_reserva check constraint to include PAGADO and NO_PAGADO states
ALTER TABLE IF EXISTS "historial_reserva" DROP CONSTRAINT IF EXISTS "historial_reserva_estado_check";
ALTER TABLE IF EXISTS "historial_reserva" 
ADD CONSTRAINT "historial_reserva_estado_check" 
CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));

-- Step 3: Verify the columns were added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reserva' AND column_name IN ('precio', 'pagado');

-- Step 4: Verify the historial_reserva constraint was updated
SELECT con.conname AS constraint_name, 
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con 
JOIN pg_class tbl ON tbl.oid = con.conrelid
WHERE tbl.relname = 'historial_reserva';
