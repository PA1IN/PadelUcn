# PadelUcn API Endpoint Reference

This document provides a comprehensive list of all API endpoints in the PadelUcn system, their expected functionality, and testing status.

## Authentication Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| POST | /api/auth/register | Register a new user | No | No | Tested |
| POST | /api/auth/login | Login to get JWT token | No | No | Tested |
| GET | /api/auth/profile | Get user profile | Yes | No | Tested |

## User Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| GET | /api/users | Get all users | Yes | No | Tested |
| GET | /api/users/:rut | Get user by RUT | Yes | No | Tested |
| PATCH | /api/users/:rut | Update user information | Yes | No | Tested |
| PATCH | /api/users/:rut/ingresar-saldo | Add balance to user | Yes | No | Tested |
| DELETE | /api/users/:rut | Delete user | Yes | Yes | Tested |

## Canchas (Courts) Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| POST | /api/canchas | Create a new court | Yes | Yes | Tested |
| GET | /api/canchas | Get all courts | Yes | No | Tested |
| GET | /api/canchas/:id | Get court by ID | Yes | No | Tested |
| PATCH | /api/canchas/:id | Update court | Yes | Yes | Tested |
| DELETE | /api/canchas/:id | Delete court | Yes | Yes | Tested |

## Equipamiento (Equipment) Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| POST | /api/equipamiento | Create new equipment | Yes | Yes | Tested |
| GET | /api/equipamiento | Get all equipment | Yes | No | Tested |
| GET | /api/equipamiento/:id | Get equipment by ID | Yes | No | Tested |
| PATCH | /api/equipamiento/:id | Update equipment | Yes | Yes | Tested |
| DELETE | /api/equipamiento/:id | Delete equipment | Yes | Yes | Tested |

## Reserva (Reservation) Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| POST | /api/reservas | Create a new reservation | Yes | No | Tested |
| GET | /api/reservas | Get all reservations | Yes | No | Tested |
| GET | /api/reservas/usuario/:rut | Get user's reservations | Yes | No | Tested |
| GET | /api/reservas/cancha/:id | Get court's reservations | Yes | No | Tested |
| GET | /api/reservas/:id | Get reservation by ID | Yes | No | Tested |
| PATCH | /api/reservas/:id | Update reservation | Yes | No | Tested |
| DELETE | /api/reservas/:id | Cancel reservation | Yes | No | Tested |
| GET | /api/reservas/disponibilidad/:id/:fecha/:horaInicio/:horaTermino | Check court availability | Yes | No | Tested |
| GET | /api/reservas/disponibilidad-dia/:id/:fecha | Get available hours for a day | Yes | No | Tested |
| GET | /api/reservas/estadisticas | Get reservation statistics | Yes | Yes | Not Tested |

## Boleta Equipamiento (Equipment Receipt) Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| POST | /api/boleta-equipamiento | Create equipment receipt | Yes | No | Tested |
| GET | /api/boleta-equipamiento | Get all equipment receipts | Yes | No | Tested |
| GET | /api/boleta-equipamiento/:id | Get equipment receipt by ID | Yes | No | Tested |
| PATCH | /api/boleta-equipamiento/:id | Update equipment receipt | Yes | Yes | Tested |
| DELETE | /api/boleta-equipamiento/:id | Delete equipment receipt | Yes | Yes | Tested |

## Historial Reserva (Reservation History) Module

| Method | Endpoint | Description | Required Auth | Admin Only | Status |
|--------|----------|-------------|--------------|------------|--------|
| GET | /api/historial-reservas | Get all reservation history | Yes | Yes | Tested |
| GET | /api/historial-reservas/reserva/:id | Get history by reservation ID | Yes | No | Tested |
| GET | /api/historial-reservas/usuario/:id | Get history by user ID | Yes | No | Tested |
| GET | /api/historial-reservas/:id | Get history entry by ID | Yes | No | Tested |

## Notes for Testing

1. **Authentication**: Most endpoints require a valid JWT token in the Authorization header.
2. **Admin-only endpoints**: Requires a user with `isAdmin: true`.
3. **Error handling**: All endpoints return consistent error messages with appropriate HTTP status codes.
4. **Validation**: Input validation is performed on all endpoints.
5. **Success responses**: All successful responses follow the format `{ success: true, data: {...}, message: "..." }`.

## Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Not enough permissions (admin required) |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server-side error |

## Testing Progress

To track which endpoints have been tested and function correctly, use the provided `test-endpoints.ps1` script, which tests all endpoints one by one and provides detailed feedback.

To run the script:

```powershell
.\test-endpoints.ps1
```

After running the test script, update the "Status" column in this document accordingly.
