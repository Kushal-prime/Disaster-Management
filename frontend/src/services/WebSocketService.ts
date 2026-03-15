// frontend/src/services/WebSocketService.ts
type MessageCallback = (data: any) => void;
type ConnectionCallback = (connected: boolean) => void;

export class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private url: string;
  private apiBase: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 2000;
  private pollingTimer: any = null;
  private isPollingActive = false;

  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];

  private constructor(url: string) {
    this.url = url;
    // Derive API base from WebSocket URL (e.g., ws://... -> http://...)
    this.apiBase = url.replace(/^ws/, "http").replace(/\/ws\/live$/, "");
    this.connect();
  }

  // Singleton getter
  public static getInstance(url?: string): WebSocketService {
    if (!WebSocketService.instance) {
      if (!url) throw new Error("WebSocket URL must be provided for the first instance");
      WebSocketService.instance = new WebSocketService(url);
    } else if (url && WebSocketService.instance.url !== url) {
      WebSocketService.instance.changeUrl(url);
    }
    return WebSocketService.instance;
  }

  private connect() {
    this.stopPolling(); // Stop polling if we're trying to connect via WS

    try {
      this.socket = new WebSocket(this.url);
    } catch (err) {
      console.error("WebSocket connection failed immediately", err);
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.connectionCallbacks.forEach(cb => cb(true));
      console.log(`⚡ WebSocket connected to ${this.url}`);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageCallbacks.forEach(cb => cb(data));
      } catch (err) {
        console.error("❌ WebSocket message parse error", err);
      }
    };

    this.socket.onerror = () => {};

    this.socket.onclose = () => {
      this.connectionCallbacks.forEach(cb => cb(false));
      console.warn(`⚠️ WebSocket disconnected. Reconnecting... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error("❌ Max WebSocket reconnect attempts reached. Falling back to HTTP Polling...");
      this.startPolling();
    }
  }

  private async startPolling() {
    if (this.isPollingActive) return;
    this.isPollingActive = true;
    console.log("📡 Starting HTTP Polling fallback to:", `${this.apiBase}/api/sensors`);
    console.log("ℹ️ Check browser DevTools network tab if data doesn't appear.");

    // Mark as connected so UI shows data, but maybe with a "polling" status
    this.connectionCallbacks.forEach(cb => cb(true));

    const poll = async () => {
      if (!this.isPollingActive) return;
      try {
        const response = await fetch(`${this.apiBase}/api/sensors`);
        if (response.ok) {
          const data = await response.json();
          this.messageCallbacks.forEach(cb => cb(data));
        }
      } catch (err) {
        console.error("❌ Polling error:", err);
      }
      this.pollingTimer = setTimeout(poll, 1000); // Poll every 1 second
    };

    poll();
  }

  private stopPolling() {
    this.isPollingActive = false;
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  // Change URL dynamically
  public changeUrl(newUrl: string) {
    if (this.url === newUrl) return;
    console.log("🔄 Changing WebSocket URL to:", newUrl);
    this.url = newUrl;
    this.apiBase = newUrl.replace(/^ws/, "http").replace(/\/ws\/live$/, "");
    this.reconnectAttempts = 0;
    this.socket?.close();
    this.stopPolling();
    this.connect();
  }

  public send(msg: any) {
    if (this.isConnected()) {
      this.socket!.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket not connected. Message not sent:", msg);
    }
  }

  public onMessage(cb: MessageCallback) {
    this.messageCallbacks.push(cb);
  }

  public offMessage(cb: MessageCallback) {
    this.messageCallbacks = this.messageCallbacks.filter(c => c !== cb);
  }

  public onConnectionChange(cb: ConnectionCallback) {
    this.connectionCallbacks.push(cb);
  }

  public offConnectionChange(cb: ConnectionCallback) {
    this.connectionCallbacks = this.connectionCallbacks.filter(c => c !== cb);
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN || this.isPollingActive;
  }
}
