"use client";

import Link from "next/link";
import { useStreakStore } from "@/stores/streakStore";
import { useEffect, useRef } from "react";
import { FEEDBACK } from "@/lib/feedback";

interface SessionCompleteProps {
  reviewed: number;
  correct: number;
  xpEarned: number;
  onBackToDashboard: () => void;
}

export default function SessionComplete({
  reviewed,
  correct,
  xpEarned,
  onBackToDashboard,
}: SessionCompleteProps) {
  const completeDailyPractice = useStreakStore((s) => s.completeDailyPractice);
  const addXp = useStreakStore((s) => s.addXp);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;
    completeDailyPractice();
    addXp(xpEarned);
  }, [completeDailyPractice, addXp, xpEarned]);

  const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;
  const streakMsg =
    FEEDBACK.streakMessages[
      currentStreak as keyof typeof FEEDBACK.streakMessages
    ];

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-10">
      <p className="text-5xl">🎉</p>
      <h2 className="text-2xl font-bold">{FEEDBACK.dailyComplete}</h2>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold">{reviewed}</p>
          <p className="text-xs text-muted">Karten</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold">{accuracy}%</p>
          <p className="text-xs text-muted">Genauigkeit</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-accent">+{xpEarned}</p>
          <p className="text-xs text-muted">XP</p>
        </div>
      </div>

      {streakMsg && (
        <p className="text-lg font-medium text-warning">{streakMsg}</p>
      )}

      <p className="text-muted">
        🔥 {currentStreak} Tage Streak
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBackToDashboard}
          className="flex-1 rounded-xl border border-border py-3 font-medium hover:bg-card transition-colors"
        >
          Zurück
        </button>
        <Link
          href="/story"
          className="flex-1 rounded-xl bg-primary py-3 font-medium text-white hover:bg-primary-hover transition-colors text-center"
        >
          Zur Geschichte
        </Link>
      </div>
    </div>
  );
}
