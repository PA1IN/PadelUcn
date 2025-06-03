-- Update password for test users with proper bcrypt hash
UPDATE usuario SET contraseña = '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im' WHERE rut = '11111111-1';
UPDATE usuario SET contraseña = '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im' WHERE rut = '22222222-2';
UPDATE usuario SET contraseña = '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im' WHERE rut = '33333333-3';

-- Verify the updates
SELECT rut, contraseña, length(contraseña) as hash_length FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3');
