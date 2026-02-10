"use client";

import { BookOpen, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

interface SkillSelectorProps {
  skills: Skill[];
  activeSkillId: string;
  onSelect: (skillId: string) => void;
}

export function SkillSelector({
  skills,
  activeSkillId,
  onSelect,
}: SkillSelectorProps) {
  return (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
        スキル
      </h3>
      {skills.map((skill) => {
        const isActive = skill.id === activeSkillId;
        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => onSelect(skill.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {skill.name}
                </span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                {skill.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
