import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient, TOKEN_KEY } from "../client";
import type { LoginRequest, LoginResponse, MeResponse, User } from "../types";

// ─── Keys ───────────────────────────────────────────────────────────────────
export const authKeys = {
  session: ["auth", "session"] as const,
};

// ─── useLogin ───────────────────────────────────────────────────────────────
/**
 * Mutation para login. Al tener éxito:
 * 1. Guarda el JWT en localStorage
 * 2. Invalida la query de sesión para refrescar el usuario
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const { data } = await httpClient.post<LoginResponse>(
        "/auth/login",
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      // Setear directamente en cache para evitar un round-trip extra
      queryClient.setQueryData<User>(authKeys.session, data.user);
    },
  });
}

// ─── useSession ─────────────────────────────────────────────────────────────
/**
 * Query que mantiene viva la sesión del usuario.
 * Se ejecuta solo si hay un token en localStorage.
 * Refresca cada 5 minutos para detectar tokens expirados.
 */
export function useSession() {
  return useQuery<User>({
    queryKey: authKeys.session,
    queryFn: async (): Promise<User> => {
      const { data } = await httpClient.get<MeResponse>("/auth/me");
      return data.user;
    },
    enabled: !!localStorage.getItem(TOKEN_KEY),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });
}

// ─── useLogout ──────────────────────────────────────────────────────────────
/**
 * Hook utilitario para cerrar sesión limpiamente.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.setQueryData(authKeys.session, null);
    queryClient.clear();
  };
}
