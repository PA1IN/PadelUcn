-- Crear nueva columna 'contrasena'
ALTER TABLE usuario ADD COLUMN contrasena character varying;

-- Copiar datos de 'contraseña' a 'contrasena'
UPDATE usuario SET contrasena = "contraseña";

-- Hacer que contrasena sea NOT NULL
ALTER TABLE usuario ALTER COLUMN contrasena SET NOT NULL;

-- Eliminar la columna antigua
ALTER TABLE usuario DROP COLUMN "contraseña";

-- Eliminar la columna 'password' adicional si existe y no se necesita
ALTER TABLE usuario DROP COLUMN IF EXISTS "password";
