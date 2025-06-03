// update-user-real-hash.js
// This script updates a user's password with a properly generated bcrypt hash

const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Create a connection to the database
const pool = new Pool({
  user: 'ingeso',
  host: 'localhost',
  database: 'padelucn',
  password: 'ingeso',
  port: 5433, // Use the mapped port
});

async function main() {
  try {
    console.log('Generating a proper bcrypt hash for password123...');
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    console.log(`Generated hash: ${hash}`);

    console.log('\nUpdating user with rut 11111111-1...');
    const res = await pool.query(
      'UPDATE usuario SET "contraseña" = $1 WHERE rut = $2 RETURNING rut',
      [hash, '11111111-1']
    );

    console.log(`Updated ${res.rows.length} users: ${res.rows.map(row => row.rut).join(', ')}`);
    
    console.log('\nFetching updated user record...');
    const { rows } = await pool.query(
      'SELECT rut, "contraseña" FROM usuario WHERE rut = $1',
      ['11111111-1']
    );

    console.log(`User details for ${rows[0].rut}:`);
    console.log(`Password hash: ${rows[0].contraseña}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
