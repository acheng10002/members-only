// imports Router() and instantiates it in membersRouter that will hold members-related routes
const { Router } = require("express");
const membersRouter = Router();
/* membersController has functions that handles requests for displaying the homepage, signup 
form, join form, and admin access form (GET) */
const membersController = require("../controllers/membersController");

// handles GET request for displaying the homepage
membersRouter.get("/", membersController.homepageGet);

// handles GET request for displaying the signup form
membersRouter.get("/sign-up", membersController.signupGet);

// handles GET request for displaying the join form
membersRouter.get("/join", membersController.joinGet);

// handles GET and POST requests for admin access
membersRouter.get("/login-success/admin", membersController.adminAccessGet);
membersRouter.post("/login-success/admin", membersController.adminAccessPost);

module.exports = membersRouter;
