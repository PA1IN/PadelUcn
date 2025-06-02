<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test
```

## API Endpoints

### Authentication

- `POST /auth/login`: Login with username and password, returns JWT token

  **Request Body:**
  ```json
  {
    "email": "usuario@example.com",
    "password": "contraseña123"
  }
  ```

  **Response:**
  ```json
  {
    "message": "Login exitoso",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez",
        "email": "usuario@example.com",
        "isAdmin": false,
        "saldo": 50000
      }
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /auth/register`: Register a new user

  **Request Body:**
  ```json
  {
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "email": "usuario@example.com",
    "password": "contraseña123",
    "telefono": "+56912345678"
  }
  ```

  **Response:**
  ```json
  {
    "message": "Usuario registrado exitosamente",
    "data": {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan Pérez",
      "email": "usuario@example.com",
      "isAdmin": false,
      "saldo": 0
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

### Users

- `GET /usuarios`: Get all users (admin only)

  **Response:**
  ```json
  {
    "message": "Usuarios obtenidos exitosamente",
    "data": [
      {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez",
        "email": "usuario@example.com",
        "isAdmin": false,
        "saldo": 5000
      },
      {
        "id": 2,
        "rut": "98765432-1",
        "nombre": "María López",
        "email": "maria@example.com",
        "isAdmin": true,
        "saldo": 10000
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /usuarios/:id`: Get user by ID
  
  **Response:**
  ```json
  {
    "message": "Usuario obtenido exitosamente",
    "data": {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan Pérez",
      "email": "usuario@example.com",
      "isAdmin": false,
      "saldo": 5000,
      "reservas": [
        {
          "id": 1,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "12:00:00"
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `PATCH /usuarios/:id`: Update user
  
  **Request Body:**
  ```json
  {
    "nombre": "Juan Carlos Pérez",
    "telefono": "+56987654321"
  }
  ```

  **Response:**
  ```json
  {
    "message": "Usuario actualizado exitosamente",
    "data": {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan Carlos Pérez",
      "email": "usuario@example.com",
      "telefono": "+56987654321",
      "isAdmin": false,
      "saldo": 5000
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /usuarios/:id`: Delete user (admin only)
  
  **Response:**
  ```json
  {
    "message": "Usuario eliminado exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /usuarios/add-balance`: Add balance to user's account
  
  **Request Body:**
  ```json
  {
    "rut": "12345678-9",
    "monto": 10000
  }
  ```

  **Response:**
  ```json
  {
    "message": "Saldo agregado exitosamente",
    "data": {
      "id": 1,
      "rut": "12345678-9",
      "nombre": "Juan Pérez",
      "saldo": 15000
    },
    "statusCode": "OK",
    "error": null
  }
  ```

### Courts (Canchas)

- `GET /canchas`: Get all courts

  **Response:**
  ```json
  {
    "message": "Canchas obtenidas exitosamente",
    "data": [
      {
        "id": 1,
        "numero": 1,
        "nombre": "Cancha Principal",
        "descripcion": "Cancha de pádel profesional con paredes de cristal",
        "valor": 15000,
        "mantenimiento": false
      },
      {
        "id": 2,
        "numero": 2,
        "nombre": "Cancha Secundaria",
        "descripcion": "Cancha de pádel estándar",
        "valor": 12000,
        "mantenimiento": false
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /canchas/:id`: Get court by ID

  **Response:**
  ```json
  {
    "message": "Cancha obtenida exitosamente",
    "data": {
      "id": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha de pádel profesional con paredes de cristal",
      "valor": 15000,
      "mantenimiento": false,
      "reservas": [
        {
          "id": 1,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "12:00:00"
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /canchas`: Create a new court (admin only)

  **Request Body:**
  ```json
  {
    "numero": 3,
    "nombre": "Cancha Techada",
    "descripcion": "Cancha de pádel techada para uso en días lluviosos",
    "valor": 18000,
    "mantenimiento": false
  }
  ```

  **Response:**
  ```json
  {
    "message": "Cancha creada exitosamente",
    "data": {
      "id": 3,
      "numero": 3,
      "nombre": "Cancha Techada",
      "descripcion": "Cancha de pádel techada para uso en días lluviosos",
      "valor": 18000,
      "mantenimiento": false
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `PATCH /canchas/:id`: Update court (admin only)

  **Request Body:**
  ```json
  {
    "valor": 20000,
    "mantenimiento": true
  }
  ```

  **Response:**
  ```json
  {
    "message": "Cancha actualizada exitosamente",
    "data": {
      "id": 1,
      "numero": 1,
      "nombre": "Cancha Principal",
      "descripcion": "Cancha de pádel profesional con paredes de cristal",
      "valor": 20000,
      "mantenimiento": true
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /canchas/:id`: Delete court (admin only)

  **Response:**
  ```json
  {
    "message": "Cancha eliminada exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

### Reservations (Reservas)

- `POST /reservas`: Create a new reservation

  **Request Body:**
  ```json
  {
    "fecha": "2025-06-10",
    "hora_inicio": "10:00:00",
    "hora_termino": "11:30:00",
    "rut_usuario": "12345678-9",
    "numero_cancha": 1,
    "jugadores": [
      {
        "nombre": "Carlos",
        "apellido": "Rodríguez",
        "rut": "11111111-1",
        "edad": 28
      },
      {
        "nombre": "Ana",
        "apellido": "García",
        "rut": "22222222-2",
        "edad": 32
      }
    ],
    "equipamiento": [
      {
        "id_equipamiento": 1,
        "cantidad": 2
      },
      {
        "id_equipamiento": 3,
        "cantidad": 4
      }
    ]
  }
  ```

  **Response:**
  ```json
  {
    "message": "Reserva #23 creada exitosamente para la cancha #1",
    "data": {
      "id": 23,
      "fecha": "2025-06-10",
      "hora_inicio": "10:00:00",
      "hora_termino": "11:30:00",
      "idUsuario": 1,
      "idCancha": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "saldo": 45000
      },
      "cancha": {
        "id": 1,
        "numero": 1,
        "nombre": "Cancha Principal",
        "valor": 15000
      },
      "boletas": [
        {
          "id": 15,
          "cantidad": 2,
          "montoTotal": 4000,
          "idReserva": 23,
          "idEquipamiento": 1,
          "equipamiento": {
            "id": 1,
            "nombre": "Raqueta Pro",
            "costo": 2000,
            "stock": 10
          }
        },
        {
          "id": 16,
          "cantidad": 4,
          "montoTotal": 2000,
          "idReserva": 23,
          "idEquipamiento": 3,
          "equipamiento": {
            "id": 3,
            "nombre": "Pelotas (pack)",
            "costo": 500,
            "stock": 20
          }
        }
      ],
      "jugadores": [
        {
          "id": 45,
          "nombre": "Carlos",
          "apellido": "Rodríguez",
          "rut": "11111111-1",
          "edad": 28,
          "idReserva": 23
        },
        {
          "id": 46,
          "nombre": "Ana",
          "apellido": "García", 
          "rut": "22222222-2",
          "edad": 32,
          "idReserva": 23
        }
      ]
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `GET /reservas`: Get all reservations (admin only)

  **Response:**
  ```json
  {
    "message": "Reservas obtenidas exitosamente",
    "data": [
      {
        "id": 22,
        "fecha": "2025-06-09",
        "hora_inicio": "09:00:00",
        "hora_termino": "10:30:00",
        "idUsuario": 2,
        "idCancha": 2,
        "usuario": {
          "id": 2,
          "rut": "98765432-1",
          "nombre": "María López"
        },
        "cancha": {
          "id": 2,
          "numero": 2,
          "nombre": "Cancha Secundaria"
        }
      },
      {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00",
        "idUsuario": 1,
        "idCancha": 1,
        "usuario": {
          "id": 1,
          "rut": "12345678-9",
          "nombre": "Juan Pérez"
        },
        "cancha": {
          "id": 1,
          "numero": 1,
          "nombre": "Cancha Principal"
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/:id`: Get reservation by ID

  **Response:**
  ```json
  {
    "message": "Reserva obtenida exitosamente",
    "data": {
      "id": 23,
      "fecha": "2025-06-10",
      "hora_inicio": "10:00:00",
      "hora_termino": "11:30:00",
      "idUsuario": 1,
      "idCancha": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "cancha": {
        "id": 1,
        "numero": 1,
        "nombre": "Cancha Principal",
        "valor": 15000
      },
      "boletas": [
        {
          "id": 15,
          "cantidad": 2,
          "montoTotal": 4000,
          "equipamiento": {
            "id": 1,
            "nombre": "Raqueta Pro"
          }
        }
      ],
      "jugadores": [
        {
          "id": 45,
          "nombre": "Carlos",
          "apellido": "Rodríguez",
          "rut": "11111111-1",
          "edad": 28
        },
        {
          "id": 46,
          "nombre": "Ana",
          "apellido": "García",
          "rut": "22222222-2",
          "edad": 32
        }
      ],
      "historial": [
        {
          "id": 12,
          "estado": "Pendiente",
          "fechaEstado": "2025-06-02T10:34:22.120Z",
          "idReserva": 23,
          "idUsuario": 1
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/usuario/:rut`: Get reservations by user RUT

  **Response:**
  ```json
  {
    "message": "Reservas del usuario obtenidas exitosamente",
    "data": [
      {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00",
        "idCancha": 1,
        "cancha": {
          "id": 1,
          "numero": 1,
          "nombre": "Cancha Principal"
        },
        "boletas": [
          {
            "id": 15,
            "cantidad": 2,
            "montoTotal": 4000,
            "equipamiento": {
              "id": 1,
              "nombre": "Raqueta Pro"
            }
          }
        ]
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/cancha/:numero`: Get reservations by court number

  **Response:**
  ```json
  {
    "message": "Reservas de la cancha obtenidas exitosamente",
    "data": [
      {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00",
        "idUsuario": 1,
        "usuario": {
          "id": 1,
          "rut": "12345678-9",
          "nombre": "Juan Pérez"
        },
        "boletas": [
          {
            "id": 15,
            "cantidad": 2,
            "montoTotal": 4000
          }
        ],
        "historial": [
          {
            "id": 12,
            "estado": "Pendiente",
            "fechaEstado": "2025-06-02T10:34:22.120Z"
          }
        ]
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `PATCH /reservas/:id`: Update reservation

  **Request Body:**
  ```json
  {
    "hora_inicio": "11:00:00",
    "hora_termino": "12:30:00",
    "equipamiento": [
      {
        "id_equipamiento": 1,
        "cantidad": 3
      }
    ],
    "jugadores": [
      {
        "nombre": "Carlos",
        "apellido": "Rodríguez",
        "rut": "11111111-1",
        "edad": 28
      },
      {
        "nombre": "Ana",
        "apellido": "García",
        "rut": "22222222-2",
        "edad": 32
      },
      {
        "nombre": "Laura",
        "apellido": "Martínez",
        "rut": "33333333-3",
        "edad": 29
      }
    ]
  }
  ```

  **Response:**
  ```json
  {
    "message": "Reserva modificada exitosamente",
    "data": {
      "id": 23,
      "fecha": "2025-06-10",
      "hora_inicio": "11:00:00",
      "hora_termino": "12:30:00",
      "idUsuario": 1,
      "idCancha": 1,
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez"
      },
      "cancha": {
        "id": 1,
        "numero": 1,
        "nombre": "Cancha Principal"
      },
      "boletas": [
        {
          "id": 18,
          "cantidad": 3,
          "montoTotal": 6000,
          "idReserva": 23,
          "idEquipamiento": 1,
          "equipamiento": {
            "id": 1,
            "nombre": "Raqueta Pro"
          }
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /reservas/:id`: Cancel reservation

  **Response:**
  ```json
  {
    "message": "Reserva cancelada exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/disponibilidad/:numero/:fecha/:horaInicio/:horaTermino`: Check court availability

  **Response:**
  ```json
  {
    "message": "La cancha #1 está disponible en el horario solicitado",
    "data": {
      "disponible": true
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/disponibilidad-dia/:numero/:fecha`: Get available time slots for a court on a specific date

  **Response:**
  ```json
  {
    "message": "Horarios disponibles para la cancha #1 en la fecha 2025-06-10",
    "data": {
      "horariosDisponibles": [
        {
          "inicio": "08:00:00",
          "fin": "09:00:00"
        },
        {
          "inicio": "09:00:00",
          "fin": "10:00:00"
        },
        {
          "inicio": "12:00:00",
          "fin": "13:00:00"
        },
        {
          "inicio": "13:00:00",
          "fin": "14:00:00"
        },
        {
          "inicio": "14:00:00",
          "fin": "15:00:00"
        },
        {
          "inicio": "15:00:00",
          "fin": "16:00:00"
        },
        {
          "inicio": "16:00:00",
          "fin": "17:00:00"
        },
        {
          "inicio": "17:00:00",
          "fin": "18:00:00"
        },
        {
          "inicio": "18:00:00",
          "fin": "19:00:00"
        },
        {
          "inicio": "19:00:00",
          "fin": "20:00:00"
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /reservas/estadisticas`: Get reservation statistics (admin only)

  **Response:**
  ```json
  {
    "message": "Estadísticas obtenidas exitosamente",
    "data": {
      "totalReservas": 45,
      "reservasPorCancha": [
        {
          "numeroCancha": 1,
          "totalReservas": "23"
        },
        {
          "numeroCancha": 2,
          "totalReservas": "15"
        },
        {
          "numeroCancha": 3,
          "totalReservas": "7"
        }
      ],
      "usuariosConMasReservas": [
        {
          "rutUsuario": "12345678-9",
          "nombreUsuario": "Juan Pérez",
          "totalReservas": "12"
        },
        {
          "rutUsuario": "98765432-1",
          "nombreUsuario": "María López",
          "totalReservas": "8"
        }
      ],
      "reservasPorDia": [
        {
          "diaSemana": "Lunes",
          "totalReservas": "12"
        },
        {
          "diaSemana": "Martes",
          "totalReservas": "10"
        },
        {
          "diaSemana": "Miércoles",
          "totalReservas": "8"
        },
        {
          "diaSemana": "Jueves",
          "totalReservas": "9"
        },
        {
          "diaSemana": "Viernes",
          "totalReservas": "6"
        }
      ],
      "horasMasSolicitadas": [
        {
          "hora": "18:00:00",
          "totalReservas": "15"
        },
        {
          "hora": "19:00:00",
          "totalReservas": "12"
        },
        {
          "hora": "10:00:00",
          "totalReservas": "8"
        }
      ]
    },
    "statusCode": "OK",
    "error": null
  }
  ```

### Players (Jugadores)

- `POST /jugadores`: Add player to reservation

  **Request Body:**
  ```json
  {
    "nombre": "Carlos",
    "apellido": "Rodríguez",
    "rut": "11111111-1",
    "edad": 28,
    "idReserva": 23
  }
  ```

  **Response:**
  ```json
  {
    "message": "Jugador creado exitosamente",
    "data": {
      "id": 47,
      "nombre": "Carlos",
      "apellido": "Rodríguez",
      "rut": "11111111-1",
      "edad": 28,
      "idReserva": 23
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `GET /jugadores`: Get all players (admin only)

  **Response:**
  ```json
  {
    "message": "Jugadores obtenidos exitosamente",
    "data": [
      {
        "id": 45,
        "nombre": "Carlos",
        "apellido": "Rodríguez",
        "rut": "11111111-1",
        "edad": 28,
        "idReserva": 23,
        "reserva": {
          "id": 23,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "11:30:00"
        }
      },
      {
        "id": 46,
        "nombre": "Ana",
        "apellido": "García",
        "rut": "22222222-2",
        "edad": 32,
        "idReserva": 23,
        "reserva": {
          "id": 23,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "11:30:00"
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /jugadores/:id`: Get player by ID

  **Response:**
  ```json
  {
    "message": "Jugador obtenido exitosamente",
    "data": {
      "id": 45,
      "nombre": "Carlos",
      "apellido": "Rodríguez",
      "rut": "11111111-1",
      "edad": 28,
      "idReserva": 23,
      "reserva": {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00"
      }
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /jugadores/reserva/:idReserva`: Get players by reservation ID

  **Response:**
  ```json
  {
    "message": "Jugadores de la reserva #23 obtenidos exitosamente",
    "data": [
      {
        "id": 45,
        "nombre": "Carlos",
        "apellido": "Rodríguez",
        "rut": "11111111-1",
        "edad": 28,
        "idReserva": 23
      },
      {
        "id": 46,
        "nombre": "Ana",
        "apellido": "García",
        "rut": "22222222-2",
        "edad": 32,
        "idReserva": 23
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `PATCH /jugadores/:id`: Update player information

  **Request Body:**
  ```json
  {
    "nombre": "Carlos Alberto",
    "edad": 29
  }
  ```

  **Response:**
  ```json
  {
    "message": "Jugador actualizado exitosamente",
    "data": {
      "id": 45,
      "nombre": "Carlos Alberto",
      "apellido": "Rodríguez",
      "rut": "11111111-1",
      "edad": 29,
      "idReserva": 23
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /jugadores/:id`: Remove player

  **Response:**
  ```json
  {
    "message": "Jugador eliminado exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

### Equipment (Equipamiento)

- `GET /equipamiento`: Get all equipment

  **Response:**
  ```json
  {
    "message": "Equipamiento obtenido exitosamente",
    "data": [
      {
        "id": 1,
        "nombre": "Raqueta Pro",
        "descripcion": "Raqueta profesional de pádel",
        "costo": 2000,
        "stock": 10
      },
      {
        "id": 2,
        "nombre": "Cinta grip",
        "descripcion": "Cinta para el mango de la raqueta",
        "costo": 800,
        "stock": 30
      },
      {
        "id": 3,
        "nombre": "Pelotas (pack)",
        "descripcion": "Pack de 3 pelotas de pádel",
        "costo": 500,
        "stock": 20
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /equipamiento/:id`: Get equipment by ID

  **Response:**
  ```json
  {
    "message": "Equipamiento obtenido exitosamente",
    "data": {
      "id": 1,
      "nombre": "Raqueta Pro",
      "descripcion": "Raqueta profesional de pádel",
      "costo": 2000,
      "stock": 10
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /equipamiento`: Add new equipment (admin only)

  **Request Body:**
  ```json
  {
    "nombre": "Protector facial",
    "descripcion": "Protector facial para jugadores",
    "costo": 1500,
    "stock": 15
  }
  ```

  **Response:**
  ```json
  {
    "message": "Equipamiento creado exitosamente",
    "data": {
      "id": 4,
      "nombre": "Protector facial",
      "descripcion": "Protector facial para jugadores",
      "costo": 1500,
      "stock": 15
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `PATCH /equipamiento/:id`: Update equipment (admin only)

  **Request Body:**
  ```json
  {
    "costo": 1800,
    "stock": 20
  }
  ```

  **Response:**
  ```json
  {
    "message": "Equipamiento actualizado exitosamente",
    "data": {
      "id": 1,
      "nombre": "Raqueta Pro",
      "descripcion": "Raqueta profesional de pádel",
      "costo": 1800,
      "stock": 20
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /equipamiento/:id`: Delete equipment (admin only)

  **Response:**
  ```json
  {
    "message": "Equipamiento eliminado exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

### Equipment Rental Invoices (Boleta Equipamiento)

- `GET /boletas-equipamiento`: Get all equipment invoices (admin only)

  **Response:**
  ```json
  {
    "message": "Boletas de equipamiento obtenidas exitosamente",
    "data": [
      {
        "id": 15,
        "cantidad": 2,
        "montoTotal": 4000,
        "idReserva": 23,
        "idEquipamiento": 1,
        "equipamiento": {
          "id": 1,
          "nombre": "Raqueta Pro",
          "costo": 2000
        },
        "reserva": {
          "id": 23,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "11:30:00"
        }
      },
      {
        "id": 16,
        "cantidad": 4,
        "montoTotal": 2000,
        "idReserva": 23,
        "idEquipamiento": 3,
        "equipamiento": {
          "id": 3,
          "nombre": "Pelotas (pack)",
          "costo": 500
        },
        "reserva": {
          "id": 23,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "11:30:00"
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /boletas-equipamiento/:id`: Get equipment invoice by ID

  **Response:**
  ```json
  {
    "message": "Boleta de equipamiento obtenida exitosamente",
    "data": {
      "id": 15,
      "cantidad": 2,
      "montoTotal": 4000,
      "idReserva": 23,
      "idEquipamiento": 1,
      "equipamiento": {
        "id": 1,
        "nombre": "Raqueta Pro",
        "descripcion": "Raqueta profesional de pádel",
        "costo": 2000
      },
      "reserva": {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00"
      }
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /boletas-equipamiento/reserva/:idReserva`: Get equipment invoices by reservation ID

  **Response:**
  ```json
  {
    "message": "Boletas de equipamiento para la reserva #23 obtenidas exitosamente",
    "data": [
      {
        "id": 15,
        "cantidad": 2,
        "montoTotal": 4000,
        "idReserva": 23,
        "idEquipamiento": 1,
        "equipamiento": {
          "id": 1,
          "nombre": "Raqueta Pro",
          "costo": 2000
        }
      },
      {
        "id": 16,
        "cantidad": 4,
        "montoTotal": 2000,
        "idReserva": 23,
        "idEquipamiento": 3,
        "equipamiento": {
          "id": 3,
          "nombre": "Pelotas (pack)",
          "costo": 500
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /boletas-equipamiento`: Create equipment invoice

  **Request Body:**
  ```json
  {
    "idReserva": 23,
    "idEquipamiento": 2,
    "cantidad": 3
  }
  ```

  **Response:**
  ```json
  {
    "message": "Boleta de equipamiento creada exitosamente",
    "data": {
      "id": 17,
      "cantidad": 3,
      "montoTotal": 2400,
      "idReserva": 23,
      "idEquipamiento": 2,
      "equipamiento": {
        "id": 2,
        "nombre": "Cinta grip",
        "costo": 800
      }
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `PATCH /boletas-equipamiento/:id`: Update equipment invoice (admin only)

  **Request Body:**
  ```json
  {
    "cantidad": 5
  }
  ```

  **Response:**
  ```json
  {
    "message": "Boleta de equipamiento actualizada exitosamente",
    "data": {
      "id": 15,
      "cantidad": 5,
      "montoTotal": 10000,
      "idReserva": 23,
      "idEquipamiento": 1
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /boletas-equipamiento/:id`: Delete equipment invoice (admin only)

  **Response:**
  ```json
  {
    "message": "Boleta de equipamiento eliminada exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

### Time Blocks (Bloques)

- `GET /bloques`: Get all time blocks

  **Response:**
  ```json
  {
    "message": "Bloques obtenidos exitosamente",
    "data": [
      {
        "id": 1,
        "hora_inicio": "08:00:00",
        "hora_fin": "09:00:00",
        "activo": true
      },
      {
        "id": 2,
        "hora_inicio": "09:00:00",
        "hora_fin": "10:00:00",
        "activo": true
      },
      {
        "id": 3,
        "hora_inicio": "10:00:00",
        "hora_fin": "11:00:00",
        "activo": true
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /bloques/activos`: Get active time blocks

  **Response:**
  ```json
  {
    "message": "Bloques activos obtenidos exitosamente",
    "data": [
      {
        "id": 1,
        "hora_inicio": "08:00:00",
        "hora_fin": "09:00:00",
        "activo": true
      },
      {
        "id": 2,
        "hora_inicio": "09:00:00",
        "hora_fin": "10:00:00",
        "activo": true
      },
      {
        "id": 3,
        "hora_inicio": "10:00:00",
        "hora_fin": "11:00:00",
        "activo": true
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /bloques/:id`: Get time block by ID

  **Response:**
  ```json
  {
    "message": "Bloque obtenido exitosamente",
    "data": {
      "id": 1,
      "hora_inicio": "08:00:00",
      "hora_fin": "09:00:00",
      "activo": true
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `POST /bloques`: Create a new time block (admin only)

  **Request Body:**
  ```json
  {
    "hora_inicio": "20:00:00",
    "hora_fin": "21:00:00",
    "activo": true
  }
  ```

  **Response:**
  ```json
  {
    "message": "Bloque creado exitosamente",
    "data": {
      "id": 13,
      "hora_inicio": "20:00:00",
      "hora_fin": "21:00:00",
      "activo": true
    },
    "statusCode": "CREATED",
    "error": null
  }
  ```

- `PATCH /bloques/:id`: Update time block (admin only)

  **Request Body:**
  ```json
  {
    "activo": false
  }
  ```

  **Response:**
  ```json
  {
    "message": "Bloque actualizado exitosamente",
    "data": {
      "id": 13,
      "hora_inicio": "20:00:00",
      "hora_fin": "21:00:00",
      "activo": false
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `DELETE /bloques/:id`: Delete time block (admin only)

  **Response:**
  ```json
  {
    "message": "Bloque eliminado exitosamente",
    "data": null,
    "statusCode": "OK",
    "error": null
  }
  ```

### Reservation History (Historial Reserva)

- `GET /historial-reserva`: Get all reservation history (admin only)

  **Response:**
  ```json
  {
    "message": "Historial de reservas obtenido exitosamente",
    "data": [
      {
        "id": 12,
        "estado": "Pendiente",
        "fechaEstado": "2025-06-02T10:34:22.120Z",
        "idReserva": 23,
        "idUsuario": 1,
        "reserva": {
          "id": 23,
          "fecha": "2025-06-10",
          "hora_inicio": "10:00:00",
          "hora_termino": "11:30:00"
        },
        "usuario": {
          "id": 1,
          "rut": "12345678-9",
          "nombre": "Juan Pérez"
        }
      },
      {
        "id": 13,
        "estado": "Cancelada",
        "fechaEstado": "2025-06-03T14:22:10.890Z",
        "idReserva": 24,
        "idUsuario": 2,
        "reserva": {
          "id": 24,
          "fecha": "2025-06-15",
          "hora_inicio": "15:00:00",
          "hora_termino": "16:30:00"
        },
        "usuario": {
          "id": 2,
          "rut": "98765432-1",
          "nombre": "María López"
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /historial-reserva/:id`: Get history entry by ID

  **Response:**
  ```json
  {
    "message": "Historial de reserva obtenido exitosamente",
    "data": {
      "id": 12,
      "estado": "Pendiente",
      "fechaEstado": "2025-06-02T10:34:22.120Z",
      "idReserva": 23,
      "idUsuario": 1,
      "reserva": {
        "id": 23,
        "fecha": "2025-06-10",
        "hora_inicio": "10:00:00",
        "hora_termino": "11:30:00",
        "idCancha": 1,
        "cancha": {
          "id": 1,
          "numero": 1,
          "nombre": "Cancha Principal"
        }
      },
      "usuario": {
        "id": 1,
        "rut": "12345678-9",
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      }
    },
    "statusCode": "OK",
    "error": null
  }
  ```

- `GET /historial-reserva/reserva/:idReserva`: Get history for a specific reservation

  **Response:**
  ```json
  {
    "message": "Historial para la reserva #23 obtenido exitosamente",
    "data": [
      {
        "id": 12,
        "estado": "Pendiente",
        "fechaEstado": "2025-06-02T10:34:22.120Z",
        "idUsuario": 1,
        "usuario": {
          "id": 1,
          "rut": "12345678-9",
          "nombre": "Juan Pérez"
        }
      },
      {
        "id": 14,
        "estado": "Confirmada",
        "fechaEstado": "2025-06-05T09:12:34.560Z",
        "idUsuario": 2,
        "usuario": {
          "id": 2,
          "rut": "98765432-1",
          "nombre": "María López",
          "isAdmin": true
        }
      }
    ],
    "statusCode": "OK",
    "error": null
  }
  ```

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## API Endpoints

### Reserva de Canchas

El sistema ofrece los siguientes endpoints para la gestión de reservas de canchas:

#### Endpoints Básicos
- **POST /reservas** - Crear una nueva reserva de cancha
- **GET /reservas** - Obtener todas las reservas
- **GET /reservas/:id** - Obtener una reserva específica por ID
- **PATCH /reservas/:id** - Actualizar una reserva existente
- **DELETE /reservas/:id** - Cancelar/Eliminar una reserva

#### Endpoints de Filtrado
- **GET /reservas/usuario/:rut** - Obtener todas las reservas de un usuario por su RUT
- **GET /reservas/cancha/:numero** - Obtener todas las reservas de una cancha específica

#### Endpoints de Disponibilidad
- **GET /reservas/disponibilidad/:numero/:fecha/:horaInicio/:horaTermino** - Verificar disponibilidad de una cancha en un horario específico
- **GET /reservas/disponibilidad-dia/:numero/:fecha** - Obtener todos los horarios disponibles de una cancha en un día específico

#### Estadísticas
- **GET /reservas/estadisticas** - Obtener estadísticas de uso de las canchas

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
