/**
 * Endpoint checker for PadelUcn API - For Postman testing preparation
 * This script will attempt to access endpoints without sending any data
 * to verify that they are accessible and returning correct status codes
 */
const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'postman-test-results.log';

// Clear log file
fs.writeFileSync(LOG_FILE, `POSTMAN ENDPOINTS CHECK
==========================
Date: ${new Date().toISOString()}
API URL: ${API_URL}

`);

// Log function
function log(message) {
  const text = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  console.log(text);
  fs.appendFileSync(LOG_FILE, text + '\n');
}

// Test endpoint function
async function testEndpoint(method, endpoint, expectedStatus = null, token = null) {
  log(`\n=== Testing ${method} ${endpoint} ===`);
  
  try {
    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(`${API_URL}${endpoint}`, config);
        break;
      case 'OPTIONS':
        response = await axios.options(`${API_URL}${endpoint}`, config);
        break;
      default:
        log(`Skipping ${method} request, only testing availability`);
        return { available: true, message: 'Endpoint exists (not tested - requires data)' };
    }
    
    const statusMatches = !expectedStatus || response.status === expectedStatus;
    
    log(`✅ Status: ${response.status}${expectedStatus ? ' (Expected: ' + expectedStatus + ')' : ''}`);
    
    if (!statusMatches) {
      log(`⚠️ Warning: Status code ${response.status} doesn't match expected ${expectedStatus}`);
    }
    
    // Don't log the full response to avoid clutter
    log(`Response type: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
    
    if (Array.isArray(response.data)) {
      log(`Array length: ${response.data.length}`);
    } else if (typeof response.data === 'object') {
      log(`Object keys: ${Object.keys(response.data).join(', ')}`);
    }
    
    return { 
      available: true, 
      status: response.status, 
      expectedStatus: expectedStatus,
      matches: statusMatches 
    };
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    
    if (error.response) {
      log(`Status: ${error.response.status}`);
      
      const statusMatches = expectedStatus && error.response.status === expectedStatus;
      
      if (!statusMatches && expectedStatus) {
        log(`⚠️ Warning: Status code ${error.response.status} doesn't match expected ${expectedStatus}`);
      }
      
      return {
        available: false,
        status: error.response.status,
        expectedStatus: expectedStatus,
        matches: statusMatches,
        error: error.response.data
      };
    }
    
    return { available: false, message: error.message };
  }
}

// Login function to get token
async function login(credentials) {
  try {
    log('\n=== Getting authentication token ===');
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    if (response.data && response.data.data && response.data.data.token) {
      log('✅ Authentication successful');
      return response.data.data.token;
    } else {
      log('❌ Authentication failed - No token in response');
      return null;
    }
  } catch (error) {
    log(`❌ Authentication error: ${error.message}`);
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data)}`);
    }
    return null;
  }
}

// Main function
async function main() {
  log('🔍 CHECKING API ENDPOINTS FOR POSTMAN TESTING');
  
  // Get a token first
  const token = await login({ 
    rut: '11111111-1', // Update with a valid admin user if needed
    password: 'admin123' 
  });
  
  if (!token) {
    log('⚠️ Continuing without authentication token. Some endpoints may fail.');
  }
  
  // Endpoints to check
  const endpoints = [
    // Canchas Module
    { method: 'GET', path: '/canchas', authRequired: true },
    { method: 'GET', path: '/canchas/1', authRequired: true },
    { method: 'OPTIONS', path: '/canchas', authRequired: false },
    
    // Equipamiento Module
    { method: 'GET', path: '/equipamiento', authRequired: true },
    { method: 'GET', path: '/equipamiento/1', authRequired: true },
    { method: 'OPTIONS', path: '/equipamiento', authRequired: false },
    
    // Reserva Module
    { method: 'GET', path: '/reservas', authRequired: true },
    { method: 'GET', path: '/reservas/1', authRequired: true },
    { method: 'OPTIONS', path: '/reservas', authRequired: false },
    { method: 'GET', path: '/reservas/disponibilidad-dia/1/2025-05-30', authRequired: true },
    
    // Boleta Equipamiento Module
    { method: 'GET', path: '/boleta-equipamiento', authRequired: true },
    { method: 'GET', path: '/boleta-equipamiento/1', authRequired: true },
    { method: 'OPTIONS', path: '/boleta-equipamiento', authRequired: false },
    
    // Historial Reserva Module
    { method: 'GET', path: '/historial-reservas', authRequired: true },
    { method: 'GET', path: '/historial-reservas/1', authRequired: true },
    { method: 'OPTIONS', path: '/historial-reservas', authRequired: false }
  ];
  
  // Track results
  const results = {
    total: endpoints.length,
    accessible: 0,
    needsAuth: 0,
    errors: 0
  };
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    const useToken = endpoint.authRequired ? token : null;
    const result = await testEndpoint(endpoint.method, endpoint.path, null, useToken);
    
    // Update statistics
    if (result.available) {
      results.accessible++;
    } else if (result.status === 401) {
      results.needsAuth++;
      log('⚠️ This endpoint requires authentication');
    } else {
      results.errors++;
    }
  }
  
  // Print summary
  log('\n=== ENDPOINT CHECK SUMMARY ===');
  log(`Total endpoints checked: ${results.total}`);
  log(`Accessible endpoints: ${results.accessible}`);
  log(`Endpoints needing auth: ${results.needsAuth}`);
  log(`Endpoints with errors: ${results.errors}`);
  log('\nNOTE: For POST, PATCH, and DELETE endpoints, you will need to configure proper request bodies in Postman.');
}

// Run the checks
main().catch(error => {
  log(`❌ Error during execution: ${error.message}`);
});
