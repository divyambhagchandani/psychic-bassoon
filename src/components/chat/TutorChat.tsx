"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/stores/chatStore";
import { TUTOR_EXPLAIN_SYSTEM_PROMPT } from "@/lib/prompts";
import MarkdownMessage from "./MarkdownMessage";

interface TutorChatProps {
  open: boolean;
  onToggle: () => void;
}

export default function TutorChat({ open, onToggle }: TutorChatProps) {
  const tabs = useChatStore((s) => s.tabs);
  const activeTabId = useChatStore((s) => s.activeTabId);
  const createTab = useChatStore((s) => s.createTab);
  const closeTab = useChatStore((s) => s.closeTab);
  const setActiveTab = useChatStore((s) => s.setActiveTab);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastMessage = useChatStore((s) => s.updateLastMessage);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTab?.messages]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onToggle();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onToggle]);

  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      if (!activeTab) return;
      const tabId = activeTab.id;
      const content = overrideContent ?? input.trim();
      if (!content || loading) return;

      if (!overrideContent) {
        addMessage(tabId, { role: "user", content });
        setInput("");
      }

      // Add empty assistant message for streaming
      addMessage(tabId, { role: "assistant", content: "" });
      setLoading(true);

      try {
        // Read fresh messages from the store to avoid stale closure
        const freshTab = useChatStore.getState().tabs.find((t) => t.id === tabId);
        const allMessages = freshTab?.messages ?? [];

        const body: Record<string, unknown> = {
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        };

        // Use explain prompt for explain-mode tabs
        if (activeTab.mode === "explain") {
          body.systemPrompt = TUTOR_EXPLAIN_SYSTEM_PROMPT;
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantContent += parsed.text;
                  updateLastMessage(tabId, assistantContent);
                }
              } catch {
                // skip non-JSON lines
              }
            }
          }
        }
      } catch {
        updateLastMessage(
          tabId,
          "Sorry, something went wrong. Please try again!",
        );
      } finally {
        setLoading(false);
      }
    },
    [activeTab, input, loading, addMessage, updateLastMessage],
  );

  // Auto-send for Ask Tutor tabs (tabs created with a pre-filled user message)
  useEffect(() => {
    if (!activeTab || !open || loading) return;
    const msgs = activeTab.messages;
    if (
      msgs.length === 1 &&
      msgs[0].role === "user" &&
      autoSentRef.current !== activeTab.id
    ) {
      autoSentRef.current = activeTab.id;
      sendMessage(msgs[0].content);
    }
  }, [activeTab, open, loading, sendMessage]);

  // Scroll active tab into view
  useEffect(() => {
    if (!tabBarRef.current || !activeTabId) return;
    const activeEl = tabBarRef.current.querySelector(
      `[data-tab-id="${activeTabId}"]`,
    );
    activeEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeTabId]);

  return (
    <>
      {/* FAB — hidden when panel is open */}
      {!open && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-colors"
          aria-label="Open Tutor"
        >
          <span className="material-symbols-outlined">forum</span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[39] bg-black/20"
              onClick={onToggle}
            />

            {/* Slide-out panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-[5.5rem] bottom-4 right-4 left-4 sm:left-auto z-40 flex w-auto sm:w-full sm:max-w-md flex-col bg-surface shadow-2xl rounded-[2rem]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/20 px-4 py-3">
                <h2 className="font-headline font-bold text-lg">Tutor Chat</h2>
                <button
                  onClick={onToggle}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-high hover:text-foreground transition-colors"
                  aria-label="Close Tutor Chat"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              {/* Tab bar */}
              <div
                ref={tabBarRef}
                className="flex items-center gap-0 overflow-x-auto border-b border-outline-variant/20 bg-surface-high/50 px-2 scrollbar-hide"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex shrink-0 items-center gap-1 px-3 py-2 text-xs transition-colors ${
                      tab.id === activeTabId
                        ? "border-b-2 border-primary font-semibold text-primary"
                        : "border-b-2 border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="max-w-[120px] truncate">{tab.label}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className={`ml-0.5 text-[14px] leading-none transition-opacity ${
                        tab.id === activeTabId
                          ? "text-muted hover:text-foreground opacity-60 hover:opacity-100"
                          : "opacity-0 group-hover:opacity-60 hover:!opacity-100"
                      }`}
                    >
                      ×
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => createTab()}
                  className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-high hover:text-foreground transition-colors"
                  aria-label="New chat tab"
                >
                  <span className="text-sm">+</span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {(!activeTab || activeTab.messages.length === 0) && (
                  <p className="text-center text-muted text-sm">
                    Ask me anything about German...
                  </p>
                )}
                {activeTab?.messages.map((msg, i) => (
                  <div
                    key={`${activeTab.id}-${i}`}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-white"
                          : "bg-surface-high text-foreground"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <MarkdownMessage content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-outline-variant/20 p-4">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && sendMessage()
                    }
                    placeholder="Ask me anything..."
                    className="flex-1 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-all active:scale-95"
                  >
                    {loading ? (
                      "..."
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">
                        send
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
