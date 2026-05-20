import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, useUserRole } from "@/components/fixit/AppShell";
import { JobCard, type Job } from "@/components/fixit/JobCard";
import {
  Clock, CheckCircle2, AlertCircle, DollarSign, TrendingUp,
  Search, Filter, Star, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useMyRequests,
  useAvailableJobs,
  useCompletedJobs,
  useTransactions,
  useTransactionsSummary,
  useCompleteRequest,
  useRateTechnician,
} from "@/api/hooks";
import type { RequestStatus } from "@/api/types";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Trabajos — FixHub" },
      { name: "description", content: "Historial y trabajos activos en FixHub." },
    ],
  }),
  component: JobsPage,
});

// ─── Client: "Mis Solicitudes" ───
function ClientJobsView() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(undefined);
  const { data: requests, isLoading } = useMyRequests(statusFilter);
  const completeRequest = useCompleteRequest();
  const rateTechnician = useRateTechnician();
  const [ratingFor, setRatingFor] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const handleComplete = async (requestId: string) => {
    try {
      await completeRequest.mutateAsync(requestId);
      toast.success("¡Servicio completado!", { description: "Ahora puedes calificar al técnico." });
      setRatingFor(requestId);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Intenta de nuevo.";
      toast.error("Error al completar", { description: msg });
    }
  };

  const handleRate = async () => {
    if (!ratingFor) return;
    try {
      await rateTechnician.mutateAsync({ requestId: ratingFor, rating: ratingValue, comment: ratingComment.trim() || undefined });
      toast.success("¡Gracias por tu calificación!", { description: `${ratingValue} estrella${ratingValue > 1 ? "s" : ""}` });
      setRatingFor(null);
      setRatingValue(5);
      setRatingComment("");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Intenta de nuevo.";
      toast.error("Error al calificar", { description: msg });
    }
  };

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-4xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Historial
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
        <p className="text-sm text-muted-foreground mt-1">Todas las solicitudes que has creado</p>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatusFilter(undefined)}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium",
            !statusFilter ? "bg-primary text-primary-foreground" : "border hover:bg-muted",
          )}
        >
          Todas
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium",
            statusFilter === "active" ? "bg-primary text-primary-foreground" : "border hover:bg-muted",
          )}
        >
          <Clock className="w-3 h-3" /> Activas
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium",
            statusFilter === "completed" ? "bg-primary text-primary-foreground" : "border hover:bg-muted",
          )}
        >
          <CheckCircle2 className="w-3 h-3" /> Completadas
        </button>
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-24" />
            ))
          : requests?.map((req) => (
              <div key={req.id} className="bg-surface border rounded-lg p-4 shadow-soft hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  {/* Thumbnail */}
                  {req.images && req.images.length > 0 && (
                    <div className="w-16 h-16 rounded-md overflow-hidden border shrink-0">
                      <img
                        src={req.images[0]}
                        alt={req.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {req.category}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                        req.status === "active" ? "bg-accent/15 text-accent" :
                        req.status === "completed" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" :
                        "bg-muted text-muted-foreground",
                      )}>
                        {req.status === "active" ? "En curso" : req.status === "completed" ? "Completada" : "Cancelada"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{req.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {req.technician && <span>Técnico: <strong className="text-foreground">{req.technician.name}</strong></span>}
                      <span>{new Date(req.created_at).toLocaleDateString("es-VE")}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Costo</p>
                    <p className="font-bold">{req.price ?? "—"}</p>
                  </div>
                </div>
                {req.status === "active" && req.eta_minutes && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs text-accent font-medium">Técnico en camino — {req.eta_minutes} min</span>
                  </div>
                )}
                {/* Complete button for active requests with technician assigned */}
                {req.status === "active" && req.technician && (
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => handleComplete(req.id)}
                      disabled={completeRequest.isPending}
                      className="w-full h-9 rounded-md bg-[var(--success)] text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                    >
                      {completeRequest.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Marcar como completado
                    </button>
                  </div>
                )}
                {/* Rating modal inline */}
                {ratingFor === req.id && (
                  <div className="mt-3 pt-3 border-t space-y-3">
                    <p className="text-xs font-semibold">¿Cómo fue el servicio?</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRatingValue(star)}
                          className="p-0.5"
                        >
                          <Star className={cn("w-6 h-6 transition-colors", star <= ratingValue ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Comentario opcional…"
                      rows={2}
                      className="w-full p-2 rounded-md bg-muted border border-transparent text-xs resize-none outline-none focus:border-ring"
                    />
                    <button
                      onClick={handleRate}
                      disabled={rateTechnician.isPending}
                      className="w-full h-9 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                    >
                      {rateTechnician.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Enviar calificación"}
                    </button>
                  </div>
                )}
              </div>
            )) ?? null}
        {!isLoading && requests?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tienes solicitudes aún. ¡Crea tu primera!
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Technician: "Mis Trabajos" ───
function TechJobsView() {
  const { data: availableJobs, isLoading: loadingAvailable } = useAvailableJobs({
    lat: 10.1910,
    lng: -68.0130,
  });
  const { data: completedJobs, isLoading: loadingCompleted } = useCompletedJobs();

  const jobs: Job[] = (availableJobs ?? []).map((j) => ({
    id: j.id,
    category: j.category,
    title: j.title,
    distanceKm: j.distance_km,
    expiresInMin: j.expires_in_min,
    payout: j.payout,
    urgent: j.urgent,
  }));

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-5xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Gestión
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Trabajos</h1>
        </div>
        <button
          onClick={() => toast.info("Filtros avanzados en construcción", { description: "Pronto podrás filtrar por distancia, categoría y urgencia." })}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border text-sm font-medium hover:bg-muted"
        >
          <Filter className="w-4 h-4" /> Filtrar
        </button>
      </header>

      {/* Available jobs */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-accent" />
          Disponibles cerca de ti
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {loadingAvailable
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-24" />
              ))
            : jobs.length > 0
              ? jobs.map((j) => <JobCard key={j.id} job={j} />)
              : <p className="text-sm text-muted-foreground col-span-2">No hay trabajos disponibles en este momento.</p>}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
          Completados recientemente
        </h2>
        <div className="space-y-2">
          {loadingCompleted
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-16" />
              ))
            : (completedJobs ?? []).map((job) => (
                <div key={job.id} className="bg-surface border rounded-lg p-4 shadow-soft flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[color:var(--success)]/10 text-[color:var(--success)] grid place-items-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(job.completed_at).toLocaleDateString("es-VE")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[color:var(--success)]">{job.earnings}</p>
                    <p className="text-xs text-muted-foreground">{"⭐".repeat(job.rating)}</p>
                  </div>
                </div>
              ))}
          {!loadingCompleted && completedJobs?.length === 0 && (
            <p className="text-sm text-muted-foreground">Aún no has completado trabajos.</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Admin: "Transacciones" ───
function AdminJobsView() {
  const { data: txData } = useTransactions({ page: 1, per_page: 10 });
  const { data: txSummary } = useTransactionsSummary();

  return (
    <section className="px-4 md:px-6 py-6 space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">
            Finanzas
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Transacciones</h1>
        </div>
        {txSummary && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <DollarSign className="w-4 h-4" />
            <span className="font-bold">{txSummary.today_commission}</span>
            <span className="text-white/40 text-xs">comisiones hoy</span>
          </div>
        )}
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Hoy
          </div>
          <p className="text-xl font-bold text-white">{txSummary?.today_count ?? "—"}</p>
          <p className="text-[11px] text-white/40">transacciones</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Volumen
          </div>
          <p className="text-xl font-bold text-white">{txSummary?.today_volume ?? "—"}</p>
          <p className="text-[11px] text-white/40">total movido</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Disputas
          </div>
          <p className="text-xl font-bold text-red-400">{txSummary?.disputes_pending ?? 0}</p>
          <p className="text-[11px] text-white/40">pendientes</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-emerald-500/10">
          <h2 className="font-semibold text-white text-sm">Registro de Transacciones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40">
                <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                <th className="text-left px-4 py-2.5 font-medium">Técnico</th>
                <th className="text-left px-4 py-2.5 font-medium">Servicio</th>
                <th className="text-left px-4 py-2.5 font-medium">Monto</th>
                <th className="text-left px-4 py-2.5 font-medium">Comisión</th>
                <th className="text-left px-4 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {txData?.data.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-white/80">{tx.client}</td>
                  <td className="px-4 py-2.5 text-white/80">{tx.technician}</td>
                  <td className="px-4 py-2.5 text-white/60">{tx.service}</td>
                  <td className="px-4 py-2.5 font-bold text-white">{tx.amount}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-400">{tx.commission}</td>
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
                <tr><td colSpan={6} className="px-4 py-4 text-white/30 text-center">Cargando...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Main component: renders based on role ───
function JobsPage() {
  const role = useUserRole();

  return (
    <AppShell>
      {role === "client" && <ClientJobsView />}
      {role === "technician" && <TechJobsView />}
      {role === "admin" && <AdminJobsView />}
    </AppShell>
  );
}
