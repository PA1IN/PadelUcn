// Comprehensive API Endpoint Testing Script
const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = 'http://localhost:8080/api';
const LOG_FILE = 'endpoint-test-results.log';

// Clear log file
fs.writeFileSync(LOG_FILE, '');

// Log function to both console and file
function log(message) {
  console.log(message);
  fs.appendFileSync(LOG_FILE, message + '\n');
}

// Test credentials
const TEST_USER = {
  rut: '12345678-9',
  password: 'admin123',
  nombre: 'Test User',
  correo: 'test@example.com',
  telefono: '+56912345678'
};

const REGULAR_USER = {
  rut: '98765432-1',
  password: 'usuario123'
};

// Storage for values we'll need across tests
const testData = {
  adminToken: null,
  userToken: null,
  userId: null,
  courtId: null,
  equipmentId: null,
  reservationId: null,
  equipmentReceiptId: null,
  reservationHistoryId: null,
};

// Format test results
function formatResult(name, success, message = '') {
  return `${success ? '✅' : '❌'} ${name}: ${message}`;
}

// Test runner helper
async function runTest(name, fn) {
  log(`\n🔍 TESTING: ${name}`);
  log(`${'='.repeat(name.length + 10)}`);
  
  try {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    
    if (result.success) {
      log(formatResult(name, true, `Completed in ${duration}ms`));
    } else {
      log(formatResult(name, false, result.message));
    }
    
    return result.success;
  } catch (error) {
    log(formatResult(name, false, `Error: ${error.message}`));
    if (error.response) {
      log(`  Status: ${error.response.status}`);
      log(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Helper to create authenticated axios instance
function createAuthClient(token) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// ==== AUTH MODULE TESTS ====

// Test register endpoint
async function testRegister() {
  log('Testing user registration...');
  
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      ...TEST_USER,
      // Add random number to ensure unique user
      rut: `${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9)}`,
      correo: `test${Math.floor(Math.random() * 10000)}@example.com`
    });
    
    log(`Registration response: ${response.status}`);
    log(`Data: ${JSON.stringify(response.data)}`);
    
    if (response.data && response.data.data && response.data.data.rut) {
      testData.userId = response.data.data.rut;
      log(`Created test user with RUT: ${testData.userId}`);
      return { success: true };
    }
    
    return { success: false, message: 'Failed to extract user info from response' };
  } catch (error) {
    // If error is due to user already existing, that's OK for our tests
    if (error.response && error.response.data && 
        error.response.data.message && 
        error.response.data.message.includes('ya existe')) {
      log('User already exists, continuing with tests.');
      return { success: true };
    }
    
    return { 
      success: false, 
      message: `Registration failed: ${error.message}`
    };
  }
}

// Test login endpoint - admin user
async function testAdminLogin() {
  log('Testing admin login...');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: '12345678-9',
      password: 'admin123'
    });
    
    log(`Login response status: ${response.status}`);
    log(`Login response body: ${JSON.stringify(response.data, null, 2)}`);
    
    // Check if the response body indicates an error despite successful HTTP status
    if (response.data && response.data.success === false) {
      return { success: false, message: `Login failed: ${response.data.message}` };
    }
    
    // Extract token from the response - handle different response formats
    let token = null;
    if (response.data.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data.data && response.data.data.access_token) {
      token = response.data.data.access_token;
    } else if (response.data.token) {
      token = response.data.token;
    } else if (response.data.access_token) {
      token = response.data.access_token;
    } else if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
      // Some APIs return the raw token as the entire response
      token = response.data;
    }
    
    if (token) {
      testData.adminToken = token;
      log('Admin login successful, token obtained');
      return { success: true };
    }
    
    return { success: false, message: 'Could not extract token from response' };
  } catch (error) {
    return { success: false, message: `Login failed: ${error.message}` };
  }
}

// Test login endpoint - regular user
async function testUserLogin() {
  log('Testing regular user login...');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: '98765432-1',
      password: 'usuario123'
    });
    
    log(`Login response status: ${response.status}`);
    log(`Login response body: ${JSON.stringify(response.data, null, 2)}`);
    
    // Check if the response body indicates an error despite successful HTTP status
    if (response.data && response.data.success === false) {
      return { success: false, message: `Login failed: ${response.data.message}` };
    }
    
    // Extract token from the response - handle different response formats
    let token = null;
    if (response.data.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data.data && response.data.data.access_token) {
      token = response.data.data.access_token;
    } else if (response.data.token) {
      token = response.data.token;
    } else if (response.data.access_token) {
      token = response.data.access_token;
    } else if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
      // Some APIs return the raw token as the entire response
      token = response.data;
    }
    
    if (token) {
      testData.userToken = token;
      log('User login successful, token obtained');
      return { success: true };
    }
    
    return { success: false, message: 'Could not extract token from response' };
  } catch (error) {
    return { success: false, message: `Login failed: ${error.message}` };
  }
}

// Test profile endpoint
async function testProfile() {
  log('Testing user profile endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available for profile test' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get('/auth/profile');
    
    log(`Profile response status: ${response.status}`);
    log(`Profile data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Profile fetch failed: ${error.message}` };
  }
}

// ==== USER MODULE TESTS ====

// Test get all users
async function testGetAllUsers() {
  log('Testing get all users endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.get('/users');
    
    log(`Get all users response status: ${response.status}`);
    log(`Found ${response.data.data.length} users`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all users failed: ${error.message}` };
  }
}

// Test get user by RUT
async function testGetUserByRut() {
  log('Testing get user by RUT endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.get('/users/12345678-9');
    
    log(`Get user by RUT response status: ${response.status}`);
    log(`User data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get user by RUT failed: ${error.message}` };
  }
}

// Test update user
async function testUpdateUser() {
  log('Testing update user endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.patch('/users/12345678-9', {
      telefono: '+56912345678'
    });
    
    log(`Update user response status: ${response.status}`);
    log(`Update result: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Update user failed: ${error.message}` };
  }
}

// Test add balance to user
async function testAddBalance() {
  log('Testing add balance endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.patch('/users/12345678-9/ingresar-saldo', {
      monto: 10000
    });
    
    log(`Add balance response status: ${response.status}`);
    log(`Add balance result: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Add balance failed: ${error.message}` };
  }
}

// ==== CANCHAS (COURTS) MODULE TESTS ====

// Test create court
async function testCreateCourt() {
  log('Testing create court endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.post('/canchas', {
      nombre: `Test Court ${Date.now()}`,
      descripcion: 'Court for testing purposes',
      mantenimiento: false,
      valor: 12000
    });
    
    log(`Create court response status: ${response.status}`);
    log(`Court data: ${JSON.stringify(response.data, null, 2)}`);
    
    // Store court ID for later tests
    if (response.data.data && response.data.data.id) {
      testData.courtId = response.data.data.id;
      log(`Court ID stored: ${testData.courtId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Create court failed: ${error.message}` };
  }
}

// Test get all courts
async function testGetAllCourts() {
  log('Testing get all courts endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get('/canchas');
    
    log(`Get all courts response status: ${response.status}`);
    log(`Found ${response.data.data.length} courts`);
    
    // If we don't have a court ID yet, store the first one for testing
    if (!testData.courtId && response.data.data && response.data.data.length > 0) {
      testData.courtId = response.data.data[0].id;
      log(`Court ID stored from list: ${testData.courtId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all courts failed: ${error.message}` };
  }
}

// Test get court by ID
async function testGetCourtById() {
  log('Testing get court by ID endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.courtId) {
    return { success: false, message: 'No court ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get(`/canchas/${testData.courtId}`);
    
    log(`Get court by ID response status: ${response.status}`);
    log(`Court data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get court by ID failed: ${error.message}` };
  }
}

// Test update court
async function testUpdateCourt() {
  log('Testing update court endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  if (!testData.courtId) {
    return { success: false, message: 'No court ID available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.patch(`/canchas/${testData.courtId}`, {
      descripcion: `Updated description ${Date.now()}`
    });
    
    log(`Update court response status: ${response.status}`);
    log(`Update result: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Update court failed: ${error.message}` };
  }
}

// ==== EQUIPAMIENTO (EQUIPMENT) MODULE TESTS ====

// Test create equipment
async function testCreateEquipment() {
  log('Testing create equipment endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.post('/equipamiento', {
      tipo: 'Paleta',
      nombre: `Test Equipment ${Date.now()}`,
      stock: 10,
      costo: 5000
    });
    
    log(`Create equipment response status: ${response.status}`);
    log(`Equipment data: ${JSON.stringify(response.data, null, 2)}`);
    
    // Store equipment ID for later tests
    if (response.data.data && response.data.data.id) {
      testData.equipmentId = response.data.data.id;
      log(`Equipment ID stored: ${testData.equipmentId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Create equipment failed: ${error.message}` };
  }
}

// Test get all equipment
async function testGetAllEquipment() {
  log('Testing get all equipment endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get('/equipamiento');
    
    log(`Get all equipment response status: ${response.status}`);
    log(`Found ${response.data.data.length} equipment items`);
    
    // If we don't have an equipment ID yet, store the first one for testing
    if (!testData.equipmentId && response.data.data && response.data.data.length > 0) {
      testData.equipmentId = response.data.data[0].id;
      log(`Equipment ID stored from list: ${testData.equipmentId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all equipment failed: ${error.message}` };
  }
}

// Test get equipment by ID
async function testGetEquipmentById() {
  log('Testing get equipment by ID endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.equipmentId) {
    return { success: false, message: 'No equipment ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get(`/equipamiento/${testData.equipmentId}`);
    
    log(`Get equipment by ID response status: ${response.status}`);
    log(`Equipment data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get equipment by ID failed: ${error.message}` };
  }
}

// Test update equipment
async function testUpdateEquipment() {
  log('Testing update equipment endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  if (!testData.equipmentId) {
    return { success: false, message: 'No equipment ID available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.patch(`/equipamiento/${testData.equipmentId}`, {
      stock: 15,
      costo: 5500
    });
    
    log(`Update equipment response status: ${response.status}`);
    log(`Update result: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Update equipment failed: ${error.message}` };
  }
}

// ==== RESERVA (RESERVATION) MODULE TESTS ====

// Helper to get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

// Test create reservation
async function testCreateReservation() {
  log('Testing create reservation endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.courtId) {
    return { success: false, message: 'No court ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const tomorrowDate = getTomorrowDate();
    
    const response = await client.post('/reservas', {
      canchaId: testData.courtId,
      fecha: tomorrowDate,
      horaInicio: '10:00',
      horaTermino: '11:00'
    });
    
    log(`Create reservation response status: ${response.status}`);
    log(`Reservation data: ${JSON.stringify(response.data, null, 2)}`);
    
    // Store reservation ID for later tests
    if (response.data.data && response.data.data.id) {
      testData.reservationId = response.data.data.id;
      log(`Reservation ID stored: ${testData.reservationId}`);
    }
    
    return { success: true };
  } catch (error) {
    // If the court is already reserved, that's OK for our tests
    if (error.response && error.response.data && 
        error.response.data.message && 
        error.response.data.message.includes('ocupada')) {
      log('Court already reserved, continuing with tests.');
      return { success: true };
    }
    
    return { success: false, message: `Create reservation failed: ${error.message}` };
  }
}

// Test get all reservations
async function testGetAllReservations() {
  log('Testing get all reservations endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get('/reservas');
    
    log(`Get all reservations response status: ${response.status}`);
    log(`Found ${response.data.data.length} reservations`);
    
    // If we don't have a reservation ID yet, store the first one for testing
    if (!testData.reservationId && response.data.data && response.data.data.length > 0) {
      testData.reservationId = response.data.data[0].id;
      log(`Reservation ID stored from list: ${testData.reservationId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all reservations failed: ${error.message}` };
  }
}

// Test get reservation by ID
async function testGetReservationById() {
  log('Testing get reservation by ID endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.reservationId) {
    return { success: false, message: 'No reservation ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get(`/reservas/${testData.reservationId}`);
    
    log(`Get reservation by ID response status: ${response.status}`);
    log(`Reservation data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get reservation by ID failed: ${error.message}` };
  }
}

// Test check court availability
async function testCheckCourtAvailability() {
  log('Testing check court availability endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.courtId) {
    return { success: false, message: 'No court ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const tomorrowDate = getTomorrowDate();
    
    const response = await client.get(`/reservas/disponibilidad/${testData.courtId}/${tomorrowDate}/10:00/11:00`);
    
    log(`Check availability response status: ${response.status}`);
    log(`Availability data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Check availability failed: ${error.message}` };
  }
}

// Test get available hours for a day
async function testGetAvailableHours() {
  log('Testing get available hours endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.courtId) {
    return { success: false, message: 'No court ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const tomorrowDate = getTomorrowDate();
    
    const response = await client.get(`/reservas/disponibilidad-dia/${testData.courtId}/${tomorrowDate}`);
    
    log(`Get available hours response status: ${response.status}`);
    log(`Available hours data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get available hours failed: ${error.message}` };
  }
}

// ==== BOLETA EQUIPAMIENTO (EQUIPMENT RECEIPT) MODULE TESTS ====

// Test create equipment receipt
async function testCreateEquipmentReceipt() {
  log('Testing create equipment receipt endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.equipmentId) {
    return { success: false, message: 'No equipment ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    
    const response = await client.post('/boleta-equipamiento', {
      equipamientoId: testData.equipmentId,
      cantidad: 1,
      fechaDevolucion: getTomorrowDate()
    });
    
    log(`Create equipment receipt response status: ${response.status}`);
    log(`Equipment receipt data: ${JSON.stringify(response.data, null, 2)}`);
    
    // Store equipment receipt ID for later tests
    if (response.data.data && response.data.data.id) {
      testData.equipmentReceiptId = response.data.data.id;
      log(`Equipment receipt ID stored: ${testData.equipmentReceiptId}`);
    }
    
    return { success: true };
  } catch (error) {
    // If there's not enough stock, that's OK for our tests
    if (error.response && error.response.data && 
        error.response.data.message && 
        error.response.data.message.includes('stock')) {
      log('Not enough equipment stock, continuing with tests.');
      return { success: true };
    }
    
    return { success: false, message: `Create equipment receipt failed: ${error.message}` };
  }
}

// Test get all equipment receipts
async function testGetAllEquipmentReceipts() {
  log('Testing get all equipment receipts endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get('/boleta-equipamiento');
    
    log(`Get all equipment receipts response status: ${response.status}`);
    log(`Found ${response.data.data.length} equipment receipts`);
    
    // If we don't have an equipment receipt ID yet, store the first one for testing
    if (!testData.equipmentReceiptId && response.data.data && response.data.data.length > 0) {
      testData.equipmentReceiptId = response.data.data[0].id;
      log(`Equipment receipt ID stored from list: ${testData.equipmentReceiptId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all equipment receipts failed: ${error.message}` };
  }
}

// Test get equipment receipt by ID
async function testGetEquipmentReceiptById() {
  log('Testing get equipment receipt by ID endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.equipmentReceiptId) {
    return { success: false, message: 'No equipment receipt ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get(`/boleta-equipamiento/${testData.equipmentReceiptId}`);
    
    log(`Get equipment receipt by ID response status: ${response.status}`);
    log(`Equipment receipt data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get equipment receipt by ID failed: ${error.message}` };
  }
}

// ==== HISTORIAL RESERVA (RESERVATION HISTORY) MODULE TESTS ====

// Test get all reservation history
async function testGetAllReservationHistory() {
  log('Testing get all reservation history endpoint...');
  
  if (!testData.adminToken) {
    return { success: false, message: 'No admin token available' };
  }
  
  try {
    const client = createAuthClient(testData.adminToken);
    const response = await client.get('/historial-reservas');
    
    log(`Get all reservation history response status: ${response.status}`);
    log(`Found ${response.data.data.length} history records`);
    
    // Store a history ID for later tests
    if (response.data.data && response.data.data.length > 0) {
      testData.reservationHistoryId = response.data.data[0].id;
      log(`Reservation history ID stored: ${testData.reservationHistoryId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get all reservation history failed: ${error.message}` };
  }
}

// Test get reservation history by ID
async function testGetReservationHistoryById() {
  log('Testing get reservation history by ID endpoint...');
  
  if (!testData.userToken) {
    return { success: false, message: 'No user token available' };
  }
  
  if (!testData.reservationHistoryId) {
    return { success: false, message: 'No reservation history ID available' };
  }
  
  try {
    const client = createAuthClient(testData.userToken);
    const response = await client.get(`/historial-reservas/${testData.reservationHistoryId}`);
    
    log(`Get reservation history by ID response status: ${response.status}`);
    log(`Reservation history data: ${JSON.stringify(response.data, null, 2)}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, message: `Get reservation history by ID failed: ${error.message}` };
  }
}

// RUN ALL TESTS
async function runAllTests() {
  log('\n🚀 STARTING COMPREHENSIVE API ENDPOINT TESTING');
  log('===========================================\n');
  log(`Time: ${new Date().toISOString()}`);
  log(`API URL: ${API_URL}\n`);
  
  // AUTH MODULE
  const results = {
    auth: {},
    user: {},
    courts: {},
    equipment: {},
    reservations: {},
    equipmentReceipts: {},
    reservationHistory: {},
  };
  
  // AUTH MODULE
  log('\n📌 AUTH MODULE');
  results.auth.register = await runTest('Register', testRegister);
  results.auth.adminLogin = await runTest('Admin Login', testAdminLogin);
  results.auth.userLogin = await runTest('User Login', testUserLogin);
  results.auth.profile = await runTest('Get Profile', testProfile);
  
  // USER MODULE
  log('\n📌 USER MODULE');
  results.user.getAllUsers = await runTest('Get All Users', testGetAllUsers);
  results.user.getUserByRut = await runTest('Get User by RUT', testGetUserByRut);
  results.user.updateUser = await runTest('Update User', testUpdateUser);
  results.user.addBalance = await runTest('Add Balance', testAddBalance);
  
  // COURTS MODULE
  log('\n📌 COURTS MODULE');
  results.courts.createCourt = await runTest('Create Court', testCreateCourt);
  results.courts.getAllCourts = await runTest('Get All Courts', testGetAllCourts);
  results.courts.getCourtById = await runTest('Get Court by ID', testGetCourtById);
  results.courts.updateCourt = await runTest('Update Court', testUpdateCourt);
  
  // EQUIPMENT MODULE
  log('\n📌 EQUIPMENT MODULE');
  results.equipment.createEquipment = await runTest('Create Equipment', testCreateEquipment);
  results.equipment.getAllEquipment = await runTest('Get All Equipment', testGetAllEquipment);
  results.equipment.getEquipmentById = await runTest('Get Equipment by ID', testGetEquipmentById);
  results.equipment.updateEquipment = await runTest('Update Equipment', testUpdateEquipment);
  
  // RESERVATIONS MODULE
  log('\n📌 RESERVATIONS MODULE');
  results.reservations.createReservation = await runTest('Create Reservation', testCreateReservation);
  results.reservations.getAllReservations = await runTest('Get All Reservations', testGetAllReservations);
  results.reservations.getReservationById = await runTest('Get Reservation by ID', testGetReservationById);
  results.reservations.checkAvailability = await runTest('Check Court Availability', testCheckCourtAvailability);
  results.reservations.getAvailableHours = await runTest('Get Available Hours', testGetAvailableHours);
  
  // EQUIPMENT RECEIPTS MODULE
  log('\n📌 EQUIPMENT RECEIPTS MODULE');
  results.equipmentReceipts.createReceipt = await runTest('Create Equipment Receipt', testCreateEquipmentReceipt);
  results.equipmentReceipts.getAllReceipts = await runTest('Get All Equipment Receipts', testGetAllEquipmentReceipts);
  results.equipmentReceipts.getReceiptById = await runTest('Get Equipment Receipt by ID', testGetEquipmentReceiptById);
  
  // RESERVATION HISTORY MODULE
  log('\n📌 RESERVATION HISTORY MODULE');
  results.reservationHistory.getAllHistory = await runTest('Get All Reservation History', testGetAllReservationHistory);
  results.reservationHistory.getHistoryById = await runTest('Get Reservation History by ID', testGetReservationHistoryById);
  
  // SUMMARY
  log('\n📊 TEST SUMMARY');
  log('==============\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  for (const module in results) {
    log(`${module.toUpperCase()}:`);
    for (const test in results[module]) {
      const success = results[module][test];
      totalTests++;
      if (success) passedTests++;
      log(`  ${success ? '✅' : '❌'} ${test}`);
    }
    log('');
  }
  
  const passRate = Math.round((passedTests / totalTests) * 100);
  log(`Overall Result: ${passedTests}/${totalTests} tests passed (${passRate}%)`);
  
  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED! The system is working correctly.');
  } else {
    log('\n⚠️ SOME TESTS FAILED. See details above for more information.');
  }
  
  log('\nTest completed at ' + new Date().toISOString());
  log('\nDetailed results are saved in: ' + LOG_FILE);
}

// Start the tests
runAllTests().catch(error => {
  log(`\n❌ FATAL ERROR: ${error.message}`);
  log(error.stack || 'No stack trace available');
});
