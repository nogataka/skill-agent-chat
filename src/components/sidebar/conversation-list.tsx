"use client";

import { Trash2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
        まだ会話がありません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={cn(
            "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
            activeConversationId === conv.id
              ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
          onClick={() => onSelect(conv.id)}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{conv.title}</span>
          <button
            type="button"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conv.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
