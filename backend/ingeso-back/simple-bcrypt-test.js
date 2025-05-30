// Test bcrypt import
const bcrypt = require('bcryptjs');

async function runTest() {
  console.log("Testing bcrypt functionality");
  
  try {
    // Test hashing
    const password = "testpass";
    const hash = await bcrypt.hash(password, 10);
    
    console.log("Hash generated:", hash.substring(0, 10) + "...");
    
    // Test comparison
    const match = await bcrypt.compare(password, hash);
    console.log("Password match:", match);
    
    console.log("Bcrypt is working correctly.");
    return true;
  } catch (error) {
    console.error("Bcrypt error:", error);
    return false;
  }
}

runTest();
