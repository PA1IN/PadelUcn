-- Renombrar la columna contraseña a contrasena
ALTER TABLE usuario RENAME COLUMN "contraseña" TO contrasena;

-- Copiar datos de la columna antigua (si existe) a la nueva
UPDATE usuario SET contrasena = "password" WHERE "password" IS NOT NULL AND contrasena IS NULL;

-- Eliminar la columna password ya que no se necesitará
ALTER TABLE usuario DROP COLUMN IF EXISTS "password";
