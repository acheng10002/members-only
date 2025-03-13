// imports PostgreSQL connection pool
const pool = require("../db/pool");
// imports bcryptjs library for password hashing for Node.js
const bcrypt = require("bcryptjs");
const { comparePasswords } = require("./helpers");

// creates a signed up user (not logged in) when there is a POST request for user signup
async function createUser(firstName, lastName, username, password) {
  try {
    // hashes user's password with 10 salt rounds
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    /* runs SQL query against the PostgreSQL database to add a user 
    result - full response object, containing metadata like rowCount, command, rows */
    const result = await pool.query(
      // uses parameterized query placeholders to prevent SQL injection
      `INSERT INTO members (first_name, last_name, username, hash) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [firstName, lastName, username, hash]
    );
    // returns the inserted row(s) - all columns via RETURNING *
    console.log("New user created:", result.rows[0]);
    return result.rows[0].id;
    // catches and handles database errors
  } catch (error) {
    console.error(`Error creating user (${username}):`, error.message);
    throw new Error(`Database error: Failed to create user ${username}.`);
  }
}

// returns the user object found by username
async function findUserByStatus(username, mem_status) {
  try {
    /* queries PostgreSQL database for a user with provided username and mem_status 
    rows - array containing the query results, only the data without metadata */
    const { rows } = await pool.query(
      "SELECT username, hash, mem_status FROM members WHERE username = $1 AND mem_status = $2",
      [username, mem_status]
    );
    // returns first user object or null if not found
    return rows[0] || null;
  } catch (error) {
    console.error(
      `Error in findUserByStatus (${username}, status ${mem_status}):`,
      error.message
    );
    throw new Error(`Database error: Failed to find user ${username}.`);
  }
}

// returns user object with mem_status false that will join the club
async function findUserForJoining(username, password) {
  try {
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
    // if they do not match, returns success: false with an error message
    if (!isMatch) {
      return { success: false, message: "Incorrect password" };
    }
    // if they do match, returns user object
    return { success: true, user };
    // catch and handles errors, prevents exposing sensitive database details
  } catch (error) {
    console.error(`Error in findUserForJoining (${username})`, error.message);
    throw new Error(
      `Database error: Failed to process membership for ${username}.`
    );
  }
}

// updates the user object to mem_status true (user joins the club)
async function grantUserMembership(username) {
  try {
    // runs SQL query against the PostgreSQL database to make a user's mem_status true
    const result = await pool.query(
      `UPDATE members
         SET mem_status = $1
         WHERE username = $2
         RETURNING *;`,
      [true, username]
    );
    // if the full response object has no data, then no matching user found
    if (result.rowCount == 0) {
      console.warn(`No user found with username/email: ${username}`);
      return false;
    }
    // otherwise, matching user found
    console.log(`User admittedly successfully:`, result.rows[0]);
    return true;
    // catch and handles errors, prevents exposing sensitive database details
  } catch (error) {
    console.error(
      `Database error in grantUserMembership (${username}):`,
      error.message
    );
    throw new Error(
      `Database error: Failed to update membership status for ${username}.`
    );
  }
}

// returns user object with mem_status true that will log in
async function findMemberForLogin(username, password) {
  try {
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
    // if they do not match, returns success: false with an error message
    if (!isMatch) {
      return { success: false, message: "Incorrect password" };
    }
    // if they do match, returns user object
    return { success: true, user };
    // catch and handles errors, prevents exposing sensitive database details
  } catch (error) {
    console.error(`Error in findUserForLogin (${username}):`, error.message);
    throw new Error(`Database error: Failed to authenticate user ${username}.`);
  }
}

module.exports = {
  createUser,
  findUserByStatus,
  findUserForJoining,
  grantUserMembership,
  findMemberForLogin,
};
