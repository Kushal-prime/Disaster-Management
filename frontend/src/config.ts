// API base URL for backend (no trailing slash). Set REACT_APP_API_URL in production.
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

// WebSocket URL derived from API_BASE if REACT_APP_WS_URL not set
export const WS_URL =
  process.env.REACT_APP_WS_URL ||
  API_BASE.replace(/^http/, "ws") + "/ws/live";
