import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../client";
import type { LoginResponse } from "../types";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RegisterClientPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: "client";
}

export interface RegisterTechnicianPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: "technician";
  specialty: string;
  experience: string;
  bio: string;
}

export type RegisterPayload = RegisterClientPayload | RegisterTechnicianPayload;

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Mutation para registrar un nuevo usuario.
 * El backend retorna token + user (mismo formato que login) para auto-login.
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<LoginResponse> => {
      const { data } = await httpClient.post<LoginResponse>(
        "/auth/register",
        payload,
      );
      return data;
    },
  });
}
