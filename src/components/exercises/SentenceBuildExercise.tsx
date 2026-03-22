"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Reorder } from "framer-motion";
import type { SentenceBuildExercise as SentenceBuildType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface SentenceBuildExerciseProps {
  exercise: SentenceBuildType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function SentenceBuildExercise({
  exercise,
  onAnswer,
}: SentenceBuildExerciseProps) {
  const allWords = shuffle([
    ...exercise.correctOrder,
    ...(exercise.distractors || []),
  ]);
  const [available, setAvailable] = useState<string[]>(allWords);
  const [selected, setSelected] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const addWord = (word: string) => {
    if (answered) return;
    setSelected((prev) => [...prev, word]);
    setAvailable((prev) => {
      const idx = prev.indexOf(word);
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const removeWord = (word: string) => {
    if (answered) return;
    setAvailable((prev) => [...prev, word]);
    setSelected((prev) => {
      const idx = prev.indexOf(word);
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const handleCheck = () => {
    if (answered || selected.length === 0) return;
    const isCorrect =
      selected.length === exercise.correctOrder.length &&
      selected.every((w, i) => w === exercise.correctOrder[i]);
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect, getElapsed(startTimeRef));
  };

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      if (!answered) setSelected(newOrder);
    },
    [answered]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Bilde den Satz: <span className="text-muted font-normal">{exercise.prompt}</span>
      </h3>

      {/* Selected words (reorderable) */}
      <div className="min-h-[56px] rounded-xl border border-border bg-card p-3">
        {selected.length === 0 ? (
          <p className="text-muted text-sm">Tippe auf die Wörter unten...</p>
        ) : (
          <Reorder.Group
            axis="x"
            values={selected}
            onReorder={handleReorder}
            className="flex flex-wrap gap-2"
          >
            {selected.map((word) => (
              <Reorder.Item
                key={word}
                value={word}
                className={`cursor-grab rounded-lg px-3 py-1.5 text-sm font-medium ${
                  answered
                    ? correct
                      ? "bg-success/20 text-success"
                      : "bg-danger/20 text-danger"
                    : "bg-primary/20 text-primary"
                }`}
                onClick={() => removeWord(word)}
              >
                {word}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => addWord(word)}
            disabled={answered}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-card-hover transition-colors disabled:opacity-50"
          >
            {word}
          </button>
        ))}
      </div>

      {answered && !correct && (
        <p className="text-sm text-muted">
          Richtige Antwort: {exercise.correctOrder.join(" ")}
        </p>
      )}

      {!answered && selected.length > 0 && (
        <button
          onClick={handleCheck}
          className="rounded-xl bg-primary px-6 py-2.5 font-medium text-white hover:bg-primary-hover transition-colors"
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

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
