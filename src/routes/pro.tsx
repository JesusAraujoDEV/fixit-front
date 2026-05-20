import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import { JobCard, type Job } from "@/components/fixit/JobCard";
import { MissionAlert } from "@/components/fixit/MissionAlert";
import { Power, Flame, DollarSign, Star, ListFilter, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useAvailableJobs,
  useCompletedJobs,
  useToggleAvailability,
  useMissionAlerts,
  useTracking,
} from "@/api/hooks";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Modo Técnico — FixHub" },
      { name: "description", content: "Vista del técnico: disponibilidad, mapa de calor y solicitudes cercanas en tiempo real." },
    ],
  }),
  component: ProView,
});

// Valencia, Carabobo default coords
const DEFAULT_LAT = 10.1910;
const DEFAULT_LNG = -68.0130;

function ProView() {
  const [online, setOnline] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });

  const toggleAvailability = useToggleAvailability();
  const { startEmitting, stopEmitting } = useTracking();
  const { status: missionStatus, currentOffer, secondsLeft, acceptMission, rejectMission } =
    useMissionAlerts();

  // Fetch available jobs when online
  const { data: availableJobs, isLoading: jobsLoading } = useAvailableJobs(
    online ? { lat: userCoords.lat, lng: userCoords.lng } : null,
  );
  const { data: completedJobs } = useCompletedJobs();

  // Get user geolocation
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}, // fallback to default
    );
  }, []);

  const handleToggle = async () => {
    const newState = !online;
    try {
      await toggleAvailability.mutateAsync({
        online: newState,
        ...(newState ? { lat: userCoords.lat, lng: userCoords.lng } : {}),
      });
      setOnline(newState);
      if (newState) {
        startEmitting();
        toast.success("¡Estás en línea!", { description: "Recibirás solicitudes cercanas." });
      } else {
        stopEmitting();
        toast.info("Fuera de servicio", { description: "No recibirás nuevas solicitudes." });
      }
    } catch {
      toast.error("Error al cambiar disponibilidad");
    }
  };

  const handleAccept = useCallback(() => {
    acceptMission();
    toast.success("¡Misión aceptada!", { description: "Dirígete al punto de servicio." });
  }, [acceptMission]);

  const handleReject = useCallback(() => {
    rejectMission();
    toast.error("Misión rechazada", { description: "Se asignará a otro técnico." });
  }, [rejectMission]);

  // Map jobs from API to JobCard format
  const jobs: Job[] = (availableJobs ?? []).map((j) => ({
    id: j.id,
    category: j.category,
    title: j.title,
    distanceKm: j.distance_km,
    expiresInMin: j.expires_in_min,
    payout: j.payout,
    urgent: j.urgent,
  }));

  const todayEarnings = (completedJobs ?? []).reduce((sum, j) => {
    const num = parseFloat(j.earnings.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

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
              : "bg-muted border-border",
          )}
        >
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
                : "bg-muted-foreground/15 text-muted-foreground",
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
              {online ? "Recibiendo solicitudes en tu zona" : "No estás recibiendo solicitudes nuevas"}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggleAvailability.isPending}
            role="switch"
            aria-checked={online}
            className={cn(
              "relative h-10 w-20 rounded-full transition-all duration-500 shadow-inner",
              online
                ? "bg-[var(--success)] shadow-[0_0_16px_-2px_rgba(34,197,94,0.5)]"
                : "bg-muted-foreground/30",
            )}
          >
            <motion.span
              layout
              className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-soft"
              animate={{ x: online ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </motion.div>

        {/* Pro KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" /> Ganancias Hoy
            </div>
            <p className="text-2xl font-bold mt-1">${todayEarnings.toFixed(0)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5" /> Completados
            </div>
            <p className="text-2xl font-bold mt-1">{completedJobs?.length ?? 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5" /> Disponibles
            </div>
            <p className="text-2xl font-bold mt-1">{jobs.length}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Map */}
          <div className="lg:col-span-3 bg-surface border rounded-xl shadow-soft overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Tu Zona</h2>
                <p className="text-xs text-muted-foreground">
                  {online ? "Mapa de calor: zonas de alta demanda" : "Mapa pausado"}
                </p>
              </div>
              {online && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-accent/15 text-accent">
                  Heatmap
                </span>
              )}
            </div>
            <MapCanvas
              heatmap={online}
              offline={!online}
              variant="technicians"
              className="h-[420px] md:h-[520px] rounded-none"
              geoParams={{ lat: userCoords.lat, lng: userCoords.lng, radius_km: 10 }}
            />
          </div>

          {/* Job feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Solicitudes Cercanas</h2>
                <p className="text-xs text-muted-foreground">
                  {online ? `${jobs.length} disponibles` : "Activa modo en línea"}
                </p>
              </div>
              <button
                onClick={() => toast.info("Filtros en construcción", { description: "Pronto podrás filtrar solicitudes por categoría y distancia." })}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium hover:bg-muted"
              >
                <ListFilter className="w-3.5 h-3.5" /> Filtros
              </button>
            </div>

            <div className={cn("space-y-3 transition-opacity duration-500", !online && "opacity-40 pointer-events-none")}>
              {jobsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-24" />
                  ))
                : jobs.length > 0
                  ? jobs.map((j, i) => (
                      <motion.div
                        key={j.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <JobCard job={j} />
                      </motion.div>
                    ))
                  : online && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No hay solicitudes cercanas en este momento.
                      </div>
                    )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Alert Modal */}
      <MissionAlert
        open={missionStatus === "offered"}
        onAccept={handleAccept}
        onReject={handleReject}
        secondsLeft={secondsLeft}
      />
    </AppShell>
  );
}
