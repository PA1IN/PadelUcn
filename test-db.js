const { Client } = require('pg');

async function testConnection() {
  // Create a PostgreSQL client with connection parameters
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'ingeso',
    password: '12342',
    database: 'padelucn',
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database successfully!');

    // Check the structure of the Usuario table
    const tableResult = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `);
    
    console.log('\nTable structure for Usuario:');
    console.table(tableResult.rows);    // Check if there are any users in the database - use lowercase table name
    const usersResult = await client.query('SELECT * FROM usuario LIMIT 5;');
    console.log('\nSample users:');
    console.table(usersResult.rows);

    // Try to insert a test user directly into the database - use lowercase table name and correct column names
    try {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10); // Hash the password with bcrypt
        const insertResult = await client.query(
        `INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        ['55555555-5', hashedPassword, 'Test DB User', 'testdb@gmail.com', '+56912345678', 0, false]
      );
      
      console.log('\nInserted user successfully:');
      console.table(insertResult.rows);
    } catch (insertError) {
      console.error('Error inserting user:', insertError.message);
    }

  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    // Close the connection
    await client.end();
    console.log('Connection closed');
  }
}

testConnection();
