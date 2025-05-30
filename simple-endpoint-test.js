const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:8080/api';

// Simple function to test GET endpoints
async function testGetEndpoint(endpoint) {
  console.log(`Testing GET ${endpoint}...`);
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    console.log(`✅ Success: Status ${response.status}`);
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
    }
    return false;
  }
}

// Main function to test all endpoints
async function testEndpoints() {
  console.log("=== TESTING API ENDPOINTS ===");
  
  // Test base endpoint
  await testGetEndpoint('');
  
  // Test Auth endpoints
  await testGetEndpoint('/auth/health');
  
  // Test Courts endpoints
  await testGetEndpoint('/canchas');
  
  // Test Equipment endpoints
  await testGetEndpoint('/equipamiento');
  
  // Test Reservation endpoints
  await testGetEndpoint('/reservas');
  
  // Test Equipment Receipt endpoints
  await testGetEndpoint('/boleta-equipamiento');
  
  // Test Reservation History endpoints
  await testGetEndpoint('/historial-reservas');
  
  console.log("\n=== TESTING COMPLETE ===");
}

// Run the tests
testEndpoints().catch(err => {
  console.error("Fatal error:", err);
});
