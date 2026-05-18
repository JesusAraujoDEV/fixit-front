import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import type { UserRole } from "./AuthScreen";

type SessionState = {
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionState>({
  role: "client",
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("client");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    toast.success("Bienvenido a FixIt", {
      description: `Modo ${selectedRole === "client" ? "Cliente" : selectedRole === "technician" ? "Técnico Pro" : "Administrador"} activado`,
    });
  }, []);

  const logout = useCallback(() => {
    toast.success("Sesión cerrada exitosamente", {
      description: "Has salido de tu cuenta FixIt.",
    });
    setTimeout(() => setIsAuthenticated(false), 400);
  }, []);

  return (
    <SessionContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
