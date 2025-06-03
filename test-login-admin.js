const axios = require('axios');

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '11111111-1',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.data.token);
    
    // Save token to a file for later use
    const fs = require('fs');
    fs.writeFileSync('admin-token.txt', response.data.data.token);
    console.log('Token saved to admin-token.txt');
    
  } catch (error) {
    console.error('Login failed!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
};

loginUser();
