import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wrench,
  PlusCircle,
  ListChecks,
  User,
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pro", label: "Modo Técnico", icon: Wrench },
  { to: "/request", label: "Solicitar", icon: PlusCircle },
  { to: "/jobs", label: "Trabajos", icon: ListChecks },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  function handleLogout() {
    toast.success("Sesión cerrada exitosamente", {
      description: "Has salido de tu cuenta FixIt.",
    });
    setTimeout(() => setLoggedOut(true), 600);
  }

  // Mock login screen
  if (loggedOut) {
    return (
      <div className="min-h-screen w-full bg-[var(--slate-industrial)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-surface rounded-xl p-8 shadow-elevated text-center">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary grid place-items-center mb-4">
            <Wrench className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">FixIt Pro Network</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Inicia sesión para continuar</p>
          <button
            onClick={() => setLoggedOut(false)}
            className="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition"
          >
            Iniciar Sesión (Demo)
          </button>
          <p className="text-xs text-muted-foreground mt-4">Prototipo — sin autenticación real</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col bg-[var(--slate-industrial)] text-white transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <div className="grid place-items-center w-9 h-9 rounded-md bg-primary shrink-0">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold tracking-tight text-base">FixIt</span>
              <span className="text-[10px] uppercase tracking-widest text-white/50">Pro Network</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto p-1.5 rounded hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="m-3 p-3 rounded-md bg-white/5 border border-white/10">
            <p className="text-xs text-white/60 mb-1">Estado de Red</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-xs font-medium">187 técnicos activos</span>
            </div>
          </div>
        )}
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              "text-white/60 hover:bg-red-500/15 hover:text-red-300"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <header
        className={cn(
          "sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur border-b flex items-center px-4 md:px-6 gap-3",
          collapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        <div className="flex md:hidden items-center gap-2">
          <div className="grid place-items-center w-9 h-9 rounded-md bg-primary">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">FixIt</span>
        </div>
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Buscar servicios, técnicos, tickets…"
            className="w-full h-10 pl-9 pr-3 rounded-md bg-muted border border-transparent focus:border-ring focus:bg-surface text-sm outline-none transition"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative w-10 h-10 grid place-items-center rounded-md hover:bg-muted">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </button>
          <button
            onClick={handleLogout}
            className="md:hidden w-10 h-10 grid place-items-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-sm font-semibold">
            JM
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 pb-20 md:pb-6",
          collapsed ? "md:pl-16" : "md:pl-60"
        )}
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t shadow-elevated">
        <ul className="grid grid-cols-5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            const isCenter = n.to === "/request";
            return (
              <li key={n.to} className="flex justify-center">
                <Link
                  to={n.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 w-full text-[10px] font-medium",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {isCenter ? (
                    <div className="w-12 h-12 -mt-6 rounded-full bg-primary grid place-items-center shadow-elevated ring-4 ring-surface">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  ) : (
                    <Icon className={cn("w-5 h-5", active && "text-primary")} />
                  )}
                  <span>{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
