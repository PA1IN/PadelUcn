const bcrypt = require('bcrypt');

const password = 'password123';

// Create multiple hashes to find one that might work better
for (let i = 0; i < 3; i++) {
    const hash = bcrypt.hashSync(password, 10);
    console.log(`Hash ${i + 1}: ${hash} (length: ${hash.length})`);
    
    // Test the hash
    const isValid = bcrypt.compareSync(password, hash);
    console.log(`Valid: ${isValid}\n`);
}
