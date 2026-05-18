/**
 * Configuración centralizada de URLs para la API.
 * En producción, usar variables de entorno VITE_*.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || "http://localhost:3000";

export const WS_PATH = "/ws";

/** Key usada en localStorage para persistir el JWT */
export const TOKEN_KEY = "fixit_token";
