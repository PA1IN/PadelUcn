# Guía para solucionar problemas de Autenticación en PadelUcn

Esta guía te ayudará a resolver los problemas comunes con el registro y login en la aplicación PadelUcn.

## Configuración del Entorno

Antes de comenzar, asegúrate de que:

1. El contenedor Docker del backend esté funcionando correctamente
   ```powershell
   docker ps
   # Deberías ver 'padelucn-backend' con estatus 'Up'
   ```

2. La base de datos PostgreSQL esté funcionando correctamente
   ```powershell
   docker ps
   # Deberías ver 'padelucn-postgres' con estatus 'Up'
   ```

## Problemas Comunes y Soluciones

### 1. Problema: Error al registrar un nuevo usuario

**Posibles causas:**
- El formato del RUT es incorrecto
- El usuario ya existe en la base de datos
- La contraseña no cumple con los requisitos mínimos
- El correo electrónico tiene formato incorrecto

**Soluciones:**

- **Formato de RUT correcto**: El RUT debe seguir el formato "12345678-9" (números, guion y dígito verificador)
- **Contraseña válida**: Mínimo 6 caracteres
- **Formato de correo válido**: Debe ser de dominios permitidos (gmail.com, hotmail.com, ucn.cl, etc.)

### 2. Problema: Error al iniciar sesión

**Posibles causas:**
- RUT o contraseña incorrectos
- El usuario no existe en la base de datos
- La base de datos no está accesible

**Soluciones:**
- Verifica que el RUT tenga el formato correcto con guion
- Asegúrate de usar la contraseña correcta
- Verifica la conexión a la base de datos

## Instrucciones para Postman

1. **Importa la colección de pruebas**
   - Abre Postman
   - Haz clic en "Import" y selecciona el archivo `PadelUcn_Auth_Postman.json`

2. **Registro de usuario (para nuevos usuarios)**:
   - Selecciona la petición "Registro de Usuario"
   - El cuerpo (Body) debe tener el siguiente formato JSON:
   ```json
   {
     "rut": "11222333-4",
     "password": "contraseña123",
     "nombre": "Usuario Prueba",
     "correo": "prueba@gmail.com",
     "telefono": "912345678"
   }
   ```
   - Haz clic en "Send"
   - Si el registro es exitoso, deberías recibir un código 201 y un token

3. **Inicio de sesión (para usuarios existentes)**:
   - Selecciona la petición "Login de Usuario"
   - El cuerpo (Body) debe tener el siguiente formato JSON:
   ```json
   {
     "rut": "11222333-4",
     "password": "contraseña123"
   }
   ```
   - Haz clic en "Send"
   - Si el login es exitoso, deberías recibir un código 200 y un token

4. **Verificación de perfil**:
   - Esta petición usa el token obtenido en los pasos anteriores
   - La colección guarda automáticamente el token en la variable de entorno
   - Selecciona la petición "Perfil de Usuario"
   - Haz clic en "Send"
   - Deberías recibir información del usuario que inició sesión

## Verificación de la Base de Datos

Si los problemas persisten, puedes verificar directamente la base de datos:

```powershell
docker exec -it padelucn-postgres psql -U ingeso -d padelucn -c "SELECT rut, nombre_usuario, correo FROM usuario;"
```

## Reinicio de la Aplicación

Si es necesario, puedes reiniciar los contenedores:

```powershell
docker-compose restart padelucn-backend
docker-compose restart padelucn-postgres
```

## Verificación de Logs

Para ver los logs del backend:

```powershell
docker logs padelucn-backend
```

Para los logs de la base de datos:

```powershell
docker logs padelucn-postgres
```
