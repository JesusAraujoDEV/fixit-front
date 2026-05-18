import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useUserRole } from "@/components/fixit/AppShell";
import {
  Star, Award, Shield, CheckCircle2, User, Mail, Phone, MapPin,
  DollarSign, TrendingUp, Calendar, Clock, Bell, Lock, Palette, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — FixIt" },
      { name: "description", content: "Tu perfil en FixIt." },
    ],
  }),
  component: ProfilePage,
});

// ─── Client Profile ───
function ClientProfileView() {
  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Cuenta</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mi Perfil</h1>
      </header>

      {/* Profile card */}
      <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-700 grid place-items-center text-white text-2xl font-bold">
          CL
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Carlos López</h2>
          <p className="text-sm text-muted-foreground">Cliente desde Enero 2025</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[color:var(--success)]">
              <Shield className="w-3.5 h-3.5" /> Verificado
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" /> Valencia, Carabobo
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <ClipboardIcon className="w-4 h-4 text-primary" />
          <p className="text-lg font-bold mt-2">12</p>
          <p className="text-xs text-muted-foreground">Solicitudes</p>
        </div>
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
          <p className="text-lg font-bold mt-2">10</p>
          <p className="text-xs text-muted-foreground">Completadas</p>
        </div>
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <Star className="w-4 h-4 text-accent" />
          <p className="text-lg font-bold mt-2">4.8</p>
          <p className="text-xs text-muted-foreground">Rating dado</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface border rounded-lg shadow-soft p-5 space-y-4">
        <h3 className="font-semibold">Información Personal</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>carlos.lopez@email.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>+58 412-555-1234</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Av. Bolívar Norte, Valencia, Carabobo</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return <Calendar className={className} />;
}

// ─── Technician Profile (Ganancias) ───
function TechProfileView() {
  const weeklyEarnings = [
    { day: "Lun", amount: 85 },
    { day: "Mar", amount: 120 },
    { day: "Mié", amount: 65 },
    { day: "Jue", amount: 145 },
    { day: "Vie", amount: 95 },
    { day: "Sáb", amount: 180 },
    { day: "Dom", amount: 45 },
  ];
  const maxEarning = Math.max(...weeklyEarnings.map(d => d.amount));

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-4xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Finanzas</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Ganancias</h1>
      </header>

      {/* Earnings summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Hoy
          </div>
          <p className="text-2xl font-bold text-[var(--success)]">$285</p>
        </div>
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Calendar className="w-3.5 h-3.5" /> Esta semana
          </div>
          <p className="text-2xl font-bold">$735</p>
        </div>
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Este mes
          </div>
          <p className="text-2xl font-bold">$2,840</p>
        </div>
        <div className="bg-surface border rounded-lg p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </div>
          <p className="text-2xl font-bold text-accent">$145</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-surface border rounded-lg p-5 shadow-soft">
        <h3 className="font-semibold mb-4">Ganancias de la Semana</h3>
        <div className="flex items-end gap-3 h-40">
          {weeklyEarnings.map((d) => {
            const height = (d.amount / maxEarning) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-foreground">${d.amount}</span>
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro profile card */}
      <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-orange-700 grid place-items-center text-white text-xl font-bold">
          JM
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold tracking-tight">Juan Martínez</h2>
          <p className="text-sm text-muted-foreground">Técnico Electricista · Nivel Pro</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent" /> 4.92 (412)</span>
            <span className="inline-flex items-center gap-1 text-[color:var(--success)]"><Shield className="w-3.5 h-3.5" /> Verificado</span>
            <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5 text-primary" /> Top 5%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Admin Profile (Configuración) ───
function AdminProfileView() {
  const settings = [
    { icon: Bell, label: "Notificaciones", desc: "Alertas de fraude, nuevos técnicos", active: true },
    { icon: Lock, label: "Seguridad", desc: "2FA, sesiones activas", active: true },
    { icon: Globe, label: "Región", desc: "Valencia, Carabobo — Venezuela", active: false },
    { icon: Palette, label: "Tema", desc: "Modo oscuro (Command Center)", active: true },
    { icon: User, label: "Cuenta Admin", desc: "admin@fixit.pro", active: false },
  ];

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">Sistema</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Configuración</h1>
      </header>

      {/* Admin profile */}
      <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center text-white text-xl font-bold">
          AD
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Administrador</h2>
          <p className="text-sm text-white/50">Super Admin · Acceso total</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              Nivel máximo
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
            return (
              <div key={s.label} className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 grid place-items-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{s.label}</p>
                  <p className="text-xs text-white/40">{s.desc}</p>
                </div>
                <div className={cn(
                  "w-10 h-6 rounded-full relative transition-colors",
                  s.active ? "bg-emerald-500" : "bg-white/10"
                )}>
                  <span className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    s.active ? "left-[18px]" : "left-0.5"
                  )} />
                </div>
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
