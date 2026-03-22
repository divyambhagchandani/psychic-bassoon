"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSRStore } from "@/stores/srStore";
import { useStreakStore } from "@/stores/streakStore";
import { FEEDBACK } from "@/lib/feedback";

interface DailyDashboardProps {
  onStartSession: () => void;
}

export default function DailyDashboard({ onStartSession }: DailyDashboardProps) {
  const cards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const dueCards = useMemo(() => getDueCards(), [cards, getDueCards]);
  const currentStreak = useStreakStore((s) => s.currentStreak);

  const schwachCount = dueCards.filter((c) => c.isSchwach).length;
  const normalCount = dueCards.filter((c) => !c.isSchwach && c.ease < 2.5).length;
  const starkCount = dueCards.filter((c) => !c.isSchwach && c.ease >= 2.5).length;

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
        <h2 className="text-xl font-headline font-bold">{FEEDBACK.noCardsDue}</h2>
        <p className="text-muted text-sm">
          Spiel ein Kapitel, um neue Karten zu bekommen
        </p>
        <Link
          href="/story"
          className="rounded-xl bg-primary px-6 py-2.5 font-headline font-bold text-white hover:bg-primary-hover active:scale-95 transition-all"
        >
          Zur Geschichte →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold">Tägliche Übung</h1>
        <p className="text-muted mt-1">
          {dueCards.length} Karten fällig · 🔥 {currentStreak} Tage Streak
        </p>
      </div>

      {/* Card breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface p-4 text-center shadow-sm">
          <span className="material-symbols-outlined text-error">warning</span>
          <p className="text-2xl font-headline font-bold text-danger">{schwachCount}</p>
          <p className="text-xs text-muted mt-1">Schwach</p>
        </div>
        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface p-4 text-center shadow-sm">
          <span className="material-symbols-outlined text-secondary">schedule</span>
          <p className="text-2xl font-headline font-bold text-warning">{normalCount}</p>
          <p className="text-xs text-muted mt-1">Fällig</p>
        </div>
        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface p-4 text-center shadow-sm">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <p className="text-2xl font-headline font-bold text-success">{starkCount}</p>
          <p className="text-xs text-muted mt-1">Stark</p>
        </div>
      </div>

      <button
        onClick={onStartSession}
        className="w-full rounded-xl bg-primary py-4 text-lg font-headline font-bold text-white hover:bg-primary-hover active:scale-95 transition-all"
      >
        Übung starten ({dueCards.length} Karten)
      </button>
    </div>
  );
}
