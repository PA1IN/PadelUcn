// add-saldo-test.js
/**
 * Este script demuestra cómo utilizar el nuevo endpoint para agregar saldo a un usuario
 * 
 * Endpoint: POST /usuarios/:rut/add-saldo
 * 
 * Parámetros:
 * - :rut: RUT del usuario al que se agregará saldo
 * 
 * Body:
 * {
 *   "monto": 10000  // Monto a agregar (entre $1,000 y $1,000,000)
 * }
 * 
 * Autenticación:
 * - Requiere token JWT
 * - Solo el propio usuario o un administrador pueden agregar saldo
 * 
 * Ejemplo de solicitud en Postman:
 * 1. Método: POST
 * 2. URL: http://localhost:3000/usuarios/11111111-1/add-saldo
 * 3. Headers: 
 *    - Authorization: Bearer <token_jwt>
 *    - Content-Type: application/json
 * 4. Body (raw/JSON):
 *    {
 *      "monto": 10000
 *    }
 */

// Ejemplo utilizando fetch (ejecutar desde un navegador o Node.js con fetch)
async function addSaldoExample() {
  // Primero necesitas autenticarte para obtener un token
  const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rut: '11111111-1',  // Usuario de prueba 
      contrasena: 'password123'  // Contraseña del usuario de prueba
    })
  });

  const loginData = await loginResponse.json();
  const token = loginData.data.access_token;
  // Ahora puedes usar el token para agregar saldo
  const addSaldoResponse = await fetch('http://localhost:3001/api/usuarios/11111111-1/add-saldo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      monto: 10000
    })
  });

  const addSaldoData = await addSaldoResponse.json();
  console.log('Resultado de agregar saldo:', addSaldoData);
}

// Este código se puede ejecutar en un entorno que soporte fetch
// addSaldoExample().catch(console.error);
