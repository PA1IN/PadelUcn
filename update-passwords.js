const bcrypt = require('bcrypt');
const { Client } = require('pg');

// Create a new PostgreSQL client pointing to Docker container
const client = new Client({
  user: 'ingeso',
  host: 'localhost',
  database: 'padelucn',
  password: 'ingeso',
  port: 5433, // Port mapped from the container
});

async function updatePasswords() {
  try {
    // Connect to the database
    await client.connect();
    
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(`Generated hash for '${plainPassword}': ${hashedPassword}`);
    
    // Update the passwords for the test users
    const updateQuery = `
      UPDATE usuario 
      SET "contraseña" = $1 
      WHERE rut IN ('11111111-1', '22222222-2', '33333333-3')
    `;
    
    const result = await client.query(updateQuery, [hashedPassword]);
    console.log(`Updated ${result.rowCount} rows`);
    
    // Verify the updates
    const verifyQuery = `
      SELECT rut, "contraseña" 
      FROM usuario 
      WHERE rut IN ('11111111-1', '22222222-2', '33333333-3')
    `;
    
    const { rows } = await client.query(verifyQuery);
    console.log('Updated user passwords:');
    rows.forEach(row => console.log(`${row.rut}: ${row['contraseña']}`));
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    // Close the connection
    await client.end();
  }
}

updatePasswords();
