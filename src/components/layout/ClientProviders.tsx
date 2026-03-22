"use client";

import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import TutorChat from "@/components/chat/TutorChat";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
      <TutorChat open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
    </>
  );
}
