"use client";

import React from "react";
import { Sparkles, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface MentorShellProps {
  failedRunsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const MentorShell: React.FC<MentorShellProps> = ({
  failedRunsCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  const hasNudge = failedRunsCount >= 3;

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 bg-white border-2 border-slate-900 rounded-2xl shadow-retro relative">
        <button
          onClick={onToggleCollapse}
          aria-label="Expand AI Mentor panel"
          className="p-1.5 rounded-lg border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 shadow-retro-sm text-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Pulsing indicator if 3 failed runs */}
        {hasNudge && (
          <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping absolute top-2 right-2" />
        )}

        <div className="mt-8 flex flex-col items-center gap-4">
          <Avatar state={hasNudge ? "thinking" : "idle"} size="sm" />
          <span className="font-pixel font-bold text-xs text-slate-500 uppercase [writing-mode:vertical-rl] tracking-widest select-none">
            AI Mentor
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-2 border-slate-900 rounded-2xl shadow-retro overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-slate-900 bg-purple-50/60 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-pixel font-bold text-sm text-slate-900">
            AI MENTOR
          </span>
          {hasNudge && (
            <Badge variant="lavender" size="sm" className="animate-pulse">
              Ready to help
            </Badge>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse AI Mentor panel"
            className="p-1 rounded-md border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-retro-sm text-slate-700"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center text-center space-y-4">
        {/* Mentor Avatar */}
        <Avatar state={hasNudge ? "thinking" : "idle"} size="lg" />

        {/* Intro */}
        <div>
          <h3 className="font-pixel font-bold text-base text-slate-900 mb-1">
            Byte, Your Guide
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            I adapt to how you code. When you get stuck on a tricky error or logic step, I provide progressive clues without giving away the answer.
          </p>
        </div>

        {/* Proactive gentle nudge card if 3 failed runs */}
        {hasNudge ? (
          <div className="w-full p-3.5 bg-purple-50 border-2 border-purple-300 rounded-xl space-y-1.5 shadow-retro-sm text-left animate-fadeIn">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Need a gentle nudge?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              You&apos;ve tested this challenge 3 times. Take a breath and check the suggestion in the output panel.
            </p>
          </div>
        ) : (
          <div className="w-full p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
            <p className="text-xs text-slate-500">
              Run your code to test your solution. If you encounter bugs, I&apos;ll be here to assist.
            </p>
          </div>
        )}

        {/* Hint Ladder Placeholder (Coming in Step 6) */}
        <div className="w-full pt-4 border-t border-slate-100 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none block mb-2">
            HINT LADDER (Step 6)
          </span>
          <div className="space-y-1.5 opacity-60 pointer-events-none">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Level 1: Nudge</span>
              <span>0 XP</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Level 2: Clue</span>
              <span>-5 XP</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Level 3: Breakdown</span>
              <span>-10 XP</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Level 4: Full Code Solution</span>
              <span>-20 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
