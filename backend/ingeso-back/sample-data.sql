-- Datos de ejemplo para PadelUcn
-- Insertar después de ejecutar database-schema.sql

-- Usuarios (rut, password, nombre, correo)
INSERT INTO "user" VALUES ('12345678-9', 'password123', 'Juan Pérez', 'juanperez@email.com');
INSERT INTO "user" VALUES ('98765432-1', 'password456', 'María López', 'marialopez@email.com');
INSERT INTO "user" VALUES ('11111111-1', 'password789', 'Carlos Rodríguez', 'carlosrodriguez@email.com');
INSERT INTO "user" VALUES ('22222222-2', 'passwordabc', 'Ana Martínez', 'anamartinez@email.com');
INSERT INTO "user" VALUES ('33333333-3', 'passworddef', 'Pedro González', 'pedrogonzalez@email.com');

-- Administradores (nombre_usuario, password)
INSERT INTO "admin" (nombre_usuario, password) VALUES ('admin1', 'adminpass1');
INSERT INTO "admin" (nombre_usuario, password) VALUES ('admin2', 'adminpass2');

-- Canchas (numero, costo)
INSERT INTO "cancha" VALUES (1, 15000);
INSERT INTO "cancha" VALUES (2, 18000);
INSERT INTO "cancha" VALUES (3, 20000);
INSERT INTO "cancha" VALUES (4, 15000);

-- Equipamiento (tipo, costo, stock)
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Paleta Profesional', 5000, 10);
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Paleta Básica', 3000, 15);
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Set de Pelotas', 2000, 20);
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Muñequera', 1000, 30);
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Gorra', 2500, 15);
INSERT INTO "equipamiento" (tipo, costo, stock) VALUES ('Toalla', 1500, 25);

-- Reservas (fecha, hora_inicio, hora_termino, rut_usuario, id_admin, numero_cancha)
INSERT INTO "reserva" (fecha, hora_inicio, hora_termino, rut_usuario, id_admin, numero_cancha)
VALUES ('2025-05-05', '10:00', '12:00', '12345678-9', 1, 1);

INSERT INTO "reserva" (fecha, hora_inicio, hora_termino, rut_usuario, numero_cancha)
VALUES ('2025-05-05', '14:00', '16:00', '98765432-1', 2);

INSERT INTO "reserva" (fecha, hora_inicio, hora_termino, rut_usuario, id_admin, numero_cancha)
VALUES ('2025-05-06', '16:00', '18:00', '11111111-1', 2, 3);

INSERT INTO "reserva" (fecha, hora_inicio, hora_termino, rut_usuario, numero_cancha)
VALUES ('2025-05-07', '18:00', '20:00', '22222222-2', 1);

INSERT INTO "reserva" (fecha, hora_inicio, hora_termino, rut_usuario, id_admin, numero_cancha)
VALUES ('2025-05-08', '09:00', '11:00', '33333333-3', 1, 4);

-- Boletas de equipamiento (rut_usuario, id_reserva, id_equipamiento, cantidad)
INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('12345678-9', 1, 1, 2);

INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('12345678-9', 1, 3, 1);

INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('98765432-1', 2, 2, 2);

INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('11111111-1', 3, 3, 1);

INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('22222222-2', 4, 4, 2);

INSERT INTO "boleta_equipamiento" (rut_usuario, id_reserva, id_equipamiento, cantidad)
VALUES ('33333333-3', 5, 5, 1);