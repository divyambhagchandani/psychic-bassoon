"use client";

import type { Chapter, Exercise } from "@/types/content";
import type { ExerciseAnswer } from "@/components/exercises/ExercisePlayer";
import { useProgressStore } from "@/stores/progressStore";
import { useSRStore } from "@/stores/srStore";
import { useStreakStore } from "@/stores/streakStore";
import { calculateChapterXp } from "@/lib/xp";
import { FEEDBACK } from "@/lib/feedback";
import { useEffect, useRef } from "react";
import type { SRCard } from "@/types/sr";

interface ChapterResultsProps {
  chapter: Chapter;
  answers: ExerciseAnswer[];
  onStartBlitz: () => void;
}

export default function ChapterResults({
  chapter,
  answers,
  onStartBlitz,
}: ChapterResultsProps) {
  const recordChapterScore = useProgressStore((s) => s.recordChapterScore);
  const addCard = useSRStore((s) => s.addCard);
  const addXp = useStreakStore((s) => s.addXp);
  const processedRef = useRef(false);

  const correctCount = answers.filter((a) => a.correct).length;
  const totalExercises = answers.length;
  const score = Math.round((correctCount / totalExercises) * 100);
  const exerciseXp = answers.reduce((sum, a) => sum + a.xpEarned, 0);
  const chapterXp = calculateChapterXp(correctCount, totalExercises);
  const totalXp = exerciseXp + chapterXp;
  const passed = score >= 70;

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    // Record score and unlock
    recordChapterScore({
      chapterId: chapter.id,
      score,
      totalExercises,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
    });

    // Add XP
    addXp(totalXp);

    // Create SR cards for wrong answers
    const wrongAnswers = answers.filter((a) => !a.correct);
    for (const wrong of wrongAnswers) {
      const exercise = chapter.exercises.find(
        (e) => e.id === wrong.exerciseId
      );
      if (!exercise) continue;

      const card: SRCard = {
        id: `sr-${chapter.id}-${exercise.id}`,
        front: getCardFront(exercise),
        back: getCardBack(exercise),
        tags: exercise.tags,
        sourceChapter: chapter.id,
        sourceExerciseId: exercise.id,
        interval: 1,
        ease: 2.5,
        correctStreak: 0,
        nextReview: new Date().toISOString().split("T")[0],
        isSchwach: true,
      };
      addCard(card);
    }
  }, [chapter, answers, score, correctCount, totalExercises, totalXp, recordChapterScore, addCard, addXp]);

  return (
    <div className="space-y-6 text-center">
      {/* Score circle */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border-4 text-3xl font-bold ${
            passed
              ? "border-success text-success"
              : "border-danger text-danger"
          }`}
        >
          {score}%
        </div>
        <p className="mt-3 font-semibold text-lg">
          {score === 100
            ? FEEDBACK.chapterPerfect
            : passed
              ? FEEDBACK.chapterComplete
              : "Weiter üben!"}
        </p>
        <p className="text-muted text-sm">
          {correctCount}/{totalExercises} richtig · +{totalXp} XP
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted">Übungs-XP</p>
          <p className="text-lg font-bold">+{exerciseXp}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted">Kapitel-Bonus</p>
          <p className="text-lg font-bold">+{chapterXp}</p>
        </div>
      </div>

      {/* Unlock notification */}
      {passed && (
        <p className="text-success font-medium">{FEEDBACK.unlockNext}</p>
      )}

      {/* Wrong answers added to SR */}
      {answers.filter((a) => !a.correct).length > 0 && (
        <p className="text-sm text-muted">
          {answers.filter((a) => !a.correct).length} Karten zur
          Wiederholung hinzugefügt
        </p>
      )}

      {/* Blitz button */}
      <button
        onClick={onStartBlitz}
        className="w-full rounded-xl bg-accent py-3 font-semibold text-white hover:opacity-90 transition-opacity"
      >
        Blitz-Runde starten ⚡
      </button>
    </div>
  );
}

function getCardFront(exercise: Exercise): string {
  switch (exercise.type) {
    case "mcq":
      return exercise.question;
    case "fill-blank":
      return exercise.sentence;
    case "sentence-build":
      return exercise.prompt;
    case "matching":
      return exercise.pairs.map((p) => p.left).join(", ");
    case "reading":
      return exercise.passage.slice(0, 80) + "...";
    case "blitz":
      return exercise.question;
  }
}

function getCardBack(exercise: Exercise): string {
  switch (exercise.type) {
    case "mcq":
      return exercise.options[exercise.correctIndex];
    case "fill-blank":
      return exercise.answer;
    case "sentence-build":
      return exercise.correctOrder.join(" ");
    case "matching":
      return exercise.pairs.map((p) => `${p.left} → ${p.right}`).join(", ");
    case "reading":
      return exercise.explanation;
    case "blitz":
      return exercise.options[exercise.correctIndex];
  }
}
