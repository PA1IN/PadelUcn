-- Enfoque alternativo: Usar instrucciones SQL básicas sin comillas en el nombre de la columna antigua
-- Primero, agregar una columna contrasena
ALTER TABLE usuario ADD COLUMN contrasena varchar;

-- Luego, copiar datos de la columna con ñ a la nueva
UPDATE usuario SET contrasena = "contraseña";

-- Hacer que la nueva columna sea NOT NULL
ALTER TABLE usuario ALTER COLUMN contrasena SET NOT NULL;

-- Y finalmente, modificar la entidad para usar esta nueva columna
