const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '11111111-1',
      contraseña: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function testRegister() {
  try {
    console.log('\nTesting register endpoint...');
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      rut: '99999999-9',
      nombre_usuario: 'Usuario Prueba',
      correo: 'prueba@gmail.com',
      contraseña: 'password123',
      telefono: '+56912345678'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Register successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Register failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Run tests
testLogin().then(() => testRegister());
