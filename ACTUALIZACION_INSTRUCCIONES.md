# Actualización del Backend de PadelUcn

## Cambios realizados

### 1. Docker Compose
- Se modificó el archivo `docker-compose.yml` para incluir los scripts de inicialización de la nueva base de datos:
  - Se agregó el archivo `database-schema-new.sql` como script de inicialización
  - Se agregó el archivo `sample-data-new.sql` para cargar datos de ejemplo

### 2. Entidades
- Se verificó la entidad **User** que ya estaba correctamente actualizada con:
  - Campo `isAdmin` para reemplazar el módulo de Admin
  - Tabla mapeada a `usuario` en lugar de `user`
  - Relación con `HistorialReserva` correctamente configurada

- Se actualizó la entidad **Cancha** para incluir:
  - Campo `mantenimiento` para indicar si una cancha está en mantenimiento

- Se verificó la entidad **HistorialReserva** que ya estaba correctamente implementada 

- Se actualizó la entidad **BoletaEquipamiento** para:
  - Eliminar la relación directa con User
  - Agregar el campo `montoTotal` requerido

### 3. DTOs
- Se modificó el DTO `CreateBoletaEquipamientoDto` para:
  - Eliminar el campo `rut_usuario` que ya no es necesario
  - Agregar el campo `monto_total` requerido en la nueva estructura

- Se modificó el DTO `CreateReservaDto` para:
  - Reemplazar `rut_usuario` con `id_usuario`
  - Reemplazar `numero_cancha` con `id_cancha`
  - Eliminar `id_admin` ya que la tabla admin ya no existe

### 4. Servicios
- Se actualizó el servicio `BoletaEquipamientoService` para:
  - Crear boletas con los nuevos campos como `montoTotal`
  - Eliminar la dependencia del usuario directo

- Se actualizó el servicio `ReservaService` para:
  - Inyectar el servicio `HistorialReservaService` para crear registros históricos
  - Crear automáticamente un registro en el historial cuando se crea una reserva
  - Actualizar las consultas para usar los nuevos campos ID en lugar de campos específicos
  - Verificar si una cancha está en mantenimiento antes de permitir reservas

## Instrucciones de despliegue
1. Ejecutar el script `update-database.ps1` para actualizar la estructura de la base de datos
2. Reiniciar los contenedores con `docker-compose down && docker-compose up -d`
3. Verificar que la aplicación funcione correctamente accediendo a http://localhost:8080

## Notas adicionales
- El script de actualización de la base de datos está configurado para eliminar todos los datos existentes y recrear la estructura desde cero.
- Se puede optar por cargar datos de ejemplo usando el script `sample-data-new.sql`
- La funcionalidad de administrador ahora está integrada en la entidad Usuario mediante el campo `isAdmin`
