import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/fixit/AppShell";
import { MapCanvas } from "@/components/fixit/MapCanvas";
import {
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Command Center — FixIt Admin" },
      { name: "description", content: "Centro de comando administrativo: monitoreo global de la red FixIt." },
    ],
  }),
  component: AdminDashboard,
});

// KPI data
const kpis = [
  { label: "Servicios Activos", value: "142", delta: "+8%", icon: Activity, color: "emerald" },
  { label: "Técnicos Online", value: "187", delta: "+12", icon: Users, color: "blue" },
  { label: "Ingresos (Comisiones)", value: "$4,280", delta: "+22%", icon: DollarSign, color: "emerald" },
  { label: "Reportes / Quejas", value: "3", delta: "-2", icon: AlertTriangle, color: "red" },
];

// Transactions
const transactions = [
  { id: "TX-001", client: "María López", tech: "Carlos M.", service: "Electricidad", amount: "$65", status: "completed", time: "Hace 5 min" },
  { id: "TX-002", client: "José García", tech: "Ana P.", service: "Plomería", amount: "$45", status: "in_progress", time: "Hace 12 min" },
  { id: "TX-003", client: "Laura Díaz", tech: "Pedro R.", service: "Climatización", amount: "$90", status: "completed", time: "Hace 18 min" },
  { id: "TX-004", client: "Roberto Sánchez", tech: "María G.", service: "General", amount: "$35", status: "disputed", time: "Hace 25 min" },
  { id: "TX-005", client: "Carmen Ruiz", tech: "José R.", service: "Cerrajería", amount: "$55", status: "completed", time: "Hace 32 min" },
];

// Verification requests
const verifications = [
  { id: "V-001", name: "Miguel Ángel Torres", specialty: "Electricista", experience: "8 años", docs: 3, rating: null },
  { id: "V-002", name: "Sofía Hernández", specialty: "Plomera", experience: "5 años", docs: 4, rating: null },
  { id: "V-003", name: "Diego Morales", specialty: "Climatización", experience: "12 años", docs: 2, rating: null },
];

// Event log entries
const INITIAL_EVENTS = [
  { time: "14:32:01", type: "info", msg: "Técnico Carlos M. completó servicio TX-001" },
  { time: "14:31:45", type: "success", msg: "Pago $65 procesado correctamente" },
  { time: "14:30:22", type: "info", msg: "Nueva solicitud de servicio en Zona Norte" },
  { time: "14:29:58", type: "warning", msg: "Técnico Pedro R. — tiempo de respuesta alto (15min)" },
  { time: "14:28:33", type: "info", msg: "Cliente Laura Díaz calificó servicio ⭐⭐⭐⭐⭐" },
  { time: "14:27:10", type: "error", msg: "Reporte de fraude: TX-004 en revisión" },
  { time: "14:26:45", type: "success", msg: "Verificación aprobada: Ana P. (Plomería)" },
  { time: "14:25:01", type: "info", msg: "3 nuevos técnicos conectados en Zona Sur" },
];

function AdminDashboard() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const logRef = useRef<HTMLDivElement>(null);

  // Simulate live events
  useEffect(() => {
    const newEvents = [
      { type: "info", msg: "Solicitud urgente recibida — Electricidad, Zona Centro" },
      { type: "success", msg: "Técnico María G. aceptó misión TX-006" },
      { type: "info", msg: "Rating promedio de la red: 4.87 ⭐" },
      { type: "warning", msg: "Zona Este: baja cobertura de técnicos" },
      { type: "success", msg: "Pago $90 procesado — TX-003" },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      setEvents((prev) => [{ time, ...newEvents[idx % newEvents.length] }, ...prev].slice(0, 20));
      idx++;
      if (logRef.current) logRef.current.scrollTop = 0;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function handleApprove(name: string) {
    toast.success(`Técnico ${name} aprobado`, { description: "Ya puede recibir solicitudes." });
  }
  function handleReject(name: string) {
    toast.error(`Solicitud de ${name} rechazada`, { description: "Se notificará al solicitante." });
  }

  return (
    <AppShell>
      <section className="px-4 md:px-6 py-6 space-y-5">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-emerald-400" />
            <p className="text-xs uppercase tracking-widest text-emerald-400/70 font-bold">
              Command Center
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Ojo de Dios — Monitoreo Global
          </h1>
          <p className="text-sm text-white/50 mt-1">Red FixIt en tiempo real</p>
        </header>

        {/* KPIs with neon borders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            const borderColor = kpi.color === "emerald" ? "border-emerald-500/30" : kpi.color === "blue" ? "border-blue-500/30" : "border-red-500/30";
            const glowColor = kpi.color === "emerald" ? "shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]" : kpi.color === "blue" ? "shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]" : "shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]";
            const iconColor = kpi.color === "emerald" ? "text-emerald-400" : kpi.color === "blue" ? "text-blue-400" : "text-red-400";
            const iconBg = kpi.color === "emerald" ? "bg-emerald-500/10" : kpi.color === "blue" ? "bg-blue-500/10" : "bg-red-500/10";

            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-xl border p-4 bg-white/[0.02]",
                  borderColor, glowColor
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-lg grid place-items-center", iconBg)}>
                    <Icon className={cn("w-4 h-4", iconColor)} />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {kpi.delta}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{kpi.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main grid: Map + Event Log */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Full map */}
          <div className="lg:col-span-2 rounded-xl border border-emerald-500/20 overflow-hidden bg-white/[0.02] shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white tracking-tight">Mapa Global</h2>
                <p className="text-xs text-white/40">Clientes (azul) · Técnicos (verde) · Urgentes (naranja)</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> 47 clientes
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> 187 técnicos
                </span>
              </div>
            </div>
            <div className="relative">
              <MapCanvas heatmap className="h-[400px] md:h-[480px] rounded-none" />
              {/* Admin overlay: extra data layer */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute rounded-full blur-[50px] opacity-20" style={{ left: "30%", top: "40%", width: 160, height: 160, background: "radial-gradient(circle, rgba(16,185,129,0.8), transparent 70%)" }} />
                <div className="absolute rounded-full blur-[60px] opacity-15" style={{ left: "60%", top: "25%", width: 200, height: 200, background: "radial-gradient(circle, rgba(59,130,246,0.6), transparent 70%)" }} />
                <div className="absolute rounded-full blur-[40px] opacity-25" style={{ left: "75%", top: "60%", width: 120, height: 120, background: "radial-gradient(circle, rgba(255,102,0,0.6), transparent 70%)" }} />
              </div>
            </div>
          </div>

          {/* Live Event Log */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-white tracking-tight text-sm">Log de Eventos</h2>
                <p className="text-[10px] text-white/40">Tiempo real</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto max-h-[440px] p-3 space-y-1.5 scrollbar-thin">
              {events.map((ev, i) => (
                <motion.div
                  key={`${ev.time}-${i}`}
                  initial={i === 0 ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-xs py-1.5 px-2 rounded hover:bg-white/5"
                >
                  <span className="text-white/30 font-mono shrink-0 w-16">{ev.time}</span>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    ev.type === "success" ? "bg-emerald-400" :
                    ev.type === "warning" ? "bg-yellow-400" :
                    ev.type === "error" ? "bg-red-400" : "bg-blue-400"
                  )} />
                  <span className="text-white/70 leading-relaxed">{ev.msg}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables: Transactions + Verifications */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Transactions */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-emerald-500/10">
              <h2 className="font-semibold text-white tracking-tight text-sm">Últimas Transacciones</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left px-4 py-2.5 font-medium">ID</th>
                    <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                    <th className="text-left px-4 py-2.5 font-medium">Técnico</th>
                    <th className="text-left px-4 py-2.5 font-medium">Monto</th>
                    <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                    <th className="text-left px-4 py-2.5 font-medium">Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-mono text-white/50">{tx.id}</td>
                      <td className="px-4 py-2.5 text-white/80">{tx.client}</td>
                      <td className="px-4 py-2.5 text-white/80">{tx.tech}</td>
                      <td className="px-4 py-2.5 font-bold text-emerald-400">{tx.amount}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                          tx.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                          tx.status === "in_progress" ? "bg-blue-500/15 text-blue-400" :
                          "bg-red-500/15 text-red-400"
                        )}>
                          {tx.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                          {tx.status === "in_progress" && <Clock className="w-3 h-3" />}
                          {tx.status === "disputed" && <AlertTriangle className="w-3 h-3" />}
                          {tx.status === "completed" ? "Completado" : tx.status === "in_progress" ? "En curso" : "Disputa"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-white/40">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Requests */}
          <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between">
              <h2 className="font-semibold text-white tracking-tight text-sm">Verificación de Técnicos</h2>
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                {verifications.length} pendientes
              </span>
            </div>
            <div className="p-4 space-y-3">
              {verifications.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-emerald-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 grid place-items-center text-white font-bold text-sm shrink-0">
                    {v.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{v.name}</p>
                    <p className="text-[11px] text-white/40">{v.specialty} · {v.experience} · {v.docs} docs</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleApprove(v.name)}
                      className="w-8 h-8 rounded-md bg-emerald-500/15 text-emerald-400 grid place-items-center hover:bg-emerald-500/25 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(v.name)}
                      className="w-8 h-8 rounded-md bg-red-500/15 text-red-400 grid place-items-center hover:bg-red-500/25 transition"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance bar chart (simple) */}
        <div className="rounded-xl border border-emerald-500/20 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white tracking-tight text-sm">Rendimiento Semanal</h2>
              <p className="text-[11px] text-white/40">Servicios completados por día</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <Zap className="w-3 h-3" /> +18% vs semana anterior
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[42, 58, 35, 72, 65, 88, 52].map((val, i) => {
              const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
              const maxVal = 88;
              const height = (val / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={cn(
                      "w-full rounded-t-md",
                      i === 5 ? "bg-emerald-400" : "bg-emerald-500/30"
                    )}
                  />
                  <span className="text-[10px] text-white/40">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
