const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function updatePasswords() {  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'padelucn',
    user: 'ingeso',
    password: '12342'
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Generate bcrypt hash for "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Generated hash:', hashedPassword);

    // Update passwords for test users
    const testUsers = ['11111111-1', '22222222-2', '33333333-3', '44444444-4'];
    
    for (const rut of testUsers) {
      // Use column index instead of name to avoid encoding issues
      const updateQuery = `UPDATE usuario SET "contrase??a" = $1 WHERE rut = $2`;
      const result = await client.query(updateQuery, [hashedPassword, rut]);
      console.log(`Updated password for user ${rut}, rows affected: ${result.rowCount}`);
    }

    // Verify the updates
    console.log('\nVerifying password updates:');
    const verifyQuery = `SELECT rut, LENGTH("contrase??a") as pwd_length FROM usuario WHERE rut = ANY($1)`;
    const verifyResult = await client.query(verifyQuery, [testUsers]);
    
    verifyResult.rows.forEach(row => {
      console.log(`User ${row.rut}: password length = ${row.pwd_length} characters`);
    });

  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await client.end();
  }
}

updatePasswords().catch(console.error);
