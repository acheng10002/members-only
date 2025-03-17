const db = require("../models/queries");
const { getUserContext } = require("../models/helpers");

// renders homepage for user that has not signed up, not joined, and not logged in
async function homepageGet(req, res) {
  const messages = await db.getAllMessages();
  return res.render("homepage", {
    message: null,
    // no user logged in
    user: null,
    messages,
    signedUp: false,
    hasJoined: false,
    isAdmin: false,
  });
}

// renders signup form
function signupGet(req, res) {
  return res.render("signup-form", { message: null });
}

// renders join club form
function joinGet(req, res) {
  return res.render("join-form", { message: null });
}

/* renders admin access form 
8. SECRET PASSCODE PAGE TO MARK A USER AS ADMIN */
function adminAccessGet(req, res) {
  return res.render("admin-form", { message: null });
}

/* handles POST request for user getting admin access 
9. GRANTS ADMIN ACCESS WITH ABILITY TO DELETE MESSAGES */
async function adminAccessPost(req, res) {
  // destructures/extracts user input (form data) from request body
  const { adminPasscode } = req.body;
  try {
    if (adminPasscode !== process.env.ADMIN_PASSCODE) {
      return res.status(403).send("Incorrect admin passcode");
    }
    // calls grantAdminAccess from queries, passing it username
    const adminAccessSuccess = await db.grantAdminAccess(req.user.username);
    /* if grantAdminAccess returns false or an exception is thrown in the
    try block (database error), return 500 response, something went wrong on the 
    server while processing the request */
    if (!adminAccessSuccess) {
      return res.status(500).send("Failed to update admin status");
    }
    const userContext = await getUserContext(req.user.username);
    // renders homepage.ejs with dynamic data
    res.render("homepage", {
      message: "You have successfully gained admin access!",
      // user logged in, so req.user available
      user: req.user,
      ...userContext,
    });
    // logs the error and sends a 500 response
  } catch (error) {
    console.error("Error in adminAccessPost:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  homepageGet,
  signupGet,
  joinGet,
  adminAccessGet,
  adminAccessPost,
};
