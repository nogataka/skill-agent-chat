"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { PreviewProvider } from "@/components/preview/preview-context";
import { PreviewPanel } from "@/components/preview/preview-panel";
import { useSkillChat } from "@/hooks/use-skill-chat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    skills,
    activeSkillId,
    switchSkill,
    providerInfo,
    resetChat,
    conversations,
    activeConversationId,
    loadConversation,
    deleteConversation,
  } = useSkillChat();

  const activeSkill = skills.find((s) => s.id === activeSkillId);

  return (
    <PreviewProvider>
      <div className="flex h-dvh overflow-hidden bg-white dark:bg-zinc-900">
        <Sidebar
          skills={skills}
          activeSkillId={activeSkillId}
          onSkillSelect={(id) => {
            switchSkill(id);
            setSidebarOpen(false);
          }}
          provider={providerInfo}
          onNewChat={resetChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={(id) => {
            loadConversation(id);
            setSidebarOpen(false);
          }}
          onConversationDelete={deleteConversation}
        />
        <ChatArea
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onStop={stop}
          provider={providerInfo}
          activeSkill={activeSkill}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <PreviewPanel />
      </div>
    </PreviewProvider>
  );
}
