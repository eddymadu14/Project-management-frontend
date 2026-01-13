
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for combining Tailwind + conditional class names cleanly.
 * Example:
 * cn("px-4", isActive && "bg-blue-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

