# Funcionalidad para Agregar Saldo al Usuario

Se ha implementado una nueva funcionalidad que permite a los usuarios agregar saldo a sus propias cuentas, lo cual era un requisito importante para el sistema de reservas.

## Detalles de la Implementación

### 1. Endpoint
- **URL**: `/usuarios/:rut/add-saldo`
- **Método**: `POST`
- **Autenticación**: Requiere token JWT
- **Permisos**: El propio usuario o un administrador

### 2. Cuerpo de la Solicitud
```json
{
  "monto": 10000
}
```

El monto debe ser:
- Un valor numérico positivo
- Mínimo: $1.000 (mil pesos)
- Máximo: $1.000.000 (un millón de pesos)

### 3. Respuesta Exitosa
```json
{
  "statusCode": 200,
  "message": "Saldo agregado exitosamente: $10000",
  "data": {
    "id": 1,
    "rut": "11111111-1",
    "nombre": "Administrador",
    "correo": "admin@padelucn.cl",
    "telefono": "+56912345678",
    "saldo": 20000,
    "isAdmin": true
  },
  "success": true
}
```

### 4. Ejemplos de Uso con Postman

1. **Iniciar sesión** para obtener un token JWT:
   - Método: `POST`
   - URL: `http://localhost:3001/api/auth/login`
   - Body:
     ```json
     {
       "rut": "11111111-1",
       "contrasena": "password123"
     }
     ```

2. **Agregar saldo** utilizando el token obtenido:
   - Método: `POST`
   - URL: `http://localhost:3001/api/usuarios/11111111-1/add-saldo`
   - Headers:
     - `Authorization: Bearer <token_jwt>`
   - Body:
     ```json
     {
       "monto": 10000
     }
     ```

## Consideraciones
- El saldo se actualiza inmediatamente en la base de datos
- El usuario puede ver su saldo actualizado en su perfil
- Los administradores pueden agregar saldo a cualquier usuario
- Los usuarios regulares solo pueden agregar saldo a sus propias cuentas
