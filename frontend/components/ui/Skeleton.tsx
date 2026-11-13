import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = "xl",
  ...props
}) => {
  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-slate-200 border-2 border-slate-300",
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
};

