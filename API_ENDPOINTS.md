# API Endpoints - Sistema Remodelado PadelUCN

Este documento detalla los endpoints disponibles después de la restructuración del sistema PadelUCN, con un enfoque especial en los nuevos endpoints y los modificados.

## 1. Autenticación

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| POST | `/auth/login` | Autenticar usuario | **Modificado**: Respuesta ahora incluye `{rut, nombre, correo, rol, token}` |
| POST | `/auth/register` | Registrar nuevo usuario | Sin cambios |
| GET | `/auth/profile` | Obtener perfil del usuario actual | Sin cambios |

### Ejemplo de respuesta del Login (modificado)
```json
{
  "message": "Inicio de sesión exitoso",
  "data": {
    "rut": "11111111-1",
    "nombre": "Juan Pérez",
    "correo": "jperez@example.com",
    "rol": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": "OK",
  "timestamp": "2025-05-18T10:30:45.123Z"
}
```

## 2. Usuarios

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/users` | Obtener todos los usuarios | Sin cambios |
| GET | `/users/:rut` | Obtener usuario por RUT | Sin cambios |
| PATCH | `/users/:rut` | Actualizar usuario | Sin cambios |
| DELETE | `/users/:rut` | Eliminar usuario | Sin cambios |
| PATCH | `/users/:rut/role` | Actualizar rol de usuario | **Nuevo**: Permite cambiar el rol de un usuario a administrador o regular |
| GET | `/users/:rut/make-admin` | Hacer administrador a un usuario | **Temporal**: Endpoint para facilitar la conversión de usuarios a administradores |

### Ejemplo de actualización de rol de usuario
```json
{
  "isAdmin": true
}
```

### Ejemplo de respuesta tras actualizar rol
```json
{
  "message": "Rol de usuario actualizado exitosamente a administrador",
  "data": {
    "id_usuario": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "correo": "jperez@example.com",
    "isAdmin": true,
    "createdAt": "2025-05-18T14:30:45.123Z",
    "updatedAt": "2025-05-19T10:35:21.456Z"
  },
  "status": "OK",
  "timestamp": "2025-05-19T10:35:21.456Z"
}
```

## 3. Canchas

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/canchas` | Obtener todas las canchas | **Modificado**: Ahora incluye campo `mantenimiento` |
| GET | `/canchas/:id` | Obtener cancha por ID | **Modificado**: Ahora incluye campo `mantenimiento` |
| POST | `/canchas` | Crear nueva cancha | **Modificado**: Ahora acepta campo `mantenimiento` |
| PATCH | `/canchas/:id` | Actualizar cancha | **Modificado**: Ahora acepta campo `mantenimiento` |
| DELETE | `/canchas/:id` | Eliminar cancha | Sin cambios |
| PATCH | `/canchas/:id/mantenimiento` | Cambiar estado de mantenimiento | **Nuevo**: Específico para cambiar el estado de mantenimiento |

### Ejemplo de respuesta de Cancha (modificada)
```json
{
  "id": 1,
  "numero": 5,
  "nombre": "Cancha Principal",
  "descripcion": "Cancha principal con iluminación premium",
  "mantenimiento": false,
  "valor": 5000
}
```

## 4. Reservas

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/reservas` | Obtener todas las reservas | Sin cambios |
| GET | `/reservas/:id` | Obtener reserva por ID | Sin cambios |
| GET | `/reservas/usuario/:idUsuario` | Obtener reservas de un usuario | Sin cambios |
| POST | `/reservas` | Crear nueva reserva | **Modificado**: Ahora incluye campos de precio (default 10000) y estado de pago |
| PATCH | `/reservas/:id` | Actualizar reserva | **Modificado**: Ahora crea automáticamente un registro en historial_reserva |
| DELETE | `/reservas/:id` | Cancelar reserva | **Modificado**: Ahora crea automáticamente un registro en historial_reserva |
| PATCH | `/reservas/:id/pago` | Actualizar estado de pago | **Nuevo**: Permite marcar una reserva como pagada o no pagada |
| GET | `/reservas/:id/marcar-como-pagado` | Marcar como pagada | **Nuevo**: Endpoint de conveniencia para marcar una reserva como pagada |

### Ejemplo de respuesta de Reserva (modificada)
```json
{
  "id": 1,
  "fecha": "2025-05-20",
  "hora_inicio": "18:00",
  "hora_termino": "19:00",
  "precio": 10000,
  "pagado": false,
  "usuario": {
    "id_usuario": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez"
  },
  "cancha": {
    "id": 1,
    "numero": 5,
    "nombre": "Cancha Principal"
  }
}
```

### Ejemplo para actualizar estado de pago
```json
{
  "pagado": true
}
```

## 5. Historial de Reservas (Nuevo módulo)

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/historial-reservas` | Obtener todo el historial de reservas | **Nuevo** |
| GET | `/historial-reservas/:id` | Obtener un registro de historial por ID | **Nuevo** |
| GET | `/historial-reservas/reserva/:idReserva` | Obtener historial de una reserva específica | **Nuevo** |
| GET | `/historial-reservas/usuario/:idUsuario` | Obtener historial de un usuario específico | **Nuevo** |
| POST | `/historial-reservas` | Crear nuevo registro de historial | **Nuevo** |

### Ejemplo de respuesta de Historial de Reserva (nuevo)
```json
{
  "id": 1,
  "estado": "Modificado",
  "fechaEstado": "2025-05-18T14:30:00.000Z",
  "idReserva": 5,
  "idUsuario": 2,
  "reserva": {
    "id": 5,
    "fecha": "2025-05-20",
    "hora_inicio": "09:00:00",
    "hora_termino": "10:30:00",
    "idCancha": 1,
    "idUsuario": 2
  },
  "usuario": {
    "id": 2,
    "rut": "22222222-2",
    "nombre": "Usuario Normal",
    "correo": "usuario@padelucn.cl"
  }
}
```

## 6. Equipamiento

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/equipamiento` | Obtener todo el equipamiento | Sin cambios |
| GET | `/equipamiento/:id` | Obtener equipamiento por ID | Sin cambios |
| POST | `/equipamiento` | Crear nuevo equipamiento | Sin cambios |
| PATCH | `/equipamiento/:id` | Actualizar equipamiento | Sin cambios |
| DELETE | `/equipamiento/:id` | Eliminar equipamiento | Sin cambios |

## 7. Boletas de Equipamiento

| Método HTTP | Endpoint | Descripción | Cambios |
|-------------|----------|-------------|---------|
| GET | `/boleta-equipamiento` | Obtener todas las boletas | Sin cambios |
| GET | `/boleta-equipamiento/:id` | Obtener boleta por ID | Sin cambios |
| GET | `/boleta-equipamiento/reserva/:idReserva` | Obtener boletas por reserva | Sin cambios |
| POST | `/boleta-equipamiento` | Crear nueva boleta | Sin cambios |
| DELETE | `/boleta-equipamiento/:id` | Eliminar boleta | Sin cambios |

## Notas importantes

1. **Autenticación**: Todos los endpoints (excepto login y register) requieren un token JWT válido en el header de autorización.

2. **Rol de administrador**: Los endpoints para crear, actualizar o eliminar canchas, equipamiento y usuarios ahora requieren que el usuario tenga `is_admin=true`.

3. **Estados del historial de reservas**: Los posibles estados son:
   - `Pendiente`: Estado inicial al crear una reserva
   - `Modificado`: Cuando se modifica una reserva existente
   - `Cancelado`: Cuando se cancela una reserva
   - `Completado`: Cuando una reserva se marca como realizada
   - `PAGADO`: Cuando una reserva se marca como pagada
   - `NO_PAGADO`: Cuando se actualiza el estado de pago a no pagado

4. **Mantenimiento de canchas**: Las canchas con `mantenimiento=true` no están disponibles para reservas.
