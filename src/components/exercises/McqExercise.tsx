"use client";

import { useState, useRef, useEffect } from "react";
import type { McqExercise as McqExerciseType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface McqExerciseProps {
  exercise: McqExerciseType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function McqExercise({ exercise, onAnswer }: McqExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const correct = index === exercise.correctIndex;
    onAnswer(correct, getElapsed(startTimeRef));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{exercise.question}</h3>

      <div className="grid gap-2">
        {exercise.options.map((option, i) => {
          let style = "border-border bg-card hover:bg-card-hover";
          if (answered) {
            if (i === exercise.correctIndex) {
              style = "border-success bg-success/10";
            } else if (i === selected) {
              style = "border-danger bg-danger/10";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`rounded-xl border p-4 text-left text-sm transition-colors ${style}`}
            >
              <span className="mr-2 text-muted">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {answered && selected !== null && (
        <ExerciseResult
          correct={selected === exercise.correctIndex}
          explanation={exercise.explanation}
          exerciseId={exercise.id}
        />
      )}
    </div>
  );
}
