// createUsuarioAdminDto.js
// Un script simple para crear un usuario administrador
// Ejecutar con: node createUsuarioAdminDto.js

const axios = require('axios');

// Token JWT del usuario administrador actual
const adminToken = process.env.ADMIN_TOKEN || 'INSERT_ADMIN_TOKEN_HERE';

// RUT del usuario que queremos convertir en administrador
const userRut = process.env.USER_RUT || '22222222-2';

async function makeUserAdmin() {
  try {
    console.log(`Intentando convertir al usuario ${userRut} en administrador...`);
    
    const response = await axios({
      method: 'patch',
      url: `http://localhost:8080/api/usuarios/admin/${userRut}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      data: {
        isAdmin: true
      }
    });
    
    console.log('Respuesta del servidor:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log(`¡Usuario ${userRut} actualizado exitosamente a administrador!`);
    
  } catch (error) {
    console.error('Error al actualizar usuario:');
    console.error(`Estado: ${error.response?.status}`);
    console.error(`Mensaje: ${JSON.stringify(error.response?.data || error.message)}`);
    
    // Sugerencias para solucionar problemas comunes
    console.log('\nSugerencias para solucionar:');
    console.log('1. Asegúrate que el servidor backend está en ejecución');
    console.log('2. Verifica que el token de administrador es válido y no ha expirado');
    console.log('3. Comprueba que la ruta del API es correcta');
    console.log('4. Verifica que el RUT del usuario existe en la base de datos');
  }
}

makeUserAdmin();
