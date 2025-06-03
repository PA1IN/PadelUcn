// Simple script to run inside the backend container to update password hashes
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function updatePasswords() {
  console.log('Starting password update process...');
  
  // Create PostgreSQL connection pool
  const pool = new Pool({
    user: 'ingeso',
    host: 'padelucn-postgres', // Using Docker service name for network resolution
    database: 'padelucn',
    password: 'ingeso',
    port: 5432,
  });
  
  try {
    // Generate a new hash for 'password123'
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(`Generated hash for '${plainPassword}': ${hashedPassword}`);
    
    // Update user passwords
    const res = await pool.query(
      'UPDATE usuario SET "contraseña" = $1 WHERE rut IN ($2, $3, $4) RETURNING rut',
      [hashedPassword, '11111111-1', '22222222-2', '33333333-3']
    );
    
    console.log(`Updated ${res.rowCount} users: ${res.rows.map(r => r.rut).join(', ')}`);
    
    // Verify the update
    const check = await pool.query(
      'SELECT rut, "contraseña" FROM usuario WHERE rut IN ($1, $2, $3)',
      ['11111111-1', '22222222-2', '33333333-3']
    );
    
    console.log('Updated passwords:');
    check.rows.forEach(row => {
      console.log(`${row.rut}: ${row.contraseña}`);
    });
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await pool.end();
    console.log('Password update process completed.');
  }
}

updatePasswords().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
