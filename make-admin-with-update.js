/**
 * This script will use the existing update endpoint to set a user as admin
 */

const axios = require('axios');

async function makeUserAdmin() {
  try {
    console.log('Attempting to login as admin...');
    // Login as admin user
    const adminLoginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '11111111-1',  // Admin RUT
      password: 'password123'  // Admin password
    });

    if (!adminLoginResponse.data.success) {
      throw new Error('Failed to login as admin');
    }
    
    console.log('Admin login successful!');
    const adminToken = adminLoginResponse.data.data.access_token;

    // Find user to update
    console.log('Fetching users...');
    const usersResponse = await axios.get(
      'http://localhost:8080/api/usuarios',
      { 
        headers: { 'Authorization': `Bearer ${adminToken}` } 
      }
    );

    const users = usersResponse.data.data;
    
    // Find the user with RUT 22222222-2
    const userToUpdate = users.find(user => user.rut === '22222222-2');
    
    if (!userToUpdate) {
      throw new Error('User with RUT 22222222-2 not found');
    }
    
    console.log('Found user:', userToUpdate);

    // Update the user to make them an admin
    console.log(`Updating user ${userToUpdate.id} to make them admin...`);
    
    const updateResponse = await axios.patch(
      `http://localhost:8080/api/usuarios/${userToUpdate.id}`,
      { 
        isAdmin: true 
      },
      { 
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Update response:', updateResponse.data);
    
    // Verify the change
    console.log('Verifying the change...');
    const verifyResponse = await axios.get(
      'http://localhost:8080/api/usuarios',
      { 
        headers: { 'Authorization': `Bearer ${adminToken}` } 
      }
    );
    
    const updatedUser = verifyResponse.data.data.find(user => user.rut === '22222222-2');
    console.log('Updated user:', updatedUser);

  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

makeUserAdmin();
