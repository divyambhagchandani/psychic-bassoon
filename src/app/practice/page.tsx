"use client";

import { useState } from "react";
import DailyDashboard from "@/components/practice/DailyDashboard";
import PracticeSession from "@/components/practice/PracticeSession";
import SessionComplete from "@/components/practice/SessionComplete";

type PracticePhase = "dashboard" | "session" | "complete";

export default function PracticePage() {
  const [phase, setPhase] = useState<PracticePhase>("dashboard");
  const [sessionResults, setSessionResults] = useState<{
    reviewed: number;
    correct: number;
    xpEarned: number;
  } | null>(null);

  return (
    <div>
      {phase === "dashboard" && (
        <DailyDashboard onStartSession={() => setPhase("session")} />
      )}

      {phase === "session" && (
        <PracticeSession
          onComplete={(results) => {
            setSessionResults(results);
            setPhase("complete");
          }}
        />
      )}

      {phase === "complete" && sessionResults && (
        <SessionComplete
          reviewed={sessionResults.reviewed}
          correct={sessionResults.correct}
          xpEarned={sessionResults.xpEarned}
          onBackToDashboard={() => {
            setPhase("dashboard");
            setSessionResults(null);
          }}
        />
      )}
    </div>
  );
}
