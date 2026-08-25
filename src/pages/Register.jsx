
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
  User,
  Users,
  Zap,
} from "lucide-react";

// KEEP YOUR EXISTING IMPORT IF THE PATH IS DIFFERENT
import { useRegisterUser } from "../hooks/mutations";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegisterUser();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
      });

    } catch (error) {
      console.error(error);
    }
  };

  const passwordMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[550px] w-[550px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[150px]" />

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
          to="/login"
          className="text-xs font-semibold text-slate-400 transition hover:text-cyan-300"
        >
          Already have an account?{" "}
          <span className="text-cyan-300">Log in</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl items-center gap-14 px-5 py-12 sm:px-8 lg:grid-cols-[.85fr_1fr] lg:gap-20 lg:py-16">
        {/* left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute left-7 top-12 h-[290px] w-px bg-gradient-to-b from-cyan-300/30 via-violet-400/20 to-transparent" />

            <div className="space-y-10">
              {[
                [
                  "01",
                  "Create your workspace",
                  "Start with one clear home for your projects and tasks.",
                ],
                [
                  "02",
                  "Bring your team",
                  "Give everyone visibility into the work that matters.",
                ],
                [
                  "03",
                  "Start moving",
                  "Turn plans into visible progress and momentum.",
                ],
              ].map(([number, title, text]) => (
                <div key={number} className="relative flex gap-5">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-[#07111f] text-xs font-bold text-cyan-300">
                    {number}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/[0.08]">
                <Zap className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-bold">Your work, connected.</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Projects → People → Progress
                </p>
              </div>
            </div>
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
              Build your orbit.
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create your Task Orbit workspace.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0b1728]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                <Orbit className="h-5 w-5 text-cyan-300" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Build your orbit
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your workspace and start moving.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Your name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Edward Maduneme"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#07111f] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/5"
                  />
                </div>
              </div>

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
                    minLength={6}
                    placeholder="Create a password"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#07111f] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat your password"
                    className={`h-12 w-full rounded-xl border bg-[#07111f] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:ring-2 focus:ring-cyan-300/5 ${
                      form.confirmPassword && !passwordMatch
                        ? "border-red-400/30 focus:border-red-400/40"
                        : passwordMatch
                        ? "border-cyan-300/30 focus:border-cyan-300/40"
                        : "border-white/[0.08] focus:border-cyan-300/40"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {form.confirmPassword && !passwordMatch && (
                  <p className="mt-2 text-[11px] text-red-400">
                    Passwords do not match.
                  </p>
                )}

                {passwordMatch && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-cyan-300">
                    <Check className="h-3 w-3" />
                    Passwords match.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  registerMutation.isPending ||
                  (form.confirmPassword.length > 0 && !passwordMatch)
                }
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending
                  ? "Building your orbit..."
                  : "Create my workspace"}

                {!registerMutation.isPending && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

              <p className="text-[11px] leading-5 text-slate-600">
                Your workspace is ready for projects, team members and
                everything you need to move work forward.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}