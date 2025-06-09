-- PadelUcn Database Schema
-- Version: Final
-- Date: 2025-01-20

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS "transaccion" CASCADE;
DROP TABLE IF EXISTS "boleta_equipamiento" CASCADE;
DROP TABLE IF EXISTS "historial_reserva" CASCADE;
DROP TABLE IF EXISTS "jugador" CASCADE;
DROP TABLE IF EXISTS "reserva" CASCADE;
DROP TABLE IF EXISTS "bloque" CASCADE;
DROP TABLE IF EXISTS "cancha" CASCADE;
DROP TABLE IF EXISTS "equipamiento" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- ======================
-- CORE TABLES
-- ======================

-- Usuario table (Users)
CREATE TABLE "usuario" (    "id_usuario" SERIAL PRIMARY KEY,
    "rut" VARCHAR(12) NOT NULL UNIQUE,
    "nombre_usuario" VARCHAR NOT NULL,
    "correo" VARCHAR NOT NULL,
    "contrasena" VARCHAR NOT NULL,
    "telefono" VARCHAR,
    "saldo" INT NOT NULL DEFAULT 0,
    "is_admin" BOOLEAN NOT NULL DEFAULT false
);

-- Cancha table (Courts)
CREATE TABLE "cancha" (
    "id_cancha" SERIAL PRIMARY KEY,
    "numero" INT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR,
    "mantenimiento" BOOLEAN NOT NULL DEFAULT false,
    "cantidad_max_jugador" INT NOT NULL DEFAULT 4,
    "valor" INT NOT NULL
);

-- Bloque table (Time Blocks)
CREATE TABLE "bloque" (
    "id_bloque" SERIAL PRIMARY KEY,
    "fecha_date" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL
);

-- Equipamiento table (Equipment)
CREATE TABLE "equipamiento" (
    "id_equipamiento" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "tipo" VARCHAR NOT NULL,
    "stock" INT NOT NULL,
    "costo" INT NOT NULL
);

-- ======================
-- DEPENDENT TABLES
-- ======================

-- Reserva table (Reservations)
CREATE TABLE "reserva" (
    "id_reserva" SERIAL PRIMARY KEY,
    "fecha" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_termino" TIME NOT NULL,
    "id_cancha" INT NOT NULL,
    "id_usuario" INT NOT NULL,
    "id_bloque" INT,
    FOREIGN KEY ("id_cancha") REFERENCES "cancha"("id_cancha") ON DELETE CASCADE,
    FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE,
    FOREIGN KEY ("id_bloque") REFERENCES "bloque"("id_bloque") ON DELETE SET NULL
);

-- Jugador table (Players for each reservation)
CREATE TABLE "jugador" (
    "id_jugador" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "edad" INT NOT NULL,
    "id_reserva" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE
);

-- HistorialReserva table (Reservation History/Status tracking)
CREATE TABLE "historial_reserva" (
    "id_historial" SERIAL PRIMARY KEY,
    "estado" VARCHAR NOT NULL,
    "fecha_estado" DATE NOT NULL,
    "id_reserva" INT NOT NULL,
    "id_usuario" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE,
    FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE
);

-- BoletaEquipamiento table (Equipment Invoices)
CREATE TABLE "boleta_equipamiento" (
    "id_boleta" SERIAL PRIMARY KEY,
    "cantidad" INT NOT NULL,
    "monto_total" INT NOT NULL,
    "id_reserva" INT NOT NULL,
    "id_equipamiento" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE,
    FOREIGN KEY ("id_equipamiento") REFERENCES "equipamiento"("id_equipamiento") ON DELETE CASCADE
);

-- Transaccion table (Transactions)
CREATE TABLE "transaccion" (
    "id_transaccion" SERIAL PRIMARY KEY,
    "fecha" DATE NOT NULL,
    "id_boleta_equipamiento" INT,
    FOREIGN KEY ("id_boleta_equipamiento") REFERENCES "boleta_equipamiento"("id_boleta") ON DELETE SET NULL
);

-- ======================
-- INDEXES FOR PERFORMANCE
-- ======================

CREATE INDEX idx_usuario_rut ON "usuario"("rut");
CREATE INDEX idx_reserva_fecha ON "reserva"("fecha");
CREATE INDEX idx_reserva_usuario ON "reserva"("id_usuario");
CREATE INDEX idx_reserva_cancha ON "reserva"("id_cancha");
CREATE INDEX idx_historial_reserva ON "historial_reserva"("id_reserva");
CREATE INDEX idx_jugador_reserva ON "jugador"("id_reserva");
CREATE INDEX idx_boleta_reserva ON "boleta_equipamiento"("id_reserva");
CREATE INDEX idx_bloque_fecha ON "bloque"("fecha_date");

-- ======================
-- INITIAL DATA
-- ======================

-- Insert initial admin user and sample users
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contraseña", "telefono", "saldo", "is_admin") VALUES
  ('11111111-1', 'Admin Usuario', 'admin@padelucn.cl', '$2b$10$OQM/JtW2FC1NC7Fz26/tue6l/QL1glcJZpT0IjCflV8Os5sdoG3JG', '+56911111111', 100000, true),  -- password: admin123
  ('22222222-2', 'Juan Pérez', 'juan@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56922222222', 50000, false),  -- password: usuario123
  ('33333333-3', 'María López', 'maria@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56933333333', 30000, false),  -- password: usuario123
  ('44444444-4', 'Carlos Rodríguez', 'carlos@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56944444444', 25000, false);  -- password: usuario123

-- Insert sample courts
INSERT INTO "cancha" ("numero", "nombre", "descripcion", "mantenimiento", "cantidad_max_jugador", "valor") VALUES
  (1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', false, 4, 15000),
  (2, 'Cancha Secundaria', 'Cancha de pádel estándar', false, 4, 12000),
  (3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', false, 4, 18000);

-- Insert equipment
INSERT INTO "equipamiento" ("nombre", "tipo", "stock", "costo") VALUES
  ('Raqueta Pro', 'Raquetas', 10, 2000),
  ('Cinta grip', 'Accesorios', 30, 800),
  ('Pelotas (pack)', 'Pelotas', 20, 500),
  ('Protector facial', 'Protección', 15, 1500),
  ('Muñequera', 'Accesorios', 25, 300);

-- Insert time blocks for today and next few days
INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin") VALUES
  (CURRENT_DATE, '08:00:00', '09:00:00'),
  (CURRENT_DATE, '09:00:00', '10:00:00'),
  (CURRENT_DATE, '10:00:00', '11:00:00'),
  (CURRENT_DATE, '11:00:00', '12:00:00'),
  (CURRENT_DATE, '12:00:00', '13:00:00'),
  (CURRENT_DATE, '13:00:00', '14:00:00'),
  (CURRENT_DATE, '14:00:00', '15:00:00'),
  (CURRENT_DATE, '15:00:00', '16:00:00'),
  (CURRENT_DATE, '16:00:00', '17:00:00'),
  (CURRENT_DATE, '17:00:00', '18:00:00'),
  (CURRENT_DATE, '18:00:00', '19:00:00'),
  (CURRENT_DATE, '19:00:00', '20:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '08:00:00', '09:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '11:00:00', '12:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '12:00:00', '13:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '13:00:00', '14:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '15:00:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '16:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '17:00:00', '18:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '18:00:00', '19:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '19:00:00', '20:00:00');

-- Insert sample reservations
INSERT INTO "reserva" ("fecha", "hora_inicio", "hora_termino", "id_cancha", "id_usuario", "id_bloque") VALUES
  (CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:30:00', 2, 2, 2),
  (CURRENT_DATE + INTERVAL '2 days', '10:00:00', '11:30:00', 1, 3, 3);

-- Insert sample players
INSERT INTO "jugador" ("nombre", "apellido", "rut", "edad", "id_reserva") VALUES
  ('Pedro', 'Gómez', '55555555-5', 30, 1),
  ('Laura', 'Martínez', '66666666-6', 28, 1),
  ('Carlos', 'Rodríguez', '77777777-7', 32, 2),
  ('Ana', 'García', '88888888-8', 27, 2);

-- Insert sample reservation history
INSERT INTO "historial_reserva" ("estado", "fecha_estado", "id_reserva", "id_usuario") VALUES
  ('Pendiente', CURRENT_DATE, 1, 2),
  ('Confirmada', CURRENT_DATE, 1, 1),
  ('Pendiente', CURRENT_DATE, 2, 3);

-- Insert sample equipment invoices
INSERT INTO "boleta_equipamiento" ("cantidad", "monto_total", "id_reserva", "id_equipamiento") VALUES
  (2, 4000, 1, 1),
  (1, 800, 1, 2),
  (3, 1500, 2, 3),
  (2, 3000, 2, 4);

-- Insert sample transactions
INSERT INTO "transaccion" ("fecha", "id_boleta_equipamiento") VALUES
  (CURRENT_DATE, 1),
  (CURRENT_DATE, 2),
  (CURRENT_DATE, 3),
  (CURRENT_DATE, 4);

-- ======================
-- COMPLETION MESSAGE
-- ======================

DO $$
BEGIN
    RAISE NOTICE 'PadelUcn database schema successfully created!';
    RAISE NOTICE 'Admin user: admin@padelucn.cl / password: admin123';
    RAISE NOTICE 'Test users: juan@example.com, maria@example.com, carlos@example.com / password: usuario123';
END $$;
