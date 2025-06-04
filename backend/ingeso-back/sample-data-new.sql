-- sample-data-new.sql
-- Inserting sample data for Usuario (Users)
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contraseña", "telefono", "saldo", "is_admin") VALUES
  ('11111111-1', 'Admin Usuario', 'admin@padelucn.cl', '$2b$10$OQM/JtW2FC1NC7Fz26/tue6l/QL1glcJZpT0IjCflV8Os5sdoG3JG', '+56911111111', 100000, true),  -- password: admin123
  ('22222222-2', 'Juan Pérez', 'juan@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56922222222', 50000, false),  -- password: usuario123
  ('33333333-3', 'María López', 'maria@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56933333333', 30000, false),  -- password: usuario123
  ('44444444-4', 'Carlos Rodríguez', 'carlos@example.com', '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO', '+56944444444', 25000, false);  -- password: usuario123

-- Inserting sample data for Cancha (Courts)
INSERT INTO "cancha" ("numero", "nombre", "descripcion", "mantenimiento", "cantidad_max_jugador", "valor") VALUES
  (1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', false, 4, 15000),
  (2, 'Cancha Secundaria', 'Cancha de pádel estándar', false, 4, 12000),
  (3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', false, 4, 18000);

-- Inserting sample data for Equipamiento (Equipment)
INSERT INTO "equipamiento" ("nombre", "tipo", "stock", "costo") VALUES
  ('Raqueta Pro', 'Raquetas', 10, 2000),
  ('Cinta grip', 'Accesorios', 30, 800),
  ('Pelotas (pack)', 'Pelotas', 20, 500),
  ('Protector facial', 'Protección', 15, 1500),
  ('Muñequera', 'Accesorios', 25, 300);

-- Inserting sample data for Bloque (Time blocks)
INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin") VALUES
  ('2025-06-02', '08:00:00', '09:00:00'),
  ('2025-06-02', '09:00:00', '10:00:00'),
  ('2025-06-02', '10:00:00', '11:00:00'),
  ('2025-06-02', '11:00:00', '12:00:00'),
  ('2025-06-02', '12:00:00', '13:00:00'),
  ('2025-06-02', '13:00:00', '14:00:00'),
  ('2025-06-02', '14:00:00', '15:00:00'),
  ('2025-06-02', '15:00:00', '16:00:00'),
  ('2025-06-02', '16:00:00', '17:00:00'),
  ('2025-06-02', '17:00:00', '18:00:00'),
  ('2025-06-02', '18:00:00', '19:00:00'),
  ('2025-06-02', '19:00:00', '20:00:00');

-- Inserting sample data for Reserva (Reservations)
INSERT INTO "reserva" ("fecha", "hora_inicio", "hora_termino", "id_cancha", "id_usuario", "id_bloque") VALUES
  ('2025-06-09', '09:00:00', '10:30:00', 2, 2, 2),
  ('2025-06-10', '10:00:00', '11:30:00', 1, 3, 3);

-- Inserting sample data for Jugador (Players)
INSERT INTO "jugador" ("nombre", "apellido", "rut", "edad", "id_reserva") VALUES
  ('Pedro', 'Gómez', '55555555-5', 30, 1),
  ('Laura', 'Martínez', '66666666-6', 28, 1),
  ('Carlos', 'Rodríguez', '77777777-7', 32, 2),
  ('Ana', 'García', '88888888-8', 27, 2);

-- Inserting sample data for HistorialReserva (Reservation History)
INSERT INTO "historial_reserva" ("estado", "fecha_estado", "id_reserva", "id_usuario") VALUES
  ('Pendiente', '2025-06-02', 1, 2),
  ('Confirmada', '2025-06-03', 1, 1),
  ('Pendiente', '2025-06-02', 2, 3);

-- Inserting sample data for BoletaEquipamiento (Equipment Invoices)
INSERT INTO "boleta_equipamiento" ("cantidad", "monto_total", "id_reserva", "id_equipamiento") VALUES
  (2, 4000, 1, 1),
  (1, 800, 1, 2),
  (3, 1500, 2, 3),
  (2, 3000, 2, 4);

-- Inserting sample data for Transaccion (Transactions)
INSERT INTO "transaccion" ("fecha", "id_boleta_equipamiento") VALUES
  ('2025-06-02', 1),
  ('2025-06-02', 2),
  ('2025-06-02', 3),
  ('2025-06-02', 4);
