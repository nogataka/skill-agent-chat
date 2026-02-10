"use client";

import { Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProviderInfo } from "@/types";

interface SettingsPanelProps {
  provider: ProviderInfo | null;
}

export function SettingsPanel({ provider }: SettingsPanelProps) {
  if (!provider) return null;

  const isOpenAI = provider.provider === "azure-openai";

  return (
    <div className="space-y-2">
      <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        プロバイダー
      </h3>
      <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50">
        <Server className="h-4 w-4 text-zinc-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
            {provider.displayName}
          </p>
        </div>
        <Badge variant={isOpenAI ? "info" : "warning"}>
          {isOpenAI ? "OpenAI" : "Anthropic"}
        </Badge>
      </div>
    </div>
  );
}
