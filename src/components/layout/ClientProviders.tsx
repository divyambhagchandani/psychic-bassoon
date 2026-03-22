"use client";

import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import TutorChat from "@/components/chat/TutorChat";
import TranslateToast from "@/components/translate/TranslateToast";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-8">
        {children}
      </main>
      <TutorChat open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
      <TranslateToast />
    </>
  );
}
