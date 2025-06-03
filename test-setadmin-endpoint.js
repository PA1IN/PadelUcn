const axios = require('axios');

async function testSetAdmin() {
  try {    console.log('Attempting to login as admin...');    const adminLoginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '11111111-1',  // Using the admin user RUT
      password: 'password123'   // Admin password from insert-test-users.sql
    });

    console.log('Login response:', adminLoginResponse.data);
    const adminToken = adminLoginResponse.data.data.access_token;
    
    console.log('Admin login successful, token obtained.');

    // Now use the token to set another user as admin
    const userToChangeRut = '22222222-2';  // The user to be made admin
    console.log(`Attempting to set user ${userToChangeRut} as admin...`);
      const setAdminResponse = await axios.patch(
      `http://localhost:8080/api/usuarios/set-admin/${userToChangeRut}`,
      { isAdmin: true },  // Request body with the isAdmin field
      { 
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('Set Admin Response:', JSON.stringify(setAdminResponse.data, null, 2));

    // Verify the change by getting the user
    console.log('Getting users to verify change...');    const getUserResponse = await axios.get(
      `http://localhost:8080/api/usuarios`,
      { 
        headers: { 'Authorization': `Bearer ${adminToken}` } 
      }
    );
      const changedUser = getUserResponse.data.data.find(user => user.rut === userToChangeRut);
    console.log('User after change:', changedUser);
    
  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

testSetAdmin();
