import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../client";
import type { SearchAck, SearchTimeout } from "../types";

export type RadarStatus = "idle" | "searching" | "found" | "timeout" | "cancelled";

interface UseRadarSearchReturn {
  status: RadarStatus;
  searchId: string | null;
  startSearch: (requestId: string) => void;
  cancelSearch: () => void;
}

/**
 * Hook para controlar el flujo de búsqueda de técnico (radar animation).
 *
 * Eventos:
 * - Emite `search:start` al iniciar
 * - Escucha `search:ack` para confirmar que el servidor busca
 * - Escucha `search:timeout` si nadie acepta en 30s
 * - Escucha `mission:confirmed` (del flujo de misión) para marcar "found"
 */
export function useRadarSearch(): UseRadarSearchReturn {
  const [status, setStatus] = useState<RadarStatus>("idle");
  const [searchId, setSearchId] = useState<string | null>(null);
  const searchIdRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleAck = (data: SearchAck) => {
      setSearchId(data.search_id);
      searchIdRef.current = data.search_id;
      setStatus("searching");
    };

    const handleTimeout = (data: SearchTimeout) => {
      if (data.search_id === searchIdRef.current) {
        setStatus("timeout");
      }
    };

    // Cuando el técnico acepta, el servidor confirma al cliente
    const handleConfirmed = () => {
      setStatus("found");
    };

    socket.on("search:ack", handleAck);
    socket.on("search:timeout", handleTimeout);
    socket.on("mission:confirmed", handleConfirmed);

    return () => {
      socket.off("search:ack", handleAck);
      socket.off("search:timeout", handleTimeout);
      socket.off("mission:confirmed", handleConfirmed);
    };
  }, []);

  const startSearch = useCallback((requestId: string) => {
    const socket = getSocket();
    if (!socket) return;
    setStatus("searching");
    socket.emit("search:start", { request_id: requestId });
  }, []);

  const cancelSearch = useCallback(() => {
    const socket = getSocket();
    if (!socket || !searchIdRef.current) return;
    socket.emit("search:cancel", { search_id: searchIdRef.current });
    setStatus("cancelled");
    setSearchId(null);
    searchIdRef.current = null;
  }, []);

  return { status, searchId, startSearch, cancelSearch };
}
