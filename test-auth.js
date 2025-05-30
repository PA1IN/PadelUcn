// Diagnóstico para los problemas de login y registro
const http = require('http');

// URL y Configuración
const API_HOST = 'localhost';
const API_PORT = '8080';
const API_PREFIX = '/api';

// Definir datos de prueba
const testUser = {
  rut: '11222333-4', // Usa un RUT que probablemente no exista para el registro
  password: 'contraseña123',
  nombre: 'Usuario Prueba',
  correo: 'prueba@gmail.com',
  telefono: '912345678'
};

// Helpers
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 Realizando petición ${options.method} a ${options.path}\n`);
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          console.log(`✅ Respuesta (${res.statusCode}):`);
          console.log(JSON.stringify(parsedData, null, 2));
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          console.log(`❗ Error al parsear la respuesta: ${responseData}`);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error en la petición: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      const stringData = JSON.stringify(data);
      console.log("📤 Enviando datos:");
      console.log(stringData);
      req.write(stringData);
    }
    
    req.end();
  });
}

// Prueba de registro
async function testRegister() {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: `${API_PREFIX}/auth/register`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    console.log("\n📝 PRUEBA DE REGISTRO");
    console.log("====================");
    const response = await makeRequest(options, testUser);
    return response;
  } catch (error) {
    console.log(`❌ Error en la prueba de registro: ${error.message}`);
    return null;
  }
}

// Prueba de login
async function testLogin(userData) {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: `${API_PREFIX}/auth/login`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const loginData = {
    rut: userData.rut,
    password: userData.password
  };
  
  try {
    console.log("\n🔑 PRUEBA DE LOGIN");
    console.log("=================");
    const response = await makeRequest(options, loginData);
    return response;
  } catch (error) {
    console.log(`❌ Error en la prueba de login: ${error.message}`);
    return null;
  }
}

// Prueba de perfil
async function testProfile(token) {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: `${API_PREFIX}/auth/profile`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  try {
    console.log("\n👤 PRUEBA DE PERFIL");
    console.log("==================");
    const response = await makeRequest(options);
    return response;
  } catch (error) {
    console.log(`❌ Error en la prueba de perfil: ${error.message}`);
    return null;
  }
}

// Ejecutar las pruebas
async function runTests() {
  console.log("\n🧪 INICIANDO PRUEBAS DE AUTENTICACIÓN");
  console.log("===================================");
  
  // Verificar que el API está disponible  try {
    const pingOptions = {
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/auth',
      method: 'GET'
    };
    
    await makeRequest(pingOptions);
  } catch (error) {
    console.log("❌ ERROR: No se pudo conectar al API. Asegúrate de que el servidor esté corriendo en localhost:3000");
    return;
  }
  
  // Paso 1: Registrar un usuario
  const registerResponse = await testRegister();
  
  if (!registerResponse || registerResponse.statusCode !== 201) {
    console.log("\n⚠️ El registro falló o el usuario ya existe. Intentando login de todas formas...");
  }
  
  // Paso 2: Login con el usuario creado
  const loginResponse = await testLogin(testUser);
  
  if (!loginResponse || loginResponse.statusCode !== 200) {
    console.log("\n❌ El login falló. No se puede continuar con las pruebas.");
    return;
  }
  
  const token = loginResponse.data.data.token || loginResponse.data.data.access_token;
  
  if (!token) {
    console.log("\n❌ No se pudo obtener el token de autenticación.");
    return;
  }
  
  // Paso 3: Obtener el perfil con el token
  await testProfile(token);
  
  console.log("\n✅ PRUEBAS COMPLETADAS");
  console.log("=====================");
}

// Ejecutar las pruebas
runTests().catch(err => {
  console.error("Error fatal:", err);
});
