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
import { Server } from "http";

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
    };
  }
});

/*
==================================================
Retrieve Server Data
==================================================
*/
async function GetServerData(servers) {
  let serverDataArray = [];
  for (let index = 0; index < servers.length; index++) {
    const serverData = await PostgreSQLPool.query(
      "SELECT * FROM servers WHERE server_id = $1",
      [servers[index]]
    );
    serverDataArray.push(serverData.rows[0]);
  };
  return serverDataArray;
};

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
      let userData = checkIfPasswordIsCorrect.rows[0];
      userData.serverData = await GetServerData(userData.servers);
      response.json(userData);
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
    let userData = createNewAccount.rows[0];
    userData.serverData = await GetServerData(userData.servers);
    response.json(userData);
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
  let userData = returnUserData.rows[0];
  userData.serverData = await GetServerData(userData.servers);
  response.json(userData);
  console.log("[SERVER] User Data:", userData);
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
  let userData = returnUserData.rows[0];
  userData.serverData = await GetServerData(userData.servers);
  response.json(userData);
  console.log("[SERVER] Updated User Profile Picture Successfully!");
});

/*
==================================================
Create New Server API
==================================================
*/
App.post("/createNewServer", upload.single("serverIcon"), async(request, response, next) => {
  console.log("[SERVER] API: /createNewServer");
  const getUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.serverOwner]
  );
  const userData = getUserData.rows[0];
  if (userData.number_of_servers >= 10) {
    if (request.file) {
      fs.unlinkSync(request.file.path);
      console.log("[SERVER] Deleted The Server Icon File!");
    };
    response.status(400).json({
      error: "[ERROR] You Have Reached The Maximum Amount Of Servers [10] To Be In!"
    })
    console.log("[SERVER] User:", userData.username, "Reached The Maximum Amount Of Servers [10]!");
    return;
  };
  if (!request.file) {
    response.status(400).json({
      error: "[ERROR] Failed To Create New Server!"
    });
    return;
  };
  const serverName = request.body.serverName;
  const serverIcon = "/imageStorage/" + request.file.filename;
  const serverId = "SERVER-" + request.body.serverOwner + "-" + serverName + "-" + Date.now();
  const serverOwner = request.body.serverOwner;
  await PostgreSQLPool.query(
    "INSERT INTO servers (server_name, server_icon, server_id, server_owner) VALUES ($1, $2, $3, $4) RETURNING *",
    [serverName, serverIcon, serverId, serverOwner]
  );
  await PostgreSQLPool.query(
    "UPDATE users SET servers = array_append(servers, $1) WHERE username = $2",
    [serverId, request.body.serverOwner]
  );
  await PostgreSQLPool.query(
    "UPDATE users SET number_of_servers = $1 WHERE username = $2",
    [userData.number_of_servers + 1, serverOwner]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [serverOwner]
  );
  let updatedUserData = returnUserData.rows[0];
  updatedUserData.serverData = await GetServerData(updatedUserData.servers);
  response.json(updatedUserData);
  console.log("[SERVER] Created New Server Successfully!");
});

/*
==================================================
Update Server Settings API
==================================================
*/
App.post("/updateServerSettings", async (request, response) => {
  console.log("[SERVER] API: /updateServerSettings");
  const ServerSettingsToUpdate = request.body;
  if (ServerSettingsToUpdate.canUpdateServerName == true) {
    await PostgreSQLPool.query(
      "UPDATE servers SET server_name = $1 WHERE server_id = $2",
      [ServerSettingsToUpdate.serverName, ServerSettingsToUpdate.serverId]
    );
    console.log("[SERVER] Update Server Name!");
  };
  if (ServerSettingsToUpdate.canUpdateServerDescription == true) {
    await PostgreSQLPool.query(
      "UPDATE servers SET server_description = $1 WHERE server_id = $2",
      [ServerSettingsToUpdate.serverDescription, ServerSettingsToUpdate.serverId]
    );
    console.log("[SERVER] Update Server Description!");
  };
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [ServerSettingsToUpdate.username]
  );
  let updatedUserData = returnUserData.rows[0];
  updatedUserData.serverData = await GetServerData(updatedUserData.servers);
  response.json(updatedUserData);
  console.log("[SERVER] Updated Server Settings Successfully!");
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