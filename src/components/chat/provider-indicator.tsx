"use client";

import { Badge } from "@/components/ui/badge";
import type { ProviderInfo } from "@/types";

interface ProviderIndicatorProps {
  provider: ProviderInfo | null;
}

export function ProviderIndicator({ provider }: ProviderIndicatorProps) {
  if (!provider) return null;

  const isOpenAI = provider.provider === "azure-openai";

  return (
    <Badge variant={isOpenAI ? "info" : "warning"} className="text-xs">
      {provider.displayName}
    </Badge>
  );
}
