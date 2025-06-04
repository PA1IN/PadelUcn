const axios = require('axios');

async function testNewUserRegistration() {
  try {
    console.log('Testing registration with a completely new user...');
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      rut: '88888888-8',
      nombre_usuario: 'Nuevo Usuario Test',
      correo: 'nuevousuario@gmail.com',
      contraseña: 'password123',
      telefono: '+56987654321'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('New user registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('New user registration failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

async function testLoginWithNewUser() {
  try {
    console.log('\nTesting login with newly registered user...');
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '88888888-8',
      contraseña: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login with new user successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Login with new user failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('Starting test sequence...');
  await testNewUserRegistration();
  await testLoginWithNewUser();
  console.log('Test sequence completed.');
}

runTests().catch(error => {
  console.error('Test sequence failed:', error);
});
