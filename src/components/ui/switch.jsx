import * as React from "react";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          checked ? "bg-blue-600" : "bg-gray-300",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";