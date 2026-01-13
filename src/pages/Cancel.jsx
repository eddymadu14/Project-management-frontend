


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Trash2, Edit2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";

import RiskBadge from "../components/RiskBadge";
import TimelineModal from "../components/modals/TimelineModal";
import WorkloadRadar from "../components/charts/WorkloadRadar";

const Organizer = () => {
  const { projectId: paramProjectId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(paramProjectId || "");
  const [columns, setColumns] = useState({ todo: [], inprogress: [], done: [] });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    estimatedHours: 1,
    riskScore: 0,
    dependencies: [],
    project: "",
  });
  const [toast, setToast] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // 🔹 Toast message handler
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Fetch all user projects
  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // 🔹 Fetch tasks for selected project
  const fetchTasks = async (projId) => {
    if (!projId) return;
    try {
      const { data } = await api.get(`/tasks/project/${projId}`);
      const grouped = { todo: [], inprogress: [], done: [] };
      data.forEach((task) => {
        if (grouped[task.status]) grouped[task.status].push(task);
      });
      setColumns(grouped);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      showToast("Error fetching tasks");
    }
  };

  // 🔹 Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 Handle URL param & project loading
  useEffect(() => {
    if (!projects.length) return; // wait for projects
    if (paramProjectId) {
      setProjectId(paramProjectId);
      fetchTasks(paramProjectId);
    } else if (!projectId && projects.length) {
      setProjectId(projects[0]._id);
      fetchTasks(projects[0]._id);
    }
  }, [paramProjectId, projects]);

  // 🔹 Handle manual project switch from dropdown
  useEffect(() => {
    if (projectId && projectId !== paramProjectId) {
      navigate(`/project-organizer/${projectId}`);
      fetchTasks(projectId);
    }
  }, [projectId]);

  // 🔹 Create or update a task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskPayload = { ...formData, project: formData.project || projectId };
    try {
      if (!taskPayload.project) return showToast("Please select a project");

      if (editing) {
        await api.put(`/tasks/${editing._id}`, taskPayload);
        showToast("Task updated!");
      } else {
        await api.post("/tasks", taskPayload);
        showToast("Task created!");
      }

      setShowModal(false);
      setEditing(null);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        estimatedHours: 1,
        riskScore: 0,
        dependencies: [],
        project: "",
      });
      fetchTasks(taskPayload.project);
    } catch (err) {
      console.error("Error saving task:", err);
      showToast("Error saving task.");
    }
  };

  // 🔹 Delete task
  const deleteTask = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      showToast("Task deleted!");
      fetchTasks(projectId);
    } catch (err) {
      console.error("Error deleting task:", err);
      showToast("Error deleting task");
    }
  };

  // 🔹 Toggle completion
  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { isCompleted: !task.isCompleted });
      fetchTasks(projectId);
    } catch (err) {
      console.error("Error toggling completion:", err);
      showToast("Error updating task status");
    }
  };

  // 🔹 Handle drag and drop updates
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);
    const [moved] = sourceCol.splice(source.index, 1);
    moved.status = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    try {
      await api.put(`/tasks/${moved._id}`, { status: destination.droppableId });
    } catch (err) {
      console.error("Error updating task status on drag:", err);
      showToast("Error updating task status");
    }
  };

  // 🔹 Edit modal handler
  const openEditModal = (task) => {
    setEditing(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      estimatedHours: task.estimatedHours,
      riskScore: task.riskScore,
      dependencies: task.dependencies || [],
      project: task.project,
    });
    setShowModal(true);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🔹 Header + Project selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Task Board</h1>
        <div className="flex items-center gap-3">
          <select
            className={`px-3 py-2 rounded-lg ${
              theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
            }`}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <Plus size={18} /> New Task
          </motion.button>
        </div>
      </div>

      {/* 🔹 Drag and Drop Task Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(columns).map(([key, tasks]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-2xl shadow-sm ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-lg font-semibold capitalize mb-4">{key}</h2>
                  {tasks.length === 0 && (
                    <p className="text-gray-400 text-center py-10">No tasks</p>
                  )}
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 mb-3 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700 flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4
                                className={`${
                                  task.isCompleted ? "line-through opacity-70" : ""
                                } font-semibold`}
                              >
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {task.description}
                              </p>
                              <small className="opacity-70 text-xs">
                                {task.assignedTo || "Unassigned"}
                              </small>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <RiskBadge riskScore={task.riskScore || 0} />
                              <button
                                onClick={() => {
                                  setSelectedTask(task._id);
                                  setShowTimeline(true);
                                }}
                                className="text-xs bg-blue-500/80 px-3 py-1 rounded-lg hover:bg-blue-500"
                              >
                                View Timeline
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => toggleComplete(task)}>
                              <CheckCircle
                                size={18}
                                className={
                                  task.isCompleted ? "text-green-500" : "text-gray-400"
                                }
                              />
                            </button>
                            <button onClick={() => openEditModal(task)}>
                              <Edit2 size={16} className="text-blue-500" />
                            </button>
                            <button onClick={() => deleteTask(task)}>
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </motion.div>
              )}
            </Droppable>
          ))}
          <div className="sm:col-span-1">
            <WorkloadRadar />
          </div>
        </div>
      </DragDropContext>

      <TimelineModal
        isOpen={showTimeline}
        onClose={() => setShowTimeline(false)}
        taskId={selectedTask}
      />

      {/* 🔹 Task Creation/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-white/20 backdrop-blur-2xl bg-white/10"
            >
              <h2 className="text-xl font-semibold mb-4 text-white text-center">
                {editing ? "Edit Task" : "New Task"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                  value={formData.project || projectId}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white resize-none"
                />
                <input
                  type="text"
                  placeholder="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                />
                <input
                  type="number"
                  placeholder="Estimated Hours"
                  min={1}
                  value={formData.estimatedHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedHours: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                />
                <input
                  type="number"
                  placeholder="Risk Score (0-1)"
                  min={0}
                  max={1}
                  step={0.01}
                  value={formData.riskScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskScore: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white"
                />

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle size={18} className="text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Organizer;