"use client";

import React from "react";
import { ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";
import { Challenge } from "@/lib/challenges";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ProblemPanelProps {
  challenge: Challenge;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  challenge,
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 bg-white border-2 border-slate-900 rounded-2xl shadow-retro">
        <button
          onClick={onToggleCollapse}
          aria-label="Expand problem panel"
          className="p-1.5 rounded-lg border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 shadow-retro-sm text-slate-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="mt-8 font-pixel font-bold text-xs text-slate-500 uppercase [writing-mode:vertical-rl] tracking-widest select-none">
          Problem Spec
        </span>
      </div>
    );
  }

  const difficultyVariant =
    challenge.difficulty === "Easy"
      ? "green"
      : challenge.difficulty === "Medium"
      ? "amber"
      : "rose";

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-2 border-slate-900 rounded-2xl shadow-retro overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-slate-900 bg-slate-50/70 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0095FF]" />
          <span className="font-pixel font-bold text-sm text-slate-900">
            CHALLENGE SPEC
          </span>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse problem panel"
            className="p-1 rounded-md border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-retro-sm text-slate-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Area with smooth scrolling */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm text-slate-800">
        {/* Title and Badges */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficultyVariant} size="sm">
              {challenge.difficulty}
            </Badge>
            <Badge variant="cyan" size="sm">
              {challenge.concept}
            </Badge>
          </div>
          <h1 className="text-xl font-pixel font-bold text-slate-900 leading-snug">
            {challenge.title}
          </h1>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 select-none">
            Description
          </h2>
          <p className="leading-relaxed text-slate-700 whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* Examples */}
        {challenge.examples && challenge.examples.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
              Examples
            </h2>
            {challenge.examples.map((example, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-1.5 text-xs font-mono"
              >
                <div>
                  <span className="text-slate-500 font-sans font-bold select-none">Input: </span>
                  <span className="text-slate-900 font-semibold">{example.input}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans font-bold select-none">Output: </span>
                  <span className="text-emerald-700 font-semibold">{example.output}</span>
                </div>
                {example.explanation && (
                  <p className="text-[11px] text-slate-600 font-sans italic pt-1 border-t border-slate-200">
                    {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Constraints */}
        {challenge.constraints && challenge.constraints.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 select-none flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Constraints
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
              {challenge.constraints.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
