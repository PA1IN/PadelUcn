// test-login-api.js
// A script to test the login API endpoint

const axios = require('axios');

// API endpoint
const API_URL = 'http://localhost:8080/api/auth/login';

// Test users from the sample data
const users = [
  { rut: '11111111-1', password: 'admin123', description: 'Admin user' },
  { rut: '22222222-2', password: 'usuario123', description: 'Regular user (Juan)' },
  { rut: '33333333-3', password: 'usuario123', description: 'Regular user (María)' }
];

// Function to test login for a user
async function testLogin(user) {
  console.log(`Testing login for ${user.description} (${user.rut})...`);
  
  try {    const response = await axios.post(API_URL, {
      rut: user.rut,
      password: user.password
    });
    
    console.log('✅ Login successful!');
    console.log('Response data:', response.data);
    
    // Check different response formats
    if (response.data.usuario) {
      console.log('User details:', response.data.usuario);
      console.log('Token received:', response.data.access_token ? '✓ Yes' : '✗ No');
    } else if (response.data.data && response.data.data.token) {
      console.log('Token received:', '✓ Yes');
    } else {
      console.log('Token received:', '✗ No');
    }
    console.log('-----------------------------------');
    
    return true;
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Status:', error.response.status);
      console.log('Error message:', error.response.data.message || 'No message provided');
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Error: No response received from server. Is the backend running?');
    } else {
      // Something happened in setting up the request
      console.log('Error:', error.message);
    }
    console.log('-----------------------------------');
    
    return false;
  }
}

// Run tests for all users
async function runTests() {
  console.log('==== PADELUCN LOGIN API TEST ====');
  console.log('Testing against endpoint:', API_URL);
  console.log('-----------------------------------');
  
  let successCount = 0;
  
  for (const user of users) {
    const success = await testLogin(user);
    if (success) successCount++;
  }
  
  console.log(`Test summary: ${successCount}/${users.length} logins successful`);
}

runTests().catch(console.error);
