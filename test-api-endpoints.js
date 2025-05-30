/**
 * Script para probar la disponibilidad de endpoints de la API
 */
const axios = require('axios');
const fs = require('fs');

// Configuración
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'endpoint-availability-results.log';

// Inicializar archivo de log
fs.writeFileSync(LOG_FILE, `PRUEBA DE DISPONIBILIDAD DE ENDPOINTS
==================================================
Fecha: ${new Date().toISOString()}
API URL: ${API_URL}

`);

// Función para registrar en log
function log(message) {
  const logEntry = typeof message === 'string' 
    ? message 
    : JSON.stringify(message, null, 2);
  
  console.log(logEntry);
  fs.appendFileSync(LOG_FILE, logEntry + '\n');
}

// Función para probar un endpoint
async function testEndpoint(method, endpoint, data = null, token = null) {
  log(`\n=== Probando ${method} ${endpoint} ===`);
  
  try {
    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(`${API_URL}${endpoint}`, config);
        break;
      case 'POST':
        response = await axios.post(`${API_URL}${endpoint}`, data, config);
        break;
      case 'PATCH':
        response = await axios.patch(`${API_URL}${endpoint}`, data, config);
        break;
      case 'DELETE':
        response = await axios.delete(`${API_URL}${endpoint}`, config);
        break;
      default:
        throw new Error(`Método no soportado: ${method}`);
    }
    
    log(`Status: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
      return { success: false, status: error.response.status, data: error.response.data };
    }
    return { success: false, message: error.message };
  }
}

// Lista de endpoints a probar sin autenticación
const publicEndpoints = [
  { method: 'POST', endpoint: '/auth/register', data: { rut: '22222222-2', password: 'test123', nombre: 'Usuario Test 2', correo: 'test2@gmail.com', telefono: '+56912345678' } },
  { method: 'POST', endpoint: '/auth/login', data: { rut: '22222222-2', password: 'test123' } }
];

// Ejecutar pruebas
async function runTests() {
  log('🚀 INICIANDO PRUEBAS DE DISPONIBILIDAD DE ENDPOINTS');
  
  const results = [];
  let authToken = null;
  
  // Probar endpoints públicos
  for (const endpoint of publicEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.endpoint, endpoint.data);
    results.push({
      endpoint: `${endpoint.method} ${endpoint.endpoint}`,
      success: result.success,
      status: result.status,
      message: result.message || ''
    });
    
    // Si es login y exitoso, guardar token
    if (endpoint.endpoint === '/auth/login' && result.success && result.data && result.data.data && result.data.data.token) {
      authToken = result.data.data.token;
      log('✅ Token de autenticación obtenido');
    }
  }
  
  // Mostrar resumen
  log('\n===== RESUMEN DE RESULTADOS =====');
  results.forEach(result => {
    log(`${result.success ? '✅' : '❌'} ${result.endpoint} - Status: ${result.status || 'N/A'}`);
  });
  
  log(`\nResultados detallados guardados en: ${LOG_FILE}`);
}

// Ejecutar todas las pruebas
runTests().catch(error => {
  log(`\n❌ ERROR FATAL: ${error.message}`);
});
