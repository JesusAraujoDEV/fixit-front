import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import { JobCard, type Job } from "@/components/fixit/JobCard";
import { MissionAlert } from "@/components/fixit/MissionAlert";
import { Power, Flame, DollarSign, Star, ListFilter, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Modo Técnico — FixIt" },
      { name: "description", content: "Vista del técnico: disponibilidad, mapa de calor y solicitudes cercanas en tiempo real." },
    ],
  }),
  component: ProView,
});

const JOBS: Job[] = [
  { id: "j1", category: "Electricidad", title: "Tablero eléctrico hace cortocircuito", distanceKm: 1.2, expiresInMin: 2, payout: "$45–70", urgent: true },
  { id: "j2", category: "Plomería", title: "Fuga bajo el lavabo de cocina", distanceKm: 2.8, expiresInMin: 8, payout: "$35–55" },
  { id: "j3", category: "Climatización", title: "Aire acondicionado no enfría", distanceKm: 3.4, expiresInMin: 12, payout: "$60–90" },
  { id: "j4", category: "Cerrajería", title: "Cerradura principal bloqueada", distanceKm: 0.9, expiresInMin: 4, payout: "$40–60", urgent: true },
];

// Mini sparkline data
const earningsData = [12, 28, 18, 45, 32, 55, 42, 68, 52, 75, 60, 85];
const jobsData = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="mt-1">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProView() {
  const [online, setOnline] = useState(true);
  const [missionOpen, setMissionOpen] = useState(false);

  const handleReject = useCallback(() => {
    setMissionOpen(false);
    toast.error("Misión rechazada", { description: "Se asignará a otro técnico." });
  }, []);

  const handleAccept = useCallback(() => {
    setMissionOpen(false);
    toast.success("¡Misión aceptada!", { description: "Dirígete al punto de servicio." });
  }, []);

  // Simulate incoming mission after 5s of being online
  function simulateMission() {
    if (!online) {
      toast.error("Activa tu disponibilidad primero");
      return;
    }
    setTimeout(() => setMissionOpen(true), 500);
  }

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5">
        {/* Epic Neon Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border shadow-soft p-5 md:p-6 flex items-center gap-4 transition-all duration-500 relative overflow-hidden",
            online
              ? "bg-surface border-[var(--success)]/30"
              : "bg-muted border-border"
          )}
        >
          {/* Neon glow background when online */}
          {online && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[var(--success)]/8 blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[var(--success)]/5 blur-[60px]" />
            </div>
          )}

          <div
            className={cn(
              "relative w-14 h-14 rounded-xl grid place-items-center shrink-0 transition-all duration-500",
              online
                ? "bg-[color:var(--success)]/15 text-[color:var(--success)] shadow-[0_0_20px_-4px_rgba(34,197,94,0.4)]"
                : "bg-muted-foreground/15 text-muted-foreground"
            )}
          >
            <Power className="w-7 h-7" />
            {online && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]" />
            )}
          </div>
          <div className="flex-1 min-w-0 relative">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Tu disponibilidad
            </p>
            <h1 className={cn("text-xl md:text-2xl font-bold tracking-tight", online ? "text-foreground" : "text-muted-foreground")}>
              {online ? "EN LÍNEA" : "FUERA DE SERVICIO"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {online ? "Recibiendo solicitudes en un radio de 5 km" : "No estás recibiendo solicitudes nuevas"}
            </p>
          </div>
          {/* Big neon toggle */}
          <button
            onClick={() => setOnline((v) => !v)}
            role="switch"
            aria-checked={online}
            className={cn(
              "relative h-10 w-20 rounded-full transition-all duration-500 shadow-inner",
              online
                ? "bg-[var(--success)] shadow-[0_0_16px_-2px_rgba(34,197,94,0.5)]"
                : "bg-muted-foreground/30"
            )}
          >
            <motion.span
              layout
              className={cn(
                "absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-soft",
              )}
              animate={{ x: online ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </motion.div>

        {/* Pro KPIs with Sparklines */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="w-3.5 h-3.5" /> Ganancias Hoy
              </div>
              <span className="text-[10px] font-bold text-[var(--success)] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18%
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">$285</p>
            <MiniSparkline data={earningsData} color="var(--success)" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5" /> Completados
              </div>
              <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +3
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">7</p>
            <MiniSparkline data={jobsData} color="var(--primary)" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5" /> Rating
              </div>
              <span className="text-[10px] font-bold text-accent flex items-center gap-0.5">
                <Flame className="w-3 h-3" /> Top 5%
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">4.92 ⭐</p>
            <div className="flex gap-0.5 mt-2">
              {[5, 5, 5, 4, 5].map((r, i) => (
                <div key={i} className={cn("h-4 w-4 rounded-sm text-[10px] grid place-items-center font-bold", r === 5 ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground")}>
                  {r}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Map with Heatmap Overlay */}
          <div className="lg:col-span-3 bg-surface border rounded-xl shadow-soft overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Tu Zona</h2>
                <p className="text-xs text-muted-foreground">
                  {online ? "Mapa de calor: zonas de alta demanda" : "Mapa pausado"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={simulateMission}
                  className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-md bg-accent text-white hover:opacity-90 transition"
                >
                  Simular Misión
                </button>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-accent/15 text-accent">
                  Heatmap
                </span>
              </div>
            </div>
            <div className="relative">
              <MapCanvas heatmap={online} offline={!online} variant="technicians" className="h-[420px] md:h-[520px] rounded-none" />
              {/* Cyberpunk heatmap overlay */}
              {online && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div
                    className="absolute rounded-full blur-[60px] opacity-40"
                    style={{ left: "20%", top: "30%", width: 180, height: 180, background: "radial-gradient(circle, rgba(255,60,0,0.6), transparent 70%)" }}
                  />
                  <div
                    className="absolute rounded-full blur-[80px] opacity-30"
                    style={{ left: "55%", top: "50%", width: 240, height: 240, background: "radial-gradient(circle, rgba(255,102,0,0.5), transparent 70%)" }}
                  />
                  <div
                    className="absolute rounded-full blur-[50px] opacity-25"
                    style={{ left: "70%", top: "20%", width: 140, height: 140, background: "radial-gradient(circle, rgba(255,180,0,0.5), transparent 70%)" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Job feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Solicitudes Cercanas</h2>
                <p className="text-xs text-muted-foreground">{online ? `${JOBS.length} disponibles` : "Activa modo en línea"}</p>
              </div>
              <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium hover:bg-muted">
                <ListFilter className="w-3.5 h-3.5" /> Filtros
              </button>
            </div>

            <div className={cn("space-y-3 transition-opacity duration-500", !online && "opacity-40 pointer-events-none")}>
              {JOBS.map((j, i) => (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <JobCard job={j} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Alert Modal */}
      <MissionAlert
        open={missionOpen}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </AppShell>
  );
}
