import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../client";
import type { GeoParams, TechnicianMarker, RequestMarker, HeatmapZone } from "../types";

// ─── Keys ───────────────────────────────────────────────────────────────────
export const mapKeys = {
  technicians: (params: GeoParams) =>
    ["map", "technicians", params] as const,
  requests: (params: GeoParams) =>
    ["map", "requests", params] as const,
  heatmap: () => ["map", "heatmap"] as const,
};

// ─── useRequestMarkers ──────────────────────────────────────────────────────
/**
 * Markers de solicitudes pendientes cercanas (rol: client).
 */
export function useRequestMarkers(params: GeoParams | null) {
  return useQuery<RequestMarker[]>({
    queryKey: mapKeys.requests(params!),
    queryFn: async () => {
      const { data } = await httpClient.get<RequestMarker[]>("/map/requests", {
        params,
      });
      return data;
    },
    enabled: !!params,
    staleTime: 30_000, // 30s — datos geográficos cambian frecuentemente
    refetchInterval: 30_000,
  });
}

// ─── useTechnicianMarkers ───────────────────────────────────────────────────
/**
 * Markers de técnicos online dentro del radio.
 */
export function useTechnicianMarkers(params: GeoParams | null) {
  return useQuery<TechnicianMarker[]>({
    queryKey: mapKeys.technicians(params!),
    queryFn: async () => {
      const { data } = await httpClient.get<{ technicians: TechnicianMarker[] }>(
        "/map/technicians",
        { params },
      );
      return data.technicians;
    },
    enabled: !!params,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

// ─── useHeatmapZones ────────────────────────────────────────────────────────
/**
 * Zonas de demanda para técnicos y admins.
 */
export function useHeatmapZones() {
  return useQuery<HeatmapZone[]>({
    queryKey: mapKeys.heatmap(),
    queryFn: async () => {
      const { data } = await httpClient.get<HeatmapZone[]>("/map/heatmap");
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
