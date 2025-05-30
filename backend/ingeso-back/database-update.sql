-- Actualización del esquema para asegurar que la columna contraseña esté correctamente definida
ALTER TABLE "Usuario" RENAME COLUMN "contraseña" TO "password";
