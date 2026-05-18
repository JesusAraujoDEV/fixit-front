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
