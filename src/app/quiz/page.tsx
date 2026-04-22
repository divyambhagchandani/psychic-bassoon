"use client";

import { useState, useEffect, useMemo } from "react";
import type { LidQuestion } from "@/types/content";
import { useQuizStore } from "@/stores/quizStore";
import QuizDashboard from "@/components/quiz/QuizDashboard";
import QuizSession, { type SessionResult } from "@/components/quiz/QuizSession";
import QuizResults from "@/components/quiz/QuizResults";

type Phase = "dashboard" | "session" | "results";

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("dashboard");
  const [filter, setFilter] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<LidQuestion[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<LidQuestion[]>([]);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const getNextQuestions = useQuizStore((s) => s.getNextQuestions);
  const cards = useQuizStore((s) => s.cards);

  // Load questions
  useEffect(() => {
    import("@/content/lid-questions.json").then((mod) => {
      setAllQuestions(mod.default as unknown as LidQuestion[]);
    });
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const filteredQuestions = useMemo(
    () =>
      filter
        ? allQuestions.filter((q) => q.category === filter)
        : allQuestions,
    [allQuestions, filter]
  );

  const startSession = () => {
    const next = getNextQuestions(filteredQuestions, 10);
    if (next.length === 0) return;
    setSessionQuestions(next);
    setPhase("session");
  };

  const handleComplete = (result: SessionResult) => {
    setSessionResult(result);
    setPhase("results");
  };

  const handleContinue = () => {
    startSession();
  };

  const handleDashboard = () => {
    setPhase("dashboard");
    setSessionResult(null);
  };

  if (!hydrated || allQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-on-surface-variant font-body">Laden…</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {phase === "dashboard" && (
        <QuizDashboard
          filter={filter}
          onFilterChange={setFilter}
          onStart={startSession}
          totalQuestions={allQuestions.length}
        />
      )}

      {phase === "session" && (
        <QuizSession
          questions={sessionQuestions}
          onComplete={handleComplete}
          onQuit={handleDashboard}
        />
      )}

      {phase === "results" && sessionResult && (
        <QuizResults
          result={sessionResult}
          onContinue={handleContinue}
          onDashboard={handleDashboard}
        />
      )}
    </div>
  );
}
