// imports required dependencies
// express - minimal, flexible web framework for Node.js
const express = require("express");
// PostgreSQL database client for Node.js
const pg = require("pg");
// middleware for managing user sessions
const session = require("express-session");
// middleware for handling authentication
const passport = require("passport");
// PostgreSQL connection pool
const pool = require("./db/pool");
// connects PostgreSQL as a session store
const pgSession = require("connect-pg-simple")(session);

// GENERAL SET UP
// gives access to variables set in .env via `process.env.VARIABLE_NAME`
require("dotenv").config();

// instantiates Express app
const app = express();

// sets view engine and template directory
const path = require("node:path");
// views/ is the directory where EJS templates are stored
app.set("views", path.join(__dirname, "views"));
// tells Express to use EJS for rendering views
app.set("view engine", "ejs");

// middleware for parsing HTTP request data
/* parses incoming JSON request bodies used for API endpoints 
API endpoints - specific URL where a client sends a request to access data or services */
app.use(express.json());
/* parses URL-encoded form data used for POST form submissions 
URL-encoded form data - way of sending form inputs as key-value pairs in an HTTP request body */
app.use(express.urlencoded({ extended: true }));

// SESSION SETUP - middleware for sessions, PostgreSQL instead of memory as session store
// ensures user stays logged in across requests
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    // used to encrypt session data
    secret: process.env.SECRET,
    // prevents saving session if nothing changed
    resave: false,
    // creates sessions for all visitors (even unauthenticated)
    saveUninitialized: true,
    // sets session duration at 24 hours
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// PASSPORT AUTHENTICATION
// imports Passport.js authentication configuration
require("./config/passport");
/* restores req.user from the session on every request
allows persistent login sessions */
app.use(passport.session());

app.use((req, res, next) => {
  /* req.user contains logged-in user's data if authenticated
  res.locals.user makes user available in all EJS templates */
  res.locals.user = req.user;
  next();
});

/*
app.use((req, res, next) => {
  // console.log(req.session);
  console.log(req.user);
  next();
});
*/

// ROUTES
// imports route handlers for member actions and authentication
const membersRouter = require("./routes/membersRouter");
const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");

// defines / route and registers membersRouter middleware
app.use("/", membersRouter);
// defines / route and registers messagesRouter middleware
app.use("/", messagesRouter);
// defines / route and registers authRouter middleware
app.use("/", authRouter);

// SERVER - starts it
app.listen(3000);
