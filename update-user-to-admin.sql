-- update-user-to-admin.sql
-- Script para actualizar el estado de administrador de un usuario por su RUT

UPDATE usuario 
SET "isAdmin" = TRUE 
WHERE rut = '22222222-2';

-- Verificar el resultado
SELECT id, rut, nombre, "isAdmin" 
FROM usuario 
WHERE rut = '22222222-2';
