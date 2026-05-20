import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../client";

export interface UserStats {
  rating_average: number;
  total_reviews: number;
  active_requests: number;
  completed_requests: number;
  total_requests: number;
}

export const userStatsKeys = {
  me: ["user-stats"] as const,
};

/**
 * Obtiene las estadísticas del usuario autenticado.
 * GET /api/users/me/stats
 */
export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: userStatsKeys.me,
    queryFn: async () => {
      const { data } = await httpClient.get<UserStats>("/users/me/stats");
      return data;
    },
    staleTime: 60_000,
  });
}
