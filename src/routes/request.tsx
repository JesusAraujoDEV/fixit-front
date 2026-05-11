import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import {
  Zap, Droplet, Snowflake, Hammer, Wrench, Sparkles,
  ChevronLeft, ChevronRight, Check, UploadCloud, MapPin, ImageIcon, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Crear Solicitud — FixIt" },
      { name: "description", content: "Publica una solicitud de servicio técnico en 3 pasos: qué, dónde y detalles." },
    ],
  }),
  component: RequestWizard,
});

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

function RequestWizard() {
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [cat, setCat] = useState<string | null>("electrical");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4 - images.length).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
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
                <div className="rounded-md overflow-hidden border">
                  <MapCanvas variant="dark" className="h-44" pins={[]} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  Av. Insurgentes Sur 1234, CDMX
                  <button className="ml-auto text-primary font-semibold">Cambiar</button>
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
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {images.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setImages((arr) => arr.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
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
                    <MapPin className="w-3 h-3" /> Av. Insurgentes Sur 1234, CDMX
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
              <button className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-semibold text-sm shadow-elevated hover:opacity-95">
                Publicar Solicitud <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
