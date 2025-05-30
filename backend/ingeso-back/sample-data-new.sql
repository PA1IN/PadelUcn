-- Insertar datos de ejemplo en la tabla Usuario
INSERT INTO "Usuario" (rut, nombre_usuario, correo, contraseña, telefono, saldo, is_admin)
VALUES 
    ('12345678-9', 'Administrador', 'admin@padelucn.cl', '$2a$10$XgoWDfZ3zOZsK5IqWBjiE.GpWSIw39zC7ZUzJGtj7Cpa0YZ3TQ6S2', '+56912345678', 100000, TRUE), -- Contraseña: admin123
    ('98765432-1', 'Usuario Normal', 'usuario@padelucn.cl', '$2a$10$Fr2OskMBwFFcmCLtpE9A7.lYUOZEUpgh5H.JC5QvzvnGMXG9ZkZj.', '+56998765432', 50000, FALSE), -- Contraseña: usuario123
    ('11111111-1', 'Juan Pérez', 'juan@example.com', '$2a$10$43JE8Nq.X6Z8pweXvbO0HOTenLpHnf4P9YbcJpqN8DZI1l/quoLa6', '+56911111111', 75000, FALSE), -- Contraseña: juanperez
    ('22222222-2', 'María González', 'maria@example.com', '$2a$10$IPJl1E8v9OEQwQwVPMAu8eJxhHm15XW0YspjqGy5Z5AouboeKYXoC', '+56922222222', 60000, FALSE); -- Contraseña: mariagonzalez

-- Insertar datos de ejemplo en la tabla Cancha
INSERT INTO "Cancha" (nombre, descripcion, mantenimiento, valor)
VALUES 
    ('Cancha Principal', 'Cancha de alta competencia con iluminación LED', FALSE, 15000),
    ('Cancha Secundaria', 'Cancha con piso de última generación', FALSE, 12000),
    ('Cancha Exterior', 'Cancha al aire libre con vista panorámica', FALSE, 10000),
    ('Cancha VIP', 'Cancha exclusiva con servicios premium', FALSE, 20000);

-- Insertar datos de ejemplo en la tabla Equipamiento
INSERT INTO "Equipamiento" (tipo, nombre, stock, costo)
VALUES 
    ('Paleta', 'Paleta Profesional', 20, 5000),
    ('Paleta', 'Paleta Intermedia', 30, 3000),
    ('Pelota', 'Pack 3 Pelotas', 50, 1500),
    ('Indumentaria', 'Camiseta Oficial', 25, 2000),
    ('Indumentaria', 'Short Deportivo', 25, 1800);

-- Insertar datos de ejemplo en la tabla Reserva (fechas actuales para pruebas)
INSERT INTO "Reserva" (fecha, hora_inicio, hora_termino, id_cancha, id_usuario)
VALUES 
    ('2025-05-30', '10:00:00', '11:00:00', 1, 2),
    ('2025-05-30', '16:00:00', '17:00:00', 2, 3),
    ('2025-06-01', '18:00:00', '19:00:00', 3, 4),
    ('2025-06-02', '09:00:00', '10:00:00', 4, 2);

-- Insertar datos de ejemplo en la tabla HistorialReserva
INSERT INTO "HistorialReserva" (estado, fecha_estado, id_reserva, id_usuario)
VALUES 
    ('Pendiente', '2025-05-25 14:30:00', 1, 2),
    ('Pendiente', '2025-05-26 10:15:00', 2, 3),
    ('Pendiente', '2025-05-27 09:45:00', 3, 4),
    ('Pendiente', '2025-05-28 16:20:00', 4, 2);

-- Insertar datos de ejemplo en la tabla BoletaEquipamiento
INSERT INTO "BoletaEquipamiento" (cantidad, monto_total, id_reserva, id_equipamiento)
VALUES 
    (2, 10000, 1, 1),
    (1, 3000, 2, 2),
    (2, 3000, 3, 3),
    (1, 2000, 4, 4);
