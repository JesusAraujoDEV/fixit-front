import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../client";
import type {
  AdminKpis,
  TransactionsResponse,
  TransactionsSummary,
  PlatformEvent,
  Verification,
  VerificationAction,
  WeeklyPerformance,
} from "../types";

// ─── Keys ───────────────────────────────────────────────────────────────────
export const adminKeys = {
  kpis: ["admin", "kpis"] as const,
  transactions: (params?: Record<string, unknown>) =>
    ["admin", "transactions", params] as const,
  transactionsSummary: ["admin", "transactions", "summary"] as const,
  events: (params?: { limit?: number; type?: string }) =>
    ["admin", "events", params] as const,
  verifications: (status?: string) =>
    ["admin", "verifications", status] as const,
  weeklyPerformance: ["admin", "performance", "weekly"] as const,
};

// ─── useKpis ────────────────────────────────────────────────────────────────
export function useKpis() {
  return useQuery<AdminKpis>({
    queryKey: adminKeys.kpis,
    queryFn: async () => {
      const { data } = await httpClient.get<AdminKpis>("/admin/kpis");
      return data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

// ─── useTransactions ────────────────────────────────────────────────────────
export function useTransactions(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery<TransactionsResponse>({
    queryKey: adminKeys.transactions(params),
    queryFn: async () => {
      const { data } = await httpClient.get<TransactionsResponse>(
        "/admin/transactions",
        { params },
      );
      return data;
    },
    staleTime: 30_000,
  });
}

// ─── useTransactionsSummary ─────────────────────────────────────────────────
export function useTransactionsSummary() {
  return useQuery<TransactionsSummary>({
    queryKey: adminKeys.transactionsSummary,
    queryFn: async () => {
      const { data } = await httpClient.get<TransactionsSummary>(
        "/admin/transactions/summary",
      );
      return data;
    },
    staleTime: 60_000,
  });
}

// ─── useEvents ──────────────────────────────────────────────────────────────
export function useEvents(params?: { limit?: number; type?: string }) {
  return useQuery<PlatformEvent[]>({
    queryKey: adminKeys.events(params),
    queryFn: async () => {
      const { data } = await httpClient.get<PlatformEvent[]>("/admin/events", {
        params,
      });
      return data;
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

// ─── useVerifications ───────────────────────────────────────────────────────
export function useVerifications(status?: string) {
  return useQuery<Verification[]>({
    queryKey: adminKeys.verifications(status),
    queryFn: async () => {
      const { data } = await httpClient.get<Verification[]>(
        "/admin/verifications",
        { params: status ? { status } : undefined },
      );
      return data;
    },
    staleTime: 30_000,
  });
}

// ─── useReviewVerification ──────────────────────────────────────────────────
export function useReviewVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: VerificationAction & { id: string }) => {
      const { data } = await httpClient.patch(
        `/admin/verifications/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
    },
  });
}

// ─── useWeeklyPerformance ───────────────────────────────────────────────────
export function useWeeklyPerformance() {
  return useQuery<WeeklyPerformance>({
    queryKey: adminKeys.weeklyPerformance,
    queryFn: async () => {
      const { data } = await httpClient.get<WeeklyPerformance>(
        "/admin/performance/weekly",
      );
      return data;
    },
    staleTime: 5 * 60_000,
  });
}
