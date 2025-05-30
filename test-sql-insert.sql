\c padelucn

-- Check the schema of the usuario table
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'usuario'
ORDER BY ordinal_position;

-- Check the existing users
SELECT * FROM usuario LIMIT 3;

-- Insert a new user directly with SQL
INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin) 
VALUES ('direct-sql-1', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', 'SQL Direct Insert', 'sql.direct@test.com', '+56977777777', 0, false)
ON CONFLICT (rut) DO NOTHING
RETURNING *;

-- Try with double quotes around the table name too
INSERT INTO "usuario" (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin) 
VALUES ('direct-sql-2', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', 'SQL Direct Insert 2', 'sql.direct.2@test.com', '+56977777776', 0, false)
ON CONFLICT (rut) DO NOTHING
RETURNING *;
