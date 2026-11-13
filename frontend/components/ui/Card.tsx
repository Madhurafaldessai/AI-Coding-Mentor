import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "interactive";
  shadow?: "sm" | "md" | "lg" | "none";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      shadow = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-2xl border-2 border-slate-900 transition-all duration-150";

    const variantStyles = {
      default: "bg-white text-slate-900",
      muted: "bg-slate-50 text-slate-900",
      interactive:
        "bg-white text-slate-900 hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer",
    };

    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-retro-sm",
      md: "shadow-retro",
      lg: "shadow-retro-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], shadowStyles[shadow], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
