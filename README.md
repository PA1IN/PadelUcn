# 🏓 Padel UCN - Sistema de Reservas

## 📋 Resumen del Sistema

PadelUCN es una aplicación completa de reserva de canchas de pádel para la Universidad Católica del Norte. El sistema permite a los usuarios reservar canchas en horarios específicos, alquilar equipamiento deportivo y gestionar sus reservas con un sistema robusto de validaciones.

### 🌟 Características Principales
- **🏟️ Reserva de canchas**: Sistema completo de reservas con validación de disponibilidad
- **🛠️ Gestión de equipamiento**: Alquiler de equipamiento deportivo (raquetas, pelotas, accesorios)
- **👤 Gestión de usuarios**: Perfiles con saldo, autenticación JWT y roles de administrador
- **📊 Historial de reservas**: Seguimiento completo de cambios de estado
- **🔐 Autenticación segura**: Sistema JWT con validaciones robustas
- **✅ Validaciones completas**: DTOs con validaciones en español para mejor UX

### 🚀 Instrucciones de Inicio Rápido

#### 1. **Iniciar el Sistema**
```bash
# Iniciar base de datos
docker-compose up -d padelucn-db

# Iniciar backend (en otra terminal)
cd backend/ingeso-back
npm run start:dev
```

#### 2. **Acceder al Sistema**
- **Backend API**: `http://localhost:8080/api`
- **Base de datos**: PostgreSQL en puerto `5433`

#### 3. **Usuarios de Prueba**
| RUT | Contraseña | Rol |
|-----|------------|-----|
| `11111111-1` | `password123` | **Administrador** |
| `22222222-2` | `password123` | Usuario regular |
| `33333333-3` | `password123` | Usuario regular |
| `44444444-4` | `password123` | Usuario regular |

#### 4. **Flujo de Uso Básico**
1. **Registrarse/Iniciar sesión** con RUT y contraseña
2. **Explorar canchas disponibles** con `GET /api/canchas`
3. **Verificar disponibilidad** con endpoints de disponibilidad
4. **Crear reserva** con equipamiento opcional
5. **Gestionar reservas** y ver historial

## Endpoints API

Todos los endpoints están prefijados con `/api`. Por ejemplo, para acceder al endpoint de canchas, debes usar `/api/canchas`.

La API retorna respuestas en formato JSON con la siguiente estructura:

```json
{
  "statusCode": 200,
  "message": "Mensaje descriptivo",
  "data": {
    // Los datos retornados por el endpoint
  },
  "success": true
}
```

En caso de error:

```json
{
  "statusCode": 400,
  "message": "Mensaje de error",
  "data": null,
  "success": false,
  "error": "Descripción detallada del error"
}
```

## Módulo de Canchas

### Endpoints de la API para Canchas

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/canchas` | Obtiene todas las canchas disponibles |
| GET | `/api/canchas/:numero` | Obtiene la información de una cancha específica por su número |
| POST | `/api/canchas` | Crea una nueva cancha |
| PATCH | `/api/canchas/:numero` | Actualiza la información de una cancha existente |
| DELETE | `/api/canchas/:numero` | Elimina una cancha |

### Formato de datos

#### Creación de cancha (POST `/api/canchas`)
```json
{
  "numero": 1,
  "nombre": "Cancha Principal",
  "descripcion": "Cancha de pádel profesional con paredes de cristal",
  "valor": 15000,
  "mantenimiento": false,
  "cantidad_max_jugador": 4
}
```

#### Actualización de cancha (PATCH `/api/canchas/:numero`)
```json
{
  "nombre": "Cancha Principal",
  "descripcion": "Cancha techada con iluminación nocturna y bebedero",
  "valor": 60000,
  "mantenimiento": false
}
```

#### Respuesta al obtener canchas (GET `/api/canchas`)
```json
{
  "statusCode": 200,
  "message": "Canchas obtenidas exitosamente",
  "data": [
    {
      "id_cancha": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha de pádel profesional con paredes de cristal",
      "mantenimiento": false,
      "cantidad_max_jugador": 4,
      "valor": 15000
    },
    {
      "id_cancha": 2,
      "numero": 2,
      "nombre": "Cancha Secundaria",
      "descripcion": "Cancha de pádel estándar",
      "mantenimiento": false,
      "cantidad_max_jugador": 4,
      "valor": 12000
    },
    {
      "id_cancha": 3,
      "numero": 3,
      "nombre": "Cancha Techada",
      "descripcion": "Cancha de pádel techada para uso en días lluviosos",
      "mantenimiento": false,
      "cantidad_max_jugador": 4,
      "valor": 18000
    }
  ],
  "success": true
}
```

## Módulo de Usuarios

El sistema ahora maneja un modelo unificado para usuarios, donde se distinguen usuarios administradores y regulares:

### Atributos de Usuario
- **RUT**: Identificador único del usuario (formato chileno)
- **Nombre**: Nombre completo del usuario
- **Correo**: Correo electrónico del usuario
- **Contraseña**: Contraseña del usuario (almacenada de forma segura)
- **Saldo**: Saldo disponible para realizar reservas
- **isAdmin**: Flag que indica si el usuario es administrador

### Endpoints de la API para Usuarios

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/usuarios` | Obtiene todos los usuarios (requiere permisos de administrador) |
| GET | `/api/usuarios/:rut` | Obtiene la información de un usuario específico por su RUT |
| POST | `/api/usuarios` | Registra un nuevo usuario |
| PATCH | `/api/usuarios/:rut` | Actualiza la información de un usuario existente |
| DELETE | `/api/usuarios/:rut` | Elimina un usuario |

### Endpoints de Autenticación

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| POST | `/api/auth/login` | Inicia sesión y obtiene un token de acceso JWT |
| POST | `/api/auth/register` | Registra un nuevo usuario y obtiene un token |

### Formato de datos

#### Registro de usuario (POST `/api/auth/register`)
```json
{
  "rut": "22222222-2",
  "nombre_usuario": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseña": "usuario123",
  "telefono": "+56922222222"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id_usuario": 5,
      "rut": "22222222-2",
      "nombre_usuario": "Juan Pérez",
      "correo": "juan@example.com",
      "telefono": "+56922222222",
      "saldo": 0,
      "is_admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInJ1dCI6IjIyMjIyMjIyLTIiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzM3MjIxNjIxLCJleHAiOjE3MzcyMjUyMjF9.ABC123..."
  },
  "success": true
}
```

#### Inicio de sesión (POST `/api/auth/login`)
```json
{
  "rut": "11111111-1",
  "contraseña": "password123"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id_usuario": 1,
      "rut": "11111111-1",
      "nombre_usuario": "Admin User",
      "correo": "admin@padelucn.cl",
      "telefono": "+56911111111",
      "saldo": 100000,
      "is_admin": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJ1dCI6IjExMTExMTExLTEiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MzcyMjE2MjEsImV4cCI6MTczNzIyNTIyMX0.XYZ789..."
  },
  "success": true
}
```

**Respuesta de error (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "data": null,
  "success": false,
  "error": "RUT o contraseña incorrectos"
}
```

**Respuesta de error de validación (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Error de validación",
  "data": null,
  "success": false,
  "error": [
    "El RUT debe tener formato chileno válido (ej: 12345678-9)",
    "La contraseña debe tener al menos 6 caracteres"
  ]
}
```

> **Nota importante:** 
> - Los campos de contraseña en la API utilizan `contraseña` tanto para login como para registro.
> - Los siguientes usuarios de prueba están disponibles con la contraseña "password123":
>   - 11111111-1 (Admin)
>   - 22222222-2 (Usuario regular)
>   - 33333333-3 (Usuario regular)
>   - 44444444-4 (Usuario regular)

#### Actualización de usuario (PATCH `/api/usuarios/:rut`)
```json
{
  "nombre_usuario": "Juan Carlos Pérez",
  "correo": "juan.perez@nuevoemail.com",
  "telefono": "+56987654321",
  "saldo": 50000
}
```

#### Respuesta al obtener un usuario (GET `/api/usuarios/:rut`)
```json
{
  "statusCode": 200,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id_usuario": 2,
    "rut": "22222222-2",
    "nombre_usuario": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "+56922222222",
    "saldo": 50000,
    "is_admin": false
  },
  "success": true
}
```

## Módulo de Bloques de Tiempo

El sistema maneja bloques de tiempo predefinidos para facilitar la reserva de canchas:

### Atributos de Bloque
- **ID**: Identificador único del bloque de tiempo
- **Fecha**: Fecha del bloque
- **Hora Inicio**: Hora de inicio del bloque
- **Hora Fin**: Hora de término del bloque

### Endpoints de la API para Bloques

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/bloques` | Obtiene todos los bloques disponibles |
| GET | `/api/bloques/:id` | Obtiene la información de un bloque específico |
| GET | `/api/bloques/fecha/:fecha` | Obtiene todos los bloques de una fecha específica |
| POST | `/api/bloques` | Crea un nuevo bloque de tiempo |
| PATCH | `/api/bloques/:id` | Actualiza la información de un bloque existente |
| DELETE | `/api/bloques/:id` | Elimina un bloque de tiempo |

### Formato de datos

#### Creación de bloque (POST `/api/bloques`)
```json
{
  "fecha_date": "2025-06-02",
  "hora_inicio": "08:00:00",
  "hora_fin": "09:00:00"
}
```

#### Respuesta al obtener bloques por fecha (GET `/api/bloques/fecha/:fecha`)
```json
{
  "statusCode": 200,
  "message": "Bloques obtenidos exitosamente",
  "data": [
    {
      "id_bloque": 1,
      "fecha_date": "2025-06-02",
      "hora_inicio": "08:00:00",
      "hora_fin": "09:00:00"
    },
    {
      "id_bloque": 2,
      "fecha_date": "2025-06-02",
      "hora_inicio": "09:00:00",
      "hora_fin": "10:00:00"
    },
    {
      "id_bloque": 3,
      "fecha_date": "2025-06-02",
      "hora_inicio": "10:00:00",
      "hora_fin": "11:00:00"
    }
  ],
  "success": true
}
```

## 🔐 Sistema de Validaciones y Errores

### Validaciones Implementadas

El sistema cuenta con un completo sistema de validaciones con mensajes en español para mejorar la experiencia del usuario:

#### **Validaciones de Usuario/Autenticación:**
- **RUT**: Formato chileno válido (ej: 12345678-9)
- **Nombre**: Mínimo 2 caracteres, máximo 100 caracteres
- **Correo**: Formato de email válido
- **Contraseña**: Mínimo 6 caracteres
- **Teléfono**: Formato chileno (+56XXXXXXXXX)

#### **Validaciones de Reserva:**
- **Fecha**: Formato válido (YYYY-MM-DD), no puede ser en el pasado
- **Horarios**: Formato HH:MM:SS, hora inicio debe ser menor que hora fin
- **Duración**: Máximo 3 horas por reserva
- **Referencias**: Usuario y cancha deben existir

#### **Validaciones de Cancha:**
- **Número**: Único en el sistema
- **Nombre**: Mínimo 3 caracteres, máximo 100 caracteres
- **Valor**: Entre $5,000 y $50,000 pesos chilenos
- **Capacidad**: Entre 2 y 8 jugadores máximo

#### **Validaciones de Equipamiento:**
- **Tipo**: Solo valores permitidos (Raquetas, Pelotas, Accesorios, Protección)
- **Stock**: Número positivo, máximo 100 unidades
- **Costo**: Entre $100 y $10,000 pesos chilenos

#### **Validaciones de Jugador:**
- **Edad**: Entre 10 y 80 años
- **RUT**: Formato chileno válido y único por reserva

### Ejemplos de Respuestas de Error

#### Error de Validación (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": "Error de validación",
  "data": null,
  "success": false,
  "error": [
    "El RUT debe tener formato chileno válido (ej: 12345678-9)",
    "El nombre debe tener entre 2 y 100 caracteres",
    "El correo electrónico debe tener un formato válido",
    "El teléfono debe tener formato chileno (+56XXXXXXXXX)"
  ]
}
```

#### Error de Autenticación (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "No autorizado",
  "data": null,
  "success": false,
  "error": "Token de acceso requerido o inválido"
}
```

#### Error de Autorización (403 Forbidden)
```json
{
  "statusCode": 403,
  "message": "Acceso denegado",
  "data": null,
  "success": false,
  "error": "Se requieren permisos de administrador para esta acción"
}
```

#### Error de Recurso No Encontrado (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Recurso no encontrado",
  "data": null,
  "success": false,
  "error": "El usuario con RUT 99999999-9 no existe"
}
```

#### Error de Conflicto (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "Conflicto de recursos",
  "data": null,
  "success": false,
  "error": "La cancha ya está reservada en ese horario"
}
```

#### Error del Servidor (500 Internal Server Error)
```json
{
  "statusCode": 500,
  "message": "Error interno del servidor",
  "data": null,
  "success": false,
  "error": "Ha ocurrido un error inesperado. Contacte al administrador."
}
```

## Módulo de Reservas

El sistema permite la gestión de reservas de canchas con su respectivo historial:

### Atributos de Reserva
- **ID**: Identificador único de la reserva
- **Fecha**: Fecha de la reserva
- **Hora Inicio**: Hora de inicio de la reserva
- **Hora Término**: Hora de término de la reserva
- **ID Cancha**: ID de la cancha reservada
- **ID Usuario**: ID del usuario que realiza la reserva

### Atributos de Historial de Reserva
- **ID**: Identificador único del registro de historial
- **Estado**: Estado de la reserva (Cancelado, Modificado, Completado, Pendiente)
- **Fecha Estado**: Fecha y hora del cambio de estado
- **ID Reserva**: ID de la reserva relacionada
- **ID Usuario**: ID del usuario que realizó el cambio

### Endpoints de la API para Reservas

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/reservas` | Obtiene todas las reservas |
| GET | `/api/reservas/:id` | Obtiene la información de una reserva específica |
| POST | `/api/reservas` | Crea una nueva reserva |
| PATCH | `/api/reservas/:id` | Actualiza la información de una reserva existente |
| DELETE | `/api/reservas/:id` | Cancela una reserva |
| GET | `/api/reservas/historial/:id` | Obtiene el historial de una reserva |
| GET | `/api/reservas/usuario/:rut` | Obtiene todas las reservas de un usuario |
| GET | `/api/reservas/cancha/:numero` | Obtiene todas las reservas de una cancha |
| GET | `/api/reservas/disponibilidad/:numero/:fecha/:horaInicio/:horaTermino` | Verifica disponibilidad de una cancha en un horario específico |
| GET | `/api/reservas/disponibilidad-dia/:numero/:fecha` | Obtiene todos los horarios disponibles de una cancha en una fecha |
| GET | `/api/reservas/estadisticas` | Obtiene estadísticas de uso de las canchas (solo administradores) |

### Formato de datos

#### Creación de reserva (POST `/api/reservas`)
```json
{
  "fecha": "2025-06-09",
  "hora_inicio": "09:00:00",
  "hora_termino": "10:30:00",
  "rut_usuario": "22222222-2",
  "numero_cancha": 2,
  "id_bloque": 2
}
```

#### Actualización de reserva (PATCH `/api/reservas/:id`)
```json
{
  "fecha": "2025-06-02",
  "hora_inicio": "19:00",
  "hora_termino": "20:00"
}
```

#### Respuesta al crear una reserva
```json
{
  "statusCode": 201,
  "message": "Reserva #1 creada exitosamente para la cancha #2",
  "data": {
    "id_reserva": 1,
    "fecha": "2025-06-09",
    "hora_inicio": "09:00:00",
    "hora_termino": "10:30:00",
    "id_cancha": 2,
    "id_usuario": 2,
    "id_bloque": 2,
    "usuario": {
      "id_usuario": 2,
      "rut": "22222222-2",
      "nombre_usuario": "Juan Pérez",
      "correo": "juan@example.com"
    },
    "cancha": {
      "id_cancha": 2,
      "numero": 2,
      "nombre": "Cancha Secundaria",
      "valor": 12000
    }
  },
  "success": true
}
```

#### Consulta de disponibilidad (GET `/api/reservas/disponibilidad/:numero/:fecha/:horaInicio/:horaTermino`)
```json
{
  "statusCode": 200,
  "message": "La cancha #1 está disponible en el horario solicitado",
  "data": {
    "disponible": true
  },
  "success": true
}
```

#### Consulta de horarios disponibles (GET `/api/reservas/disponibilidad-dia/:numero/:fecha`)
```json
{
  "statusCode": 200,
  "message": "Horarios disponibles para la cancha #1 en la fecha 2025-06-02",
  "data": {
    "horariosDisponibles": [
      { 
        "id_bloque": 1,
        "fecha_date": "2025-06-02",
        "hora_inicio": "08:00:00", 
        "hora_fin": "09:00:00" 
      },
      { 
        "id_bloque": 2,
        "fecha_date": "2025-06-02",
        "hora_inicio": "09:00:00", 
        "hora_fin": "10:00:00" 
      },
      { 
        "id_bloque": 3,
        "fecha_date": "2025-06-02",
        "hora_inicio": "10:00:00", 
        "hora_fin": "11:00:00" 
      },
      { 
        "id_bloque": 11,
        "fecha_date": "2025-06-02",
        "hora_inicio": "18:00:00", 
        "hora_fin": "19:00:00" 
      },
      { 
        "id_bloque": 12,
        "fecha_date": "2025-06-02",
        "hora_inicio": "19:00:00", 
        "hora_fin": "20:00:00" 
      }
    ]
  },
  "success": true
}
```

#### Respuesta al obtener reservas de un usuario (GET `/api/reservas/usuario/:rut`)
```json
{
  "statusCode": 200,
  "message": "Reservas del usuario obtenidas exitosamente",
  "data": [
    {
      "id_reserva": 1,
      "fecha": "2025-06-09",
      "hora_inicio": "09:00:00",
      "hora_termino": "10:30:00",
      "id_cancha": 2,
      "id_usuario": 2,
      "id_bloque": 2,
      "cancha": {
        "id_cancha": 2,
        "numero": 2,
        "nombre": "Cancha Secundaria",
        "valor": 12000
      }
    }
  ],
  "success": true
}
```

#### Respuesta al obtener historial de una reserva (GET `/api/reservas/historial/:id`)
```json
{
  "statusCode": 200,
  "message": "Historial de la reserva obtenido exitosamente",
  "data": [
    {
      "id_historial": 1,
      "estado": "Pendiente",
      "fecha_estado": "2025-06-02",
      "id_reserva": 1,
      "id_usuario": 2
    },
    {
      "id_historial": 2,
      "estado": "Confirmada",
      "fecha_estado": "2025-06-03",
      "id_reserva": 1,
      "id_usuario": 1
    }
  ],
  "success": true
}
```

#### Respuesta al obtener estadísticas (GET `/api/reservas/estadisticas`)
```json
{
  "statusCode": 200,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "totalReservas": 120,
    "reservasPorCancha": [
      { "numeroCancha": 1, "totalReservas": 45 },
      { "numeroCancha": 2, "totalReservas": 38 },
      { "numeroCancha": 3, "totalReservas": 37 }
    ],
    "usuariosConMasReservas": [
      { "rutUsuario": "12345678-9", "nombreUsuario": "Juan Pérez", "totalReservas": 15 },
      { "rutUsuario": "98765432-1", "nombreUsuario": "Ana López", "totalReservas": 12 }
    ],
    "reservasPorDia": [
      { "diaSemana": "Monday", "totalReservas": 25 },
      { "diaSemana": "Tuesday", "totalReservas": 20 },
      { "diaSemana": "Wednesday", "totalReservas": 22 }
    ],
    "horasMasSolicitadas": [
      { "hora": "18:00", "totalReservas": 30 },
      { "hora": "19:00", "totalReservas": 28 }
    ]
  },
  "success": true
}
```

## Módulo de Historial de Reservas

El sistema mantiene un registro detallado del historial de cambios de estado de las reservas:

### Atributos de Historial de Reserva
- **ID**: Identificador único del registro de historial
- **Estado**: Estado de la reserva (Cancelado, Modificado, Completado, Pendiente)
- **Fecha Estado**: Fecha y hora del cambio de estado
- **ID Reserva**: ID de la reserva relacionada
- **ID Usuario**: ID del usuario que realizó el cambio

### Endpoints de la API para Historial de Reservas

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/historial-reservas` | Obtiene todos los registros del historial |
| GET | `/api/historial-reservas/:id` | Obtiene un registro específico del historial por su ID |
| GET | `/api/historial-reservas/reserva/:id` | Obtiene todo el historial de una reserva específica |
| GET | `/api/historial-reservas/usuario/:id` | Obtiene todo el historial de un usuario específico |
| POST | `/api/historial-reservas` | Crea un nuevo registro en el historial |

### Formato de datos

#### Creación de registro de historial (POST `/api/historial-reservas`)
```json
{
  "estado": "Confirmada",
  "id_reserva": 1,
  "id_usuario": 1
}
```

#### Respuesta al obtener historial de una reserva (GET `/api/historial-reservas/reserva/:id`)
```json
{
  "statusCode": 200,
  "message": "Historiales de reserva obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "estado": "Pendiente",
      "fechaEstado": "2025-05-18T12:00:00.000Z",
      "idReserva": 1,
      "idUsuario": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez"
      }
    },
    {
      "id": 2,
      "estado": "Modificado",
      "fechaEstado": "2025-05-19T14:30:00.000Z",
      "idReserva": 1,
      "idUsuario": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez"
      }
    }
  ],
  "success": true
}
```

#### Respuesta al obtener historial de un usuario (GET `/api/historial-reservas/usuario/:id`)
```json
{
  "statusCode": 200,
  "message": "Historiales de reserva obtenidos exitosamente",
  "data": [
    {
      "id_historial": 1,
      "estado": "Pendiente",
      "fecha_estado": "2025-06-02",
      "id_reserva": 1,
      "id_usuario": 2,
      "reserva": {
        "id_reserva": 1,
        "fecha": "2025-06-09",
        "hora_inicio": "09:00:00",
        "hora_termino": "10:30:00"
      }
    },
    {
      "id_historial": 3,
      "estado": "Pendiente",
      "fecha_estado": "2025-06-02",
      "id_reserva": 2,
      "id_usuario": 3,
      "reserva": {
        "id_reserva": 2,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00"
      }
    }
  ],
  "success": true
}
```

## Módulo de Equipamiento

El sistema permite la gestión de equipamiento deportivo disponible para alquiler durante las reservas:

### Atributos de Equipamiento
- **ID**: Identificador único del equipamiento
- **Tipo**: Tipo de equipamiento (paleta, pelota, etc.)
- **Nombre**: Nombre descriptivo del equipamiento
- **Stock**: Cantidad disponible para alquilar
- **Costo**: Costo por unidad del alquiler del equipamiento

### Endpoints de la API para Equipamiento

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/equipamiento` | Obtiene todo el equipamiento disponible |
| GET | `/api/equipamiento/:id` | Obtiene la información de un equipamiento específico |
| POST | `/api/equipamiento` | Crea un nuevo equipamiento |
| PATCH | `/api/equipamiento/:id` | Actualiza la información de un equipamiento existente |
| DELETE | `/api/equipamiento/:id` | Elimina un equipamiento |

### Formato de datos

#### Creación de equipamiento (POST `/api/equipamiento`)
```json
{
  "tipo": "Raquetas",
  "nombre": "Raqueta Pro",
  "stock": 10,
  "costo": 2000
}
```

#### Actualización de equipamiento (PATCH `/api/equipamiento/:id`)
```json
{
  "stock": 15,
  "costo": 5500,
  "nombre": "Paleta Profesional Avanzada"
}
```

#### Respuesta al obtener equipamientos (GET `/api/equipamiento`)
```json
{
  "statusCode": 200,
  "message": "Equipamientos obtenidos exitosamente",
  "data": [
    {
      "id_equipamiento": 1,
      "nombre": "Raqueta Pro",
      "tipo": "Raquetas",
      "stock": 10,
      "costo": 2000
    },
    {
      "id_equipamiento": 2,
      "tipo": "Accesorios",
      "nombre": "Cinta grip",
      "stock": 30,
      "costo": 800
    },
    {
      "id_equipamiento": 3,
      "tipo": "Pelotas",
      "nombre": "Pelotas (pack)",
      "stock": 20,
      "costo": 500
    },
    {
      "id_equipamiento": 4,
      "tipo": "Protección",
      "nombre": "Protector facial",
      "stock": 15,
      "costo": 1500
    }
  ],
  "success": true
}
```

## Módulo de Boleta de Equipamiento

El sistema permite la gestión de boletas de alquiler de equipamiento asociadas a las reservas:

### Atributos de Boleta de Equipamiento
- **ID**: Identificador único de la boleta de equipamiento
- **Cantidad**: Cantidad de unidades del equipamiento alquilado
- **Monto Total**: Costo total del alquiler (cantidad * costo unitario del equipamiento)
- **ID Reserva**: ID de la reserva asociada a la boleta
- **ID Equipamiento**: ID del equipamiento alquilado

### Endpoints de la API para Boleta de Equipamiento

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/boleta-equipamiento` | Obtiene todas las boletas de equipamiento |
| GET | `/api/boleta-equipamiento/:id` | Obtiene la información de una boleta específica |
| POST | `/api/boleta-equipamiento` | Crea una nueva boleta de equipamiento |
| PATCH | `/api/boleta-equipamiento/:id` | Actualiza la información de una boleta existente |
| DELETE | `/api/boleta-equipamiento/:id` | Elimina una boleta |

### Formato de datos

#### Creación de boleta de equipamiento (POST `/api/boleta-equipamiento`)
```json
{
  "id_reserva": 1,
  "id_equipamiento": 1,
  "cantidad": 2
}
```

#### Actualización de boleta de equipamiento (PATCH `/api/boleta-equipamiento/:id`)
```json
{
  "cantidad": 4
}
```

#### Respuesta al crear una boleta de equipamiento
```json
{
  "statusCode": 201,
  "message": "Boleta de equipamiento creada exitosamente",
  "data": {
    "id_boleta": 1,
    "cantidad": 2,
    "monto_total": 4000,
    "id_reserva": 1,
    "id_equipamiento": 1,
    "equipamiento": {
      "id_equipamiento": 1,
      "tipo": "Raquetas",
      "nombre": "Raqueta Pro",
      "costo": 2000
    }
  },
  "success": true
}
```

#### Respuesta al obtener boletas de equipamiento por reserva
```json
{
  "statusCode": 200,
  "message": "Boletas de equipamiento por reserva obtenidas exitosamente",
  "data": [
    {
      "id_boleta": 1,
      "cantidad": 2,
      "monto_total": 4000,
      "id_reserva": 1,
      "id_equipamiento": 1,
      "equipamiento": {
        "id_equipamiento": 1,
        "tipo": "Raquetas",
        "nombre": "Raqueta Pro",
        "costo": 2000
      }
    },
    {
      "id_boleta": 2,
      "cantidad": 1,
      "monto_total": 800,
      "id_reserva": 1,
      "id_equipamiento": 2,
      "equipamiento": {
        "id_equipamiento": 2,
        "tipo": "Accesorios",
        "nombre": "Cinta grip",
        "costo": 800
      }
    }
  ],
  "success": true
}
```

## Módulo de Jugador

El sistema permite registrar jugadores asociados a una reserva:

### Atributos de Jugador
- **ID**: Identificador único del jugador
- **Nombre**: Nombre del jugador
- **Apellido**: Apellido del jugador
- **RUT**: RUT del jugador
- **Edad**: Edad del jugador
- **ID Reserva**: ID de la reserva a la que está asociado

### Endpoints de la API para Jugador

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/jugador` | Obtiene todos los jugadores registrados |
| GET | `/api/jugador/:id` | Obtiene la información de un jugador específico |
| GET | `/api/jugador/reserva/:id` | Obtiene todos los jugadores de una reserva específica |
| POST | `/api/jugador` | Crea un nuevo registro de jugador |
| PATCH | `/api/jugador/:id` | Actualiza la información de un jugador existente |
| DELETE | `/api/jugador/:id` | Elimina un registro de jugador |

### Formato de datos

#### Creación de jugador (POST `/api/jugador`)
```json
{
  "nombre": "Pedro",
  "apellido": "Gómez",
  "rut": "55555555-5",
  "edad": 30,
  "id_reserva": 1
}
```

#### Respuesta al obtener jugadores de una reserva (GET `/api/jugador/reserva/:id`)
```json
{
  "statusCode": 200,
  "message": "Jugadores obtenidos exitosamente",
  "data": [
    {
      "id_jugador": 1,
      "nombre": "Pedro",
      "apellido": "Gómez",
      "rut": "55555555-5",
      "edad": 30,
      "id_reserva": 1
    },
    {
      "id_jugador": 2,
      "nombre": "Laura",
      "apellido": "Martínez",
      "rut": "66666666-6",
      "edad": 28,
      "id_reserva": 1
    }
  ],
  "success": true
}
```

## Módulo de Transacciones

El sistema registra transacciones asociadas a boletas de equipamiento:

### Atributos de Transaccion
- **ID**: Identificador único de la transacción
- **Fecha**: Fecha de la transacción
- **ID Boleta Equipamiento**: ID de la boleta de equipamiento asociada

### Endpoints de la API para Transaccion

| Método HTTP | Endpoint | Descripción |
|-------------|----------|-------------|
| GET | `/api/transaccion` | Obtiene todas las transacciones |
| GET | `/api/transaccion/:id` | Obtiene la información de una transacción específica |
| GET | `/api/transaccion/boleta/:id` | Obtiene la transacción asociada a una boleta específica |
| POST | `/api/transaccion` | Crea una nueva transacción |
| DELETE | `/api/transaccion/:id` | Elimina una transacción |

### Formato de datos

#### Creación de transacción (POST `/api/transaccion`)
```json
{
  "fecha": "2025-06-02",
  "id_boleta_equipamiento": 1
}
```

#### Respuesta al obtener transacciones (GET `/api/transaccion`)
```json
{
  "statusCode": 200,
  "message": "Transacciones obtenidas exitosamente",
  "data": [
    {
      "id_transaccion": 1,
      "fecha": "2025-06-02",
      "id_boleta_equipamiento": 1,
      "boleta": {
        "id_boleta": 1,
        "cantidad": 2,
        "monto_total": 4000,
        "id_reserva": 1,
        "id_equipamiento": 1
      }
    },
    {
      "id_transaccion": 2,
      "fecha": "2025-06-02",
      "id_boleta_equipamiento": 2,
      "boleta": {
        "id_boleta": 2,
        "cantidad": 1,
        "monto_total": 800,
        "id_reserva": 1,
        "id_equipamiento": 2
      }
    }
  ],
  "success": true
}
```

## Notas importantes

### 🔑 Autenticación y Autorización

1. **Autenticación JWT**: Todos los endpoints (excepto `/api/auth/login` y `/api/auth/register`) requieren un token JWT válido.

   **Cómo usar el token:**
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJ1dCI6IjExMTExMTExLTEiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MzcyMjE2MjEsImV4cCI6MTczNzIyNTIyMX0.XYZ789...
   ```

   **Ejemplo completo con curl:**
   ```bash
   curl -X GET http://localhost:8080/api/usuarios \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json"
   ```

   **Ejemplo con JavaScript/Fetch:**
   ```javascript
   const token = localStorage.getItem('authToken');
   
   fetch('http://localhost:8080/api/usuarios', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   })
   .then(response => response.json())
   .then(data => console.log(data));
   ```

2. **Expiración del token**: Los tokens JWT expiran después de **1 hora**. Después de ese tiempo, deberás iniciar sesión nuevamente para obtener un nuevo token.

3. **Roles de usuario**: El sistema distingue entre dos tipos de usuarios:
   - **Administradores** (`is_admin: true`): Pueden crear, modificar y eliminar canchas, equipamiento, y gestionar todos los usuarios
   - **Usuarios regulares** (`is_admin: false`): Pueden hacer reservas, ver sus propias reservas y gestionar su perfil

### 🛡️ Endpoints que Requieren Permisos de Administrador

Los siguientes endpoints requieren que el usuario autenticado tenga `is_admin: true`:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/canchas` | Crear nueva cancha |
| PATCH | `/api/canchas/:numero` | Modificar cancha |
| DELETE | `/api/canchas/:numero` | Eliminar cancha |
| POST | `/api/equipamiento` | Crear nuevo equipamiento |
| PATCH | `/api/equipamiento/:id` | Modificar equipamiento |
| DELETE | `/api/equipamiento/:id` | Eliminar equipamiento |
| GET | `/api/usuarios` | Listar todos los usuarios |
| DELETE | `/api/usuarios/:rut` | Eliminar usuario |
| GET | `/api/reservas/estadisticas` | Ver estadísticas del sistema |

### 📋 Reglas de Negocio

2. **Estados del historial de reservas**: Los posibles estados son:
   - `Pendiente`: Estado inicial al crear una reserva
   - `Modificado`: Cuando se modifica una reserva existente
   - `Cancelado`: Cuando se cancela una reserva
   - `Completado`: Cuando una reserva se marca como realizada

3. **Mantenimiento de canchas**: Las canchas con `mantenimiento=true` no están disponibles para reservas.

4. **Horarios de reserva**: Por reglas de negocio, las canchas solo se pueden reservar:
   - De lunes a viernes
   - Entre las 8:00 y las 20:00 horas
   - No hay disponibilidad los fines de semana

5. **Validaciones específicas chilenas**:
   - **Formato RUT**: 12345678-9 (con dígito verificador)
   - **Formato teléfono**: +56XXXXXXXXX (código país + 9 dígitos)
   - **Monedas**: Valores en pesos chilenos (CLP)

### 🔧 Headers Requeridos

Para todas las peticiones HTTP, incluye los siguientes headers:

```http
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 🌐 CORS y Frontend

El backend está configurado para aceptar peticiones desde cualquier origen durante el desarrollo. En producción, esto debe configurarse para aceptar solo dominios autorizados.

## 🧪 Pruebas de API - Guía Práctica

### Configuración de Cliente HTTP (Postman/Insomnia)

#### 1. **Variables de Entorno**
Crea las siguientes variables en tu cliente HTTP:

```
BASE_URL = http://localhost:8080/api
AUTH_TOKEN = (se llenará después del login)
```

#### 2. **Flujo de Prueba Completo**

**Paso 1: Registro de Usuario**
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "rut": "55555555-5",
  "nombre_usuario": "Usuario Prueba",
  "correo": "prueba@test.com",
  "contraseña": "test123456",
  "telefono": "+56955555555"
}
```

**Paso 2: Inicio de Sesión**
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "rut": "55555555-5",
  "contraseña": "test123456"
}
```
*Guarda el token devuelto en la variable AUTH_TOKEN*

**Paso 3: Consultar Canchas**
```http
GET {{BASE_URL}}/canchas
Authorization: Bearer {{AUTH_TOKEN}}
```

**Paso 4: Verificar Disponibilidad**
```http
GET {{BASE_URL}}/reservas/disponibilidad-dia/1/2025-06-15
Authorization: Bearer {{AUTH_TOKEN}}
```

**Paso 5: Crear Reserva**
```http
POST {{BASE_URL}}/reservas
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "fecha": "2025-06-15",
  "hora_inicio": "10:00:00",
  "hora_termino": "11:00:00",
  "rut_usuario": "55555555-5",
  "numero_cancha": 1,
  "id_bloque": 3
}
```

**Paso 6: Agregar Equipamiento**
```http
POST {{BASE_URL}}/boleta-equipamiento
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
  "id_reserva": 1,
  "id_equipamiento": 1,
  "cantidad": 2
}
```

### Scripts de Prueba Automatizada

#### Script en Node.js para Pruebas Rápidas

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';
let authToken = '';

async function testAPI() {
  try {    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      rut: '11111111-1',
      contraseña: 'password123'
    });
    
    authToken = loginResponse.data.data.token;
    console.log('✅ Login exitoso');
    
    // 2. Obtener canchas
    const canchasResponse = await axios.get(`${BASE_URL}/canchas`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log(`✅ Canchas obtenidas: ${canchasResponse.data.data.length}`);
    
    // 3. Verificar disponibilidad
    const fecha = '2025-06-15';
    const numeroCancha = 1;
    
    const disponibilidadResponse = await axios.get(
      `${BASE_URL}/reservas/disponibilidad-dia/${numeroCancha}/${fecha}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log(`✅ Horarios disponibles: ${disponibilidadResponse.data.data.horariosDisponibles.length}`);
    
    console.log('🎉 Todas las pruebas pasaron correctamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testAPI();
```

### Colección de Postman

Puedes importar esta colección JSON en Postman para tener todos los endpoints configurados:

```json
{
  "info": {
    "name": "PadelUCN API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:8080/api"
    },
    {
      "key": "AUTH_TOKEN",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {              "mode": "raw",
              "raw": "{\n  \"rut\": \"11111111-1\",\n  \"contraseña\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/auth/login",
              "host": ["{{BASE_URL}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

## Instrucciones de Ejecución

### 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Node.js** versión 18 o superior
- **PostgreSQL** (incluido en Docker Compose)
- **NPM** o **Yarn**

### 🚀 Instalación y Configuración

#### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/PadelUcn.git
cd PadelUcn
```

#### 2. **Configurar Variables de Entorno**
Crea un archivo `.env` en el directorio `backend/ingeso-back/`:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=padeluser
DB_PASSWORD=padelpass
DB_DATABASE=padelucn

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=1h

# Puerto del servidor
PORT=8080
```

#### 3. **Iniciar Base de Datos**
```bash
# Desde el directorio raíz del proyecto
docker-compose up -d padelucn-db

# Verificar que esté corriendo
docker-compose ps
```

#### 4. **Instalar Dependencias del Backend**
```bash
cd backend/ingeso-back
npm install
```

#### 5. **Iniciar Backend en Modo Desarrollo**
```bash
npm run start:dev
```

#### 6. **Verificar Instalación**
Abre tu navegador en: `http://localhost:8080/api`

Deberías ver un mensaje de bienvenida de la API.

### 🔧 Comandos Útiles

```bash
# Ver logs de la base de datos
docker-compose logs padelucn-db

# Reiniciar solo la base de datos
docker-compose restart padelucn-db

# Detener todos los servicios
docker-compose down

# Limpiar volúmenes (⚠️ Esto borrará todos los datos)
docker-compose down -v

# Ver el estado de los contenedores
docker-compose ps

# Ejecutar comandos en el contenedor de PostgreSQL
docker-compose exec padelucn-db psql -U padeluser -d padelucn
```

### 🐛 Solución de Problemas Comunes

#### **Puerto 8080 ocupado**
```bash
# Ver qué proceso usa el puerto 8080
lsof -i :8080

# En Windows
netstat -ano | findstr :8080
```

#### **Base de datos no conecta**
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose logs padelucn-db

# Conectar manualmente a la base de datos
docker-compose exec padelucn-db psql -U padeluser -d padelucn
```

#### **Error de permisos en Docker**
```bash
# En Linux/Mac, agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Luego cerrar sesión y volver a iniciar
```

### 📊 Acceso a Servicios

Una vez que todo esté corriendo:

- **Backend API**: `http://localhost:8080/api`
- **Base de datos**: `localhost:5433` (usuario: `padeluser`, contraseña: `padelpass`)
- **Frontend** (si aplica): `http://localhost:3000`

### 🧪 Datos de Prueba

El sistema incluye los siguientes usuarios de prueba:

| RUT | Contraseña | Rol | Saldo |
|-----|------------|-----|-------|
| `11111111-1` | `password123` | Administrador | $100,000 |
| `22222222-2` | `password123` | Usuario | $50,000 |
| `33333333-3` | `password123` | Usuario | $30,000 |
| `44444444-4` | `password123` | Usuario | $25,000 |

## 🔧 Arquitectura del Sistema

### Stack Tecnológico

**Backend:**
- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **class-validator** - Validaciones de DTOs
- **bcrypt** - Hashing de contraseñas

**Infraestructura:**
- **Docker & Docker Compose** - Containerización
- **NPM** - Gestión de paquetes

### Estructura del Proyecto

```
PadelUcn/
├── backend/
│   └── ingeso-back/
│       ├── src/
│       │   ├── modulos/           # Módulos de la aplicación
│       │   │   ├── auth/          # Autenticación JWT
│       │   │   ├── usuario/       # Gestión de usuarios
│       │   │   ├── cancha/        # Gestión de canchas
│       │   │   ├── reserva/       # Sistema de reservas
│       │   │   ├── equipamiento/  # Equipamiento deportivo
│       │   │   ├── bloque/        # Bloques de tiempo
│       │   │   ├── jugador/       # Jugadores por reserva
│       │   │   ├── historial-reserva/ # Historial de cambios
│       │   │   ├── boleta-equipamiento/ # Boletas de alquiler
│       │   │   └── transaccion/   # Transacciones
│       │   ├── main.ts           # Punto de entrada
│       │   └── app.module.ts     # Módulo principal
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml            # Servicios Docker
├── esquemafinal.sql             # Schema de base de datos
└── README.md                    # Esta documentación
```

### Base de Datos

**Entidades Principales:**
- `Usuario` - Usuarios del sistema (administradores y regulares)
- `Cancha` - Canchas disponibles para reserva
- `Reserva` - Reservas realizadas por usuarios
- `Bloque` - Bloques de tiempo disponibles
- `Equipamiento` - Equipamiento deportivo para alquiler
- `HistorialReserva` - Historial de cambios de estado
- `BoletaEquipamiento` - Boletas de alquiler de equipamiento
- `Jugador` - Jugadores asociados a reservas
- `Transaccion` - Transacciones del sistema

## 📈 Próximos Pasos y Mejoras

### Funcionalidades Pendientes

1. **Sistema de Pagos**
   - Integración con pasarelas de pago
   - Gestión de saldos y transacciones
   - Facturación automática

2. **Notificaciones**
   - Envío de emails de confirmación
   - Recordatorios de reservas
   - Notificaciones push

3. **Reportes Avanzados**
   - Dashboard administrativo
   - Reportes de ingresos
   - Análisis de uso de canchas

4. **Frontend Completo**
   - Interfaz web responsive
   - Aplicación móvil
   - Panel administrativo

### Consideraciones de Producción

1. **Seguridad**
   - HTTPS obligatorio
   - Rate limiting
   - Logging de seguridad
   - Validación de entrada más estricta

2. **Performance**
   - Cache con Redis
   - Optimización de consultas
   - CDN para assets estáticos

3. **Monitoreo**
   - Logging estructurado
   - Métricas de aplicación
   - Alertas automáticas

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

### Estándares de Código

- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** para mensajes de commit
- **DTOs** con validaciones completas
- **Documentación** en código y README

## 📞 Soporte y Contacto

- **Issues**: Reporta bugs o solicita features en GitHub Issues
- **Documentación**: Esta documentación se actualiza continuamente
- **Email**: contacto@padelucn.cl (ejemplo)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**PadelUCN** - Sistema de Reservas v1.0
Desarrollado para la Universidad Católica del Norte


