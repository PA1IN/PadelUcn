-- database-schema-new.sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS "transaccion" CASCADE;
DROP TABLE IF EXISTS "boleta_equipamiento" CASCADE;
DROP TABLE IF EXISTS "historial_reserva" CASCADE;
DROP TABLE IF EXISTS "jugador" CASCADE;
DROP TABLE IF EXISTS "reserva" CASCADE;
DROP TABLE IF EXISTS "bloque" CASCADE;
DROP TABLE IF EXISTS "cancha" CASCADE;
DROP TABLE IF EXISTS "equipamiento" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- Create Usuario table
CREATE TABLE "usuario" (
    "id_usuario" SERIAL PRIMARY KEY,
    "rut" VARCHAR(12) NOT NULL UNIQUE,
    "nombre_usuario" VARCHAR NOT NULL,
    "correo" VARCHAR NOT NULL,
    "contrasena" VARCHAR NOT NULL,
    "telefono" VARCHAR,
    "saldo" INT NOT NULL DEFAULT 0,
    "is_admin" BOOLEAN NOT NULL DEFAULT false
);

-- Create Cancha table
CREATE TABLE "cancha" (
    "id_cancha" SERIAL PRIMARY KEY,
    "numero" INT NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR,
    "mantenimiento" BOOLEAN NOT NULL DEFAULT false,
    "cantidad_max_jugador" INT NOT NULL DEFAULT 4,
    "valor" INT NOT NULL
);

-- Create Bloque table
CREATE TABLE "bloque" (
    "id_bloque" SERIAL PRIMARY KEY,
    "fecha_date" DATE NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL
);

-- Create Equipamiento table
CREATE TABLE "equipamiento" (
    "id_equipamiento" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "tipo" VARCHAR NOT NULL,
    "stock" INT NOT NULL,
    "costo" INT NOT NULL
);

-- Create Reserva table
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

-- Create Jugador table
CREATE TABLE "jugador" (
    "id_jugador" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "edad" INT NOT NULL,
    "id_reserva" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE
);

-- Create HistorialReserva table
CREATE TABLE "historial_reserva" (
    "id_historial" SERIAL PRIMARY KEY,
    "estado" VARCHAR NOT NULL,
    "fecha_estado" DATE NOT NULL,
    "id_reserva" INT NOT NULL,
    "id_usuario" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE,
    FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE
);

-- Create BoletaEquipamiento table
CREATE TABLE "boleta_equipamiento" (
    "id_boleta" SERIAL PRIMARY KEY,
    "cantidad" INT NOT NULL,
    "monto_total" INT NOT NULL,
    "id_reserva" INT NOT NULL,
    "id_equipamiento" INT NOT NULL,
    FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE,
    FOREIGN KEY ("id_equipamiento") REFERENCES "equipamiento"("id_equipamiento") ON DELETE CASCADE
);

-- Create Transaccion table
CREATE TABLE "transaccion" (
    "id_transaccion" SERIAL PRIMARY KEY,
    "fecha" DATE NOT NULL,
    "id_boleta_equipamiento" INTEGER,
    FOREIGN KEY ("id_boleta_equipamiento") REFERENCES "boleta_equipamiento"("id_boleta") ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_reserva_fecha ON reserva(fecha);
CREATE INDEX idx_reserva_usuario ON reserva(id_usuario);
CREATE INDEX idx_reserva_cancha ON reserva(id_cancha);
CREATE INDEX idx_historial_reserva ON historial_reserva(id_reserva);
CREATE INDEX idx_jugador_reserva ON jugador(id_reserva);
CREATE INDEX idx_boleta_reserva ON boleta_equipamiento(id_reserva);
