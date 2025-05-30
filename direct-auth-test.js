// Script para probar registro y login directamente
const http = require('http');

// Configuración
const API_HOST = 'localhost';
const API_PORT = '8080';
const API_PREFIX = '/api';
const TEST_USER = {
  rut: '12345678-9',
  password: 'clave123',
  nombre: 'Usuario Test',
  correo: 'test@gmail.com',
  telefono: '912345678'
};

// Función para hacer peticiones HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    console.log(`⏳ Realizando petición ${options.method} a ${options.path}`);
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          // Intentar parsear como JSON
          const parsedData = responseData ? JSON.parse(responseData) : {};
          
          console.log(`✅ Respuesta (${res.statusCode}):`);
          console.log(JSON.stringify(parsedData, null, 2));
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          // Si no es JSON, mostrar como texto
          console.log(`⚠️ Respuesta no JSON (${res.statusCode}):`);
          console.log(responseData);
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error en la petición: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      const stringData = JSON.stringify(data);
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('Content-Length', Buffer.byteLength(stringData));
      console.log("📤 Enviando datos:");
      console.log(JSON.stringify(data, null, 2));
      req.write(stringData);
    }
    
    req.end();
  });
}

// Función para registrar un usuario
async function registerUser() {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: `${API_PREFIX}/auth/register`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  console.log("\n🔐 REGISTRANDO NUEVO USUARIO");
  console.log("==========================");
  
  try {
    const response = await makeRequest(options, TEST_USER);
    return response;
  } catch (error) {
    console.log(`❌ Error al registrar: ${error.message}`);
    return null;
  }
}

// Función para iniciar sesión
async function loginUser() {
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
    rut: TEST_USER.rut,
    password: TEST_USER.password
  };
  
  console.log("\n🔑 INICIANDO SESIÓN");
  console.log("==================");
  
  try {
    const response = await makeRequest(options, loginData);
    return response;
  } catch (error) {
    console.log(`❌ Error al iniciar sesión: ${error.message}`);
    return null;
  }
}

// Función para verificar conectividad
async function checkConnection() {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/api',
    method: 'GET'
  };
  
  console.log("\n🔍 VERIFICANDO CONEXIÓN AL API");
  console.log("============================");
  
  try {
    await makeRequest(options);
    console.log("✅ Conexión exitosa al API");
    return true;
  } catch (error) {
    console.log(`❌ No se pudo conectar al API en ${API_HOST}:${API_PORT}: ${error.message}`);
    console.log("⚠️ Asegúrate de que el servidor esté corriendo y el puerto sea correcto");
    return false;
  }
}

// Función principal
async function main() {
  console.log("🧪 PRUEBA DE AUTENTICACIÓN DIRECTA");
  console.log("================================");
  
  // Primero verificamos la conexión
  const isConnected = await checkConnection();
  if (!isConnected) {
    console.log("❌ No se puede continuar sin conexión al API");
    return;
  }
  
  // Primero intentamos login
  const loginResponse = await loginUser();
    // Si el login falla porque el usuario no existe, intentamos registrarlo
  if (!loginResponse || loginResponse.data.statusCode === 401) {
    console.log("\n⚠️ Login fallido. Intentando registrar el usuario primero...");
    await registerUser();
    
    // Después de registrar, intentamos login nuevamente
    console.log("\n⚠️ Intentando login nuevamente después del registro...");
    await loginUser();
  }
}

// Ejecutar el script
main().catch(error => {
  console.error("❌ Error fatal:", error);
});
