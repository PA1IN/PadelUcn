/**
 * Simple login script to get an authentication token for testing
 * 
 * Usage:
 * 1. Update the USER_CREDENTIALS object with your user credentials
 * 2. Run the script with Node.js: node get-auth-token.js
 * 3. Copy the token from the console output to use in Postman
 */
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:8080/api';

// Set your user credentials here
const USER_CREDENTIALS = {
  rut: '12345678-9',  // Replace with your actual RUT
  password: 'your_password'  // Replace with your actual password
};

async function getAuthToken() {
  console.log('Attempting to login and get authentication token...');
  console.log(`Login request to: ${API_URL}/auth/login`);
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, USER_CREDENTIALS);
    
    if (response.data && response.data.data && response.data.data.token) {
      console.log('\n✅ Login successful!\n');
      console.log('Here is your authentication token:');
      console.log('===============================');
      console.log(response.data.data.token);
      console.log('===============================');
      console.log('\nCopy this token and add it to your Postman requests as:');
      console.log('Header name: Authorization');
      console.log(`Header value: Bearer ${response.data.data.token}`);
      
      // Also show user details if available
      if (response.data.data.user) {
        console.log('\nUser details:');
        console.log('-------------');
        console.log(`RUT: ${response.data.data.user.rut}`);
        console.log(`Name: ${response.data.data.user.nombre}`);
        console.log(`Admin: ${response.data.data.user.isAdmin ? 'Yes' : 'No'}`);
      }
      
      return response.data.data.token;
    } else {
      console.log('❌ Login successful but no token received');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    console.log('❌ Login failed');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    
    return null;
  }
}

getAuthToken().catch(error => {
  console.error('Fatal error:', error);
});
