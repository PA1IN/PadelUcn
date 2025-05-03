# Instrucciones para ejecutar PadelUCN con Docker

Este documento explica cómo ejecutar el proyecto completo (backend y base de datos PostgreSQL) usando Docker.

## Requisitos previos

- [Docker](https://www.docker.com/products/docker-desktop/) instalado en tu sistema
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (viene incluido con Docker Desktop)

## Pasos para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd PadelUcn
```

### 2. Ejecutar los servicios con Docker Compose

Desde el directorio raíz del proyecto (donde está el archivo `docker-compose.yml`), ejecuta:

```bash
docker-compose up -d
```

Este comando construirá la imagen del backend e iniciará:
- Base de datos PostgreSQL en el puerto 5433
- Servidor backend NestJS en el puerto 3000

> Nota: La primera vez que ejecutes este comando puede tardar varios minutos en completarse mientras se descargan las imágenes y se construye la aplicación.

### 3. Verificar que los servicios están ejecutándose

```bash
docker-compose ps
```

Deberías ver los servicios `padelucn-postgres` y `padelucn-backend` en estado "Up".

### 4. Crear las tablas en la base de datos

El proyecto incluye scripts SQL para crear la estructura de la base de datos. Ejecuta estos comandos para aplicarlos:

```bash
# Crear la estructura de tablas
docker exec -i padelucn-postgres psql -U ingeso -d padelucn < backend/ingeso-back/database-schema.sql

# Opcional: Poblar la base de datos con datos de ejemplo
docker exec -i padelucn-postgres psql -U ingeso -d padelucn < backend/ingeso-back/sample-data.sql
```

> Importante: Si estás usando Windows, es posible que necesites ajustar los comandos anteriores. Una alternativa es usar PowerShell con:
> ```powershell
> Get-Content backend/ingeso-back/database-schema.sql | docker exec -i padelucn-postgres psql -U ingeso -d padelucn
> Get-Content backend/ingeso-back/sample-data.sql | docker exec -i padelucn-postgres psql -U ingeso -d padelucn
> ```

### 5. Verificar que las tablas se han creado correctamente

Puedes conectarte a la base de datos para verificar que las tablas se han creado:

```bash
docker exec -it padelucn-postgres psql -U ingeso -d padelucn -c "\dt"
```

Deberías ver las siguientes tablas: `user`, `admin`, `cancha`, `equipamiento`, `reserva` y `boleta_equipamiento`.

## Acceder a los endpoints

Una vez que los servicios estén en ejecución y la base de datos esté configurada, puedes acceder a los endpoints de la API REST:

- API Base URL: `http://localhost:3000`
- Documentación Swagger (si está habilitada): `http://localhost:3000/api`

### Endpoints principales

El backend expone varios endpoints para gestionar:
- Usuarios: `/api/user`
- Administradores: `/api/admin`
- Autenticación: `/api/auth`
- Canchas: `/api/canchas`
- Reservas: `/api/reserva`
- Equipamiento: `/api/equipamiento`
- Boletas de equipamiento: `/api/boleta-equipamiento`

## Acceder a la base de datos

Si necesitas conectarte directamente a la base de datos para hacer consultas:

```bash
docker exec -it padelucn-postgres psql -U ingeso -d padelucn
```

O usa cualquier cliente PostgreSQL con estas credenciales:
- Host: localhost
- Puerto: 5433
- Usuario: ingeso
- Contraseña: 12342
- Base de datos: padelucn

### Algunos comandos útiles de PostgreSQL

Una vez dentro de la consola psql:
- `\dt` - Listar todas las tablas
- `\d nombretabla` - Describir una tabla específica
- `SELECT * FROM nombretabla;` - Ver todos los registros de una tabla
- `\q` - Salir de psql

## Detener los servicios

Para detener todos los servicios:

```bash
docker-compose down
```

Si quieres eliminar también los volúmenes (esto borrará los datos de la base de datos):

```bash
docker-compose down -v
```

## Reiniciar los servicios después de cambios

Si has realizado cambios en el código del backend:

```bash
docker-compose build padelucn-backend
docker-compose up -d
```

## Solución de problemas comunes

### 1. Error de puerto en uso

Si ves mensajes como "port is already allocated", es posible que tengas servicios usando los puertos 3000 o 5433. Puedes modificar los puertos en el archivo `docker-compose.yml`.

### 2. El backend no puede conectarse a la base de datos

Asegúrate de que la base de datos esté completamente iniciada antes de intentar conectar. Si persisten los problemas:

```bash
docker-compose logs padelucn-backend
docker-compose logs padelucn-postgres
```

### 3. Error al ejecutar los scripts SQL

Si tienes problemas al ejecutar los scripts SQL, puedes intentar copiarlos dentro del contenedor y ejecutarlos desde allí:

```bash
# Copiar los scripts al contenedor
docker cp backend/ingeso-back/database-schema.sql padelucn-postgres:/tmp/
docker cp backend/ingeso-back/sample-data.sql padelucn-postgres:/tmp/

# Ejecutar los scripts dentro del contenedor
docker exec -it padelucn-postgres psql -U ingeso -d padelucn -f /tmp/database-schema.sql
docker exec -it padelucn-postgres psql -U ingeso -d padelucn -f /tmp/sample-data.sql
```

### 4. Errores con getaddrinfo ENOTFOUND

Este error suele aparecer cuando hay problemas de resolución de nombres en la red de Docker. Asegúrate de que en tu archivo `.env` del backend tienes configurado correctamente el host de la base de datos:

- Si ejecutas todo en Docker Compose: `DB_HOST=padelucn-postgres`
- Si ejecutas el backend localmente: `DB_HOST=localhost`