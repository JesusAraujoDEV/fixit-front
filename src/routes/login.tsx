import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLogin } from "@/api/hooks";
import { useSession } from "@/components/fixit/SessionProvider";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "FixHub — Iniciar Sesión" },
      { name: "description", content: "Inicia sesión en tu cuenta FixHub." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
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

    if (!email.trim() || !password.trim()) {
      toast.error("Campos requeridos", {
        description: "Ingresa tu email y contraseña.",
      });
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      login(result.user, result.token);

      // Redirigir según rol
      const dest =
        result.user.role === "admin"
          ? "/admin"
          : result.user.role === "technician"
            ? "/pro"
            : "/dashboard";
      navigate({ to: dest });
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;

      if (status === 401) {
        toast.error("Credenciales inválidas", {
          description: message || "Email o contraseña incorrectos.",
        });
      } else {
        toast.error("Error de conexión", {
          description: "No se pudo conectar con el servidor. Verifica que el backend esté activo.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back to landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">FixHub</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Pro Network
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-white mb-1">Iniciar Sesión</h2>
          <p className="text-sm text-white/50 mb-6">
            Ingresa tus credenciales para acceder a la plataforma.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-white/60 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-white/60 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={cn(
                "w-full h-11 rounded-lg bg-primary text-white font-semibold text-sm transition-all",
                "hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(0,71,171,0.4)]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2",
              )}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-white/30">
              Acceso rápido (dev)
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Quick login buttons for development */}
          <div className="grid grid-cols-3 gap-2">
            <QuickLoginButton
              label="Cliente"
              email="maria.prebo@gmail.com"
              password="Cliente1!"
              color="primary"
              loginMutation={loginMutation}
              onSuccess={login}
              navigate={navigate}
            />
            <QuickLoginButton
              label="Técnico"
              email="pedro.electricista@gmail.com"
              password="Tecnico1!"
              color="accent"
              loginMutation={loginMutation}
              onSuccess={login}
              navigate={navigate}
            />
            <QuickLoginButton
              label="Admin"
              email="admin@fixit.com"
              password="Admin123!"
              color="emerald"
              loginMutation={loginMutation}
              onSuccess={login}
              navigate={navigate}
            />
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/register" search={{ role: undefined }} className="text-primary hover:text-primary/80 font-medium transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Quick Login Button (dev helper) ──────────────────────────────────────────
function QuickLoginButton({
  label,
  email,
  password,
  color,
  loginMutation,
  onSuccess,
  navigate,
}: {
  label: string;
  email: string;
  password: string;
  color: "primary" | "accent" | "emerald";
  loginMutation: ReturnType<typeof useLogin>;
  onSuccess: (user: import("@/api/types").User, token: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      onSuccess(result.user, result.token);
      const dest =
        result.user.role === "admin"
          ? "/admin"
          : result.user.role === "technician"
            ? "/pro"
            : "/dashboard";
      navigate({ to: dest });
    } catch {
      toast.error("Error", { description: "No se pudo conectar con el backend." });
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    primary: "border-primary/30 text-primary hover:bg-primary/10",
    accent: "border-accent/30 text-accent hover:bg-accent/10",
    emerald: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || loginMutation.isPending}
      className={cn(
        "h-9 rounded-lg border text-xs font-medium transition-all disabled:opacity-50",
        colorClasses[color],
      )}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : label}
    </button>
  );
}
