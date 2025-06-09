// test-add-saldo.js
const axios = require('axios');

async function testAddSaldo() {
  try {
    console.log('Iniciando prueba de agregar saldo...');
    
    // 1. Iniciar sesión para obtener token JWT
    console.log('1. Iniciando sesión...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      rut: '11111111-1',
      contrasena: 'password123'
    });
    
    const token = loginResponse.data.data.access_token;
    console.log(`   ✓ Sesión iniciada correctamente. Token obtenido.`);
      // 2. Obtener saldo actual del usuario
    console.log('2. Consultando saldo inicial...');
    const userResponse = await axios.get('http://localhost:3001/api/usuarios/11111111-1', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const saldoInicial = userResponse.data.data.saldo;
    console.log(`   ✓ Saldo inicial: $${saldoInicial}`);
    
    // 3. Agregar saldo    const montoAgregar = 10000;
    console.log(`3. Agregando saldo: $${montoAgregar}...`);
    const addSaldoResponse = await axios.post(
      'http://localhost:3001/api/usuarios/11111111-1/add-saldo',
      { monto: montoAgregar },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`   ✓ Respuesta recibida: ${addSaldoResponse.data.message}`);
    const saldoFinal = addSaldoResponse.data.data.saldo;
    console.log(`   ✓ Saldo final: $${saldoFinal}`);
    console.log(`   ✓ Diferencia: $${saldoFinal - saldoInicial} (debería ser $${montoAgregar})`);
    
    if (saldoFinal - saldoInicial === montoAgregar) {
      console.log('\n✅ PRUEBA EXITOSA: El saldo se agregó correctamente.');
    } else {
      console.log('\n❌ PRUEBA FALLIDA: El saldo no se actualizó correctamente.');
    }
    
  } catch (error) {
    console.error('❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('   Respuesta del servidor:', error.response.data);
      console.error('   Código de estado:', error.response.status);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('   No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la petición
      console.error('   Error:', error.message);
    }
  }
}

testAddSaldo();
