/**
 * Script para verificar que la corrección de la autenticación está funcionando correctamente
 */
const axios = require('axios');
const fs = require('fs');

// Configuración
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'fix-verification-results.log';

// Limpiar y crear el archivo de log
fs.writeFileSync(LOG_FILE, `PRUEBA DE VERIFICACIÓN DE LA CORRECCIÓN DE AUTENTICACIÓN
=================================================
Fecha: ${new Date().toISOString()}
API URL: ${API_URL}

`);

// Función para registrar log
function log(message) {
  const logEntry = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  console.log(logEntry);
  fs.appendFileSync(LOG_FILE, logEntry + '\n');
}

// Función para hacer login con RUT y contraseña
async function login(rut, password) {
  log(`\nIntentando login con RUT: ${rut}`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut,
      password
    });
    
    log(`Status code: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    // Verificar si el cuerpo indica un error a pesar de un status code exitoso
    if (response.data && response.data.success === false) {
      log(`❌ Login fallido: ${response.data.message}`);
      return { success: false, message: response.data.message };
    }
    
    // Intentar extraer el token de diferentes formatos posibles
    let token = null;
    if (response.data.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data.data && response.data.data.access_token) {
      token = response.data.data.access_token;
    } else if (response.data.token) {
      token = response.data.token;
    } else if (response.data.access_token) {
      token = response.data.access_token;
    } else if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
      token = response.data;
    }
    
    if (token) {
      log(`✅ Login exitoso - Token obtenido`);
      // Solo mostrar parte del token para seguridad
      const tokenPreview = `${token.substring(0, 15)}...${token.substring(token.length - 10)}`;
      log(`Token: ${tokenPreview}`);
      return { success: true, token };
    }
    
    log(`❌ No se pudo extraer el token de la respuesta`);
    return { success: false, message: 'No se pudo obtener el token' };
  } catch (error) {
    log(`❌ Error en login: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false, message: error.message };
  }
}

// Función para obtener el perfil del usuario con un token
async function getProfile(token) {
  log('\nObteniendo perfil de usuario...');
  
  if (!token) {
    log('❌ No hay token disponible');
    return { success: false };
  }
  
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    log(`Status code: ${response.status}`);
    log(`Datos de perfil: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data && response.data.success !== false) {
      log('✅ Perfil obtenido exitosamente');
      return { success: true, data: response.data };
    } else {
      log(`❌ Error al obtener perfil: ${response.data.message || 'Desconocido'}`);
      return { success: false };
    }
  } catch (error) {
    log(`❌ Error al obtener perfil: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false };
  }
}

// Función para probar el endpoint protegido de usuarios
async function testProtectedEndpoint(token) {
  log('\nProbando endpoint protegido de usuarios...');
  
  if (!token) {
    log('❌ No hay token disponible');
    return { success: false };
  }
  
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    log(`Status code: ${response.status}`);
    log(`Datos: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data && response.data.success !== false) {
      log('✅ Acceso exitoso al endpoint protegido');
      return { success: true };
    } else {
      log(`❌ Error al acceder al endpoint: ${response.data.message || 'Desconocido'}`);
      return { success: false };
    }
  } catch (error) {
    log(`❌ Error al acceder al endpoint protegido: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false };
  }
}

// Función para probar el registro de un nuevo usuario
async function register() {
  log('\nRegistrando nuevo usuario...');
  
  // Generar un RUT único para evitar conflictos
  const randomRut = `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9)}`;
  const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
  
  const userData = {
    rut: randomRut,
    password: 'test123',
    nombre: 'Usuario de Prueba',
    correo: randomEmail,
    telefono: '+56912345678'
  };
  
  log(`Datos de registro: ${JSON.stringify({ ...userData, password: '******' }, null, 2)}`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    log(`Status code: ${response.status}`);
    log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data && response.data.success !== false) {
      log(`✅ Registro exitoso para RUT: ${userData.rut}`);
      return { success: true, user: userData };
    } else {
      log(`❌ Error en registro: ${response.data.message || 'Desconocido'}`);
      return { success: false };
    }
  } catch (error) {
    log(`❌ Error en registro: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false };
  }
}

// Ejecutar todas las pruebas
async function runTests() {
  log('🚀 INICIANDO VERIFICACIÓN DE LA CORRECCIÓN DE AUTENTICACIÓN');
  
  // 1. Probar login con usuario administrador
  log('\n===== PRUEBA 1: LOGIN ADMIN =====');
  const adminResult = await login('12345678-9', 'admin123');
  
  // 2. Probar login con usuario regular
  log('\n===== PRUEBA 2: LOGIN USUARIO REGULAR =====');
  const userResult = await login('98765432-1', 'usuario123');
  
  // 3. Probar registro de nuevo usuario
  log('\n===== PRUEBA 3: REGISTRO DE NUEVO USUARIO =====');
  const registerResult = await register();
  
  // 4. Probar login con el nuevo usuario
  let newUserResult = { success: false };
  if (registerResult.success) {
    log('\n===== PRUEBA 4: LOGIN CON NUEVO USUARIO =====');
    newUserResult = await login(registerResult.user.rut, registerResult.user.password);
  }
  
  // 5. Probar obtener perfil
  if (adminResult.success || userResult.success || newUserResult.success) {
    log('\n===== PRUEBA 5: OBTENER PERFIL =====');
    const token = adminResult.token || userResult.token || newUserResult.token;
    await getProfile(token);
    
    // 6. Probar endpoint protegido
    log('\n===== PRUEBA 6: ACCESO A ENDPOINT PROTEGIDO =====');
    await testProtectedEndpoint(token);
  }
  
  // Resumen
  log('\n===== RESUMEN DE PRUEBAS =====');
  log(`1. Login Admin: ${adminResult.success ? '✅ EXITOSO' : '❌ FALLIDO'}`);
  log(`2. Login Usuario Regular: ${userResult.success ? '✅ EXITOSO' : '❌ FALLIDO'}`);
  log(`3. Registro: ${registerResult.success ? '✅ EXITOSO' : '❌ FALLIDO'}`);
  
  if (registerResult.success) {
    log(`4. Login Nuevo Usuario: ${newUserResult.success ? '✅ EXITOSO' : '❌ FALLIDO'}`);
  }
  
  // Conclusión
  if (adminResult.success || userResult.success || newUserResult.success) {
    log('\n✅ CONCLUSIÓN: LA CORRECCIÓN DE AUTENTICACIÓN ESTÁ FUNCIONANDO');
  } else {
    log('\n❌ CONCLUSIÓN: PERSISTEN PROBLEMAS EN LA AUTENTICACIÓN');
  }
  
  log(`\nResultados detallados guardados en: ${LOG_FILE}`);
}

// Ejecutar las pruebas
runTests().catch(error => {
  log(`\n❌ ERROR FATAL: ${error.message}`);
  log(error.stack || 'No hay stack trace disponible');
});
