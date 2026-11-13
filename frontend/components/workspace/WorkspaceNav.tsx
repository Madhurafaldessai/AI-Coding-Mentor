"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Flame, Sparkles, ChevronDown } from "lucide-react";
import { Lang } from "@mentor/shared";
import { Badge } from "@/components/ui/Badge";

export interface WorkspaceNavProps {
  language: Lang;
  onLanguageChange: (lang: Lang) => void;
  streak?: number;
  totalXp?: number;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({
  language,
  onLanguageChange,
  streak = 3,
  totalXp = 400,
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-slate-900 px-3 py-2 flex items-center justify-between shadow-retro-sm select-none z-30">
      {/* Brand & Back Link */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-pixel font-bold text-sm sm:text-lg text-slate-900 hover:text-[#0095FF] transition-colors"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0095FF] border-2 border-slate-900 flex items-center justify-center text-white shadow-retro-sm">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="hidden md:inline">AI Coding Mentor</span>
        </Link>

        <span className="text-slate-300 font-bold">|</span>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-1.5 py-0.5 rounded-md hover:bg-slate-100"
        >
          Dashboard
        </Link>
      </div>

      {/* Right Controls: Language Selector, Streak, XP */}
      <div className="flex items-center gap-2">
        {/* Language Selector Dropdown */}
        <div className="relative inline-flex items-center">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Lang)}
            aria-label="Select Programming Language"
            className="appearance-none bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 pl-2.5 pr-6 rounded-lg border-2 border-slate-900 shadow-retro-sm hover:bg-white cursor-pointer outline-none focus:border-[#0095FF]"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-1.5 pointer-events-none" />
        </div>

        {/* Streak & XP - visible on tablet and desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge
            variant="amber"
            size="sm"
            className="flex items-center gap-1 text-xs font-pixel py-1 px-2 rounded-lg"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
            <span>{streak}d</span>
          </Badge>

          <Badge
            variant="lavender"
            size="sm"
            className="flex items-center gap-1 text-xs font-pixel py-1 px-2 rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>{totalXp} XP</span>
          </Badge>
        </div>
      </div>
    </header>
  );
};
