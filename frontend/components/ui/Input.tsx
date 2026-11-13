"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      rightElement,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cn(
              "w-full px-3.5 py-2.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border-2 transition-all duration-150 outline-none",
              error
                ? "border-rose-500 bg-rose-50/30 focus:border-rose-600 focus:shadow-retro-sm"
                : "border-slate-300 focus:border-slate-900 focus:shadow-retro-sm hover:border-slate-500",
              (isPassword || rightElement) && "pr-11",
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 p-1 text-slate-500 hover:text-slate-900 rounded-md focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            rightElement && <div className="absolute right-3">{rightElement}</div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-semibold text-rose-600 animate-fadeIn" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

