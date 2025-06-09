// This script will execute the SQL to rename the contraseña column to contrasena
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function updateColumnName() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'ingeso',
    password: 'ingeso123',
    database: 'padelucn',
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Execute the SQL command to rename the column
    const result = await client.query('ALTER TABLE usuario RENAME COLUMN "contraseña" TO "contrasena"');
    console.log('Column renamed successfully');
    
    // Check the updated schema
    const tableInfo = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuario'
    `);
    
    console.log('\nUpdated usuario table schema:');
    tableInfo.rows.forEach(column => {
      console.log(`- ${column.column_name}: ${column.data_type}`);
    });
    
  } catch (error) {
    console.error('Error updating column name:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

updateColumnName();
