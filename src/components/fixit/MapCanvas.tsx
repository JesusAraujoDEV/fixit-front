import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import { useTechnicianMarkers, useRequestMarkers } from "@/api/hooks";
import type { TechnicianMarker, RequestMarker, GeoParams } from "@/api/types";

// Valencia, Carabobo — centro por defecto
const VALENCIA_CENTER: [number, number] = [10.1910, -68.0130];
const DEFAULT_ZOOM = 13;

// Custom icon using SVG for requests (orange/accent)
function createCustomIcon(type: "request" | "technician"): L.DivIcon {
  const color = type === "request" ? "#FF6600" : "#0047AB";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "custom-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const requestIcon = createCustomIcon("request");
const technicianIcon = createCustomIcon("technician");

// Component to invalidate map size on mount
function MapResizer() {
  const map = useMap();
  const resized = useRef(false);

  useEffect(() => {
    if (!resized.current && map && map.getContainer()) {
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {
          // Map not ready yet, ignore
        }
      }, 300);
      resized.current = true;
    }
  }, [map]);

  return null;
}

export function MapCanvas({
  heatmap: _heatmap = false,
  offline = false,
  className,
  variant = "requests",
  geoParams,
}: {
  heatmap?: boolean;
  offline?: boolean;
  className?: string;
  variant?: "requests" | "technicians" | "dark" | "light";
  geoParams?: GeoParams;
}) {
  // Parámetros geo por defecto: Valencia, Carabobo, 10km
  const defaultParams: GeoParams = geoParams ?? {
    lat: VALENCIA_CENTER[0],
    lng: VALENCIA_CENTER[1],
    radius_km: 10,
  };

  // Fetch real markers from API
  // Cliente (variant="requests"): muestra técnicos disponibles
  // Técnico (variant="technicians"): muestra solicitudes pendientes
  const { data: technicians } = useTechnicianMarkers(
    variant === "requests" ? defaultParams : null,
  );
  const { data: requests } = useRequestMarkers(
    variant === "technicians" ? defaultParams : null,
  );

  if (offline) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg bg-slate-900", className)}>
        <div className="absolute inset-0 bg-slate-900/70 backdrop-grayscale flex items-center justify-center">
          <div className="text-center text-white/90 px-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/10 grid place-items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <p className="font-semibold">Estás Fuera de Servicio</p>
            <p className="text-sm text-white/60 mt-1">
              Activa "En Línea" para recibir solicitudes en tu zona.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg z-0", className)}>
      <MapContainer
        center={VALENCIA_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Technician markers from API */}
        {technicians?.map((tech: TechnicianMarker) => (
          <Marker
            key={tech.id}
            position={[tech.latitude, tech.longitude]}
            icon={technicianIcon}
          >
            <Popup>
              <div className="text-sm font-medium">{tech.full_name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                ⭐ {tech.rating_average} · {Number(tech.distance_km).toFixed(1)} km
                {tech.is_verified && " · ✓ Verificado"}
              </div>
              <div className="text-xs mt-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-white text-[10px] font-semibold bg-[#0047AB]">
                  Técnico Activo
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Request markers from API */}
        {requests?.map((req: RequestMarker) => (
          <Marker
            key={req.id}
            position={req.position}
            icon={requestIcon}
          >
            <Popup>
              <div className="text-sm font-medium">{req.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{req.category}</div>
              <div className="text-xs mt-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-white text-[10px] font-semibold bg-[#FF6600]">
                  Solicitud
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
