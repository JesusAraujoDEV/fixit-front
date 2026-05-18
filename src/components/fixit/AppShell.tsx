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
} from "lucide-react";
import { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AuthScreen, type UserRole } from "./AuthScreen";

const RoleContext = createContext<UserRole>("client");
export const useUserRole = () => useContext(RoleContext);

type NavItem = { to: string; label: string; icon: typeof Home };

// Client: simple, friendly — only sees their own stuff
const CLIENT_NAV: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/request", label: "Nueva Solicitud", icon: PlusCircle },
  { to: "/jobs", label: "Mis Solicitudes", icon: ClipboardList },
  { to: "/profile", label: "Mi Perfil", icon: User },
];

// Technician: dense, action-oriented
const TECH_NAV: NavItem[] = [
  { to: "/pro", label: "Dashboard", icon: Briefcase },
  { to: "/jobs", label: "Mis Trabajos", icon: Map },
  { to: "/profile", label: "Ganancias", icon: DollarSign },
  { to: "/request", label: "Mi Perfil Pro", icon: Star },
];

// Admin: command center
const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Command Center", icon: Activity },
  { to: "/", label: "Red Global", icon: Users },
  { to: "/jobs", label: "Transacciones", icon: FileWarning },
  { to: "/profile", label: "Configuración", icon: Settings },
];

// Landing page per role
function getLandingRoute(role: UserRole): string {
  switch (role) {
    case "client": return "/";
    case "technician": return "/pro";
    case "admin": return "/admin";
  }
}

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
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loggedOut, setLoggedOut] = useState(true);
  const [role, setRole] = useState<UserRole>("client");

  const nav = getNavForRole(role);
  const isAdmin = role === "admin";
  const RoleIcon = getRoleIcon(role);

  // Navigate to landing page when role changes
  useEffect(() => {
    if (!loggedOut) {
      const landing = getLandingRoute(role);
      if (pathname !== landing) {
        navigate({ to: landing });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, loggedOut]);

  function handleLogout() {
    toast.success("Sesión cerrada exitosamente", {
      description: "Has salido de tu cuenta FixIt.",
    });
    setTimeout(() => setLoggedOut(true), 400);
  }

  // Auth screen (triple entry)
  if (loggedOut) {
    return (
      <AuthScreen
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setLoggedOut(false);
          toast.success(`Bienvenido a FixIt`, {
            description: `Modo ${getRoleLabel(selectedRole)} activado`,
          });
        }}
      />
    );
  }

  return (
    <RoleContext.Provider value={role}>
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
                className={cn(
                  "w-full h-10 pl-9 pr-3 rounded-md border border-transparent text-sm outline-none transition",
                  isAdmin
                    ? "bg-white/5 focus:border-emerald-500/30 focus:bg-white/10 text-white placeholder:text-white/30"
                    : "bg-muted focus:border-ring focus:bg-surface"
                )}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className={cn(
                "relative w-10 h-10 grid place-items-center rounded-md",
                isAdmin ? "hover:bg-white/5 text-white/70" : "hover:bg-muted"
              )}>
                <Bell className="w-5 h-5" />
                <span className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", isAdmin ? "bg-emerald-400" : "bg-accent")} />
              </button>
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
                {role === "admin" ? "AD" : role === "technician" ? "JM" : "CL"}
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
    </RoleContext.Provider>
  );
}
