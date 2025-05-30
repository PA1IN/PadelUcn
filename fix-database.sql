-- Fix script for user registration issues

-- 1. First, let's check the actual column names in the database
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuario'
ORDER BY ordinal_position;

-- 2. Let's look at a sample user to understand the data structure
SELECT * FROM usuario LIMIT 1;

-- 3. Create a function to test inserting a user directly
CREATE OR REPLACE FUNCTION test_insert_user() RETURNS VOID AS $$
DECLARE
    test_rut VARCHAR := 'test-fix-001';
    test_password VARCHAR := '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu';
    test_nombre VARCHAR := 'Usuario de Prueba';
    test_correo VARCHAR := 'test.fix@example.com';
    test_telefono VARCHAR := '+56911223344';
BEGIN
    -- Try to insert a user with the actual column names
    INSERT INTO usuario (rut, "contrase??a", nombre_usuario, correo, telefono, saldo, is_admin)
    VALUES (test_rut, test_password, test_nombre, test_correo, test_telefono, 0, false)
    ON CONFLICT (rut) DO NOTHING;
    
    RAISE NOTICE 'User insertion attempted';
END;
$$ LANGUAGE plpgsql;

-- 4. Execute the function
SELECT test_insert_user();

-- 5. Check if the user was inserted correctly
SELECT * FROM usuario WHERE rut = 'test-fix-001';

-- 6. Create a SQL view with better column names (if needed)
DROP VIEW IF EXISTS usuario_view;
CREATE VIEW usuario_view AS
SELECT 
    id_usuario AS id,
    rut,
    nombre_usuario AS nombre,
    correo,
    "contrase??a" AS password,
    telefono,
    saldo,
    is_admin AS "isAdmin"
FROM usuario;

-- 7. Check the view
SELECT * FROM usuario_view LIMIT 1;
