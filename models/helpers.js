// imports bcryptjs library for password hashing for Node.js
const bcrypt = require("bcryptjs");
const db = require("./queries");

// for granting club or admin access
async function comparePasswords(enteredPassword, storedHash) {
  try {
    return await bcrypt.compare(enteredPassword, storedHash);
  } catch (error) {
    console.error("Error in comparePasswords:", error.message);
    throw new Error("Password comparison failed.");
  }
}

/* centralizes database logic for retrieving all messages, checking 
a user's signup status, their club join status, and their admin status */
async function getUserContext(username) {
  try {
    const messages = await db.getAllMessages();
    const signedUp = await db.findSignupStatusByUsername(username);
    const hasJoined = await db.findJoinedStatusByUsername(username);
    const isAdmin = await db.findAdminStatusByUsername(username);

    return {
      messages,
      signedUp,
      hasJoined,
      isAdmin,
    };
  } catch (error) {
    console.error(`Error in getUserContext for ${username}:`, error);
    throw new Error("Failed to retrieve user context");
  }
}

module.exports = { comparePasswords, getUserContext };
