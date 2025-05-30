const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Function to execute SQL commands directly for debugging
async function debugDatabaseIssue() {
  // Create a PostgreSQL client with connection parameters
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'ingeso',
    password: '12342',
    database: 'padelucn',
  });

  try {
    // 1. Connect to the database
    await client.connect();
    console.log('Connected to the database successfully!');

    // 2. Print the schema of the "usuario" table
    console.log('\n=== SCHEMA INFO ===');
    const tableResult = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `);
    console.table(tableResult.rows);

    // 3. Try to insert a user directly with SQL
    console.log('\n=== TRYING DIRECT INSERT ===');
    const password = await bcrypt.hash('123456', 10);
    const rut = '77777777-7';
    const nombre = 'Test Direct Insert';
    const correo = 'direct@test.com';
    const telefono = '+56987654321';
    
    try {
      const insertResult = await client.query(`
        INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `, [rut, password, nombre, correo, telefono, 0, false]);
      
      console.log('User inserted successfully:');
      console.table(insertResult.rows);
    } catch (insertError) {
      console.error('Error during direct insert:', insertError.message);
      
      // Try with different column name combinations
      console.log('\n=== TRYING WITH DIFFERENT COLUMN NAMES ===');
      
      try {
        // Try without quotes for column names
        const result2 = await client.query(`
          INSERT INTO usuario (rut, contraseña, nombre_usuario, correo, telefono, saldo, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `, [rut + '1', password, nombre, correo, telefono, 0, false]);
        console.log('Insert worked with unquoted column names!');
        console.table(result2.rows);
      } catch (error2) {
        console.error('Unquoted insert failed:', error2.message);
        
        try {
          // Try with alternative column name encoding
          console.log('\n=== LISTING ALL USERS ===');
          const allUsers = await client.query('SELECT * FROM usuario LIMIT 2');
          console.table(allUsers.rows);
          
          // Get column names from an actual query
          const columnNames = Object.keys(allUsers.rows[0]);
          console.log('Actual column names in database:', columnNames);
          
          // Try to match column names from actual data
          const passwordCol = columnNames.find(col => col.includes('contrase') || col === 'password');
          const nombreCol = columnNames.find(col => col.includes('nombre') || col === 'name');
          
          console.log(`Found password column: ${passwordCol}`);
          console.log(`Found nombre column: ${nombreCol}`);
          
          if (passwordCol && nombreCol) {
            const dynamicInsert = `
              INSERT INTO usuario (rut, "${passwordCol}", "${nombreCol}", correo, telefono, saldo, is_admin)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING *;
            `;
            
            const result3 = await client.query(dynamicInsert, [rut + '2', password, nombre, correo, telefono, 0, false]);
            console.log('Insert worked with dynamic column names!');
            console.table(result3.rows);
          }
        } catch (error3) {
          console.error('Dynamic insert failed:', error3.message);
        }
      }
    }
  } catch (error) {
    console.error('General error:', error);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

// Execute the debugging function
debugDatabaseIssue();
