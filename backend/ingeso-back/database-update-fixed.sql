-- Actualización del esquema para asegurar que la columna contraseña esté correctamente definida
ALTER TABLE "usuario" RENAME COLUMN "contraseña" TO "password";
