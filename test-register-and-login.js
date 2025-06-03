const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      rut: '44444444-4',
      nombre: 'Test User 4',
      correo: 'test4@example.com',
      password: 'password123',
      telefono: '123456789'
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
    // Now try to login with the newly registered user
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '44444444-4',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Login Response:', loginResponse.data);
    
  } catch (error) {
    console.log('Operation failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegistration();