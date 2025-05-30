-- Copiar los datos de la contraseña antigua a la nueva columna
UPDATE usuario SET password = "contrase??a";

-- Eliminar la columna antigua
ALTER TABLE usuario DROP COLUMN "contrase??a";
