# Guía para utilizar Postman con PadelUcn API

Esta guía explica paso a paso cómo realizar correctamente las peticiones de registro y login usando Postman.

## Configuración general

Para todas las peticiones, asegúrate de:

1. **Seleccionar el método HTTP correcto** (GET, POST, etc.)
2. **Configurar la URL correcta** (base URL + endpoint)
3. **Configurar los headers adecuados**:
   - `Content-Type: application/json`

## Pasos para el registro de usuario

### 1. Preparar la petición POST para registro

- **URL**: `http://localhost:3000/api/auth/register` (ajusta el puerto si es diferente)
- **Método**: POST
- **Headers**:
  - Key: `Content-Type`, Value: `application/json`

### 2. Configurar el cuerpo de la petición (Body)

Selecciona la opción "raw" y asegúrate de elegir "JSON" en el dropdown.

```json
{
  "rut": "12345678-9",
  "password": "contraseña123",
  "nombre": "Nombre Apellido",
  "correo": "correo@gmail.com",
  "telefono": "912345678"
}
```

**Notas importantes**:
- El RUT debe tener el formato correcto (ej: "12345678-9")
- La contraseña debe tener al menos 6 caracteres
- El correo electrónico debe ser de un dominio válido (gmail, hotmail, outlook, ucn, etc.)

### 3. Enviar la petición

Haz clic en el botón "Send" y verifica la respuesta. Una respuesta exitosa debería tener un código 201 y un formato similar a:

```json
{
  "success": true,
  "data": {
    "rut": "12345678-9",
    "nombre": "Nombre Apellido",
    "correo": "correo@gmail.com",
    "telefono": "912345678",
    "saldo": 0,
    "isAdmin": false,
    "id": 1,
    "access_token": "eyJhbGciOiJIUzI1N..."
  },
  "message": "Usuario registrado exitosamente"
}
```

## Pasos para el login de usuario

### 1. Preparar la petición POST para login

- **URL**: `http://localhost:3000/api/auth/login` (ajusta el puerto si es diferente)
- **Método**: POST
- **Headers**:
  - Key: `Content-Type`, Value: `application/json`

### 2. Configurar el cuerpo de la petición (Body)

Selecciona la opción "raw" y asegúrate de elegir "JSON" en el dropdown.

```json
{
  "rut": "12345678-9",
  "password": "contraseña123"
}
```

### 3. Enviar la petición

Haz clic en el botón "Send" y verifica la respuesta. Una respuesta exitosa debería tener un código 200 y un formato similar a:

```json
{
  "success": true,
  "data": {
    "rut": "12345678-9",
    "nombre": "Nombre Apellido",
    "correo": "correo@gmail.com",
    "rol": "usuario",
    "token": "eyJhbGciOiJIUzI1N..."
  },
  "message": "Inicio de sesión exitoso"
}
```

## Errores comunes y soluciones

### Problema: Error 400 Bad Request
**Solución**: Verifica que todos los campos obligatorios estén presentes y con el formato correcto.

### Problema: Error 401 Unauthorized en login
**Solución**: Verifica que el RUT y la contraseña sean correctos.

### Problema: Error "Ya existe un usuario con el RUT"
**Solución**: Intenta con otro RUT o usa el endpoint de login si ya tienes una cuenta.

### Problema: Error CORS
**Solución**: Si usas Postman, esto no debería ser un problema. Si estás desarrollando un frontend, asegúrate de que el servidor permita peticiones desde tu dominio.

## Usando el token JWT para peticiones autenticadas

1. En la respuesta del login, copia el valor del campo `token`
2. Para las peticiones que requieren autenticación:
   - Añade un header `Authorization` con el valor `Bearer {tu-token}` (reemplaza {tu-token} con el token copiado)

## Recomendaciones adicionales

1. **Guarda tus peticiones** en una colección de Postman para reutilizarlas
2. **Usa variables de entorno** para la URL base y tokens
3. **Revisa los mensajes de error** que proporciona la API para diagnóstico
