
import React from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

const AnimatedCard = ({ children, index = 0, className }) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10 }}
      className={classNames(
        "rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
