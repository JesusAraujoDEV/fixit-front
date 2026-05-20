import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, useUserRole } from "@/components/fixit/AppShell";
import { useSession } from "@/components/fixit/SessionProvider";
import { useUserStats, useCompletedJobs } from "@/api/hooks";
import {
  Star, Award, Shield, CheckCircle2, User, Mail, Phone, MapPin,
  DollarSign, TrendingUp, Calendar, Clock, Bell, Lock, Palette, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — FixIt" },
      { name: "description", content: "Tu perfil en FixIt." },
    ],
  }),
  component: ProfilePage,
});

// ─── Helpers ───
function getInitials(fullName: string | undefined): string {
  if (!fullName) return "??";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatMemberSince(createdAt: string | undefined, role: string): string {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const month = date.toLocaleDateString("es-VE", { month: "long" });
  const year = date.getFullYear();
  const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const roleLabel = role === "technician" ? "Técnico" : role === "admin" ? "Admin" : "Cliente";
  return `${roleLabel} desde ${capitalMonth} ${year}`;
}

// ─── Skeleton for stats ───
function StatSkeleton() {
  return <div className="bg-surface border rounded-lg p-4 shadow-soft animate-pulse h-20" />;
}

// ─── Client Profile ───
function ClientProfileView() {
  const { user } = useSession();
  const { data: stats, isLoading } = useUserStats();

  const initials = getInitials(user?.full_name);
  const memberSince = formatMemberSince(user?.created_at, "client");

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Cuenta</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mi Perfil</h1>
      </header>

      {/* Profile card */}
      <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{user?.full_name ?? "—"}</h2>
          <p className="text-sm text-muted-foreground">{memberSince}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[color:var(--success)]">
              <Shield className="w-3.5 h-3.5" /> Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-lg font-bold mt-2">{stats?.total_requests ?? 0}</p>
              <p className="text-xs text-muted-foreground">Solicitudes</p>
            </div>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <p className="text-lg font-bold mt-2">{stats?.completed_requests ?? 0}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <Star className="w-4 h-4 text-accent" />
              <p className="text-lg font-bold mt-2">
                {stats?.rating_average ? stats.rating_average.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Rating {stats?.total_reviews ? `(${stats.total_reviews})` : ""}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-surface border rounded-lg shadow-soft p-5 space-y-4">
        <h3 className="font-semibold">Información Personal</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user?.email ?? "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className={!user?.phone ? "text-muted-foreground italic" : ""}>
              {user?.phone || "No especificado"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Technician Profile (Ganancias) ───
function TechProfileView() {
  const { user } = useSession();
  const { data: completedJobs, isLoading } = useCompletedJobs();

  const initials = getInitials(user?.full_name);
  const memberSince = formatMemberSince(user?.created_at, "technician");

  // Calcular ganancias reales de los trabajos completados
  const totalEarnings = (completedJobs ?? []).reduce((sum, j) => {
    const num = parseFloat(j.earnings.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const jobCount = completedJobs?.length ?? 0;

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-4xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Finanzas</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Ganancias</h1>
      </header>

      {/* Earnings summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Total ganado
              </div>
              <p className="text-2xl font-bold text-[var(--success)]">${totalEarnings.toFixed(0)}</p>
            </div>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Trabajos
              </div>
              <p className="text-2xl font-bold">{jobCount}</p>
            </div>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Promedio
              </div>
              <p className="text-2xl font-bold">
                {jobCount > 0 ? `$${(totalEarnings / jobCount).toFixed(0)}` : "—"}
              </p>
            </div>
            <div className="bg-surface border rounded-lg p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Star className="w-3.5 h-3.5" /> Rating
              </div>
              <p className="text-2xl font-bold">
                {jobCount > 0
                  ? (completedJobs!.reduce((s, j) => s + j.rating, 0) / jobCount).toFixed(1)
                  : "—"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recent earnings chart from real data */}
      {!isLoading && jobCount > 0 && (
        <div className="bg-surface border rounded-lg p-5 shadow-soft">
          <h3 className="font-semibold mb-4">Últimos Trabajos</h3>
          <div className="space-y-2">
            {(completedJobs ?? []).slice(0, 7).map((job) => (
              <div key={job.id} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-md bg-[color:var(--success)]/10 text-[color:var(--success)] grid place-items-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="flex-1 truncate">{job.title}</span>
                <span className="font-bold text-[color:var(--success)]">{job.earnings}</span>
                <span className="text-xs text-muted-foreground">
                  {"⭐".repeat(job.rating)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && jobCount === 0 && (
        <div className="bg-surface border rounded-lg p-8 shadow-soft text-center">
          <p className="text-muted-foreground text-sm">No hay datos de ganancias aún. Completa tu primer trabajo para ver estadísticas.</p>
        </div>
      )}

      {/* Pro profile card */}
      <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-orange-700 grid place-items-center text-white text-xl font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold tracking-tight">{user?.full_name ?? "—"}</h2>
          <p className="text-sm text-muted-foreground">{memberSince}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[color:var(--success)]">
              <Shield className="w-3.5 h-3.5" /> Verificado
            </span>
            {jobCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-primary" /> {jobCount} trabajos
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Admin Profile (Configuración) ───
function AdminProfileView() {
  const { user } = useSession();
  const initials = getInitials(user?.full_name);

  const [settingsState, setSettingsState] = useState({
    Notificaciones: true,
    Seguridad: true,
    Región: false,
    Tema: true,
    "Cuenta Admin": false,
  });

  const settings = [
    { icon: Bell, label: "Notificaciones" as const, desc: "Alertas de fraude, nuevos técnicos" },
    { icon: Lock, label: "Seguridad" as const, desc: "2FA, sesiones activas" },
    { icon: Globe, label: "Región" as const, desc: "Valencia, Carabobo — Venezuela" },
    { icon: Palette, label: "Tema" as const, desc: "Modo oscuro (Command Center)" },
    { icon: User, label: "Cuenta Admin" as const, desc: user?.email ?? "—" },
  ];

  const handleToggle = (label: keyof typeof settingsState) => {
    const newValue = !settingsState[label];
    setSettingsState((prev) => ({ ...prev, [label]: newValue }));
    toast.info(`${label}: ${newValue ? "Activado" : "Desactivado"}`, {
      description: "Configuración guardada (integración pendiente).",
    });
  };

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">Sistema</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Configuración</h1>
      </header>

      {/* Admin profile */}
      <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center text-white text-xl font-bold">
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{user?.full_name ?? "Administrador"}</h2>
          <p className="text-sm text-white/50">{user?.email ?? "—"}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              Administrador
            </span>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-emerald-500/10">
          <h3 className="font-semibold text-white text-sm">Preferencias del Sistema</h3>
        </div>
        <div className="divide-y divide-white/5">
          {settings.map((s) => {
            const Icon = s.icon;
            const active = settingsState[s.label];
            return (
              <div key={s.label} className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 grid place-items-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{s.label}</p>
                  <p className="text-xs text-white/40">{s.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(s.label)}
                  role="switch"
                  aria-checked={active}
                  className={cn(
                    "w-10 h-6 rounded-full relative transition-colors cursor-pointer",
                    active ? "bg-emerald-500" : "bg-white/10"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    active ? "left-[18px]" : "left-0.5"
                  )} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Main ───
function ProfilePage() {
  const role = useUserRole();

  return (
    <AppShell>
      {role === "client" && <ClientProfileView />}
      {role === "technician" && <TechProfileView />}
      {role === "admin" && <AdminProfileView />}
    </AppShell>
  );
}
