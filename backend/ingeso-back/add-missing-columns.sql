-- Add missing columns to reserva table if they don't exist
DO $$
BEGIN
    -- Add precio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reserva' AND column_name = 'precio') THEN
        ALTER TABLE "reserva" ADD COLUMN "precio" DECIMAL(10,2) NOT NULL DEFAULT 10000;
    END IF;

    -- Add pagado column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reserva' AND column_name = 'pagado') THEN
        ALTER TABLE "reserva" ADD COLUMN "pagado" BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    -- Update historial_reserva check constraint to include PAGADO and NO_PAGADO states
    ALTER TABLE "historial_reserva" DROP CONSTRAINT IF EXISTS "historial_reserva_estado_check";
    ALTER TABLE "historial_reserva" ADD CONSTRAINT "historial_reserva_estado_check" 
        CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));
END $$;
