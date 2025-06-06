// loads environment variables
require("dotenv").config();
const fs = require("fs");
/* creates and exports a PostgreSQL connection pool 
2. CONNECTS TO LOCAL POSTGRESQL DATABASE */
const { Pool } = require("pg");

module.exports = new Pool({
  // creates the pool connection to the db
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./db/certs/prod-ca-2021.crt"),
  },
});

/* 1. DATABASE MODELS 
module.exports = new Pool({
  host: "localhost",
  user: "amycheng",
  database: "clubhouse",
  password: "q",
  port: 5432,
});

CREATE TABLE 
Members ( 
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
	first_name VARCHAR(50) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	username VARCHAR(255) NOT NULL UNIQUE, 
        mem_status BOOLEAN DEFAULT FALSE );
	hash TEXT NOT NULL, 
       

CREATE TABLE 
Messages ( 
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
	title VARCHAR(255) NOT NULL, 
	text TEXT NOT NULL, 
	added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	mem_id INTEGER NOT NULL,
	FOREIGN KEY (mem_id) REFERENCES Members(id) ON DELETE CASCADE );
*/
