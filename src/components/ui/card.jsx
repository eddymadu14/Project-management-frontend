
import React from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white shadow-sm p-4 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx("text-gray-800", className)} {...props}>
      {children}
    </div>
  );
}

