"use client";

import { useState } from "react";
import { getRandomFeedback } from "@/lib/feedback";

interface ExerciseResultProps {
  correct: boolean;
  explanation: string;
  exerciseId: string;
}

export default function ExerciseResult({
  correct,
  explanation,
  exerciseId,
}: ExerciseResultProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleWarum = async () => {
    if (aiExplanation) {
      setShowExplanation((v) => !v);
      return;
    }

    setShowExplanation(true);
    setLoadingAi(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, explanation }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.explanation);
      }
    } catch {
      // Fall back to static explanation
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div
      className={`rounded-[2rem] border p-4 shadow-sm ${
        correct
          ? "border-success/30 bg-success/5"
          : "border-danger/30 bg-danger/5"
      }`}
    >
      <div className="flex items-center gap-2">
        {correct ? (
          <span className="material-symbols-outlined text-success" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        ) : (
          <span className="material-symbols-outlined text-danger" style={{fontVariationSettings: "'FILL' 1"}}>cancel</span>
        )}
        <p className="font-headline font-bold">
          {getRandomFeedback(correct)}
        </p>
      </div>

      {!correct && (
        <button
          onClick={handleWarum}
          className="mt-2 text-sm text-primary hover:text-primary-hover underline font-headline font-bold"
        >
          Warum?
        </button>
      )}

      {showExplanation && (
        <p className="mt-2 text-sm text-muted">
          {loadingAi ? "Denke nach..." : aiExplanation || explanation}
        </p>
      )}
    </div>
  );
}
