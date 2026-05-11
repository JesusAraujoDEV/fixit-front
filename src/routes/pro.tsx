import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import { JobCard, type Job } from "@/components/fixit/JobCard";
import { Power, Flame, DollarSign, Star, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

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

function ProView() {
  const [online, setOnline] = useState(true);

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5">
        {/* Status switch */}
        <div
          className={cn(
            "rounded-lg border shadow-soft p-4 md:p-5 flex items-center gap-4 transition-colors",
            online ? "bg-surface" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-md grid place-items-center shrink-0 transition-colors",
              online ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-muted-foreground/15 text-muted-foreground"
            )}
          >
            <Power className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
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
          {/* Toggle */}
          <button
            onClick={() => setOnline((v) => !v)}
            role="switch"
            aria-checked={online}
            className={cn(
              "relative h-9 w-16 rounded-full transition-colors shadow-inner",
              online ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-soft transition-transform",
                online && "translate-x-7"
              )}
            />
          </button>
        </div>

        {/* Pro KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface border rounded-lg p-3 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" /> Hoy
            </div>
            <p className="text-lg font-bold mt-1">$285</p>
          </div>
          <div className="bg-surface border rounded-lg p-3 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5" /> Rating
            </div>
            <p className="text-lg font-bold mt-1">4.92</p>
          </div>
          <div className="bg-surface border rounded-lg p-3 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="w-3.5 h-3.5 text-accent" /> Demanda
            </div>
            <p className="text-lg font-bold mt-1 text-accent">Alta</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Map */}
          <div className="lg:col-span-3 bg-surface border rounded-lg shadow-soft overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Tu Zona</h2>
                <p className="text-xs text-muted-foreground">
                  {online ? "Mapa de calor: zonas de alta demanda" : "Mapa pausado"}
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-accent/15 text-accent">
                Heatmap
              </span>
            </div>
            <MapCanvas heatmap={online} offline={!online} className="h-[420px] md:h-[520px] rounded-none" />
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

            <div className={cn("space-y-3 transition-opacity", !online && "opacity-40 pointer-events-none")}>
              {JOBS.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
