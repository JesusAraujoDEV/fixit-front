import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, useUserRole } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import { AiScanner } from "@/components/fixit/AiScanner";
import {
  Zap, Droplet, Snowflake, Hammer, Wrench, Sparkles,
  ChevronLeft, ChevronRight, Check, UploadCloud, MapPin, ImageIcon, X, Cpu,
  Star, Shield, Award, User, Settings as SettingsIcon, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useCreateRequest, useUploadImage } from "@/api/hooks";
import type { RequestCategory } from "@/api/types";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Crear Solicitud — FixIt" },
      { name: "description", content: "Publica una solicitud de servicio técnico en 3 pasos: qué, dónde y detalles." },
    ],
  }),
  component: RequestPage,
});

// Wrapper that shows different content per role
function RequestPage() {
  const role = useUserRole();

  if (role === "technician") {
    return (
      <AppShell>
        <TechProProfile />
      </AppShell>
    );
  }

  // Client and Admin see the request wizard (admin for testing)
  return <RequestWizard />;
}

// ─── Technician Pro Profile ───
function TechProProfile() {
  const skills = ["Electricidad Residencial", "Electricidad Industrial", "Tableros", "Iluminación LED", "Cableado Estructurado"];
  const certifications = [
    { name: "Electricista Certificado Nivel III", year: "2022" },
    { name: "Seguridad Eléctrica Industrial", year: "2021" },
    { name: "Instalaciones Fotovoltaicas", year: "2023" },
  ];

  return (
    <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Profesional</p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mi Perfil Pro</h1>
      </header>

      {/* Profile card */}
      <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-orange-700 grid place-items-center text-white text-2xl font-bold">
          JM
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight">Juan Martínez</h2>
          <p className="text-sm text-muted-foreground">Técnico Electricista · Nivel Pro</p>
          <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent" /> 4.92 (412 reseñas)</span>
            <span className="inline-flex items-center gap-1 text-[color:var(--success)]"><Shield className="w-3.5 h-3.5" /> Verificado</span>
            <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5 text-primary" /> Top 5%</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Trabajos", value: "412" },
          { label: "Aceptación", value: "96%" },
          { label: "Resp. media", value: "4 min" },
          { label: "Repetición", value: "78%" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border rounded-lg p-3 shadow-soft text-center">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="bg-surface border rounded-lg shadow-soft p-5">
        <h3 className="font-semibold mb-3">Habilidades</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-surface border rounded-lg shadow-soft p-5">
        <h3 className="font-semibold mb-3">Certificaciones</h3>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.name} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-accent/10 text-accent grid place-items-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={() => toast.info("Edición de perfil en construcción", { description: "Pronto podrás actualizar tus habilidades y certificaciones." })}
        className="w-full h-11 rounded-md border text-sm font-medium hover:bg-muted transition inline-flex items-center justify-center gap-2"
      >
        <SettingsIcon className="w-4 h-4" /> Editar Perfil Profesional
      </button>
    </section>
  );
}

type Cat = { key: string; label: string; icon: LucideIcon };
const CATEGORIES: Cat[] = [
  { key: "electrical", label: "Electricidad", icon: Zap },
  { key: "plumbing", label: "Plomería", icon: Droplet },
  { key: "hvac", label: "Climatización", icon: Snowflake },
  { key: "general", label: "General", icon: Hammer },
  { key: "locksmith", label: "Cerrajería", icon: Wrench },
  { key: "cleaning", label: "Limpieza", icon: Sparkles },
];

const STEPS = ["Qué y Dónde", "Detalles", "Revisión"];

// ─── Location Picker with clickable map ───
const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#FF6600" stroke="white" stroke-width="1.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white" stroke="#FF6600" stroke-width="1.5"/></svg>`,
  className: "custom-leaflet-marker",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocationPicker({
  lat,
  lng,
  interactive,
  onLocationChange,
}: {
  lat: number;
  lng: number;
  interactive: boolean;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  return (
    <div className="h-44 relative z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={interactive}
        dragging={interactive}
        className="h-full w-full"
        style={{ height: "100%", width: "100%", cursor: interactive ? "crosshair" : "default" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={pinIcon} />
        {interactive && <ClickHandler onLocationChange={onLocationChange} />}
      </MapContainer>
      {interactive && (
        <div className="absolute top-2 left-2 z-[1000] px-2 py-1 rounded bg-accent/90 text-white text-[10px] font-bold">
          Haz clic para mover el pin
        </div>
      )}
    </div>
  );
}

function RequestWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [cat, setCat] = useState<string | null>("electrical");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [scanning, setScanning] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 10.1910,
    lng: -68.0130,
  });
  const [pickingLocation, setPickingLocation] = useState(false);

  const createRequest = useCreateRequest();
  const uploadImage = useUploadImage();

  const isSubmitting = createRequest.isPending || uploadImage.isPending;

  const next = () => {
    // Validar paso actual antes de avanzar
    if (step === 0) {
      if (!need.trim()) {
        toast.error("Título requerido", { description: "Describe qué necesitas reparar antes de continuar." });
        return;
      }
      if (!cat) {
        toast.error("Categoría requerida", { description: "Selecciona una categoría de servicio." });
        return;
      }
    }
    setStep((s) => Math.min(2, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 4 - images.length);
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
    setImageFiles((prev) => [...prev, ...newFiles]);
    setScanning(true);
  };

  const handleRemoveImage = (index: number) => {
    setImages((arr) => arr.filter((_, j) => j !== index));
    setImageFiles((arr) => arr.filter((_, j) => j !== index));
  };

  const handlePublish = async () => {
    // Usar descripción como fallback si el título está vacío
    const title = need.trim() || desc.trim().slice(0, 100);

    // Validaciones
    if (!title) {
      toast.error("Título requerido", { description: "Vuelve al paso 1 y describe qué necesitas reparar." });
      setStep(0);
      return;
    }
    if (!cat) {
      toast.error("Categoría requerida", { description: "Vuelve al paso 1 y selecciona una categoría." });
      setStep(0);
      return;
    }

    try {
      // 1. Subir imágenes si hay
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => uploadImage.mutateAsync(file));
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.map((r) => r.url);
      }

      // 2. Crear la solicitud
      const result = await createRequest.mutateAsync({
        title,
        description: desc.trim() || undefined,
        category: cat as RequestCategory,
        images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        latitude: location.lat,
        longitude: location.lng,
      });

      toast.success("¡Solicitud publicada!", {
        description: `${result.nearby_technicians_count} técnicos cercanos notificados. Respuesta estimada: ~${result.estimated_response_min} min.`,
      });

      // Navegar al historial de solicitudes
      navigate({ to: "/jobs" });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Intenta de nuevo más tarde.";
      toast.error("Error al publicar solicitud", { description: message });
    }
  };

  const selectedCat = CATEGORIES.find((c) => c.key === cat);
  const SelectedIcon = selectedCat?.icon ?? Hammer;

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Nueva Solicitud
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Publica tu necesidad
          </h1>
        </header>

        {/* Stepper */}
        <ol className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full grid place-items-center text-xs font-bold shrink-0",
                      done ? "bg-primary text-primary-foreground"
                      : active ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium truncate",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 rounded", i < step ? "bg-primary" : "bg-muted")} />
                )}
              </li>
            );
          })}
        </ol>

        <div className="bg-surface border rounded-lg shadow-soft p-5 md:p-6">
          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold">¿Qué necesitas reparar?</label>
                <input
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Ej. Mi calentador no enciende…"
                  className="mt-2 w-full h-12 px-4 rounded-md bg-muted border border-transparent focus:bg-surface focus:border-ring outline-none text-base transition"
                />
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Categoría del servicio</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const active = cat === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setCat(c.key)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-md border transition-all",
                          active
                            ? "border-primary bg-primary/5 shadow-soft"
                            : "border-border bg-surface hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("text-[11px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Ubicación del servicio</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {pickingLocation
                    ? "Haz clic en el mapa para seleccionar la ubicación"
                    : "Ubicación seleccionada. Presiona \"Cambiar\" para mover el pin."}
                </p>
                <div className="rounded-md overflow-hidden border">
                  <LocationPicker
                    lat={location.lat}
                    lng={location.lng}
                    interactive={pickingLocation}
                    onLocationChange={(lat, lng) => {
                      setLocation({ lat, lng });
                      setPickingLocation(false);
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)} — Valencia, Carabobo
                  <button
                    type="button"
                    onClick={() => setPickingLocation(!pickingLocation)}
                    className={cn(
                      "ml-auto font-semibold",
                      pickingLocation ? "text-accent" : "text-primary",
                    )}
                  >
                    {pickingLocation ? "Cancelar" : "Cambiar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold">Describe el problema</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                  placeholder="Cuanto más detalle, mejor cotización recibirás…"
                  className="mt-2 w-full p-4 rounded-md bg-muted border border-transparent focus:bg-surface focus:border-ring outline-none text-sm transition resize-none"
                />
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Fotos del problema (hasta 4)</p>
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  className="flex flex-col items-center justify-center gap-2 p-8 rounded-md border-2 border-dashed border-border bg-muted/40 hover:bg-muted hover:border-primary cursor-pointer transition-colors"
                >
                  <div className="w-11 h-11 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium">Arrastra imágenes o haz clic</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB cada una</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {/* AI Scanner for first image */}
                    {scanning && images[0] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-4 h-4 text-accent" />
                          <span className="text-xs font-semibold text-accent">Diagnóstico IA</span>
                        </div>
                        <AiScanner imageSrc={images[0]} onComplete={() => setScanning(false)} />
                      </motion.div>
                    )}
                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-md bg-primary/5 border border-primary/20">
                <div className="w-11 h-11 rounded-md bg-primary text-primary-foreground grid place-items-center shrink-0">
                  <SelectedIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
                    {selectedCat?.label}
                  </p>
                  <h3 className="font-semibold leading-snug">{need || "Sin título"}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location.lat.toFixed(4)}, {location.lng.toFixed(4)} — Valencia
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Descripción
                </p>
                <p className="text-sm bg-muted rounded-md p-3">
                  {desc || <span className="text-muted-foreground">Sin descripción.</span>}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Adjuntos ({images.length})
                </p>
                {images.length ? (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((src, i) => (
                      <div key={i} className="aspect-square rounded-md overflow-hidden border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted rounded-md">
                    <ImageIcon className="w-4 h-4" /> Sin fotos adjuntas.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center p-3">
                  <p className="text-xs text-muted-foreground">Técnicos cerca</p>
                  <p className="font-bold text-lg">12</p>
                </div>
                <div className="text-center p-3 border-x">
                  <p className="text-xs text-muted-foreground">Resp. estimada</p>
                  <p className="font-bold text-lg">~9 min</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-xs text-muted-foreground">Rango precio</p>
                  <p className="font-bold text-lg">$40–80</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-1 h-11 px-4 rounded-md border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Atrás
            </button>
            <span className="text-xs text-muted-foreground ml-auto">
              Paso {step + 1} de {STEPS.length}
            </span>
            {step < 2 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-1 h-11 px-5 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:opacity-95"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow-elevated hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publicando…
                  </>
                ) : (
                  <>
                    Publicar Solicitud <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
