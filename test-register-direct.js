const http = require('http');

// Function to test the registration endpoint
async function testRegisterEndpoint() {
  // User data for registration
  const userData = {
    rut: '55555555-5',
    nombre: 'Test API Direct',
    correo: 'test.api@example.com',
    password: '123456',
    telefono: '+56987654321'
  };

  // Convert data to JSON string
  const dataString = JSON.stringify(userData);

  // Request options
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString)
    }
  };

  // Create and send the request
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response data:');
        try {
          const parsedData = JSON.parse(data);
          console.log(JSON.stringify(parsedData, null, 2));
          resolve(parsedData);
        } catch (e) {
          console.log('Raw data:', data);
          resolve(data);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });
    
    // Write data to request body
    req.write(dataString);
    req.end();
  });
}

// Run the test
testRegisterEndpoint()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err));
