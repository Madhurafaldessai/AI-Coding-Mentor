import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "green" | "amber" | "lavender" | "cyan" | "slate" | "rose";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "cyan",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    green: "bg-[#22C55E]/15 text-[#15803D] border-[#16A34A]",
    amber: "bg-[#F59E0B]/20 text-[#B45309] border-[#D97706]",
    lavender: "bg-[#C084FC]/25 text-[#7E22CE] border-[#A855F7]",
    cyan: "bg-[#A5F3FC]/40 text-[#0369A1] border-[#0284C7]",
    slate: "bg-slate-100 text-slate-800 border-slate-900",
    rose: "bg-rose-100 text-rose-800 border-rose-500",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border-2 select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
