import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Home, Cog, Wifi, ShieldCheck, Search, MessageCircle, Briefcase, TrendingUp, Activity, Users, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/api/hooks";
import { toast } from "sonner";
import type { User } from "@/api/types";

export type UserRole = "client" | "technician" | "admin";

// Credenciales de prueba por rol (seeder del backend)
const TEST_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  client: { email: "maria.prebo@gmail.com", password: "Cliente1!" },
  technician: { email: "pedro.electricista@gmail.com", password: "Tecnico1!" },
  admin: { email: "admin@fixit.com", password: "Admin123!" },
};

export function AuthScreen({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const loginMutation = useLogin();
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleRoleLogin = async (role: UserRole) => {
    const creds = TEST_CREDENTIALS[role];
    setLoadingRole(role);
    try {
      const result = await loginMutation.mutateAsync(creds);
      onLogin(result.user, result.token);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error de conexión con el servidor";
      toast.error("Error al iniciar sesión", { description: message || "Intenta de nuevo" });
    } finally {
      setLoadingRole(null);
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen w-full bg-[var(--slate-industrial)] flex items-center justify-center p-4 md:p-8 overflow-hidden relative"
      >
        {/* Background ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-6xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary grid place-items-center">
                <Wrench className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white tracking-tight">FixIt</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Pro Network</p>
              </div>
            </div>
            <p className="text-sm text-white/50 mt-4">Selecciona tu perfil para continuar</p>
          </motion.div>

          {/* Triple cards */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {/* Client Card */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRoleLogin("client")}
              disabled={loadingRole !== null}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-7 md:p-8 text-left transition-all duration-500",
                "bg-gradient-to-br from-primary/90 to-primary/70 border-2 border-primary/30",
                "hover:border-white/40 hover:shadow-[0_0_60px_-10px_rgba(0,71,171,0.5)]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {/* Glow border effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[1px] rounded-2xl border border-white/20" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent blur-sm" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center mb-5">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Soy Cliente</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  ¿Necesitas una reparación? Publica tu solicitud y conecta con técnicos verificados.
                </p>
                {/* Role icons */}
                <div className="flex items-center gap-2 mt-4 text-white/40">
                  <Search className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  <Home className="w-4 h-4" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  {loadingRole === "client" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ingresar"}
                  {loadingRole !== "client" && <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>}
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            </motion.button>

            {/* Technician Card */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRoleLogin("technician")}
              disabled={loadingRole !== null}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-7 md:p-8 text-left transition-all duration-500",
                "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-white/10",
                "hover:border-accent/40 hover:shadow-[0_0_60px_-10px_rgba(255,102,0,0.4)]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {/* Radar animation on hover */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute w-28 h-28 rounded-full border border-accent/20 animate-[radar-ping_3s_ease-out_infinite]" />
                  <span className="absolute w-48 h-48 rounded-full border border-accent/10 animate-[radar-ping_3s_ease-out_0.5s_infinite]" />
                  <span className="absolute w-72 h-72 rounded-full border border-accent/5 animate-[radar-ping_3s_ease-out_1s_infinite]" />
                </div>
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-accent/15 backdrop-blur grid place-items-center mb-5">
                  <Cog className="w-7 h-7 text-accent" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Soy Técnico</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Únete a la red de profesionales. Recibe trabajos y maximiza tus ingresos.
                </p>
                {/* Role icons */}
                <div className="flex items-center gap-2 mt-4 text-white/40">
                  <Briefcase className="w-4 h-4" />
                  <TrendingUp className="w-4 h-4" />
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent/90 group-hover:text-accent transition-colors">
                  {loadingRole === "technician" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ingresar"}
                  {loadingRole !== "technician" && <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>}
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-accent/5" />
            </motion.button>

            {/* Admin Card */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRoleLogin("admin")}
              disabled={loadingRole !== null}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-7 md:p-8 text-left transition-all duration-500",
                "bg-gradient-to-br from-[#0d1117] to-[#161b22] border-2 border-emerald-500/20",
                "hover:border-emerald-400/50 hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {/* Matrix-like scan lines on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.03) 2px, rgba(16,185,129,0.03) 4px)",
                }} />
                <div className="absolute inset-[1px] rounded-2xl border border-emerald-400/20" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 backdrop-blur grid place-items-center mb-5">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Administrador</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Centro de comando. Monitorea la red, gestiona usuarios y analiza métricas globales.
                </p>
                {/* Role icons */}
                <div className="flex items-center gap-2 mt-4 text-white/40">
                  <Activity className="w-4 h-4" />
                  <Users className="w-4 h-4" />
                  <Settings className="w-4 h-4" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400/90 group-hover:text-emerald-400 transition-colors">
                  {loadingRole === "admin" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ingresar"}
                  {loadingRole !== "admin" && <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>}
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/5" />
              <div className="absolute top-4 right-4 text-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-xs text-white/40 mt-8"
          >
            FixIt Pro Network v2.0 — Conectado al backend real
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
