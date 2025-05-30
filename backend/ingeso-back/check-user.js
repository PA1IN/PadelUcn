// Check if admin user exists
const { Client } = require('pg');

const checkAdminUser = async () => {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');
    
    console.log('Querying for admin user...');
    const res = await client.query('SELECT * FROM \"Usuario\" WHERE rut = $1', ['12345678-9']);
    
    if (res.rows.length > 0) {
      console.log('Admin user found:');
      const user = res.rows[0];
      console.log('RUT:', user.rut);
      console.log('Nombre:', user.nombre_usuario);
      console.log('Password type:', typeof user.contraseña);
      console.log('Password value (redacted):', user.contraseña ? user.contraseña.substring(0, 10) + '...' : 'null');
    } else {
      console.log('Admin user not found');
      
      // Check if any users exist at all
      const allUsers = await client.query('SELECT rut, nombre_usuario FROM \"Usuario\"');
      console.log('Found users:', allUsers.rows.length);
      
      if (allUsers.rows.length > 0) {
        console.log('Available users:');
        allUsers.rows.forEach(user => {
          console.log('- RUT:', user.rut, 'Nombre:', user.nombre_usuario);
        });
      } else {
        console.log('No users found in the database');
      }
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
};

checkAdminUser();
