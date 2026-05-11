import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/fixit/AppShell";
import { JobCard, type Job } from "@/components/fixit/JobCard";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Trabajos — FixIt" },
      { name: "description", content: "Historial y trabajos activos en FixIt." },
    ],
  }),
  component: JobsPage,
});

const JOBS: Job[] = [
  { id: "j1", category: "Electricidad", title: "Tablero eléctrico hace cortocircuito", distanceKm: 1.2, expiresInMin: 2, payout: "$45–70", urgent: true },
  { id: "j2", category: "Plomería", title: "Fuga bajo el lavabo de cocina", distanceKm: 2.8, expiresInMin: 8, payout: "$35–55" },
  { id: "j3", category: "Climatización", title: "Aire acondicionado no enfría", distanceKm: 3.4, expiresInMin: 12, payout: "$60–90" },
];

function JobsPage() {
  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5 max-w-4xl">
        <header>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Tus Trabajos
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Activos y Recientes</h1>
        </header>
        <div className="grid md:grid-cols-2 gap-3">
          {JOBS.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>
    </AppShell>
  );
}
