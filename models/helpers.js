// imports bcryptjs library for password hashing for Node.js
const bcrypt = require("bcryptjs");

async function comparePasswords(enteredPassword, storedHash) {
  try {
    return await bcrypt.compare(enteredPassword, storedHash);
  } catch (error) {
    console.error("Error in comparePasswords:", error.message);
    throw new Error("Password comparison failed.");
  }
}

module.exports = { comparePasswords };
