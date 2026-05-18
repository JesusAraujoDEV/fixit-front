import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";
import { useSession as useSessionQuery, useLogout as useLogoutHook } from "@/api/hooks";
import { connectSocket, disconnectSocket, TOKEN_KEY } from "@/api/client";
import type { User, UserRole } from "@/api/types";

// Re-export para compatibilidad con AuthScreen
export type { UserRole } from "@/api/types";

type SessionState = {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionState>({
  user: null,
  role: "client",
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutFn = useLogoutHook();

  // Query para restaurar sesión desde token existente
  const sessionQuery = useSessionQuery();

  // Sincronizar query con estado local
  useEffect(() => {
    if (sessionQuery.data) {
      setUser(sessionQuery.data);
      setIsAuthenticated(true);
      // Conectar WebSocket al restaurar sesión
      connectSocket();
    }
  }, [sessionQuery.data]);

  // Escuchar evento de sesión expirada (disparado por el interceptor HTTP)
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      disconnectSocket();
      toast.error("Sesión expirada", {
        description: "Por favor, inicia sesión nuevamente.",
      });
    };

    window.addEventListener("fixit:session-expired", handleExpired);
    return () =>
      window.removeEventListener("fixit:session-expired", handleExpired);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
    setIsAuthenticated(true);
    // Conectar WebSocket con el token fresco
    connectSocket(token);
    toast.success("Bienvenido a FixIt", {
      description: `Modo ${userData.role === "client" ? "Cliente" : userData.role === "technician" ? "Técnico Pro" : "Administrador"} activado`,
    });
  }, []);

  const logout = useCallback(() => {
    disconnectSocket();
    logoutFn();
    setUser(null);
    toast.success("Sesión cerrada exitosamente", {
      description: "Has salido de tu cuenta FixIt.",
    });
    setTimeout(() => setIsAuthenticated(false), 400);
  }, [logoutFn]);

  const role: UserRole = user?.role ?? "client";
  const isLoading = sessionQuery.isLoading && !!localStorage.getItem(TOKEN_KEY);

  return (
    <SessionContext.Provider
      value={{ user, role, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}
