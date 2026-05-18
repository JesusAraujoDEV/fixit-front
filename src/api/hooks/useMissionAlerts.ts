import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../client";
import type { MissionOffer, MissionConfirmed } from "../types";

export type MissionStatus =
  | "idle"
  | "offered"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "expired";

interface UseMissionAlertsReturn {
  status: MissionStatus;
  currentOffer: MissionOffer | null;
  secondsLeft: number;
  acceptMission: () => void;
  rejectMission: () => void;
}

/**
 * Hook para el técnico: escucha ofertas de misión y maneja el countdown de 30s.
 *
 * Eventos:
 * - Escucha `mission:offer` → muestra tarjeta con countdown
 * - Emite `mission:accept` o `mission:reject`
 * - Escucha `mission:confirmed` → misión asignada
 * - Escucha `mission:expired` → se acabó el tiempo
 */
export function useMissionAlerts(): UseMissionAlertsReturn {
  const [status, setStatus] = useState<MissionStatus>("idle");
  const [currentOffer, setCurrentOffer] = useState<MissionOffer | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpiar timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Iniciar countdown
  const startCountdown = useCallback(
    (seconds: number) => {
      clearTimer();
      setSecondsLeft(seconds);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer],
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleOffer = (data: MissionOffer) => {
      setCurrentOffer(data);
      setStatus("offered");
      startCountdown(data.expires_in_seconds);
    };

    const handleConfirmed = (_data: MissionConfirmed) => {
      clearTimer();
      setStatus("confirmed");
    };

    const handleExpired = () => {
      clearTimer();
      setStatus("expired");
      setCurrentOffer(null);
    };

    socket.on("mission:offer", handleOffer);
    socket.on("mission:confirmed", handleConfirmed);
    socket.on("mission:expired", handleExpired);

    return () => {
      socket.off("mission:offer", handleOffer);
      socket.off("mission:confirmed", handleConfirmed);
      socket.off("mission:expired", handleExpired);
      clearTimer();
    };
  }, [startCountdown, clearTimer]);

  const acceptMission = useCallback(() => {
    const socket = getSocket();
    if (!socket || !currentOffer) return;
    socket.emit("mission:accept", { mission_id: currentOffer.mission_id });
    setStatus("accepted");
    clearTimer();
  }, [currentOffer, clearTimer]);

  const rejectMission = useCallback(() => {
    const socket = getSocket();
    if (!socket || !currentOffer) return;
    socket.emit("mission:reject", { mission_id: currentOffer.mission_id });
    setStatus("rejected");
    setCurrentOffer(null);
    clearTimer();
  }, [currentOffer, clearTimer]);

  return { status, currentOffer, secondsLeft, acceptMission, rejectMission };
}
