import { io, Socket } from "socket.io-client";
import { WS_BASE_URL, WS_PATH, TOKEN_KEY } from "./config";

let socket: Socket | null = null;

/**
 * Conecta al servidor de WebSockets enviando el JWT en el handshake.
 * Si ya existe una conexión activa, la retorna sin reconectar.
 */
export function connectSocket(token?: string): Socket {
  if (socket?.connected) return socket;

  const authToken = token || localStorage.getItem(TOKEN_KEY);

  socket = io(WS_BASE_URL, {
    path: WS_PATH,
    auth: { token: authToken },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    reconnectionAttempts: Infinity,
    transports: ["websocket", "polling"],
  });

  // Heartbeat: responder pings del servidor
  socket.on("ping", () => {
    socket?.emit("pong");
  });

  return socket;
}

/**
 * Retorna la instancia actual del socket (puede ser null si no se ha conectado).
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Desconecta y limpia la instancia del socket.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
