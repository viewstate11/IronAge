import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

function initializeTelegram() {
  const webApp =
    window.Telegram?.WebApp;

  if (!webApp) {
    console.warn(
      "IRONAGE: Telegram WebApp is not available."
    );

    return;
  }

  try {
    webApp.ready?.();
    webApp.expand?.();

  } catch (error) {
    console.error(
      "IRONAGE: Telegram bootstrap error:",
      error
    );
  }
}

initializeTelegram();

const root =
  document.getElementById("root");

if (!root) {
  throw new Error(
    "IRONAGE: #root element not found"
  );
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
