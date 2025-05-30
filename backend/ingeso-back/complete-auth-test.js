// Complete authentication test to verify our fix
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:8080/api';
const TEST_USER = {
  rut: '99887766-5',  // Use a unique RUT that won't conflict with existing users
  password: 'test123456',
  nombre: 'Test User',
  correo: 'test@gmail.com',
  telefono: '+56912345678'
};

// Function to register a new user
async function registerUser() {
  console.log('\n--- REGISTER TEST ---');
  console.log('Registering new user with data:', { ...TEST_USER, password: '[HIDDEN]' });
  
  try {
    const response = await axios.post(`${API_URL}/auth/register`, TEST_USER);
    console.log('Registration response:', response.status);
    console.log('Registration data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success === false) {
      console.log('Registration failed.');
      return false;
    }
    
    console.log('Registration successful!');
    return true;
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Function to login
async function loginUser() {
  console.log('\n--- LOGIN TEST ---');
  console.log('Logging in with:', { rut: TEST_USER.rut, password: '[HIDDEN]' });
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: TEST_USER.rut,
      password: TEST_USER.password
    });
    
    console.log('Login response:', response.status);
    console.log('Login data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success === false || 
        (response.data.statusCode && response.data.statusCode !== 200 && 
         response.data.statusCode !== 201)) {
      console.log('Login failed.');
      return null;
    }
    
    console.log('Login successful!');
    
    // Extract token - handle different response formats
    let token = null;
    if (response.data.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data.data && response.data.data.access_token) {
      token = response.data.data.access_token;
    } else if (response.data.token) {
      token = response.data.token;
    } else if (response.data.access_token) {
      token = response.data.access_token;
    }
    
    return token;
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Function to test the profile endpoint
async function getProfile(token) {
  console.log('\n--- PROFILE TEST ---');
  console.log('Getting profile with token');
  
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Profile response:', response.status);
    console.log('Profile data:', JSON.stringify(response.data, null, 2));
    console.log('Profile test successful!');
    return true;
  } catch (error) {
    console.error('Profile error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Main test function
async function runTest() {
  console.log('\n=== AUTHENTICATION SYSTEM TEST ===\n');
  
  // Step 1: Register a new user
  const registrationResult = await registerUser();
  
  // Step 2: Login with the registered user
  const token = await loginUser();
  
  // Skip profile test if login failed
  if (!token) {
    console.log('\n❌ Authentication test FAILED: Could not log in.');
    return false;
  }
  
  // Step 3: Get user profile with the token
  const profileResult = await getProfile(token);
  
  if (profileResult) {
    console.log('\n✅ Authentication system test PASSED!');
    console.log('Our fix resolved the password comparison issue.');
    return true;
  } else {
    console.log('\n❌ Authentication test FAILED: Could not get profile.');
    return false;
  }
}

// Run the test
runTest().catch(error => {
  console.error('\n❌ Fatal test error:', error);
});
