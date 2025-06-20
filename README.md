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

### **POST** `/api/reservas`
🔒 *Requiere autenticación*

Crea una nueva reserva

**Request Body:**
```json
{
  "rut_usuario": "22222222-2",
  "numero_cancha": 1,
  "fecha": "2024-12-25",
  "hora_inicio": "10:00",
  "hora_termino": "11:30",
  "equipamiento": [
    {
      "id_equipamiento": 1,
      "cantidad": 2
    },
    {
      "id_equipamiento": 3,
      "cantidad": 1
    }
  ],
  "jugadores": [
    {
      "nombre": "Juan Pérez",
      "telefono": "+56912345678"
    },
    {
      "nombre": "María González",
      "telefono": "+56987654321"
    }
  ]
}
```

**Response Success (201):**
```json
{
  "statusCode": 201,
  "message": "Reserva creada exitosamente",
  "data": {
    "reserva": {
      "id": "RES-2024-001",
      "fecha": "2024-12-25",
      "hora_inicio": "10:00",
      "hora_termino": "11:30",
      "cancha": {
        "numero": 1,
        "nombre": "Cancha Principal"
      },
      "usuario": {
        "nombre": "Usuario Regular",
        "rut": "22222222-2"
      }
    },
    "equipamiento": [
      {
        "nombre": "Raqueta Premium",
        "cantidad": 2,
        "costo_unitario": 5000,
        "subtotal": 10000
      }
    ],
    "jugadores": [
      {
        "nombre": "Juan Pérez",
        "telefono": "+56912345678"
      }
    ],
    "costo_total": 15000
  },
  "success": true
}
```

### **GET** `/api/reservas/usuario/{rut}`
🔒 *Requiere autenticación*

Obtiene las reservas de un usuario específico

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Reservas encontradas para el usuario 22222222-2",
  "data": [
    {
      "id_reserva": "RES-2024-001",
      "fecha": "2024-12-25",
      "hora_inicio": "10:00",
      "hora_termino": "11:30",
      "estado": "Confirmada",
      "cancha": {
        "numero": 1,
        "nombre": "Cancha Principal"
      },
      "costo_total": 15000
    }
  ],
  "success": true
}
```

### **PUT** `/api/reservas/{id}/estado`
🔒 *Requiere autenticación y rol admin*

Actualiza el estado de una reserva

**Request Body:**
```json
{
  "estado": "Confirmada",
  "observaciones": "Reserva confirmada - Pago verificado"
}
```

---

## 🛠️ EQUIPAMIENTO

### **GET** `/api/equipamiento`
Obtiene todo el equipamiento disponible

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Equipamiento obtenido exitosamente",
  "data": [
    {
      "id_equipamiento": 1,
      "nombre": "Raqueta Premium",
      "tipo": "Raqueta",
      "descripcion": "Raqueta profesional de fibra de carbono",
      "costo": 5000,
      "stock": 10,
      "disponible": true
    },
    {
      "id_equipamiento": 2,
      "nombre": "Pelotas Wilson",
      "tipo": "Pelota",
      "descripcion": "Set de 3 pelotas oficiales",
      "costo": 2000,
      "stock": 25,
      "disponible": true
    }
  ],
  "success": true
}
```

### **GET** `/api/equipamiento/disponibilidad?fecha=2024-12-20&hora_inicio=10:00&hora_termino=11:30`
Verifica disponibilidad de equipamiento para un horario específico

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Disponibilidad de equipamiento verificada",
  "data": [
    {
      "id_equipamiento": 1,
      "nombre": "Raqueta Premium",
      "stock_total": 10,
      "reservado": 2,
      "disponible": 8
    }
  ],
  "success": true
}
```

---

## 📊 ADMINISTRACIÓN (Solo Admins)

### **GET** `/api/transacciones/estadisticas`
🔒 *Requiere autenticación y rol admin*

Obtiene estadísticas generales del sistema

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "cant_reservas_hoy": 5,
    "cant_reservas_mes": 47,
    "cant_reservas_pendientes": 3,
    "cant_reservas_confirmadas": 44,
    "cant_transacciones_hoy": 5,
    "cant_transacciones_mes": 47,
    "ingresos_hoy": 75000,
    "ingresos_mes": 850000,
    "clientes_activos": 23
  },
  "success": true
}
```

### **GET** `/api/transacciones`
🔒 *Requiere autenticación y rol admin*

Obtiene todas las transacciones del sistema

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "47 transacciones encontradas",
  "data": [
    {
      "id_transaccion": 1,
      "fecha": "2024-12-20",
      "reserva": {
        "id_reserva": "RES-2024-001",
        "fecha": "2024-12-25",
        "hora_inicio": "10:00",
        "hora_termino": "11:30",
        "usuario": {
          "nombre": "Usuario Regular",
          "rut": "22222222-2"
        },
        "cancha": {
          "nombre": "Cancha Principal"
        }
      },
      "monto_total": 15000
    }
  ],
  "success": true
}
```

### **GET** `/api/transacciones/periodo?fechaInicio=2024-12-01&fechaFin=2024-12-31`
🔒 *Requiere autenticación y rol admin*

Obtiene transacciones por período con resumen de ingresos

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Transacciones del período 2024-12-01 - 2024-12-31",
  "data": [
    {
      "fecha": "2024-12-20",
      "total_transacciones": 5,
      "ingresos_totales": 75000
    },
    {
      "fecha": "2024-12-19",
      "total_transacciones": 3,
      "ingresos_totales": 45000
    }
  ],
  "success": true
}
```

### **GET** `/api/usuarios/admin/todos`
🔒 *Requiere autenticación y rol admin*

Obtiene todos los usuarios del sistema

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id_usuario": 1,
      "rut": "11111111-1",
      "nombre_usuario": "Admin Usuario",
      "correo": "admin@padelucn.cl",
      "saldo": 100000,
      "is_admin": true,
      "total_reservas": 0
    },
    {
      "id_usuario": 2,
      "rut": "22222222-2",
      "nombre_usuario": "Usuario Regular",
      "correo": "usuario@example.com",
      "saldo": 25000,
      "is_admin": false,
      "total_reservas": 5
    }
  ],
  "success": true
}
```

---

## 📱 NOTIFICACIONES

### **GET** `/api/usuarios/notificaciones`
🔒 *Requiere autenticación*

Obtiene las notificaciones del usuario

**Response Success (200):**
```json
{
  "statusCode": 200,
  "message": "Notificaciones obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "titulo": "Reserva Confirmada",
      "mensaje": "Tu reserva para el 25/12/2024 a las 10:00 ha sido confirmada",
      "tipo": "confirmacion",
      "leida": false,
      "fecha": "2024-12-20T10:00:00Z"
    },
    {
      "id": 2,
      "titulo": "Recordatorio",
      "mensaje": "Tu reserva es mañana a las 10:00 en Cancha Principal",
      "tipo": "recordatorio",
      "leida": true,
      "fecha": "2024-12-24T18:00:00Z"
    }
  ],
  "success": true
}
```

---

## 🚨 CÓDIGOS DE ERROR COMUNES

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token JWT inválido o faltante |
| 403 | Forbidden | Sin permisos para esta acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: horario ya reservado) |
| 422 | Unprocessable Entity | Validación de datos fallida |
| 500 | Internal Server Error | Error interno del servidor |

## 🔧 CONFIGURACIÓN DE DESARROLLO

### Variables de Entorno
```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=ingeso
DATABASE_PASSWORD=12342
DATABASE_NAME=padelucn

# JWT
JWT_SECRET=tu_jwt_secret_key
JWT_EXPIRES_IN=24h

# Servidor
PORT=8081
NODE_ENV=development
```

### Comandos Útiles
```bash
# Reiniciar base de datos
docker-compose down padelucn-postgres
docker-compose up -d padelucn-postgres

# Ver logs
docker-compose logs padelucn-backend
docker-compose logs padelucn-postgres

# Ejecutar migraciones
npm run migration:run

# Generar nuevas migraciones
npm run migration:generate -- -n NombreMigracion
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
├── 🗄️ Base de Datos (PostgreSQL)
│   ├── usuarios
│   ├── canchas
│   ├── reservas
│   ├── equipamiento
│   ├── boleta_equipamiento
│   ├── transacciones
│   └── historial_reservas
│
├── 🔧 Backend (NestJS + TypeORM)
│   ├── Autenticación JWT
│   ├── Validaciones con class-validator
│   ├── Manejo de errores centralizado
│   └── API RESTful
│
└── 🌐 Endpoints
    ├── /api/auth (Autenticación)
    ├── /api/usuarios (Gestión de usuarios)
    ├── /api/canchas (Gestión de canchas)
    ├── /api/reservas (Sistema de reservas)
    ├── /api/equipamiento (Gestión de equipamiento)
    └── /api/transacciones (Administración)
```

---

## 📞 SOPORTE

Para soporte técnico o reportar bugs, contactar a:
- **Email**: soporte@padelucn.cl
- **Teléfono**: +56 55 235 5000

---

**¡Sistema PadelUCN - Reserva tu cancha fácil y rápido! 🏓**


Aqui te dejo las que ocupe yo:
-----
LOGIN ADMIN
POST  http://localhost:8081/api/auth/login
{
  "rut": "11111111-1",
  "contrasena": "admin123"
}
-----
Obtener reservas
GET   http://localhost:8081/api/reservas
-----
Colocar jugadores
POST  http://localhost:8081/api/jugador/batch

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
-----
Actualiza equipamiento 
POST  http://localhost:8081/api/boleta-equipamiento

{
  "id_reserva": 1,
  "id_equipamiento": 1,
  "cantidad": 2
}
-----
hacer reserva
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
-----
modificar reserva (se da el id reserva)
PATCH  http://localhost:8081/api/reserva/1
{
  "hora_inicio": "14:00",
  "hora_termino": "16:00"
}
-----
Recordatorios masivos
POST  http://localhost:8081/api/usuarios/recordatorios/masivo
{
  "ruts": ["12345678-9", "98765432-1", "11111111-1"],
  "titulo": "Mantenimiento de Canchas",
  "mensaje": "Estimado cliente, las canchas estarán cerradas el sábado 18 de enero por mantenimiento. Gracias por su comprensión."
}
-----
Obtener rquipamientos del admin
GET http://localhost:8081/api/usuarios/admin/equipamientos
-----
obtener clientes del admin
GET  http://localhost:8081/api/usuarios/admin/clientes
-----
crear usuario cliente desde el admin
POST  http://localhost:8081/api/usuarios/admin/clientes
{
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "987654321",
  "contraseña": "password123",
  "saldo": 50000,
  "is_admin": false
}
-----
crear canchas desde el admin
POST http://localhost:8081/api/usuarios/admin/canchas
{
  "numero": 9,
  "nombre": "Cancha Notificada",
  "descripcion": "Cancha que notifica a usuarios",
  "valor": 45000,
  "cantidad_max_jugadores": 4
}
-----
recordatorios para varios usuarios, colocas los ruts
POST http://localhost:8081/api/usuarios/admin/recordatorios
{
  "tipo": "reserva",
  "destinatarios": ["11111111-1"],
  "mensaje": "Recordatorio de prueba"
}
-----
recordatorio individual
POST  http://localhost:8081/api/usuarios/recordatorios/individual
{
  "rut": "11111111-1",
  "titulo": "Recordatorio de Reserva",
  "mensaje": "Tu reserva es mañana a las 15:00 en la cancha 1. ¡No olvides asistir!",
  "idReserva": 1
}
-----
obtener las transacciones 
GET  http://localhost:8081/api/transacciones
-----
obtener las estadisticas
GET  http://localhost:8081/api/transacciones/estadisticas
-----
obtener notificaciones (va con el id usuario)
GET http://localhost:8081/api/notificaciones/historial/1
-----
obtener el perfil pero de forma automatica ya que lo identifica por el token
GET http://localhost:8081/api/auth/profile