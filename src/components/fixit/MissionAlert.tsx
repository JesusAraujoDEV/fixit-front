import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Zap, X, Clock } from "lucide-react";

type MissionAlertProps = {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
  secondsLeft?: number;
};

/**
 * Epic "New Mission" modal with countdown ring for technician view.
 */
export function MissionAlert({ open, onAccept, onReject, secondsLeft: externalSeconds }: MissionAlertProps) {
  const [internalCountdown, setInternalCountdown] = useState(30);

  // Use external seconds from hook if provided, otherwise internal
  const countdown = externalSeconds ?? internalCountdown;

  useEffect(() => {
    if (!open || externalSeconds !== undefined) {
      setInternalCountdown(30);
      return;
    }
    const interval = setInterval(() => {
      setInternalCountdown((c) => {
        if (c <= 1) {
          onReject();
          return 30;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, onReject, externalSeconds]);

  const progress = (countdown / 30) * 100;
  const circumference = 2 * Math.PI * 54; // radius 54
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm bg-[#0f1629] border border-white/10 rounded-2xl p-6 shadow-[0_0_80px_-20px_rgba(255,102,0,0.3)]"
          >
            {/* Close */}
            <button
              onClick={onReject}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 grid place-items-center text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-3"
              >
                <Zap className="w-3.5 h-3.5" /> NUEVA MISIÓN
              </motion.div>
              <h2 className="text-xl font-bold text-white">Tablero eléctrico en cortocircuito</h2>
              <p className="text-sm text-white/50 mt-1">Electricidad · Urgente</p>
            </div>

            {/* Countdown ring */}
            <div className="flex justify-center mb-5">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke={countdown > 10 ? "#FF6600" : "#ef4444"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className="w-4 h-4 text-white/40 mb-0.5" />
                  <span className="text-2xl font-bold text-white">{countdown}s</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Pago Estimado</p>
                <p className="text-2xl font-bold text-[var(--success)] mt-1">$45–70</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Distancia</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-2xl font-bold text-white">1.2 km</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onReject}
                className="flex-1 h-12 rounded-lg border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition"
              >
                Rechazar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                className="flex-1 h-12 rounded-lg bg-accent text-white font-bold text-sm shadow-[0_0_20px_-4px_rgba(255,102,0,0.5)] hover:shadow-[0_0_30px_-4px_rgba(255,102,0,0.7)] transition-shadow"
              >
                Aceptar Misión
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
