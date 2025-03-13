const db = require("../models/queries");

// renders homepage for user that has not signed up, not joined, and not logged in
function homepageGet(req, res) {
  res.render("homepage", {
    message: null,
    signedUp: false,
    joined: false,
    user: null,
  });
}

// renders signup form
function signupGet(req, res) {
  res.render("signup-form", { message: null });
}

// renders join club form
function joinGet(req, res) {
  res.render("join-form", { message: null });
}

module.exports = {
  homepageGet,
  signupGet,
  joinGet,
};
