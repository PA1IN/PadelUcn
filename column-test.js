const { Client } = require('pg');

// Run our comprehensive debug script
async function runComparativeTest() {
  try {
    // Connect to database directly
    const client = new Client({
      host: 'localhost',
      port: 5433,
      user: 'ingeso',
      password: '12342',
      database: 'padelucn',
    });
    
    await client.connect();
    console.log('Connected to database directly');

    // Execute a SQL query to create a table 
    const tableSql = `
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        "passwordField" VARCHAR(100)
      );
    `;
    await client.query(tableSql);
    console.log('Created test table if not exists');

    // Execute a SQL query to insert data with a quoted field name
    const insertSql = `
      INSERT INTO test_table (name, "passwordField")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const insertResult = await client.query(insertSql, ['Test Name', 'password123']);
    console.log('Insert result with quoted field:');
    console.table(insertResult.rows);

    // Execute a query to check the names of columns in the usuario table
    const userTableSql = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `;
    const userTableResult = await client.query(userTableSql);
    console.log('Columns in usuario table:');
    console.table(userTableResult.rows);

    // Try to insert directly with quoted and unquoted column names
    try {
      // First approach: quoted special characters
      const insertUserSql = `
        INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const userInsertResult = await client.query(
        insertUserSql, 
        ['88888888-8', 'hashedpwd123', 'Test User', 'testuser@example.com', '+56912345678']
      );
      console.log('Successfully inserted user with quoted column names:');
      console.table(userInsertResult.rows);
    } catch (error) {
      console.error('Failed to insert with quoted column names:', error.message);
      
      try {
        // Second approach: try without quotes
        const insertUserSql2 = `
          INSERT INTO usuario (rut, contraseña, nombre_usuario, correo, telefono)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const userInsertResult2 = await client.query(
          insertUserSql2, 
          ['88888888-9', 'hashedpwd456', 'Test User 2', 'testuser2@example.com', '+56912345678']
        );
        console.log('Successfully inserted user WITHOUT quoted column names:');
        console.table(userInsertResult2.rows);
      } catch (error2) {
        console.error('Failed to insert without quoted column names:', error2.message);
      }
    }

    // Check all users to see what's in the database
    const allUsers = await client.query('SELECT * FROM usuario ORDER BY id_usuario DESC LIMIT 5');
    console.log('Most recent users in database:');
    console.table(allUsers.rows);
    
    await client.end();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error during database operations:', error);
  }
}

runComparativeTest();
