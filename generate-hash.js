// generate-hash.js
// Generate bcrypt hash for 'password123'

const bcrypt = require('bcrypt');

async function generateHash() {
  const saltRounds = 10;
  const password = 'password123';
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Hash for '${password}': ${hash}`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
