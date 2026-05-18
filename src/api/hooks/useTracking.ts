import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../client";
import type { TrackingUpdate } from "../types";

interface UseTrackingReturn {
  /** Última posición recibida del técnico */
  position: { lat: number; lng: number } | null;
  /** Timestamp de la última actualización */
  lastUpdate: string | null;
  /** ID del técnico que se está rastreando */
  technicianId: string | null;
  /** Inicia el envío periódico de ubicación (para técnicos en misión) */
  startEmitting: () => void;
  /** Detiene el envío de ubicación */
  stopEmitting: () => void;
  /** Indica si el técnico está emitiendo su ubicación */
  isEmitting: boolean;
}

/**
 * Hook bidireccional de tracking:
 *
 * - Como CLIENTE/ADMIN: escucha `tracking:update` para mover el marker del técnico.
 * - Como TÉCNICO: emite `location:update` cada 5s con la posición GPS actual.
 */
export function useTracking(): UseTrackingReturn {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [technicianId, setTechnicianId] = useState<string | null>(null);
  const [isEmitting, setIsEmitting] = useState(false);
  const emitIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // ─── Listener: recibir posición del técnico ─────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = (data: TrackingUpdate) => {
      setPosition({ lat: data.latitude, lng: data.longitude });
      setLastUpdate(data.timestamp);
      setTechnicianId(data.technician_id);
    };

    socket.on("tracking:update", handleUpdate);

    return () => {
      socket.off("tracking:update", handleUpdate);
    };
  }, []);

  // ─── Emitter: enviar posición propia (técnico) ──────────────────────────
  const startEmitting = useCallback(() => {
    const socket = getSocket();
    if (!socket || isEmitting) return;

    setIsEmitting(true);

    const emitPosition = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          socket.emit("location:update", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("[useTracking] Geolocation error:", err.message);
        },
        { enableHighAccuracy: true, timeout: 4000 },
      );
    };

    // Emitir inmediatamente y luego cada 5 segundos
    emitPosition();
    emitIntervalRef.current = setInterval(emitPosition, 5000);
  }, [isEmitting]);

  const stopEmitting = useCallback(() => {
    if (emitIntervalRef.current) {
      clearInterval(emitIntervalRef.current);
      emitIntervalRef.current = null;
    }
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsEmitting(false);
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopEmitting();
    };
  }, [stopEmitting]);

  return {
    position,
    lastUpdate,
    technicianId,
    startEmitting,
    stopEmitting,
    isEmitting,
  };
}
