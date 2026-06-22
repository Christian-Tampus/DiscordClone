/*
==================================================
Program Start
==================================================
*/
console.log("[SYSTEM MESSAGE] index.ts Program Start!");

/*
==================================================
Dependencies
==================================================
*/
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool, Result } from "pg";

/*
==================================================
Constants
==================================================
*/
const PORT = process.env.PORT || 5000;
dotenv.config();
const App = express();
App.use(cors());
App.use(express.json());

/*
==================================================
PostgreSQL Connection
==================================================
*/
const PostgreSQLPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/*
==================================================
Test Route
==================================================
*/
App.get("/", (request, response) => {
  response.send("[SERVER] Back End Is Running!");
});

/*
==================================================
Login API
==================================================
*/
App.post("/login", async (request, response) => {
  console.log("[SERVER] API: /login");
  console.log("[SERVER] Request:",request.body);
  const username = request.body.username;
  const password = request.body.password;
  const checkIfUsernameExists = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (checkIfUsernameExists.rows.length > 0) {
    console.log("[SERVER] Username:",username,"Exists!");
    const checkIfPasswordIsCorrect = await PostgreSQLPool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (checkIfPasswordIsCorrect.rows.length > 0) {
      console.log("[SERVER] Rows:",checkIfPasswordIsCorrect.rows);
      response.json(checkIfPasswordIsCorrect.rows[0]);
    } else {
      console.log("[SERVER] Password:",password,"Is Incorrect!");
      response.status(401).json({
        error: "[ERROR] Username Is Incorrect!"
      });
    };
  } else {
    console.log("[SERVER] Username:",username,"Does Not Exist!");
    response.status(401).json({
      error: "[ERROR] Username Does Not Exist!"
    });
  };
});

/*
==================================================
Create Account API
==================================================
*/
App.post("/createAccount", async (request, response) => {
  console.log("[SERVER] API: /createAccount");
  console.log("[SERVER] Request:",request.body);
  const displayName = request.body.displayName;
  const username = request.body.username;
  const password = request.body.password;
  const checkIfUsernameExists = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (checkIfUsernameExists.rows.length == 0) {
    const createNewAccount = await PostgreSQLPool.query(
      "INSERT INTO users (displayName, username, password) VALUES ($1, $2, $3) RETURNING *",
      [displayName, username, password]
    );
    response.json(createNewAccount.rows[0]);
  } else {
    console.log("[SERVER] Username:",username,"Already Exists!");
    response.status(401).json({
      error: "[ERROR] Username Already Exists!"
    });
  };
});

/*
==================================================
Example Database Route
==================================================
*/
App.get("/users", async (request, response) => {
  const result = await PostgreSQLPool.query("SELECT NOW()");
  response.json(result.rows);
});

/*
==================================================
Port To Listen
==================================================
*/
App.listen(PORT, () => {
  console.log("[SERVER] Server Running On Port:",PORT);
});

/*
==================================================
Program End
==================================================
*/
console.log("[SYSTEM MESSAGE] index.ts Program End!");