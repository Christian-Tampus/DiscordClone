/*
==================================================
Program Start
==================================================
*/
console.log("[SYSTEM MESSAGE] main.tsx Program Start!");

/*
==================================================
Dependencies
==================================================
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/*
==================================================
ReactDOM
==================================================
*/
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

/*
==================================================
Program End
==================================================
*/
console.log("[SYSTEM MESSAGE] main.tsx Program End!");