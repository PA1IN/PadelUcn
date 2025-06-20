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
# Iniciar el sistema completo
docker-compose up --build

# O individualmente:
# Iniciar base de datos
docker-compose up -d padelucn-postgres

# Iniciar backend (en otra terminal)
cd backend/ingeso-back
npm run start:dev
```

### 👥 Usuarios de Prueba
| RUT         | Contraseña  | Rol           |
|-------------|-------------|---------------|
| 11111111-1  | admin123    | Administrador |
| 22222222-2  | password123 | Usuario       |
| 33333333-3  | password123 | Usuario       |
| 44444444-4  | password123 | Usuario       |

---

## 🔐 AUTENTICACIÓN

### **POST** `/api/auth/login`
Inicia sesión y obtiene un token JWT

**Request Body:**
```json
{
  "rut": "11111111-1",
  "contrasena": "admin123"
}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Usuario autenticado exitosamente",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_usuario": 1,
      "rut": "11111111-1",
      "nombre_usuario": "Admin Usuario",
      "correo": "admin@padelucn.cl",
      "is_admin": true
    }
  },
  "success": true
}
```

### **POST** `/api/auth/register`
Registra un nuevo usuario

**Request Body:**
```json
{
  "rut": "55555555-5",
  "nombre_usuario": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "password123",
  "telefono": "+56912345678"
}
```

---

## 👤 GESTIÓN DE USUARIOS

### **GET** `/api/usuarios/perfil`
🔒 *Requiere autenticación*

Obtiene el perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id_usuario": 1,
    "rut": "11111111-1",
    "nombre_usuario": "Admin Usuario",
    "correo": "admin@padelucn.cl",
    "telefono": "+56911111111",
    "saldo": 100000,
    "is_admin": true
  },
  "success": true
}
```

### **PUT** `/api/usuarios/perfil`
🔒 *Requiere autenticación*

Actualiza el perfil del usuario

**Request Body:**
```json
{
  "nombre_usuario": "Nuevo Nombre",
  "correo": "nuevo@email.com",
  "telefono": "+56987654321"
}
```

### **POST** `/api/usuarios/cargar-saldo`
🔒 *Requiere autenticación*

Carga saldo a la cuenta del usuario

**Request Body:**
```json
{
  "monto": 50000
}
```

---

## 🏟️ GESTIÓN DE CANCHAS

### **GET** `/api/canchas`
Obtiene todas las canchas disponibles

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Canchas obtenidas exitosamente",
  "data": [
    {
      "id_cancha": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha techada con iluminación LED",
      "mantenimiento": false
    }
  ],
  "success": true
}
```

### **GET** `/api/canchas/{id}/disponibilidad?fecha=2024-12-20`
Verifica disponibilidad de una cancha en fecha específica

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Disponibilidad obtenida para la fecha 2024-12-20",
  "data": {
    "fecha": "2024-12-20",
    "cancha": {
      "id_cancha": 1,
      "nombre": "Cancha Principal"
    },
    "horarios_ocupados": [
      "10:00-11:30",
      "14:00-15:30"
    ],
    "horarios_disponibles": [
      "08:00-09:30",
      "12:00-13:30",
      "16:00-17:30"
    ]
  },
  "success": true
}
```

---

## 📅 SISTEMA DE RESERVAS

### **POST** `/api/reserva`
🔒 *Requiere autenticación*

Crea una nueva reserva

**Request Body:**
```json
{
  "rut_usuario": "11111111-1",
  "numero_cancha": 1,
  "fecha": "2024-12-25",
  "hora_inicio": "10:00",
  "hora_termino": "12:00",
  "equipamiento": [],
  "jugadores": []
}
```

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": 1,
    "fecha": "2024-12-25",
    "hora_inicio": "10:00",
    "hora_termino": "12:00",
    "estado": "PENDIENTE",
    "cancha": {
      "numero": 1,
      "nombre": "Cancha Principal"
    },
    "usuario": {
      "nombre_usuario": "Admin Usuario",
      "rut": "11111111-1"
    }
  },
  "success": true
}
```

### **GET** `/api/reservas`
🔒 *Requiere autenticación y rol admin*

Obtiene todas las reservas del sistema

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Reservas encontradas",
  "data": [
    {
      "id": 1,
      "fecha": "2024-12-25",
      "hora_inicio": "10:00",
      "hora_termino": "12:00",
      "estado": "PENDIENTE",
      "cancha": {
        "numero": 1,
        "nombre": "Cancha Principal"
      },
      "usuario": {
        "nombre_usuario": "Admin Usuario",
        "rut": "11111111-1"
      }
    }
  ],
  "success": true
}
```

### **PATCH** `/api/reserva/{id}`
🔒 *Requiere autenticación*

Modifica una reserva existente

**Request Body:**
```json
{
  "hora_inicio": "14:00",
  "hora_termino": "16:00"
}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Reserva actualizada exitosamente",
  "data": {
    "id": 1,
    "fecha": "2024-12-25",
    "hora_inicio": "14:00",
    "hora_termino": "16:00",
    "estado": "PENDIENTE"
  },
  "success": true
}
```

---

## 👥 GESTIÓN DE JUGADORES

### **POST** `/api/jugador/batch`
🔒 *Requiere autenticación*

Agrega múltiples jugadores a una reserva

**Request Body:**
```json
[
  {
    "nombre": "Juan",
    "apellido": "Pérez", 
    "rut": "12345678-9",
    "edad": 25,
    "id_reserva": 1
  },
  {
    "nombre": "María",
    "apellido": "González",
    "rut": "98765432-1", 
    "edad": 28,
    "id_reserva": 1
  }
]
```

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Jugadores creados exitosamente",
  "data": [
    {
      "id_jugador": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "rut": "12345678-9",
      "edad": 25,
      "id_reserva": 1
    },
    {
      "id_jugador": 2,
      "nombre": "María",
      "apellido": "González", 
      "rut": "98765432-1",
      "edad": 28,
      "id_reserva": 1
    }
  ],
  "success": true
}
```

---

## 🛠️ GESTIÓN DE EQUIPAMIENTO

### **GET** `/api/equipamiento`
Obtiene todo el equipamiento disponible

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Equipamiento obtenido exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Raqueta Premium",
      "tipo": "Raqueta",
      "costo": 5000,
      "stock": 10
    },
    {
      "id": 2,
      "nombre": "Pelotas Wilson",
      "tipo": "Pelota",
      "costo": 2000,
      "stock": 25
    }
  ],
  "success": true
}
```

### **POST** `/api/boleta-equipamiento`
🔒 *Requiere autenticación*

Agrega equipamiento a una reserva existente

**Request Body:**
```json
{
  "id_reserva": 1,
  "id_equipamiento": 1,
  "cantidad": 2
}
```

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Equipamiento agregado a la reserva",
  "data": {
    "id": 1,
    "cantidad": 2,
    "montoTotal": 10000,
    "equipamiento": {
      "nombre": "Raqueta Premium",
      "costo": 5000
    }
  },
  "success": true
}
```

---

## 👤 GESTIÓN DE USUARIOS (PERFIL)

### **GET** `/api/auth/profile`
🔒 *Requiere autenticación*

Obtiene el perfil del usuario autenticado automáticamente por token

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id_usuario": 1,
    "rut": "11111111-1",
    "nombre_usuario": "Admin Usuario",
    "correo": "admin@padelucn.cl",
    "telefono": "+56911111111",
    "saldo": 100000,
    "is_admin": true,
    "created_at": "2024-12-20T10:00:00.000Z"
  },
  "success": true
}
```

---

## 📊 ADMINISTRACIÓN (Solo Admins)

### **GET** `/api/usuarios/admin/equipamientos`
🔒 *Requiere autenticación y rol admin*

Obtiene equipamientos para gestión administrativa

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Equipamientos obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "Raqueta Premium",
      "tipo": "Raqueta",
      "stock": 10,
      "costo": 5000,
      "reservas_activas": 2
    }
  ],
  "success": true
}
```

### **GET** `/api/usuarios/admin/clientes`
🔒 *Requiere autenticación y rol admin*

Obtiene todos los clientes del sistema

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Clientes obtenidos exitosamente",
  "data": [
    {
      "id_usuario": 2,
      "rut": "22222222-2",
      "nombre": "Usuario Regular",
      "correo": "usuario@example.com",
      "saldo": 25000,
      "total_reservas": 5,
      "is_admin": false
    }
  ],
  "success": true
}
```

### **POST** `/api/usuarios/admin/clientes`
🔒 *Requiere autenticación y rol admin*

Crea un nuevo cliente desde administración

**Request Body:**
```json
{
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "987654321",
  "contraseña": "password123",
  "saldo": 50000,
  "is_admin": false
}
```

### **POST** `/api/usuarios/admin/canchas`
🔒 *Requiere autenticación y rol admin*

Crea una nueva cancha desde administración

**Request Body:**
```json
{
  "numero": 9,
  "nombre": "Cancha Notificada",
  "descripcion": "Cancha que notifica a usuarios",
  "valor": 45000,
  "cantidad_max_jugadores": 4
}
```

---

## 📱 SISTEMA DE NOTIFICACIONES

### **POST** `/api/usuarios/recordatorios/individual`
🔒 *Requiere autenticación*

Envía recordatorio individual a un usuario específico

**Request Body:**
```json
{
  "rut": "11111111-1",
  "titulo": "Recordatorio de Reserva",
  "mensaje": "Tu reserva es mañana a las 15:00 en la cancha 1. ¡No olvides asistir!",
  "idReserva": 1
}
```

### **POST** `/api/usuarios/recordatorios/masivo`
🔒 *Requiere autenticación y rol admin*

Envía recordatorios masivos a múltiples usuarios

**Request Body:**
```json
{
  "ruts": ["12345678-9", "98765432-1", "11111111-1"],
  "titulo": "Mantenimiento de Canchas",
  "mensaje": "Estimado cliente, las canchas estarán cerradas el sábado 18 de enero por mantenimiento. Gracias por su comprensión."
}
```

### **POST** `/api/usuarios/admin/recordatorios`
🔒 *Requiere autenticación y rol admin*

Envía recordatorios administrativos

**Request Body:**
```json
{
  "tipo": "reserva",
  "destinatarios": ["11111111-1"],
  "mensaje": "Recordatorio de prueba"
}
```

### **GET** `/api/notificaciones/historial/{id_usuario}`
🔒 *Requiere autenticación*

Obtiene el historial de notificaciones de un usuario

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Historial de notificaciones obtenido",
  "data": [
    {
      "id": 1,
      "titulo": "Recordatorio de Reserva",
      "mensaje": "Tu reserva es mañana a las 15:00",
      "fecha": "2024-12-20T10:00:00.000Z",
      "leida": false
    }
  ],
  "success": true
}
```

---

## 💰 GESTIÓN DE SALDO

### **GET** `/api/auth/saldo`
🔒 *Requiere autenticación*

Obtiene el saldo actual del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Saldo obtenido exitosamente",
  "data": {
    "saldo": 50000
  },
  "success": true
}
```

**Response Error (401):**
```json
{
  "statusCode": 401,
  "message": "Token no válido",
  "data": null,
  "success": false,
  "error": "Unauthorized"
}
```

### **PATCH** `/api/auth/saldo`
🔒 *Requiere autenticación*

Actualiza el saldo del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nuevoSaldo": 75000,
  "transaccion": "Recarga de saldo: $25.000"
}
```

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Saldo actualizado exitosamente",
  "data": {
    "saldo_anterior": 50000,
    "saldo_nuevo": 75000,
    "diferencia": 25000,
    "transaccion": "Recarga de saldo: $25.000"
  },
  "success": true
}
```

**Response Error (400):**
```json
{
  "statusCode": 400,
  "message": "Error al actualizar saldo",
  "data": null,
  "success": false,
  "error": "Saldo insuficiente o datos inválidos"
}
```

### **POST** `/api/usuarios/cargar-saldo`
🔒 *Requiere autenticación*

Carga saldo a la cuenta del usuario autenticado (simulación de pago)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "monto": 50000,
  "datosPago": {
    "metodoPago": "tarjeta_credito",
    "numeroTarjeta": "****1234",
    "codigoTransaccion": "TXN123456789"
  }
}
```

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Saldo cargado exitosamente",
  "data": {
    "saldo_anterior": 25000,
    "saldo_nuevo": 75000,
    "monto_cargado": 50000,
    "transaccion": "Recarga de saldo: $50.000",
    "fecha": "2024-12-20T15:30:00.000Z"
  },
  "success": true
}
```

**Response Error (400):**
```json
{
  "statusCode": 400,
  "message": "El monto debe ser mayor que cero",
  "data": null,
  "success": false,
  "error": "Monto inválido"
}
```

---

## 🧪 ENDPOINTS DE TEST UTILIZADOS

```http
# 1. LOGIN ADMIN
POST http://localhost:8081/api/auth/login
{
  "rut": "11111111-1",
  "contrasena": "admin123"
}

# 2. OBTENER PERFIL AUTOMÁTICO
GET http://localhost:8081/api/auth/profile
Authorization: Bearer {token}

# 3. CREAR RESERVA
POST http://localhost:8081/api/reserva
{
  "fecha": "2024-12-25",
  "hora_inicio": "10:00",
  "hora_termino": "12:00",
  "rut_usuario": "11111111-1",
  "numero_cancha": 1,
  "equipamiento": [],
  "jugadores": []
}

# 4. OBTENER TODAS LAS RESERVAS (ADMIN)
GET http://localhost:8081/api/reservas
Authorization: Bearer {token}

# 5. MODIFICAR RESERVA
PATCH http://localhost:8081/api/reserva/1
{
  "hora_inicio": "14:00",
  "hora_termino": "16:00"
}

# 6. AGREGAR JUGADORES
POST http://localhost:8081/api/jugador/batch
[
  {
    "nombre": "Juan",
    "apellido": "Pérez", 
    "rut": "12345678-9",
    "edad": 25,
    "id_reserva": 1
  }
]

# 7. AGREGAR EQUIPAMIENTO
POST http://localhost:8081/api/boleta-equipamiento
{
  "id_reserva": 1,
  "id_equipamiento": 1,
  "cantidad": 2
}
```