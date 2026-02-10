"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Skill, ProviderInfo, Conversation } from "@/types";

function generateId() {
  return crypto.randomUUID();
}

export function useSkillChat() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeSkillId, setActiveSkillId] = useState("default");
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef(input);
  inputRef.current = input;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Pre-generate ID for new chats so chatId stays stable
  const pendingIdRef = useRef(generateId());

  // The chatId is either the active conversation or the pending new one
  const chatId = activeConversationId ?? pendingIdRef.current;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { skillId: activeSkillId },
      }),
    [activeSkillId]
  );

  // Ref to track conversation id for onFinish (avoids stale closure)
  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;
  // Pending messages to apply after chatId changes
  const pendingMessagesRef = useRef<UIMessage[] | null>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  }, []);

  const onFinish = useCallback(
    async ({ messages: allMessages }: { messages: UIMessage[] }) => {
      const convId = activeConversationIdRef.current;
      if (!convId) return;

      try {
        await fetch(`/api/conversations/${convId}/messages`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages }),
        });
        refreshConversations();
      } catch (e) {
        console.error("Failed to save messages:", e);
      }
    },
    [refreshConversations]
  );

  const chat = useChat({ transport, id: chatId, onFinish });

  // Apply pending messages after chatId changes and chat instance is ready
  useEffect(() => {
    if (pendingMessagesRef.current) {
      chat.setMessages(pendingMessagesRef.current);
      pendingMessagesRef.current = null;
    }
  }, [chatId, chat]);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.skills);
        setProviderInfo(data.provider);
      })
      .catch(console.error);
  }, []);

  // Load conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const switchSkill = useCallback(
    (skillId: string) => {
      setActiveSkillId(skillId);
      setActiveConversationId(null);
      pendingIdRef.current = generateId();
      chat.setMessages([]);
      setInput("");
    },
    [chat]
  );

  const resetChat = useCallback(() => {
    setActiveConversationId(null);
    pendingIdRef.current = generateId();
    chat.setMessages([]);
    setInput("");
  }, [chat]);

  const handleSubmit = useCallback(async () => {
    const text = inputRef.current.trim();
    if (!text) return;

    // If no active conversation, create one first
    if (!activeConversationIdRef.current) {
      const newId = pendingIdRef.current;
      const title = text.length > 50 ? text.slice(0, 50) + "..." : text;
      try {
        await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newId,
            skillId: activeSkillId,
            title,
          }),
        });
        setActiveConversationId(newId);
        activeConversationIdRef.current = newId;
        refreshConversations();
      } catch (e) {
        console.error("Failed to create conversation:", e);
        return;
      }
    }

    setInput("");
    chat.sendMessage({ text });
  }, [chat, activeSkillId, refreshConversations]);

  const loadConversation = useCallback(
    async (id: string) => {
      // If already viewing this conversation, do nothing
      if (activeConversationIdRef.current === id) return;

      try {
        const res = await fetch(`/api/conversations/${id}/messages`);
        const msgs = await res.json();
        // Store messages in ref — they'll be applied after re-render
        // when chatId has switched to the new id
        pendingMessagesRef.current = msgs;
        setActiveConversationId(id);
        activeConversationIdRef.current = id;
        setInput("");
      } catch (e) {
        console.error("Failed to load conversation:", e);
      }
    },
    []
  );

  const deleteConversationById = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/conversations/${id}`, { method: "DELETE" });
        // If deleting the active conversation, reset to new chat
        if (activeConversationIdRef.current === id) {
          setActiveConversationId(null);
          pendingIdRef.current = generateId();
          chat.setMessages([]);
          setInput("");
        }
        refreshConversations();
      } catch (e) {
        console.error("Failed to delete conversation:", e);
      }
    },
    [chat, refreshConversations]
  );

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  return {
    messages: chat.messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop: chat.stop,
    status: chat.status,
    error: chat.error,
    setMessages: chat.setMessages,
    skills,
    activeSkillId,
    switchSkill,
    providerInfo,
    resetChat,
    conversations,
    activeConversationId,
    loadConversation,
    deleteConversation: deleteConversationById,
  };
}
