import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  FolderKanban,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
  Layers3,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../utils/api";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });

  /* =========================================================
     FETCH PROJECTS
  ========================================================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  /* =========================================================
     FILTERED PROJECTS
  ========================================================= */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) => {
      const name = project?.name?.toLowerCase() || "";
      const desc = project?.desc?.toLowerCase() || "";

      return name.includes(query) || desc.includes(query);
    });
  }, [projects, search]);

  /* =========================================================
     MODAL
  ========================================================= */

  const openModal = (project = null) => {
    if (project) {
      setEditing(project);

      setFormData({
        name: project.name || "",
        desc: project.desc || "",
      });
    } else {
      setEditing(null);

      setFormData({
        name: "",
        desc: "",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);

    setFormData({
      name: "",
      desc: "",
    });
  };

  /* =========================================================
     CREATE / UPDATE PROJECT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      if (editing) {
        const { data } = await api.put(
          `/projects/${editing._id}`,
          formData
        );

        setProjects((current) =>
          current.map((project) =>
            project._id === editing._id ? data : project
          )
        );

        toast.success("Project updated");
      } else {
        const { data } = await api.post("/projects", formData);

        setProjects((current) => [data, ...current]);

        toast.success("Project created");
      }

      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(
        editing
          ? "Failed to update project"
          : "Failed to create project"
      );
    }
  };

  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      setProjects((current) =>
        current.filter((project) => project._id !== id)
      );

      toast.success("Project deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-full bg-orbit-bg text-orbit-text">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orbit-cyan shadow-[0_0_12px_rgba(103,232,249,0.8)]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orbit-cyan">
                Workspace
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-orbit-text sm:text-4xl">
              Project Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-orbit-muted sm:text-base">
              Keep your projects organized, monitor progress, and move
              your work forward from one command center.
            </p>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal()}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-orbit-cyan
              px-5
              py-3
              text-sm
              font-bold
              text-orbit-bg
              shadow-[0_0_30px_rgba(103,232,249,0.12)]
              transition
              hover:bg-orbit-cyan-soft
            "
          >
            <Plus size={18} />
            Create Project
          </motion.button>
        </div>
      </section>

      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OverviewCard
          icon={<FolderKanban size={20} />}
          label="Total Projects"
          value={projects.length}
          accent="cyan"
        />

        <OverviewCard
          icon={<Layers3 size={20} />}
          label="Workspace"
          value="Active"
          accent="violet"
        />

        <OverviewCard
          icon={<Activity size={20} />}
          label="System Status"
          value="Operational"
          accent="success"
        />
      </section>

      {/* =====================================================
          PROJECT SECTION
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-orbit-border-soft
          bg-orbit-surface
          shadow-[0_20px_70px_rgba(0,0,0,0.18)]
        "
      >
        {/* Section header */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-orbit-border-soft
            p-5
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-orbit-text">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-orbit-muted">
              Manage and access your current projects.
            </p>
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              size={17}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-orbit-muted
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="
                w-full
                rounded-xl
                border
                border-orbit-border
                bg-orbit-bg
                py-2.5
                pl-10
                pr-4
                text-sm
                text-orbit-text
                outline-none
                placeholder:text-orbit-muted
                transition
                focus:border-orbit-cyan/40
                focus:ring-2
                focus:ring-orbit-cyan/10
              "
            />
          </div>
        </div>

        {/* ===================================================
            PROJECT GRID
        =================================================== */}

        <div className="p-5 sm:p-6">
          {filteredProjects.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(search)}
              onCreate={() => openModal()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id || index}
                    project={project}
                    index={index}
                    onEdit={openModal}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showModal && (
          <ProjectModal
            editing={editing}
            formData={formData}
            setFormData={setFormData}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===========================================================
   OVERVIEW CARD
=========================================================== */

const OverviewCard = ({ icon, label, value, accent }) => {
  const accentClasses = {
    cyan: {
      icon: "bg-orbit-cyan/10 text-orbit-cyan border-orbit-cyan/10",
      glow: "bg-orbit-cyan",
    },

    violet: {
      icon:
        "bg-orbit-violet/10 text-orbit-violet border-orbit-violet/10",
      glow: "bg-orbit-violet",
    },

    success: {
      icon:
        "bg-orbit-success/10 text-orbit-success border-orbit-success/10",
      glow: "bg-orbit-success",
    },
  };

  const styles = accentClasses[accent] || accentClasses.cyan;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-orbit-border-soft
        bg-orbit-surface
        p-5
        transition
        hover:border-orbit-border
      "
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${styles.glow} opacity-[0.04] blur-2xl`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orbit-muted">
            {label}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-orbit-text">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            ${styles.icon}
          `}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

/* ===========================================================
   PROJECT CARD
=========================================================== */

const ProjectCard = ({
  project,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
      }}
      whileHover={{ y: -4 }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-orbit-border-soft
        bg-orbit-bg
        p-5
        transition
        hover:border-orbit-cyan/15
        hover:bg-orbit-elevated
      "
    >
      {/* Top accent */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-orbit-cyan/40
          to-transparent
          opacity-0
          transition
          group-hover:opacity-100
        "
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-orbit-cyan/10
            bg-orbit-cyan/5
            text-orbit-cyan
          "
        >
          <FolderKanban size={20} />
        </div>

        <span
          className="
            rounded-full
            border
            border-orbit-success/10
            bg-orbit-success/5
            px-2.5
            py-1
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-orbit-success
          "
        >
          Active
        </span>
      </div>

      <div className="min-h-[105px]">
        <h3 className="line-clamp-1 text-lg font-semibold text-orbit-text">
          {project.name || "Untitled Project"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-orbit-muted">
          {project.desc || "No project description available."}
        </p>
      </div>

      {/* Bottom */}

      <div className="mt-6 flex items-center justify-between border-t border-orbit-border-soft pt-4">
        <button
          type="button"
          onClick={() => onEdit(project)}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-orbit-muted
            transition
            hover:text-orbit-cyan
          "
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(project._id)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            p-2
            text-orbit-muted
            transition
            hover:bg-orbit-danger/10
            hover:text-orbit-danger
          "
          aria-label={`Delete ${project.name}`}
        >
          <Trash2 size={16} />
        </button>

        <ArrowUpRight
          size={16}
          className="
            text-orbit-muted/40
            transition
            group-hover:text-orbit-cyan
          "
        />
      </div>
    </motion.article>
  );
};

/* ===========================================================
   EMPTY STATE
=========================================================== */

const EmptyState = ({ hasSearch, onCreate }) => {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-orbit-cyan/10
          bg-orbit-cyan/5
          text-orbit-cyan
        "
      >
        <FolderKanban size={24} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-orbit-text">
        {hasSearch ? "No projects found" : "Your workspace is empty"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-orbit-muted">
        {hasSearch
          ? "Try another search term."
          : "Create your first project and start organizing your work."}
      </p>

      {!hasSearch && (
        <button
          type="button"
          onClick={onCreate}
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-orbit-cyan
            px-4
            py-2.5
            text-sm
            font-semibold
            text-orbit-bg
            transition
            hover:bg-orbit-cyan-soft
          "
        >
          <Plus size={16} />
          Create Project
        </button>
      )}
    </div>
  );
};

/* ===========================================================
   PROJECT MODAL
=========================================================== */

const ProjectModal = ({
  editing,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-orbit-bg/80
        p-4
        backdrop-blur-md
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          border
          border-orbit-border-soft
          bg-orbit-surface
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
        "
      >
        {/* Gradient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -inset-20
            bg-gradient-to-r
            from-orbit-cyan/5
            via-orbit-violet/5
            to-transparent
            blur-3xl
          "
        />

        <div className="relative">
          {/* Modal header */}

          <div className="flex items-center justify-between border-b border-orbit-border-soft p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orbit-cyan">
                Project
              </p>

              <h2 className="mt-1 text-xl font-semibold text-orbit-text">
                {editing ? "Edit Project" : "Create Project"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-orbit-muted
                transition
                hover:bg-white/5
                hover:text-orbit-text
              "
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}

          <form onSubmit={onSubmit} className="space-y-5 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text-secondary">
                Project name
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Website Redesign"
                className="
                  w-full
                  rounded-xl
                  border
                  border-orbit-border
                  bg-orbit-bg
                  px-4
                  py-3
                  text-sm
                  text-orbit-text
                  outline-none
                  placeholder:text-orbit-muted
                  transition
                  focus:border-orbit-cyan/40
                  focus:ring-2
                  focus:ring-orbit-cyan/10
                "
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text-secondary">
                Description
              </label>

              <textarea
                value={formData.desc}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    desc: event.target.value,
                  })
                }
                placeholder="Describe what this project is about..."
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-orbit-border
                  bg-orbit-bg
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-orbit-text
                  outline-none
                  placeholder:text-orbit-muted
                  transition
                  focus:border-orbit-cyan/40
                  focus:ring-2
                  focus:ring-orbit-cyan/10
                "
              />
            </div>

            {/* Actions */}

            <div className="flex justify-end gap-3 border-t border-orbit-border-soft pt-5">
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-xl
                  border
                  border-orbit-border
                  bg-orbit-bg
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-orbit-text-secondary
                  transition
                  hover:bg-orbit-elevated
                  hover:text-orbit-text
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-orbit-cyan
                  to-orbit-violet
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-orbit-bg
                  shadow-[0_0_25px_rgba(103,232,249,0.10)]
                  transition
                  hover:opacity-90
                "
              >
                {editing ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;