-- Inserción de datos para canchas
INSERT INTO cancha (numero, nombre, descripcion, valor, mantenimiento) 
VALUES 
(1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', 15000, false),
(2, 'Cancha Secundaria', 'Cancha de pádel estándar', 12000, false),
(3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', 18000, false),
(4, 'Cancha Exterior', 'Cancha de pádel al aire libre con vista panorámica', 14000, false),
(5, 'Cancha Panorámica', 'Cancha de pádel rodeada de jardines', 16000, false);

-- Inserción de datos para equipamiento
INSERT INTO equipamiento (tipo, nombre, stock, costo)
VALUES
('Raquetas', 'Raqueta Pro', 10, 2000),
('Accesorios', 'Cinta grip', 30, 800),
('Pelotas', 'Pelotas (pack)', 20, 500),
('Protección', 'Protector facial', 15, 1500),
('Ropa', 'Camiseta deportiva', 25, 1200),
('Calzado', 'Zapatillas de pádel', 12, 3500),
('Accesorios', 'Muñequeras (par)', 40, 600),
('Accesorios', 'Toalla deportiva', 20, 900);

-- Inserción de datos para bloques horarios
-- Solo se pueden reservar canchas de lunes a viernes, entre las 8:00 y las 20:00
INSERT INTO bloque (hora_inicio, hora_termino, activo, dias)
VALUES 
('08:00', '09:00', true, 'Lunes a Viernes'),
('09:00', '10:00', true, 'Lunes a Viernes'),
('10:00', '11:00', true, 'Lunes a Viernes'),
('11:00', '12:00', true, 'Lunes a Viernes'),
('12:00', '13:00', true, 'Lunes a Viernes'),
('13:00', '14:00', true, 'Lunes a Viernes'),
('14:00', '15:00', true, 'Lunes a Viernes'),
('15:00', '16:00', true, 'Lunes a Viernes'),
('16:00', '17:00', true, 'Lunes a Viernes'),
('17:00', '18:00', true, 'Lunes a Viernes'),
('18:00', '19:00', true, 'Lunes a Viernes'),
('19:00', '20:00', true, 'Lunes a Viernes');
