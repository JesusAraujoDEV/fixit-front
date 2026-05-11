import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Cpu, CheckCircle2 } from "lucide-react";

/**
 * Simulated AI diagnostic scanner overlay for uploaded images.
 * Shows a grid scan effect and then a fake diagnosis result.
 */
export function AiScanner({ imageSrc, onComplete }: { imageSrc: string; onComplete?: () => void }) {
  const [phase, setPhase] = useState<"scanning" | "done">("scanning");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-primary/30 bg-black">
      <img src={imageSrc} alt="Análisis" className="w-full h-full object-cover opacity-70" />

      {phase === "scanning" && (
        <>
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(0,71,171,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,171,0.15) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_2px_rgba(255,102,0,0.6)]"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent/70" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent/70" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent/70" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent/70" />

          {/* Status text */}
          <div className="absolute bottom-3 inset-x-3">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur rounded px-2.5 py-1.5">
              <Cpu className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="text-[11px] text-white/90 font-medium">Analizando daño con IA…</span>
            </div>
          </div>
        </>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[var(--success)]/20 grid place-items-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            </div>
            <p className="text-sm font-bold text-white">Diagnóstico Preliminar</p>
            <p className="text-xs text-white/70 mt-1">
              Posible cortocircuito en conexión principal. Requiere técnico electricista.
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold">
              Confianza: 87%
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
