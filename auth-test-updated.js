// auth-test-updated.js - Script para probar autenticación con manejo adecuado de respuestas
const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8080/api';

// Credenciales de prueba
const ADMIN_USER = {
  rut: '12345678-9',
  password: 'admin123'
};

const TEST_USER = {
  rut: '98765432-1',
  password: 'usuario123',
  nombre: 'Test User',
  correo: 'test@example.com',
  telefono: '+56912345678'
};

// Función para registrar un usuario
async function register() {
  console.log('=== Probando registro de usuario ===');
  
  try {
    // Generar un RUT único para evitar conflictos
    const randomRut = `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9)}`;
    const userData = {
      ...TEST_USER,
      rut: randomRut,
      correo: `test${Math.floor(Math.random() * 10000)}@example.com`
    };
    
    console.log(`Intentando registrar usuario con RUT: ${userData.rut}`);
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.success === true) {
      console.log('✅ Registro exitoso');
      return userData;
    } else {
      console.log('❌ Registro fallido');
      return null;
    }
  } catch (error) {
    console.error('Error en registro:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Función para iniciar sesión
async function login(credentials) {
  console.log(`\n=== Probando login con RUT: ${credentials.rut} ===`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: credentials.rut,
      password: credentials.password
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
    // Examinar diversas posibilidades para extraer el token
    let token = null;
    
    // Formato 1: data.token
    if (response.data && response.data.data && response.data.data.token) {
      token = response.data.data.token;
      console.log('Token encontrado en data.data.token');
    } 
    // Formato 2: data.access_token
    else if (response.data && response.data.data && response.data.data.access_token) {
      token = response.data.data.access_token;
      console.log('Token encontrado en data.data.access_token');
    }
    // Formato 3: token
    else if (response.data && response.data.token) {
      token = response.data.token;
      console.log('Token encontrado en data.token');
    }
    // Formato 4: access_token
    else if (response.data && response.data.access_token) {
      token = response.data.access_token;
      console.log('Token encontrado en data.access_token');
    }
    // Resultado directo en datos
    else if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
      token = response.data;
      console.log('Token encontrado directamente en data');
    }
    
    if (token) {
      console.log('✅ Login exitoso');
      // Mostrar solo parte del token para seguridad
      const tokenPreview = token.substring(0, 15) + '...' + token.substring(token.length - 10);
      console.log(`Token obtenido: ${tokenPreview}`);
      return token;
    } else {
      console.log('❌ Login fallido - No se pudo encontrar el token');
      if (response.data.success === false) {
        console.log('Mensaje de error:', response.data.message);
      }
      return null;
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Función para obtener el perfil
async function getProfile(token) {
  if (!token) {
    console.log('❌ No hay token disponible para obtener perfil');
    return null;
  }
  
  console.log('\n=== Probando obtención de perfil ===');
  
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Status:', response.status);
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.success === true) {
      console.log('✅ Perfil obtenido correctamente');
      return response.data;
    } else {
      console.log('❌ Error al obtener perfil');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Ejecutar las pruebas
async function runTests() {
  console.log('🚀 INICIANDO PRUEBAS DE AUTENTICACIÓN\n');
  
  // Probar registro
  const registeredUser = await register();
  
  // Probar login con el usuario registrado
  let token = null;
  if (registeredUser) {
    token = await login(registeredUser);
  } else {
    console.log('Intentando login con usuario administrador predefinido');
    token = await login(ADMIN_USER);
  }
  
  // Probar obtención de perfil
  if (token) {
    await getProfile(token);
  }
  
  console.log('\n✅ PRUEBAS COMPLETADAS');
}

// Ejecutar
runTests().catch(err => {
  console.error('Error fatal:', err);
});
