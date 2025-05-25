# Padel UCN

Sistema de gestión para canchas de pádel de la Universidad Católica del Norte.

> **NOTA IMPORTANTE: Sistema en Reestructuración**
> 
> El sistema ha sido actualizado con una nueva estructura de base de datos. Se han aplicado los siguientes cambios:
> - Eliminación del módulo Admin (reemplazado por un flag `isAdmin` en la entidad User)
> - Actualización de entidades para mapear correctamente a la nueva base de datos
> - Añadido seguimiento de historial de reservas
> - Ver detalles completos en [ENTITY_UPDATES.md](ENTITY_UPDATES.md)

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

El sistema permite la gestión completa de canchas con sus respectivos atributos:
- **Número**: Identificador único de la cancha (Primary Key)
- **Costo**: Valor por hora de la cancha en la moneda local
- **Mantenimiento**: Indica si la cancha está en mantenimiento (no disponible para reservas)

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
  "descripcion": "Cancha techada con iluminación nocturna",
  "valor": 50000,
  "mantenimiento": false
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
      "id": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha techada con iluminación nocturna",
      "mantenimiento": false,
      "valor": 50000
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
| GET | `/api/users` | Obtiene todos los usuarios (requiere permisos de administrador) |
| GET | `/api/users/:rut` | Obtiene la información de un usuario específico por su RUT |
| POST | `/api/users` | Registra un nuevo usuario |
| PATCH | `/api/users/:rut` | Actualiza la información de un usuario existente |
| DELETE | `/api/users/:rut` | Elimina un usuario |
| POST | `/api/auth/login` | Inicia sesión y obtiene un token de acceso |
| POST | `/api/auth/register` | Registra un nuevo usuario y obtiene un token |

### Formato de datos

#### Registro de usuario (POST `/api/auth/register`)
```json
{
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "password": "contraseña123",
  "telefono": "+56912345678"
}
```

#### Inicio de sesión (POST `/api/auth/login`)
```json
{
  "rut": "12345678-9",
  "password": "contraseña123"
}
```

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
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "telefono": "+56912345678",
    "saldo": 0,
    "isAdmin": false
  },
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
  "fecha": "2025-06-01",
  "hora_inicio": "18:00",
  "hora_termino": "19:00",
  "rut_usuario": "12345678-9",
  "numero_cancha": 1
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
  "message": "Reserva #1 creada exitosamente para la cancha #1",
  "data": {
    "id": 1,
    "fecha": "2025-06-01",
    "hora_inicio": "18:00",
    "hora_termino": "19:00",
    "idCancha": 1,
    "idUsuario": 1,
    "usuario": {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com"
    },
    "cancha": {
      "id": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "valor": 50000
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
  "message": "Horarios disponibles para la cancha #1 en la fecha 2025-06-01",
  "data": {
    "horariosDisponibles": [
      { "inicio": "08:00", "fin": "09:00" },
      { "inicio": "09:00", "fin": "10:00" },
      { "inicio": "10:00", "fin": "11:00" },
      { "inicio": "17:00", "fin": "18:00" },
      { "inicio": "19:00", "fin": "20:00" }
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
      "id": 1,
      "fecha": "2025-06-01",
      "hora_inicio": "18:00",
      "hora_termino": "19:00",
      "idCancha": 1,
      "idUsuario": 1,
      "cancha": {
        "id": 1,
        "numero": 1,
        "nombre": "Cancha Principal",
        "valor": 50000
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
      "id": 1,
      "estado": "Pendiente",
      "fechaEstado": "2025-05-18T23:30:00.000Z",
      "idReserva": 1,
      "idUsuario": 1
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
  "estado": "Modificado",
  "idReserva": 1,
  "idUsuario": 2
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
      "id": 1,
      "estado": "Pendiente",
      "fechaEstado": "2025-05-18T12:00:00.000Z",
      "idReserva": 1,
      "idUsuario": 1,
      "reserva": {
        "id": 1,
        "fecha": "2025-06-01",
        "hora_inicio": "18:00",
        "hora_termino": "19:00"
      }
    },
    {
      "id": 3,
      "estado": "Cancelado",
      "fechaEstado": "2025-05-20T09:15:00.000Z",
      "idReserva": 2,
      "idUsuario": 1,
      "reserva": {
        "id": 2,
        "fecha": "2025-06-03",
        "hora_inicio": "10:00",
        "hora_termino": "11:00"
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
  "tipo": "Paleta",
  "nombre": "Paleta Profesional",
  "stock": 10,
  "costo": 5000
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
      "id": 1,
      "tipo": "Paleta",
      "nombre": "Paleta Profesional",
      "stock": 10,
      "costo": 5000
    },
    {
      "id": 2,
      "tipo": "Pelota",
      "nombre": "Set de Pelotas",
      "stock": 20,
      "costo": 2000
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
  "id_equipamiento": 2,
  "cantidad": 3
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
    "id": 1,
    "cantidad": 3,
    "montoTotal": 6000,
    "idReserva": 1,
    "idEquipamiento": 2,
    "equipamiento": {
      "id": 2,
      "tipo": "Pelota",
      "nombre": "Set de Pelotas",
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
      "id": 1,
      "cantidad": 3,
      "montoTotal": 6000,
      "idReserva": 1,
      "idEquipamiento": 2,
      "equipamiento": {
        "id": 2,
        "tipo": "Pelota",
        "nombre": "Set de Pelotas",
        "costo": 2000
      }
    }
  ],
  "success": true
}
```

## Notas importantes

1. **Autenticación**: Todos los endpoints (excepto login y register) requieren un token JWT válido en el header de autorización.

2. **Rol de administrador**: Los endpoints para crear, actualizar o eliminar canchas, equipamiento y usuarios ahora requieren que el usuario tenga `isAdmin=true`.

3. **Estados del historial de reservas**: Los posibles estados son:
   - `Pendiente`: Estado inicial al crear una reserva
   - `Modificado`: Cuando se modifica una reserva existente
   - `Cancelado`: Cuando se cancela una reserva
   - `Completado`: Cuando una reserva se marca como realizada

4. **Mantenimiento de canchas**: Las canchas con `mantenimiento=true` no están disponibles para reservas.


