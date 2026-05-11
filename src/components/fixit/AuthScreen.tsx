import { motion } from "framer-motion";
import { Wrench, Home, Cog, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "client" | "technician";

export function AuthScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <div className="min-h-screen w-full bg-[var(--slate-industrial)] flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl">
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
        </motion.div>

        {/* Dual cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Client Card */}
          <motion.button
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLogin("client")}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-8 md:p-10 text-left transition-all duration-500",
              "bg-gradient-to-br from-primary/90 to-primary border-2 border-primary/30",
              "hover:border-white/40 hover:shadow-[0_0_60px_-10px_rgba(0,71,171,0.5)]"
            )}
          >
            {/* Glow border effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-[1px] rounded-2xl border border-white/20" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent blur-sm" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur grid place-items-center mb-6">
                <Home className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Soy Cliente</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                ¿Necesitas una reparación? Publica tu solicitud y conecta con técnicos verificados en minutos.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                Ingresar como cliente
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          </motion.button>

          {/* Technician Card */}
          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLogin("technician")}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-8 md:p-10 text-left transition-all duration-500",
              "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-white/10",
              "hover:border-accent/40 hover:shadow-[0_0_60px_-10px_rgba(255,102,0,0.4)]"
            )}
          >
            {/* Radar animation on hover */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute w-32 h-32 rounded-full border border-accent/20 animate-[radar-ping_3s_ease-out_infinite]" />
                <span className="absolute w-56 h-56 rounded-full border border-accent/10 animate-[radar-ping_3s_ease-out_0.5s_infinite]" />
                <span className="absolute w-80 h-80 rounded-full border border-accent/5 animate-[radar-ping_3s_ease-out_1s_infinite]" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/15 backdrop-blur grid place-items-center mb-6">
                <Cog className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Soy Técnico</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Únete a la red de profesionales. Recibe trabajos, gestiona tu agenda y maximiza tus ingresos.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent/90 group-hover:text-accent transition-colors">
                Ingresar como técnico
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </div>

            {/* Accent decorative */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-accent/5" />
            <div className="absolute top-4 right-4 text-accent/30">
              <Wifi className="w-6 h-6" />
            </div>
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-white/40 mt-8"
        >
          Prototipo FixIt v1.0 — Sin autenticación real
        </motion.p>
      </div>
    </div>
  );
}
