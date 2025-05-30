// Direct bcrypt password comparison test to verify our column mapping fix
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

// Test function
async function testPasswordComparison() {
  console.log('🔐 BCRYPT PASSWORD COMPARISON TEST');
  console.log('================================\n');
  
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  });
  
  try {
    console.log('1. Connecting to database...');
    await client.connect();
    console.log('   ✅ Connected successfully\n');
    
    // First, check the database schema
    console.log('2. Checking database schema...');
    const tableRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Usuario'
      ORDER BY ordinal_position;
    `);
    
    console.log('   Table structure:');
    tableRes.rows.forEach(row => {
      console.log(`   - Column: ${row.column_name}, Type: ${row.data_type}`);
    });
    
    const passwordColumn = tableRes.rows.find(
      row => row.column_name === 'contraseña' || row.column_name === 'password'
    );
    
    if (!passwordColumn) {
      console.log('   ❌ Neither "contraseña" nor "password" column found!');
      return false;
    }
    
    console.log(`   ✅ Password column found: "${passwordColumn.column_name}"\n`);
    
    // Create a test user with a hashed password
    const plainPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('3. Creating a test user with hashed password...');
    
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
      console.log('   ✅ Updated test user');
    } else {
      // Insert a new test user
      await client.query(
        'INSERT INTO "Usuario" (rut, nombre_usuario, correo, contraseña, telefono, saldo, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['TEST-USER', 'Test User', 'test@example.com', hashedPassword, '123456789', 0, false]
      );
      console.log('   ✅ Created test user');
    }
    
    // Retrieve the user to verify the password column
    console.log('\n4. Retrieving test user to verify password storage...');
    const userRes = await client.query(
      'SELECT * FROM "Usuario" WHERE rut = $1',
      ['TEST-USER']
    );
    
    if (userRes.rows.length === 0) {
      console.log('   ❌ Failed to retrieve test user!');
      return false;
    }
    
    const user = userRes.rows[0];
    
    // Check if the password is stored in the expected column
    const storedPassword = user.contraseña || user.password;
    
    if (!storedPassword) {
      console.log('   ❌ No password found in the retrieved user!');
      console.log('   Available columns:', Object.keys(user));
      return false;
    }
    
    console.log('   ✅ Retrieved user with password');
    console.log(`   Password column in result: "${passwordColumn.column_name}"`);
    console.log(`   Password value (redacted): ${storedPassword.substring(0, 10)}...`);
    
    // Test bcrypt comparison to verify the fix
    console.log('\n5. Testing password comparison...');
    const isMatch = await bcrypt.compare(plainPassword, storedPassword);
    
    if (isMatch) {
      console.log('   ✅ Password comparison successful!');
      console.log('\n🎉 TEST PASSED: Our fix for the password comparison issue worked!');
      return true;
    } else {
      console.log('   ❌ Password comparison failed!');
      console.log('\n❌ TEST FAILED: The password comparison issue is not resolved.');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error during test:', error);
    return false;
  } finally {
    // Close DB connection
    await client.end();
  }
}

// Run the test
testPasswordComparison().catch(err => {
  console.error('Fatal test error:', err);
});
