
import React from "react";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const AnimatedList = ({ children }) => (
  <motion.div
    variants={listVariants}
    initial="hidden"
    animate="visible"
    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    {children}
  </motion.div>
);

export default AnimatedList;
