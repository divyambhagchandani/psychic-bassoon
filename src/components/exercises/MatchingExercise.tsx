"use client";

import { useState, useRef, useEffect } from "react";
import type { MatchingExercise as MatchingType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface MatchingExerciseProps {
  exercise: MatchingType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function MatchingExercise({
  exercise,
  onAnswer,
}: MatchingExerciseProps) {
  const [shuffledRight] = useState(() =>
    shuffle(exercise.pairs.map((p) => p.right))
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const handleLeftClick = (index: number) => {
    if (answered) return;
    setSelectedLeft(index === selectedLeft ? null : index);
  };

  const handleRightClick = (rightIndex: number) => {
    if (answered || selectedLeft === null) return;

    const newMatches = new Map(matches);
    // Remove any existing match for this left or right
    for (const [l, r] of newMatches) {
      if (l === selectedLeft || r === rightIndex) {
        newMatches.delete(l);
      }
    }
    newMatches.set(selectedLeft, rightIndex);
    setMatches(newMatches);
    setSelectedLeft(null);

    // Auto-check when all pairs matched
    if (newMatches.size === exercise.pairs.length) {
      const allCorrect = exercise.pairs.every((pair, leftIdx) => {
        const matchedRightIdx = newMatches.get(leftIdx);
        if (matchedRightIdx === undefined) return false;
        return shuffledRight[matchedRightIdx] === pair.right;
      });
      setCorrect(allCorrect);
      setAnswered(true);
      onAnswer(allCorrect, getElapsed(startTimeRef));
    }
  };

  const isLeftMatched = (index: number) => matches.has(index);
  const isRightMatched = (index: number) =>
    Array.from(matches.values()).includes(index);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Verbinde die Paare</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {exercise.pairs.map((pair, i) => (
            <button
              key={`l-${i}`}
              onClick={() => handleLeftClick(i)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                answered
                  ? correct || matches.get(i) !== undefined
                    ? shuffledRight[matches.get(i)!] === pair.right
                      ? "border-success bg-success/10"
                      : "border-danger bg-danger/10"
                    : "border-border bg-card"
                  : selectedLeft === i
                    ? "border-primary bg-primary/10"
                    : isLeftMatched(i)
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card hover:bg-card-hover"
              }`}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map((right, i) => (
            <button
              key={`r-${i}`}
              onClick={() => handleRightClick(i)}
              disabled={answered || selectedLeft === null}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                isRightMatched(i)
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:bg-card-hover"
              } disabled:cursor-default`}
            >
              {right}
            </button>
          ))}
        </div>
      </div>

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
