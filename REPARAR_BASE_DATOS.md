# Guía para Reparar la Base de Datos PadelUCN

Si estás experimentando el error `"column Reserva.precio does not exist"` cuando accedes a los endpoints de reservas, sigue estos pasos para resolver el problema:

## Opción 1: Utilizando pgAdmin o DBeaver

1. **Conecta a la base de datos PostgreSQL**:
   - Host: localhost
   - Puerto: 5433 (mapeado al 5432 dentro del contenedor)
   - Usuario: ingeso
   - Contraseña: 12342
   - Base de datos: padelucn

2. **Ejecuta el script SQL proporcionado**:
   - Abre el archivo `fix-database.sql` incluido en este proyecto
   - Ejecuta el script en la base de datos conectada
   - Verifica que no haya errores en la ejecución

3. **Reinicia el contenedor del backend**:
   ```powershell
   docker restart padelucn-backend
   ```

## Opción 2: Usando la línea de comandos

1. **Accede al contenedor de la base de datos**:
   ```powershell
   docker exec -it padelucn-postgres bash
   ```

2. **Conéctate a la base de datos**:
   ```bash
   psql -U ingeso -d padelucn
   ```

3. **Ejecuta los siguientes comandos SQL**:
   ```sql
   ALTER TABLE "reserva" 
   ADD COLUMN IF NOT EXISTS "precio" DECIMAL(10,2) NOT NULL DEFAULT 10000,
   ADD COLUMN IF NOT EXISTS "pagado" BOOLEAN NOT NULL DEFAULT FALSE;

   ALTER TABLE "historial_reserva" DROP CONSTRAINT IF EXISTS "historial_reserva_estado_check";
   ALTER TABLE "historial_reserva" 
   ADD CONSTRAINT "historial_reserva_estado_check" 
   CHECK (estado IN ('Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'));

   \q
   ```

4. **Sal del contenedor y reinicia el backend**:
   ```bash
   exit
   ```
   ```powershell
   docker restart padelucn-backend
   ```

## Verificación

Después de aplicar cualquiera de estas opciones, verifica que el endpoint funcione correctamente:

1. Abre tu navegador o herramienta de API (como Postman)
2. Accede a `http://localhost:8080/api/reservas`
3. Deberías recibir una respuesta exitosa (código 200) con la lista de reservas

Si sigues teniendo problemas, revisa los logs del backend:
```powershell
docker logs padelucn-backend
```
