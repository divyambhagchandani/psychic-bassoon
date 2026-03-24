import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState, ChatActions, ChatTab } from "@/types/store";

function makeTab(label = "New Chat", mode: ChatTab["mode"] = "chat"): ChatTab {
  return {
    id: crypto.randomUUID(),
    label,
    messages: [],
    mode,
    createdAt: new Date().toISOString(),
  };
}

const defaultTab = makeTab();

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      tabs: [defaultTab],
      activeTabId: defaultTab.id,
      chatOpen: false,

      createTab: (label?: string, mode: ChatTab["mode"] = "chat") => {
        const tab = makeTab(label, mode);
        set((s) => ({
          tabs: [...s.tabs, tab],
          activeTabId: tab.id,
        }));
        return tab.id;
      },

      closeTab: (tabId: string) => {
        const { tabs, activeTabId } = get();
        if (tabs.length <= 1) {
          // Last tab — replace with a fresh empty tab
          const fresh = makeTab();
          set({ tabs: [fresh], activeTabId: fresh.id });
          return;
        }
        const idx = tabs.findIndex((t) => t.id === tabId);
        const next = tabs.filter((t) => t.id !== tabId);
        const newActive =
          activeTabId === tabId
            ? next[Math.min(idx, next.length - 1)].id
            : activeTabId;
        set({ tabs: next, activeTabId: newActive });
      },

      setActiveTab: (tabId: string) => set({ activeTabId: tabId }),

      addMessage: (tabId, message) =>
        set((s) => ({
          tabs: s.tabs.map((t) =>
            t.id === tabId
              ? {
                  ...t,
                  messages: [...t.messages, message],
                  label:
                    t.label === "New Chat" && message.role === "user"
                      ? message.content.slice(0, 24).trim()
                      : t.label,
                }
              : t,
          ),
        })),

      updateLastMessage: (tabId, content) =>
        set((s) => ({
          tabs: s.tabs.map((t) => {
            if (t.id !== tabId) return t;
            const msgs = [...t.messages];
            if (msgs.length > 0) {
              msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
            }
            return { ...t, messages: msgs };
          }),
        })),

      setChatOpen: (open: boolean) => set({ chatOpen: open }),

      openWithPrompt: (userPrompt, mode = "explain") => {
        const tab = makeTab(userPrompt.slice(0, 24).trim(), mode);
        tab.messages = [{ role: "user", content: userPrompt }];
        set((s) => ({
          tabs: [...s.tabs, tab],
          activeTabId: tab.id,
          chatOpen: true,
        }));
      },
    }),
    {
      name: "berlin-leben-chat",
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    },
  ),
);
