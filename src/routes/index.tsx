import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FixIt — Dashboard | Red de Técnicos Bajo Demanda" },
      { name: "description", content: "Panel global de operaciones FixIt: estado de la red, mapa en vivo y métricas en tiempo real." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Solicitudes activas", value: "47", delta: "+12%", icon: Activity, tone: "primary" as const },
  { label: "Técnicos en línea", value: "187", delta: "+5%", icon: Users, tone: "success" as const },
  { label: "Tiempo de respuesta", value: "8 min", delta: "-1.2 min", icon: Clock, tone: "accent" as const },
  { label: "Trabajos completados hoy", value: "312", delta: "+24%", icon: CheckCircle2, tone: "primary" as const },
];

const categories = [
  { name: "Electricidad", icon: Zap, jobs: 18 },
  { name: "Plomería", icon: Droplet, jobs: 12 },
  { name: "Climatización", icon: Snowflake, jobs: 9 },
  { name: "General", icon: Wrench, jobs: 8 },
];

function Dashboard() {
  const [searching, setSearching] = useState(false);
  const [techAssigned, setTechAssigned] = useState(false);

  function simulateSearch() {
    setSearching(true);
    setTechAssigned(false);
    // After 4 seconds, "find" a technician
    setTimeout(() => {
      setSearching(false);
      setTechAssigned(true);
    }, 4000);
  }

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
            {/* Simulate search button */}
            <button
              onClick={simulateSearch}
              disabled={searching}
              className={cn(
                "inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-semibold shadow-soft transition-all",
                searching
                  ? "bg-accent/20 text-accent border border-accent/30 cursor-wait"
                  : "bg-accent text-white hover:opacity-95"
              )}
            >
              <Radio className={cn("w-4 h-4", searching && "animate-pulse")} />
              {searching ? "Buscando…" : "Simular Búsqueda"}
            </button>
            <Link
              to="/request"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-95"
            >
              Crear solicitud
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => {
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
                  <div className={`w-9 h-9 rounded-md grid place-items-center ${
                    s.tone === "accent" ? "bg-accent/15 text-accent"
                    : s.tone === "success" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                    : "bg-primary/10 text-primary"
                  }`}>
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

        {/* Map with Radar + Glassmorphism widget */}
        <div className="bg-surface border rounded-lg shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h2 className="font-semibold tracking-tight">Mapa Operacional</h2>
              <p className="text-xs text-muted-foreground">
                {searching ? "Buscando técnicos cercanos…" : techAssigned ? "Técnico asignado en ruta" : "Solicitudes y zonas de alta demanda"}
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
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Disponible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Urgente
              </span>
            </div>
          </div>
          <div className="relative">
            <MapCanvas heatmap className="h-[420px] md:h-[480px] rounded-none" />
            <RadarPulse active={searching} />
            <TechnicianStatusWidget visible={techAssigned} />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border rounded-lg p-5 shadow-soft">
            <h2 className="font-semibold tracking-tight mb-4">Demanda por Categoría</h2>
            <div className="space-y-3">
              {categories.map((c) => {
                const Icon = c.icon;
                const pct = Math.min(100, c.jobs * 5);
                return (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 text-primary grid place-items-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted-foreground">{c.jobs} activos</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--slate-industrial)] text-white rounded-lg p-5 shadow-soft relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">
                Acceso Rápido
              </p>
              <h2 className="text-xl font-bold mt-1">¿Eres técnico?</h2>
              <p className="text-sm text-white/70 mt-1">
                Activa tu disponibilidad y empieza a recibir trabajos en tu zona.
              </p>
              <Link
                to="/pro"
                className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:opacity-95"
              >
                Ir a Modo Técnico <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
