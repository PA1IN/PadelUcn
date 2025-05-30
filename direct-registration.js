/**
 * Direct Registration Test
 * 
 * This script attempts to register a new user by directly accessing the database
 * using TypeORM, bypassing the API. This allows us to verify if the issue is in
 * the database mapping or elsewhere in the application.
 */

const { createConnection, getRepository } = require('typeorm');
const bcrypt = require('bcryptjs');
const path = require('path');

async function directUserRegistration() {
  try {
    console.log('Starting direct user registration test...');
    console.log('Working directory:', __dirname);

    // Create a direct connection to the database
    console.log('Creating database connection...');
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'ingeso',
      password: '12342',
      database: 'padelucn',
      logging: true,
      synchronize: false
    });

    console.log('Connected to database successfully!');

    // Test a direct SQL insertion
    console.log('Testing direct SQL insertion...');
    try {
      const password = await bcrypt.hash('123456', 10);
      const result = await connection.query(
        `INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (rut) DO NOTHING
         RETURNING *;`,
        ['direct-insert-1', password, 'Direct Insert Test', 'direct.insert@test.com', '+56999999999']
      );
      console.log('Direct SQL insert result:', result);
    } catch (sqlError) {
      console.error('Direct SQL insertion error:', sqlError.message);
      
      // Try with an alternative encoding for the special character
      try {
        console.log('Trying with alternative encoding...');
        const password = await bcrypt.hash('123456', 10);
        const result = await connection.query(
          `INSERT INTO usuario (rut, "contrase\u00F1a", nombre_usuario, correo, telefono) 
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (rut) DO NOTHING
           RETURNING *;`,
          ['direct-insert-2', password, 'Direct Insert Test 2', 'direct.insert.2@test.com', '+56999999998']
        );
        console.log('Alternative encoding result:', result);
      } catch (altError) {
        console.error('Alternative encoding error:', altError.message);
        
        // Last attempt: raw SQL with explicit column values
        try {
          console.log('Trying with raw postgres client...');
          const { Client } = require('pg');
          const client = new Client({
            host: 'localhost',
            port: 5433,
            user: 'ingeso',
            password: '12342',
            database: 'padelucn',
          });
          
          await client.connect();
          const password = await bcrypt.hash('123456', 10);
          const pgResult = await client.query(
            `INSERT INTO "usuario" (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin)
             VALUES ($1, $2, $3, $4, $5, 0, false)
             RETURNING *;`,
            ['direct-insert-3', password, 'Direct Insert Test 3', 'direct.insert.3@test.com', '+56999999997']
          );
          
          console.log('Raw postgres client result:', pgResult.rows);
          await client.end();
        } catch (pgError) {
          console.error('Raw postgres client error:', pgError);
        }
      }
    }

    // Close the connection
    await connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error in direct user registration test:', error);
  }
}

// Run the test
directUserRegistration().then(() => {
  console.log('Test completed');
}).catch(err => {
  console.error('Test failed:', err);
});
