import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: "green" | "amber" | "lavender" | "blue";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "amber",
  size = "md",
  showLabel = false,
  className,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorStyles = {
    green: "bg-[#22C55E]",
    amber: "bg-[#F59E0B]",
    lavender: "bg-[#C084FC]",
    blue: "bg-[#0095FF]",
  };

  const sizeStyles = {
    sm: "h-2.5",
    md: "h-4",
    lg: "h-6",
  };

  return (
    <div className={cn("w-full flex items-center gap-3", className)} {...props}>
      <div
        className={cn(
          "w-full bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden relative shadow-retro-sm",
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out border-r-2 border-slate-900",
            colorStyles[color]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-pixel text-xs text-slate-800 shrink-0">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};

