-- Insert admin user and regular users
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contraseña", "telefono", "saldo", "is_admin") 
VALUES 
('11111111-1', 'Admin User', 'admin@padelucn.cl', '$2b$10$X/QK0SjdpJPTtMCvUYDGcOG9VBZEveubOJnX89HkUzA3wLNNLIX0C', '+56912345678', 0, true),
('22222222-2', 'Juan Pérez', 'juan@example.com', '$2b$10$X/QK0SjdpJPTtMCvUYDGcOG9VBZEveubOJnX89HkUzA3wLNNLIX0C', '+56987654321', 50000, false),
('33333333-3', 'María López', 'maria@example.com', '$2b$10$X/QK0SjdpJPTtMCvUYDGcOG9VBZEveubOJnX89HkUzA3wLNNLIX0C', '+56911223344', 75000, false);

-- Insert courts
INSERT INTO "cancha" ("numero", "nombre", "descripcion", "mantenimiento", "cantidad_max_jugador", "valor") 
VALUES 
(1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', false, 4, 15000),
(2, 'Cancha Secundaria', 'Cancha de pádel estándar', false, 4, 12000),
(3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', false, 4, 18000);

-- Insert time blocks for today and next few days
INSERT INTO "bloque" ("fecha_date", "hora_inicio", "hora_fin")
VALUES
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
(CURRENT_DATE + 1, '08:00:00', '09:00:00'),
(CURRENT_DATE + 1, '09:00:00', '10:00:00'),
(CURRENT_DATE + 1, '10:00:00', '11:00:00');

-- Insert equipment
INSERT INTO "equipamiento" ("nombre", "tipo", "stock", "costo") 
VALUES 
('Raqueta Pro', 'Raqueta', 10, 2000),
('Cinta grip', 'Accesorio', 30, 800),
('Pelotas (pack)', 'Pelotas', 20, 500),
('Protector facial', 'Protección', 15, 1500);

-- Insert a sample reservation
INSERT INTO "reserva" ("fecha", "hora_inicio", "hora_termino", "id_cancha", "id_usuario", "id_bloque") 
VALUES 
(CURRENT_DATE + 7, '10:00:00', '11:30:00', 1, 2, 3);

-- Insert players for the reservation
INSERT INTO "jugador" ("nombre", "apellido", "rut", "edad", "id_reserva") 
VALUES 
('Carlos', 'Rodríguez', '44444444-4', 28, 1),
('Ana', 'García', '55555555-5', 32, 1);

-- Insert reservation history
INSERT INTO "historial_reserva" ("estado", "fecha_estado", "id_reserva", "id_usuario") 
VALUES 
('Pendiente', CURRENT_DATE, 1, 2);

-- Insert equipment invoice
INSERT INTO "boleta_equipamiento" ("cantidad", "monto_total", "id_reserva", "id_equipamiento") 
VALUES 
(2, 4000, 1, 1),
(4, 2000, 1, 3);

-- Insert transaction
INSERT INTO "transaccion" ("fecha", "id_boleta_equipamiento") 
VALUES 
(CURRENT_DATE, 1);