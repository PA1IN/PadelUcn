/**
 * Script para probar específicamente el problema de mapeo de columna de contraseña
 */
const axios = require('axios');
const fs = require('fs');

// Configuración
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'column-test-results.log';

// Inicializar archivo de log
fs.writeFileSync(LOG_FILE, `PRUEBA DE CORRECCIÓN DE MAPEO DE COLUMNA DE CONTRASEÑA
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

// Función para probar el login con distintos usuarios
async function testLogin(credentials) {
  log(`\n=== Probando login con usuario: ${credentials.rut} ===`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    log(`Status: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    // Verificar si la respuesta indica éxito o fracaso
    if (response.data && response.data.success === false) {
      log(`❌ Login fallido: ${response.data.message}`);
      return { success: false, message: response.data.message };
    }
    
    // Extraer token si existe
    let token = null;
    if (response.data && response.data.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data && response.data.token) {
      token = response.data.token;
    }
    
    if (token) {
      log(`✅ Login exitoso - Token obtenido`);
      return { success: true, token };
    } else {
      log(`❌ No se pudo extraer token de la respuesta`);
      return { success: false, message: 'No se pudo extraer token' };
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false, message: error.message };
  }
}

// Función para registrar un nuevo usuario
async function registerUser(userData) {
  log(`\n=== Registrando nuevo usuario: ${userData.rut} ===`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    log(`Status: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data && response.data.success !== false) {
      log(`✅ Registro exitoso`);
      return { success: true };
    } else {
      log(`❌ Registro fallido: ${response.data.message || 'Error desconocido'}`);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false, message: error.message };
  }
}

// Conjunto de usuarios para probar
const testUsers = [
  {
    description: 'Administrador predefinido',
    credentials: { rut: '12345678-9', password: 'admin123' }
  },
  {
    description: 'Usuario regular predefinido',
    credentials: { rut: '98765432-1', password: 'usuario123' }
  },
  {
    description: 'Nuevo usuario generado',
    userData: {
      rut: `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9)}`,
      password: 'test123',
      nombre: 'Usuario Test',
      correo: `test${Math.floor(Math.random() * 10000)}@example.com`,
      telefono: '+56912345678'
    }
  }
];

// Ejecutar todas las pruebas
async function runTests() {
  log('🚀 INICIANDO PRUEBAS DE CORRECCIÓN DE MAPEO DE COLUMNA');
  
  const results = [];
  
  // Probar login con usuarios predefinidos
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    
    if (user.description === 'Nuevo usuario generado') {
      // Para el nuevo usuario, primero registrarlo
      log(`\n===== Prueba ${i+1}: ${user.description} =====`);
      const registerResult = await registerUser(user.userData);
      results.push({
        test: `${i+1}.a. Registro de ${user.description}`,
        success: registerResult.success,
        message: registerResult.message || ''
      });
      
      // Luego intentar login
      if (registerResult.success) {
        const loginResult = await testLogin({
          rut: user.userData.rut,
          password: user.userData.password
        });
        
        results.push({
          test: `${i+1}.b. Login con ${user.description}`,
          success: loginResult.success,
          message: loginResult.message || ''
        });
      }
    } else {
      // Para usuarios predefinidos, solo probar login
      log(`\n===== Prueba ${i+1}: ${user.description} =====`);
      const result = await testLogin(user.credentials);
      
      results.push({
        test: `${i+1}. Login con ${user.description}`,
        success: result.success,
        message: result.message || ''
      });
    }
  }
  
  // Mostrar resumen
  log('\n===== RESUMEN DE RESULTADOS =====');
  results.forEach(result => {
    log(`${result.success ? '✅' : '❌'} ${result.test}${result.message ? ': ' + result.message : ''}`);
  });
  
  // Conclusión
  const allSuccess = results.some(r => r.success);
  if (allSuccess) {
    log('\n✅ CONCLUSIÓN: La corrección del mapeo de columna fue exitosa');
  } else {
    log('\n❌ CONCLUSIÓN: Persisten problemas con el mapeo de columna');
  }
  
  log(`\nResultados detallados guardados en: ${LOG_FILE}`);
}

// Ejecutar todas las pruebas
runTests().catch(error => {
  log(`\n❌ ERROR FATAL: ${error.message}`);
});
