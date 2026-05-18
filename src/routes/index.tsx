import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Wrench,
  Zap,
  Shield,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Wifi,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/fixit/SessionProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FixHub — Servicios técnicos profesionales al instante" },
      {
        name: "description",
        content:
          "Conecta con técnicos verificados en tu zona. Electricidad, plomería, climatización y más. Respuesta en minutos.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated, role } = useSession();

  // Si ya está autenticado, redirigir al dashboard correspondiente
  const dashboardLink =
    role === "admin" ? "/admin" : role === "technician" ? "/pro" : "/dashboard";

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white overflow-hidden">
      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0e17]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary grid place-items-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FixHub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo funciona
            </a>
            <a href="#beneficios" className="hover:text-white transition-colors">
              Beneficios
            </a>
            <a href="#soporte" className="hover:text-white transition-colors">
              Soporte
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={dashboardLink}
                className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Ir al Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              187 técnicos en línea ahora
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Servicios técnicos profesionales
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                en tu zona, al instante
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Conecta con electricistas, plomeros y técnicos verificados.
              Diagnóstico con IA, seguimiento en tiempo real y respuesta en minutos.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="h-12 px-8 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_30px_-5px_rgba(0,71,171,0.5)] hover:shadow-[0_0_40px_-5px_rgba(0,71,171,0.7)]"
              >
                Solicitar un Técnico
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-semibold inline-flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                Unirse como Profesional
                <Wrench className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/40"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Técnicos verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Respuesta en ~8 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>4.8/5 satisfacción</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Cómo Funciona ──────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Proceso simple
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Cómo funciona FixHub
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe tu problema",
                desc: "Toma una foto, nuestra IA diagnostica y categoriza automáticamente.",
                icon: Brain,
              },
              {
                step: "02",
                title: "Conectamos al técnico ideal",
                desc: "Nuestro radar encuentra al profesional más cercano y mejor calificado.",
                icon: MapPin,
              },
              {
                step: "03",
                title: "Seguimiento en vivo",
                desc: "Ve al técnico en camino en tiempo real. Paga seguro al finalizar.",
                icon: Wifi,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-5xl font-bold text-white/5 absolute top-4 right-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 grid place-items-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Beneficios Dual (Bento Grid) ───────────────────────────────── */}
      <section id="beneficios" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              Para todos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Beneficios que transforman
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="space-y-4">
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-2 text-sm text-primary font-medium">
                <MapPin className="w-4 h-4" />
                Para Clientes
              </div>
              <div className="grid gap-3">
                {[
                  {
                    icon: Clock,
                    title: "Respuesta inmediata",
                    desc: "Técnico asignado en menos de 8 minutos promedio.",
                  },
                  {
                    icon: Shield,
                    title: "Profesionales verificados",
                    desc: "Documentos validados, calificaciones reales y seguimiento GPS.",
                  },
                  {
                    icon: Brain,
                    title: "Diagnóstico con IA",
                    desc: "Toma una foto y obtén un diagnóstico preliminar al instante.",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{b.title}</h4>
                      <p className="text-xs text-white/50 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Técnico */}
            <div className="space-y-4">
              <div className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 inline-flex items-center gap-2 text-sm text-accent font-medium">
                <Wrench className="w-4 h-4" />
                Para Técnicos
              </div>
              <div className="grid gap-3">
                {[
                  {
                    icon: TrendingUp,
                    title: "Maximiza tus ingresos",
                    desc: "Recibe trabajos constantes sin buscar clientes por tu cuenta.",
                  },
                  {
                    icon: MapPin,
                    title: "Rutas optimizadas",
                    desc: "Solo recibes ofertas dentro de tu radio. Cero viajes innecesarios.",
                  },
                  {
                    icon: Zap,
                    title: "Control total",
                    desc: "Activa o desactiva tu disponibilidad con un solo toque.",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 grid place-items-center shrink-0">
                      <b.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{b.title}</h4>
                      <p className="text-xs text-white/50 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Final ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-white/50 mb-8">
            Únete a la red de servicios técnicos más rápida de la ciudad.
          </p>
          <Link
            to="/login"
            className="h-12 px-8 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_30px_-5px_rgba(0,71,171,0.5)]"
          >
            Comenzar ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer id="soporte" className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>FixHub © 2025 — Todos los derechos reservados</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/70 transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Soporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
