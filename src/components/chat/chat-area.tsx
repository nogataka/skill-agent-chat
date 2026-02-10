"use client";

import { useEffect, useRef } from "react";
import { Loader2, Sparkles, Menu } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { ProviderIndicator } from "./provider-indicator";
import type { UIMessage } from "ai";
import type { ProviderInfo, Skill } from "@/types";

interface ChatAreaProps {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  provider: ProviderInfo | null;
  activeSkill: Skill | undefined;
  onMenuClick: () => void;
}

export function ChatArea({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
  provider,
  activeSkill,
  onMenuClick,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* ヘッダー */}
      <header className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 py-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {activeSkill?.name ?? "チャット"}
          </h2>
          {activeSkill?.description && (
            <p className="text-xs text-zinc-500 truncate">
              {activeSkill.description}
            </p>
          )}
        </div>
        <ProviderIndicator provider={provider} />
      </header>

      {/* メッセージ一覧 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {activeSkill?.name ?? "Skill Agent Chat"}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                {activeSkill?.description ??
                  "メッセージを入力して会話を始めましょう。"}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-zinc-500">考え中...</span>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* 入力欄 */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onStop={onStop}
      />
    </div>
  );
}
