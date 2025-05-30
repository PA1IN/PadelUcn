const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const http = require('http');

// Database connection
async function connectToDb() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'ingeso',
    password: '12342',
    database: 'padelucn',
  });
  
  await client.connect();
  console.log('Connected to database');
  return client;
}

// API request function
function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// Compare database schema with entity definition
async function compareAndFix() {
  try {
    const client = await connectToDb();
    
    // Step 1: Get database structure
    const schemaQuery = `
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `;
    const schemaResult = await client.query(schemaQuery);
    console.log('\nDatabase Schema:');
    console.table(schemaResult.rows);
    
    // Step 2: Try direct database insert
    const password = await bcrypt.hash('123456', 10);
    const userInsert = {
      rut: '55555555-5',
      nombre: 'Comprehensive Test',
      correo: 'comprehensive@test.com',
      password: password,
      telefono: '+56912345678'
    };
    
    try {
      const insertQuery = `
        INSERT INTO usuario (rut, "contraseña", nombre_usuario, correo, telefono, saldo, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const insertResult = await client.query(
        insertQuery, 
        [userInsert.rut, userInsert.password, userInsert.nombre, userInsert.correo, userInsert.telefono, 0, false]
      );
      
      console.log('\nDirect DB insert successful:');
      console.table(insertResult.rows);
      
      // Step 3: Try API insert with same data but a different RUT
      const apiUserInsert = {
        ...userInsert,
        rut: '66666666-6'
      };
      
      console.log('\nTrying API insert with:', apiUserInsert);
      const apiResponse = await postRequest(
        'http://localhost:8080/api/auth/register', 
        JSON.stringify(apiUserInsert)
      );
      
      console.log(`API Response (${apiResponse.statusCode}):`);
      console.log(JSON.stringify(apiResponse.data, null, 2));
      
      // Step 4: Check if user was created by API
      const checkQuery = `SELECT * FROM usuario WHERE rut = $1`;
      const checkResult = await client.query(checkQuery, [apiUserInsert.rut]);
      
      if (checkResult.rows.length > 0) {
        console.log('\nUser was created in database despite error response!');
        console.table(checkResult.rows);
      } else {
        console.log('\nUser was not created in database.');
      }
      
      // Step 5: Get a sample of all users to verify data is correct
      const allUsers = await client.query('SELECT * FROM usuario ORDER BY id_usuario DESC LIMIT 5');
      console.log('\nLatest users in database:');
      console.table(allUsers.rows);
      
    } catch (error) {
      console.error('Error during testing:', error);
    }
    
    await client.end();
  } catch (error) {
    console.error('Overall error:', error);
  }
}

compareAndFix();
