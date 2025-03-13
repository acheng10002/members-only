const { Router } = require("express");
const memberRouter = Router();
const memberController = require("../controllers/memberController");

// GET ROUTES
// handles GET request for displaying the homepage
memberRouter.get("/", memberController.homepageGet);

// handles GET request for displaying the signup form
memberRouter.get("/sign-up", memberController.signupGet);

// handles GET request for displaying the join form
memberRouter.get("/join", memberController.joinGet);

module.exports = memberRouter;
