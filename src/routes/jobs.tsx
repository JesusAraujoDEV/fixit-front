import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useUserRole } from "@/components/fixit/AppShell";
import { JobCard, type Job } from "@/components/fixit/JobCard";
import {
  Clock, CheckCircle2, AlertCircle, DollarSign, TrendingUp,
  FileText, Search, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Trabajos — FixIt" },
      { name: "description", content: "Historial y trabajos activos en FixIt." },
    ],
  }),
  component: JobsPage,
});

// ─── Client: "Mis Solicitudes" ───
const CLIENT_REQUESTS = [
  { id: "s1", title: "Reparación de tablero eléctrico", category: "Electricidad", status: "active" as const, tech: "Carlos M.", time: "Hace 2 horas", price: "$55" },
  { id: "s2", title: "Fuga en tubería del baño", category: "Plomería", status: "completed" as const, tech: "María G.", time: "Hace 3 días", price: "$40" },
  { id: "s3", title: "Instalación de aire acondicionado", category: "Climatización", status: "completed" as const, tech: "José R.", time: "Hace 1 semana", price: "$120" },
  { id: "s4", title: "Cambio de cerradura principal", category: "Cerrajería", status: "cancelled" as const, tech: null, time: "Hace 2 semanas", price: "—" },
];

function ClientJobsView() {
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
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium">
          Todas
        </button>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium hover:bg-muted">
          <Clock className="w-3 h-3" /> Activas
        </button>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium hover:bg-muted">
          <CheckCircle2 className="w-3 h-3" /> Completadas
        </button>
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {CLIENT_REQUESTS.map((req) => (
          <div key={req.id} className="bg-surface border rounded-lg p-4 shadow-soft hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {req.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                    req.status === "active" ? "bg-accent/15 text-accent" :
                    req.status === "completed" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {req.status === "active" ? "En curso" : req.status === "completed" ? "Completada" : "Cancelada"}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{req.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {req.tech && <span>Técnico: <strong className="text-foreground">{req.tech}</strong></span>}
                  <span>{req.time}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Costo</p>
                <p className="font-bold">{req.price}</p>
              </div>
            </div>
            {req.status === "active" && (
              <div className="mt-3 pt-3 border-t flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-medium">Técnico en camino — 5 min</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Technician: "Mis Trabajos" ───
const TECH_JOBS: Job[] = [
  { id: "j1", category: "Electricidad", title: "Tablero eléctrico hace cortocircuito", distanceKm: 1.2, expiresInMin: 2, payout: "$45–70", urgent: true },
  { id: "j2", category: "Plomería", title: "Fuga bajo el lavabo de cocina", distanceKm: 2.8, expiresInMin: 8, payout: "$35–55" },
  { id: "j3", category: "Climatización", title: "Aire acondicionado no enfría", distanceKm: 3.4, expiresInMin: 12, payout: "$60–90" },
];

const TECH_COMPLETED = [
  { id: "c1", title: "Instalación de luminarias LED", earnings: "$75", rating: 5, time: "Hoy, 10:30" },
  { id: "c2", title: "Reparación de interruptor", earnings: "$40", rating: 5, time: "Hoy, 08:15" },
  { id: "c3", title: "Cableado de oficina", earnings: "$120", rating: 4, time: "Ayer, 16:00" },
];

function TechJobsView() {
  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-5xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Gestión
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Trabajos</h1>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border text-sm font-medium hover:bg-muted">
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
          {TECH_JOBS.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </div>

      {/* Completed today */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
          Completados recientemente
        </h2>
        <div className="space-y-2">
          {TECH_COMPLETED.map((job) => (
            <div key={job.id} className="bg-surface border rounded-lg p-4 shadow-soft flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[color:var(--success)]/10 text-[color:var(--success)] grid place-items-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-[color:var(--success)]">{job.earnings}</p>
                <p className="text-xs text-muted-foreground">{"⭐".repeat(job.rating)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Admin: "Transacciones" ───
const ADMIN_TRANSACTIONS = [
  { id: "TX-001", client: "María López", tech: "Carlos M.", service: "Electricidad", amount: "$65", commission: "$6.50", status: "completed", time: "14:32" },
  { id: "TX-002", client: "José García", tech: "Ana P.", service: "Plomería", amount: "$45", commission: "$4.50", status: "in_progress", time: "14:20" },
  { id: "TX-003", client: "Laura Díaz", tech: "Pedro R.", service: "Climatización", amount: "$90", commission: "$9.00", status: "completed", time: "14:05" },
  { id: "TX-004", client: "Roberto S.", tech: "María G.", service: "General", amount: "$35", commission: "$3.50", status: "disputed", time: "13:48" },
  { id: "TX-005", client: "Carmen Ruiz", tech: "José R.", service: "Cerrajería", amount: "$55", commission: "$5.50", status: "completed", time: "13:30" },
  { id: "TX-006", client: "Ana Torres", tech: "Diego M.", service: "Electricidad", amount: "$80", commission: "$8.00", status: "completed", time: "13:15" },
];

function AdminJobsView() {
  return (
    <section className="px-4 md:px-6 py-6 space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">
            Finanzas
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Transacciones</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <DollarSign className="w-4 h-4" />
            <span className="font-bold">$37.50</span>
            <span className="text-white/40 text-xs">comisiones hoy</span>
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Hoy
          </div>
          <p className="text-xl font-bold text-white">24</p>
          <p className="text-[11px] text-white/40">transacciones</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Volumen
          </div>
          <p className="text-xl font-bold text-white">$1,420</p>
          <p className="text-[11px] text-white/40">total movido</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Disputas
          </div>
          <p className="text-xl font-bold text-red-400">1</p>
          <p className="text-[11px] text-white/40">pendiente</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm">Registro de Transacciones</h2>
          <button className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
            Exportar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40">
                <th className="text-left px-4 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                <th className="text-left px-4 py-2.5 font-medium">Técnico</th>
                <th className="text-left px-4 py-2.5 font-medium">Monto</th>
                <th className="text-left px-4 py-2.5 font-medium">Comisión</th>
                <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                <th className="text-left px-4 py-2.5 font-medium">Hora</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-mono text-white/50">{tx.id}</td>
                  <td className="px-4 py-2.5 text-white/80">{tx.client}</td>
                  <td className="px-4 py-2.5 text-white/80">{tx.tech}</td>
                  <td className="px-4 py-2.5 font-bold text-white">{tx.amount}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-400">{tx.commission}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                      tx.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                      tx.status === "in_progress" ? "bg-blue-500/15 text-blue-400" :
                      "bg-red-500/15 text-red-400"
                    )}>
                      {tx.status === "completed" ? "✓ OK" : tx.status === "in_progress" ? "⏳ Curso" : "⚠ Disputa"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-white/40">{tx.time}</td>
                </tr>
              ))}
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
