// test-api-with-file.js - Script que guarda los resultados en un archivo
const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'api-test-results.log';

// Limpiar el archivo de log
fs.writeFileSync(LOG_FILE, '');

// Función para registrar log
function log(message) {
  const logMessage = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  // No usamos console.log para evitar problemas con la salida
}

// Probar login
async function testLogin() {
  log('=== Probando login ===');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: '12345678-9',
      password: 'admin123'
    });
    
    log(`Status: ${response.status}`);
    log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    return true;
  } catch (error) {
    log(`Error en login: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Ejecutar la prueba y terminar
async function runTest() {
  log('🚀 INICIANDO PRUEBA SIMPLE DE API');
  await testLogin();
  log('✅ PRUEBA COMPLETADA');
}

runTest().then(() => {
  log(`\nResultados guardados en: ${LOG_FILE}`);
});
