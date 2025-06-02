// login-test.js
// A simple script to test logging in with both admin123 and usuario123 passwords

const bcrypt = require('bcrypt');

// These are the hashed passwords from the sample data
const adminHash = '$2b$10$OQM/JtW2FC1NC7Fz26/tue6l/QL1glcJZpT0IjCflV8Os5sdoG3JG';  // supposed to be for admin123
const userHash = '$2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO';  // supposed to be for usuario123

// Test passwords
const plainPasswords = ['admin123', 'usuario123', 'admin', 'user', 'password', '123456'];

// Function to test each password against the hashes
async function testPasswords() {
    console.log("Testing admin hash ($2b$10$OQM/JtW2FC1NC7Fz26/tue6l/QL1glcJZpT0IjCflV8Os5sdoG3JG)...");
    for (const pass of plainPasswords) {
        const result = await bcrypt.compare(pass, adminHash);
        console.log(`Password "${pass}" matches admin hash: ${result}`);
    }
    
    console.log("\nTesting user hash ($2b$10$yTQC0.QKyGCbFLa0YcQnfuXRn/f4wBX5QFXs/MN9YJsLTc5P51XAO)...");
    for (const pass of plainPasswords) {
        const result = await bcrypt.compare(pass, userHash);
        console.log(`Password "${pass}" matches user hash: ${result}`);
    }
}

// Generate new hashes for both passwords
async function generateNewHashes() {
    console.log("\nGenerating new hashes for reference:");
    
    for (const pass of ['admin123', 'usuario123']) {
        const hash = await bcrypt.hash(pass, 10);
        console.log(`"${pass}" hashed: ${hash}`);
    }
}

// Run the tests
async function run() {
    await testPasswords();
    await generateNewHashes();
}

run().catch(console.error);
