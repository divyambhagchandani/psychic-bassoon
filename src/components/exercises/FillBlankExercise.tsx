"use client";

import { useState, useRef, useEffect } from "react";
import type { FillBlankExercise as FillBlankType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface FillBlankExerciseProps {
  exercise: FillBlankType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function FillBlankExercise({
  exercise,
  onAnswer,
}: FillBlankExerciseProps) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const handleSubmit = () => {
    if (answered || !input.trim()) return;

    const trimmed = input.trim().toLowerCase();
    const isCorrect =
      trimmed === exercise.answer.toLowerCase() ||
      (exercise.acceptAlternatives?.some(
        (alt) => trimmed === alt.toLowerCase()
      ) ??
        false);

    setCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect, getElapsed(startTimeRef));
  };

  // Split sentence around ___
  const parts = exercise.sentence.split("___");

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">
        {parts[0]}
        <span className="inline-block min-w-[120px] mx-1">
          {answered ? (
            <span
              className={`font-semibold ${
                correct ? "text-success" : "text-danger"
              }`}
            >
              {correct ? input : `${input} → ${exercise.answer}`}
            </span>
          ) : (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="..."
              className="w-full border-b-2 border-primary bg-transparent px-1 py-0.5 text-center text-foreground focus:outline-none"
              autoFocus
            />
          )}
        </span>
        {parts[1]}
      </div>

      {exercise.hint && !answered && (
        <p className="text-sm text-muted">💡 Hinweis: {exercise.hint}</p>
      )}

      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="rounded-xl bg-primary px-6 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          Prüfen
        </button>
      )}

      {answered && (
        <ExerciseResult
          correct={correct}
          explanation={exercise.explanation}
          exerciseId={exercise.id}
        />
      )}
    </div>
  );
}
