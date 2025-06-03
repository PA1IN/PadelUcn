const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '22222222-2',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
