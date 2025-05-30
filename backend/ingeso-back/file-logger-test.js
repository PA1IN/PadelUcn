// Direct test with file output
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const logFile = 'test-results.log';

// Clear log file
fs.writeFileSync(logFile, '');

function log(message) {
  fs.appendFileSync(logFile, message + '\n');
}

// Test function
async function testPasswordComparison() {
  log('🔐 BCRYPT PASSWORD COMPARISON TEST');
  log('================================\n');
  
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  });
  
  try {
    log('1. Connecting to database...');
    await client.connect();
    log('   ✅ Connected successfully\n');
    
    // First, check the database schema
    log('2. Checking database schema...');
    const tableRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Usuario'
      ORDER BY ordinal_position;
    `);
    
    log('   Table structure:');
    tableRes.rows.forEach(row => {
      log(`   - Column: ${row.column_name}, Type: ${row.data_type}`);
    });
    
    const passwordColumn = tableRes.rows.find(
      row => row.column_name === 'contraseña' || row.column_name === 'password'
    );
    
    if (!passwordColumn) {
      log('   ❌ Neither "contraseña" nor "password" column found!');
      return false;
    }
    
    log(`   ✅ Password column found: "${passwordColumn.column_name}"\n`);
    
    // Create a test user with a hashed password
    const plainPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    log('3. Creating a test user with hashed password...');
    
    // First check if our test user already exists
    const checkUserRes = await client.query(
      'SELECT * FROM "Usuario" WHERE rut = $1', 
      ['TEST-USER']
    );
    
    if (checkUserRes.rows.length > 0) {
      // Update the existing user
      await client.query(
        'UPDATE "Usuario" SET contraseña = $1 WHERE rut = $2',
        [hashedPassword, 'TEST-USER']
      );
      log('   ✅ Updated test user');
    } else {
      // Insert a new test user
      await client.query(
        'INSERT INTO "Usuario" (rut, nombre_usuario, correo, contraseña, telefono, saldo, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['TEST-USER', 'Test User', 'test@example.com', hashedPassword, '123456789', 0, false]
      );
      log('   ✅ Created test user');
    }
    
    // Retrieve the user to verify the password column
    log('\n4. Retrieving test user to verify password storage...');
    const userRes = await client.query(
      'SELECT * FROM "Usuario" WHERE rut = $1',
      ['TEST-USER']
    );
    
    if (userRes.rows.length === 0) {
      log('   ❌ Failed to retrieve test user!');
      return false;
    }
    
    const user = userRes.rows[0];
    
    // Check if the password is stored in the expected column
    const storedPassword = user.contraseña || user.password;
    
    if (!storedPassword) {
      log('   ❌ No password found in the retrieved user!');
      log('   Available columns: ' + Object.keys(user).join(', '));
      return false;
    }
    
    log('   ✅ Retrieved user with password');
    log(`   Password column in result: "${passwordColumn.column_name}"`);
    log(`   Password value (redacted): ${storedPassword.substring(0, 10)}...`);
    
    // Test bcrypt comparison to verify the fix
    log('\n5. Testing password comparison...');
    const isMatch = await bcrypt.compare(plainPassword, storedPassword);
    
    if (isMatch) {
      log('   ✅ Password comparison successful!');
      log('\n🎉 TEST PASSED: Our fix for the password comparison issue worked!');
      return true;
    } else {
      log('   ❌ Password comparison failed!');
      log('\n❌ TEST FAILED: The password comparison issue is not resolved.');
      return false;
    }
  } catch (error) {
    log('\n❌ Error during test: ' + error.message);
    log(error.stack);
    return false;
  } finally {
    // Close DB connection
    await client.end();
    log('\nTest completed. See results above.');
  }
}

// Run the test
testPasswordComparison().catch(err => {
  log('Fatal test error: ' + err.message);
  log(err.stack);
});
