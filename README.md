# Padel UCN

## Resumen del Sistema

PadelUCN es una aplicación de reserva de canchas de pádel para la Universidad Católica del Norte. El sistema permite a los usuarios reservar canchas en horarios específicos, alquilar equipamiento deportivo y gestionar sus reservas.

### Características Principales
- **Reserva de canchas**: Los usuarios pueden reservar canchas de lunes a viernes entre 8:00 AM y 8:00 PM
- **Gestión de equipamiento**: Sistema de alquiler de equipamiento deportivo (raquetas, pelotas, accesorios)
- **Gestión de usuario**: Perfiles de usuario con saldo para realizar reservas
- **Historial de reservas**: Seguimiento completo de cambios de estado en las reservas
- **Panel de administración**: Funcionalidades especiales para administradores

### Instrucciones de Uso
1. Inicie sesión con sus credenciales (RUT y contraseña)
2. Navegue a la sección de reservas para seleccionar cancha, fecha y hora
3. Agregue equipamiento opcional a su reserva
4. Complete la reserva y realice el pago

### Usuarios de Prueba
- **Admin**: 11111111-1 / password123
- **Usuario Regular**: 22222222-2 / password123 
- **Usuario Regular**: 33333333-3 / password123
- **Usuario Regular**: 44444444-4 / password123

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
| POST | `/api/auth/login` | Inicia sesión y obtiene un token de acceso |
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

#### Inicio de sesión (POST `/api/auth/login`)
```json
{
  "rut": "11111111-1",
  "password": "password123"
}
```

> **Nota importante:** 
> - Aunque en la base de datos el campo se llama "contraseña", la API espera recibir "password" debido a cómo están configurados los DTOs en el backend.
> - Los siguientes usuarios de prueba están disponibles con la contraseña "password123":
>   - 11111111-1 (Admin)
>   - 22222222-2 (Usuario regular)
>   - 33333333-3 (Usuario regular)
>   - 44444444-4 (Usuario regular)

#### Actualización de usuario (PATCH `/api/users/:rut`)
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juan.perez@nuevoemail.com",
  "telefono": "+56987654321",
  "saldo": 50000
}
```

#### Respuesta al obtener un usuario (GET `/api/users/:rut`)
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

#### Creación de bloque (POST `/api/bloque`)
```json
{
  "fecha_date": "2025-06-02",
  "hora_inicio": "08:00:00",
  "hora_fin": "09:00:00"
}
```

#### Respuesta al obtener bloques por fecha (GET `/api/bloque/fecha/:fecha`)
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

1. **Autenticación**: Todos los endpoints (excepto login y register) requieren un token JWT válido en el header de autorización.
   - Para usar el token, agrégalo al header de las peticiones HTTP como: `Authorization: Bearer [token]`
   - El token expira después de 1 hora, por lo que deberás iniciar sesión nuevamente si ha caducado

2. **Rol de administrador**: Los endpoints para crear, actualizar o eliminar canchas, equipamiento y usuarios ahora requieren que el usuario tenga `isAdmin=true`.

3. **Estados del historial de reservas**: Los posibles estados son:
   - `Pendiente`: Estado inicial al crear una reserva
   - `Modificado`: Cuando se modifica una reserva existente
   - `Cancelado`: Cuando se cancela una reserva
   - `Completado`: Cuando una reserva se marca como realizada

4. **Mantenimiento de canchas**: Las canchas con `mantenimiento=true` no están disponibles para reservas.

5. **Horarios de reserva**: Por reglas de negocio, las canchas solo se pueden reservar:
   - De lunes a viernes
   - Entre las 8:00 y las 20:00 horas
   - No hay disponibilidad los fines de semana

## Instrucciones de Ejecución

Para ejecutar la aplicación localmente:

1. **Requisitos previos:**
   - Docker y Docker Compose instalados
   - Node.js (versión 14 o superior) para ejecutar scripts locales

2. **Iniciar servicios:**
   ```
   docker-compose up -d
   ```

3. **Acceso a la aplicación:**
   - Frontend: http://localhost:3000
   - API Backend: http://localhost:8080/api
   - Base de datos: PostgreSQL en puerto 5433

4. **Pruebas de API:**
   Puede probar los endpoints con Postman o cualquier cliente HTTP usando los ejemplos proporcionados en esta documentación.


