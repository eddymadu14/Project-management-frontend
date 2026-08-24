import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Circle,
  Layers3,
  Menu,
  Orbit,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: Layers3,
    number: "01",
    title: "Projects with direction",
    text: "Turn scattered tasks into structured projects with clear ownership, priorities and momentum.",
  },
  {
    icon: Users,
    number: "02",
    title: "Teams in sync",
    text: "Give everyone a shared view of the work without drowning your team in meetings and status updates.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Progress you can see",
    text: "Use analytics to understand what is moving, what is slowing down and where attention belongs.",
  },
];

const orbitTasks = [
  {
    title: "Launch new website",
    meta: "Marketing",
    status: "ACTIVE",
    position: "top",
  },
  {
    title: "API integration",
    meta: "Engineering",
    status: "REVIEW",
    position: "right",
  },
  {
    title: "Design system",
    meta: "Product",
    status: "DONE",
    position: "bottom",
  },
  {
    title: "Team roadmap",
    meta: "Planning",
    status: "ACTIVE",
    position: "left",
  },
];

function TaskOrbitVisual() {
  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[620px]">
      {/* orbital rings */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/15" />
      <div className="absolute left-1/2 top-1/2 h-[185px] w-[185px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,.9)]" />
        <div className="absolute bottom-[13%] right-[5%] h-1.5 w-1.5 rounded-full bg-violet-400" />
        <div className="absolute left-[8%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-200" />
      </motion.div>

      {/* centre */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px rgba(103,232,249,.10)",
            "0 0 65px rgba(103,232,249,.25)",
            "0 0 30px rgba(103,232,249,.10)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-300/30 bg-[#0b1728]/95 backdrop-blur-xl"
      >
        <Orbit className="mb-2 h-8 w-8 text-cyan-300" />
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
          Orbit
        </span>
        <span className="mt-1 text-[10px] text-slate-500">WORKSPACE</span>
      </motion.div>

      {/* task cards */}
      {orbitTasks.map((task, index) => {
        const positions = {
          top: "left-1/2 top-[2%] -translate-x-1/2",
          right: "right-[-2%] top-1/2 -translate-y-1/2",
          bottom: "bottom-[2%] left-1/2 -translate-x-1/2",
          left: "left-[-2%] top-1/2 -translate-y-1/2",
        };

        return (
          <motion.div
            key={task.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`absolute z-10 w-[180px] rounded-2xl border border-white/10 bg-[#0d1b2e]/90 p-4 shadow-2xl backdrop-blur-xl ${positions[task.position]}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <Circle
                className={`h-2.5 w-2.5 fill-current ${
                  task.status === "DONE"
                    ? "text-cyan-300"
                    : task.status === "REVIEW"
                    ? "text-violet-400"
                    : "text-amber-300"
                }`}
              />
              <span className="text-[8px] font-bold tracking-[0.18em] text-slate-500">
                {task.status}
              </span>
            </div>

            <p className="text-sm font-semibold text-white">{task.title}</p>
            <p className="mt-1 text-[11px] text-slate-500">{task.meta}</p>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: task.status === "DONE" ? "100%" : "68%" }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className="h-full bg-gradient-to-r from-cyan-300 to-violet-400"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Landin() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      {/* background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-400/[0.06] blur-[130px]" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* navbar */}
      <header className="relative z-50 border-b border-white/[0.06]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/[0.08]">
              <Orbit className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <span className="text-[15px] font-bold tracking-tight">
                TASK <span className="text-cyan-300">ORBIT</span>
              </span>
              <div className="hidden text-[7px] tracking-[0.35em] text-slate-500 sm:block">
                PROJECT CONTROL SYSTEM
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#why" className="text-sm text-slate-400 transition hover:text-white">
              Why Orbit
            </a>
            <a href="#workflow" className="text-sm text-slate-400 transition hover:text-white">
              Workflow
            </a>
            <a href="#features" className="text-sm text-slate-400 transition hover:text-white">
              Features
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#07111f] shadow-[0_0_25px_rgba(103,232,249,.12)] transition hover:bg-cyan-200"
            >
              Start building
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-white/10 p-2.5 text-slate-300 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-[#07111f]/95 px-5 py-5 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#why" onClick={() => setMobileOpen(false)} className="text-slate-300">
                Why Orbit
              </a>
              <a href="#workflow" onClick={() => setMobileOpen(false)} className="text-slate-300">
                Workflow
              </a>
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-slate-300">
                Features
              </a>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-white/10 py-3 text-center text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-cyan-300 py-3 text-center text-sm font-bold text-[#07111f]"
                >
                  Start building
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* hero */}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3.5 py-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Project management, rethought
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
            >
              Your work has
              <br />
              a <span className="text-cyan-300">trajectory.</span>
              <br />
              Make it visible.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg"
            >
              Task Orbit brings projects, people, tasks and progress into one
              command center — so your team knows what is moving, what is stuck
              and what needs attention next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
              >
                Create your workspace
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#workflow"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
              >
                <Play className="h-4 w-4 text-cyan-300" />
                See how it works
              </a>
            </motion.div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-300" />
                Projects
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-300" />
                Team management
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-300" />
                Analytics
              </span>
            </div>
          </div>

          <TaskOrbitVisual />
        </section>

        {/* statement */}
        <section id="why" className="border-y border-white/[0.06] bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
                  THE PROBLEM
                </p>

                <h2 className="max-w-md text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Work gets complicated when visibility disappears.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Tasks live in messages. Deadlines live in someone's head.
                Progress gets reported manually. Task Orbit gives your work a
                shared gravitational center — one place where everything has
                context and direction.
              </p>
            </div>
          </div>
        </section>

        {/* workflow */}
        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
              THE ORBIT
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
              From idea to done.
              <br />
              <span className="text-slate-500">Without losing the signal.</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-cyan-300/20 via-violet-400/30 to-cyan-300/20 md:block" />

            <div className="grid gap-8 md:grid-cols-4">
              {[
                ["01", "CAPTURE", "Bring every piece of work into one place."],
                ["02", "ORGANIZE", "Give tasks context, ownership and priority."],
                ["03", "EXECUTE", "Keep the team moving around clear objectives."],
                ["04", "MEASURE", "See progress and identify friction early."],
              ].map(([number, title, text]) => (
                <div key={number} className="relative">
                  <div className="relative z-10 mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-[#07111f] text-xs font-bold text-cyan-300">
                    {number}
                  </div>

                  <h3 className="text-sm font-bold tracking-[0.12em]">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="border-y border-white/[0.06] bg-[#091525]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
                  CORE SYSTEM
                </p>

                <h2 className="text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
                  Everything revolves
                  <br />
                  around the work.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-slate-500">
                No clutter. No decorative features pretending to be
                productivity. Just the systems your team needs to move work
                forward.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={feature.number}
                    className="group rounded-2xl border border-white/[0.07] bg-[#07111f] p-7 transition hover:border-cyan-300/20"
                  >
                    <div className="mb-12 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                        <Icon className="h-5 w-5 text-cyan-300" />
                      </div>

                      <span className="font-mono text-xs text-slate-700">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold">{feature.title}</h3>

                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {feature.text}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-cyan-300 opacity-70">
                      Explore
                      <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* security / control */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-10 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#0d1b2e] to-[#07111f] p-7 sm:p-10 lg:grid-cols-[1fr_.8fr] lg:p-14">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.07]">
                <ShieldCheck className="h-6 w-6 text-violet-300" />
              </div>

              <h2 className="max-w-lg text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                A workspace designed around clarity.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Task Orbit keeps your projects, team and progress connected
                without making your workspace feel like a spreadsheet with
                buttons.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Project control", "See the entire project at a glance."],
                ["Team visibility", "Know who owns what."],
                ["Progress signals", "Understand momentum before deadlines hurt."],
                ["Focused workspace", "Less noise. More execution."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
                >
                  <div className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-t border-white/[0.06]">
          <div className="absolute inset-0 bg-cyan-300/[0.025]" />

          <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
            <Target className="mx-auto mb-7 h-8 w-8 text-cyan-300" />

            <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              Put your work
              <br />
              <span className="text-cyan-300">into orbit.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Create your workspace, bring your projects together and give
              your team a clearer path from first idea to final delivery.
            </p>

            <Link
              to="/register"
              className="group mx-auto mt-9 flex w-fit items-center gap-2 rounded-xl bg-cyan-300 px-7 py-4 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
            >
              Start building with Task Orbit
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Orbit className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-bold tracking-[0.12em]">
              TASK ORBIT
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Organize work. Find momentum. Ship better.
          </p>
        </div>
      </footer>
    </div>
  );
}