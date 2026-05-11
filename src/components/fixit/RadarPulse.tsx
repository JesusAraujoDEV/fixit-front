import { motion } from "framer-motion";

/**
 * Radar pulse animation overlay for the map.
 * Shows expanding rings from center to simulate "searching for technicians".
 */
export function RadarPulse({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      {/* Center dot */}
      <div className="relative">
        <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_12px_4px_rgba(255,102,0,0.5)]" />
        {/* Rings */}
        {[0, 0.6, 1.2, 1.8].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto rounded-full border-2 border-accent/40"
            initial={{ width: 16, height: 16, opacity: 0.8 }}
            animate={{
              width: [16, 200 + i * 60],
              height: [16, 200 + i * 60],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2.5,
              delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ translateX: "-50%", translateY: "-50%", left: "50%", top: "50%" }}
          />
        ))}
      </div>
    </div>
  );
}
