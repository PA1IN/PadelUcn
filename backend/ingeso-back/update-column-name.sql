-- Migration script to rename column from "contraseña" to "contrasena" in usuario table
ALTER TABLE usuario RENAME COLUMN "contraseña" TO "contrasena";

-- Verify the column was renamed
\d usuario
