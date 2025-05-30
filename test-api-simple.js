/**
 * Script para probar endpoints básicos usando fetch
 */
const fetch = require('node-fetch');

// Configuración
const API_URL = 'http://localhost:8080/api';

// Función para probar un endpoint
async function testEndpoint(method, path, data = null) {
  const url = `${API_URL}${path}`;
  console.log(`\n=== Probando ${method} ${url} ===`);
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const responseData = await response.text();
    
    console.log(`Status: ${response.status}`);
    console.log(`Respuesta: ${responseData}`);
    
    try {
      return JSON.parse(responseData);
    } catch (e) {
      return responseData;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 PRUEBA DE ENDPOINTS BÁSICOS');
  
  // Probar endpoint base
  await testEndpoint('GET', '');
  
  // Probar registro
  await testEndpoint('POST', '/auth/register', {
    rut: '33333333-3',
    password: 'test123',
    nombre: 'Usuario Test',
    correo: 'test@gmail.com',
    telefono: '+56912345678'
  });
  
  // Probar login
  await testEndpoint('POST', '/auth/login', {
    rut: '33333333-3',
    password: 'test123'
  });
}

main().catch(error => {
  console.error('Error fatal:', error);
});
