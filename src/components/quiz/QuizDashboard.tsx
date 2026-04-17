"use client";

import { useMemo } from "react";
import { useQuizStore } from "@/stores/quizStore";
import CategoryFilter from "./CategoryFilter";

interface QuizDashboardProps {
  filter: string | null;
  onFilterChange: (category: string | null) => void;
  onStart: () => void;
  totalQuestions: number;
}

export default function QuizDashboard({
  filter,
  onFilterChange,
  onStart,
  totalQuestions,
}: QuizDashboardProps) {
  const getStats = useQuizStore((s) => s.getStats);
  const getDueCount = useQuizStore((s) => s.getDueCount);
  const cards = useQuizStore((s) => s.cards);

  const stats = useMemo(() => getStats(totalQuestions), [cards, getStats, totalQuestions]);
  const dueCount = useMemo(() => getDueCount(), [cards, getDueCount]);

  const masteredPct = Math.round((stats.mastered / stats.total) * 100);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="font-headline text-5xl font-black text-on-surface tracking-tighter mb-3">
          LiD Quiz
        </h1>
        <p className="font-body text-lg text-on-surface-variant">
          Alle 310 offizielle Fragen zum Leben in Deutschland Test.
        </p>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Bearbeitet" value={stats.attempted} sub={`/ ${stats.total}`} />
        <StatCard label="Gemeistert" value={stats.mastered} icon="check_circle" color="text-success" />
        <StatCard label="Schwach" value={stats.weak} icon="error" color="text-danger" />
        <StatCard label="Genauigkeit" value={`${stats.accuracy}%`} icon="target" />
      </section>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <QuizGauge percentage={masteredPct} />
      </div>

      {/* Category Filter */}
      <CategoryFilter selected={filter} onChange={onFilterChange} />

      {/* Start Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onStart}
          className="bg-primary text-white py-4 px-10 rounded-2xl font-headline font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-lg"
        >
          {dueCount > 0
            ? `Quiz starten (${dueCount} fällig)`
            : "Quiz starten"}
        </button>
        <p className="text-sm text-on-surface-variant font-body">
          10 Fragen pro Runde
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  color?: string;
}) {
  return (
    <div className="bg-surface p-5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <span
            className={`material-symbols-outlined text-lg ${color ?? "text-primary"}`}
          >
            {icon}
          </span>
        )}
        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-headline text-3xl font-black text-on-surface">
          {value}
        </span>
        {sub && (
          <span className="text-sm text-on-surface-variant font-body">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function QuizGauge({ percentage }: { percentage: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 176 176">
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="transparent"
          stroke="var(--surface-high)"
          strokeWidth="10"
        />
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="transparent"
          stroke="var(--primary)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-4xl font-black text-on-surface">
          {percentage}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
          Gemeistert
        </span>
      </div>
    </div>
  );
}
