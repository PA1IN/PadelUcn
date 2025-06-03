const axios = require('axios');

const testUsers = [
  {
    rut: '11111111-1',
    nombre: 'Test User 1',
    correo: 'test1@example.com',
    password: 'password123',
    telefono: '123456789'
  },
  {
    rut: '22222222-2',
    nombre: 'Test User 2',
    correo: 'test2@example.com',
    password: 'password123',
    telefono: '123456790'
  },
  {
    rut: '33333333-3',
    nombre: 'Test User 3',
    correo: 'test3@example.com',
    password: 'password123',
    telefono: '123456791'
  }
];

async function registerTestUsers() {
  for (const user of testUsers) {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', user);
      console.log(`✅ Successfully registered user ${user.rut}: ${user.nombre}`);
      console.log(`   Access token: ${response.data.data.access_token.substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ Failed to register user ${user.rut}: ${user.nombre}`);
      if (error.response) {
        console.log(`   Error: ${error.response.data.error || error.response.data.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
  }

  // Now test login for each user
  console.log('\n--- Testing Login for All Users ---');
  for (const user of testUsers) {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        rut: user.rut,
        password: user.password
      });
      console.log(`✅ Login successful for ${user.rut}: ${user.nombre}`);
    } catch (error) {
      console.log(`❌ Login failed for ${user.rut}: ${user.nombre}`);
      if (error.response) {
        console.log(`   Error: ${error.response.data.error || error.response.data.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
  }
}

registerTestUsers().catch(console.error);
