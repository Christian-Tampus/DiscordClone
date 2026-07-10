/*
==================================================
Program Start
==================================================
*/
console.log("[SYSTEM MESSAGE] App.tsx Program Start!");

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
import "./App.css";

/*
==================================================
Function App
==================================================
*/
function Main() {
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
        const data = await response.json();
        setUserData(data);
        if (data.profile_picture != "") {
          setCurrentPFP("http://localhost:5000" + data.profile_picture);
        } else {
          setCurrentPFP(PlaceHolderPFP);
        };
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
    let UserSettingsToUpdate = {
      username: userData.username,
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
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    };
  };
  async function CreateNewServer() {
    console.log("hasDataForCreateNewServerIcon:",hasDataForCreateNewServerIcon,"createNewServerIconFile:",createNewServerIconFile,"hasDataForCreateNewServerName:",hasDataForCreateNewServerName,"isCreateNewServerNameValid:",isCreateNewServerNameValid);
    if (hasDataForCreateNewServerIcon == true && createNewServerIconFile != null && hasDataForCreateNewServerName == true && isCreateNewServerNameValid == true) {
      console.log("CREATE NEW SERVER!");
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
      } else {
        const errorCode = await response.json();
        alert(errorCode.error);
      };
    } else {
      alert("[ERROR] Invalid Input For Server Name Or You Have Not Selected A Server Icon!");
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
  function LogoutButton() {
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
  function OpenFilePickerForUserProfilePicture() {
    document.getElementById("ProfilePictureInput")?.click();
  };
  function OpenFirePickerForCreateNewServer() {
    document.getElementById("CreateNewServerIconImageInput")?.click();
  };
  if (userData) {
    return (
      <div id="MainPageDiv">
        <div id="HeaderBar">Server Name</div>
        <div id="MainContainerDiv">
          <div id="ServersContainerDiv">
            <div id="DirectMessageButtonDivContainer" className="toolTipWrapper" onClick={DirectMessagesButton}>
              <img id="DirectMessageButton" src={WhiteDiscordLogo} alt="Direct Messages"></img>
              <div className="toolTip">Direct Messages</div>
            </div>
            <div className="ServerListDivider"></div>
            <div id="ServersDiv">
              {
                /*
                DISPLAY SERVER ICONS HERE!
                DISPLAY SERVER ICONS HERE!
                DISPLAY SERVER ICONS HERE!
                DISPLAY SERVER ICONS HERE!
                DISPLAY SERVER ICONS HERE!
                */
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
          <div id="ChatContainerDiv"></div>
          {displayCreateNewServer == true && (
            <div id="CreateNewServerScreenDiv">
              <div id="CreateNewServerScreenMainContainerDiv">
                <div id="CreateNewServerScreenHeaderDiv">
                  Create New Server
                  <img id="CreateNewServerExitButton" src={ExitIcon} onClick={ExitCreateNewServerButton} alt="Exit Create New Server"></img>
                </div>
                <div id="CreateNewServerIconDiv">
                  <img id="CreateNewServerIconImage" src={createNewServerIcon} alt="Server Icon" onClick={OpenFirePickerForCreateNewServer}></img>
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
                <div className="UserSettingsLabelClass" id="ProfilePictureLabel">Profile Picture</div>
                <div id="UserSettingsPFPDiv">
                  <img id="UserSettingsPFP" src={currentPFP} alt="Profile Picture" onClick={OpenFilePickerForUserProfilePicture}></img>
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
  if (loginScreen == true)
  {
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

/*
==================================================
Program End
==================================================
*/
console.log("[SYSTEM MESSAGE] App.tsx Program End!");