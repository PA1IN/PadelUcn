const http = require('http');
const https = require('https');

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    // Parse the URL
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    
    // Prepare the request options
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    // Choose the appropriate library
    const requestLib = isHttps ? https : http;
    
    // Make the request
    const req = requestLib.request(options, (res) => {
      let responseData = '';
      
      // Collect the response data
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Process the complete response
      res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (error) {
          console.log(`Raw response: ${responseData}`);
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      reject(error);
    });
    
    // Send the data
    req.write(data);
    req.end();
  });
}

const url = "http://localhost:8080/api/auth/register";
const payload = {
  "rut": "99999999-9",
  "nombre": "Debug Test",
  "correo": "debug@test.com",
  "password": "123456",
  "telefono": "+56912345678"
};

postRequest(url, JSON.stringify(payload))
  .then(response => {
    console.log("Response data:", JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error("Request failed:", error);
  });
