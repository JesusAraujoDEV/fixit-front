import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import { RadarPulse } from "@/components/fixit/RadarPulse";
import { TechnicianStatusWidget } from "@/components/fixit/TechnicianStatusWidget";
import {
  Activity,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Wrench,
  Zap,
  Droplet,
  Snowflake,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKpis, useRadarSearch } from "@/api/hooks";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "FixHub — Dashboard | Red de Técnicos Bajo Demanda" },
      {
        name: "description",
        content:
          "Panel global de operaciones FixHub: estado de la red, mapa en vivo y métricas en tiempo real.",
      },
    ],
  }),
  component: Dashboard,
});

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  electrical: Zap,
  plumbing: Droplet,
  hvac: Snowflake,
  general: Wrench,
};

function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useKpis();
  const { status: radarStatus, startSearch } = useRadarSearch();

  const searching = radarStatus === "searching";
  const techAssigned = radarStatus === "found";

  const kpiCards = kpis
    ? [
        { label: "Servicios activos", value: String(kpis.active_services.value), delta: kpis.active_services.delta, icon: Activity, tone: "primary" as const },
        { label: "Técnicos en línea", value: String(kpis.technicians_online.value), delta: kpis.technicians_online.delta, icon: Users, tone: "success" as const },
        { label: "Ingresos hoy", value: String(kpis.revenue_today.value), delta: kpis.revenue_today.delta, icon: Clock, tone: "accent" as const },
        { label: "Reportes pendientes", value: String(kpis.reports_pending.value), delta: kpis.reports_pending.delta, icon: CheckCircle2, tone: "primary" as const },
      ]
    : [];

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-6">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Centro de Operaciones
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Estado de la Red en Vivo
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/request"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-95"
            >
              Crear solicitud
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Stats from API */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpisLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-28" />
              ))
            : kpiCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-surface border rounded-lg p-4 shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-md grid place-items-center ${
                          s.tone === "accent"
                            ? "bg-accent/15 text-accent"
                            : s.tone === "success"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-[color:var(--success)] inline-flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {s.delta}
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-3 tracking-tight">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </motion.div>
                );
              })}
        </div>

        {/* Map with Radar */}
        <div className="bg-surface border rounded-lg shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h2 className="font-semibold tracking-tight">Mapa Operacional</h2>
              <p className="text-xs text-muted-foreground">
                {searching
                  ? "Buscando técnicos cercanos…"
                  : techAssigned
                    ? "Técnico asignado en ruta"
                    : "Solicitudes y técnicos en tu zona"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <AnimatePresence>
                {searching && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/15 text-accent font-semibold"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Radar activo
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Técnicos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Solicitudes
              </span>
            </div>
          </div>
          <div className="relative">
            <MapCanvas heatmap className="h-[420px] md:h-[480px] rounded-none" />
            <RadarPulse active={searching} />
            <TechnicianStatusWidget visible={techAssigned} />
          </div>
        </div>

        {/* Quick access */}
        <div className="bg-[var(--slate-industrial)] text-white rounded-lg p-5 shadow-soft relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">
              Acceso Rápido
            </p>
            <h2 className="text-xl font-bold mt-1">¿Necesitas un servicio?</h2>
            <p className="text-sm text-white/70 mt-1">
              Crea una solicitud y conecta con técnicos verificados en tu zona.
            </p>
            <Link
              to="/request"
              className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:opacity-95"
            >
              Nueva Solicitud <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
