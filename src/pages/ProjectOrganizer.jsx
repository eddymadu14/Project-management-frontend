import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Edit3,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Trash2,
  Users,
  X,
} from "lucide-react";

import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";
import RiskBadge from "../components/RiskBadge";
import TimelineModal from "../components/modals/TimelineModal";
import WorkloadRadar from "../components/charts/WorkloadRadar";

const EMPTY_COLUMNS = {
  todo: [],
  "in-progress": [],
  done: [],
};

const STATUS_META = {
  todo: {
    label: "To Do",
    icon: CircleDot,
    color: "text-orbit-info",
    bg: "bg-orbit-info/10",
    border: "border-orbit-info/20",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock3,
    color: "text-orbit-violet",
    bg: "bg-orbit-violet/10",
    border: "border-orbit-violet/20",
  },
  done: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-orbit-success",
    bg: "bg-orbit-success/10",
    border: "border-orbit-success/20",
  },
};

const EMPTY_FORM = {
  title: "",
  description: "",
  assignedTo: "",
  estimatedHours: 1,
  riskScore: 0,
  dependencies: [],
  project: "",
};

const normalizeStatus = (status) => {
  if (status === "completed") return "done";
  if (status === "in_progress") return "in-progress";
  if (status === "in progress") return "in-progress";
  return STATUS_META[status] ? status : "todo";
};

const ProjectOrganizer = () => {
  const { projectId: routeProjectId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(routeProjectId || "");
  const [columns, setColumns] = useState(EMPTY_COLUMNS);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === projectId),
    [projects, projectId]
  );

  const allTasks = useMemo(
    () => Object.values(columns).flat(),
    [columns]
  );

  const stats = useMemo(() => {
    const completed = columns.done.length;
    const active = columns["in-progress"].length;
    const todo = columns.todo.length;
    const total = completed + active + todo;

    const hours = allTasks.reduce(
      (sum, task) => sum + Number(task.estimatedHours || 0),
      0
    );

    return {
      total,
      completed,
      active,
      todo,
      hours,
      completion: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [columns, allTasks]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);

      const { data } = await api.get("/projects");
      const nextProjects = Array.isArray(data) ? data : [];

      setProjects(nextProjects);

      const preferredProject =
        routeProjectId &&
        nextProjects.some((project) => project._id === routeProjectId)
          ? routeProjectId
          : nextProjects[0]?._id || "";

      setProjectId(preferredProject);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showToast("Unable to load your projects.", "error");
    } finally {
      setLoadingProjects(false);
    }
  }, [routeProjectId, showToast]);

  const fetchTasks = useCallback(
    async (selectedId) => {
      if (!selectedId) {
        setColumns(EMPTY_COLUMNS);
        return;
      }

      try {
        setLoadingTasks(true);

        const { data } = await api.get(
          `/tasks/project/${selectedId}`
        );

        const grouped = {
          todo: [],
          "in-progress": [],
          done: [],
        };

        (Array.isArray(data) ? data : []).forEach((task) => {
          const status = normalizeStatus(task.status);

          grouped[status].push({
            ...task,
            status,
          });
        });

        setColumns(grouped);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        showToast("Unable to load project tasks.", "error");
      } finally {
        setLoadingTasks(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const filteredTasks = useCallback(
    (tasks) =>
      tasks.filter((task) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.assignedTo?.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          normalizeStatus(task.status) === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter]
  );

  const resetForm = () => {
    setFormData({
      ...EMPTY_FORM,
      project: projectId || "",
    });
    setEditing(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditing(task);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo || "",
      estimatedHours: task.estimatedHours || 1,
      riskScore: task.riskScore || 0,
      dependencies: task.dependencies || [],
      project: task.project?._id || task.project || projectId,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      project: formData.project || projectId,
      estimatedHours: Number(formData.estimatedHours) || 1,
      riskScore: Number(formData.riskScore) || 0,
    };

    if (!payload.project) {
      showToast("Select a project first.", "error");
      return;
    }

    try {
      if (editing) {
        await api.put(`/tasks/${editing._id}`, payload);
        showToast("Task updated.");
      } else {
        await api.post("/tasks", payload);
        showToast("Task created.");
      }

      closeModal();
      await fetchTasks(payload.project);
    } catch (error) {
      console.error("Error saving task:", error);
      showToast(
        error.response?.data?.message || "Unable to save task.",
        "error"
      );
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      showToast("Task deleted.");
      await fetchTasks(projectId);
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Unable to delete task.", "error");
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        isCompleted: !task.isCompleted,
      });

      await fetchTasks(projectId);
      showToast(
        task.isCompleted
          ? "Task marked active."
          : "Task marked complete."
      );
    } catch (error) {
      console.error("Error toggling completion:", error);
      showToast("Unable to update task.", "error");
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const previousColumns = columns;

    const nextColumns = {
      todo: [...columns.todo],
      "in-progress": [...columns["in-progress"]],
      done: [...columns.done],
    };

    const sourceItems = nextColumns[source.droppableId];
    const destinationItems = nextColumns[destination.droppableId];

    const [movedTask] = sourceItems.splice(source.index, 1);

    if (!movedTask) return;

    const updatedTask = {
      ...movedTask,
      status: destination.droppableId,
      isCompleted: destination.droppableId === "done",
    };

    destinationItems.splice(destination.index, 0, updatedTask);

    setColumns(nextColumns);

    try {
      await api.put(`/tasks/${movedTask._id}`, {
        status: destination.droppableId,
        isCompleted: destination.droppableId === "done",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      setColumns(previousColumns);
      showToast("Task could not be moved.", "error");
    }
  };

  const pageClass =
    theme === "dark"
      ? "text-orbit-text"
      : "text-slate-900";

  if (loadingProjects) {
    return (
      <div className={`flex min-h-[70vh] items-center justify-center ${pageClass}`}>
        <Loader2 className="animate-spin text-orbit-cyan" size={28} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${pageClass}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mb-3 flex items-center gap-2 text-xs font-semibold text-orbit-muted transition hover:text-orbit-cyan"
          >
            <ArrowLeft size={14} />
            Projects
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
                Workspace
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Project Organizer
              </h1>
            </div>

            {selectedProject && (
              <span className="rounded-full border border-orbit-violet/20 bg-orbit-violet/10 px-3 py-1 text-xs font-semibold text-orbit-violet">
                {selectedProject.name}
              </span>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-sm text-orbit-muted">
            Move work through the pipeline, identify risk and keep the
            project moving.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={projectId}
            onChange={(event) => {
              const nextId = event.target.value;
              setProjectId(nextId);

              if (nextId) {
                navigate(`/project-organizer/${nextId}`);
              } else {
                navigate("/project-organizer");
              }
            }}
            className="
              min-w-[220px] rounded-xl border border-orbit-border-soft
              bg-orbit-surface px-4 py-3 text-sm font-semibold
              text-orbit-text outline-none transition
              focus:border-orbit-cyan/40
            "
          >
            {!projects.length && (
              <option value="">No projects</option>
            )}

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

          <button
            type="button"
            onClick={openCreateModal}
            disabled={!projectId}
            className="
              flex items-center justify-center gap-2 rounded-xl
              bg-gradient-to-r from-orbit-cyan to-orbit-violet
              px-5 py-3 text-sm font-bold text-orbit-bg
              shadow-lg shadow-orbit-cyan/10 transition
              hover:scale-[1.01] disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus size={17} />
            New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total Tasks",
            value: stats.total,
            icon: Target,
            color: "text-orbit-cyan",
          },
          {
            label: "In Progress",
            value: stats.active,
            icon: Clock3,
            color: "text-orbit-violet",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            color: "text-orbit-success",
          },
          {
            label: "Estimated Hours",
            value: `${stats.hours}h`,
            icon: CalendarDays,
            color: "text-orbit-warning",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="
                rounded-2xl border border-orbit-border-soft
                bg-orbit-surface p-4
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orbit-muted">
                  {stat.label}
                </span>

                <Icon size={16} className={stat.color} />
              </div>

              <p className="mt-3 text-2xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orbit-elevated text-orbit-muted">
              <Search size={17} />
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks, descriptions or assignees..."
              className="
                min-w-0 flex-1 bg-transparent text-sm text-orbit-text
                outline-none placeholder:text-orbit-muted
              "
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-orbit-muted" />

            {["all", "todo", "in-progress", "done"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`
                  rounded-lg px-3 py-2 text-xs font-semibold transition
                  ${
                    statusFilter === filter
                      ? "bg-orbit-cyan/10 text-orbit-cyan"
                      : "text-orbit-muted hover:bg-orbit-elevated hover:text-orbit-text"
                  }
                `}
              >
                {filter === "all"
                  ? "All"
                  : STATUS_META[filter]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loadingTasks ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-orbit-border-soft bg-orbit-surface">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={26}
              className="animate-spin text-orbit-cyan"
            />
            <p className="text-sm text-orbit-muted">
              Loading project tasks...
            </p>
          </div>
        </div>
      ) : !projectId ? (
        <div className="rounded-2xl border border-dashed border-orbit-border-soft bg-orbit-surface p-12 text-center">
          <Target className="mx-auto mb-4 text-orbit-muted" size={32} />
          <h2 className="font-semibold">No project selected</h2>
          <p className="mt-1 text-sm text-orbit-muted">
            Create or select a project to start organizing work.
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {Object.entries(columns).map(([key, tasks]) => {
              const meta = STATUS_META[key];
              const Icon = meta.icon;
              const visibleTasks = filteredTasks(tasks);

              return (
                <Droppable droppableId={key} key={key}>
                  {(provided, snapshot) => (
                    <section
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        min-h-[420px] rounded-2xl border
                        ${meta.border}
                        ${
                          snapshot.isDraggingOver
                            ? "bg-orbit-elevated/80"
                            : "bg-orbit-surface"
                        }
                        p-4 transition
                      `}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}
                          >
                            <Icon size={17} />
                          </div>

                          <div>
                            <h2 className="text-sm font-bold">
                              {meta.label}
                            </h2>

                            <p className="text-xs text-orbit-muted">
                              {visibleTasks.length} visible
                            </p>
                          </div>
                        </div>

                        <span className="rounded-lg bg-orbit-elevated px-2.5 py-1 text-xs font-bold text-orbit-muted">
                          {tasks.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {visibleTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={String(task._id)}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <motion.article
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                layout
                                whileHover={{
                                  y: dragSnapshot.isDragging ? 0 : -2,
                                }}
                                className={`
                                  rounded-xl border
                                  border-orbit-border-soft
                                  bg-orbit-elevated/70 p-4
                                  ${
                                    dragSnapshot.isDragging
                                      ? "shadow-2xl shadow-orbit-cyan/10"
                                      : ""
                                  }
                                `}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h3
                                      className={`
                                        text-sm font-bold
                                        ${
                                          task.isCompleted
                                            ? "text-orbit-muted line-through"
                                            : "text-orbit-text"
                                        }
                                      `}
                                    >
                                      {task.title}
                                    </h3>

                                    {task.description && (
                                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-orbit-muted">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    className="shrink-0 text-orbit-muted hover:text-orbit-text"
                                  >
                                    <MoreHorizontal size={17} />
                                  </button>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                  <RiskBadge
                                    riskScore={task.riskScore || 0}
                                  />

                                  {task.assignedTo && (
                                    <span className="flex items-center gap-1 rounded-full bg-orbit-bg px-2 py-1 text-[10px] font-semibold text-orbit-muted">
                                      <Users size={11} />
                                      {task.assignedTo}
                                    </span>
                                  )}

                                  {task.estimatedHours && (
                                    <span className="flex items-center gap-1 rounded-full bg-orbit-bg px-2 py-1 text-[10px] font-semibold text-orbit-muted">
                                      <Clock3 size={11} />
                                      {task.estimatedHours}h
                                    </span>
                                  )}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-orbit-border-soft pt-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTask(task._id);
                                      setShowTimeline(true);
                                    }}
                                    className="text-[11px] font-semibold text-orbit-cyan transition hover:text-orbit-cyan-soft"
                                  >
                                    View timeline
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      title="Complete task"
                                      onClick={() =>
                                        toggleComplete(task)
                                      }
                                      className="rounded-lg p-2 text-orbit-muted transition hover:bg-orbit-success/10 hover:text-orbit-success"
                                    >
                                      {task.isCompleted ? (
                                        <CheckCircle2 size={15} />
                                      ) : (
                                        <Check size={15} />
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      title="Edit task"
                                      onClick={() =>
                                        openEditModal(task)
                                      }
                                      className="rounded-lg p-2 text-orbit-muted transition hover:bg-orbit-cyan/10 hover:text-orbit-cyan"
                                    >
                                      <Edit3 size={15} />
                                    </button>

                                    <button
                                      type="button"
                                      title="Delete task"
                                      onClick={() => deleteTask(task)}
                                      className="rounded-lg p-2 text-orbit-muted transition hover:bg-orbit-danger/10 hover:text-orbit-danger"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </div>
                              </motion.article>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}

                        {!visibleTasks.length && (
                          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-orbit-border-soft">
                            <div className="text-center">
                              <CircleDot
                                size={22}
                                className="mx-auto mb-2 text-orbit-muted"
                              />
                              <p className="text-xs font-semibold text-orbit-muted">
                                {search
                                  ? "No matching tasks"
                                  : "No tasks here yet"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </Droppable>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
            <WorkloadRadar />
          </div>
        </DragDropContext>
      )}

      <TimelineModal
        isOpen={showTimeline}
        onClose={() => setShowTimeline(false)}
        taskId={selectedTask}
      />

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-orbit-border-soft bg-orbit-surface shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-orbit-border-soft px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orbit-cyan">
                    Task
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    {editing ? "Edit task" : "Create task"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl p-2 text-orbit-muted transition hover:bg-orbit-elevated hover:text-orbit-text"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 p-5"
              >
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                    Project
                  </label>

                  <select
                    value={formData.project || projectId}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        project: event.target.value,
                      }))
                    }
                    className="
                      w-full rounded-xl border border-orbit-border-soft
                      bg-orbit-elevated px-3 py-3 text-sm
                      text-orbit-text outline-none
                      focus:border-orbit-cyan/40
                    "
                  >
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
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                    Task title
                  </label>

                  <input
                    required
                    value={formData.title}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    placeholder="What needs to be done?"
                    className="
                      w-full rounded-xl border border-orbit-border-soft
                      bg-orbit-elevated px-3 py-3 text-sm
                      text-orbit-text outline-none
                      placeholder:text-orbit-muted
                      focus:border-orbit-cyan/40
                    "
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Add useful context..."
                    rows={4}
                    className="
                      w-full resize-none rounded-xl
                      border border-orbit-border-soft
                      bg-orbit-elevated px-3 py-3 text-sm
                      text-orbit-text outline-none
                      placeholder:text-orbit-muted
                      focus:border-orbit-cyan/40
                    "
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                      Assigned to
                    </label>

                    <input
                      value={formData.assignedTo}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          assignedTo: event.target.value,
                        }))
                      }
                      placeholder="Name"
                      className="
                        w-full rounded-xl border border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3 text-sm
                        text-orbit-text outline-none
                        placeholder:text-orbit-muted
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                      Hours
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={formData.estimatedHours}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          estimatedHours: event.target.value,
                        }))
                      }
                      className="
                        w-full rounded-xl border border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3 text-sm
                        text-orbit-text outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                      Risk 0–1
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.riskScore}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          riskScore: event.target.value,
                        }))
                      }
                      className="
                        w-full rounded-xl border border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3 text-sm
                        text-orbit-text outline-none
                      "
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-orbit-border-soft pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      rounded-xl border border-orbit-border-soft
                      px-4 py-2.5 text-sm font-semibold
                      text-orbit-muted transition
                      hover:bg-orbit-elevated hover:text-orbit-text
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      rounded-xl bg-gradient-to-r
                      from-orbit-cyan to-orbit-violet
                      px-5 py-2.5 text-sm font-bold text-orbit-bg
                    "
                  >
                    {editing ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`
              fixed bottom-5 right-5 z-[120]
              flex max-w-sm items-center gap-3
              rounded-xl border px-4 py-3
              shadow-2xl backdrop-blur-xl
              ${
                toast.type === "error"
                  ? "border-orbit-danger/20 bg-orbit-danger/10 text-orbit-danger"
                  : "border-orbit-success/20 bg-orbit-success/10 text-orbit-success"
              }
            `}
          >
            {toast.type === "error" ? (
              <AlertTriangle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            <span className="text-sm font-semibold">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectOrganizer;