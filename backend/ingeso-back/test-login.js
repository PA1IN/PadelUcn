const axios = require('axios');

// Test user credentials from sample-data-new.sql
const testLogin = async () => {
  console.log('Testing login with test credentials from sample data');
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '98765432-1',
      password: 'usuario123'
    });
    console.log('HTTP request successful');
    console.log('Status code:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Check if the login was actually successful
    if (response.data.success === false || response.data.statusCode === 401) {
      console.error('Authentication failed:', response.data.message);
      return false;
    }
    
    console.log('Login successful!');
    return true;
  } catch (error) {
    console.error('Login failed!');
    console.error('Status code:', error.response?.status);
    console.error('Error message:', error.response?.data || error.message);
    return false;
  }
};

// Execute the test
testLogin().then(success => {
  if (success) {
    console.log('Authentication test passed! The fix worked.');
  } else {
    console.log('Authentication test failed! Issues still remain.');
  }
});
