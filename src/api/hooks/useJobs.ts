import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../client";
import type {
  AvailableJob,
  CompletedJob,
  AvailabilityPayload,
  AvailabilityResponse,
} from "../types";

// ─── Keys ───────────────────────────────────────────────────────────────────
export const jobKeys = {
  available: (params?: { lat: number; lng: number; category?: string }) =>
    ["jobs", "available", params] as const,
  completed: (params?: { date_from?: string; date_to?: string }) =>
    ["jobs", "completed", params] as const,
  availability: ["technician", "availability"] as const,
};

// ─── useAvailableJobs ───────────────────────────────────────────────────────
/**
 * Jobs disponibles para el técnico, filtrados por ubicación y categoría.
 */
export function useAvailableJobs(params: {
  lat: number;
  lng: number;
  category?: string;
} | null) {
  return useQuery<AvailableJob[]>({
    queryKey: jobKeys.available(params ?? undefined),
    queryFn: async () => {
      const { data } = await httpClient.get<AvailableJob[]>("/jobs/available", {
        params,
      });
      return data;
    },
    enabled: !!params,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

// ─── useCompletedJobs ───────────────────────────────────────────────────────
/**
 * Historial de trabajos completados por el técnico.
 */
export function useCompletedJobs(params?: {
  date_from?: string;
  date_to?: string;
}) {
  return useQuery<CompletedJob[]>({
    queryKey: jobKeys.completed(params),
    queryFn: async () => {
      const { data } = await httpClient.get<CompletedJob[]>("/jobs/completed", {
        params,
      });
      return data;
    },
    staleTime: 60_000,
  });
}

// ─── useToggleAvailability ──────────────────────────────────────────────────
/**
 * Mutation para cambiar el estado online/offline del técnico.
 * Cuando online=true, lat y lng son requeridos.
 */
export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: AvailabilityPayload,
    ): Promise<AvailabilityResponse> => {
      const { data } = await httpClient.patch<AvailabilityResponse>(
        "/technician/availability",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(jobKeys.availability, data);
    },
  });
}

// ─── useAvailabilityStatus ──────────────────────────────────────────────────
/**
 * Query para obtener el estado actual de disponibilidad del técnico.
 * GET /technician/availability
 */
export function useAvailabilityStatus() {
  return useQuery<AvailabilityResponse>({
    queryKey: jobKeys.availability,
    queryFn: async () => {
      const { data } = await httpClient.get<AvailabilityResponse>(
        "/technician/availability",
      );
      return data;
    },
    staleTime: 30_000,
  });
}
