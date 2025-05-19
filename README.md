# Padel UCN

Sistema de gestión para canchas de pádel de la Universidad Católica del Norte.

> **NOTA IMPORTANTE: Sistema en Reestructuración**
> 
> El sistema ha sido actualizado con una nueva estructura de base de datos. Se han aplicado los siguientes cambios:
> - Eliminación del módulo Admin (reemplazado por un flag `isAdmin` en la entidad User)
> - Actualización de entidades para mapear correctamente a la nueva base de datos
> - Añadido seguimiento de historial de reservas
> - Ver detalles completos en [ENTITY_UPDATES.md](ENTITY_UPDATES.md)

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

#### Creación de cancha (POST)
```json
{
  "numero": 1,
  "nombre": "Cancha Principal",
  "descripcion": "Cancha techada con iluminación nocturna",
  "valor": 50,
  "mantenimiento": false
}
```

#### Actualización de cancha (PATCH)
```json
{
  "nombre": "Cancha Principal",
  "descripcion": "Cancha techada con iluminación nocturna y bebedero",
  "valor": 60,
  "mantenimiento": false
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
| POST | `/api/users/login` | Inicia sesión y obtiene un token de acceso |

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

### Formato de datos

#### Creación de reserva (POST)
```json
{
  "fecha": "2025-06-01",
  "hora_inicio": "18:00",
  "hora_termino": "19:00",
  "rut_usuario": "12345678-9",
  "numero_cancha": 1
}
```

#### Actualización de reserva (PATCH)
```json
{
  "fecha": "2025-06-02",
  "hora_inicio": "19:00",
  "hora_termino": "20:00"
}
```

#### Verificar disponibilidad
```
GET /api/reservas/disponibilidad/1/2025-06-01/18:00/19:00
```

#### Obtener horarios disponibles
```
GET /api/reservas/disponibilidad-dia/1/2025-06-01
```


