"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ConsoleScreenProps {
  children: React.ReactNode;
  className?: string;
  onDpadPress?: (direction: "up" | "down" | "left" | "right") => void;
  onButtonPress?: (button: "A" | "B" | "START" | "SELECT") => void;
}

export const ConsoleScreen: React.FC<ConsoleScreenProps> = ({
  children,
  className,
  onDpadPress,
  onButtonPress,
}) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-[380px] mx-auto select-none rounded-[32px] border-[3px] border-slate-900 bg-[#BAE6FD] p-4 shadow-retro-lg transition-transform",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)",
      }}
    >
      {/* Top Console Ridge */}
      <div className="w-24 h-2.5 mx-auto -mt-1 mb-3 rounded-full border-2 border-slate-900 bg-[#7DD3FC] shadow-retro-sm" />

      {/* Handheld Device Screen Bezel */}
      <div className="relative rounded-2xl border-[3px] border-slate-900 bg-[#E0F2FE] p-4 shadow-inner">
        {/* Decorative Screen Corner Flourishes */}
        <div className="absolute top-2 left-2 text-slate-400 font-pixel text-[10px] select-none">
          +
        </div>
        <div className="absolute top-2 right-2 text-slate-400 font-pixel text-[10px] select-none">
          +
        </div>
        <div className="absolute bottom-2 left-2 text-slate-400 font-pixel text-[10px] select-none">
          +
        </div>
        <div className="absolute bottom-2 right-2 text-slate-400 font-pixel text-[10px] select-none">
          +
        </div>

        {/* Screen Active Content Area */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px]">
          {children}
        </div>
      </div>

      {/* Handheld Console Controls Area */}
      <div className="mt-5 flex items-center justify-between px-2">
        {/* D-Pad (Lavender) */}
        <div className="relative w-20 h-20">
          {/* Horizontal crossbar */}
          <div className="absolute top-6 left-0 w-20 h-8 rounded-md bg-[#C084FC] border-2 border-slate-900 shadow-retro-sm" />
          {/* Vertical crossbar */}
          <div className="absolute top-0 left-6 w-8 h-20 rounded-md bg-[#C084FC] border-2 border-slate-900 shadow-retro-sm" />
          {/* Center core with directional click buttons */}
          <button
            type="button"
            aria-label="D-pad Up"
            onClick={() => onDpadPress?.("up")}
            className="absolute top-0 left-6 w-8 h-6 hover:bg-[#A855F7] rounded-t-sm"
          />
          <button
            type="button"
            aria-label="D-pad Down"
            onClick={() => onDpadPress?.("down")}
            className="absolute bottom-0 left-6 w-8 h-6 hover:bg-[#A855F7] rounded-b-sm"
          />
          <button
            type="button"
            aria-label="D-pad Left"
            onClick={() => onDpadPress?.("left")}
            className="absolute top-6 left-0 w-6 h-8 hover:bg-[#A855F7] rounded-l-sm"
          />
          <button
            type="button"
            aria-label="D-pad Right"
            onClick={() => onDpadPress?.("right")}
            className="absolute top-6 right-0 w-6 h-8 hover:bg-[#A855F7] rounded-r-sm"
          />
        </div>

        {/* Speaker Grille Slots */}
        <div className="flex flex-col gap-1 items-center justify-center rotate-45 opacity-60">
          <div className="w-5 h-1 rounded-full bg-slate-900" />
          <div className="w-6 h-1 rounded-full bg-slate-900" />
          <div className="w-5 h-1 rounded-full bg-slate-900" />
        </div>

        {/* Action Buttons A & B (Lavender) */}
        <div className="flex items-center gap-3 -rotate-12">
          {/* Button B */}
          <button
            type="button"
            onClick={() => onButtonPress?.("B")}
            className="w-10 h-10 rounded-full bg-[#C084FC] hover:bg-[#A855F7] border-2 border-slate-900 shadow-retro-sm font-pixel font-bold text-slate-900 text-sm flex items-center justify-center retro-press active:translate-x-0.5 active:translate-y-0.5"
          >
            B
          </button>
          {/* Button A */}
          <button
            type="button"
            onClick={() => onButtonPress?.("A")}
            className="w-10 h-10 -mt-3 rounded-full bg-[#C084FC] hover:bg-[#A855F7] border-2 border-slate-900 shadow-retro-sm font-pixel font-bold text-slate-900 text-sm flex items-center justify-center retro-press active:translate-x-0.5 active:translate-y-0.5"
          >
            A
          </button>
        </div>
      </div>

      {/* SELECT & START Pill Buttons */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onButtonPress?.("SELECT")}
          className="px-3 py-1 rounded-full bg-[#C084FC] hover:bg-[#A855F7] border-2 border-slate-900 font-pixel text-[9px] text-slate-900 uppercase tracking-widest shadow-retro-sm retro-press"
        >
          SELECT
        </button>
        <button
          type="button"
          onClick={() => onButtonPress?.("START")}
          className="px-3 py-1 rounded-full bg-[#C084FC] hover:bg-[#A855F7] border-2 border-slate-900 font-pixel text-[9px] text-slate-900 uppercase tracking-widest shadow-retro-sm retro-press"
        >
          START
        </button>
      </div>
    </div>
  );
};
