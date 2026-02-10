"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "info";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200":
            variant === "default",
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400":
            variant === "success",
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400":
            variant === "warning",
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400":
            variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}
