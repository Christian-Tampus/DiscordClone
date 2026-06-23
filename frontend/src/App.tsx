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
import {useEffect, useState} from "react";
import DiscordLogo from "./assets/DiscordLogo.jpg";
import WhiteDiscordLogo from "./assets/DiscordWhiteLogo.png";
import GearsIcon from "./assets/GearsIcon.png";
import ExitIcon from "./assets/ExitIcon.png";
import "./App.css";

/*
==================================================
Function App
==================================================
*/
function Main() {
  /*
  Array Destructoring => [variableName, functionThatUpdatesVariableName] = useState("")
  useState returns an array with the variable and function that updates it, the variable is initialized as empty string
  */
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
  function UserSettingsButton() {
    setDisplayUserSettings(true);
  };
  function ExitUserSettingsButton() {
    setDisplayUserSettings(false);
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
            <div id="ServersDiv"></div>
            <div className="ServerListDivider"></div>
            <div id="UserSettingsDiv" className="toolTipWrapper" onClick={UserSettingsButton}>
              <img id="UserSettingsButton" src={GearsIcon} alt="User Settings"></img>
              <div className="toolTip">User Settings</div>
            </div>
          </div>
          <div id="ChatContainerDiv"></div>
          {displayUserSettings == true && (
            <div id="UserSettingsScreenDiv">
              <div id="UserSettingsMainContainerDiv">
                <div id="UserSettingsHeaderDiv">
                  User Settings
                  <img id="UserSettingsExitButton" src={ExitIcon} onClick={ExitUserSettingsButton} alt="Exit User Settings"></img>
                </div>
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
            if (initialString.length <= 99 && initialString == sanitizedString) {
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
            if (initialString.length <= 99 && initialString == sanitizedString) {
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
            if (initialString.length <= 99 && initialString == sanitizedString) {
              setUserNameValid(true);
            } else {
              setUserNameValid(false);
            };
          }}/>
          {userNameValid == false && (<div className="CreateNewAccountErrorDiv">Alphanumerical Characters & 99 Maximum Characters Only!</div>)}
          <div id="LoginTextDiv4" className="LoginTextDivClass">Password</div>
          <input required className={`LoginDivInputClass ${passwordValid == true ? "" : "InvalidInput"}`} placeholder="Enter Your Password Here..." type="password" value={password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value)
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