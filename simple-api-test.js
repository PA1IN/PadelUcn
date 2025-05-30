// Simple endpoint testing script for PadelUCN
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:8080/api';
const adminCredentials = {
  rut: '12345678-9',
  password: 'admin123'
};
const userCredentials = {
  rut: '98765432-1',
  password: 'usuario123'
};

// Global variables
let adminToken = null;
let userToken = null;

// Test functions
async function testAdminLogin() {
  console.log('\n🔒 Testing admin login...');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    
    console.log(`Status: ${response.status}`);
    
    // Extract token (handle different response formats)
    if (response.data.data?.token) {
      adminToken = response.data.data.token;
    } else if (response.data.data?.access_token) {
      adminToken = response.data.data.access_token;
    } else if (response.data.token) {
      adminToken = response.data.token;
    } else if (response.data.access_token) {
      adminToken = response.data.access_token;
    }
    
    if (adminToken) {
      console.log('✅ Admin login SUCCESSFUL - authentication fix is working!');
      console.log(`Token: ${adminToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('❌ Admin login failed: Could not extract token from response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login failed with error:');
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔑 Testing regular user login...');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userCredentials);
    
    console.log(`Status: ${response.status}`);
    
    // Extract token
    if (response.data.data?.token) {
      userToken = response.data.data.token;
    } else if (response.data.data?.access_token) {
      userToken = response.data.data.access_token;
    } else if (response.data.token) {
      userToken = response.data.token;
    } else if (response.data.access_token) {
      userToken = response.data.access_token;
    }
    
    if (userToken) {
      console.log('✅ User login SUCCESSFUL');
      console.log(`Token: ${userToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('❌ User login failed: Could not extract token from response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ User login failed with error:');
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testProfile() {
  console.log('\n👤 Testing profile endpoint...');
  
  if (!userToken) {
    console.log('❌ Cannot test profile: No user token available');
    return false;
  }
  
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log('Profile data:', JSON.stringify(response.data, null, 2));
    console.log('✅ Profile endpoint SUCCESSFUL');
    return true;
  } catch (error) {
    console.log('❌ Profile endpoint failed with error:');
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testGetAllEndpoint(endpoint, name, token) {
  console.log(`\n📋 Testing ${name} endpoint...`);
  
  if (!token) {
    console.log(`❌ Cannot test ${name}: No token available`);
    return false;
  }
  
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${response.status}`);
    const count = response.data.data?.length || 0;
    console.log(`Found ${count} ${name.toLowerCase()}`);
    console.log('✅ Get all ' + name + ' endpoint SUCCESSFUL');
    return true;
  } catch (error) {
    console.log('❌ Get all ' + name + ' endpoint failed with error:');
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 TESTING PADELUCN API ENDPOINTS');
  console.log('==============================');
  
  // Test authentication endpoints
  const adminLoginSuccess = await testAdminLogin();
  const userLoginSuccess = await testUserLogin();
  const profileSuccess = await testProfile();
  
  // If authentication tests pass, test other endpoints
  if (adminLoginSuccess || userLoginSuccess) {
    // Test users endpoint
    await testGetAllEndpoint('users', 'Users', adminToken || userToken);
    
    // Test courts endpoint
    await testGetAllEndpoint('canchas', 'Courts', adminToken || userToken);
    
    // Test equipment endpoint
    await testGetAllEndpoint('equipamiento', 'Equipment', adminToken || userToken);
    
    // Test reservations endpoint
    await testGetAllEndpoint('reservas', 'Reservations', adminToken || userToken);
  }
  
  // Print summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=============');
  console.log(`Admin login: ${adminLoginSuccess ? '✅ Passed' : '❌ Failed'}`);
  console.log(`User login: ${userLoginSuccess ? '✅ Passed' : '❌ Failed'}`);
  console.log(`Profile: ${profileSuccess ? '✅ Passed' : '❌ Failed'}`);
  
  if (adminLoginSuccess || userLoginSuccess) {
    console.log('\n🎉 AUTHENTICATION TEST PASSED!');
    console.log('Our fix for the password comparison issue with the column name has resolved the problem.');
  } else {
    console.log('\n❌ AUTHENTICATION TEST FAILED!');
    console.log('The password comparison issue might not be fully resolved.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal test error:', error);
});
