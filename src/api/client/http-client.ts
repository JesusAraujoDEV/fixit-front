import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "./config";

/**
 * Cliente HTTP pre-configurado con:
 * - Base URL del backend
 * - Inyección automática del JWT en cada request
 * - Interceptor de errores para manejar 401 (token expirado)
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: inyectar token ────────────────────────────────────
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: manejar errores de auth ──────────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const code = error.response.data?.code;
      if (code === "token_expired" || code === "token_invalid") {
        // Limpiar token inválido y forzar re-login
        localStorage.removeItem(TOKEN_KEY);
        // Emitir evento custom para que el SessionProvider reaccione
        window.dispatchEvent(new CustomEvent("fixit:session-expired"));
      }
    }
    return Promise.reject(error);
  },
);

export default httpClient;
