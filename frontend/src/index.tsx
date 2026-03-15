// frontend/src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Updated WebSocket + Redux Provider
import { WebSocketStoreProvider } from "./providers/WebSocketProvider";

import { WS_URL } from "./config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebSocketStoreProvider initialUrl={WS_URL}>
      <App />
    </WebSocketStoreProvider>
  </React.StrictMode>
);
