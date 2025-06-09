const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function updatePasswords() {  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'ingeso',
    password: '12342',
    database: 'padelucn',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Hashed password:', hashedPassword);

    // Update all test users with the properly hashed password
    const users = ['11111111-1', '22222222-2', '33333333-3', '44444444-4'];
      for (const rut of users) {
      const result = await client.query(
        'UPDATE usuario SET "contrasena" = $1 WHERE rut = $2',
        [hashedPassword, rut]
      );
      console.log(`Updated user ${rut}: ${result.rowCount} rows affected`);
    }

    console.log('All passwords updated successfully');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await client.end();
  }
}

updatePasswords();
