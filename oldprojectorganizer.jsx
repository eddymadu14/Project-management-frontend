

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";

const ProjectOrganizer = () => {
  const { theme } = useTheme();
  const [columns, setColumns] = useState({ todo: [], inprogress: [], done: [] });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", assignedTo: "" });
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await api.get("/tasks");
      const grouped = { todo: [], inprogress: [], done: [] };
      data.forEach((task) => grouped[task.status].push(task));
      setColumns(grouped);
    };
    fetchTasks();
  }, []);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Add or edit task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/tasks/${editing._id}`, formData);
        showToast("Task updated!");
      } else {
        await api.post("/tasks", formData);
        showToast("Task created!");
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ title: "", description: "", assignedTo: "" });
      const { data } = await api.get("/tasks");
      const grouped = { todo: [], inprogress: [], done: [] };
      data.forEach((task) => grouped[task.status].push(task));
      setColumns(grouped);
    } catch {
      showToast("Error saving task.");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    showToast("Task deleted!");
    setColumns((prev) => {
      const updated = { ...prev };
      for (let col in updated) updated[col] = updated[col].filter((t) => t._id !== id);
      return updated;
    });
  };

  // Toggle completion
  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    setColumns((prev) => {
      const updated = { ...prev };
      updated[task.status] = updated[task.status].map((t) =>
        t._id === task._id ? { ...t, completed: !t.completed } : t
      );
      return updated;
    });
  };

  // Drag + drop
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

    // Update backend
    await api.put(`/tasks/${moved._id}`, { status: destination.droppableId });
  };

  const bg = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800";
  const colBg = theme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${bg}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Task Board</h1>
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

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(columns).map(([key, tasks]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-2xl shadow-sm ${colBg}`}
                >
                  <h2 className="text-lg font-semibold capitalize mb-4">{key}</h2>
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 mb-3 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                        >
                          <div>
                            <p className={`${task.completed ? "line-through opacity-70" : ""}`}>
                              {task.title}
                            </p>
                            <small className="opacity-70 text-xs">
                              {task.assignedTo || "Unassigned"}
                            </small>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => toggleComplete(task)}>
                              <CheckCircle
                                size={18}
                                className={task.completed ? "text-green-500" : "text-gray-400"}
                              />
                            </button>
                            <button onClick={() => deleteTask(task._id)}>
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
        </div>
      </DragDropContext>

      {/* Modal */}
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
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white resize-none"
                />
                <input
                  type="text"
                  placeholder="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white/20 text-white rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            <CheckCircle size={18} className="text-green-400 inline mr-2" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectOrganizer;

