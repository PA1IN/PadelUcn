-- Eliminación de tablas existentes en orden inverso de dependencia
DROP TABLE IF EXISTS "boleta_equipamiento" CASCADE;
DROP TABLE IF EXISTS "historial_reserva" CASCADE;
DROP TABLE IF EXISTS "reserva" CASCADE;
DROP TABLE IF EXISTS "equipamiento" CASCADE;
DROP TABLE IF EXISTS "cancha" CASCADE;
DROP TABLE IF EXISTS "admin" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- Creación de la tabla usuario con el nuevo campo is_admin
CREATE TABLE "usuario" (
  "id_usuario" SERIAL PRIMARY KEY,
  "rut" VARCHAR(12) NOT NULL UNIQUE,
  "nombre_usuario" VARCHAR NOT NULL,
  "correo" VARCHAR NOT NULL,
  "contraseña" VARCHAR NOT NULL,
  "telefono" VARCHAR,
  "saldo" INT NOT NULL DEFAULT 0,
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "usuario_rut_check" CHECK (LENGTH("rut") BETWEEN 8 AND 12)
);

-- Creación de la tabla cancha con el nuevo campo mantenimiento
CREATE TABLE "cancha" (
  "id_cancha" SERIAL PRIMARY KEY,
  "numero" INT NOT NULL UNIQUE,
  "nombre" VARCHAR NOT NULL,
  "descripcion" VARCHAR,
  "mantenimiento" BOOLEAN NOT NULL DEFAULT FALSE,
  "valor" INT NOT NULL
);

-- Tabla equipamiento
CREATE TABLE "equipamiento" (
  "id_equipamiento" SERIAL PRIMARY KEY,
  "tipo" VARCHAR NOT NULL,
  "stock" INT NOT NULL,
  "costo" INT NOT NULL,
  "nombre" VARCHAR NOT NULL
);

-- Tabla reserva
CREATE TABLE "reserva" (
  "id_reserva" SERIAL PRIMARY KEY,
  "fecha" DATE NOT NULL,
  "hora_inicio" TIME NOT NULL,
  "hora_termino" TIME NOT NULL,
  "id_cancha" INT NOT NULL,
  "id_usuario" INT NOT NULL,
  CONSTRAINT "fk_cancha" FOREIGN KEY ("id_cancha") REFERENCES "cancha" ("id_cancha") ON DELETE CASCADE,
  CONSTRAINT "fk_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE
);

-- Tabla historial_reserva con los nuevos campos
CREATE TABLE "historial_reserva" (
  "id_historial" SERIAL PRIMARY KEY,
  "estado" VARCHAR NOT NULL CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente')),
  "fecha_estado" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "id_reserva" INT NOT NULL,
  "id_usuario" INT NOT NULL,
  CONSTRAINT "fk_reserva" FOREIGN KEY ("id_reserva") REFERENCES "reserva" ("id_reserva") ON DELETE CASCADE,
  CONSTRAINT "fk_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE CASCADE
);

-- Tabla boleta_equipamiento
CREATE TABLE "boleta_equipamiento" (
  "id_historial" SERIAL PRIMARY KEY,
  "cantidad" INT NOT NULL,
  "monto_total" INT NOT NULL,
  "id_reserva" INT NOT NULL,
  "id_equipamiento" INT NOT NULL,
  CONSTRAINT "fk_reserva" FOREIGN KEY ("id_reserva") REFERENCES "reserva" ("id_reserva") ON DELETE CASCADE,
  CONSTRAINT "fk_equipamiento" FOREIGN KEY ("id_equipamiento") REFERENCES "equipamiento" ("id_equipamiento") ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento de las búsquedas
CREATE INDEX "idx_reserva_fecha" ON "reserva" ("fecha");
CREATE INDEX "idx_reserva_usuario" ON "reserva" ("id_usuario");
CREATE INDEX "idx_reserva_cancha" ON "reserva" ("id_cancha");
CREATE INDEX "idx_historial_reserva_estado" ON "historial_reserva" ("estado");
CREATE INDEX "idx_historial_reserva_reserva" ON "historial_reserva" ("id_reserva");
CREATE INDEX "idx_boleta_reserva" ON "boleta_equipamiento" ("id_reserva");
