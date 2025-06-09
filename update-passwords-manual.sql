-- Update test user passwords with proper bcrypt hashes
UPDATE usuario SET "contrasena" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '11111111-1';
UPDATE usuario SET "contrasena" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '22222222-2';
UPDATE usuario SET "contrasena" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '33333333-3';
UPDATE usuario SET "contrasena" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '44444444-4';

-- Verify the updates
SELECT rut, LENGTH("contrasena") as password_length FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3', '44444444-4');
