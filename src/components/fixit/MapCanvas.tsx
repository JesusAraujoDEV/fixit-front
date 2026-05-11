import { cn } from "@/lib/utils";
import { Wrench, Zap, Droplet, Snowflake, Hammer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Pin = {
  id: string;
  x: number; // %
  y: number; // %
  type: "electrical" | "plumbing" | "hvac" | "general" | "urgent";
  active?: boolean;
};

const ICONS: Record<Pin["type"], LucideIcon> = {
  electrical: Zap,
  plumbing: Droplet,
  hvac: Snowflake,
  general: Hammer,
  urgent: Wrench,
};

const DEFAULT_PINS: Pin[] = [
  { id: "1", x: 22, y: 30, type: "electrical", active: true },
  { id: "2", x: 55, y: 45, type: "plumbing" },
  { id: "3", x: 70, y: 25, type: "hvac" },
  { id: "4", x: 35, y: 65, type: "urgent", active: true },
  { id: "5", x: 80, y: 60, type: "general" },
  { id: "6", x: 48, y: 75, type: "electrical" },
];

export function MapCanvas({
  pins = DEFAULT_PINS,
  heatmap = false,
  offline = false,
  className,
  variant = "dark",
}: {
  pins?: Pin[];
  heatmap?: boolean;
  offline?: boolean;
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        variant === "dark" ? "map-grid" : "map-grid-light",
        className
      )}
    >
      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M 0 60 Q 200 40 400 80 T 800 100"
          stroke={variant === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
          strokeWidth="14"
          fill="none"
        />
        <path
          d="M 100 0 Q 150 200 250 300 T 500 500"
          stroke={variant === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M 0 250 L 800 200"
          stroke={variant === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
          strokeWidth="8"
          fill="none"
        />
      </svg>

      {/* Heatmap blobs */}
      {heatmap && !offline && (
        <>
          <div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              left: "15%", top: "20%", width: 220, height: 220,
              background: "radial-gradient(circle, rgba(255,102,0,0.55), transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              left: "55%", top: "55%", width: 280, height: 280,
              background: "radial-gradient(circle, rgba(255,102,0,0.45), transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full blur-2xl pointer-events-none"
            style={{
              left: "70%", top: "15%", width: 160, height: 160,
              background: "radial-gradient(circle, rgba(0,71,171,0.5), transparent 70%)",
            }}
          />
        </>
      )}

      {/* Pins */}
      {!offline &&
        pins.map((p) => {
          const Icon = ICONS[p.type];
          const isUrgent = p.type === "urgent" || p.active;
          return (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {isUrgent && (
                <span
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full pin-ring"
                  style={{ background: "rgba(255,102,0,0.35)" }}
                />
              )}
              <div
                className={cn(
                  "relative w-10 h-10 rounded-full grid place-items-center shadow-elevated ring-2 ring-white/30",
                  isUrgent ? "bg-accent" : "bg-primary",
                  isUrgent && "pin-pulse"
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          );
        })}

      {/* "Current location" dot */}
      {!offline && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-primary/40 pin-ring" />
          <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white" />
        </div>
      )}

      {/* Offline overlay */}
      {offline && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-grayscale flex items-center justify-center">
          <div className="text-center text-white/90 px-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/10 grid place-items-center mb-3">
              <Wrench className="w-7 h-7" />
            </div>
            <p className="font-semibold">Estás Fuera de Servicio</p>
            <p className="text-sm text-white/60 mt-1">
              Activa "En Línea" para recibir solicitudes en tu zona.
            </p>
          </div>
        </div>
      )}

      {/* Compass / scale chrome */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <button className="w-9 h-9 rounded-md bg-surface/90 backdrop-blur shadow-soft grid place-items-center text-sm font-bold">+</button>
        <button className="w-9 h-9 rounded-md bg-surface/90 backdrop-blur shadow-soft grid place-items-center text-sm font-bold">−</button>
      </div>
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-surface/90 backdrop-blur shadow-soft text-[10px] font-medium">
        500 m
      </div>
    </div>
  );
}
