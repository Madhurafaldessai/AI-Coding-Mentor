"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center select-none font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:transform-none";

    const variantStyles = {
      primary:
        "bg-[#0095FF] hover:bg-[#0080DB] text-white border-2 border-slate-900 shadow-retro retro-press active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      secondary:
        "bg-[#C084FC] hover:bg-[#A855F7] text-slate-950 border-2 border-slate-900 shadow-retro retro-press active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      success:
        "bg-[#22C55E] hover:bg-[#16A34A] text-white border-2 border-slate-900 shadow-retro retro-press active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      outline:
        "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 shadow-retro retro-press active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      ghost:
        "bg-transparent hover:bg-slate-200/70 text-slate-800 border-2 border-transparent hover:border-slate-300 rounded-xl",
      danger:
        "bg-[#F43F5E] hover:bg-[#E11D48] text-white border-2 border-slate-900 shadow-retro retro-press active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2.5 rounded-xl gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3 rounded-2xl gap-2.5 min-h-[50px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
