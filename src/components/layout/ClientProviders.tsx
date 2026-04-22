"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TutorChat from "@/components/chat/TutorChat";
import TranslateToast from "@/components/translate/TranslateToast";
import { useChatStore } from "@/stores/chatStore";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const chatOpen = useChatStore((s) => s.chatOpen);
  const setChatOpen = useChatStore((s) => s.setChatOpen);
  const pathname = usePathname();
  const isTutorPage = pathname === "/tutor";

  useEffect(() => {
    if (isTutorPage) setChatOpen(false);
  }, [isTutorPage, setChatOpen]);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8">
        {children}
      </main>
      {!isTutorPage && (
        <TutorChat open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      )}
      <TranslateToast />
    </>
  );
}
