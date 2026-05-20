import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Wrench,
  Bell,
  Search,
  Menu,
  LogOut,
  Home,
  PlusCircle,
  User,
  ClipboardList,
  Briefcase,
  Map,
  DollarSign,
  Star,
  ShieldCheck,
  Activity,
  Users,
  FileWarning,
  Settings,
  Inbox,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "./SessionProvider";
import { toast } from "sonner";
import type { UserRole } from "@/api/types";

// Re-export a simple hook that returns just the role for backward compat
export function useUserRole(): UserRole {
  const { role } = useSession();
  return role;
}

type NavItem = { to: string; label: string; icon: typeof Home };

const CLIENT_NAV: NavItem[] = [
  { to: "/dashboard", label: "Inicio", icon: Home },
  { to: "/request", label: "Nueva Solicitud", icon: PlusCircle },
  { to: "/jobs", label: "Mis Solicitudes", icon: ClipboardList },
  { to: "/profile", label: "Mi Perfil", icon: User },
];

const TECH_NAV: NavItem[] = [
  { to: "/pro", label: "Dashboard", icon: Briefcase },
  { to: "/jobs", label: "Mis Trabajos", icon: Map },
  { to: "/profile", label: "Ganancias", icon: DollarSign },
  { to: "/request", label: "Mi Perfil Pro", icon: Star },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Command Center", icon: Activity },
  { to: "/dashboard", label: "Red Global", icon: Users },
  { to: "/jobs", label: "Transacciones", icon: FileWarning },
  { to: "/profile", label: "Configuración", icon: Settings },
];

function getNavForRole(role: UserRole): NavItem[] {
  switch (role) {
    case "client": return CLIENT_NAV;
    case "technician": return TECH_NAV;
    case "admin": return ADMIN_NAV;
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "client": return "Cliente";
    case "technician": return "Técnico Pro";
    case "admin": return "Administrador";
  }
}

function getRoleColor(role: UserRole): string {
  switch (role) {
    case "client": return "bg-primary";
    case "technician": return "bg-accent";
    case "admin": return "bg-emerald-500";
  }
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case "client": return Home;
    case "technician": return Wrench;
    case "admin": return ShieldCheck;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { role, isAuthenticated, user, logout } = useSession();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const nav = getNavForRole(role);
  const isAdmin = role === "admin";
  const RoleIcon = getRoleIcon(role);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // Mientras redirige, no renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "min-h-screen w-full text-foreground",
          isAdmin ? "bg-[#0d1117]" : "bg-background"
        )}
      >
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col text-white transition-all duration-300",
            collapsed ? "w-16" : "w-60",
            isAdmin ? "bg-[#0d1117] border-r border-emerald-500/10" : "bg-[var(--slate-industrial)]"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
            <div className={cn("grid place-items-center w-9 h-9 rounded-md shrink-0", getRoleColor(role))}>
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="font-bold tracking-tight text-base">FixIt</span>
                <span className={cn(
                  "text-[10px] uppercase tracking-widest",
                  isAdmin ? "text-emerald-400/60" : role === "technician" ? "text-accent/60" : "text-white/50"
                )}>
                  {getRoleLabel(role)}
                </span>
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

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to + n.label}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? isAdmin
                        ? "bg-emerald-500/15 text-emerald-400 shadow-soft"
                        : role === "technician"
                          ? "bg-accent/15 text-accent shadow-soft"
                          : "bg-primary text-primary-foreground shadow-soft"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{n.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Role badge */}
          {!collapsed && (
            <div className={cn(
              "m-3 p-3 rounded-md border",
              isAdmin ? "bg-emerald-500/5 border-emerald-500/20"
                : role === "technician" ? "bg-accent/5 border-accent/20"
                : "bg-white/5 border-white/10"
            )}>
              <p className="text-xs text-white/60 mb-1">Sesión activa</p>
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full animate-pulse", getRoleColor(role))} />
                <span className="text-xs font-medium">{getRoleLabel(role)}</span>
              </div>
            </div>
          )}

          {/* Logout */}
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
            "sticky top-0 z-30 h-16 backdrop-blur border-b flex items-center px-4 md:px-6 gap-3",
            collapsed ? "md:pl-20" : "md:pl-64",
            isAdmin ? "bg-[#0d1117]/90 border-emerald-500/10" : "bg-surface/80 border-border"
          )}
        >
          <div className="flex md:hidden items-center gap-2">
            <div className={cn("grid place-items-center w-9 h-9 rounded-md", getRoleColor(role))}>
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <span className={cn("font-bold tracking-tight", isAdmin ? "text-white" : "text-foreground")}>FixIt</span>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className={cn("absolute left-3 w-4 h-4", isAdmin ? "text-white/40" : "text-muted-foreground")} />
            <input
              placeholder={
                isAdmin ? "Buscar usuarios, transacciones…"
                : role === "technician" ? "Buscar trabajos, clientes…"
                : "Buscar técnicos, servicios…"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  toast.info("Búsqueda en construcción", { description: "La búsqueda global estará disponible pronto." });
                }
              }}
              className={cn(
                "w-full h-10 pl-9 pr-3 rounded-md border border-transparent text-sm outline-none transition",
                isAdmin
                  ? "bg-white/5 focus:border-emerald-500/30 focus:bg-white/10 text-white placeholder:text-white/30"
                  : "bg-muted focus:border-ring focus:bg-surface"
              )}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className={cn(
                  "relative w-10 h-10 grid place-items-center rounded-md transition-colors",
                  isAdmin ? "hover:bg-white/5 text-white/70" : "hover:bg-muted"
                )}
                aria-label="Notificaciones"
                aria-expanded={notifOpen}
              >
                <Bell className="w-5 h-5" />
                <span className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", isAdmin ? "bg-emerald-400" : "bg-accent")} />
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "absolute right-0 top-12 w-80 rounded-lg border shadow-elevated z-50 overflow-hidden",
                      isAdmin ? "bg-[#161b22] border-emerald-500/20" : "bg-surface border-border"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 border-b flex items-center justify-between",
                      isAdmin ? "border-emerald-500/10" : "border-border"
                    )}>
                      <h3 className={cn("font-semibold text-sm", isAdmin ? "text-white" : "text-foreground")}>
                        Notificaciones
                      </h3>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        isAdmin ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/10 text-primary"
                      )}>
                        Próximamente
                      </span>
                    </div>
                    <div className="px-4 py-8 flex flex-col items-center gap-2">
                      <Inbox className={cn("w-10 h-10", isAdmin ? "text-white/20" : "text-muted-foreground/40")} />
                      <p className={cn("text-sm font-medium", isAdmin ? "text-white/60" : "text-muted-foreground")}>
                        No tienes notificaciones nuevas
                      </p>
                      <p className={cn("text-xs text-center", isAdmin ? "text-white/30" : "text-muted-foreground/70")}>
                        Las alertas de servicio y actualizaciones aparecerán aquí.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                "md:hidden w-10 h-10 grid place-items-center rounded-md transition-colors",
                isAdmin ? "text-white/50 hover:bg-red-500/10 hover:text-red-400" : "text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
              )}
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className={cn(
              "w-9 h-9 rounded-full grid place-items-center text-white text-sm font-semibold",
              role === "admin" ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                : role === "technician" ? "bg-gradient-to-br from-accent to-orange-700"
                : "bg-gradient-to-br from-primary to-blue-700"
            )}>
              {user?.full_name
                ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : role === "admin" ? "AD" : role === "technician" ? "TC" : "CL"}
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
        <nav className={cn(
          "md:hidden fixed bottom-0 inset-x-0 z-40 border-t shadow-elevated",
          isAdmin ? "bg-[#0d1117] border-emerald-500/10" : "bg-surface border-border"
        )}>
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, 1fr)` }}>
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <li key={n.to + n.label} className="flex justify-center">
                  <Link
                    to={n.to}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-2.5 w-full text-[10px] font-medium",
                      active
                        ? isAdmin ? "text-emerald-400"
                          : role === "technician" ? "text-accent"
                          : "text-primary"
                        : isAdmin ? "text-white/50" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </AnimatePresence>
  );
}
