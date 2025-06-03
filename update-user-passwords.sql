-- update-user-passwords.sql
-- This script will update user passwords to use a manually set hash

-- Password: 'admin123' for all users
-- Set the password directly
UPDATE usuario SET "contraseña" = '$2a$10$U9TLKSv4ogTf.3R5OBNDseZxqRiVBKo3qFfMgiY/TgICYzDkKCKl2' WHERE rut = '11111111-1';
UPDATE usuario SET "contraseña" = '$2a$10$U9TLKSv4ogTf.3R5OBNDseZxqRiVBKo3qFfMgiY/TgICYzDkKCKl2' WHERE rut = '22222222-2';
UPDATE usuario SET "contraseña" = '$2a$10$U9TLKSv4ogTf.3R5OBNDseZxqRiVBKo3qFfMgiY/TgICYzDkKCKl2' WHERE rut = '33333333-3';

-- Verify the update
SELECT rut, "contraseña" FROM usuario;
