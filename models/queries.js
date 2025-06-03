// imports PostgreSQL connection pool
const pool = require("../db/pool");
// imports bcryptjs library for password hashing for Node.js
const bcrypt = require("bcryptjs");
const { comparePasswords } = require("./helpers");

async function queryDatabase(query, params = []) {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error(`Database error:`, error.message);
    throw new Error("Database operation failed");
  }
}

async function getAllMessages() {
  return await queryDatabase(
    `SELECT 
      members.first_name AS first_name,
      members.last_name AS last_name,
      messages.id,
      messages.added,
      messages.title,
      messages.text
    FROM members
    JOIN messages ON members.id = messages.mem_id
    ORDER BY messages.added ASC
      `
  );
}

// creates a signed up user (not logged in) when there is a POST request for user signup
async function createUser(firstName, lastName, username, password) {
  // hashes user's password with 10 salt rounds
  // const saltRounds = 10;
  const hash = await bcrypt.hash(password, 10);

  /* runs SQL query against the PostgreSQL database to add a user 
    result - full response object, containing metadata like rowCount, command, rows */
  const result = await queryDatabase(
    // uses parameterized query placeholders to prevent SQL injection
    `INSERT INTO members (first_name, last_name, username, hash) VALUES ($1, $2, $3, $4) RETURNING *;`,
    [firstName, lastName, username, hash]
  );
  // returns the inserted row(s) - all columns via RETURNING *
  // console.log("New user created:", result.rows[0]);
  return result[0]?.id || null;
}

// returns signup status boolean by username
async function findSignupStatusByUsername(username) {
  const result = await queryDatabase(
    "SELECT 1 FROM members WHERE username = $1",
    [username]
  );
  return result.length > 0;
}

// returns the user object found by username
async function findUserByStatus(username, mem_status) {
  /* queries PostgreSQL database for a user with provided username and mem_status 
    rows - array containing the query results, only the data without metadata */
  const result = await queryDatabase(
    "SELECT username, hash, mem_status, admin_status FROM members WHERE username = $1 AND mem_status = $2",
    [username, mem_status]
  );
  // returns first user object or null if not found
  return result[0] || null;
}

// returns club joined status boolean by username
async function findJoinedStatusByUsername(username) {
  const result = await queryDatabase(
    "SELECT mem_status FROM members WHERE username = $1",
    [username]
  );
  return result.length > 0 ? Boolean(result[0].mem_status) : false;
}

// returns user object with mem_status false that will join the club
async function findUserForClubOrAdminAccess(username, password) {
  // queries PostgreSQL database for a user with provided username and mem_status of false
  const user = await findUserByStatus(username, false);

  // if user object isn't returned, user doesn't exist or is already a member
  if (!user) {
    // returns a custom boolean property, success, and error messag in the object
    return {
      success: false,
      message:
        "You are not signed up or are already a member. Please sign in or log in.",
    };
  }
  // compares plaintext input and stored hashed password using helper function
  const isMatch = await comparePasswords(password, user.hash);
  // if they do match, returns user object
  // if they do not match, returns success: false with an error message
  return isMatch
    ? { success: true, user }
    : { success: false, message: "Incorrect password" };
  // catch and handles errors, prevents exposing sensitive database details
}

// updates the user object to mem_status true (user joins the club)
async function grantUserMembership(username) {
  // runs SQL query against the PostgreSQL database to make a user's mem_status true
  const result = await queryDatabase(
    `UPDATE members
         SET mem_status = TRUE
         WHERE username = $1
         RETURNING id;`,
    [username]
  );
  return result.length > 0;
}

// updates the user object to mem_status true (user joins the club)
async function grantAdminAccess(username) {
  // runs SQL query against the PostgreSQL database to make a user's admin_status true
  const result = await queryDatabase(
    `UPDATE members
         SET admin_status = TRUE
         WHERE username = $1
         RETURNING id;`,
    [username]
  );
  return result.length > 0;
}

// returns admin status boolean by username
async function findAdminStatusByUsername(username) {
  const result = await queryDatabase(
    "SELECT admin_status FROM members WHERE username = $1",
    [username]
  );
  return result.length > 0 ? Boolean(result[0].admin_status) : false;
}

// returns user object with mem_status true that will log in
async function findMemberForLogin(username, password) {
  // queries PostgreSQL database for a user with provided username and mem_status of true
  const user = await findUserByStatus(username, true);

  /* returns rows array matching the selection criteria 
          if rows is empty, user doesn't exist or is already a member */
  if (!user) {
    // returns a custom boolean property, success, and error messag in the object
    return {
      success: false,
      message: "You must join the club before logging in.",
    };
  }

  // compares plaintext input and stored hashed password using helper function
  const isMatch = await comparePasswords(password, user.hash);
  // if they do match, returns user object
  // if they do not match, returns success: false with an error message
  return isMatch
    ? { success: true, user }
    : { success: false, message: "Incorrect password" };
}

async function findMemIdByUsername(username) {
  const result = await queryDatabase(
    "SELECT id FROM members WHERE username = $1",
    [username]
  );
  return result[0]?.id || null;
}

async function createMessage(title, text, added, mem_id) {
  const result = await queryDatabase(
    `INSERT INTO messages (title, text, added, mem_id) 
      VALUES ($1, $2, $3, $4)
      RETURNING id;`,
    [title, text, added, mem_id]
  );
  return result[0]?.id || null;
}

async function deleteMessage(id) {
  await queryDatabase("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = {
  getAllMessages,
  createUser,
  findSignupStatusByUsername,
  findUserByStatus,
  findUserForClubOrAdminAccess,
  grantUserMembership,
  findJoinedStatusByUsername,
  grantAdminAccess,
  findAdminStatusByUsername,
  findMemberForLogin,
  findMemIdByUsername,
  createMessage,
  deleteMessage,
};
