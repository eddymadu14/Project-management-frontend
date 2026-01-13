import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const GlassModal = ({ isOpen, onClose, title, children, actions }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative w-full max-w-md p-1 rounded-2xl"
          >
            {/* Glow ring */}
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
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(2,6,23,0.6)",
                zIndex: 1,
              }}
            >
              <div
                className="p-6 rounded-2xl border border-white/20 backdrop-blur-2xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                }}
              >
                {title && (
                  <h2 className="text-xl font-semibold mb-4 text-white text-center">
                    {title}
                  </h2>
                )}

                {/* Content */}
                {children}

                {/* Actions */}
                {actions && <div className="flex justify-end mt-4 gap-3">{actions}</div>}
              </div>

              {/* Top highlight */}
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
  );
};

export default GlassModal;