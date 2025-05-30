// Simple test script to verify API connectivity
const http = require('http');

const API_HOST = 'localhost';
const API_PORT = '8080';

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Respuesta de ${path} (${res.statusCode}): ${data}`);
        resolve(res.statusCode);
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error al conectar a ${path}: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

async function runTests() {
  console.log("🧪 Probando conexión a la API...");
  
  try {
    // Test the API root
    await testEndpoint('/');
  } catch (error) {
    console.log('Error en prueba de raíz:', error.message);
  }
  
  try {
    // Test the API prefix
    await testEndpoint('/api');
  } catch (error) {
    console.log('Error en prueba de /api:', error.message);
  }
  
  try {
    // Test the auth endpoint
    await testEndpoint('/api/auth');
  } catch (error) {
    console.log('Error en prueba de /api/auth:', error.message);
  }
  
  // Try Swagger docs endpoint
  try {
    await testEndpoint('/api/docs');
  } catch (error) {
    console.log('Error en prueba de /api/docs:', error.message);
  }
}

runTests();
