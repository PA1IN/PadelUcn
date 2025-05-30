# Padel UCN

Sistema de gestión para canchas de pádel de la Universidad Católica del Norte.

> **NOTA IMPORTANTE: Sistema Actualizado**
> 
> El sistema ha sido actualizado con una nueva estructura de base de datos. Se han aplicado los siguientes cambios:
> - Eliminación del módulo Admin (reemplazado por un flag `isAdmin` en la entidad User)
> - Actualización de entidades para mapear correctamente a la nueva base de datos
> - Añadido seguimiento de historial de reservas y equipamiento
> - Sistema de pago con saldo de usuario para reservas y equipamiento

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
- **ID**: Identificador único de la cancha (Primary Key)
- **Nombre**: Nombre descriptivo de la cancha
- **Descripción**: Información detallada sobre la cancha
- **Valor**: Costo por hora de la cancha en la moneda local
- **Mantenimiento**: Indica si la cancha está en mantenimiento (no disponible para reservas)

### Endpoints de la API para Canchas

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/canchas` | Obtiene todas las canchas disponibles | Usuario/Admin |
| GET | `/api/canchas/:id` | Obtiene la información de una cancha específica | Usuario/Admin |
| POST | `/api/canchas` | Crea una nueva cancha | Admin |
| PATCH | `/api/canchas/:id` | Actualiza la información de una cancha existente | Admin |
| DELETE | `/api/canchas/:id` | Elimina una cancha | Admin |

### Formato de datos

#### Creación de cancha (POST `/api/canchas`)
```json
{
  "nombre": "Cancha Principal",
  "descripcion": "Cancha techada con iluminación nocturna",
  "valor": 15000,
  "mantenimiento": false
}
```

#### Actualización de cancha (PATCH `/api/canchas/:id`)
```json
{
  "nombre": "Cancha Principal",
  "descripcion": "Cancha techada con iluminación nocturna y bebedero",
  "valor": 16000,
  "mantenimiento": true
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
      "nombre": "Cancha Principal",
      "descripcion": "Cancha techada con iluminación nocturna",
      "mantenimiento": false,
      "valor": 15000
    },
    {
      "id": 2,
      "nombre": "Cancha Secundaria",
      "descripcion": "Cancha con piso de última generación",
      "mantenimiento": false,
      "valor": 12000
    }
  ],
  "success": true
}
```

## Módulo de Usuarios y Autenticación

El sistema maneja un modelo unificado para usuarios, donde se distinguen usuarios administradores y regulares:

### Atributos de Usuario
- **ID**: Identificador único del usuario en la base de datos
- **RUT**: Identificador único del usuario (formato chileno)
- **Nombre de Usuario**: Nombre completo del usuario
- **Correo**: Correo electrónico del usuario
- **Contraseña**: Contraseña del usuario (almacenada hasheada de forma segura)
- **Teléfono**: Número de teléfono del usuario
- **Saldo**: Saldo disponible para realizar reservas y alquilar equipamiento
- **isAdmin**: Flag que indica si el usuario es administrador

### Endpoints de la API para Usuarios

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/users` | Obtiene todos los usuarios | Admin |
| GET | `/api/users/:rut` | Obtiene la información de un usuario específico por su RUT | Usuario/Admin |
| POST | `/api/users` | Registra un nuevo usuario | Público |
| PATCH | `/api/users/:rut` | Actualiza la información de un usuario existente | Usuario/Admin |
| PATCH | `/api/users/:rut/ingresar-saldo` | Ingresa saldo a un usuario | Usuario/Admin |
| DELETE | `/api/users/:rut` | Elimina un usuario | Admin |

### Endpoints de la API para Autenticación

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| POST | `/api/auth/login` | Inicia sesión y obtiene un token de acceso | Público |
| POST | `/api/auth/register` | Registra un nuevo usuario y obtiene un token | Público |
| GET | `/api/auth/profile` | Obtiene el perfil del usuario autenticado | Usuario/Admin |

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

#### Respuesta al registrar usuario
```json
{
  "statusCode": 201,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "rut": "12345678-9",
    "nombreUsuario": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "telefono": "+56912345678",
    "saldo": 0,
    "isAdmin": false,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

#### Inicio de sesión (POST `/api/auth/login`)
```json
{
  "rut": "12345678-9",
  "password": "contraseña123"
}
```

#### Respuesta al iniciar sesión
```json
{
  "statusCode": 200,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": 1,
    "rut": "12345678-9",
    "nombreUsuario": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "telefono": "+56912345678",
    "saldo": 0,
    "isAdmin": false,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

#### Actualización de usuario (PATCH `/api/users/:rut`)
```json
{
  "nombreUsuario": "Juan Carlos Pérez",
  "correo": "juan.perez@nuevoemail.com",
  "telefono": "+56987654321"
}
```

#### Ingreso de saldo (PATCH `/api/users/:rut/ingresar-saldo`)
```json
{
  "monto": 50000
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
    "nombreUsuario": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "telefono": "+56912345678",
    "saldo": 50000,
    "isAdmin": false
  },
  "success": true
}
```

## Módulo de Reservas

El sistema permite la gestión de reservas de canchas con su respectivo historial y procesamiento de pagos automáticos:

### Atributos de Reserva
- **ID**: Identificador único de la reserva
- **Fecha**: Fecha de la reserva
- **Hora Inicio**: Hora de inicio de la reserva
- **Hora Término**: Hora de término de la reserva
- **ID Cancha**: ID de la cancha reservada
- **ID Usuario**: ID del usuario que realiza la reserva

### Atributos de Historial de Reserva
- **ID**: Identificador único del registro de historial
- **Estado**: Estado de la reserva (Cancelado, Modificado, Pendiente)
- **Fecha Estado**: Fecha y hora del cambio de estado
- **ID Reserva**: ID de la reserva relacionada
- **ID Usuario**: ID del usuario que realizó el cambio

### Endpoints de la API para Reservas

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/reservas` | Obtiene todas las reservas | Admin |
| GET | `/api/reservas/:id` | Obtiene la información de una reserva específica | Usuario/Admin |
| POST | `/api/reservas` | Crea una nueva reserva (y realiza cobro al usuario) | Usuario/Admin |
| PATCH | `/api/reservas/:id` | Actualiza la información de una reserva existente | Usuario/Admin |
| DELETE | `/api/reservas/:id` | Cancela una reserva (y realiza reembolso parcial) | Usuario/Admin |
| GET | `/api/reservas/usuario/:rut` | Obtiene todas las reservas de un usuario | Usuario/Admin |
| GET | `/api/reservas/cancha/:id` | Obtiene todas las reservas de una cancha | Usuario/Admin |
| GET | `/api/reservas/disponibilidad/:id/:fecha/:horaInicio/:horaTermino` | Verifica disponibilidad de una cancha | Usuario/Admin |
| GET | `/api/reservas/disponibilidad-dia/:id/:fecha` | Obtiene los horarios disponibles de una cancha | Usuario/Admin |
| GET | `/api/reservas/estadisticas` | Obtiene estadísticas de uso de las canchas | Admin |

### Endpoints de la API para Historial de Reservas

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/historial-reservas` | Obtiene todos los registros del historial | Admin |
| GET | `/api/historial-reservas/:id` | Obtiene un registro específico del historial | Usuario/Admin |
| GET | `/api/historial-reservas/reserva/:id` | Obtiene todo el historial de una reserva específica | Usuario/Admin |
| GET | `/api/historial-reservas/usuario/:id` | Obtiene todo el historial de un usuario | Usuario/Admin |
| POST | `/api/historial-reservas` | Crea un nuevo registro en el historial | Sistema |

### Formato de datos

#### Creación de reserva (POST `/api/reservas`)
```json
{
  "rutUsuario": "12345678-9",
  "canchaId": 1,
  "fecha": "2025-06-01",
  "horaInicio": "18:00:00",
  "horaTermino": "19:00:00"
}
```

#### Respuesta al crear una reserva
```json
{
  "statusCode": 201,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": 1,
    "fecha": "2025-06-01T00:00:00.000Z",
    "horaInicio": "18:00:00",
    "horaTermino": "19:00:00",
    "canchaId": 1,
    "usuarioId": 1,
    "usuario": {
      "id": 1,
      "rut": "12345678-9",
      "nombreUsuario": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "telefono": "+56912345678",
      "saldo": 35000
    },
    "cancha": {
      "id": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha techada con iluminación nocturna",
      "mantenimiento": false,
      "valor": 15000
    }
  },
  "success": true
}
```

#### Actualización de reserva (PATCH `/api/reservas/:id`)
```json
{
  "fecha": "2025-06-02",
  "horaInicio": "19:00:00",
  "horaTermino": "20:00:00"
}
```

#### Consulta de disponibilidad (GET `/api/reservas/disponibilidad/:id/:fecha/:horaInicio/:horaTermino`)
```json
{
  "statusCode": 200,
  "message": "Horario disponible",
  "data": true,
  "success": true
}
```

#### Consulta de horarios disponibles (GET `/api/reservas/disponibilidad-dia/:id/:fecha`)
```json
{
  "statusCode": 200,
  "message": "Horarios disponibles obtenidos exitosamente",
  "data": {
    "disponibles": [
      {
        "inicio": "08:00:00",
        "fin": "09:00:00"
      },
      {
        "inicio": "09:00:00",
        "fin": "10:00:00"
      },
      {
        "inicio": "10:00:00",
        "fin": "11:00:00"
      },
      {
        "inicio": "11:00:00",
        "fin": "12:00:00"
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
      "id": 1,
      "fecha": "2025-06-01T00:00:00.000Z",
      "horaInicio": "18:00:00",
      "horaTermino": "19:00:00",
      "canchaId": 1,
      "usuarioId": 1,
      "cancha": {
        "id": 1,
        "nombre": "Cancha Principal",
        "descripcion": "Cancha techada con iluminación nocturna",
        "mantenimiento": false,
        "valor": 15000
      }
    }
  ],
  "success": true
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
      "fechaEstado": "2025-05-29T17:52:20.000Z",
      "reservaId": 1,
      "usuarioId": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombreUsuario": "Juan Pérez"
      }
    },
    {
      "id": 2,
      "estado": "Modificado",
      "fechaEstado": "2025-05-29T18:15:30.000Z",
      "reservaId": 1,
      "usuarioId": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombreUsuario": "Juan Pérez"
      }
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
    "ingresoTotal": 1800000,
    "reservasPorCancha": [
      { "idCancha": 1, "nombre": "Cancha Principal", "totalReservas": 45 },
      { "idCancha": 2, "nombre": "Cancha Secundaria", "totalReservas": 38 },
      { "idCancha": 3, "nombre": "Cancha Exterior", "totalReservas": 37 }
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

## Módulo de Equipamiento

El sistema permite la gestión de equipamiento deportivo para alquilar durante las reservas:

### Atributos de Equipamiento
- **ID**: Identificador único del equipamiento
- **Tipo**: Tipo de equipamiento (paleta, pelota, indumentaria, etc.)
- **Nombre**: Nombre descriptivo del equipamiento
- **Stock**: Cantidad disponible para alquilar
- **Costo**: Costo por unidad del alquiler del equipamiento

### Endpoints de la API para Equipamiento

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/equipamiento` | Obtiene todo el equipamiento disponible | Usuario/Admin |
| GET | `/api/equipamiento/:id` | Obtiene la información de un equipamiento específico | Usuario/Admin |
| POST | `/api/equipamiento` | Crea un nuevo equipamiento | Admin |
| PATCH | `/api/equipamiento/:id` | Actualiza la información de un equipamiento existente | Admin |
| DELETE | `/api/equipamiento/:id` | Elimina un equipamiento | Admin |

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
    },
    {
      "id": 3,
      "tipo": "Indumentaria",
      "nombre": "Camiseta Oficial",
      "stock": 25,
      "costo": 2000
    }
  ],
  "success": true
}
```

## Módulo de Boleta de Equipamiento

El sistema permite la gestión de boletas de alquiler de equipamiento asociadas a las reservas, con procesamiento automático de pagos desde el saldo del usuario:

### Atributos de Boleta de Equipamiento
- **ID**: Identificador único de la boleta de equipamiento
- **Cantidad**: Cantidad de unidades del equipamiento alquilado
- **Monto Total**: Costo total del alquiler (cantidad * costo unitario del equipamiento)
- **ID Reserva**: ID de la reserva asociada a la boleta
- **ID Equipamiento**: ID del equipamiento alquilado

### Endpoints de la API para Boleta de Equipamiento

| Método HTTP | Endpoint | Descripción | Permisos |
|-------------|----------|-------------|----------|
| GET | `/api/boleta-equipamiento` | Obtiene todas las boletas de equipamiento | Admin |
| GET | `/api/boleta-equipamiento/:id` | Obtiene la información de una boleta específica | Usuario/Admin |
| POST | `/api/boleta-equipamiento` | Crea una nueva boleta de equipamiento y procesa el pago | Usuario/Admin |
| PATCH | `/api/boleta-equipamiento/:id` | Actualiza la información de una boleta existente | Admin |
| DELETE | `/api/boleta-equipamiento/:id` | Elimina una boleta | Admin |

### Formato de datos

#### Creación de boleta de equipamiento (POST `/api/boleta-equipamiento`)
```json
{
  "cantidad": 3,
  "idReserva": 1,
  "idEquipamiento": 2
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

#### Actualización de boleta de equipamiento (PATCH `/api/boleta-equipamiento/:id`)
```json
{
  "cantidad": 4
}
```

#### Respuesta al obtener todas las boletas de equipamiento (GET `/api/boleta-equipamiento`)
```json
{
  "statusCode": 200,
  "message": "Boletas de equipamiento obtenidas exitosamente",
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
      },
      "reserva": {
        "id": 1,
        "fecha": "2025-06-01T00:00:00.000Z",
        "horaInicio": "18:00:00",
        "horaTermino": "19:00:00"
      }
    },
    {
      "id": 2,
      "cantidad": 1,
      "montoTotal": 5000,
      "idReserva": 2,
      "idEquipamiento": 1,
      "equipamiento": {
        "id": 1,
        "tipo": "Paleta",
        "nombre": "Paleta Profesional",
        "costo": 5000
      },
      "reserva": {
        "id": 2,
        "fecha": "2025-06-02T00:00:00.000Z",
        "horaInicio": "10:00:00",
        "horaTermino": "11:00:00"
      }
    }
  ],
  "success": true
}
```

## Notas importantes de implementación

1. **Seguridad y autenticación**:
   - La API utiliza tokens JWT para autenticación
   - Todos los endpoints (excepto login y register) requieren token de autenticación
   - Los roles de usuario incluyen: Usuario (regular) y Admin

2. **Sistema de pago**:
   - Los usuarios deben tener saldo suficiente para hacer reservas y alquilar equipamiento
   - El sistema descuenta automáticamente el costo al realizar una reserva o alquilar equipamiento
   - Al cancelar reservas, se reembolsa un porcentaje del costo según el tiempo de anticipación:
     - 80% si es con más de 24 horas de anticipación
     - 50% si es con menos de 24 horas de anticipación

3. **Disponibilidad de canchas**:
   - Las canchas con mantenimiento=true no están disponibles para reservas
   - El sistema verifica conflictos de horarios antes de permitir una nueva reserva
   - Los horarios disponibles se calculan en bloques de 1 hora (8:00 a 22:00)

4. **Historial de cambios**:
   - Toda acción sobre una reserva (creación, modificación, cancelación) se registra en el historial
   - Los estados posibles para una reserva son: "Pendiente", "Modificado", "Cancelado"

5. **Control de stock**:
   - El sistema verifica y actualiza automáticamente el stock de equipamiento al crear/eliminar boletas
   - No se permite alquilar equipamiento si no hay unidades disponibles

6. **Validaciones importantes**:
   - Todos los datos de entrada son validados para asegurar integridad de datos
   - Los horarios de reserva deben ser en bloques de hora completa
   - Una reserva no puede durar menos de 1 hora ni más de 3 horas consecutivas

## Notas importantes

1. **Autenticación**: Todos los endpoints (excepto login y register) requieren un token JWT válido en el header de autorización.

2. **Rol de administrador**: Los endpoints para crear, actualizar o eliminar canchas, equipamiento y usuarios ahora requieren que el usuario tenga `isAdmin=true`.

3. **Estados del historial de reservas**: Los posibles estados son:
   - `Pendiente`: Estado inicial al crear una reserva
   - `Modificado`: Cuando se modifica una reserva existente
   - `Cancelado`: Cuando se cancela una reserva
   - `Completado`: Cuando una reserva se marca como realizada

4. **Mantenimiento de canchas**: Las canchas con `mantenimiento=true` no están disponibles para reservas.


