"use client";

import { useState, useRef, useEffect } from "react";
import type { ReadingExercise as ReadingType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface ReadingExerciseProps {
  exercise: ReadingType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

export default function ReadingExercise({
  exercise,
  onAnswer,
}: ReadingExerciseProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    exercise.questions.map(() => null)
  );
  const [submitted, setSubmitted] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIndex] = optionIndex;
      return updated;
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correctCount = exercise.questions.filter(
      (q, i) => answers[i] === q.correctIndex
    ).length;
    const allCorrect = correctCount === exercise.questions.length;
    onAnswer(allCorrect, getElapsed(startTimeRef));
  };

  const allAnswered = answers.every((a) => a !== null);
  const question = exercise.questions[currentQ];

  return (
    <div className="space-y-4">
      {/* Passage */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {exercise.passage}
        </p>
      </div>

      {/* Question navigator */}
      <div className="flex gap-2">
        {exercise.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
              currentQ === i
                ? "bg-primary text-white"
                : submitted
                  ? answers[i] === exercise.questions[i].correctIndex
                    ? "bg-success/20 text-success"
                    : "bg-danger/20 text-danger"
                  : answers[i] !== null
                    ? "bg-accent/20 text-accent"
                    : "bg-card text-muted"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current question */}
      <div className="space-y-2">
        <p className="font-medium">{question.question}</p>
        {question.options.map((opt, i) => {
          let style = "border-border bg-card hover:bg-card-hover";
          if (submitted) {
            if (i === question.correctIndex) {
              style = "border-success bg-success/10";
            } else if (i === answers[currentQ]) {
              style = "border-danger bg-danger/10";
            }
          } else if (i === answers[currentQ]) {
            style = "border-primary bg-primary/10";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(currentQ, i)}
              disabled={submitted}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted && allAnswered && (
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Antworten prüfen
        </button>
      )}

      {submitted && (
        <ExerciseResult
          correct={exercise.questions.every(
            (q, i) => answers[i] === q.correctIndex
          )}
          explanation={exercise.explanation}
          exerciseId={exercise.id}
        />
      )}
    </div>
  );
}
