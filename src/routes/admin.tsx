import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import {
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useKpis,
  useTransactions,
  useEvents,
  useVerifications,
  useReviewVerification,
  useWeeklyPerformance,
  useTransactionsSummary,
} from "@/api/hooks";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Command Center — FixHub Admin" },
      { name: "description", content: "Centro de comando administrativo: monitoreo global de la red FixHub." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const logRef = useRef<HTMLDivElement>(null);

  // Real API data
  const { data: kpis } = useKpis();
  const { data: txData } = useTransactions({ page: 1, per_page: 6 });
  const { data: txSummary } = useTransactionsSummary();
  const { data: events } = useEvents({ limit: 20 });
  const { data: verifications } = useVerifications("pending");
  const { data: weeklyPerf } = useWeeklyPerformance();
  const reviewMutation = useReviewVerification();

  const kpiCards = kpis
    ? [
        { label: "Servicios Activos", value: String(kpis.active_services.value), delta: kpis.active_services.delta, icon: Activity, color: "emerald" },
        { label: "Técnicos Online", value: String(kpis.technicians_online.value), delta: kpis.technicians_online.delta, icon: Users, color: "blue" },
        { label: "Ingresos Hoy", value: String(kpis.revenue_today.value), delta: kpis.revenue_today.delta, icon: DollarSign, color: "emerald" },
        { label: "Reportes Pendientes", value: String(kpis.reports_pending.value), delta: kpis.reports_pending.delta, icon: AlertTriangle, color: "red" },
      ]
    : [];

  function handleApprove(id: string, name: string) {
    reviewMutation.mutate(
      { id, action: "approve" },
      { onSuccess: () => toast.success(`Técnico ${name} aprobado`, { description: "Ya puede recibir solicitudes." }) },
    );
  }

  function handleReject(id: string, name: string) {
    reviewMutation.mutate(
      { id, action: "reject", reason: "Documentos insuficientes" },
      { onSuccess: () => toast.error(`Solicitud de ${name} rechazada`, { description: "Se notificará al solicitante." }) },
    );
  }

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-emerald-400" />
            <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">
              Command Center
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Ojo de Dios — Monitoreo Global
          </h1>
          <p className="text-sm text-white/50 mt-1">Red FixHub en tiempo real</p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            const borderColor = kpi.color === "emerald" ? "border-emerald-500/30" : kpi.color === "blue" ? "border-blue-500/30" : "border-red-500/30";
            const glowColor = kpi.color === "emerald" ? "shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]" : kpi.color === "blue" ? "shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]" : "shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]";
            const iconColor = kpi.color === "emerald" ? "text-emerald-400" : kpi.color === "blue" ? "text-blue-400" : "text-red-400";
            const iconBg = kpi.color === "emerald" ? "bg-emerald-500/10" : kpi.color === "blue" ? "bg-blue-500/10" : "bg-red-500/10";

            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("rounded-xl border p-4 bg-white/[0.02]", borderColor, glowColor)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-lg grid place-items-center", iconBg)}>
                    <Icon className={cn("w-4 h-4", iconColor)} />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {kpi.delta}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{kpi.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Map + Event Log */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-emerald-500/20 overflow-hidden bg-white/[0.02]">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white tracking-tight">Mapa Global</h2>
                <p className="text-xs text-white/40">Técnicos y solicitudes en Valencia</p>
              </div>
            </div>
            <MapCanvas heatmap className="h-[400px] md:h-[480px] rounded-none" />
          </div>

          {/* Live Event Log from API */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-white tracking-tight text-sm">Log de Eventos</h2>
                <p className="text-[10px] text-white/40">Tiempo real</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto max-h-[440px] p-3 space-y-1.5 scrollbar-thin">
              {events?.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={i === 0 ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-xs py-1.5 px-2 rounded hover:bg-white/5"
                >
                  <span className="text-white/30 font-mono shrink-0 w-16">
                    {new Date(ev.time).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                      ev.type === "success" ? "bg-emerald-400" :
                      ev.type === "warning" ? "bg-yellow-400" :
                      ev.type === "error" ? "bg-red-400" : "bg-blue-400",
                    )}
                  />
                  <span className="text-white/70 leading-relaxed">{ev.message}</span>
                </motion.div>
              )) ?? (
                <p className="text-white/30 text-xs text-center py-4">Cargando eventos...</p>
              )}
            </div>
          </div>
        </div>

        {/* Transactions + Verifications */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Transactions from API */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
              <h2 className="font-semibold text-white tracking-tight text-sm">Últimas Transacciones</h2>
              {txSummary && (
                <span className="text-[10px] font-bold text-emerald-400">
                  {txSummary.today_count} hoy · {txSummary.today_commission} comisiones
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                    <th className="text-left px-4 py-2.5 font-medium">Técnico</th>
                    <th className="text-left px-4 py-2.5 font-medium">Monto</th>
                    <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {txData?.data.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 text-white/80">{tx.client}</td>
                      <td className="px-4 py-2.5 text-white/80">{tx.technician}</td>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">{tx.amount}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                          tx.status === "paid" ? "bg-emerald-500/15 text-emerald-400" :
                          tx.status === "pending" ? "bg-blue-500/15 text-blue-400" :
                          "bg-red-500/15 text-red-400",
                        )}>
                          {tx.status === "paid" ? "✓ Pagado" : tx.status === "pending" ? "⏳ Pendiente" : tx.status}
                        </span>
                      </td>
                    </tr>
                  )) ?? (
                    <tr><td colSpan={4} className="px-4 py-4 text-white/30 text-center">Cargando...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Requests from API */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
              <h2 className="font-semibold text-white tracking-tight text-sm">Verificación de Técnicos</h2>
              {verifications && verifications.length > 0 && (
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                  {verifications.length} pendientes
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              {verifications?.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-emerald-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 grid place-items-center text-white font-bold text-sm shrink-0">
                    {v.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{v.name}</p>
                    <p className="text-[11px] text-white/40">{v.specialty} · {v.experience} · {v.documents_count} docs</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleApprove(v.id, v.name)}
                      disabled={reviewMutation.isPending}
                      className="w-8 h-8 rounded-md bg-emerald-500/15 text-emerald-400 grid place-items-center hover:bg-emerald-500/25 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(v.id, v.name)}
                      disabled={reviewMutation.isPending}
                      className="w-8 h-8 rounded-md bg-red-500/15 text-red-400 grid place-items-center hover:bg-red-500/25 transition"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) ?? (
                <p className="text-white/30 text-xs text-center py-4">Cargando verificaciones...</p>
              )}
              {verifications?.length === 0 && (
                <p className="text-white/30 text-xs text-center py-4">No hay verificaciones pendientes.</p>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Performance from API */}
        <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white tracking-tight text-sm">Rendimiento Semanal</h2>
              <p className="text-[11px] text-white/40">Servicios completados por día</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {(weeklyPerf?.days ?? []).map((day, i) => {
              const maxVal = Math.max(...(weeklyPerf?.days ?? []).map((d) => d.completed), 1);
              const height = (day.completed / maxVal) * 100;
              const isMax = day.completed === maxVal;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-white/40 mb-1">{day.completed}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={cn("w-full rounded-t-md", isMax ? "bg-emerald-400" : "bg-emerald-500/30")}
                  />
                  <span className="text-[10px] text-white/40">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
