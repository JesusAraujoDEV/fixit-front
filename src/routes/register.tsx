import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Home,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Briefcase,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRegister } from "@/api/hooks";
import { useSession } from "@/components/fixit/SessionProvider";
import { PhoneInput } from "@/components/fixit/PhoneInput";
import type { RegisterPayload } from "@/api/hooks";

type RegisterRole = "client" | "technician";

const SPECIALTIES = [
  { value: "electrical", label: "Electricidad" },
  { value: "plumbing", label: "Plomería" },
  { value: "hvac", label: "Climatización (HVAC)" },
  { value: "locksmith", label: "Cerrajería" },
  { value: "appliance_repair", label: "Línea Blanca" },
  { value: "general", label: "General / Multioficio" },
];

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "FixHub — Crear Cuenta" },
      { name: "description", content: "Regístrate en FixHub como cliente o técnico profesional." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { role: searchRole } = Route.useSearch();
  const initialRole: RegisterRole =
    searchRole === "technician" ? "technician" : "client";

  const [selectedRole, setSelectedRole] = useState<RegisterRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Technician-specific fields
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");

  const registerMutation = useRegister();
  const { login, isAuthenticated, role } = useSession();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      const dest = role === "admin" ? "/admin" : role === "technician" ? "/pro" : "/dashboard";
      navigate({ to: dest });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error("Campos requeridos", {
        description: "Completa todos los campos obligatorios.",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Contraseña muy corta", {
        description: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (selectedRole === "technician" && (!specialty || !experience.trim())) {
      toast.error("Datos profesionales requeridos", {
        description: "Selecciona tu especialidad e indica tu experiencia.",
      });
      return;
    }

    const payload: RegisterPayload =
      selectedRole === "technician"
        ? {
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            role: "technician",
            specialty,
            experience: experience.trim(),
            bio: bio.trim(),
          }
        : {
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            role: "client",
          };

    try {
      const result = await registerMutation.mutateAsync(payload);
      login(result.user, result.token);
      toast.success("¡Cuenta creada con éxito!", {
        description: `Bienvenido a FixHub, ${result.user.full_name}.`,
      });
      const dest = result.user.role === "technician" ? "/pro" : "/dashboard";
      navigate({ to: dest });
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;

      if (status === 409 || message?.toLowerCase().includes("exist")) {
        toast.error("Email ya registrado", {
          description: "Ya existe una cuenta con ese correo. Intenta iniciar sesión.",
        });
      } else if (status === 400) {
        toast.error("Datos inválidos", {
          description: message || "Revisa los campos e intenta de nuevo.",
        });
      } else {
        toast.error("Error de conexión", {
          description: "No se pudo conectar con el servidor.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/4 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Back to landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">FixHub</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Crear Cuenta
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-white mb-1">Regístrate</h2>
          <p className="text-sm text-white/50 mb-6">
            Elige tu perfil y completa tus datos para unirte a la red.
          </p>

          {/* ─── Role Selector Tabs ──────────────────────────────────────── */}
          <div className="flex rounded-lg bg-white/5 border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("client")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium transition-all",
                selectedRole === "client"
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              <Home className="w-4 h-4" />
              Soy Cliente
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("technician")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium transition-all",
                selectedRole === "technician"
                  ? "bg-accent text-white shadow-sm"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              <Wrench className="w-4 h-4" />
              Soy Técnico
            </button>
          </div>

          {/* ─── Form ────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-white/60 mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="María González"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-white/60 mb-1.5">
                Teléfono
              </label>
              <PhoneInput
                value={phone}
                onChange={(val) => setPhone(val)}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ─── Technician-specific fields ─────────────────────────────── */}
            <AnimatePresence mode="wait">
              {selectedRole === "technician" && (
                <motion.div
                  key="tech-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs font-medium text-accent/80 mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      Datos Profesionales
                    </p>
                  </div>

                  {/* Especialidad */}
                  <div>
                    <label
                      htmlFor="specialty"
                      className="block text-xs font-medium text-white/60 mb-1.5"
                    >
                      Especialidad Principal
                    </label>
                    <select
                      id="specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#1a1a2e] text-white/50">
                        Selecciona tu especialidad
                      </option>
                      {SPECIALTIES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#1a1a2e]">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experiencia */}
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-xs font-medium text-white/60 mb-1.5"
                    >
                      Experiencia
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        id="experience"
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Ej: Más de 5 años en refrigeración"
                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-xs font-medium text-white/60 mb-1.5"
                    >
                      Biografía breve{" "}
                      <span className="text-white/30">(opcional)</span>
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Cuéntanos sobre ti y tu trabajo..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={cn(
                "w-full h-11 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                selectedRole === "technician"
                  ? "bg-accent text-white hover:bg-accent/90 shadow-[0_0_20px_-5px_rgba(255,102,0,0.4)]"
                  : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(0,71,171,0.4)]",
              )}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                `Registrarme como ${selectedRole === "technician" ? "Técnico" : "Cliente"}`
              )}
            </button>
          </form>

          {/* Link to login */}
          <p className="text-center text-sm text-white/40 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
