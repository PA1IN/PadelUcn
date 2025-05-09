-- Script SQL para crear la estructura de base de datos para PadelUcn
-- Generado a partir de las entidades TypeORM

-- Eliminar tablas si existen para evitar conflictos
DROP TABLE IF EXISTS "boleta_equipamiento" CASCADE;
DROP TABLE IF EXISTS "reserva" CASCADE;
DROP TABLE IF EXISTS "equipamiento" CASCADE;
DROP TABLE IF EXISTS "cancha" CASCADE;
DROP TABLE IF EXISTS "admin" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Crear tabla User
CREATE TABLE "user" (
  "rut" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "nombre" VARCHAR NOT NULL,
  "correo" VARCHAR,
  PRIMARY KEY ("rut")
);

-- Crear tabla Admin
CREATE TABLE "admin" (
  "id_admin" SERIAL NOT NULL,
  "nombre_usuario" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  PRIMARY KEY ("id_admin")
);

-- Crear tabla Cancha
CREATE TABLE "cancha" (
  "numero" INTEGER NOT NULL,
  "costo" INTEGER NOT NULL,
  PRIMARY KEY ("numero")
);

-- Crear tabla Equipamiento
CREATE TABLE "equipamiento" (
  "id_equipamiento" SERIAL NOT NULL,
  "tipo" VARCHAR NOT NULL,
  "costo" INTEGER NOT NULL,
  "stock" INTEGER NOT NULL,
  PRIMARY KEY ("id_equipamiento")
);

-- Crear tabla Reserva
CREATE TABLE "reserva" (
  "id_reserva" SERIAL NOT NULL,
  "fecha" DATE NOT NULL,
  "hora_inicio" TIME NOT NULL,
  "hora_termino" TIME NOT NULL,
  "rut_usuario" VARCHAR NOT NULL,
  "id_admin" INTEGER,
  "numero_cancha" INTEGER NOT NULL,
  PRIMARY KEY ("id_reserva"),
  CONSTRAINT "fk_reserva_user" FOREIGN KEY ("rut_usuario") REFERENCES "user" ("rut") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_reserva_admin" FOREIGN KEY ("id_admin") REFERENCES "admin" ("id_admin") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "fk_reserva_cancha" FOREIGN KEY ("numero_cancha") REFERENCES "cancha" ("numero") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear tabla BoletaEquipamiento
CREATE TABLE "boleta_equipamiento" (
  "id_boleta" SERIAL NOT NULL,
  "rut_usuario" VARCHAR NOT NULL,
  "id_reserva" INTEGER NOT NULL,
  "id_equipamiento" INTEGER NOT NULL,
  "cantidad" INTEGER NOT NULL,
  PRIMARY KEY ("id_boleta"),
  CONSTRAINT "fk_boleta_user" FOREIGN KEY ("rut_usuario") REFERENCES "user" ("rut") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_boleta_reserva" FOREIGN KEY ("id_reserva") REFERENCES "reserva" ("id_reserva") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "fk_boleta_equipamiento" FOREIGN KEY ("id_equipamiento") REFERENCES "equipamiento" ("id_equipamiento") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX "idx_reserva_fecha" ON "reserva" ("fecha");
CREATE INDEX "idx_reserva_usuario" ON "reserva" ("rut_usuario");
CREATE INDEX "idx_boleta_reserva" ON "boleta_equipamiento" ("id_reserva");