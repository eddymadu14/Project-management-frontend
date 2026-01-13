
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import { X } from "lucide-react";

const TimelineModal = ({ isOpen, onClose, taskId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen && taskId) {
      api.get(`/tasks/${taskId}/history`).then(res => setHistory(res.data));
    }
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 w-[90%] md:w-[500px] shadow-2xl text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Task Timeline</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-gray-300 text-center">No history yet.</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/10 rounded-xl border border-white/20"
                >
                  <p className="text-sm font-semibold">
                    {h.action} {h.from && `(${h.from} → ${h.to})`}
                  </p>
                  {h.reason && (
                    <p className="text-xs text-gray-200 mt-1 italic">
                      Reason: {h.reason}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs mt-2 text-gray-300">
                    <span>{h.changedBy || "System"}</span>
                    <span>{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimelineModal;