-- Update passwords with proper escaping for the special characters column
UPDATE usuario SET "contrase??a" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '11111111-1';
UPDATE usuario SET "contrase??a" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '22222222-2';
UPDATE usuario SET "contrase??a" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '33333333-3';
UPDATE usuario SET "contrase??a" = '$2b$10$EN0FvLTMaNbzvsvNwIgPv.YY9Wc3OYM0Tcwco6lKyf440dOfGFzJ.' WHERE rut = '44444444-4';

-- Show the updated passwords (first 30 characters)
SELECT rut, substring("contrase??a", 1, 30) as password_hash FROM usuario WHERE rut IN ('11111111-1', '22222222-2', '33333333-3', '44444444-4');
