const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      rut: '11111111-1',
      contraseña: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

testLogin().then(success => {
  console.log('\n=== FINAL TEST RESULT ===');
  console.log(success ? '✅ AUTHENTICATION WORKING' : '❌ AUTHENTICATION FAILED');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
