import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../client";
import type { TechnicianProfile, UpdateTechnicianProfilePayload } from "../types";

export const techProfileKeys = {
  me: ["technician", "profile"] as const,
};

/**
 * Obtiene el perfil profesional del técnico autenticado.
 * GET /api/technician/profile
 */
export function useTechnicianProfile() {
  return useQuery<TechnicianProfile>({
    queryKey: techProfileKeys.me,
    queryFn: async () => {
      const { data } = await httpClient.get<TechnicianProfile>(
        "/technician/profile",
      );
      return data;
    },
    staleTime: 60_000,
  });
}

/**
 * Mutation para actualizar el perfil profesional del técnico.
 * PUT /api/technician/profile
 */
export function useUpdateTechnicianProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateTechnicianProfilePayload,
    ): Promise<TechnicianProfile> => {
      const { data } = await httpClient.put<TechnicianProfile>(
        "/technician/profile",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(techProfileKeys.me, data);
    },
  });
}
