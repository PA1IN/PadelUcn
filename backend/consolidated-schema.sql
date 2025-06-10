-- PadelUcn Consolidated Database Schema
-- Version: 3.0
-- Date: June 9, 2025
-- This schema consolidates previous versions and ensures consistent field naming

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
CREATE TABLE "usuario" (
    "id_usuario" SERIAL PRIMARY KEY,
    "rut" VARCHAR(12) NOT NULL UNIQUE,
    "nombre_usuario" VARCHAR NOT NULL,
    "correo" VARCHAR NOT NULL,
    "contrasena" VARCHAR NOT NULL, -- Using "contrasena" consistently (no ñ) across the application
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
-- RELATIONSHIP TABLES
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

-- Jugador table (Players)
CREATE TABLE "jugador" (
    "id_jugador" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "edad" INT NOT NULL,
    "id_reserva" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE
);

-- HistorialReserva table (Reservation History)
CREATE TABLE "historial_reserva" (
    "id_historial" SERIAL PRIMARY KEY,
    "estado" VARCHAR NOT NULL,
    "fecha_estado" DATE NOT NULL,
    "id_reserva" INT NOT NULL,
    "id_usuario" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE,
    FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE
);

-- BoletaEquipamiento table (Equipment Receipts)
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

-- Admin user
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contrasena", "telefono", "saldo", "is_admin")
VALUES ('11111111-1', 'Admin PadelUCN', 'admin@padelucn.cl', '$2b$10$OQM/JtW2FC1NC7Fz26/tue6l/QL1glcJZpT0IjCflV8Os5sdoG3JG', '+56911111111', 100000, true); -- password: admin123

-- Regular users
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contrasena", "telefono", "saldo", "is_admin")
VALUES
  ('22222222-2', 'Juan Pérez', 'juan@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56922222222', 50000, false), -- password: usuario123
  ('33333333-3', 'María López', 'maria@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56933333333', 30000, false), -- password: usuario123
  ('44444444-4', 'Carlos Rodríguez', 'carlos@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56944444444', 25000, false); -- password: usuario123

-- Sample courts
INSERT INTO "cancha" ("numero", "nombre", "descripcion", "mantenimiento", "cantidad_max_jugador", "valor")
VALUES
  (1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', false, 4, 15000),
  (2, 'Cancha Secundaria', 'Cancha de pádel estándar', false, 4, 12000),
  (3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', false, 4, 18000);

-- Equipment
INSERT INTO "equipamiento" ("nombre", "tipo", "stock", "costo")
VALUES
  ('Paleta Pro', 'Raquetas', 10, 5000),
  ('Cinta grip', 'Accesorios', 30, 800),
  ('Pelotas (pack x3)', 'Pelotas', 20, 500),
  ('Protector facial', 'Protección', 15, 1500),
  ('Muñequera', 'Accesorios', 25, 300),
  ('Toalla UCN', 'Accesorios', 15, 1500),
  ('Botella de Agua', 'Hidratación', 30, 1000);

-- Insert time blocks dynamically for current and next days
DO $$
DECLARE
  current_date DATE := CURRENT_DATE;
BEGIN
  -- Current day blocks
  INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin")
  VALUES 
    (current_date, '08:00:00', '09:00:00'),
    (current_date, '09:00:00', '10:00:00'),
    (current_date, '10:00:00', '11:00:00'),
    (current_date, '11:00:00', '12:00:00'),
    (current_date, '12:00:00', '13:00:00'),
    (current_date, '13:00:00', '14:00:00'),
    (current_date, '14:00:00', '15:00:00'),
    (current_date, '15:00:00', '16:00:00'),
    (current_date, '16:00:00', '17:00:00'),
    (current_date, '17:00:00', '18:00:00'),
    (current_date, '18:00:00', '19:00:00'),
    (current_date, '19:00:00', '20:00:00');
  
  -- Next day blocks
  INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin")
  VALUES 
    (current_date + INTERVAL '1 day', '08:00:00', '09:00:00'),
    (current_date + INTERVAL '1 day', '09:00:00', '10:00:00'),
    (current_date + INTERVAL '1 day', '10:00:00', '11:00:00'),
    (current_date + INTERVAL '1 day', '11:00:00', '12:00:00'),
    (current_date + INTERVAL '1 day', '12:00:00', '13:00:00'),
    (current_date + INTERVAL '1 day', '13:00:00', '14:00:00'),
    (current_date + INTERVAL '1 day', '14:00:00', '15:00:00'),
    (current_date + INTERVAL '1 day', '15:00:00', '16:00:00'),
    (current_date + INTERVAL '1 day', '16:00:00', '17:00:00'),
    (current_date + INTERVAL '1 day', '17:00:00', '18:00:00'),
    (current_date + INTERVAL '1 day', '18:00:00', '19:00:00'),
    (current_date + INTERVAL '1 day', '19:00:00', '20:00:00');
    
  -- Two days ahead blocks
  INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin")
  VALUES 
    (current_date + INTERVAL '2 days', '08:00:00', '09:00:00'),
    (current_date + INTERVAL '2 days', '09:00:00', '10:00:00'),
    (current_date + INTERVAL '2 days', '10:00:00', '11:00:00'),
    (current_date + INTERVAL '2 days', '11:00:00', '12:00:00'),
    (current_date + INTERVAL '2 days', '12:00:00', '13:00:00'),
    (current_date + INTERVAL '2 days', '13:00:00', '14:00:00'),
    (current_date + INTERVAL '2 days', '14:00:00', '15:00:00'),
    (current_date + INTERVAL '2 days', '15:00:00', '16:00:00'),
    (current_date + INTERVAL '2 days', '16:00:00', '17:00:00'),
    (current_date + INTERVAL '2 days', '17:00:00', '18:00:00'),
    (current_date + INTERVAL '2 days', '18:00:00', '19:00:00'),
    (current_date + INTERVAL '2 days', '19:00:00', '20:00:00');
END $$;

-- Sample reservation for today
DO $$
DECLARE
  user_id INT;
  court_id INT;
  block_id INT;
  reservation_id INT;
BEGIN
  -- Get IDs for the sample reservation
  SELECT id_usuario INTO user_id FROM usuario WHERE rut = '22222222-2' LIMIT 1;
  SELECT id_cancha INTO court_id FROM cancha WHERE numero = 1 LIMIT 1;
  SELECT id_bloque INTO block_id FROM bloque WHERE fecha_date = CURRENT_DATE AND hora_inicio = '09:00:00' LIMIT 1;
  
  -- Create reservation
  INSERT INTO "reserva" ("fecha", "hora_inicio", "hora_termino", "id_cancha", "id_usuario", "id_bloque")
  VALUES (CURRENT_DATE, '09:00:00', '10:30:00', court_id, user_id, block_id)
  RETURNING id_reserva INTO reservation_id;
  
  -- Add players to the reservation
  INSERT INTO "jugador" ("nombre", "apellido", "rut", "edad", "id_reserva")
  VALUES 
    ('Juan', 'Pérez', '22222222-2', 30, reservation_id),
    ('Ana', 'García', '55555555-5', 28, reservation_id),
    ('Pedro', 'López', '66666666-6', 35, reservation_id),
    ('María', 'Martínez', '77777777-7', 25, reservation_id);
    
  -- Add reservation history
  INSERT INTO "historial_reserva" ("estado", "fecha_estado", "id_reserva", "id_usuario")
  VALUES ('CONFIRMADA', CURRENT_DATE, reservation_id, user_id);
  
  -- Add equipment for this reservation
  INSERT INTO "boleta_equipamiento" ("cantidad", "monto_total", "id_reserva", "id_equipamiento")
  VALUES
    (2, 10000, reservation_id, (SELECT id_equipamiento FROM equipamiento WHERE nombre = 'Paleta Pro' LIMIT 1)),
    (1, 500, reservation_id, (SELECT id_equipamiento FROM equipamiento WHERE nombre = 'Pelotas (pack x3)' LIMIT 1));
    
  -- Add transaction for equipment rental
  INSERT INTO "transaccion" ("fecha", "id_boleta_equipamiento")
  VALUES (CURRENT_DATE, (SELECT id_boleta FROM boleta_equipamiento WHERE id_reserva = reservation_id LIMIT 1));
END $$;

-- ======================
-- COMPLETION MESSAGE
-- ======================

DO $$
BEGIN
    RAISE NOTICE '======================================================';
    RAISE NOTICE 'PadelUcn database schema successfully created!';
    RAISE NOTICE '------------------------------------------------------';
    RAISE NOTICE 'Admin user: admin@padelucn.cl / password: admin123';
    RAISE NOTICE 'Test users: juan@example.com, maria@example.com, carlos@example.com';
    RAISE NOTICE 'Test user password: usuario123';
    RAISE NOTICE '======================================================';
END $$;
