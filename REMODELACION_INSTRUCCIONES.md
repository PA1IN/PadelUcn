# Instrucciones para Remodelar PadelUCN

## Visión General
Este documento proporciona las instrucciones paso a paso para implementar la remodelación de la base de datos y la aplicación PadelUCN, en base al nuevo diagrama MR. Los principales cambios incluyen:

1. **Eliminación del módulo Admin** - La funcionalidad de administrador ahora está integrada en la entidad User mediante un campo booleano `is_admin`
2. **Actualización de la entidad Cancha** - Añadido campo `mantenimiento` (booleano) 
3. **Implementación de HistorialReserva** - Nueva entidad con estados: Cancelado, Modificado, Completado, Pendiente
4. **Nuevo formato de respuestas de autenticación** - Ahora incluye `{rut, nombre, correo, rol, token}`

## 1. Preparar el Entorno

### Detener contenedores actuales
```powershell
docker-compose down
```

### Eliminar volúmenes de base de datos (esto eliminará todos los datos existentes)
```powershell
docker volume rm padelucn_postgres_data
```

### Crear volumen nuevo
```powershell
docker volume create padelucn_postgres_data
```

## 2. Actualizar el docker-compose.yml

Asegúrate de que tu archivo `docker-compose.yml` tenga la siguiente configuración:

```yaml
version: '3'

services:
  db:
    image: postgres:latest
    container_name: padelucn-postgres
    restart: always
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: ingeso
      POSTGRES_PASSWORD: 12342
      POSTGRES_DB: padelucn
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/ingeso-back/database-schema-new.sql:/docker-entrypoint-initdb.d/01-schema.sql

  backend:
    build: ./backend/ingeso-back
    container_name: padelucn-backend
    restart: always
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: ingeso
      DB_PASSWORD: 12342
      DB_NAME: padelucn
      JWT_SECRET: your_jwt_secret_key
      PORT: 3000

volumes:
  postgres_data:
    external: true
    name: padelucn_postgres_data
```

## 3. Aplicar Cambios a la Base de Datos

### Método 1: Usar el script proporcionado con Docker Compose

Con esta configuración, Docker ejecutará automáticamente el script SQL al iniciar el contenedor:

```powershell
docker-compose up -d db
```

### Método 2: Ejecutar el script manualmente (alternativa)

Si prefieres ejecutar el script manualmente:

```powershell
docker exec -i padelucn-postgres psql -U ingeso -d padelucn < ./backend/ingeso-back/database-schema-new.sql
```

## 4. Reconstruir y Reiniciar el Backend

Una vez que la base de datos esté lista, podemos reconstruir y reiniciar el backend:

```powershell
docker-compose up --build -d backend
```

## 5. Verificar la Instalación

### Comprobar que los contenedores están en ejecución
```powershell
docker ps
```

### Probar el API
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
```

## 6. Cambios en el Código

### Tareas Completadas
- ✅ Creado script SQL para el nuevo esquema de la base de datos (database-schema-new.sql)
- ✅ Actualizadas entidades para reflejar la nueva estructura
- ✅ Actualizado el servicio de autenticación para el nuevo formato de respuesta
- ✅ Eliminado el módulo Admin
- ✅ Implementados controlador y servicio para HistorialReserva
- ✅ Generados datos de ejemplo para la nueva estructura (sample-data-new.sql)
- ✅ Creado script para aplicar los cambios de la base de datos (update-database.ps1)

### Entidades Actualizadas
- `User` - Ahora incluye campo `isAdmin` y utiliza IDs numéricos
- `Cancha` - Ahora incluye campo `mantenimiento` y más información
- `Reserva` - Ahora se relaciona correctamente con las nuevas estructuras
- `HistorialReserva` - Nueva entidad para seguimiento de cambios en reservas
- `BoletaEquipamiento` - Actualizada para la nueva estructura

### Módulos Eliminados
- `AdminModule` - Ya no se necesita, la funcionalidad se gestiona con el campo `isAdmin` en la entidad `User`

### Autenticación
- Respuesta del endpoint de login ahora incluye `rut`, `nombre`, `correo`, `rol` y `token`

## 7. Datos de Prueba

Después de aplicar los cambios estructurales, puedes cargar los datos de prueba para el nuevo esquema:

```powershell
docker exec -i padelucn-postgres psql -U ingeso -d padelucn < ./backend/ingeso-back/sample-data-new.sql
```

También puedes utilizar el script completo de actualización que hemos creado:

```powershell
./update-database.ps1
```

## 8. Problemas Comunes y Soluciones

### Error de conexión a la base de datos
Verifica que los parámetros de conexión en el archivo `.env` coincidan con los del `docker-compose.yml`.

### Error al aplicar las migraciones
Si TypeORM tiene problemas con la sincronización, establece temporalmente `synchronize: true` en la configuración y reinicia la aplicación.

### Errores de compilación
Ejecuta `npm run build` dentro del contenedor para verificar errores específicos:

```powershell
docker exec -it padelucn-backend npm run build
```
