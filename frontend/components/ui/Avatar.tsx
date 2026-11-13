"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  state?: "idle" | "thinking" | "happy";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  state = "idle",
  size = "md",
  className,
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      role="img"
      aria-label={`AI Mentor Avatar (${state} state)`}
      className={cn(
        "relative flex items-center justify-center rounded-xl border-2 border-slate-900 bg-gradient-to-b from-[#A5F3FC] to-[#7DD3FC] shadow-retro-sm select-none shrink-0 overflow-hidden",
        sizeMap[size],
        state === "idle" && "animate-gentleFloat",
        state === "happy" && "animate-bounceShort",
        className
      )}
    >
      {/* Pixel Mentor Face SVG */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* Mentor Antenna / Beacon */}
        <rect x="15" y="2" width="2" height="4" fill="#0F172A" />
        <rect
          x="14"
          y="1"
          width="4"
          height="3"
          fill={state === "thinking" ? "#F59E0B" : state === "happy" ? "#22C55E" : "#A855F7"}
          className={state === "thinking" ? "animate-pulse" : ""}
        />

        {/* Head Shell */}
        <rect x="6" y="6" width="20" height="18" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

        {/* Visor Screen */}
        <rect x="9" y="9" width="14" height="10" rx="2" fill="#0F172A" />

        {/* Eyes according to state */}
        {state === "idle" && (
          <>
            {/* Calm glowing cyan eyes */}
            <rect x="11" y="12" width="3" height="4" fill="#38BDF8" rx="1" />
            <rect x="18" y="12" width="3" height="4" fill="#38BDF8" rx="1" />
          </>
        )}

        {state === "thinking" && (
          <>
            {/* Thinking tilted blinking dots */}
            <rect x="11" y="13" width="2" height="2" fill="#F59E0B" />
            <rect x="15" y="13" width="2" height="2" fill="#F59E0B" />
            <rect x="19" y="13" width="2" height="2" fill="#F59E0B" />
          </>
        )}

        {state === "happy" && (
          <>
            {/* Happy arch eyes (^_^) */}
            <path
              d="M11 15C11 13 13 13 13 13"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 15C18 13 20 13 20 13"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Subtle Blush on happy */}
        {state === "happy" && (
          <>
            <rect x="9" y="16" width="2" height="1" fill="#F43F5E" />
            <rect x="21" y="16" width="2" height="1" fill="#F43F5E" />
          </>
        )}
      </svg>
    </div>
  );
};

