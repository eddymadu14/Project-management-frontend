
export const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

export const pageTransition = {
  type: "spring",
  stiffness: 60,
  damping: 12,
};