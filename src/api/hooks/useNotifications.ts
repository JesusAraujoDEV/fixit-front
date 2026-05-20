import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../client";
import type { Notification } from "../types";

export const notificationKeys = {
  all: ["notifications"] as const,
};

/**
 * Obtiene las notificaciones del usuario autenticado.
 * GET /api/notifications
 */
export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: notificationKeys.all,
    queryFn: async () => {
      const { data } = await httpClient.get<Notification[]>("/notifications");
      return data;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
