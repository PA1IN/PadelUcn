DO $$ 
DECLARE 
    hash_value TEXT := '$2b$10$dyAWgR.Fcg3IlTbdAuj6sOy2DLueAj5f9pzaN1PeCj4gLZObRA/fC';
BEGIN
    UPDATE usuario 
    SET contraseña = hash_value 
    WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
    
    RAISE NOTICE 'Updated % rows', ROW_COUNT;
END $$;

SELECT rut, contraseña, length(contraseña) as hash_length 
FROM usuario 
WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
