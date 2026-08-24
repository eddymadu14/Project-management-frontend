
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Orbit,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// KEEP YOUR EXISTING IMPORT IF THE PATH IS DIFFERENT
import { useLoginUser } from "../hooks/mutations";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLoginUser();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync(form);
      navigate("/dashboard");
    } catch (error) {
      // Your existing mutation/error handling remains responsible
      // for displaying the API error.
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/[0.08]">
            <Orbit className="h-5 w-5 text-cyan-300" />
          </div>

          <span className="text-sm font-bold tracking-tight">
            TASK <span className="text-cyan-300">ORBIT</span>
          </span>
        </Link>

        <Link
          to="/register"
          className="text-xs font-semibold text-slate-400 transition hover:text-cyan-300"
        >
          New to Task Orbit?{" "}
          <span className="text-cyan-300">Create account</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl items-center gap-14 px-5 py-12 sm:px-8 lg:grid-cols-[.9fr_1fr] lg:gap-20">
        {/* left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Your workspace awaits
          </div>

          <h1 className="text-5xl font-black leading-[1] tracking-[-0.05em]">
            Continue your
            <br />
            <span className="text-cyan-300">trajectory.</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-500">
            Pick up exactly where you left off. Your projects, tasks, team and
            progress are waiting in one connected workspace.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Your projects stay organized",
              "Your team stays aligned",
              "Your progress stays visible",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06]">
                  <Check className="h-3.5 w-3.5 text-cyan-300" />
                </div>
                <span className="text-sm text-slate-400">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Orbit className="mb-5 h-8 w-8 text-cyan-300" />

            <h1 className="text-3xl font-black tracking-[-0.04em]">
              Welcome back.
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Continue your trajectory.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0b1728]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                <LockKeyhole className="h-5 w-5 text-cyan-300" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to your Task Orbit workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#07111f] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#07111f] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending ? "Entering orbit..." : "Enter Task Orbit"}
                {!loginMutation.isPending && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
                secure workspace
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300/60" />
              Your workspace is protected.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}