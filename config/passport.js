// imports necessary dependencies
// manages user authentication
const passport = require("passport");
// handles username/password authentication
const LocalStrategy = require("passport-local").Strategy;
/* findMemberForLogin checks if the user exists and credentials are correct
findUserByStatus fetches a user by username and mem_status */
const { findMemberForLogin, findUserByStatus } = require("../models/queries");

/* verifyCallback - authentication logic function used by Passport.js when a
                    user tries to log in */
const verifyCallback = async (username, password, done) => {
  try {
    /* calls findMemberForLogin to check credentials and mem_status 
    (looks up user and compares the password) */
    const result = await findMemberForLogin(username, password);

    if (!result.success) {
      /* if authentication fails, calls the following 
      done() - callback provided by Passport.js that signals the completion of
               an authentication process
               tells Passport whether authentication was successful or failed 
               and what data should be passed along 
      done(error, user, info) 
      error - null if no error or an error object
      user - authenticated user object, null/false if authentication failed 
      info - optional object with extra details about the authentication result */
      return done(null, false, { message: result.message });
    }
    // if authentication succeeds, calls the following
    return done(null, result.user);
    // catches and handles error
  } catch (error) {
    console.error("Error in verifyCallback:", error);
    return done(error);
  }
};

// creates a new LocalStrategy using verifyCallback
const strategy = new LocalStrategy(verifyCallback);

/* registers the strategy with passport.use(), allowing it to be used
in passport.authenticate("local") */
passport.use(strategy);

/* serializeUser and deserializeUser manage session persistence
serializeUser - controls how user data is stored in a session 
runs when the user logs in (after done(null, user) is called in authentication) 
passport receives the full user object from verifyCallback 
serializeUser stores only user.username in the session */
passport.serializeUser((user, done) => {
  /* - stores only the username in the session, not the entire user object; 
  this reduces session storage size 
  - then calls done(), null for no error and user.username puts only
  the username in the session
  {
    "passport": {
      "user": "john.doe@example.com"
    }
  } */
  done(null, user.username);
});

/* deserializeUser controls how user data is retrieved on subsequent requests 
runs on every request after the user logs in 
passport retrieves username from the session 
deserializeUser retrieves the full user details for use in routes and attaches 
it to req.user */
passport.deserializeUser(async (username, done) => {
  try {
    // fetches user from the database
    const user = await findUserByStatus(username, true);
    /* if no user is found, null for no error and false for no user 
    user session invalid */
    if (!user) return done(null, false);
    /* if the user is found, null for no error and user object 
    the full user object is attached to req.user
    {
      "id": 1,
      "first_name": "John",
      "last_name": Doe,
      "username": "john.doe@example.com",
      "mem_status": true
    }*/
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
