BEGIN;
DELETE FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
INSERT INTO usuario (rut, nombre, correo, contraseña, telefono, saldo, "isAdmin") VALUES 
('11111111-1', 'Test User 1', 'test1@example.com', '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im', '123456789', 0, false),
('22222222-2', 'Test User 2', 'test2@example.com', '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im', '123456790', 0, false),
('33333333-3', 'Test User 3', 'test3@example.com', '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im', '123456791', 0, false);
COMMIT;

SELECT rut, contraseña, length(contraseña) as hash_length FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
