"use client";

import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillSelector } from "./skill-selector";
import { SettingsPanel } from "./settings-panel";
import { ConversationList } from "./conversation-list";
import type { Skill, ProviderInfo, Conversation } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  skills: Skill[];
  activeSkillId: string;
  onSkillSelect: (skillId: string) => void;
  provider: ProviderInfo | null;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onConversationDelete: (id: string) => void;
}

export function Sidebar({
  skills,
  activeSkillId,
  onSkillSelect,
  provider,
  onNewChat,
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onConversationSelect,
  onConversationDelete,
}: SidebarProps) {
  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Skill Agent Chat
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 新規チャット */}
        <div className="px-4 py-3">
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={onNewChat}
          >
            <MessageSquarePlus className="h-4 w-4" />
            新しいチャット
          </Button>
        </div>

        {/* スキルリスト */}
        <div className="px-2 py-2">
          <SkillSelector
            skills={skills}
            activeSkillId={activeSkillId}
            onSelect={onSkillSelect}
          />
        </div>

        {/* 会話一覧 */}
        <div className="flex-1 overflow-y-auto border-t border-zinc-200 dark:border-zinc-800 px-2 py-2">
          <div className="px-2 py-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            会話履歴
          </div>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={onConversationSelect}
            onDelete={onConversationDelete}
          />
        </div>

        {/* プロバイダー情報 */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-2 py-3">
          <SettingsPanel provider={provider} />
        </div>
      </aside>
    </>
  );
}
