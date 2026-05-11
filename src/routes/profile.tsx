import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/fixit/AppShell";
import { Star, Award, Shield, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — FixIt" },
      { name: "description", content: "Tu perfil de técnico verificado en FixIt." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5 max-w-3xl">
        <div className="bg-surface border rounded-lg shadow-soft p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-2xl font-bold">
            JM
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Juan Martínez</h1>
            <p className="text-sm text-muted-foreground">Técnico Electricista · Nivel Pro</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent" /> 4.92 (412)</span>
              <span className="inline-flex items-center gap-1 text-[color:var(--success)]"><Shield className="w-3.5 h-3.5" /> Verificado</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: "Trabajos completos", value: "412" },
            { icon: Award, label: "Tasa de aceptación", value: "96%" },
            { icon: Star, label: "Rating promedio", value: "4.92" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border rounded-lg p-4 shadow-soft">
              <s.icon className="w-4 h-4 text-primary" />
              <p className="text-lg font-bold mt-2">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
