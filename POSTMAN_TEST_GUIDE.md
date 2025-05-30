# PadelUcn API Testing Guide for Postman

This document provides guidance on testing the PadelUcn API endpoints using Postman.

## API Status

Based on testing conducted on May 30, 2025, the following endpoints are currently functional:

| Module | Base Endpoint | Authentication Required | Status |
|--------|---------------|-------------------------|--------|
| Base API | `/api` | No | ✅ Working |
| Courts (Canchas) | `/api/canchas` | No | ✅ Working |
| Equipment (Equipamiento) | `/api/equipamiento` | No | ✅ Working |
| Reservations (Reservas) | `/api/reservas` | Yes | 🔒 Requires Auth |
| Equipment Receipts (Boleta Equipamiento) | `/api/boleta-equipamiento` | Yes | 🔒 Requires Auth |
| Reservation History (Historial Reserva) | `/api/historial-reservas` | Yes | ❌ Not Found (404) |

## Setting Up Postman

### 1. Import the Collection
Use the provided PadelUcn Postman Collection:
- Open Postman
- Click "Import" button
- Select the `PadelUcn_Postman_Collection.json` file

### 2. Configure Environment Variables
Create an environment with the following variables:
- `base_url`: `http://localhost:8080/api`
- `token`: (to be filled after authentication)

### 3. Authentication Process
1. First, use the `/api/auth/login` endpoint to get a token:
   - Method: POST
   - URL: `{{base_url}}/auth/login`
   - Body (raw JSON):
     ```json
     {
       "rut": "YOUR_RUT",
       "password": "YOUR_PASSWORD"
     }
     ```
2. From the response, copy the token value
3. Set it as the `token` environment variable
4. For authenticated requests, add an Authorization header:
   - Key: `Authorization`
   - Value: `Bearer {{token}}`

## Testing Endpoints

### Courts (Canchas) Module

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/canchas` | Get all courts | No |
| GET | `/api/canchas/:id` | Get court by ID | No |
| POST | `/api/canchas` | Create a new court | Yes (Admin) |
| PATCH | `/api/canchas/:id` | Update court | Yes (Admin) |
| DELETE | `/api/canchas/:id` | Delete court | Yes (Admin) |

### Equipment (Equipamiento) Module

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/equipamiento` | Get all equipment | No |
| GET | `/api/equipamiento/:id` | Get equipment by ID | No |
| POST | `/api/equipamiento` | Create new equipment | Yes (Admin) |
| PATCH | `/api/equipamiento/:id` | Update equipment | Yes (Admin) |
| DELETE | `/api/equipamiento/:id` | Delete equipment | Yes (Admin) |

### Reservations (Reservas) Module

**Note: All endpoints in this module require authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservas` | Get all reservations |
| GET | `/api/reservas/:id` | Get reservation by ID |
| GET | `/api/reservas/usuario/:rut` | Get user's reservations |
| GET | `/api/reservas/cancha/:id` | Get court's reservations |
| POST | `/api/reservas` | Create a new reservation |
| PATCH | `/api/reservas/:id` | Update reservation |
| DELETE | `/api/reservas/:id` | Cancel reservation |
| GET | `/api/reservas/disponibilidad/:id/:fecha/:horaInicio/:horaTermino` | Check court availability |
| GET | `/api/reservas/disponibilidad-dia/:id/:fecha` | Get available hours for a day |

### Equipment Receipts (Boleta Equipamiento) Module

**Note: All endpoints in this module require authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boleta-equipamiento` | Get all equipment receipts |
| GET | `/api/boleta-equipamiento/:id` | Get equipment receipt by ID |
| POST | `/api/boleta-equipamiento` | Create equipment receipt |
| PATCH | `/api/boleta-equipamiento/:id` | Update equipment receipt (Admin) |
| DELETE | `/api/boleta-equipamiento/:id` | Delete equipment receipt (Admin) |

### Reservation History (Historial Reserva) Module

**Note: Currently this endpoint returns a 404 Not Found error, suggesting the module might not be implemented yet or has a different endpoint path**

According to the API documentation, these endpoints should exist:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/historial-reservas` | Get all reservation history (Admin) |
| GET | `/api/historial-reservas/:id` | Get history entry by ID |
| GET | `/api/historial-reservas/reserva/:id` | Get history by reservation ID |
| GET | `/api/historial-reservas/usuario/:id` | Get history by user ID |

## Example Payloads

### 1. Create Court (POST `/api/canchas`)
```json
{
  "nombre": "Cancha Test",
  "descripcion": "Cancha de prueba creada con Postman",
  "ubicacion": "Zona Test",
  "precio_hora": 5000
}
```

### 2. Create Equipment (POST `/api/equipamiento`)
```json
{
  "nombre": "Raqueta Test",
  "descripcion": "Raqueta de prueba creada con Postman",
  "precio": 2000,
  "stock": 10
}
```

### 3. Create Reservation (POST `/api/reservas`)
```json
{
  "cancha_id": 1,
  "fecha": "2025-06-01",
  "hora_inicio": "10:00",
  "hora_termino": "11:00",
  "precio_total": 5000
}
```

### 4. Create Equipment Receipt (POST `/api/boleta-equipamiento`)
```json
{
  "equipamiento_id": 1,
  "cantidad": 1,
  "precio_total": 2000
}
```

## Troubleshooting

### Common Errors

1. **401 Unauthorized**: 
   - Check if your token is valid and not expired
   - Ensure the token is correctly formatted in the Authorization header

2. **403 Forbidden**: 
   - The endpoint requires admin privileges
   - Your user account doesn't have sufficient permissions

3. **404 Not Found**: 
   - Check the endpoint URL for typos
   - Verify if the resource exists (e.g., court ID, equipment ID)
   - Some documented endpoints might not be implemented yet

4. **400 Bad Request**: 
   - Check your request body format
   - Ensure all required fields are included
   - Validate data types (e.g., numbers for prices)

### Getting a Fresh Token

If your requests are failing with 401 errors, your token might be expired. Get a fresh token:

1. Send a POST request to `/api/auth/login`
2. Copy the new token from the response
3. Update the `token` environment variable in Postman
