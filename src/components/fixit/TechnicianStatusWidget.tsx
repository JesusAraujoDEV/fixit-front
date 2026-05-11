import { motion } from "framer-motion";
import { Navigation, Clock } from "lucide-react";

/**
 * Glassmorphism floating widget showing assigned technician status.
 */
export function TechnicianStatusWidget({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-80 z-20"
    >
      <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-elevated p-4">
        <div className="flex items-center gap-3">
          {/* Technician avatar */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold text-sm">
              CM
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--success)] border-2 border-white/20" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Carlos Mendoza</p>
            <p className="text-xs text-white/60">Electricista · ⭐ 4.9</p>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-accent">
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">3 min</span>
            </div>
            <p className="text-[10px] text-white/50">en camino</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Llegada estimada
            </span>
            <span className="text-white/70 font-medium">75%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status label */}
        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-white/70">Técnico asignado — en ruta hacia tu ubicación</span>
        </div>
      </div>
    </motion.div>
  );
}
