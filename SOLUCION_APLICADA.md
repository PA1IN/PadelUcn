# Solución Implementada: Añadir Columnas Faltantes en la Base de Datos

## Problema Resuelto
Se resolvió el error 500 `"column Reserva.precio does not exist"` en el endpoint `/api/reservas` añadiendo las columnas faltantes a la tabla `reserva` directamente en la base de datos.

## Cambios Realizados

1. **Añadir columnas de precio y estado de pago**:
   ```sql
   ALTER TABLE reserva ADD COLUMN precio DECIMAL(10,2) NOT NULL DEFAULT 10000;
   ALTER TABLE reserva ADD COLUMN pagado BOOLEAN NOT NULL DEFAULT FALSE;
   ```

2. **Actualizar restricción de check en historial_reserva**:
   ```sql
   ALTER TABLE historial_reserva DROP CONSTRAINT IF EXISTS historial_reserva_estado_check;
   ALTER TABLE historial_reserva ADD CONSTRAINT historial_reserva_estado_check 
   CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));
   ```

3. **Reiniciar el backend para aplicar los cambios**:
   ```powershell
   docker restart padelucn-backend
   ```

## Verificación
Se han verificado exitosamente los siguientes endpoints:

1. **GET `/api/reservas`**: Obtiene todas las reservas con los campos de precio y estado de pago.
2. **PATCH `/api/reservas/{id}/pago`**: Actualiza el estado de pago de una reserva.
3. **GET `/api/reservas/{id}/marcar-como-pagado`**: Marca una reserva como pagada (endpoint de conveniencia).

## Recomendaciones para Futuros Cambios

1. **Mantener sincronizados los scripts de base de datos**:
   Cuando se añaden nuevos campos a las entidades en el código, asegúrate de actualizar también el script `database-schema-new.sql`.

2. **Usar migraciones**:
   Para futuros cambios en el esquema, considera implementar migraciones de TypeORM para gestionar los cambios de forma más controlada.

3. **Documentar los cambios**:
   Continúa manteniendo actualizado el archivo `API_ENDPOINTS.md` con todos los cambios en la API.

## Para más información
En caso de problemas similares en el futuro, puedes usar comandos similares a los que se utilizaron para solucionar este problema:

```powershell
# Ejecutar comandos SQL directamente en el contenedor de PostgreSQL
docker exec -i padelucn-postgres psql -U ingeso -d padelucn -c "TU_COMANDO_SQL_AQUI"

# Reiniciar el backend después de cambios en la base de datos
docker restart padelucn-backend
```
