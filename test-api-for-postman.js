/**
 * Script para probar los endpoints básicos y generar información para Postman
 */
const axios = require('axios');

// Configuración
const API_URL = 'http://localhost:8080/api';

async function testEndpoint(method, endpoint, data = null) {
  console.log(`\n=== Probando ${method} ${endpoint} ===`);
  
  try {
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(`${API_URL}${endpoint}`);
        break;
      case 'POST':
        response = await axios.post(`${API_URL}${endpoint}`, data);
        break;
      default:
        throw new Error(`Método no soportado: ${method}`);
    }
    
    console.log(`Status: ${response.status}`);
    console.log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    return response.data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return null;
  }
}

async function main() {
  console.log('🚀 PRUEBA DE ENDPOINTS PARA POSTMAN');
  
  // Probar endpoint base
  await testEndpoint('GET', '');
  
  // Probar registro
  const registrationData = {
    rut: '22222222-2',
    password: 'test123',
    nombre: 'Usuario Test',
    correo: 'test@gmail.com',
    telefono: '+56912345678'
  };
  await testEndpoint('POST', '/auth/register', registrationData);
  
  // Probar login
  const loginData = {
    rut: '22222222-2',
    password: 'test123'
  };
  const loginResponse = await testEndpoint('POST', '/auth/login', loginData);
  
  console.log('\n===== RESUMEN =====');
  console.log('Estos endpoints están disponibles para probar en Postman:');
  console.log('1. GET ' + API_URL + ' - Endpoint base');
  console.log('2. POST ' + API_URL + '/auth/register - Registro de usuarios');
  console.log('3. POST ' + API_URL + '/auth/login - Login de usuarios');
  
  if (loginResponse && loginResponse.data && loginResponse.data.token) {
    console.log('\nToken para usar en Postman:');
    console.log(loginResponse.data.token);
    console.log('\nAgrega este token en el header Authorization de tus peticiones así:');
    console.log('Bearer ' + loginResponse.data.token);
  }
}

main().catch(error => {
  console.error('Error fatal:', error.message);
});
