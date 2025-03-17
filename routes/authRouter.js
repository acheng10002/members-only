// imports Router() and instantiates it in authRouter that will hold authentication-related routes
const { Router } = require("express");
const authRouter = Router();
// handles login and session authentication
const passport = require("passport");
/* authController has functions that handles requests for login (GET and POST), signup (just POST), 
and logout (just GET) */
const authController = require("../controllers/authController");
// middleware that validates and sanitizes user input before the request reaches .signupPost
const signupValidation = require("../middlewares/signupValidation");

// GET ROUTES
// handles GET request for login
authRouter.get("/login", authController.loginGet);
// handles GET request for login success
authRouter.get("/login-success", authController.loginSuccessGet);
// handles GET request for login failure
authRouter.get("/login-failure", authController.loginFailureGet);
// handles GET request for logout
authRouter.get("/logout", authController.logoutGet);

// POST ROUTES
// handles POST request for signup, validates user input, and handles user registration
authRouter.post("/sign-up", signupValidation, authController.signupPost);

/* handles POST request for joining club, allows a signed-up user to join the club if they input 
the secretPasscode */
authRouter.post("/join", authController.joinPost);

/* POST request is sent to /login (user submits login form) 
5. LOGIN-FORM CREATED USING PASSPORT.JS */
authRouter.post(
  "/login",
  // passport.authenticate("local") executes the local strategy (verifyCallback)
  passport.authenticate("local", {
    // if authentication fails, user is redirected to /login-failure
    failureRedirect: "/login-failure",
    // if authentication succeeds, req.user is set and user is redirected to /login-success
    successRedirect: "/login-success",
  })
);

module.exports = authRouter;
