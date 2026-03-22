"use client";

import { useState } from "react";
import Link from "next/link";
import type { Chapter } from "@/types/content";
import StoryReader from "./StoryReader";
import VocabPreview from "./VocabPreview";
import ChapterResults from "./ChapterResults";
import ExercisePlayer, { type ExerciseAnswer } from "@/components/exercises/ExercisePlayer";
import BlitzExercise from "@/components/exercises/BlitzExercise";

type Phase = "story" | "vocab" | "exercises" | "results" | "blitz" | "done";

interface ChapterFlowProps {
  chapter: Chapter;
}

export default function ChapterFlow({ chapter }: ChapterFlowProps) {
  const [phase, setPhase] = useState<Phase>("story");
  const [exerciseAnswers, setExerciseAnswers] = useState<ExerciseAnswer[]>([]);
  const [blitzIndex, setBlitzIndex] = useState(0);
  const [blitzAnswers, setBlitzAnswers] = useState<ExerciseAnswer[]>([]);

  const handleExercisesComplete = (answers: ExerciseAnswer[]) => {
    setExerciseAnswers(answers);
    setPhase("results");
  };

  const handleBlitzAnswer = (correct: boolean, timeTakenMs: number) => {
    const blitzQ = chapter.blitzQuestions[blitzIndex];
    setBlitzAnswers((prev) => [
      ...prev,
      {
        exerciseId: blitzQ.id,
        correct,
        timeTakenMs,
        xpEarned: correct ? (timeTakenMs < 5000 ? 15 : 10) : 0,
      },
    ]);
    setTimeout(() => {
      if (blitzIndex < chapter.blitzQuestions.length - 1) {
        setBlitzIndex((i) => i + 1);
      } else {
        setPhase("done");
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Phase header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">
          Kapitel {chapter.number}: {chapter.title}
        </h1>
        <PhaseIndicator current={phase} />
      </div>

      {phase === "story" && (
        <div className="space-y-6">
          <StoryReader story={chapter.story} vocab={chapter.vocab} />
          <button
            onClick={() => setPhase("vocab")}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Neue Vokabeln lernen →
          </button>
        </div>
      )}

      {phase === "vocab" && (
        <VocabPreview
          vocab={chapter.vocab}
          onContinue={() => setPhase("exercises")}
        />
      )}

      {phase === "exercises" && (
        <ExercisePlayer
          exercises={chapter.exercises}
          onComplete={handleExercisesComplete}
        />
      )}

      {phase === "results" && (
        <ChapterResults
          chapter={chapter}
          answers={exerciseAnswers}
          onStartBlitz={() => setPhase("blitz")}
        />
      )}

      {phase === "blitz" && chapter.blitzQuestions[blitzIndex] && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Blitz-Runde! ⚡</h2>
            <span className="text-sm text-muted">
              {blitzIndex + 1}/{chapter.blitzQuestions.length}
            </span>
          </div>
          <BlitzExercise
            key={chapter.blitzQuestions[blitzIndex].id}
            exercise={chapter.blitzQuestions[blitzIndex]}
            onAnswer={handleBlitzAnswer}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Kapitel abgeschlossen! 🎉</h2>
          <p className="text-muted">
            Blitz: {blitzAnswers.filter((a) => a.correct).length}/
            {blitzAnswers.length} richtig
          </p>
          <Link
            href="/story"
            className="inline-block rounded-xl bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Zurück zur Übersicht
          </Link>
        </div>
      )}
    </div>
  );
}

function PhaseIndicator({ current }: { current: Phase }) {
  const phases: { key: Phase; label: string }[] = [
    { key: "story", label: "Geschichte" },
    { key: "vocab", label: "Vokabeln" },
    { key: "exercises", label: "Übungen" },
    { key: "results", label: "Ergebnisse" },
    { key: "blitz", label: "Blitz" },
  ];

  const currentIdx = phases.findIndex((p) => p.key === current);

  return (
    <div className="mt-3 flex gap-1">
      {phases.map((p, i) => (
        <div
          key={p.key}
          className={`h-1 flex-1 rounded-full ${
            i <= currentIdx ? "bg-primary" : "bg-border"
          }`}
          title={p.label}
        />
      ))}
    </div>
  );
}
