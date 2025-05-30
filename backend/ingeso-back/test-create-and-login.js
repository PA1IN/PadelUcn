const axios = require('axios');

const createAndLogin = async () => {
  console.log('Step 1: Creating a test user...');
  
  const userData = {
    rut: '77777777-7',
    password: 'TestPass123',
    nombre: 'Test User',
    correo: 'test@example.com',
    telefono: '+5699999999'
  };
  
  try {
    // Step 1: Create a new user
    console.log('Creating new user with data:', { ...userData, password: '[HIDDEN]' });
    
    const registerResponse = await axios.post('http://localhost:8080/api/auth/register', userData);
    console.log('Registration response status:', registerResponse.status);
    console.log('Registration response data:', JSON.stringify(registerResponse.data, null, 2));
    
    if (registerResponse.data.success === false) {
      console.log('Registration failed:', registerResponse.data.message);
      return false;
    }
    
    console.log('User created successfully!');
    
    // Step 2: Login with the created user
    console.log('\nStep 2: Logging in with the created user...');
    
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      rut: userData.rut,
      password: userData.password
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.data.success === false) {
      console.error('Login failed:', loginResponse.data.message);
      return false;
    }
    
    console.log('Authentication successful! Our fix worked!');
    return true;
  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
};

// Run the test
createAndLogin().then(result => {
  if (result) {
    console.log('\n✅ SUCCESS: The authentication system is working properly!');
  } else {
    console.log('\n❌ FAILURE: There are still issues with the authentication system.');
  }
});
