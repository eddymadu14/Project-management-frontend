
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Edit} from "lucide-react";
import AnimatedCard from "../components/ui/AnimatedCard";
import toast from "react-hot-toast";
import api from "../utils/api"; // axios instance

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", desc: "" });

  // 🔹 Fetch projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Open modal (add or edit)
  const openModal = (project = null) => {
    if (project) {
      setEditing(project);
      setFormData({ name: project.name, desc: project.desc });
    } else {
      setEditing(null);
      setFormData({ name: "", desc: "" });
    }
    setShowModal(true);
  };

  // 🔹 Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { data } = await api.put(`/projects/${editing._id}`, formData);
        setProjects(projects.map((p) => (p._id === editing._id ? data : p)));
        toast.success("Project updated!");
      } else {
        const { data } = await api.post("/projects", formData);
        setProjects([data, ...projects]);
        toast.success("Project added!");
      }
      setShowModal(false);
      setFormData({ name: "", desc: "" });
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project");
    }
  };

  // 🔹 Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting project");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Projects
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 shadow-md transition-all"
        >
           Add Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p, i) => (
          <AnimatedCard key={p._id || i} index={i}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{p.desc}</p>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => openModal(p)}
                  className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                >
                  
                   <Edit size={16} className="text-green-500" />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                   <Trash2 size={16} className="text-red-500" />
                </button>

              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* 🌌 Glassmorphic Modal (upgraded) */}
      <AnimatePresence>
        {showModal && (
          /* Backdrop: clicking outside closes modal */
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // close only when clicking backdrop (not when clicking inside the card)
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            {/* Gradient glow outline (layer under the glass card) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-md p-1 rounded-2xl"
            >
              {/* Glow ring (gradient) */}
              <div
                aria-hidden="true"
                className="absolute -inset-0.5 rounded-2xl blur-3xl opacity-80"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(139,92,246,0.65), rgba(236,72,153,0.6), rgba(59,130,246,0.6))",
                  zIndex: 0,
                }}
              />

              {/* Main glass card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  // inner shadow + frosted layer
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(2,6,23,0.6)",
                  zIndex: 1,
                }}
              >
                {/* Frosted backdrop + subtle textured layer */}
                <div
                  className="p-6 rounded-2xl border border-white/20 backdrop-blur-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    // support dark mode by reducing opacity in dark
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4 text-white text-center">
                    {editing ? "Edit Project" : "Add Project"}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData({ ...formData, desc: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
                      rows="3"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg bg-white/12 text-white hover:bg-white/20 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:opacity-95 shadow-lg shadow-indigo-500/30 transition"
                      >
                        {editing ? "Update" : "Save"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Top subtle highlight (makes it glassy) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 right-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                    mixBlendMode: "overlay",
                    zIndex: 2,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
