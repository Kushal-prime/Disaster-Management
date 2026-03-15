// API base URL for backend (no trailing slash). Set REACT_APP_API_URL in production.
const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const API_BASE = rawApiUrl.replace(/\/$/, "");

// WebSocket URL derived from API_BASE if REACT_APP_WS_URL not set
export const WS_URL =
  process.env.REACT_APP_WS_URL ||
  API_BASE.replace(/^http/, "ws") + "/ws/live";
