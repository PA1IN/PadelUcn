const { createConnection } = require('typeorm');
const fs = require('fs');
const bcrypt = require('bcryptjs');

async function checkAndFixDatabaseColumns() {
  console.log('Starting database column check and fix...');
  
  try {
    // Create a connection to the database
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'ingeso',
      password: '12342',
      database: 'padelucn'
    });
    
    console.log('Connected to the database successfully!');
    
    // Check if the user table exists
    const userTableExists = await connection.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'usuario'
      );
    `);
    
    console.log('User table exists:', userTableExists[0].exists);
    
    // Get column information
    const columns = await connection.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuario';
    `);
    
    console.log('Columns in usuario table:');
    console.table(columns);
    
    // Create a user directly with a SQL query
    try {
      // Generate a password hash
      const password = await bcrypt.hash('123456', 10);
      
      // Insert a new user with raw SQL
      const insertResult = await connection.query(`
        INSERT INTO usuario (rut, "contrase??a", nombre_usuario, correo, telefono, saldo, is_admin) 
        VALUES ($1, $2, $3, $4, $5, 0, false)
        ON CONFLICT (rut) DO NOTHING
        RETURNING *;
      `, ['direct-sql-00', password, 'Direct SQL Test', 'direct@sql.test', '+56900000000']);
      
      console.log('Direct SQL insert result:');
      console.log(insertResult);
      
      // Create an SQL script to fix the issue if needed
      const fixScript = `
      -- Fix script for "usuario" table
      -- Run this if you're having issues with the special characters in column names
      
      -- First, check the current column names
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuario';
      
      -- Create a backup of the table
      CREATE TABLE IF NOT EXISTS usuario_backup AS SELECT * FROM usuario;
      
      -- Check if the backup was created correctly
      SELECT COUNT(*) FROM usuario_backup;
      SELECT COUNT(*) FROM usuario;
      
      -- You might need to rename the problematic column
      -- ALTER TABLE usuario RENAME COLUMN "contrase??a" TO password;
      -- ALTER TABLE usuario RENAME COLUMN "nombre_usuario" TO nombre;
      
      -- Test inserting a user with raw SQL
      INSERT INTO usuario (rut, "contrase??a", nombre_usuario, correo, telefono, saldo, is_admin)
      VALUES ('test-fix-00', '${password}', 'Test Fix Script', 'fix@test.com', '+56900000001', 0, false)
      ON CONFLICT (rut) DO NOTHING
      RETURNING *;
      `;
      
      // Write the fix script to a file
      fs.writeFileSync('fix-column-names.sql', fixScript);
      console.log('Fix script written to fix-column-names.sql');
      
    } catch (sqlError) {
      console.error('Error executing SQL:', sqlError);
    }
    
    // Close the connection
    await connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkAndFixDatabaseColumns();
