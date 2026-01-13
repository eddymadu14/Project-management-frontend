
import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm rounded-xl",
      sm: "h-8 px-3 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-2xl",
      icon: "h-10 w-10 p-2 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
