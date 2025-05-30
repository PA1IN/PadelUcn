// Verificar la estructura real de la tabla usuario en la base de datos
const { Client } = require('pg');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  port: 5433, // Puerto mapeado de Docker
  user: 'ingeso',
  password: '12342',
  database: 'padelucn'
};

async function checkTableStructure() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Consulta para obtener la estructura de la tabla 'usuario'
    const query = `
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'usuario'
      ORDER BY 
        ordinal_position;
    `;
    
    const result = await client.query(query);
    
    console.log('\n📋 Estructura de la tabla "usuario":');
    console.log('---------------------------------------');
    console.table(result.rows);
    
    return result.rows;
  } catch (error) {
    console.error('❌ Error al verificar la estructura de la tabla:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar la función
checkTableStructure()
  .then(() => console.log('✅ Verificación completada'))
  .catch(err => console.error('❌ Error:', err));
