
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "components/Sidebar";
import Topbar from "components/Topbar";

const MainLayout = ({ children, location }) => {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location?.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;

