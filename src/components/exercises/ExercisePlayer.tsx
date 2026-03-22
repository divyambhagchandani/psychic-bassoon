"use client";

import { useState } from "react";
import type { Exercise } from "@/types/content";
import McqExercise from "./McqExercise";
import FillBlankExercise from "./FillBlankExercise";
import SentenceBuildExercise from "./SentenceBuildExercise";
import MatchingExercise from "./MatchingExercise";
import ReadingExercise from "./ReadingExercise";
import BlitzExercise from "./BlitzExercise";
import { calculateExerciseXp } from "@/lib/xp";

export interface ExerciseAnswer {
  exerciseId: string;
  correct: boolean;
  timeTakenMs: number;
  xpEarned: number;
}

interface ExercisePlayerProps {
  exercises: Exercise[];
  onComplete: (answers: ExerciseAnswer[]) => void;
}

export default function ExercisePlayer({
  exercises,
  onComplete,
}: ExercisePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExerciseAnswer[]>([]);
  const [showNext, setShowNext] = useState(false);

  const currentExercise = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;

  const handleAnswer = (correct: boolean, timeTakenMs: number) => {
    const xp = calculateExerciseXp(currentExercise.type, correct, timeTakenMs);
    const answer: ExerciseAnswer = {
      exerciseId: currentExercise.id,
      correct,
      timeTakenMs,
      xpEarned: xp,
    };
    setAnswers((prev) => [...prev, answer]);
    setShowNext(true);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete([...answers]);
    } else {
      setCurrentIndex((i) => i + 1);
      setShowNext(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-surface-high overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + (showNext ? 1 : 0)) / exercises.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm text-muted">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      {/* Current exercise */}
      <div key={currentExercise.id}>
        {renderExercise(currentExercise, handleAnswer)}
      </div>

      {/* Next button */}
      {showNext && (
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-primary py-3 font-headline font-bold text-white hover:bg-primary-hover active:scale-95 transition-all"
        >
          {isLast ? "Ergebnisse ansehen →" : "Nächste Übung →"}
        </button>
      )}
    </div>
  );
}

function renderExercise(
  exercise: Exercise,
  onAnswer: (correct: boolean, timeTakenMs: number) => void
) {
  switch (exercise.type) {
    case "mcq":
      return <McqExercise exercise={exercise} onAnswer={onAnswer} />;
    case "fill-blank":
      return <FillBlankExercise exercise={exercise} onAnswer={onAnswer} />;
    case "sentence-build":
      return <SentenceBuildExercise exercise={exercise} onAnswer={onAnswer} />;
    case "matching":
      return <MatchingExercise exercise={exercise} onAnswer={onAnswer} />;
    case "reading":
      return <ReadingExercise exercise={exercise} onAnswer={onAnswer} />;
    case "blitz":
      return <BlitzExercise exercise={exercise} onAnswer={onAnswer} />;
    default:
      return <p className="text-muted">Unbekannter Übungstyp</p>;
  }
}
