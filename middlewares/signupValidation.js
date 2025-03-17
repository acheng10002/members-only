// imports body function from middleware for validating and sanitizing request data in Express.js
const { body } = require("express-validator");

/* 3. SIGNUP-FORM FIELDS GETS SANITIZED AND VALIDATED WITH A CUSTOM VALIDATOR FOR THE 
CONFIRMPASSWORD FIELD */
const signupValidationRules = [
  // validates and sanitizes firstName
  body("firstName")
    .trim() // sanitization: removes leading/trailing spaces
    .notEmpty()
    .withMessage("First name is required") // validation: ensures it's not empty
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters") // validation: max length
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage("First name can only contain letters, spaces, and hyphens"), // validation: pattern

  // validates and sanitizes lastName
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 100 })
    .withMessage("Last name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage("Last name can only contain letters, spaces, and hyphens"),

  // validates and sanitizes username
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username/Email is required")
    .isLength({ max: 255 })
    .withMessage("Username/Email cannot exceed 255 characters")
    .isEmail()
    .withMessage("Invalid email format"),

  // validates password
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),

  // custom validation for password confirmation
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

module.exports = signupValidationRules;
