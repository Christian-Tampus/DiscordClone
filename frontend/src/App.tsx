/*
==================================================
Dependencies
==================================================
*/
import React, {useEffect, useState} from "react";
import DiscordLogo from "./assets/DiscordLogo.jpg";
import WhiteDiscordLogo from "./assets/DiscordWhiteLogo.png";
import GearsIcon from "./assets/GearsIcon.png";
import ExitIcon from "./assets/ExitIcon.png";
import PlaceHolderPFP from "./assets/PlaceHolderPFP.png";
import CreateNewServerIcon from "./assets/PlusIcon.jpg";
import PlaceHolderServerThumbnail from "./assets/PlaceHolderThumbnail.jpg";
import HashTagIcon from "./assets/HashTag.png";
import { io, Socket } from "socket.io-client";
import "./App.css";

/*
==================================================
Global Variables
==================================================
*/
const WEB_SAFE_EMOJIS = [
  '😀', '😂', '🙂', '😍', '🤔', '😭', '😱', '😎', '😡', '👍',
  '👎', '👌', '✌️', '🙌', '👋', '👏', '🙏', '🙋', '🤦', '🤷',
  '🐶', '🐱', '🦁', '🐵', '🦅', '🌲', '🌱', '🔥', '⭐', '☀️',
  '🍏', '🍌', '🍕', '🍔', '🍟', '🍿', '☕', '🍺', '🍷', '🍰',
  '🚗', '✈️', '⏰', '💡', '💻', '📱', '🔒', '❤️', '✨', '✅',
  '😉', '😋', '🥳', '🤩', '🙄', '😴', '😷', '👿', '👻', '💩',
  '💘', '💖', '💗', '💓', '💬', '📢', '🔔', '✉️', '📦', '✏️',
  '📌', '✂️', '🔑', '🔨', '🛡️', '📷', '📺', '🎨', '🎵', '⚽',
  '🌈', '🌙', '☁️', '⚡', '❄️', '🌊', '🌍', '🏠', '🚀', '🚲',
  '👑', '🎒', '🕶️', '🎈', '🎉', '🏆', '💯', '❌', '⚠️', '🏁'
];

/*
==================================================
Function App
==================================================
*/
function Main() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newUsername, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [createNewAccountScreen, setCreateNewAccountScreen] = useState(false);
  const [loginScreen, setLoginScreen] = useState(true);
  const [userNameValid, setUserNameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isCreateNewAccountDisplayNameValid, setIsCreateNewAccountDisplayNameValid] = useState(true);
  const [isCreateNewAccountUserNameValid, setIsCreateNewAccountUserNameValid] = useState(true);
  const [isCreateNewAccountPasswordNameValid, setIsCreateNewAccountPasswordNameValid] = useState(true);
  const [displayUserSettings, setDisplayUserSettings] = useState(false);
  const [currentPFP, setCurrentPFP] = useState(PlaceHolderPFP);
  const [updatedDisplayName, setUpdatedDisplayName] = useState("");
  const [updatedBiography, setUpdatedBiography] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [isUpdatedDisplayNameValid, setIsUpdatedDisplayNameValid] = useState(true);
  const [isUpdatedBiographyValid, setIsUpdatedBiographyValid] = useState(true);
  const [isUpdatedPasswordValid, setIsUpdatedPasswordValid] = useState(true);
  const [updatedStatus, setUpdatedStatus] = useState("Null");
  const [hasUpdatedDisplayName, setHasUpdatedDisplayName] = useState(false);
  const [hasUpdatedBiography, setHasUpdatedBiography] = useState(false);
  const [hasUpdatedPassword, setHasUpdatedPassword] = useState(false);
  const [hasUpdatedProfilePicture, setHasUpdatedProfilePicture] = useState(false);
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState<File | null>(null);
  const [displayCreateNewServer, setDisplayCreateNewServer] = useState(false);
  const [createNewServerIcon, setCreateNewServerIcon] = useState(WhiteDiscordLogo);
  const [createNewServerName, setCreateNewServerName] = useState("");
  const [createNewServerIconFile, setCreateNewServerIconFile] = useState<File | null>(null);
  const [isCreateNewServerNameValid, setIsCreateNewServerNameValid] = useState(true);
  const [hasDataForCreateNewServerIcon, setHasDataForCreateNewServerIcon] = useState(false);
  const [hasDataForCreateNewServerName, setHasDataForCreateNewServerName] = useState(false);
  const [currentServer, setCurrentServer] = useState("Welcome To Discard!");
  const [currentServerInfo, setCurrentServerInfo] = useState(null);
  const [currentServerIcon, setCurrentServerIcon] = useState("");
  const [currentServerThumbnail, setCurrentServerThumbnail] = useState(PlaceHolderServerThumbnail);
  const [displayUpdateServerSettings, setDisplayUpdateServerSettings] = useState(false);
  const [updatedServerIcon, setUpdatedServerIcon] = useState("");
  const [updatedServerIconFile, setUpdatedServerIconFile] = useState<File | null>(null);
  const [hasUpdatedServerIcon, setHasUpdatedServerIcon] = useState(false);
  const [updatedServerThumbnail, setUpdatedServerThumbnail] = useState("");
  const [updatedServerThumbnailFile, setUpdatedServerThumbnailFile] = useState<File | null>(null);
  const [hasUpdatedServerThumbnail, setHasUpdatedServerThumbnail] = useState(false);
  const [isUpdatedServerNameValid, setIsUpdatedServerNameValid] = useState(true);
  const [updatedServerName, setUpdatedServerName] = useState("");
  const [hasUpdatedServerName, setHasUpdatedServerName] = useState(false);
  const [isUpdatedServerDescriptionValid, setIsUpdatedServerDescriptionValid] = useState(true);
  const [updatedServerDescription, setUpdatedServerDescription] = useState("");
  const [hasUpdatedServerDescription, setHasUpdatedServerDescription] = useState(false);
  const [currentServerDescription, setCurrentServerDescription] = useState("");
  const [displayCreateNewChannels, setDisplayCreateNewChannels] = useState(false);
  const [isCreateChannelNameValid, setIsCreateChannelNameValid] = useState(true);
  const [createNewChannelName, setCreateNewChannelName] = useState("");
  const [hasDataForCreateChannelName, setHasDataForCreateChannelName] = useState(false);
  const [isCreateChannelDescriptionValid, setIsCreateChannelDescriptionValid] = useState(true);
  const [createNewChannelDescription, setCreateNewChannelDescription] = useState("");
  const [hasDataForCreateChannelDescription, setHasDataForCreateChannelDescription] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState("");
  const [currentChannelData, setCurrentChannelData] = useState([]);
  const [currentChannelName, setCurrentChannelName] = useState("Channel Name");
  const [currentChannelDescription, setCurrentChannelDescription] = useState("Channel Description");
  const [displayEditChannel, setDisplayEditChannel] = useState(false);
  const [isUpdatedChannelNameValid, setIsUpdatedChannelNameValid] = useState(true);
  const [updatedChannelName, setUpdatedChannelName] = useState("");
  const [hasUpdatedChannelName, setHasUpdatedChannelName] = useState(false);
  const [isUpdatedChannelDescriptionValid, setIsUpdatedChannelDescriptionValid] = useState(true);
  const [updatedChannelDescription, setUpdatedChannelDescription] = useState("");
  const [hasUpdatedChannelDescription, setHasUpdatedChannelDescription] = useState(false);
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [currentChannelInfo, setCurrentChannelInfo] = useState(null);
  const [messageDataArray, setMessageDataArray] = useState([]);
  const [messageIdToEdit, setMessageIdToEdit] = useState(null);
  const [displayCreateNewRoles, setDisplayCreateNewRoles] = useState(false);
  const [isCreateRoleNameValid, setIsCreateRoleNameValid] = useState(true);
  const [createNewRoleName, setCreateNewRoleName] = useState("");
  const [hasDataForNewRoleName, setHasDataForNewRoleName] = useState(false);
  const [createNewRoleColor, setCreateNewRoleColor] = useState("#000000");
  const [hasDataForNewRoleColor, setHasDataForNewRoleColor] = useState(false);
  const [currentRoleData, setCurrentRoleData] = useState([]);
  const [currentRoleIdToEdit, setCurrentRoleIdToEdit] = useState("");
  const [displayEditRole, setDisplayEditRole] = useState(false);
  const [isUpdatedRoleNameValid, setIsUpdatedRoleNameValid] = useState(true);
  const [updatedRoleName, setUpdatedRoleName] = useState("");
  const [hasUpdatedRoleName, setHasUpdatedRoleName] = useState(false);
  const [updatedRoleColor, setUpdatedRoleColor] = useState("#000000");
  const [hasUpdatedRoleColor, setHasUpdatedRoleColor] = useState(false);
  const [isUpdatedRoleRankValid, setIsUpdatedRoleRankValid] = useState(true);
  const [updatedRoleRank, setUpdatedRoleRank] = useState(0);
  const [hasUpdatedRoleRank, setHasUpdatedRoleRank] = useState(false);
  const [membersDataArray, setMembersDataArray] = useState([]);
  const [currentMemberDataToEdit, setCurrentMemberDataToEdit] = useState(null);
  const [editMemberScreen, setEditMemberScreen] = useState(false);
  const [displayAddRolesToMemberScreen, setDisplayAddRolesToMemberScreen] = useState(false);
  const [canKickLowerRankMembers, setCanKickLowerRankMembers] = useState(false);
  const [canBanLowerRankMembers, setCanBanLowerRankMembers] = useState(false);
  const [canEditLowerRankMemberRoles, setCanEditLowerRankMemberRoles] = useState(false);
  const [updateRoleCanKickLowerRankMembers, setUpdateRoleCanKickLowerRankMembers] = useState(false);
  const [updateRoleCanBanLowerRankMembers, setUpdateRoleCanBanLowerRankMembers] = useState(false);
  const [updateRoleCanEditLowerRankMembers, setUpdateRoleCanEditLowerRankMembers] = useState(false);
  const [hasUpdatedCanKickLowerRankMembers, setHasUpdatedCanKickLowerRankMembers] = useState(false);
  const [hasUpdatedCanBanLowerRankMembers, setHasUpdatedCanBanLowerRankMembers] = useState(false);
  const [hasUpdatedCanEditLowerRankMembers, setHasUpdatedCanEditLowerRankMembers] = useState(false);
  const [displayJoinServerScreen, setDisplayJoinServerScreen] = useState(false);
  const [joinServerId, setJoinServerId] = useState("");
  const [hasDataForJoinServerId, setHasDataForJoinServerId] = useState(false);
  const [canEditRoles, setCanEditRoles] = useState(false);
  const [currentHighestRoleThatCanEditLowerRankMembers, setCurrentHighestRoleThatCanEditLowerRankMembers] = useState(null);
  const [currentUserRolesArray, setCurrentUserRolesArray] = useState([]);
  const [notifyChannelIdArray, setNotifyChannelIdArray] = useState<string[]>([]);
  async function RetrieveLatestData() {
    const retrieveLatestDataResponse = await fetch("http://localhost:5000/retrieveLatestData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username
      })
    });
    if (retrieveLatestDataResponse.ok) {
      const data = await retrieveLatestDataResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await retrieveLatestDataResponse.json();
      alert(errorCode.error);
    };
  };
  useEffect(() => {
    if (socket == null) {
      return;
    };
    socket.on("recieveMessage", (messageData, recieveMessageChannelId, isInitialMessage) => {
      console.log("[CLIENT] Received:", messageData);
      if (isInitialMessage == false) {
        setNotifyChannelIdArray(previous => [...previous, recieveMessageChannelId]);
      };
      if (currentChannelInfo != null && (currentChannelInfo as any).channel_id == recieveMessageChannelId) {
        setMessageDataArray(messageData);
      };
    });
    socket.on("retrieveLatestData", (latestData) => {
      console.log("[CLIENT] retrieveLatestData Update Data To Latest:", latestData);
      if (latestData.usernameToIgnore != username) {
        RetrieveLatestData();
      };
    });
    return () => {
      socket.off("recieveMessage");
      socket.off("retrieveLatestData");
    };
  }, [socket, currentServerInfo, currentChannelInfo, currentMemberDataToEdit]);
  async function Login() {
    if (userNameValid == true && passwordValid == true) {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      if (response.ok) {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        newSocket.on("connect", () => {
          console.log("[CLIENT] Socket Connected:", newSocket.id);
        });
        const data = await response.json();
        console.log("[CLIENT] User Data:", data);
        setUserData(data);
        for (let index = 0; index < data.serverData[0].server_members_array_data.length; index++) {
          if (data.serverData[0].server_members_array_data[index].username == data.username) {
            setCurrentUserRolesArray(data.serverData[0].server_members_array_data[index].roles_array);
          };
        };
        if (data.profile_picture != "") {
          setCurrentPFP("http://localhost:5000" + data.profile_picture);
        } else {
          setCurrentPFP(PlaceHolderPFP);
        };
        if (data.serverData.length > 0) {
          let tempCanEditRoles = false;
          for (let index = 0; index < data.serverData[0].server_members_array_data.length; index++) {
            if (data.serverData[0].server_members_array_data[index].username == data.username) {
              for (let index2 = 0; index2 < data.serverData[0].server_members_array_data[index].roles_array.length; index2++) {
                if (data.serverData[0].server_members_array_data[index].roles_array[index2].can_edit_lower_rank_member_roles == true) {
                  setCanEditRoles(true);
                  tempCanEditRoles = true;
                  let currentRoleData = structuredClone(data.serverData[0].server_members_array_data[index].roles_array[index2]);
                  if (data.username == data.serverData[0].server_owner) {
                    currentRoleData.isServerOwner = true;
                  } else {
                    currentRoleData.isServerOwner = false;
                  };
                  setCurrentHighestRoleThatCanEditLowerRankMembers(currentRoleData);
                  break;
                };
              };
            };
          };
          if (data.username == data.serverData[0].server_owner) {
            setCanEditRoles(true);
            tempCanEditRoles = true;
          };
          if (tempCanEditRoles == false) {
            setCanEditRoles(false);
          };
          setCurrentServerFunction(data.serverData[0]);
          if (data.serverData[0].channelsData.length > 0 && newSocket != null) {
            newSocket.emit("joinChannel", data.serverData[0].channelsData[0].channel_id, true);
            newSocket.emit("joinServer", data.serverData[0].server_id);
          };
          for (let index = 0; index < data.serverData[0].channelsData.length; index++) {
            newSocket.emit("joinChannel", data.serverData[0].channelsData[index].channel_id, false);
          };
        };
        UpdateServerDataToLatest(data);
        console.log("[CLIENT] Log In!");
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    } else {
      console.log("[CLIENT] Invalid Login, Username Or Password Is In An Invalid Format!");
      alert("[CLIENT] Invalid Login, Username Or Password Is In An Invalid Format!");
    };
  };
  async function CreateNewAccount() {
    if (isCreateNewAccountDisplayNameValid == true && isCreateNewAccountUserNameValid == true && isCreateNewAccountPasswordNameValid == true) {
      const response = await fetch("http://localhost:5000/createAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          displayName: newDisplayName,
          username: newUsername,
          password: newPassword
        })
      });
      if (response.ok) {
        alert("[CLIENT] New Account Created Successfully!");
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    } else {
      console.log("[CLIENT] Cannot Create New Account!");
      alert("[CLIENT] Cannot Create New Account!");
    };
  };
  async function UpdateUserSettings() {
    let preventUpdatingUserSettings = false;
    let canUpdateUserSettings = false;
    let localChannelId = "";
    if (currentChannelInfo != null) {
      localChannelId = (currentChannelInfo as any).channel_id;
    };
    let UserSettingsToUpdate = {
      username: userData.username,
      channelId: localChannelId, 
      displayName: "",
      canUpdateDisplayName: false,
      biography: "",
      canUpdateBiography: false,
      password: "",
      canUpdatePassword: false,
      status: "",
      canUpdateStatus: false,
    };
    if (isUpdatedDisplayNameValid == true && hasUpdatedDisplayName == true) {
      let sanitizedString = updatedDisplayName.replace(/[^a-zA-Z0-9_]/g, "");
      if (sanitizedString.length <= 99 && sanitizedString.length > 0) {
        UserSettingsToUpdate.displayName = updatedDisplayName;
        UserSettingsToUpdate.canUpdateDisplayName = true;
        canUpdateUserSettings = true;
      } else {
        preventUpdatingUserSettings = true;
      };
    } else if (isUpdatedDisplayNameValid == false && hasUpdatedDisplayName == true) {
      preventUpdatingUserSettings = true;
    };
    if (isUpdatedBiographyValid == true && hasUpdatedBiography == true) {
      if (updatedBiography.length <= 500) {
        UserSettingsToUpdate.biography = updatedBiography;
        UserSettingsToUpdate.canUpdateBiography = true;
        canUpdateUserSettings = true;
      } else {
        preventUpdatingUserSettings = true;
      };
    } else if (isUpdatedBiographyValid == false && hasUpdatedBiography == true) {
      preventUpdatingUserSettings = true;
    };
    if (isUpdatedPasswordValid == true && hasUpdatedPassword == true) {
      if (updatedPassword.length >= 8 && updatedPassword.length <= 99) {
        UserSettingsToUpdate.password = updatedPassword;
        UserSettingsToUpdate.canUpdatePassword = true;
        canUpdateUserSettings = true;
      } else {
        preventUpdatingUserSettings = true;
      };
    } else if (isUpdatedPasswordValid == false && hasUpdatedPassword == true) {
      preventUpdatingUserSettings = true;
    };
    if (updatedStatus != "Null") {
      UserSettingsToUpdate.status = updatedStatus;
      UserSettingsToUpdate.canUpdateStatus = true;
      canUpdateUserSettings = true;
    };
    if (canUpdateUserSettings == true && preventUpdatingUserSettings == false) {
      const response = await fetch("http://localhost:5000/updateUserSettings", {
        method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(UserSettingsToUpdate)
      });
      if (response.ok) {
        alert("[CLIENT] Updated User Settings Successfully!");
        const data = await response.json();
        setUserData(data);
        UpdateServerDataToLatest(data);
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    } else if (preventUpdatingUserSettings == true) {
      console.log("[CLIENT] Cannot Update User Settings Due To Invalid Changes!");
      alert("[CLIENT] Cannot Update User Settings Due To Invalid Changes!");
    } else {
      console.log("[CLIENT] There Are No User Settings To Update!");
      alert("[CLIENT] There Are No User Settings To Update!");
    };
    if (hasUpdatedProfilePicture == true && updatedProfilePicture != null) {
      const formData = new FormData();
      formData.append("userProfilePicture", updatedProfilePicture);
      formData.append("username", userData.username);
      const response = await fetch("http://localhost:5000/updateProfilePicture", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        alert("[CLIENT] Updated User Profile Picture Successfully!");
        const data = await response.json();
        setUserData(data);
        UpdateServerDataToLatest(data);
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    };
  };
  async function UpdateServerSettings() {
    if (currentServerInfo != null && userData != null) {
      let preventUpdatingServerSettings = false;
      let canUpdateServerSettings = false;
      let ServerSettingsToUpdate = {
        username: userData.username,
        serverId: (currentServerInfo as any).server_id,
        serverName: "",
        canUpdateServerName: false,
        serverDescription: "",
        canUpdateServerDescription: false,
      };
      if (isUpdatedServerNameValid == true && hasUpdatedServerName == true) {
        let sanitizedString = updatedServerName.replace(/[^a-zA-Z0-9_]/g, "");
        if (sanitizedString.length <= 99 && sanitizedString.length > 0) {
          ServerSettingsToUpdate.serverName = updatedServerName;
          ServerSettingsToUpdate.canUpdateServerName = true;
          canUpdateServerSettings = true;
        } else {
          preventUpdatingServerSettings = true;
        };
      } else if (isUpdatedServerNameValid == false && hasUpdatedServerName == true) {
        preventUpdatingServerSettings = true;
      };
      if (isUpdatedServerDescriptionValid == true && hasUpdatedServerDescription == true) {
        if (updatedServerDescription.length <= 500) {
          ServerSettingsToUpdate.serverDescription = updatedServerDescription;
          ServerSettingsToUpdate.canUpdateServerDescription = true;
          canUpdateServerSettings = true;
        } else {
          preventUpdatingServerSettings = true;
        };
      } else if (isUpdatedServerDescriptionValid == false && hasUpdatedServerDescription == true) {
        preventUpdatingServerSettings = true;
      };
      if (canUpdateServerSettings == true && preventUpdatingServerSettings == false) {
        const response = await fetch("http://localhost:5000/updateServerSettings", {
          method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(ServerSettingsToUpdate)
        });
        if (response.ok) {
          alert("[CLIENT] Updated Server Settings Successfully!");
          const data = await response.json();
          setUserData(data);
          UpdateServerDataToLatest(data);
        } else {
          const errorCode = await response.json();
          alert(errorCode.error);
        };
      } else if (preventUpdatingServerSettings == true) {
        console.log("[CLIENT] Cannot Update Server Settings Due To Invalid Changes!");
        alert("[CLIENT] Cannot Update Server Settings Due To Invalid Changes!");
      } else {
        console.log("[CLIENT] No Changes To Server Name & Description To Update!");
        alert("[CLIENT] No Changes To Server Name & Description To Update!");
      };
      let updateServerImages = false;
      const formData = new FormData();
      formData.append("username",userData.username);
      formData.append("serverId", (currentServerInfo as any).server_id);
      if (hasUpdatedServerIcon == true && updatedServerIconFile != null) {
        formData.append("serverIcon", updatedServerIconFile);
        updateServerImages = true;
      };
      if (hasUpdatedServerThumbnail == true && updatedServerThumbnailFile != null) {
        formData.append("serverThumbnail", updatedServerThumbnailFile);
        updateServerImages = true;
      };
      if (updateServerImages == true) {
        const serverIconAndThumbnailResponse = await fetch("http://localhost:5000/updateServerImages", {
          method: "POST",
          body: formData
        });
        if (serverIconAndThumbnailResponse.ok) {
          alert("[CLIENT] Updated Server Images (Icon & Thumbnail) Successfully!");
          const data = await serverIconAndThumbnailResponse.json();
          setUserData(data);
          UpdateServerDataToLatest(data);
        } else {
          const errorCode = await serverIconAndThumbnailResponse.json();
          alert(errorCode.error);
        };
      } else {
        alert("[CLIENT] No Changes To Server Icon & Thumbnail To Update!");
      };
    };
  };
  async function CreateNewServer() {
    if (hasDataForCreateNewServerIcon == true && createNewServerIconFile != null && hasDataForCreateNewServerName == true && isCreateNewServerNameValid == true) {
      const formData = new FormData();
      formData.append("serverName", createNewServerName);
      formData.append("serverIcon", createNewServerIconFile);
      formData.append("serverOwner", userData.username);
      const response = await fetch("http://localhost:5000/createNewServer", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        alert("[CLIENT] Created New Server Successfully!");
        const data = await response.json();
        setUserData(data);
        UpdateServerDataToLatest(data);
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    } else {
      alert("[ERROR] Invalid Input For Server Name Or You Have Not Selected A Server Icon!");
    };
  };
  async function CreateNewChannel() {
    if (hasDataForCreateChannelName == true && hasDataForCreateChannelDescription == true) {
      let canCreateNewChannel = true;
      if (isCreateChannelNameValid == false) {
        alert("[ERROR] Invalid Channel Name!");
        canCreateNewChannel = false;
      };
      if (isCreateChannelDescriptionValid == false) {
        alert("[ERROR] Invalid Channel Description!");
        canCreateNewChannel = false;
      };
      if (canCreateNewChannel == true) {
        const response = await fetch("http://localhost:5000/createNewChannel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            serverId: (currentServerInfo as any).server_id,
            username: userData.username,
            channelName: createNewChannelName,
            channelDescription: createNewChannelDescription
          })
        });
        if (response.ok) {
          alert("[CLIENT] New Channel Created Successfully!");
          const data = await response.json();
          setUserData(data);
          UpdateServerDataToLatest(data);
        } else {
          const errorCode = await response.json();
          alert(errorCode.error);
        };
      };
    } else {
      alert("[ERROR] You Must Include Both Channel Name & Channel Description!");
    };
  };
  async function UpdateChannel() {
    if (hasUpdatedChannelName == false && hasUpdatedChannelDescription == false) {
      alert("[CLIENT] You Have Not Made Any Changes To The Channel Name Or Description!");
      return;
    };
    let ChannelSettingsToUpdate = {
      username: userData.username,
      serverId: (currentServerInfo as any).server_id,
      channelId: currentChannelId,
      channelName: "",
      canUpdateChannelName: false,
      channelDescription: "",
      canUpdateChannelDescription: false,
    }
    if (hasUpdatedChannelName == true) {
      ChannelSettingsToUpdate.canUpdateChannelName = true;
      ChannelSettingsToUpdate.channelName = updatedChannelName;
    };
    if (hasUpdatedChannelDescription == true) {
      ChannelSettingsToUpdate.canUpdateChannelDescription = true;
      ChannelSettingsToUpdate.channelDescription = updatedChannelDescription;
    };
    const updateChannelResponse = await fetch("http://localhost:5000/updateChannelSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ChannelSettingsToUpdate)
    });
    if (updateChannelResponse.ok) {
      alert("[CLIENT] Updated Channel Settings Successfully!");
      const data = await updateChannelResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await updateChannelResponse.json();
      alert(errorCode.error);
    };
  };
  async function CreateRoleFunction() {
    if (hasDataForNewRoleName == false && hasDataForNewRoleColor == false) {
      alert("[ERROR] You Must Add A New Role Name & Role Color!");
      return;
    };
    if (hasDataForNewRoleName == false) {
      alert("[ERROR] You Must Add A New Role Name!");
      return;
    };
    if (isCreateRoleNameValid == false) {
      alert("[ERROR] Role Name Not Valid!");
      return;
    };
    if (hasDataForNewRoleColor == false) {
      alert("[ERROR] You Must Add A New Role Color!");
      return;
    };
    const newRoleResponse = await fetch("http://localhost:5000/createNewRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serverId: (currentServerInfo as any).server_id,
        username: userData.username,
        roleName: createNewRoleName,
        roleColor: createNewRoleColor,
        canKickLowerRankMembers: canKickLowerRankMembers,
        canBanLowerRankMembers: canBanLowerRankMembers,
        canEditLowerRankMemberRoles: canEditLowerRankMemberRoles,
      })
    });
    if (newRoleResponse.ok) {
      alert("[CLIENT] Created New Role Successfully!");
      const data = await newRoleResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await newRoleResponse.json();
      alert(errorCode.error);
    };
  };
  async function UpdateRoleFunction() {
    if (hasUpdatedRoleName == false && hasUpdatedRoleColor == false && hasUpdatedRoleRank == false && hasUpdatedCanKickLowerRankMembers == false && hasUpdatedCanBanLowerRankMembers == false && hasUpdatedCanEditLowerRankMembers == false) {
      alert("[ERROR] You Have Not Updated Anything!");
      return;
    };
    let updatedRoleData = {
      serverId: (currentServerInfo as any).server_id,
      username: userData.username,
      roleId: currentRoleIdToEdit,
      roleName: updatedRoleName,
      roleColor: updatedRoleColor,
      roleRank: updatedRoleRank,
      updateRoleName: hasUpdatedRoleName,
      updateRoleColor: hasUpdatedRoleColor,
      updatedRoleRank: hasUpdatedRoleRank,
      canKickLowerRankMembers: updateRoleCanKickLowerRankMembers,
      canBanLowerRankMembers: updateRoleCanBanLowerRankMembers,
      canEditLowerRankMemberRoles: updateRoleCanEditLowerRankMembers,
    };
    const updatedRoleResponse = await fetch("http://localhost:5000/updateRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedRoleData)
    });
    if (updatedRoleResponse.ok) {
      alert("[CLIENT] Updated Role Successfully!");
      const data = await updatedRoleResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await updatedRoleResponse.json();
      alert(errorCode.error);
    };
  };
  async function AddRoleToMemberFunction(roleData: any) {
    if (currentMemberDataToEdit == null) {
      alert("[ERROR] currentMemberDataToEdit Is Null!");
      return;
    };
    if (currentServerInfo == null) {
      alert("[ERROR] currentServerInfo Is Null!");
      return;
    };
    let roleDataTable = {
      adminUsername: userData.username,
      username: (currentMemberDataToEdit as any).username,
      roleId: roleData.role_id,
      serverId: (currentServerInfo as any).server_id,
    };
    const addRoleToMemberResponse = await fetch("http://localhost:5000/addRoleToMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roleDataTable)
    });
    if (addRoleToMemberResponse.ok) {
      alert("[CLIENT] Added Role To Member Successfully!");
      const data = await addRoleToMemberResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await addRoleToMemberResponse.json();
      alert(errorCode.error);
    };
  };
  async function RemoveRoleFunction(roleData: any) {
    let roleDataToRemove = {
      adminUsername: userData.username,
      username: (currentMemberDataToEdit as any).username,
      roleId: roleData.role_id,
      serverId: (currentServerInfo as any).server_id,
    };
    const removeRoleFromMemberResponse = await fetch("http://localhost:5000/removeRoleFromMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roleDataToRemove)
    });
    if (removeRoleFromMemberResponse.ok) {
      alert("[CLIENT] Removed Role From Member Successfully!");
      const data = await removeRoleFromMemberResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await removeRoleFromMemberResponse.json();
      alert(errorCode.error);
    };
  };
  async function JoinServer() {
    if (hasDataForJoinServerId == false) {
      alert("[ERROR] You Do Not Have Any Server Id Yet!");
      return;
    };
    const joinServerResponse = await fetch("http://localhost:5000/joinServer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: userData.username,
        joinServerId: joinServerId
      })
    });
    if (joinServerResponse.ok) {
      alert("[CLIENT] Joined Server Successfully!");
      const data = await joinServerResponse.json();
      setUserData(data);
      UpdateServerDataToLatest(data);
    } else {
      const errorCode = await joinServerResponse.json();
      alert(errorCode.error);
    };
  };
  function DisplayCreateNewAccountScreen() {
    setCreateNewAccountScreen(true);
    setLoginScreen(false);
  };
  function DisplayLoginScreen() {
    setLoginScreen(true);
    setCreateNewAccountScreen(false);
  };
  function DirectMessagesButton() {
    console.log("DIRECT MESSAGES BUTTON!");
  };
  function CreateNewServerButton() {
    setDisplayCreateNewServer(true);
  };
  function UserSettingsButton() {
    setDisplayUserSettings(true);
    setUpdatedDisplayName(userData.displayname);
    setUpdatedBiography(userData.biography);
    setUpdatedPassword(userData.password);
    setUpdatedStatus(userData.status);
    if (userData.profile_picture != "") {
      setCurrentPFP("http://localhost:5000" + userData.profile_picture);
    } else {
      setCurrentPFP(PlaceHolderPFP);
    };
  };
  function ExitUserSettingsButton() {
    setDisplayUserSettings(false);
  };
  function ExitCreateNewServerButton() {
    setDisplayCreateNewServer(false);
  };
  function UpdateBiography(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let currentBiography = event.target.value;
    setUpdatedBiography(currentBiography);
    if (currentBiography.length <= 500) {
      setIsUpdatedBiographyValid(true);
    } else {
      setIsUpdatedBiographyValid(false);
    };
    setHasUpdatedBiography(true);
  };
  function UpdateServerDescription(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let currentServerDescription = event.target.value;
    setUpdatedServerDescription(currentServerDescription);
    if (currentServerDescription.length <= 500) {
      setIsUpdatedServerDescriptionValid(true);
    } else {
      setIsUpdatedServerDescriptionValid(false);
    };
    setHasUpdatedServerDescription(true);
  };
  function createNewChannelDescriptionFunction(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let currentChannelDescription = event.target.value;
    setCreateNewChannelDescription(currentChannelDescription);
    if (currentChannelDescription.length <= 500) {
      setIsCreateChannelDescriptionValid(true);
    } else {
      setIsCreateChannelDescriptionValid(false);
    };
    setHasDataForCreateChannelDescription(true);
  };
  function updateChannelDescriptionFunction(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let currentUpdatedChannelDescription = event.target.value;
    setUpdatedChannelDescription(currentUpdatedChannelDescription);
    if (currentUpdatedChannelDescription.length <= 500) {
      setIsUpdatedChannelDescriptionValid(true);
    } else {
      setIsUpdatedChannelDescriptionValid(false);
    };
    setHasUpdatedChannelDescription(true);
  };
  function LogoutButton() {
    if (socket != null) {
      socket.disconnect();
      setSocket(null);
    };
    setDisplayUserSettings(false);
    setUserData(null);
    console.log("[CLIENT] Log Out!");
  };
  function SelectImageForUserProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    };
    setCurrentPFP(URL.createObjectURL(file));
    setUpdatedProfilePicture(file);
    setHasUpdatedProfilePicture(true);
  };
  function SelectImageForCreateNewServer (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    };
    setCreateNewServerIcon(URL.createObjectURL(file));
    setCreateNewServerIconFile(file);
    setHasDataForCreateNewServerIcon(true);
  };
  function SelectImageForServerIcon(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    };
    setUpdatedServerIcon(URL.createObjectURL(file));
    setUpdatedServerIconFile(file);
    setHasUpdatedServerIcon(true);
  };
  function SelectImageForServerThumbnail(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    };
    setUpdatedServerThumbnail(URL.createObjectURL(file));
    setUpdatedServerThumbnailFile(file);
    setHasUpdatedServerThumbnail(true);
  };
  function OpenFilePickerForUserProfilePicture() {
    document.getElementById("ProfilePictureInput")?.click();
  };
  function OpenFilePickerForCreateNewServer() {
    document.getElementById("CreateNewServerIconImageInput")?.click();
  };
  function OpenFilePickerForServerSettingsIcon() {
    document.getElementById("ServerSettingsIconInput")?.click();
  };
  function OpenFilePickerForServerSettingsThumbnail() {
    document.getElementById("ServerSettingsThumbnailInput")?.click();
  };
  function setCurrentServerFunction(serverInfo: any) {
    if (userData != null) {
      let tempCanEditRoles = false;
      for (let index = 0; index < serverInfo.server_members_array_data.length; index++) {
        if (serverInfo.server_members_array_data[index].username == userData.username) {
          for (let index2 = 0; index2 < serverInfo.server_members_array_data[index].roles_array.length; index2++) {
            if (serverInfo.server_members_array_data[index].roles_array[index2].can_edit_lower_rank_member_roles == true) {
              setCanEditRoles(true);
              tempCanEditRoles = true;
              let currentRoleData = structuredClone(serverInfo.server_members_array_data[index].roles_array[index2]);
              if (userData.username == serverInfo.server_owner) {
                currentRoleData.isServerOwner = true;
              } else {
                currentRoleData.isServerOwner = false;
              };
              setCurrentHighestRoleThatCanEditLowerRankMembers(currentRoleData);
              break;
            };
          };
        };
      };
      if (tempCanEditRoles == false) {
        setCanEditRoles(false);
      };
      for (let index = 0; index < serverInfo.server_members_array_data.length; index++) {
        if (serverInfo.server_members_array_data[index].username == userData.username) {
          setCurrentUserRolesArray(serverInfo.server_members_array_data[index].roles_array);
        };
      };
    };
    setCurrentServer(serverInfo.server_name);
    setCurrentServerInfo(serverInfo);
    setCurrentServerIcon("http://localhost:5000" + serverInfo.server_icon);
    setCurrentServerDescription(serverInfo.server_description);
    serverInfo.rolesData.sort((roleA: any, roleB: any) => roleA.role_rank - roleB.role_rank);
    setCurrentRoleData(serverInfo.rolesData);
    setMembersDataArray(serverInfo.server_members_array_data);
    if (serverInfo.server_thumbnail != "") {
      setCurrentServerThumbnail("http://localhost:5000" + serverInfo.server_thumbnail);
    } else {
      setCurrentServerThumbnail(PlaceHolderServerThumbnail);
    };
    setCurrentChannelData(serverInfo.channelsData);
    if (serverInfo.channelsData.length > 0) {
      changeChannel(serverInfo.channelsData[0]);
    } else {
      changeChannel(null);
    };
    if (socket != null) {
      socket.emit("joinServer", serverInfo.server_id);
    };
    if (socket != null) {
      for (let index = 0; index < serverInfo.channelsData.length; index++) {
        socket.emit("joinChannel", serverInfo.channelsData[index].channel_id, false);
      };
    };
  };
  function displayServerSettings() {
    if (currentServerInfo != null && userData.username == (currentServerInfo as any).server_owner) {
      setDisplayUpdateServerSettings(true);
      setUpdatedServerName((currentServerInfo as any).server_name);
      setUpdatedServerDescription((currentServerInfo as any).server_description);
      setUpdatedServerIcon(currentServerIcon);
      setUpdatedServerThumbnail(currentServerThumbnail);
    } else {
      alert("[ERROR] You Cannot Edit This Server Since You Are Not The Server Owner!");
    };
  };
  function displayCreateNewChannelsPanel() {
    setDisplayUpdateServerSettings(false);
    setDisplayCreateNewChannels(true)
  };
  function displayCreateNewRolesPannel() {
    setDisplayUpdateServerSettings(false);
    setDisplayCreateNewRoles(true);
  };
  function ExitServerSettingsButton() {
    setDisplayUpdateServerSettings(false);
  };
  function ExitCreateChannelButton() {
    setDisplayUpdateServerSettings(true);
    setDisplayCreateNewChannels(false);
  };
  function ExitCreateNewRoleButton() {
    setDisplayUpdateServerSettings(true);
    setDisplayCreateNewRoles(false);
  };
  function ExitEditRoleButton() {
    setDisplayEditRole(false);
    setDisplayCreateNewRoles(true);
  }
  function UpdateServerDataToLatest(lastestData: any) {
    if (currentServerInfo != null) {
      let currentSelectedChannelDataToUse = null;
      for (let index = 0; index < lastestData.serverData.length; index++) {
        if ((currentServerInfo as any).server_id == lastestData.serverData[index].server_id) {
          setCurrentServer(lastestData.serverData[index].server_name);
          setCurrentServerDescription(lastestData.serverData[index].server_description);
          setCurrentServerIcon("http://localhost:5000" + lastestData.serverData[index].server_icon);
          setCurrentServerThumbnail("http://localhost:5000" + lastestData.serverData[index].server_thumbnail);
          lastestData.serverData[index].rolesData.sort((roleA: any, roleB: any) => roleA.role_rank - roleB.role_rank);
          setCurrentChannelData(lastestData.serverData[index].channelsData);
          setCurrentRoleData(lastestData.serverData[index].rolesData);
          setMembersDataArray(lastestData.serverData[index].server_members_array_data);
          currentSelectedChannelDataToUse = lastestData.serverData[index].channelsData;
          for (let member_index = 0; member_index < lastestData.serverData[index].server_members_array_data.length; member_index++) {
            if (lastestData.serverData[index].server_members_array_data[member_index].username == lastestData.username) {
              for (let rank_index = 0; rank_index < lastestData.serverData[index].server_members_array_data[member_index].roles_array.length; rank_index++) {
                if (lastestData.serverData[index].server_members_array_data[member_index].roles_array[rank_index].can_edit_lower_rank_member_roles == true) {
                  let currentRoleData = structuredClone(lastestData.serverData[index].server_members_array_data[member_index].roles_array[rank_index]);
                  if (lastestData.username == lastestData.serverData[0].server_owner) {
                    currentRoleData.isServerOwner = true;
                  } else {
                    currentRoleData.isServerOwner = false;
                  };
                  setCurrentHighestRoleThatCanEditLowerRankMembers(currentRoleData);
                  break;
                };
              };
            };
          };
          if (currentMemberDataToEdit != null) {
            for (let member_index = 0; member_index < lastestData.serverData[index].server_members_array_data.length; member_index++) {
              if (lastestData.serverData[index].server_members_array_data[member_index].username == (currentMemberDataToEdit as any).username) {
                setCurrentMemberDataToEdit(lastestData.serverData[index].server_members_array_data[member_index]);
              };
            };
          };
          let tempCanEditRoles = false;
          for (let index2 = 0; index2 < lastestData.serverData[index].server_members_array_data.length; index2++) {
            if (lastestData.serverData[index].server_members_array_data[index2].username == lastestData.username) {
              for (let index3 = 0; index3 < lastestData.serverData[index].server_members_array_data[index2].roles_array.length; index3++) {
                if (lastestData.serverData[index].server_members_array_data[index2].roles_array[index3].can_edit_lower_rank_member_roles == true) {
                  setCanEditRoles(true);
                  tempCanEditRoles = true;
                };
              };
            };
          };
          if (lastestData.username == lastestData.serverData[index].server_owner) {
            setCanEditRoles(true);
            tempCanEditRoles = true;
          };
          if (tempCanEditRoles == false) {
            setCanEditRoles(false);
          };
        };
      };
      if (currentSelectedChannelDataToUse != null) {
        for (let index = 0; index < currentSelectedChannelDataToUse.length; index++) {
          if (currentSelectedChannelDataToUse[index].channel_id == currentChannelId) {
            setCurrentChannelName(currentSelectedChannelDataToUse[index].channel_name);
            setCurrentChannelDescription(currentSelectedChannelDataToUse[index].channel_description);
          };
        };
      };
    };
  };
  function changeChannel(channelInfo: any) {
    if (channelInfo != null) {
      setNotifyChannelIdArray(previous => previous.filter(channelId => channelId != channelInfo.channel_id));
    };
    setCurrentChannelInfo(channelInfo);
    if (channelInfo != null) {
      setCurrentChannelName(channelInfo.channel_name);
      setCurrentChannelDescription(channelInfo.channel_description);
      if (socket != null) {
        socket.emit("joinChannel", channelInfo.channel_id, true);
      };
    } else {
      setCurrentChannelName("Channel Name");
      setCurrentChannelDescription("Channel Description");
    };
  };
  function displayEditChannelFunction(channelInfo: any) {
    if (currentServerInfo != null && userData.username == (currentServerInfo as any).server_owner) {
      setDisplayEditChannel(true);
      setCurrentChannelId(channelInfo.channel_id);
      setUpdatedChannelName(channelInfo.channel_name);
      setUpdatedChannelDescription(channelInfo.channel_description);
    } else {
      alert("[ERROR] You Do Not Have Permission To Edit Channels, Only The Server Owner!");
    };
  };
  function ExitEditChannelButton() {
    setDisplayEditChannel(false);
  };
  function DisplayEmojiPicker() {
    setDisplayEmojiPicker(!displayEmojiPicker);
  };
  function addEmojiToTextBox(emoji: any) {
    setMessageText(messageText + emoji);
  };
  function sendMessageFunction(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == "Enter") {
      const currentMessage = messageText.trim();
      if (currentMessage.length > 0) {
        if (socket != null && currentChannelInfo != null) {
          socket.emit("sendMessage",{
            channelId: (currentChannelInfo as any).channel_id,
            username: userData.username,
            message: currentMessage,
            isEditingMessage: (messageIdToEdit != null),
            editedMessageId: messageIdToEdit
          });
          setMessageIdToEdit(null);
        } else {
          alert("[ERROR] Channel Socket Is Null!");
        };
      } else {
        alert("[ERROR] You Have No Message To Send!");
      };
      event.currentTarget.value = "";
      setMessageText("");
    };
  };
  function editMessageFunction(messageId: any) {
    setMessageIdToEdit(messageId);
  };
  function updateRoleColor(event: React.ChangeEvent<HTMLInputElement>) {
    setCreateNewRoleColor(event.target.value);
    setHasDataForNewRoleColor(true);
  };
  function EditRoleFunction(roleData: any) {
    setCurrentRoleIdToEdit(roleData.role_id);
    setUpdatedRoleName(roleData.role_name);
    setUpdatedRoleRank(roleData.role_rank);
    setUpdatedRoleColor(roleData.role_color);
    setUpdateRoleCanKickLowerRankMembers(roleData.can_kick_lower_rank_members);
    setUpdateRoleCanBanLowerRankMembers(roleData.can_ban_lower_rank_members)
    setUpdateRoleCanEditLowerRankMembers(roleData.can_edit_lower_rank_member_roles);
    setDisplayEditRole(true);
    setDisplayCreateNewRoles(false);
  };
  function updateEditRoleColor(event: React.ChangeEvent<HTMLInputElement>) {
    setUpdatedRoleColor(event.target.value);
    setHasUpdatedRoleColor(true);
  };
  function displayEditMemberScreen(memberData: any) {
    setCurrentMemberDataToEdit(memberData);
    setEditMemberScreen(true);
  };
  function ExitEditMemberButton() {
    setEditMemberScreen(false);
  };
  function AddRoleToMemberButton() {
    setEditMemberScreen(false);
    setDisplayAddRolesToMemberScreen(true);
  };
  function ExitAddRoleToMemberButton() {
    setEditMemberScreen(true);
    setDisplayAddRolesToMemberScreen(false);
  };
  function setUpdateRoleCanKickLowerRankMembersFunction(boolean: any) {
    setUpdateRoleCanKickLowerRankMembers(boolean);
    setHasUpdatedCanKickLowerRankMembers(true);
  };
  function setUpdateRoleCanBanLowerRankMembersFunction(boolean: any) {
    setUpdateRoleCanBanLowerRankMembers(boolean);
    setHasUpdatedCanBanLowerRankMembers(true);
  };
  function setUpdateRoleCanEditLowerRankMembersFunction(boolean: any) {
    setUpdateRoleCanEditLowerRankMembers(boolean);
    setHasUpdatedCanEditLowerRankMembers(true);
  };
  function DisplayJoinServerButton() {
    setDisplayCreateNewServer(false);
    setDisplayJoinServerScreen(true);
  };
  function ExitJoinServerButton() {
    setDisplayCreateNewServer(true);
    setDisplayJoinServerScreen(false);
  };
  if (userData) {
    return (
      <div id="MainPageDiv">
        <div id="HeaderBar">{currentServer}</div>
        <div id="MainContainerDiv">
          <div id="ServersContainerDiv">
            <div id="DirectMessageButtonDivContainer" className="toolTipWrapper" onClick={DirectMessagesButton}>
              <img id="DirectMessageButton" src={WhiteDiscordLogo} alt="Direct Messages"></img>
              <div className="toolTip">Direct Messages</div>
            </div>
            <div className="ServerListDivider"></div>
            <div id="ServersDiv">
              {
                userData.serverData.map((serverInfo: any) => (
                  <div id={serverInfo.server_id} key={serverInfo.server_id} className="serverIconDiv toolTipWrapper">
                    <img className="serverIconImage" src={"http://localhost:5000" + serverInfo.server_icon} alt={serverInfo.server_name} onClick={() => setCurrentServerFunction(serverInfo)}></img>
                    <div className="toolTip">{serverInfo.server_name}</div>
                  </div>
                ))
              }
            </div>
            <div className="ServerListDivider"></div>
            <div id="CreateNewServerDivContainer" className="toolTipWrapper" onClick={CreateNewServerButton}>
              <img id="CreateNewServerButton" src={CreateNewServerIcon} alt="Create New Server"></img>
              <div className="toolTip">Create New Server</div>
            </div>
            <div id="UserSettingsDiv" className="toolTipWrapper" onClick={UserSettingsButton}>
              <img id="UserSettingsButton" src={GearsIcon} alt="User Settings"></img>
              <div className="toolTip">User Settings</div>
            </div>
          </div>
          <div id="CurrentServerMainContainerDiv">
            <div id="ChannelsMainContainerDiv">
              {currentServerInfo != null && (
                <div id="ServerIconSettingNameDiv">
                  <img id="ServerIcon" src={currentServerIcon}></img>
                  <div id="ServerNameDiv">{currentServer}</div>
                  <img id="ServerSettingIcon" src={GearsIcon} onClick={displayServerSettings}></img>
                </div>
              )}
              {currentServerInfo != null && (
                <div id="ServerThumbnailIconDiv">
                  <img id="ServerThumbnailIcon" src={currentServerThumbnail}></img>
                </div>
              )}
              {currentServerInfo != null && (
                <div id="ServerDescriptionDiv">
                  <textarea id="ServerDescriptionTextArea" placeholder="Server Description Here..." readOnly value={currentServerDescription}></textarea>
                </div>
              )}
              {currentServerInfo != null && (
                <div id="ChannelsMainDiv">
                  <div id="CreateNewChannelMainDiv">
                    {
                      currentChannelData.map((channelInfo: any) => (
                        <div id={channelInfo.channel_id} key={channelInfo.channel_id} className="channelRowDiv" onClick={() => changeChannel(channelInfo)}>
                          <img src={HashTagIcon} className="hashTagIcon"></img>
                          <div className={"channelNameDiv " + ((notifyChannelIdArray.length > 0 && notifyChannelIdArray.includes(channelInfo.channel_id)) ? "ChannelNotification" : "")}>{channelInfo.channel_name}</div>
                          <img src={GearsIcon} className="channelEditButton" onClick={() => displayEditChannelFunction(channelInfo)}></img>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            <div id="TextChatMainContainerDiv">
              {currentServerInfo != null && (
                <div id="TextChatHeaderDiv">
                  <div id="TextChatChannelNameDiv">{currentChannelName}</div>
                  <textarea id="TextChatChannelDescriptionDiv" placeholder="Channel Description" readOnly value={currentChannelDescription}></textarea>
                </div>
              )}
              {currentServerInfo != null && (
                <div id="TextChatMainDisplayDiv">
                  {messageDataArray.length > 0 && membersDataArray.length > 0 && currentChannelData.length > 0 && (
                    messageDataArray.map((currentMessageData: any) => (
                      <div key={currentMessageData.id} className={"messageMainDiv " + (currentMessageData.messages_message.includes("@"+userData.username) ? "UserNotification " : "") + (currentUserRolesArray.length > 0 ? currentUserRolesArray.filter((roleData: any) => {
                        let roleNameNotification = "@" + roleData.role_name;
                        if (currentMessageData.messages_message.includes(roleNameNotification)) {
                          return true;
                        };
                        return false;
                      }).length > 0 ? "RoleNotification" : "" : "")}>
                        <div className="messagePFPContainer">
                          <img src={"http://localhost:5000" + currentMessageData.message_sender_data.profile_picture} className={"messagePFP " + (currentMessageData.message_sender_data.status == "Online" ? "OnlineBackgroundPFPColor" : currentMessageData.message_sender_data.status == "Do Not Disturb" ? "DoNotDisturbBackgroundPFPColor" : currentMessageData.message_sender_data.status == "Idle" ? "IdleBackgroundPFPColor" : "InvisibleBackgroundPFPColor")}></img>
                          <div className={"userStatusPopup " + (currentMessageData.message_sender_data.status == "Online" ? "OnlineStatusLabelColor" : currentMessageData.message_sender_data.status == "Do Not Disturb" ? "DoNotDisturbStatusLabelColor" : currentMessageData.message_sender_data.status == "Idle" ? "IdleStatusLabelColor" : "InvisibleStatusLabelColor")}>{currentMessageData.message_sender_data.status}</div>
                        </div>
                        <div className="messageContainerDiv">
                          <div className="messageHeaderDiv">
                            <div className="messageUserNameDiv" style={{color:(membersDataArray as any).find((memberData: any) => memberData.username == currentMessageData.message_sender_data.username)?.text_color ?? "white"}}>{currentMessageData.message_sender_data.username}</div>
                            <div className="messageTimeStampDiv">{currentMessageData.messages_created_at}</div>
                            {currentMessageData.message_sender_data.username == userData.username && (<button className="editMessageButton" onClick={() => editMessageFunction(currentMessageData.id)}>📝</button>)}
                          </div>
                          {messageIdToEdit == null && (<textarea className="messageTextArea" value={currentMessageData.messages_message} readOnly></textarea>)}
                          {messageIdToEdit != null && messageIdToEdit == currentMessageData.id && (<textarea className="messageTextArea" value={messageText} readOnly></textarea>)}
                          {messageIdToEdit != null && messageIdToEdit != currentMessageData.id && (<textarea className="messageTextArea" value={currentMessageData.messages_message} readOnly></textarea>)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {currentServerInfo != null && (
                <div id="TextChatMainTextBoxDiv">
                  {displayEmojiPicker && (
                    <div id="EmojiPickerDiv">
                      {WEB_SAFE_EMOJIS.map((emoji) => (
                        <button key={emoji} className="EmojiPickerButton" onClick={() => addEmojiToTextBox(emoji)}>{emoji}</button>
                      ))}
                    </div>
                  )}
                  <input id="TextChatInput" type="text" placeholder={currentChannelName} value={messageText} onChange={(event) => setMessageText(event.target.value)} onKeyDown={sendMessageFunction}></input>
                  <button id="EmojiButton" onClick={DisplayEmojiPicker}>😀</button>
                </div>
              )}
            </div>
            <div id="PlayerListMainContainerDiv">
              <div id="membersListDivLabel">Members List</div>
              <div id="memberListMainContainerDiv">
                {membersDataArray.sort((memberDataA: any, memberDataB: any) => {
                  let memberDataRankA = memberDataA.roles_array.length > 0 ? memberDataA.roles_array[0].role_rank : Infinity;
                  let memberDataRankB = memberDataB.roles_array.length > 0 ? memberDataB.roles_array[0].role_rank : Infinity;
                  return memberDataRankA - memberDataRankB;
                }).map((memberData: any) => (
                  <div id={memberData.username} key={memberData.username} className="membersListDiv" onClick={() => displayEditMemberScreen(memberData)}>
                    <img src={"http://localhost:5000" + memberData.profile_picture} className={"membersListPFP " + (memberData.status == "Online" ? "OnlineBackgroundPFPColor" : memberData.status == "Do Not Disturb" ? "DoNotDisturbBackgroundPFPColor" : memberData.status == "Idle" ? "IdleBackgroundPFPColor" : "InvisibleBackgroundPFPColor")}></img>
                    <div className={"userStatusPopup2 " + (memberData.status == "Online" ? "OnlineStatusLabelColor" : memberData.status == "Do Not Disturb" ? "DoNotDisturbStatusLabelColor" : memberData.status == "Idle" ? "IdleStatusLabelColor" : "InvisibleStatusLabelColor")}>{memberData.status}</div>
                    <div className="membersListUserNameAndDisplayDiv">
                      <div className="membersListUserNameDiv" style={{color:memberData.text_color}}>@{memberData.username}</div>
                      <div className="membersListDisplayNameDiv">{memberData.displayname}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>















          {displayJoinServerScreen == true && (
            <div id="JoinServerScreenDiv">
              <div id="JoinServerScreenMainContainerDiv">
                <div id="JoinServerScreenHeaderDiv">
                  Join Server
                  <img id="JoinServerScreenExitButton" src={ExitIcon} onClick={ExitJoinServerButton} alt="Exit Join Server"></img>
                </div>
                <div className="JoinServerLabelClass">Enter Server Id</div>
                <input className={"JoinServerInputClass"} placeholder="Server Id Here..." type="text" value={joinServerId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setJoinServerId(event.target.value);
                  setHasDataForJoinServerId(true);
                }}/>
                <button className="JoinServerButtonClass" id="JoinServerButton" onClick={JoinServer}>Join Server</button>
              </div>
            </div>
          )}
          {displayAddRolesToMemberScreen == true && currentMemberDataToEdit != null && (
            <div id="AddRoleToMemberScreenDiv">
              <div id="AddRoleToMemberMainContainerDiv">
                <div id="AddRoleToMemberHeaderDiv">
                  Add Roles
                  <img id="AddRoleToMemberExitButton" src={ExitIcon} alt="Exit Edit Role" onClick={ExitAddRoleToMemberButton}></img>
                </div>
                {currentHighestRoleThatCanEditLowerRankMembers != null && canEditRoles == true && (<div id="AddRoleToMemberRolesContainerDiv">{currentRoleData.filter((roleData: any) => {
                  if ((currentHighestRoleThatCanEditLowerRankMembers as any).isServerOwner == true) {
                    return true;
                  } else if (roleData.role_rank > (currentHighestRoleThatCanEditLowerRankMembers as any).role_rank) {
                    return true;
                  };
                  return false;
                }).map((roleData: any) => (<button id={roleData.role_id} key={roleData.role_id} className="AddRoleToMemberButtonClass" style={{color: roleData.role_color}} onClick={() => AddRoleToMemberFunction(roleData)}>Add Role: {roleData.role_name}</button>))}</div>)}
              </div>
            </div>
          )}
          {editMemberScreen == true && currentMemberDataToEdit != null && (
            <div id="EditMemberScreenDiv">
              <div id="EditMemberMainContainerDiv">
                <div id="EditMemberHeaderDiv">
                  Edit Member
                  <img id="EditMemberExitButton" src={ExitIcon} alt="Exit Edit Role" onClick={ExitEditMemberButton}></img>
                </div>
                <div className="EditMemberLabelClass">Profile Picture</div>
                <div>
                  <img id="EditMemberPFP" title="Member Profile Picture" className={(currentMemberDataToEdit as any).status == "Online" ? "OnlineBackgroundPFPColor" : (currentMemberDataToEdit as any).status == "Do Not Disturb" ? "DoNotDisturbBackgroundPFPColor" : (currentMemberDataToEdit as any).status == "Idle" ? "IdleBackgroundPFPColor" : "InvislbeBackgroundPFPColor"} src={"http://localhost:5000" + (currentMemberDataToEdit as any).profile_picture} alt="Profile Picture"></img>
                </div>
                <div className="EditMemberLabelClass">Member Username</div>
                <div id="EditMemberUsernameLabel" className="EditMemberLabelClass">{(currentMemberDataToEdit as any).username}</div>
                <div className="EditMemberLabelClass">Member Display Name</div>
                <div id="EditMemberUsernameLabel" className="EditMemberLabelClass">{(currentMemberDataToEdit as any).displayname}</div>
                <div className="EditMemberLabelClass">Member Status</div>
                <div id="EditMemberUsernameLabel" className={"EditMemberLabelClass " +((currentMemberDataToEdit as any).status === "Online" ? "OnlineStatusLabelColor2" : (currentMemberDataToEdit as any).status === "Do Not Disturb" ? "DoNotDisturbStatusLabelColor2" : (currentMemberDataToEdit as any).status === "Idle" ? "IdleStatusLabelColor2" : "InvisibleStatusLabelColor2")}>{(currentMemberDataToEdit as any).status}</div>
                <div className="EditMemberLabelClass">Member Biography</div>
                <textarea id="EditMemberBiographyTextArea" value={(currentMemberDataToEdit as any).biography} readOnly/>
                <div className="EditMemberLabelClass">Member Roles</div>
                <div id="EditMemberRolesContainerDiv">
                  {canEditRoles == true && (<button id="EditMemberRolesAddRoleButton" title="Add Role" onClick={AddRoleToMemberButton}>+</button>)}
                  {currentMemberDataToEdit != null && (
                    <div id="MemberRolesDiv">
                      {(currentMemberDataToEdit as any).roles_array.sort((roleDataA: any, roleDataB: any) => roleDataA.role_rank - roleDataB.role_rank).map((roleData: any) => (
                        <div className="RoleDiv" style={{color: roleData.role_color}} key={roleData.role_id + roleData.role_color} id={roleData.role_id + roleData.role_color}>
                          <div className="RoleDotDiv" style={{backgroundColor: roleData.role_color}}></div>
                          {roleData.role_name}
                          {canEditRoles == true && (<button className="RoleRemoveButton" onClick={() => RemoveRoleFunction(roleData)}>-</button>)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {displayEditRole == true && (
            <div id="EditRolesScreenDiv">
              <div id="EditRolesMainContainerDiv">
                <div id="EditRolesHeaderDiv">
                  Edit Role
                  <img id="EditRoleExitButton" src={ExitIcon} alt="Exit Edit Role" onClick={ExitEditRoleButton}></img>
                </div>
                <div className="EditRolesLabelClass">Role Name</div>
                <input className={`EditRolesInputClass ${isUpdatedRoleNameValid == true ? "" : "InvalidInput2"}`} placeholder="Edit Role Name Here..." type="text" value={updatedRoleName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setUpdatedRoleName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsUpdatedRoleNameValid(true);
                    setHasUpdatedRoleName(true);
                  } else {
                    setIsUpdatedRoleNameValid(false);
                  };
                }}/>
                {isUpdatedRoleNameValid == false && (<div className="UpdateRoleErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="EditRolesLabelClass">Role Color</div>
                <input className={`EditRolesInputClass`} type="color" value={updatedRoleColor} onChange={updateEditRoleColor}/>
                <div className="EditRolesLabelClass">Role Rank</div>
                <input className={`EditRolesInputClass ${isUpdatedRoleRankValid == true ? "" : "InvalidInput2"}`} placeholder="0" type="number" value={updatedRoleRank} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let rank = parseInt(event.target.value);
                  setUpdatedRoleRank(rank);
                  if (rank >= 0 && rank <= 9) {
                    setIsUpdatedRoleRankValid(true);
                    setHasUpdatedRoleRank(true);
                  } else {
                    setIsUpdatedRoleRankValid(false);
                  };
                }}/>
                {isUpdatedRoleRankValid == false && (<div className="UpdateRoleErrorDiv">Role Rank Must Be From 0-9 Only!</div>)}
                <div className="EditRolesLabelClass">Can Kick Lower Rank Members</div>
                <div className="EditRolesRadioButtonDiv">
                  <label className="EditRolesRadioButtonClass">Yes<input type="radio" name="CanKickLowerRankMembers" value="Yes" checked={updateRoleCanKickLowerRankMembers == true} onChange={() => setUpdateRoleCanKickLowerRankMembersFunction(true)}></input></label>
                  <label className="EditRolesRadioButtonClass">No<input type="radio" name="CanKickLowerRankMembers" value="No" checked={updateRoleCanKickLowerRankMembers == false} onChange={() => setUpdateRoleCanKickLowerRankMembersFunction(false)}></input></label>
                </div>
                <div className="EditRolesLabelClass">Can Ban Lower Rank Members</div>
                <div className="EditRolesRadioButtonDiv">
                  <label className="EditRolesRadioButtonClass">Yes<input type="radio" name="CanBanLowerRankMembers" value="Yes" checked={updateRoleCanBanLowerRankMembers == true} onChange={() => setUpdateRoleCanBanLowerRankMembersFunction(true)}></input></label>
                <label className="EditRolesRadioButtonClass">No<input type="radio" name="CanBanLowerRankMembers" value="No" checked={updateRoleCanBanLowerRankMembers == false} onChange={() => setUpdateRoleCanBanLowerRankMembersFunction(false)}></input></label>
                </div>
                <div className="EditRolesLabelClass">Can Edit Lower Rank Member Roles</div>
                <div className="EditRolesRadioButtonDiv">
                  <label className="EditRolesRadioButtonClass">Yes<input type="radio" name="canEditLowerRankMemberRoles" value="Yes" checked={updateRoleCanEditLowerRankMembers == true} onChange={() => setUpdateRoleCanEditLowerRankMembersFunction(true)}></input></label>
                  <label className="EditRolesRadioButtonClass">No<input type="radio" name="canEditLowerRankMemberRoles" value="No" checked={updateRoleCanEditLowerRankMembers == false} onChange={() => setUpdateRoleCanEditLowerRankMembersFunction(false)}></input></label>
                </div>
                <button className="UpdatedRoleButtonClass" id="UpdateRoleButton" onClick={UpdateRoleFunction}>Update Role</button>
              </div>
            </div>
          )}
          {displayCreateNewRoles == true && (
            <div id="CreateRolesScreenDiv">
              <div id="CreateRolesMainContainerDiv">
                <div id="CreateRolesHeaderDiv">
                  Create Roles
                  <img id="CreateRolesExitButton" src={ExitIcon} alt="Exit Create Roles" onClick={ExitCreateNewRoleButton}></img>
                </div>
                <div className="CreateRolesLabelClass">Role Name</div>
                <input className={`CreateRolesInputClass ${isCreateRoleNameValid == true ? "" : "InvalidInput2"}`} placeholder="Create Role Name Here..." type="text" value={createNewRoleName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setCreateNewRoleName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsCreateRoleNameValid(true);
                    setHasDataForNewRoleName(true);
                  } else {
                    setIsCreateRoleNameValid(false);
                  };
                }}/>
                {isCreateRoleNameValid == false && (<div className="CreateNewRoleErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="CreateRolesLabelClass">Role Color</div>
                <input className={`CreateRolesInputClass`} type="color" value={createNewRoleColor} onChange={updateRoleColor}/>
                <div className="CreateRolesLabelClass">Can Kick Lower Rank Members</div>
                <div className="CreateRolesRadioButtonDiv">
                  <label className="CreateRolesRadioButtonClass">Yes<input type="radio" name="CanKickLowerRankMembers" value="Yes" checked={canKickLowerRankMembers == true} onChange={() => setCanKickLowerRankMembers(true)}></input></label>
                  <label className="CreateRolesRadioButtonClass">No<input type="radio" name="CanKickLowerRankMembers" value="No" checked={canKickLowerRankMembers == false} onChange={() => setCanKickLowerRankMembers(false)}></input></label>
                </div>
                <div className="CreateRolesLabelClass">Can Ban Lower Rank Members</div>
                <div className="CreateRolesRadioButtonDiv">
                  <label className="CreateRolesRadioButtonClass">Yes<input type="radio" name="CanBanLowerRankMembers" value="Yes" checked={canBanLowerRankMembers == true} onChange={() => setCanBanLowerRankMembers(true)}></input></label>
                <label className="CreateRolesRadioButtonClass">No<input type="radio" name="CanBanLowerRankMembers" value="No" checked={canBanLowerRankMembers == false} onChange={() => setCanBanLowerRankMembers(false)}></input></label>
                </div>
                <div className="CreateRolesLabelClass">Can Edit Lower Rank Member Roles</div>
                <div className="CreateRolesRadioButtonDiv">
                  <label className="CreateRolesRadioButtonClass">Yes<input type="radio" name="canEditLowerRankMemberRoles" value="Yes" checked={canEditLowerRankMemberRoles == true} onChange={() => setCanEditLowerRankMemberRoles(true)}></input></label>
                  <label className="CreateRolesRadioButtonClass">No<input type="radio" name="canEditLowerRankMemberRoles" value="No" checked={canEditLowerRankMemberRoles == false} onChange={() => setCanEditLowerRankMemberRoles(false)}></input></label>
                </div>
                <button className="CreateRoleButtonClass" id="CreateRoleButton" onClick={CreateRoleFunction}>Create Role</button>
                <div className="CreateRolesLabelClass">Roles (Sorted From Highest To Lowest)</div>
                <div id="rolesContainerDiv">{currentRoleData.map((roleData: any) => (<button id={roleData.role_id} key={roleData.role_id} className="EditRoleButtonClass" style={{color: roleData.role_color}} onClick={() => EditRoleFunction(roleData)}>Edit Role: {roleData.role_name}</button>))}</div>
              </div>
            </div>
          )};
          {displayEditChannel == true && (
            <div id="EditChannelScreenDiv">
              <div id="EditChannelMainContainerDiv">
                <div id="EditChannelHeaderDiv">
                  Edit Channel
                  <img id="EditChannelExitButton" src={ExitIcon} alt="Exit Edit Channel" onClick={ExitEditChannelButton}></img>
                </div>
                <div className="EditChannelLabelClass">Channel Name</div>
                <input className={`EditChannelInputClass ${isUpdatedChannelNameValid == true ? "" : "InvalidInput2"}`} placeholder="Edit Channel Name Here..." type="text" value={updatedChannelName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setUpdatedChannelName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsUpdatedChannelNameValid(true);
                    setHasUpdatedChannelName(true);
                  } else {
                    setIsUpdatedChannelNameValid(false);
                  };
                }}/>
                {isUpdatedChannelNameValid == false && (<div className="EditChannelErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="EditChannelLabelClass">Channel Description</div>
                <textarea placeholder="Edit Channel Description Here..." id="EditChannelDescriptionTextArea" className={`${isUpdatedChannelDescriptionValid == true ? "" : "InvalidInput3"}`} onChange={updateChannelDescriptionFunction} value={updatedChannelDescription}/> 
                {isUpdatedChannelDescriptionValid == false && (<div className="EditChannelErrorDiv">Channel Description Can Have Up To 500 Characters Maximum!</div>)}
                <button className="UpdateChannelButtonClass" id="UpdateChannelButton" onClick={UpdateChannel}>Update Channel</button>
              </div>
            </div>
          )}
          {displayCreateNewChannels == true && (
            <div id="CreateChannelsScreenDiv">
              <div id="CreateChannelsMainContainerDiv">
                <div id="CreateChannelHeaderDiv">
                  Create Channel
                  <img id="CreateChannelExitButton" src={ExitIcon} onClick={ExitCreateChannelButton} alt="Exit Create Channel"></img>
                </div>
                <div className="CreateChannelLabelClass">Channel Name</div>
                <input className={`CreateChannelInputClass ${isCreateChannelNameValid == true ? "" : "InvalidInput2"}`} placeholder="Channel Name Here..." type="text" value={createNewChannelName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setCreateNewChannelName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsCreateChannelNameValid(true);
                    setHasDataForCreateChannelName(true);
                  } else {
                    setIsCreateChannelNameValid(false);
                  };
                }}/>
                {isCreateChannelNameValid == false && (<div className="CreateChannelErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="CreateChannelLabelClass">Channel Description</div>
                <textarea placeholder="Channel Description Here..." id="CreateChannelDescriptionTextArea" className={`${isCreateChannelDescriptionValid == true ? "" : "InvalidInput3"}`} onChange={createNewChannelDescriptionFunction} value={createNewChannelDescription}/>
                {isCreateChannelDescriptionValid == false && (<div className="CreateChannelErrorDiv">Channel Description Can Have Up To 500 Characters Maximum!</div>)}
                <button className="CreateChannelButtonClass" id="CreateChannelButton" onClick={CreateNewChannel}>Create Channel</button>
              </div>
            </div>
          )}
          {displayUpdateServerSettings == true && (
            <div id="ServerSettingsScreenDiv">
              <div id="ServerSettingsMainContainerDiv">
                <div id="ServerSettingsHeaderDiv">
                  Server Settings
                  <img id="ServerSettingsExitButton" src={ExitIcon} onClick={ExitServerSettingsButton} alt="Exit Server Settings"></img>
                </div>
                <div className="ServerSettingsLabelClass">Server Id</div>
                <div id="ServerSettingsUsernameLabel" className="ServerSettingsLabelClass">{(currentServerInfo as any).server_id}</div>
                <div className="ServerSettingsLabelClass">Server Icon</div>
                <div>
                  <img id="ServerSettingsIcon" src={updatedServerIcon} alt="Server Icon" onClick={OpenFilePickerForServerSettingsIcon}></img>
                  <input id="ServerSettingsIconInput" type="file" accept="image/*" hidden onChange={SelectImageForServerIcon}></input>
                </div>
                <div className="ServerSettingsLabelClass">Server Name</div>
                <input className={`ServerSettingsInputClass ${isUpdatedServerNameValid == true ? "" : "InvalidInput2"}`} placeholder="Update Server Name Here..." type="text" value={updatedServerName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setUpdatedServerName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsUpdatedServerNameValid(true);
                  } else {
                    setIsUpdatedServerNameValid(false);
                  };
                  setHasUpdatedServerName(true);
                }}/>
                {isUpdatedServerNameValid == false && (<div className="ServerSettingsErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="ServerSettingsLabelClass">Server Thumbnail</div>
                <div>
                  <img id="ServerSettingsThumbnail" src={updatedServerThumbnail} alt="Server Thumbnail" onClick={OpenFilePickerForServerSettingsThumbnail}></img>
                  <input id="ServerSettingsThumbnailInput" type="file" accept="image/*" hidden onChange={SelectImageForServerThumbnail}></input>
                </div>
                <div className="ServerSettingsLabelClass">Server Description</div>
                <textarea placeholder="Update Server Description Here..." id="ServerSettingsDescriptionTextArea" className={`${isUpdatedServerDescriptionValid == true ? "" : "InvalidInput3"}`} onChange={UpdateServerDescription} value={updatedServerDescription}/>
                {isUpdatedServerDescriptionValid == false && (<div className="ServerSettingsErrorDiv">Server Description Can Have Up To 500 Characters Maximum!</div>)}
                <button className="ServerSettingsButtonClass" id="CreateNewChannelsButton" onClick={displayCreateNewChannelsPanel}>Create New Channels</button>
                <button className="ServerSettingsButtonClass" id="CreateNewRolesButton" onClick={displayCreateNewRolesPannel}>Create New Roles</button>
                <button className="ServerSettingsButtonClass" id="CreateNewServerButton" onClick={UpdateServerSettings}>Update Server Settings</button>
              </div>
            </div>
          )}
          {displayCreateNewServer == true && (
            <div id="CreateNewServerScreenDiv">
              <div id="CreateNewServerScreenMainContainerDiv">
                <div id="CreateNewServerScreenHeaderDiv">
                  Create New Server
                  <img id="CreateNewServerExitButton" src={ExitIcon} onClick={ExitCreateNewServerButton} alt="Exit Create New Server"></img>
                </div>
                <div>
                  <img id="CreateNewServerIconImage" src={createNewServerIcon} alt="Server Icon" onClick={OpenFilePickerForCreateNewServer}></img>
                  <input id="CreateNewServerIconImageInput" type="file" accept="image/*" hidden onChange={SelectImageForCreateNewServer}></input>
                </div>
                <div className="CreateNewServerLabelClass">Server Name</div>
                <input className={`CreateNewServerInputClass ${isCreateNewServerNameValid == true ? "" : "InvalidInput2"}`} placeholder="Server Name Here..." type="text" value={createNewServerName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setCreateNewServerName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsCreateNewServerNameValid(true);
                    setHasDataForCreateNewServerName(true);
                  } else {
                    setIsCreateNewServerNameValid(false);
                  };
                }}/>
                {isCreateNewServerNameValid == false && (<div className="CreateNewServerErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <button className="CreateNewServerButtonClass" id="CreateNewServerButton" onClick={CreateNewServer}>Create Server</button>
                <button className="CreateNewServerButtonClass" id="CreateNewServerJoinServerButton" onClick={DisplayJoinServerButton}>Join Server</button>
              </div>
            </div>
          )}
          {displayUserSettings == true && (
            <div id="UserSettingsScreenDiv">
              <div id="UserSettingsMainContainerDiv">
                <div id="UserSettingsHeaderDiv">
                  User Settings
                  <img id="UserSettingsExitButton" src={ExitIcon} onClick={ExitUserSettingsButton} alt="Exit User Settings"></img>
                </div>
                <div className="UserSettingsLabelClass">Profile Picture</div>
                <div>
                  <img id="UserSettingsPFP" src={currentPFP} alt="Profile Picture" onClick={OpenFilePickerForUserProfilePicture} className={(userData.status === "Online" ? "OnlineBackgroundPFPColor" : userData.status === "Do Not Disturb" ? "DoNotDisturbBackgroundPFPColor" : userData.status === "Idle" ? "IdleBackgroundPFPColor" : "InvisibleBackgroundPFPColor")}></img>
                  <input id="ProfilePictureInput" type="file" accept="image/*" hidden onChange={SelectImageForUserProfilePicture}></input>
                </div>
                <div className="UserSettingsLabelClass">Username</div>
                <div id="UserSettingsUsernameLabel" className="UserSettingsLabelClass">{userData.username}</div>
                <div className="UserSettingsLabelClass">Display Name</div>
                <input className={`UserSettingsInputClass ${isUpdatedDisplayNameValid == true ? "" : "InvalidInput2"}`} placeholder="Update Display Name Here..." type="text" value={updatedDisplayName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let initialString = event.target.value;
                  let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
                  setUpdatedDisplayName(event.target.value);
                  if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
                    setIsUpdatedDisplayNameValid(true);
                  } else {
                    setIsUpdatedDisplayNameValid(false);
                  };
                  setHasUpdatedDisplayName(true);
                }}/>
                {isUpdatedDisplayNameValid == false && (<div className="UpdateAccountErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
                <div className="UserSettingsLabelClass">Biography</div>
                <textarea placeholder="Update Biography Here..." id="UserSettingsBiographyTextArea" className={`${isUpdatedBiographyValid == true ? "" : "InvalidInput3"}`} onChange={UpdateBiography} value={updatedBiography}/>
                {isUpdatedBiographyValid == false && (<div className="UpdateAccountErrorDiv">Biography Can Have Up To 500 Characters Maximum!</div>)}
                <div className="UserSettingsLabelClass">Change Password</div>
                <input placeholder="Update Password Here..." className={`UserSettingsInputClass ${isUpdatedPasswordValid == true ? "" : "InvalidInput2"}`} value={updatedPassword} type="password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setUpdatedPassword(event.target.value);
                  if (event.target.value.length >= 8 && event.target.value.length <= 99) {
                    setIsUpdatedPasswordValid(true);
                  } else {
                    setIsUpdatedPasswordValid(false);
                  };
                  setHasUpdatedPassword(true);
                }}/>
                {isUpdatedPasswordValid == false && (<div className="UpdateAccountErrorDiv">8 Minimum Characters Up To 99 Maximum Characters Only!</div>)}
                <div className="UserSettingsLabelClass">Status</div>
                <div id="UserStatusDiv">
                  <label className="UserStatusLabel" id="OnlineStatusLabel">
                    <input type="radio" name="UserStatus" value="Online" checked={updatedStatus == "Online"} onChange={(event) => setUpdatedStatus(event.target.value)}/>
                    Online
                  </label>
                  <label className="UserStatusLabel" id="DoNotDisturbStatusLabel">
                    <input type="radio" name="UserStatus" value="Do Not Disturb" checked={updatedStatus == "Do Not Disturb"} onChange={(event) => setUpdatedStatus(event.target.value)}/>
                    Do Not Disturb
                  </label>
                  <label className="UserStatusLabel" id="IdleStatusLabel">
                    <input type="radio" name="UserStatus" value="Idle" checked={updatedStatus == "Idle"} onChange={(event) => setUpdatedStatus(event.target.value)}/>
                    Idle
                  </label>
                  <label className="UserStatusLabel" id="InvisibleStatusLabel">
                    <input type="radio" name="UserStatus" value="Invisible" checked={updatedStatus == "Invisible"} onChange={(event) => setUpdatedStatus(event.target.value)}/>
                    Invisible
                  </label>
                </div>
                <button className="CreateNewAccountButtonClass" id="UserSettingsSaveChangesButton" onClick={UpdateUserSettings}>Save Changes</button>
                <button className="CreateNewAccountButtonClass" id="UserSettingsLogOutButton" onClick={LogoutButton}>Log Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  if (createNewAccountScreen == true) {
    return (
      <div id="CreateNewAccountDiv">
        <img id="CreateNewAccountDiscordLogo" src={DiscordLogo} alt="Discord Icon"></img>
        <div id="CreateNewAccountMainDiv">
          <div id="CreateNewAcountTextDiv1" className="CreateNewAccountTextDivClass">Create An Account</div>
          <div id="CreateNewAcountTextDiv2" className="CreateNewAccountTextDivClass">Display Name</div>
          <input required className={`CreateNewAccountInputClass ${isCreateNewAccountDisplayNameValid == true ? "" : "InvalidInput"}`} placeholder="Enter Display Name Here..." type="text" value={newDisplayName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let initialString = event.target.value;
            let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
            setNewDisplayName(event.target.value);
            if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
              setIsCreateNewAccountDisplayNameValid(true);
            } else {
              setIsCreateNewAccountDisplayNameValid(false);
            };
          }}/>
          {isCreateNewAccountDisplayNameValid == false && (<div className="CreateNewAccountErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
          <div id="CreateNewAcountTextDiv3" className="CreateNewAccountTextDivClass">Username</div>
          <input required className={`CreateNewAccountInputClass ${isCreateNewAccountUserNameValid == true ? "" : "InvalidInput"}`} placeholder="Enter Username Here..." type="text" value={newUsername} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let initialString = event.target.value;
            let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
            setNewUserName(event.target.value);
            if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
              setIsCreateNewAccountUserNameValid(true);
            } else {
              setIsCreateNewAccountUserNameValid(false);
            };
          }}/>
          {isCreateNewAccountUserNameValid == false && (<div className="CreateNewAccountErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
          <div id="CreateNewAcountTextDiv4" className="CreateNewAccountTextDivClass">Password</div>
          <input required className={`CreateNewAccountInputClass ${isCreateNewAccountPasswordNameValid == true ? "" : "InvalidInput"}`} placeholder="Enter Password Here..." type="password" value={newPassword} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPassword(event.target.value);
            if (event.target.value.length >= 8 && event.target.value.length <= 99) {
              setIsCreateNewAccountPasswordNameValid(true);
            } else {
              setIsCreateNewAccountPasswordNameValid(false);
            };
          }}/>
          {isCreateNewAccountPasswordNameValid == false && (<div className="CreateNewAccountErrorDiv">8 Minimum Characters Up To 99 Maximum Characters Only!</div>)}
          <button className={`CreateNewAccountButtonClass ${isCreateNewAccountDisplayNameValid && isCreateNewAccountUserNameValid && isCreateNewAccountPasswordNameValid ? "" : "InvalidInputButton"}`} onClick={CreateNewAccount}>Create Account</button>
          <button className="CreateNewAccountButtonClass" onClick={DisplayLoginScreen}>Return To Login Screen</button>
        </div>
      </div>
    );
  };
  if (loginScreen == true) {
    return (
      <div id="LoginScreenDiv">
        <img id="LoginScreenDiscordLogo" src={DiscordLogo} alt="Discord Icon"></img>
        <div id="LoginMainDiv">
          <div id="LoginTextDiv1" className="LoginTextDivClass">Your Not Welcome Back!</div>
          <div id="LoginTextDiv2" className="LoginTextDivClass">We Were So Exicted NOT To See You Again, TOUCH GRASS!</div>
          <div id="LoginTextDiv3" className="LoginTextDivClass">Username</div>
          <input required className={`LoginDivInputClass ${userNameValid == true ? "" : "InvalidInput"}`} placeholder="Enter Your Username Here..." type="text" value={username} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            let initialString = event.target.value;
            let sanitizedString = initialString.replace(/[^a-zA-Z0-9_]/g, "");
            setUsername(event.target.value);
            if (initialString.length <= 99 && initialString == sanitizedString && sanitizedString.length > 0) {
              setUserNameValid(true);
            } else {
              setUserNameValid(false);
            };
          }}/>
          {userNameValid == false && (<div className="CreateNewAccountErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
          <div id="LoginTextDiv4" className="LoginTextDivClass">Password</div>
          <input required className={`LoginDivInputClass ${passwordValid == true ? "" : "InvalidInput"}`} placeholder="Enter Your Password Here..." type="password" value={password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
            if (event.target.value.length >= 8 && event.target.value.length <= 99) {
              setPasswordValid(true);
            } else {
              setPasswordValid(false);
            };
          }}/>
          {passwordValid == false && (<div className="CreateNewAccountErrorDiv">8 Minimum Characters Up To 99 Maximum Characters Only!</div>)}
          <div id="LoginTextDiv5" className="LoginTextDivClass">Forgot Your Password? YOUR COOKED!</div>
          <button className={`CreateNewAccountButtonClass ${userNameValid && passwordValid ? "" : "InvalidInputButton"}`} onClick={Login}>Log In</button>
          <button className="LoginScreenDivButtonClass" onClick={DisplayCreateNewAccountScreen}>Create New Account</button>
        </div>
      </div>
    );
  };
  return (
    <div>THIS SHOULD NOT BE DISPLAYED!</div>
  );
};

/*
==================================================
Export Main Function
==================================================
*/
export default Main;