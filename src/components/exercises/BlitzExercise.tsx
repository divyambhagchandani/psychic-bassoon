"use client";

import { useState, useEffect, useRef } from "react";
import type { BlitzExercise as BlitzType } from "@/types/content";

interface BlitzExerciseProps {
  exercise: BlitzType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function BlitzExercise({
  exercise,
  onAnswer,
}: BlitzExerciseProps) {
  const [timeLeft, setTimeLeft] = useState(exercise.timeLimitSeconds);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up
          if (!answered) {
            setAnswered(true);
            onAnswer(false, exercise.timeLimitSeconds * 1000);
          }
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const correct = index === exercise.correctIndex;
    onAnswer(correct, Date.now() - startTimeRef.current);
  };

  const timerColor =
    timeLeft <= 3 ? "text-danger" : timeLeft <= 5 ? "text-warning" : "text-foreground";

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{exercise.question}</h3>
        <span className={`text-2xl font-bold ${timerColor}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 rounded-full bg-card overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            timeLeft <= 3 ? "bg-danger" : timeLeft <= 5 ? "bg-warning" : "bg-primary"
          }`}
          style={{
            width: `${(timeLeft / exercise.timeLimitSeconds) * 100}%`,
          }}
        />
      </div>

      {/* Options */}
      <div className="grid gap-2 sm:grid-cols-2">
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
              {option}
            </button>
          );
        })}
      </div>

      {answered && timeLeft === 0 && selected === null && (
        <p className="text-center text-danger font-semibold">
          Zeit abgelaufen! ⏰
        </p>
      )}
    </div>
  );
}
