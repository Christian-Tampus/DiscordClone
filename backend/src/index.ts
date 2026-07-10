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
import path from "path";
import multer from "multer";
import fs from "fs";

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
const storage = multer.diskStorage({
  destination: "imageStorage/",
  filename: (request, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (request, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
});

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
Express Serve Uploaded Files
==================================================
*/
App.use("/imageStorage", express.static(path.join(__dirname,"../imageStorage")));

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
  console.log("checkIfUsernameExists:",checkIfUsernameExists.rows);
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
        error: "[ERROR] Password Is Incorrect!"
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
  const displayName = request.body.displayName;
  const username = request.body.username;
  const password = request.body.password;
  console.log("[SERVER] Request:",request.body);
  const checkIfUsernameExists = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (checkIfUsernameExists.rows.length == 0) {
    const createNewAccount = await PostgreSQLPool.query(
      "INSERT INTO users (displayname, username, password) VALUES ($1, $2, $3) RETURNING *",
      [displayName, username, password]
    );
    response.json(createNewAccount.rows[0]);
    console.log("[SERVER] Created New Account Successfully!");
  } else {
    console.log("[SERVER] Username:",username,"Already Exists!");
    response.status(401).json({
      error: "[ERROR] Username Already Exists!"
    });
  };
});

/*
==================================================
Update User Settings API
==================================================
*/
App.post("/updateUserSettings", async (request, response) => {
  console.log("[SERVER] API: /updateUserSettings");
  const UserSettingsToUpdate = request.body;
  console.log("[SERVER] Request:",request.body);
  if (UserSettingsToUpdate.canUpdateDisplayName == true) {
    await PostgreSQLPool.query(
      "UPDATE users SET displayname = $1 WHERE username = $2",
      [UserSettingsToUpdate.displayName, UserSettingsToUpdate.username]
    );
    console.log("[SERVER] Update Display Name!");
  };
  if (UserSettingsToUpdate.canUpdateBiography == true) {
    await PostgreSQLPool.query(
      "UPDATE users SET biography = $1 WHERE username = $2",
      [UserSettingsToUpdate.biography, UserSettingsToUpdate.username]
    );
    console.log("[SERVER] Update Biography!");
  };
  if (UserSettingsToUpdate.canUpdatePassword == true) {
    await PostgreSQLPool.query(
      "UPDATE users SET password = $1 WHERE username = $2",
      [UserSettingsToUpdate.password, UserSettingsToUpdate.username]
    );
    console.log("[SERVER] Update Password!");
  };
  if (UserSettingsToUpdate.canUpdateStatus == true) {
    await PostgreSQLPool.query(
      "UPDATE users SET status = $1 WHERE username = $2",
      [UserSettingsToUpdate.status, UserSettingsToUpdate.username]
    );
    console.log("[SERVER] Update Status!");
  };
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [UserSettingsToUpdate.username]
  );
  response.json(returnUserData.rows[0]);
  console.log(returnUserData.rows[0]);
  console.log("[SERVER] Updated User Settings Successfully!");
});

/*
==================================================
Update User Profile Picture API
==================================================
*/
App.post("/updateProfilePicture", upload.single("userProfilePicture"), async (request, response) => {
  console.log("[SERVER] API: /updateProfilePicture");
  if (!request.file) {
    response.status(400).json({
      error: "[ERROR] No Image Uploaded To Update User Profile Picture!"
    });
    return;
  };
  const oldUserProfilePicture = await PostgreSQLPool.query(
    "SELECT profile_picture FROM users WHERE username = $1",
    [request.body.username]
  );
  const oldUserProfilePicturePath = oldUserProfilePicture.rows[0]?.profile_picture;
  if (oldUserProfilePicturePath) {
    const fullPath = path.join(__dirname, "..", oldUserProfilePicturePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("[SERVER] Deleted Old User Profile Picture!");
    };
  };
  const imagePath = "/imageStorage/" + request.file.filename;
  await PostgreSQLPool.query(
    "UPDATE users SET profile_picture = $1 WHERE username = $2",
    [imagePath, request.body.username]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  response.json(returnUserData.rows[0]);
  console.log("[SERVER] Updated User Profile Picture Successfully!");
});

/*
==================================================
Create New Server API
==================================================
*/
App.post("/createNewServer", upload.single("serverIcon"), async (request, response) => {
  console.log("[SERVER] API: /createNewServer");
  if (!request.file) {
    response.status(400).json({
      error: "[ERROR] Failed To Create New Server!"
    });
    return;
  };
  const serverName = request.body.serverName;
  const serverIcon = "/imageStorage/" + request.file.filename;
  const serverId = "SERVER-" + request.body.serverOwner + "-" + Date.now();
  const serverOwner = request.body.serverOwner;
  await PostgreSQLPool.query(
    "INSERT INTO servers (server_name, server_icon, server_id, server_owner) VALUES ($1, $2, $3, $4) RETURNING *",
    [serverName, serverIcon, serverId, serverOwner]
  );
  /*
  INSERT SERVER DATA INTO USERS!
  INSERT SERVER DATA INTO USERS!
  INSERT SERVER DATA INTO USERS!
  INSERT SERVER DATA INTO USERS!
  INSERT SERVER DATA INTO USERS!

  REMEMBER TO CLEAR SERVER WITH TRUNCATE TABLE users;
  REMEMBER TO CLEAR SERVER WITH TRUNCATE TABLE users;
  REMEMBER TO CLEAR SERVER WITH TRUNCATE TABLE users;
  REMEMBER TO CLEAR SERVER WITH TRUNCATE TABLE users;
  REMEMBER TO CLEAR SERVER WITH TRUNCATE TABLE users;

  ADD SERVER LIMIT OF 10 PER USER!
  ADD SERVER LIMIT OF 10 PER USER!
  ADD SERVER LIMIT OF 10 PER USER!
  ADD SERVER LIMIT OF 10 PER USER!
  ADD SERVER LIMIT OF 10 PER USER!
  */
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.serverOwner]
  );
  response.json(returnUserData.rows[0]);
  console.log("[SERVER] Created New Server Successfully!");
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