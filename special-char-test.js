/**
 * Script para probar específicamente el tratamiento de la columna con el carácter ñ
 */
const axios = require('axios');
const fs = require('fs');

// Configuración
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'special-char-test-results.log';

// Inicializar archivo de log
fs.writeFileSync(LOG_FILE, `PRUEBA DE COLUMNAS CON CARACTERES ESPECIALES
=============================================
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

// Función para realizar peticiones directas para inspeccionar errores
async function testEndpoint(type) {
  log(`\n=== Probando endpoint: ${type} ===`);
  
  try {
    let response;
    
    switch(type) {
      case 'login':
        response = await axios.post(`${API_URL}/auth/login`, {
          rut: '12345678-9',
          password: 'admin123'
        });
        break;
      
      case 'register':
        const randomRut = `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9)}`;
        response = await axios.post(`${API_URL}/auth/register`, {
          rut: randomRut,
          password: 'test123',
          nombre: 'Usuario Test',
          correo: `test${Math.floor(Math.random() * 10000)}@gmail.com`,
          telefono: '+56912345678'
        });
        break;
        
      case 'users':
        response = await axios.get(`${API_URL}/users`);
        break;
        
      case 'diagnostico':
        response = await axios.get(`${API_URL}/auth/diagnostico-columna`);
        break;
    }
    
    log(`Status: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true, data: response.data };
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      log('No se recibió respuesta del servidor');
    } else {
      log(`Error en la configuración de la solicitud: ${error.message}`);
    }
    
    return { success: false, error };
  }
}

// Ejecutar pruebas
async function runTests() {
  log('🚀 INICIANDO DIAGNÓSTICO DE COLUMNAS CON CARACTERES ESPECIALES');
  
  // Prueba 1: Login
  log('\n===== Prueba 1: Intentar login =====');
  await testEndpoint('login');
  
  // Prueba 2: Registro
  log('\n===== Prueba 2: Intentar registro =====');
  await testEndpoint('register');
  
  // Prueba 3: Obtener usuarios (para ver si hay algún error en la consulta)
  log('\n===== Prueba 3: Obtener lista de usuarios =====');
  await testEndpoint('users');
  
  // Prueba 4: Punto de diagnóstico especializado (si existe)
  log('\n===== Prueba 4: Diagnóstico especializado =====');
  await testEndpoint('diagnostico');
  
  log('\n===== Diagnóstico completado =====');
  log(`Resultados detallados guardados en: ${LOG_FILE}`);
}

// Ejecutar pruebas
runTests().catch(error => {
  log(`\n❌ ERROR FATAL: ${error.message}`);
});
