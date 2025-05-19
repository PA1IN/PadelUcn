# Guía de Solución de Problemas PadelUCN

## Problema: Error 500 "column Reserva.precio does not exist"

Este error ocurre porque hay una discrepancia entre el código de la aplicación que usa las columnas `precio` y `pagado` en la entidad `Reserva`, pero estas columnas no existen en la tabla `reserva` de la base de datos.

## Soluciones

### Solución 1: Actualizar el Esquema de la Base de Datos

#### Opción A: Ejecutar SQL manualmente

1. Conecta a la base de datos PostgreSQL (puerto 5433, usuario: ingeso, contraseña: 12342)
2. Ejecuta el siguiente SQL:

```sql
-- Agregar columnas faltantes a la tabla reserva
ALTER TABLE "reserva" 
ADD COLUMN IF NOT EXISTS "precio" DECIMAL(10,2) NOT NULL DEFAULT 10000,
ADD COLUMN IF NOT EXISTS "pagado" BOOLEAN NOT NULL DEFAULT FALSE;

-- Actualizar restricción de check para incluir estados PAGADO y NO_PAGADO
ALTER TABLE "historial_reserva" DROP CONSTRAINT IF EXISTS "historial_reserva_estado_check";
ALTER TABLE "historial_reserva" 
ADD CONSTRAINT "historial_reserva_estado_check" 
CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));
```

3. Reinicia el backend: `docker restart padelucn-backend`

#### Opción B: Modificar archivos de esquema y reconstruir contenedores

1. Asegúrate de que `database-schema-new.sql` incluya las columnas faltantes:
   - La definición de la tabla `reserva` debe incluir `precio` y `pagado`
   - La restricción `CHECK` en `historial_reserva` debe incluir 'PAGADO' y 'NO_PAGADO'

2. Recuperar los datos actuales (opcional, si hay datos que deseas conservar):
```powershell
docker exec -it padelucn-postgres pg_dump -U ingeso -d padelucn > backup_before_fix.sql
```

3. Reconstruir los contenedores:
```powershell
docker-compose down -v
docker-compose up -d --build
```

### Solución 2: Activar Sincronización de TypeORM (Temporal)

1. Edita `backend/ingeso-back/src/app.module.ts` y cambia `synchronize: false` a `synchronize: true`
2. Reinicia el backend: `docker restart padelucn-backend`
3. Después de verificar que funciona, vuelve a cambiar a `synchronize: false` para evitar cambios automáticos no deseados

### Solución 3: Actualizar DTOs y Validaciones

Si todo lo anterior no funciona, asegúrate de que los DTOs y validaciones estén actualizados:

1. En `CreateHistorialReservaDto`, añade 'PAGADO' y 'NO_PAGADO' a la lista de estados permitidos
2. En `API_ENDPOINTS.md`, actualiza la documentación para reflejar estos nuevos estados

## Verificación

Para verificar que el problema está resuelto:

1. Accede a `http://localhost:8080/api/reservas` y confirma que no hay errores 500
2. Intenta crear una nueva reserva con el campo `precio` y verifica que se guarde correctamente
3. Prueba el endpoint de pago: `PATCH /api/reservas/{id}/pago` con un body como `{"pagado": true}`

## Pasos Preventivos para el Futuro

Para evitar este tipo de problemas en el futuro:

1. Crear migraciones para cada cambio en el esquema de la base de datos
2. Mantener sincronizada la documentación de la API con el código actual
3. Implementar pruebas automatizadas para los endpoints críticos
4. Considerar usar TypeORM con el modo `synchronize: true` solo en desarrollo, nunca en producción
5. Agregar validación y verificación de integridad de datos al iniciar la aplicación
