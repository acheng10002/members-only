// extracts validation errors from the request
const { validationResult } = require("express-validator");
// imports database queries
const db = require("../models/queries");

// handles POST request for signup
async function signupPost(req, res) {
  // extracts validation errors
  const errors = validationResult(req);
  // if there are errors, re-renders the signup form with an error message
  if (!errors.isEmpty()) {
    return res.render("signup-form", {
      message: "Invalid value(s) in fields. Please try again.",
    });
  }
  // destructures/extracts user input (form data) from request body
  const { firstName, lastName, username, password } = req.body;

  try {
    /* calls createUser from queries.js, passing it user details 
    inserts a new user into the members table */
    await db.createUser(firstName, lastName, username, password);
    // renders homepage.ejs with dynamic data
    res.render("homepage", {
      message: "You have successfully signed up!", // a success message
      signedUp: true, // successful signup flag for UI logic
      joined: false, // user has not joined the club yet
      user: null, // no user session set yet (they need to log in)
    });
    /* if db.createUser fails (e.g. duplicate username, DB connection issue), 
  logs the error and sends a 500 response */
  } catch (error) {
    console.error("Error saving User:", error);
    res.status(500).send("Internal Server Error");
  }
}

// handles POST request for user joining club
async function joinPost(req, res) {
  // destructures/extracts user input (form data) from request body
  const { username, password, secretPasscode } = req.body;
  try {
    /* calls findUserForJoining from queries.js, passing it user details */
    const foundUser = await db.findUserForJoining(username, password);
    /* if no user object found, return 401 response, unauthorized 
    user is not authenticated and request is missing or has invalid credentials */
    if (!foundUser) {
      return res.status(401).send("Invalid username or password");
    }
    /* if user secretPasscode input is wrong, return 403 response, forbidden 
    user is authenticated but does not have permission to access the resource */
    if (secretPasscode !== "open sesame") {
      return res.status(403).send("Incorrect secret passcode");
    }
    // calls grantUserMembership from queries, passing it username
    const admissionSuccess = await db.grantUserMembership(username);
    /* if grantUserMembership returns false or an exception is thrown in the
    try block (database error), return 500 response, something went wrong on the 
    server while processing the request */
    if (!admissionSuccess) {
      return res.status(500).send("Failed to update membership status");
    }
    // renders homepage.ejs with dynamic data
    res.render("homepage", {
      message: "You have successfully joined the club!",
      signedUp: true,
      joined: true,
      user: null,
    });
    // logs the error and sends a 500 response
  } catch (error) {
    console.error("Error in joinPost:", error);
    res.status(500).send("Internal Server Error");
  }
}

// renders login form
function loginGet(req, res) {
  res.render("login-form", { message: null });
}

// renders homepage for user who has signed up, has joined the club, and has logged in
function loginSuccessGet(req, res) {
  res.render("homepage", {
    message: "You successfully logged in.",
    signedUp: true,
    joined: true,
    user: req.user,
  });
}

// renders login form for user who has not signed up and/or not joined the club
function loginFailureGet(req, res) {
  res.render("login-form", {
    message:
      "Login failed. Please ensure you have signed up, joined the club, and try again.",
  });
}

// renders homepage for user who has signed up, has joined the club, and has logged out
function logoutGet(req, res) {
  res.render("homepage", {
    message: "You successfully logged out.",
    signedUp: true,
    joined: true,
    user: null,
  });
}

module.exports = {
  signupPost,
  joinPost,
  loginGet,
  loginSuccessGet,
  loginFailureGet,
  logoutGet,
};
