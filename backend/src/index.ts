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
import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool, Result } from "pg";
import path from "path";
import multer from "multer";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import { channel } from "diagnostics_channel";

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
const httpServer = createServer(App);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
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
Emitter To Get Latest Data
==================================================
*/
function EmitAllClients(serverIdArray, username) {
  for (let index = 0; index < serverIdArray.length; index++) {
    io.to(serverIdArray[index]).emit("retrieveLatestData", {
      usernameToIgnore: username
    });
  };
};

/*
==================================================
Retrieve Server Data
==================================================
*/
async function RetrieveServerData(servers) {
  let serverDataArray = [];
  for (let index = 0; index < servers.length; index++) {
    const serverData = await PostgreSQLPool.query(
      "SELECT * FROM servers WHERE server_id = $1",
      [servers[index]]
    );
    let currentServerData = serverData.rows[0];
    currentServerData.channelsData = [];
    for (let channelIndex = 0; channelIndex < serverData.rows[0].server_channel_array.length; channelIndex++) {
      const channelId = serverData.rows[0].server_channel_array[channelIndex];
      const channelData = await PostgreSQLPool.query(
        "SELECT * FROM channels WHERE channel_id = $1",
        [channelId]
      );
      currentServerData.channelsData.push(channelData.rows[0]);
    };
    currentServerData.rolesData = [];
    for (let roleIndex = 0; roleIndex < serverData.rows[0].server_roles_array.length; roleIndex++) {
      const roleId = serverData.rows[0].server_roles_array[roleIndex];
      const roleData = await PostgreSQLPool.query(
        "SELECT * FROM roles WHERE role_id = $1",
        [roleId]
      );
      currentServerData.rolesData.push(roleData.rows[0]);
    };
    currentServerData.server_members_array_data = [];
    for (let memberIndex = 0; memberIndex < serverData.rows[0].server_members_array.length; memberIndex++) {
      const memberUsername = serverData.rows[0].server_members_array[memberIndex];
      const memberData = await PostgreSQLPool.query(
        "SELECT * FROM users WHERE username = $1",
        [memberUsername]
      );
      const getMemberRoles = await PostgreSQLPool.query(
        "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
        [servers[index], memberData.rows[0].username]
      );
      let current_roles_array = [];
      let roleTextColor = "white";
      if (getMemberRoles.rows.length == 1) {
        for (let role_index = 0; role_index < getMemberRoles.rows[0].member_roles_array.length; role_index++) {
        const getRole = await PostgreSQLPool.query(
          "SELECT * FROM roles WHERE role_id = $1",
          [getMemberRoles.rows[0].member_roles_array[role_index]]
        );
        if (getRole.rows.length == 1) {
          current_roles_array.push(getRole.rows[0]);
        };
      };
      };
      current_roles_array.sort((roleDataA: any, roleDataB: any) => roleDataA.role_rank - roleDataB.role_rank);
      if (current_roles_array.length > 0) {
        roleTextColor = current_roles_array[0].role_color;
      };
      const memberDataTable = {
        displayname: memberData.rows[0].displayname,
        username: memberData.rows[0].username,
        biography: memberData.rows[0].biography,
        status: memberData.rows[0].status,
        profile_picture: memberData.rows[0].profile_picture,
        roles_array: current_roles_array,
        text_color: roleTextColor,
      };
      currentServerData.server_members_array_data.push(memberDataTable);
    };
    serverDataArray.push(currentServerData);
  };
  return serverDataArray;
};

/*
==================================================
Retrieve Message Data
==================================================
*/
async function RetrieveMessageData(channelId) {
  const currentChannelMessagesArray = await PostgreSQLPool.query(
    "SELECT id, messages_channel_id, messages_username, messages_message, TO_CHAR(messages_created_at, 'MM-DD-YYYY HH12:MI AM') as messages_created_at FROM messages WHERE messages_channel_id = $1 ORDER BY id ASC",
    [channelId]
  );
  const messagesArray = currentChannelMessagesArray.rows;
  for (let index = 0; index < messagesArray.length; index++) {
    const getMessageSenderData = await PostgreSQLPool.query(
      "SELECT displayname, username, biography, status, profile_picture FROM users WHERE username = $1",
      [messagesArray[index].messages_username]
    );
    messagesArray[index].message_sender_data = getMessageSenderData.rows[0];
  };
  return messagesArray;
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
Retrieve Latest Data API
==================================================
*/
App.post("/retrieveLatestData", async(request, response) => {
  console.log("[SERVER] API: /retrieveLatestData");
  console.log("REQUEST BODY:", request.body);
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  console.log("[SERVER] Retrieved Latest Data Successfully!");
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
      userData.serverData = await RetrieveServerData(userData.servers);
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
    userData.serverData = await RetrieveServerData(userData.servers);
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
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  if (request.body.channelId != "") {
    const getMessagesData = await RetrieveMessageData(request.body.channelId);
    io.to(request.body.channelId).emit("recieveMessage", getMessagesData, request.body.channelId);
  };
  EmitAllClients(userData.servers, userData.username);
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
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
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
    "UPDATE servers SET server_members_array = array_append(server_members_array, $1) WHERE server_id = $2",
    [serverOwner, serverId]
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
  updatedUserData.serverData = await RetrieveServerData(updatedUserData.servers);
  response.json(updatedUserData);
  EmitAllClients(userData.servers, userData.username);
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
  updatedUserData.serverData = await RetrieveServerData(updatedUserData.servers);
  response.json(updatedUserData);
  EmitAllClients(updatedUserData.servers, updatedUserData.username);
  console.log("[SERVER] Updated Server Settings Successfully!");
});

/*
==================================================
Update Server Settings Icon & Thumbnail API
==================================================
*/
App.post("/updateServerImages", upload.fields([
  {name: "serverIcon", maxCount: 1},
  {name: "serverThumbnail", maxCount: 1}
]), async (request, response) => {
  console.log("[SERVER] API: /updateServerImages");
  const serverImageFiles = request.files as {
    serverIcon?: Express.Multer.File[];
    serverThumbnail?: Express.Multer.File[];
  };
  const serverIcon = serverImageFiles.serverIcon?.[0];
  const serverThumbnail = serverImageFiles.serverThumbnail?.[0];
  if (!serverIcon && !serverThumbnail) {
    response.status(400).json({
      error: "[ERROR] No Images Uploaded To Update Server Icon Or Thumbnail!"
    });
    return;
  };
  if (serverIcon) {
    const oldServerIcon = await PostgreSQLPool.query(
      "SELECT server_icon FROM servers WHERE server_id = $1",
      [request.body.serverId]
    );
    const oldServerIconPath = oldServerIcon.rows[0]?.server_icon;
    if (oldServerIconPath) {
      const oldServerIconFullPath = path.join(__dirname, "..", oldServerIconPath);
      if (fs.existsSync(oldServerIconFullPath)) {
        fs.unlinkSync(oldServerIconFullPath);
        console.log("[SERVER] Deleted Old Server Icon Image!");
      };
    };
    const newServerIconImagePath = "/imageStorage/" + serverIcon?.filename;
    await PostgreSQLPool.query(
      "UPDATE servers SET server_icon = $1 WHERE server_id = $2",
      [newServerIconImagePath, request.body.serverId]
    );
    console.log("[SERVER] Updated Server Icon Image For ServerId:", request.body.serverId);
  };
  if (serverThumbnail) {
    const oldServerThumbnail = await PostgreSQLPool.query(
      "SELECT server_thumbnail FROM servers WHERE server_id = $1",
      [request.body.serverId]
    );
    const oldServerThumbnailPath = oldServerThumbnail.rows[0]?.server_thumbnail;
    if (oldServerThumbnailPath) {
      const oldServerThumbnailFullPath = path.join(__dirname, "..", oldServerThumbnailPath);
      console.log("oldServerThumbnailFullPath:",oldServerThumbnailFullPath);
      if (fs.existsSync(oldServerThumbnailFullPath)) {
        fs.unlinkSync(oldServerThumbnailFullPath);
        console.log("[SERVER] Deleted Old Server Thumbnail Image!");
      };
    };
    const newServerThumbnailImagePath = "/imageStorage/" + serverThumbnail?.filename;
    console.log("newServerThumbnailImagePath:",newServerThumbnailImagePath);
    await PostgreSQLPool.query(
      "UPDATE servers SET server_thumbnail = $1 WHERE server_id = $2",
      [newServerThumbnailImagePath, request.body.serverId]
    );
    console.log("[SERVER] Updated Server Thumbnail IMage For ServerId:", request.body.serverId);
  };
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
  console.log("[SERVER] Updated Server Image Settings (Icon & Thumbnail) Successfully!");
});

/*
==================================================
Create New Channel API
==================================================
*/
App.post("/createNewChannel", async (request, response) => {
  console.log("[SERVER] API: /createNewChannel");
  const serverId = request.body.serverId;
  const username = request.body.username;
  const channelName = request.body.channelName;
  const channelDescription = request.body.channelDescription;
  const getCurrentServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [serverId]
  );
  const serverData = getCurrentServerData.rows[0];
  if (serverData.server_owner != username) {
    console.log("[SERVER] Username:", username, " Cannot Create A New Channel Since They Are Not The Server Owner!");
    response.status(401).json({
      error: "[ERROR] You Cannot Create A New Channel Since You Are Not The Server Owner!"
    });
    return;
  };
  if (serverData.server_channels >= 10) {
    console.log("[SERVER] This Server Reached The Maximum Channel Count Of 10!");
    response.status(401).json({
      error: "[ERROR] This Server Reached The Maximum Channel Count Of 10!"
    });
    return;
  };
  const channelId = serverId + "-Channel-[" + (serverData.server_channels + 1) + "]-" + Date.now();
  await PostgreSQLPool.query(
    "UPDATE servers SET server_channel_array = array_append(server_channel_array, $1) WHERE server_id = $2",
    [channelId, serverId]
  );
  await PostgreSQLPool.query(
    "UPDATE servers SET server_channels = $1 WHERE server_id = $2",
    [serverData.server_channels + 1, serverId]
  );
  await PostgreSQLPool.query(
    "INSERT INTO channels (channel_id, channel_name, channel_description) VALUES ($1, $2, $3) RETURNING *",
    [channelId, channelName, channelDescription]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
  console.log("[SERVER] Created New Channel Successfully!");
});

/*
==================================================
Update Channel API
==================================================
*/
App.post("/updateChannelSettings", async (request, response) => {
  console.log("[SERVER] API: /updateChannelSettings");
  const userName = request.body.username;
  const serverId = request.body.serverId;
  const channelId = request.body.channelId;
  const channelName = request.body.channelName;
  const channelDescription = request.body.channelDescription;
  const checkIfUserIsServerOwner = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [serverId]
  );
  const serverData = checkIfUserIsServerOwner.rows[0];
  if (serverData.server_owner != userName) {
    console.log("[SERVER] User:", userName, " Does Not Have Permission To Edit This Channel!");
    response.status(401).json({
      error: "[ERROR] You Do Not Have Permission To Edit This Channel!"
    });
   return;
  };
  if (!serverData.server_channel_array.includes(channelId)) {
    console.log("[SERVER] channelId:", channelId, " Does Not Exists In The Server!");
    response.status(401).json({
      error: "[ERROR] Unexpected Error Occured, Channel Does Not Exist In The Server!"
    });
   return;
  };
  if (request.body.canUpdateChannelName == true) {
    await PostgreSQLPool.query(
      "UPDATE channels SET channel_name = $1 WHERE channel_id = $2",
      [channelName, channelId]
    );
    console.log("[SERVER] Updated Channel Name!");
  };
  if (request.body.canUpdateChannelDescription == true) {
    await PostgreSQLPool.query(
      "UPDATE channels SET channel_description = $1 WHERE channel_id = $2",
      [channelDescription, channelId]
    );
    console.log("[SERVER] Updated Channel Description!");
  };
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
  console.log("[SERVER] Updated Channel Successfully!");
});

/*
==================================================
Create New Role API
==================================================
*/
App.post("/createNewRole", async(request, response) => {
  console.log("[SERVER] API: /createNewRole");
  const retrieveCurrentServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [request.body.serverId]
  );
  let serverData = retrieveCurrentServerData.rows[0];
  if (serverData.server_owner != request.body.username) {
    console.log("[SERVER] User Is Not Server Owner And Does Not Have Permission To Create New Roles!");
    response.status(401).json({
      error: "[ERROR] User Is Not Server Owner And Does Not Have Permission To Create New Roles!"
    });
    return;
  };
  if (serverData.server_roles >= 10) {
    console.log("[SERVER] Max Number Of Roles [10] Have Been Reached!");
    response.status(401).json({
      error: "[ERROR] Max Number Of Roles [10] Have Been Reached!"
    });
    return;
  };
  const roleId = request.body.serverId + "-Role-[" + (serverData.server_roles + 1) + "]-" + Date.now();
  await PostgreSQLPool.query(
    "UPDATE servers SET server_roles_array = array_append(server_roles_array, $1), server_roles = $2 WHERE server_id = $3",
    [roleId, serverData.server_roles + 1, request.body.serverId]
  );
  await PostgreSQLPool.query(
    "INSERT INTO roles (role_id, role_server_id, role_name, role_rank, role_color, can_kick_lower_rank_members, can_ban_lower_rank_members, can_edit_lower_rank_member_roles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [roleId, request.body.serverId, request.body.roleName, 0, request.body.roleColor, request.body.canKickLowerRankMembers, request.body.canBanLowerRankMembers, request.body.canEditLowerRankMemberRoles]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
  console.log("[SERVER] Create New Role Successfully!");
});

/*
==================================================
Update Role API
==================================================
*/
App.post("/updateRole", async(request, response) => {
  console.log("[SERVER] API: /updateRole");
  const retrieveCurrentServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [request.body.serverId]
  );
  let serverData = retrieveCurrentServerData.rows[0];
  if (serverData.server_owner != request.body.username) {
    console.log("[SERVER] User Is Not Server Owner And Does Not Have Permission To Update Roles!");
    response.status(401).json({
      error: "[ERROR] User Is Not Server Owner And Does Not Have Permission To Update Roles!"
    });
    return;
  };
  if (request.body.updateRoleName == true) {
    await PostgreSQLPool.query(
      "UPDATE roles SET role_name = $1 WHERE role_id = $2",
      [request.body.roleName, request.body.roleId]
    );
    console.log("[SERVER] Updated Role Name Successfully!");
  };
  if (request.body.updateRoleColor == true) {
    await PostgreSQLPool.query(
      "UPDATE roles SET role_color = $1 WHERE role_id = $2",
      [request.body.roleColor, request.body.roleId]
    );
    console.log("[SERVER] Updated Role Color Successfully!");
  };
  if (request.body.updatedRoleRank == true) {
    await PostgreSQLPool.query(
      "UPDATE roles SET role_rank = $1 WHERE role_id = $2",
      [request.body.roleRank, request.body.roleId]
    );
    console.log("[SERVER] Updated Role Rank Successfully!");
  };
  await PostgreSQLPool.query(
    "UPDATE roles SET can_kick_lower_rank_members = $1, can_ban_lower_rank_members = $2, can_edit_lower_rank_member_roles = $3 WHERE role_id = $4",
    [request.body.canKickLowerRankMembers, request.body.canBanLowerRankMembers, request.body.canEditLowerRankMemberRoles, request.body.roleId]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, userData.username);
  console.log("[SERVER] Updated Role Successfully!");
});

/*
==================================================
Add Role To Member API
==================================================
*/
App.post("/addRoleToMember", async(request, response) => {
  console.log("[SERVER] API: /addRoleToMember");
  let isServerOwner = false;
  const adminUsername = request.body.adminUsername;
  const username = request.body.username;
  const roleId = request.body.roleId;
  const serverId = request.body.serverId;
  const getServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [serverId]
  );
  if (getServerData.rows[0].server_owner == adminUsername) {
    isServerOwner = true;
  };
  const getAdminMemberRoles = await PostgreSQLPool.query(
    "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
    [serverId, adminUsername]
  );
  if (getAdminMemberRoles.rows.length != 1 && isServerOwner == false) {
    console.log("[SERVER] Admin Does Not Have Any Member Roles Data!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Any Member Roles Data!"
    });
    return;
  };
  const adminMemberRolesData = getAdminMemberRoles.rows[0];
  if (adminMemberRolesData.member_roles_array.length <= 0 && isServerOwner == false) {
    console.log("[SERVER] Admin Does Not Have Any Roles In The Member Roles Array!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Any Roles In The Member Roles Array!"
    });
    return;
  };
  const member_roles_array = adminMemberRolesData.member_roles_array;
  const member_roles_array_data = [];
  for (let index = 0; index < member_roles_array.length; index++) {
    const currentRoleData = await PostgreSQLPool.query(
      "SELECT * FROM roles WHERE role_id = $1",
      [member_roles_array[index]]
    );
    member_roles_array_data.push(currentRoleData.rows[0]);
  };
  member_roles_array_data.sort((roleDataA: any, roleDataB: any) => roleDataA.role_rank - roleDataB.role_rank);
  const roleDataToAddToMember = await PostgreSQLPool.query(
    "SELECT * FROM roles WHERE role_id = $1",
    [roleId]
  );
  if (roleDataToAddToMember.rows.length != 1) {
    console.log("[SERVER] Role To Add Does Not Exist!");
    response.status(401).json({
      error: "[ERROR] Role To Add Does Not Exist!"
    });
    return;
  };
  const roleDataToAddToMemberData = roleDataToAddToMember.rows[0];
  let addRoleToMemberBoolean = false;
  for (let index = member_roles_array_data.length - 1; index >= 0; index--) {
    if (member_roles_array_data[index].role_rank > roleDataToAddToMemberData.role_rank && member_roles_array_data[index].can_edit_lower_rank_member_roles == true) {
      addRoleToMemberBoolean = true;
      break;
    };
  };
  if (isServerOwner == true) {
    addRoleToMemberBoolean = true;
  };
  if (addRoleToMemberBoolean == false) {
    console.log("[SERVER] Admin Does Not Have Permission To Add This Role!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Permission To Add This Role!"
    });
    return;
  };
  const checkIfMemberRolesExist = await PostgreSQLPool.query(
    "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
    [serverId, username]
  );
  if (checkIfMemberRolesExist.rows.length != 1) {
    console.log("[SERVER] Intializing Member Roles!");
    await PostgreSQLPool.query(
      "INSERT INTO member_roles (member_roles_server_id, member_roles_username) VALUES ($1, $2) RETURNING *",
      [serverId, username]
    );
  } else {
    console.log("[SERVER] Member Roles Already Exists!");
  };
  const getMemberRoles = await PostgreSQLPool.query(
    "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
    [serverId, username]
  );
  if (getMemberRoles.rows.length != 1) {
    console.log("[ERROR] Member Roles Does Not Exist For Username:", username);
    response.status(401).json({
      error: "[ERROR] Member Roles Does Not Exist For Username:"+ username
    });
    return;
  };
  if (!getMemberRoles.rows[0].member_roles_array.includes(roleId)) {
    console.log("[SERVER] Insert RoleId:", roleId, " Into Array!")
    await PostgreSQLPool.query(
      "UPDATE member_roles SET member_roles_array = array_append(member_roles_array, $1) WHERE member_roles_server_id = $2 AND member_roles_username = $3",
      [roleId, serverId, username]
    );
  } else {
    console.log("[SERVER] Role Already Exist For This Member!");
  };
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, username);
  console.log("[SERVER] Added Role Successfully!");
});

/*
==================================================
Remove Role From Member API
==================================================
*/
App.post("/removeRoleFromMember", async(request, response) => {
  console.log("[SERVER] API: /removeRoleFromMember");
  let isServerOwner = false;
  const adminUsername = request.body.adminUsername;
  const username = request.body.username;
  const roleId = request.body.roleId;
  const serverId = request.body.serverId;
  const getServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [serverId]
  );
  if (getServerData.rows[0].server_owner == adminUsername) {
    isServerOwner = true;
  };
  const getAdminMemberRoles = await PostgreSQLPool.query(
    "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
    [serverId, adminUsername]
  );
  if (getAdminMemberRoles.rows.length != 1 && isServerOwner == false) {
    console.log("[SERVER] Admin Does Not Have Any Member Roles Data!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Any Member Roles Data!"
    });
    return;
  };
  const adminMemberRolesData = getAdminMemberRoles.rows[0];
  if (adminMemberRolesData.member_roles_array.length <= 0 && isServerOwner == false) {
    console.log("[SERVER] Admin Does Not Have Any Roles In The Member Roles Array!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Any Roles In The Member Roles Array!"
    });
    return;
  };
  const member_roles_array = adminMemberRolesData.member_roles_array;
  const member_roles_array_data = [];
  for (let index = 0; index < member_roles_array.length; index++) {
    const currentRoleData = await PostgreSQLPool.query(
      "SELECT * FROM roles WHERE role_id = $1",
      [member_roles_array[index]]
    );
    member_roles_array_data.push(currentRoleData.rows[0]);
  };
  member_roles_array_data.sort((roleDataA: any, roleDataB: any) => roleDataA.role_rank - roleDataB.role_rank);
  const roleDataToRemoveFromMember = await PostgreSQLPool.query(
    "SELECT * FROM roles WHERE role_id = $1",
    [roleId]
  );
  if (roleDataToRemoveFromMember.rows.length != 1) {
    console.log("[SERVER] Role To Remove Does Not Exist!");
    response.status(401).json({
      error: "[ERROR] Role To Remove Does Not Exist!"
    });
    return;
  };
  const roleDataToRemoveFromMemberData = roleDataToRemoveFromMember.rows[0];
  let removeRoleFromMemberBoolean = false;
  for (let index = member_roles_array_data.length - 1; index >= 0; index--) {
    if (member_roles_array_data[index].role_rank >= roleDataToRemoveFromMemberData.role_rank && member_roles_array_data[index].can_edit_lower_rank_member_roles == true) {
      removeRoleFromMemberBoolean = true;
      break;
    };
  };
  if (isServerOwner == true) {
    removeRoleFromMemberBoolean = true;
  };
  if (removeRoleFromMemberBoolean == false) {
    console.log("[SERVER] Admin Does Not Have Permission To Remove This Role!");
    response.status(401).json({
      error: "[ERROR] Admin Does Not Have Permission To Remove This Role!"
    });
    return;
  };
  const checkIfMemberRolesExist = await PostgreSQLPool.query(
    "SELECT * FROM member_roles WHERE member_roles_server_id = $1 AND member_roles_username = $2",
    [serverId, username]
  );
  if (checkIfMemberRolesExist.rows.length == 0) {
    console.log("[SERVER] Member Does Not Have Any Roles!");
    return;
  };
  await PostgreSQLPool.query(
    "UPDATE member_roles SET member_roles_array = array_remove(member_roles_array, $1) WHERE member_roles_server_id = $2 AND member_roles_username = $3",
    [roleId, serverId, username]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, username);
  console.log("[SERVER] Removed Role Successfully!");
});

/*
==================================================
Join Server API
==================================================
*/
App.post("/joinServer", async(request, response) => {
  console.log("[SERVER] API: /joinServer");
  console.log("REQUEST BODY:", request.body);
  const username = request.body.username;
  const joinServerId = request.body.joinServerId;
  const getUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  const currentUserData = getUserData.rows[0];
  if (currentUserData.number_of_servers >= 10) {
    console.log("[SERVER] User Has Reached The Maximum Amount Of Servers [10] To Be In!");
    response.status(400).json({
      error: "[ERROR] You Have Reached The Maximum Amount Of Servers [10] To Be In!"
    });
    console.log("[SERVER] User:", currentUserData.username, "Reached The Maximum Amount Of Servers [10]!");
    return;
  };
  const getCurrentServerData = await PostgreSQLPool.query(
    "SELECT * FROM servers WHERE server_id = $1",
    [joinServerId]
  );
  if (getCurrentServerData.rows.length != 1) {
    console.log("[SERVER] Server Id Does Not Exit!");
    response.status(400).json({
      error: "[ERROR] Server Id Does Not Exit!"
    });
    return;
  };
  if (currentUserData.servers.includes(joinServerId)) {
    console.log("[SERVER] You Are Already In This Server!");
    response.status(400).json({
      error: "[ERROR] You Are Already In This Server!"
    });
    return;
  };
  await PostgreSQLPool.query(
    "UPDATE users SET servers = array_append(servers, $1) WHERE username = $2",
    [joinServerId, username]
  );
  await PostgreSQLPool.query(
    "UPDATE users SET number_of_servers = $1 WHERE username = $2",
    [currentUserData.number_of_servers + 1, username]
  );
  if (getCurrentServerData.rows[0].server_members_array.includes(username)) {
    console.log("[SERVER] Username Is Already Inside server_members_array!");
    response.status(400).json({
      error: "[ERROR] Username Is Already Inside server_members_array!"
    });
    return;
  };
  await PostgreSQLPool.query(
    "UPDATE servers SET server_members_array = array_append(server_members_array, $1) WHERE server_id = $2",
    [username, joinServerId]
  );
  const returnUserData = await PostgreSQLPool.query(
    "SELECT * FROM users WHERE username = $1",
    [request.body.username]
  );
  let userData = returnUserData.rows[0];
  userData.serverData = await RetrieveServerData(userData.servers);
  response.json(userData);
  EmitAllClients(userData.servers, username);
  console.log("[SERVER] Joined Server Successfully!");
});

/*
==================================================
Socket.IO Real Time Chat
==================================================
*/
io.on("connection", (socket) => {
  console.log("[SOCKET] User Connected:", socket.id);
  socket.on("joinChannel", async (channelId) => {
    socket.join(channelId);
    console.log("[SOCKET] Joined Channel:", channelId);
    const getMessagesData = await RetrieveMessageData(channelId);
    io.to(channelId).emit("recieveMessage", getMessagesData, channelId);
  });
  socket.on("joinServer", async(serverId) => {
    socket.join(serverId);
    console.log("[SOCKET] Joined Server:", serverId);
  })
  socket.on("sendMessage", async(messageData) => {
    console.log("[SOCKET] Message:", messageData);
    if (messageData.isEditingMessage == false) {
      await PostgreSQLPool.query(
        "INSERT INTO messages (messages_channel_id, messages_username, messages_message) VALUES ($1, $2, $3) RETURNING *",
        [messageData.channelId, messageData.username, messageData.message]
      );
      console.log("[SOCKET] New Message Created Successfully!");
    } else if (messageData.isEditingMessage == true && messageData.editedMessageId != null) {
      await PostgreSQLPool.query(
        "UPDATE messages SET messages_message = $1 WHERE id = $2 AND messages_username = $3",
        [messageData.message, messageData.editedMessageId, messageData.username]
      );
      console.log("[SOCKET] Message Updated Successfully!");
    };
    const getMessagesData = await RetrieveMessageData(messageData.channelId);
    io.to(messageData.channelId).emit("recieveMessage", getMessagesData, messageData.channelId);
  });
  socket.on("disconnect", () => {
    console.log("[SOCKET] User Disconnected:", socket.id);
  });
});

/*
==================================================
HTTPServer Listen To Port
==================================================
*/
httpServer.listen(PORT, () => {
  console.log("[SERVER] Server Running On Port:",PORT);
});

/*
==================================================
Program End
==================================================
*/
console.log("[SYSTEM MESSAGE] index.ts Program End!");