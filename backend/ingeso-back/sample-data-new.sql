-- Datos de ejemplo para el nuevo esquema de PadelUCN
-- Este script inserta datos de muestra en todas las tablas del sistema

-- Insertar usuarios (algunos con privilegios de admin)
INSERT INTO "usuario" ("rut", "nombre_usuario", "correo", "contraseña", "telefono", "saldo", "is_admin") 
VALUES
    ('11111111-1', 'Admin Principal', 'admin@padelucn.cl', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', '+56912345678', 0, TRUE),
    ('22222222-2', 'Usuario Normal', 'usuario@padelucn.cl', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', '+56912345677', 5000, FALSE),
    ('33333333-3', 'Admin Secundario', 'admin2@padelucn.cl', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', '+56912345676', 0, TRUE),
    ('44444444-4', 'Usuario Premium', 'premium@padelucn.cl', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', '+56912345675', 10000, FALSE),
    ('55555555-5', 'Usuario Regular', 'regular@padelucn.cl', '$2a$10$6j7wuOXZT5lKO.hUkyyxEu9AUqDbdPTOwrKVdvNw2m5.6aGH89Hqu', '+56912345674', 2000, FALSE);

-- Nota: Las contraseñas están hasheadas, todas son "password123"

-- Insertar canchas (algunas en mantenimiento)
INSERT INTO "cancha" ("numero", "nombre", "descripcion", "mantenimiento", "valor") 
VALUES
    (1, 'Cancha Principal', 'Cancha principal con iluminación premium', FALSE, 5000),
    (2, 'Cancha Secundaria', 'Cancha con vista a las montañas', FALSE, 4000),
    (3, 'Cancha Cubierta', 'Cancha techada para días lluviosos', FALSE, 6000),
    (4, 'Cancha de Exhibición', 'Cancha con graderías para torneos', TRUE, 8000),
    (5, 'Cancha de Entrenamiento', 'Cancha para clases y entrenamientos', FALSE, 3500);

-- Insertar equipamiento
INSERT INTO "equipamiento" ("tipo", "nombre", "stock", "costo") 
VALUES
    ('Raqueta', 'Raqueta Profesional', 10, 2000),
    ('Raqueta', 'Raqueta Intermedia', 15, 1500),
    ('Pelota', 'Pelotas (Pack 3)', 30, 500),
    ('Complemento', 'Muñequera', 20, 300),
    ('Complemento', 'Visera', 15, 400),
    ('Complemento', 'Grip', 25, 250);

-- Insertar reservas
INSERT INTO "reserva" ("fecha", "hora_inicio", "hora_termino", "id_cancha", "id_usuario") 
VALUES
    ('2025-05-20', '09:00:00', '10:30:00', 1, 2),  -- Usuario Normal en Cancha Principal
    ('2025-05-20', '11:00:00', '12:30:00', 2, 4),  -- Usuario Premium en Cancha Secundaria
    ('2025-05-21', '16:00:00', '17:30:00', 3, 5),  -- Usuario Regular en Cancha Cubierta
    ('2025-05-22', '18:00:00', '19:30:00', 5, 2),  -- Usuario Normal en Cancha de Entrenamiento
    ('2025-05-23', '14:00:00', '15:30:00', 1, 4);  -- Usuario Premium en Cancha Principal

-- Insertar historial de reservas
INSERT INTO "historial_reserva" ("estado", "fecha_estado", "id_reserva", "id_usuario") 
VALUES
    ('Pendiente', '2025-05-18 08:30:00', 1, 2),     -- Reserva 1: creación inicial
    ('Modificado', '2025-05-18 09:15:00', 1, 2),    -- Reserva 1: modificación
    ('Pendiente', '2025-05-18 10:00:00', 2, 4),     -- Reserva 2: creación inicial
    ('Cancelado', '2025-05-18 12:30:00', 3, 5),     -- Reserva 3: cancelación
    ('Pendiente', '2025-05-18 14:45:00', 4, 2),     -- Reserva 4: creación inicial
    ('Completado', '2025-05-18 15:20:00', 5, 4);    -- Reserva 5: completada

-- Insertar boletas de equipamiento
INSERT INTO "boleta_equipamiento" ("cantidad", "monto_total", "id_reserva", "id_equipamiento") 
VALUES
    (1, 2000, 1, 1),    -- Reserva 1: Raqueta Profesional
    (2, 1000, 1, 3),    -- Reserva 1: 2 packs de Pelotas
    (1, 1500, 2, 2),    -- Reserva 2: Raqueta Intermedia
    (3, 750, 4, 6),     -- Reserva 4: 3 Grips
    (1, 400, 5, 5);     -- Reserva 5: Visera
