import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../client";
import type {
  CreateRequestPayload,
  CreateRequestResponse,
  ClientRequest,
  RequestStatus,
  UploadResponse,
  DiagnoseResponse,
} from "../types";

// ─── Keys ───────────────────────────────────────────────────────────────────
export const requestKeys = {
  mine: (status?: RequestStatus) => ["requests", "mine", status] as const,
};

// ─── useCreateRequest ───────────────────────────────────────────────────────
/**
 * Mutation para crear un nuevo ticket de servicio.
 * Invalida el listado de requests del cliente al completarse.
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateRequestPayload,
    ): Promise<CreateRequestResponse> => {
      const { data } = await httpClient.post<CreateRequestResponse>(
        "/requests",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", "mine"] });
    },
  });
}

// ─── useMyRequests ──────────────────────────────────────────────────────────
/**
 * Historial de solicitudes del cliente con filtro opcional por status.
 */
export function useMyRequests(status?: RequestStatus) {
  return useQuery<ClientRequest[]>({
    queryKey: requestKeys.mine(status),
    queryFn: async () => {
      const { data } = await httpClient.get<ClientRequest[]>("/requests/mine", {
        params: status ? { status } : undefined,
      });
      return data;
    },
    staleTime: 30_000,
  });
}

// ─── useUploadImage ─────────────────────────────────────────────────────────
/**
 * Mutation para subir una imagen a ImgBB vía el backend.
 * Retorna la URL pública para incluir en el payload de createRequest.
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await httpClient.post<UploadResponse>(
        "/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
  });
}

// ─── useAiDiagnose ──────────────────────────────────────────────────────────
/**
 * Mutation para enviar una foto al endpoint de diagnóstico IA.
 */
export function useAiDiagnose() {
  return useMutation({
    mutationFn: async (file: File): Promise<DiagnoseResponse> => {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await httpClient.post<DiagnoseResponse>(
        "/ai/diagnose",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
  });
}

// ─── useCompleteRequest ─────────────────────────────────────────────────────
/**
 * Mutation para que el cliente marque una solicitud como completada.
 * POST /requests/:id/complete
 */
export function useCompleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await httpClient.post<{ id: string; status: "completed"; updated_at: string }>(
        `/requests/${requestId}/complete`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
}

// ─── useRateTechnician ──────────────────────────────────────────────────────
/**
 * Mutation para que el cliente califique al técnico después de completar.
 * POST /requests/:id/rate
 */
export function useRateTechnician() {
  return useMutation({
    mutationFn: async ({ requestId, rating, comment }: { requestId: string; rating: number; comment?: string }) => {
      const { data } = await httpClient.post<{ id: string; rating: number; comment: string | null; created_at: string }>(
        `/requests/${requestId}/rate`,
        { rating, comment },
      );
      return data;
    },
  });
}

// ─── useRateClient ──────────────────────────────────────────────────────────
/**
 * Mutation para que el técnico califique al cliente.
 * POST /requests/:id/rate-client
 */
export function useRateClient() {
  return useMutation({
    mutationFn: async ({ requestId, rating, comment }: { requestId: string; rating: number; comment?: string }) => {
      const { data } = await httpClient.post<{ id: string; rating: number; comment: string | null; created_at: string }>(
        `/requests/${requestId}/rate-client`,
        { rating, comment },
      );
      return data;
    },
  });
}
