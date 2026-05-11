import { Clock, MapPin, ChevronRight, Zap, Droplet, Snowflake, Hammer, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type Job = {
  id: string;
  category: "Electricidad" | "Plomería" | "Climatización" | "General" | "Cerrajería";
  title: string;
  distanceKm: number;
  expiresInMin: number;
  payout: string;
  urgent?: boolean;
};

const CATEGORY_ICONS: Record<Job["category"], LucideIcon> = {
  Electricidad: Zap,
  Plomería: Droplet,
  Climatización: Snowflake,
  General: Hammer,
  Cerrajería: Wrench,
};

export function JobCard({ job, onAccept }: { job: Job; onAccept?: (id: string) => void }) {
  const Icon = CATEGORY_ICONS[job.category];
  const expiringSoon = job.expiresInMin <= 3;

  return (
    <article className="bg-surface rounded-lg border shadow-soft p-4 hover:shadow-elevated transition-shadow">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-md grid place-items-center shrink-0",
            job.urgent ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {job.category}
            </span>
            {job.urgent && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                Urgente
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground leading-snug truncate mt-0.5">{job.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.distanceKm.toFixed(1)} km
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                expiringSoon ? "text-accent" : ""
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              Expira en {job.expiresInMin}m
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">Pago est.</p>
          <p className="font-bold text-foreground">{job.payout}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="flex-1 h-10 rounded-md border bg-surface text-sm font-medium hover:bg-muted transition-colors inline-flex items-center justify-center gap-1">
          Detalles <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAccept?.(job.id)}
          className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-95 transition-opacity"
        >
          Aceptar
        </button>
      </div>
    </article>
  );
}
