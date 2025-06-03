// test-login-admin.js - Modified version
// Script to test login with admin user and extract JWT token

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// API endpoint
const API_URL = 'http://localhost:8080/api/auth/login';

const loginUser = async () => {
  try {
    console.log('Attempting to login with admin user (11111111-1)...');
    const response = await axios.post(API_URL, {
      rut: '11111111-1',
      password: 'password123'
    });
    
    // Check different response formats
    if (response.data && response.data.success === true) {
      console.log('✅ Login successful!');
      console.log('Status:', response.status);
      
      // Extract token based on the response structure
      let token = null;
      if (response.data.data && response.data.data.access_token) {
        token = response.data.data.access_token;
      } else if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
      } else if (response.data.access_token) {
        token = response.data.access_token;
      } else if (response.data.token) {
        token = response.data.token;
      }
      
      if (token) {
        console.log('Token received: ✓ Yes');
        
        // Save token to a file for later use
        fs.writeFileSync('admin-token.txt', token);
        console.log('Token saved to admin-token.txt');
        
        // Decode token to check isAdmin value
        try {
          const decoded = jwt.decode(token);
          console.log('Decoded token payload:', JSON.stringify(decoded, null, 2));
          console.log('Is Admin:', decoded.isAdmin === true ? 'Yes ✓' : 'No ✗');
        } catch (e) {
          console.log('Could not decode token:', e.message);
        }
      } else {
        console.log('Token received: ✗ No');
        console.log('Full response data:', JSON.stringify(response.data, null, 2));
      }
      
    } else {
      console.log('❌ Login failed!');
      console.log('Response:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Login request failed!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
};

loginUser();
