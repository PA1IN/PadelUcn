-- insert-test-users.sql
-- This script will insert test users into the usuario table

-- Delete any existing users first
DELETE FROM usuario;

-- Insert test users with bcrypt hashed password 'password123'
-- Admin user
INSERT INTO usuario (rut, nombre, correo, "contraseña", telefono, saldo, "isAdmin")
VALUES ('11111111-1', 'Admin', 'admin@example.com', '$2b$10$iNP1T4NnT3nzpKY8aAKOp.r2N1ZA.VfYLZwLZGygNU/aJneVgFgUW', '+56912345678', 5000, true);

-- Regular users
INSERT INTO usuario (rut, nombre, correo, "contraseña", telefono, saldo, "isAdmin")
VALUES ('22222222-2', 'Juan', 'juan@example.com', '$2b$10$iNP1T4NnT3nzpKY8aAKOp.r2N1ZA.VfYLZwLZGygNU/aJneVgFgUW', '+56945678901', 2500, false);

INSERT INTO usuario (rut, nombre, correo, "contraseña", telefono, saldo, "isAdmin")
VALUES ('33333333-3', 'María', 'maria@example.com', '$2b$10$iNP1T4NnT3nzpKY8aAKOp.r2N1ZA.VfYLZwLZGygNU/aJneVgFgUW', '+56956789012', 3000, false);
