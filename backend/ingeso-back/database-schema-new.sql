-- Limpieza de tablas en caso de existir para evitar conflictos
DROP TABLE IF EXISTS "BoletaEquipamiento" CASCADE;
DROP TABLE IF EXISTS "HistorialReserva" CASCADE;
DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Equipamiento" CASCADE;
DROP TABLE IF EXISTS "Cancha" CASCADE;
DROP TABLE IF EXISTS "Usuario" CASCADE;

-- Creación de tabla Usuario
CREATE TABLE "Usuario" (
    id_usuario SERIAL PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre_usuario VARCHAR NOT NULL,
    correo VARCHAR NOT NULL,
    contraseña VARCHAR NOT NULL,
    telefono VARCHAR,
    saldo INT NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Creación de tabla Cancha
CREATE TABLE "Cancha" (
    id_cancha SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    descripcion VARCHAR,
    mantenimiento BOOLEAN NOT NULL DEFAULT FALSE,
    valor INT NOT NULL
);

-- Creación de tabla Equipamiento
CREATE TABLE "Equipamiento" (
    id_equipamiento SERIAL PRIMARY KEY,
    tipo VARCHAR NOT NULL,
    nombre VARCHAR NOT NULL,
    stock INT NOT NULL,
    costo INT NOT NULL
);

-- Creación de tabla Reserva
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    id_cancha INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_cancha) REFERENCES "Cancha"(id_cancha),
    FOREIGN KEY (id_usuario) REFERENCES "Usuario"(id_usuario)
);

-- Creación de tabla HistorialReserva
CREATE TABLE "HistorialReserva" (
    id_historial SERIAL PRIMARY KEY,
    estado VARCHAR NOT NULL,
    fecha_estado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES "Reserva"(id_reserva),
    FOREIGN KEY (id_usuario) REFERENCES "Usuario"(id_usuario)
);

-- Creación de tabla BoletaEquipamiento
CREATE TABLE "BoletaEquipamiento" (
    id_historial SERIAL PRIMARY KEY,
    cantidad INT NOT NULL,
    monto_total INT NOT NULL,
    id_reserva INT NOT NULL,
    id_equipamiento INT NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES "Reserva"(id_reserva),
    FOREIGN KEY (id_equipamiento) REFERENCES "Equipamiento"(id_equipamiento)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_reserva_fecha ON "Reserva"(fecha);
CREATE INDEX idx_reserva_cancha ON "Reserva"(id_cancha);
CREATE INDEX idx_reserva_usuario ON "Reserva"(id_usuario);
CREATE INDEX idx_historial_reserva ON "HistorialReserva"(id_reserva);
CREATE INDEX idx_historial_usuario ON "HistorialReserva"(id_usuario);
