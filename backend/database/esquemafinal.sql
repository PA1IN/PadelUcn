-- Eliminar tablas existentes (si es que existen)
DROP TABLE IF EXISTS "transaccion" CASCADE;
DROP TABLE IF EXISTS "boleta_equipamiento" CASCADE;
DROP TABLE IF EXISTS "historial_reserva" CASCADE;
DROP TABLE IF EXISTS "jugador" CASCADE;
DROP TABLE IF EXISTS "reserva" CASCADE;
DROP TABLE IF EXISTS "bloque" CASCADE;
DROP TABLE IF EXISTS "cancha" CASCADE;
DROP TABLE IF EXISTS "equipamiento" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;


-- Usuario
CREATE TABLE IF NOT EXISTS usuario(
    id_usuario SERIAL PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre_usuario VARCHAR NOT NULL,
    correo VARCHAR NOT NULL,
    contrasena VARCHAR NOT NULL,
    telefono VARCHAR,
    saldo INT NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT false
);

-- Canchas
CREATE TABLE IF NOT EXISTS cancha(
    id_cancha SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    nombre VARCHAR NOT NULL,
    descripcion VARCHAR,
    mantenimiento BOOLEAN NOT NULL DEFAULT false,
    cantidad_max_jugador INT NOT NULL DEFAULT 4,
    valor INT NOT NULL
);

-- Bloque table
CREATE TABLE IF NOT EXISTS bloque (
      id_bloque SERIAL PRIMARY KEY,
    fecha_date DATE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT true,
    dias VARCHAR DEFAULT 'Lunes a Viernes'
);

-- Equipamiento table 
CREATE TABLE IF NOT EXISTS equipamiento (
    id_equipamiento SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL,
    stock INT NOT NULL,
    costo INT NOT NULL
);
-- Reserva
CREATE TABLE IF NOT EXISTS reserva(
    id_reserva SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA')),
    id_cancha INT NOT NULL,
    id_usuario INT NOT NULL,
    id_bloque INT,
<<<<<<< Updated upstream
    existe BOOLEAN
=======
    existe BOOLEAN,
>>>>>>> Stashed changes
    FOREIGN KEY (id_cancha) REFERENCES cancha(id_cancha) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_bloque) REFERENCES bloque(id_bloque) ON DELETE SET NULL
);

-- Jugador
CREATE TABLE IF NOT EXISTS jugador (
    id_jugador SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    rut VARCHAR(12) NOT NULL,
    edad INT NOT NULL,
    id_reserva INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE
);

-- HistorialReserva
CREATE TABLE IF NOT EXISTS historial_reserva(
    id_historial SERIAL PRIMARY KEY,
    estado VARCHAR NOT NULL,
    observaciones TEXT,
    fecha_estado DATE NOT NULL,
    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- BoletaEquipamiento
CREATE TABLE IF NOT EXISTS boleta_equipamiento(
    id_boleta SERIAL PRIMARY KEY,
    cantidad INT NOT NULL,
    monto_total INT NOT NULL,
    id_reserva INT NOT NULL,
    id_equipamiento INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_equipamiento) REFERENCES equipamiento(id_equipamiento) ON DELETE CASCADE
);

-- Transaccion
CREATE TABLE IF NOT EXISTS transaccion(
    id_transaccion SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    id_boleta_equipamiento INT,
    FOREIGN KEY (id_boleta_equipamiento) REFERENCES boleta_equipamiento(id_boleta) ON DELETE SET NULL
);
-- indices para la optimizacion de consultas
CREATE INDEX idx_usuario_rut ON usuario("rut");
CREATE INDEX idx_reserva_fecha ON reserva("fecha");
CREATE INDEX idx_reserva_usuario ON reserva("id_usuario");
CREATE INDEX idx_reserva_cancha ON reserva("id_cancha");
CREATE INDEX idx_historial_reserva ON historial_reserva("id_reserva");
CREATE INDEX idx_jugador_reserva ON jugador("id_reserva");
CREATE INDEX idx_boleta_reserva ON boleta_equipamiento("id_reserva");
CREATE INDEX idx_bloque_fecha ON bloque("fecha_date");
CREATE INDEX idx_reserva_estado ON reserva("estado");


-- Datos de usuarios
INSERT INTO usuario (rut, nombre_usuario, correo, contrasena, telefono, saldo, is_admin) VALUES
  ('11111111-1', 'Admin Usuario', 'admin@padelucn.cl', '$2b$10$yLNEPCflLJ53G4efjiwxJu7JBehQtcWD2xkap3t8sYad3jNEP4WjK', '+56911111111', 100000, true),
  ('22222222-2', 'Juan Pérez', 'juan@example.com', '$2b$10$nAnrkFmQgrj9rAOkEE4.z.8RwcIfih3YFmr9TkwcXjlaTMELLHlqO', '+56922222222', 50000, false), 
  ('33333333-3', 'María López', 'maria@example.com', '$2b$10$nAnrkFmQgrj9rAOkEE4.z.8RwcIfih3YFmr9TkwcXjlaTMELLHlqO', '+56933333333', 30000, false),
  ('44444444-4', 'Carlos Rodríguez', 'carlos@example.com', '$2b$10$nAnrkFmQgrj9rAOkEE4.z.8RwcIfih3YFmr9TkwcXjlaTMELLHlqO', '+56944444444', 25000, false);

-- Insert sample courts
INSERT INTO cancha (numero, nombre, descripcion, mantenimiento, cantidad_max_jugador, valor) VALUES
  (1, 'Cancha Principal', 'Cancha de pádel profesional con paredes de cristal', false, 4, 15000),
  (2, 'Cancha Secundaria', 'Cancha de pádel estándar', false, 4, 12000),
  (3, 'Cancha Techada', 'Cancha de pádel techada para uso en días lluviosos', false, 4, 18000);

-- Insert equipment
INSERT INTO equipamiento (nombre, tipo, stock, costo) VALUES
  ('Raqueta Pro', 'Raquetas', 10, 2000),
  ('Cinta grip', 'Accesorios', 30, 800),
  ('Pelotas (pack)', 'Pelotas', 20, 500),
  ('Protector facial', 'Protección', 15, 1500),
  ('Muñequera', 'Accesorios', 25, 300);


-- Bloques de 80 minutos (1h 20min) y 120 minutos (2h)
INSERT INTO bloque (fecha_date, hora_inicio, hora_fin) VALUES
  -- Día 1 (hoy) - Bloques de 80 minutos
  (CURRENT_DATE, '08:00:00', '09:20:00'),
  (CURRENT_DATE, '09:40:00', '11:00:00'),
  (CURRENT_DATE, '11:20:00', '12:40:00'),
  (CURRENT_DATE, '13:00:00', '14:20:00'),
  (CURRENT_DATE, '14:40:00', '16:00:00'),
  (CURRENT_DATE, '16:20:00', '17:40:00'),
  (CURRENT_DATE, '18:00:00', '19:20:00'),
  
  -- Día 1 (hoy) - Bloques de 120 minutos
  (CURRENT_DATE, '08:00:00', '10:00:00'),
  (CURRENT_DATE, '10:20:00', '12:20:00'),
  (CURRENT_DATE, '12:40:00', '14:40:00'),
  (CURRENT_DATE, '15:00:00', '17:00:00'),
  (CURRENT_DATE, '17:20:00', '19:20:00'),
  
  -- Día 2
  (CURRENT_DATE + INTERVAL '1 day', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '1 day', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '1 day', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '1 day', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '1 day', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '1 day', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '1 day', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '1 day', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', '17:20:00', '19:20:00'),
  
  -- Día 3
  (CURRENT_DATE + INTERVAL '2 days', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '2 days', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '2 days', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '2 days', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '2 days', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '2 days', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '2 days', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '2 days', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '2 days', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '2 days', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '2 days', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '2 days', '17:20:00', '19:20:00'),
  
  -- Día 4
  (CURRENT_DATE + INTERVAL '3 days', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '3 days', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '3 days', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '3 days', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '3 days', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '3 days', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '3 days', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '3 days', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '3 days', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '3 days', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '3 days', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '3 days', '17:20:00', '19:20:00'),
  
  -- Día 5
  (CURRENT_DATE + INTERVAL '4 days', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '4 days', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '4 days', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '4 days', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '4 days', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '4 days', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '4 days', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '4 days', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '4 days', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '4 days', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '4 days', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '4 days', '17:20:00', '19:20:00'),
  
  -- Día 6
  (CURRENT_DATE + INTERVAL '5 days', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '5 days', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '5 days', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '5 days', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '5 days', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '5 days', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '5 days', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '5 days', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '5 days', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '5 days', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '5 days', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '5 days', '17:20:00', '19:20:00'),
  
  -- Día 7 (último día de la semana)
  (CURRENT_DATE + INTERVAL '6 days', '08:00:00', '09:20:00'),
  (CURRENT_DATE + INTERVAL '6 days', '09:40:00', '11:00:00'),
  (CURRENT_DATE + INTERVAL '6 days', '11:20:00', '12:40:00'),
  (CURRENT_DATE + INTERVAL '6 days', '13:00:00', '14:20:00'),
  (CURRENT_DATE + INTERVAL '6 days', '14:40:00', '16:00:00'),
  (CURRENT_DATE + INTERVAL '6 days', '16:20:00', '17:40:00'),
  (CURRENT_DATE + INTERVAL '6 days', '18:00:00', '19:20:00'),
  (CURRENT_DATE + INTERVAL '6 days', '08:00:00', '10:00:00'),
  (CURRENT_DATE + INTERVAL '6 days', '10:20:00', '12:20:00'),
  (CURRENT_DATE + INTERVAL '6 days', '12:40:00', '14:40:00'),
  (CURRENT_DATE + INTERVAL '6 days', '15:00:00', '17:00:00'),
  (CURRENT_DATE + INTERVAL '6 days', '17:20:00', '19:20:00');


INSERT INTO reserva (fecha, hora_inicio, hora_termino, estado, id_cancha, id_usuario, id_bloque) VALUES
  (CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:30:00', 'PENDIENTE', 2, 2, 2),
  (CURRENT_DATE + INTERVAL '2 days', '10:00:00', '11:30:00', 'CONFIRMADA', 1, 3, 3),
  (CURRENT_DATE + INTERVAL '3 days', '14:00:00', '15:30:00', 'PENDIENTE', 1, 2, NULL),
  (CURRENT_DATE + INTERVAL '4 days', '16:00:00', '17:30:00', 'CANCELADA', 3, 4, NULL);

-- Insert sample players
INSERT INTO jugador (nombre, apellido, rut, edad, id_reserva) VALUES
  ('Pedro', 'Gómez', '55555555-5', 30, 1),
  ('Laura', 'Martínez', '66666666-6', 28, 1),
  ('Carlos', 'Rodríguez', '77777777-7', 32, 2),
  ('Ana', 'García', '88888888-8', 27, 2);

-- Insert sample reservation history
INSERT INTO historial_reserva (estado, observaciones, id_reserva, id_usuario) VALUES
  ('PENDIENTE', 'Reserva creada automáticamente', 1, 2),
  ('CONFIRMADA', 'Usuario confirmó su reserva', 2, 3),
  ('PENDIENTE', 'Reserva en espera de confirmación', 3, 2),
  ('CANCELADA', 'Usuario canceló por motivos personales', 4, 4);

-- Insert sample equipment invoices
INSERT INTO boleta_equipamiento (cantidad, monto_total, id_reserva, id_equipamiento) VALUES
  (2, 4000, 1, 1),
  (1, 800, 1, 2),
  (3, 1500, 2, 3),
  (2, 3000, 2, 4);

-- Insert sample transactions
INSERT INTO transaccion (fecha, id_boleta_equipamiento) VALUES
  (CURRENT_DATE, 1),
  (CURRENT_DATE, 2),
  (CURRENT_DATE, 3),
  (CURRENT_DATE, 4);

DO $$
BEGIN
    RAISE NOTICE 'PadelUcn database schema successfully created!';
    RAISE NOTICE 'Admin user: admin@padelucn.cl / password: admin123';
    RAISE NOTICE 'Test users: juan@example.com, maria@example.com, carlos@example.com / password: usuario123';
END $$;

-- son validaciones, para asi no sobre cargar los datos xd
ALTER TABLE usuario ADD CONSTRAINT check_saldo_positive CHECK (saldo >= 0);
ALTER TABLE reserva ADD CONSTRAINT check_hora_logica CHECK (hora_inicio < hora_termino);
ALTER TABLE cancha ADD CONSTRAINT check_valor_positive CHECK (valor > 0);
ALTER TABLE equipamiento ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);
ALTER TABLE equipamiento ADD CONSTRAINT check_costo_positive CHECK (costo > 0);

-- se supone que con esto deberiamos poder hacer un seguimiento, tipo saber que usuarios se registraron hoy o etc (por si llegara a servir)
ALTER TABLE reserva ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE reserva ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuario ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuario ADD COLUMN last_login TIMESTAMP;

-- Función para actualizar updated_at automáticamente, asi no sobre cargo los service de los modulos y solo llamo esat query
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
-- aqui para aplicar la funcion de forma automatica
CREATE TRIGGER update_reserva_updated_at 
    BEFORE UPDATE ON reserva 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuario_updated_at_if_exists
    BEFORE UPDATE ON usuario 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancha_updated_at 
    BEFORE UPDATE ON cancha 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
