import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../utils/api";

const STATUS_COLORS = {
  "To Do": "#38BDF8",
  "In Progress": "#A78BFA",
  Completed: "#34D399",
};

const Analytics = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const { data: projectsData } = await api.get("/projects");

      const projectList = Array.isArray(projectsData)
        ? projectsData
        : [];

      setProjects(projectList);

      const responses = await Promise.all(
        projectList.map((project) =>
          api
            .get(`/tasks/project/${project._id}`)
            .then(({ data }) =>
              (Array.isArray(data) ? data : []).map((task) => ({
                ...task,
                projectId: project._id,
                projectName: project.name,
              }))
            )
            .catch(() => [])
        )
      );

      setTasks(responses.flat());
    } catch (error) {
      console.error("Analytics loading failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const visibleTasks = useMemo(() => {
    if (selectedProject === "all") return tasks;

    return tasks.filter(
      (task) => task.projectId === selectedProject
    );
  }, [tasks, selectedProject]);

  const metrics = useMemo(() => {
    const total = visibleTasks.length;

    const completed = visibleTasks.filter(
      (task) =>
        task.status === "done" ||
        task.status === "completed" ||
        task.isCompleted
    ).length;

    const inProgress = visibleTasks.filter(
      (task) =>
        task.status === "in-progress" ||
        task.status === "in_progress"
    ).length;

    const todo = Math.max(
      total - completed - inProgress,
      0
    );

    const risk = visibleTasks.filter(
      (task) => Number(task.riskScore || 0) >= 0.7
    ).length;

    const hours = visibleTasks.reduce(
      (sum, task) =>
        sum + Number(task.estimatedHours || 0),
      0
    );

    return {
      total,
      completed,
      inProgress,
      todo,
      risk,
      hours,
      completion: total
        ? Math.round((completed / total) * 100)
        : 0,
    };
  }, [visibleTasks]);

  const statusData = [
    {
      name: "To Do",
      value: metrics.todo,
    },
    {
      name: "In Progress",
      value: metrics.inProgress,
    },
    {
      name: "Completed",
      value: metrics.completed,
    },
  ];

  const projectData = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.projectId === project._id
      );

      const completed = projectTasks.filter(
        (task) =>
          task.status === "done" ||
          task.status === "completed" ||
          task.isCompleted
      ).length;

      return {
        name:
          project.name?.length > 18
            ? `${project.name.slice(0, 18)}…`
            : project.name,
        tasks: projectTasks.length,
        completed,
      };
    });
  }, [projects, tasks]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-orbit-cyan"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
            Performance
          </p>

          <h1 className="mt-1 text-2xl font-bold text-orbit-text sm:text-3xl">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-orbit-muted">
            Turn project activity into decisions.
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(event) =>
            setSelectedProject(event.target.value)
          }
          className="
            rounded-xl border border-orbit-border-soft
            bg-orbit-surface px-4 py-3 text-sm
            font-semibold text-orbit-text outline-none
          "
        >
          <option value="all" className="bg-orbit-surface">
            All Projects
          </option>

          {projects.map((project) => (
            <option
              key={project._id}
              value={project._id}
              className="bg-orbit-surface"
            >
              {project.name}
            </option>
          ))}
        </select>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total Tasks",
            value: metrics.total,
            icon: Target,
            color: "text-orbit-cyan",
          },
          {
            label: "Completion",
            value: `${metrics.completion}%`,
            icon: TrendingUp,
            color: "text-orbit-success",
          },
          {
            label: "In Progress",
            value: metrics.inProgress,
            icon: Activity,
            color: "text-orbit-violet",
          },
          {
            label: "At Risk",
            value: metrics.risk,
            icon: AlertTriangle,
            color: "text-orbit-danger",
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-orbit-muted">
                  {metric.label}
                </p>

                <Icon size={16} className={metric.color} />
              </div>

              <p className="mt-3 text-2xl font-bold text-orbit-text">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-5 xl:col-span-1">
          <div className="mb-4">
            <h2 className="font-bold text-orbit-text">
              Task Distribution
            </h2>
            <p className="mt-1 text-xs text-orbit-muted">
              Current work across the pipeline.
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#0B1728",
                    border: "1px solid #1E293B",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-5 xl:col-span-2">
          <div className="mb-4">
            <h2 className="font-bold text-orbit-text">
              Project Workload
            </h2>
            <p className="mt-1 text-xs text-orbit-muted">
              Tasks versus completed work per project.
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid
                  stroke="#1E293B"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={11}
                />

                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0B1728",
                    border: "1px solid #1E293B",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                />

                <Bar
                  dataKey="tasks"
                  fill="#67E8F9"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="completed"
                  fill="#34D399"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-success/10 text-orbit-success">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs text-orbit-muted">
                Completed
              </p>
              <p className="font-bold text-orbit-text">
                {metrics.completed} tasks
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-warning/10 text-orbit-warning">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-xs text-orbit-muted">
                Estimated workload
              </p>
              <p className="font-bold text-orbit-text">
                {metrics.hours} hours
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-danger/10 text-orbit-danger">
              <AlertTriangle size={18} />
            </div>

            <div>
              <p className="text-xs text-orbit-muted">
                Risk exposure
              </p>
              <p className="font-bold text-orbit-text">
                {metrics.risk} high-risk tasks
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;