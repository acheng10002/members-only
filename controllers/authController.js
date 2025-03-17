// extracts validation errors from the request
const { validationResult } = require("express-validator");
// imports database queries
const db = require("../models/queries");
const { getUserContext } = require("../models/helpers");

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
    const userContext = await getUserContext(username);
    /* renders homepage.ejs with dynamic data 
    9. NON-MEMBERS CANNOT SEE AUTHOR AND DATE OF EACH MESSAGE */
    res.render("homepage", {
      message: "You have successfully signed up!", // a success message
      // no user session set yet (they need to log in)
      user: null,
      ...userContext,
      // successful signup flag for UI logic
      // user has not joined the club yet
    });
    /* if db.createUser fails (e.g. duplicate username, DB connection issue), 
  logs the error and sends a 500 response */
  } catch (error) {
    console.error("Error saving User:", error);
    res.status(500).send("Internal Server Error");
  }
}

/* handles POST request for user joining club 
4. MEMBERS CAN JOIN THE CLUB BY ENTERING A SECRET PASSCODE */
async function joinPost(req, res) {
  // destructures/extracts user input (form data) from request body
  const { username, password, secretPasscode } = req.body;
  try {
    /* calls findUserForJoining from queries.js, passing it user details */
    const foundUser = await db.findUserForClubOrAdminAccess(username, password);
    /* if no user object found, return 401 response, unauthorized 
    user is not authenticated and request is missing or has invalid credentials */
    if (!foundUser) {
      return res.status(401).send("Invalid username or password");
    }
    /* if user secretPasscode input is wrong, return 403 response, forbidden 
    user is authenticated but does not have permission to access the resource */
    if (secretPasscode !== process.env.SECRET_PASSCODE.replace(/_/g, " ")) {
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
    const userContext = await getUserContext(username);
    // renders homepage.ejs with dynamic data
    res.render("homepage", {
      message: "You have successfully joined the club!",
      // user has become a member but has not logged in
      user: null,
      ...userContext,
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
async function loginSuccessGet(req, res) {
  const userContext = await getUserContext(req.user.username);
  console.log(req.user);
  res.render("homepage", {
    message: "You successfully logged in.",
    // req.user is available bc they're logged in
    user: req.user,
    ...userContext,
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
async function logoutGet(req, res) {
  const userContext = await getUserContext(req.user.username);
  res.render("homepage", {
    message: "You successfully logged out.",
    // user not logged in
    user: null,
    ...userContext,
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
