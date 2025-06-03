const bcrypt = require('bcrypt');

async function verifyHash() {
    const password = 'password123';
    const hash = '$2b$10$TWXbeoDzprTTsLDyahIeEOVwgNAEX/2kG7WniRj1X5DMxsbvd./im';
    
    console.log('Testing password:', password);
    console.log('Against hash:', hash);
    
    const isValid = await bcrypt.compare(password, hash);
    console.log('Is valid:', isValid);
    
    // Let's also create a new hash just to be sure
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
    
    const isNewValid = await bcrypt.compare(password, newHash);
    console.log('New hash is valid:', isNewValid);
}

verifyHash().catch(console.error);
