"use client";

import Link from "next/link";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";
import { useProgressStore } from "@/stores/progressStore";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const { currentStreak, longestStreak, totalXp, todayXp, checkStreakStatus } =
    useStreakStore();
  const getLevel = useStreakStore((s) => s.getLevel);
  const cards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const getLidReadiness = useSRStore((s) => s.getLidReadiness);
  const chapterScores = useProgressStore((s) => s.chapterScores);
  const unlockedChapters = useProgressStore((s) => s.unlockedChapters);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    checkStreakStatus();
  }, [checkStreakStatus]);

  const dueCards = useMemo(() => getDueCards(), [cards, getDueCards]);
  const lidReadiness = useMemo(() => getLidReadiness(), [cards, getLidReadiness]);
  const completedChapters = Object.keys(chapterScores).length;
  const level = getLevel();

  if (!hydrated) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10" />
        <h1 className="font-headline text-6xl font-black text-on-surface tracking-tighter mb-4">
          Willkommen zurück!
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          Level {level} · {totalXp} XP gesamt · {todayXp} XP heute
        </p>
      </header>

      {/* Bento Grid */}
      <section className="grid grid-cols-12 gap-8">
        {/* LiD Readiness Gauge */}
        <div className="col-span-4 bg-surface p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
          <LidGauge percentage={lidReadiness} />
          <h3 className="font-headline text-lg font-bold mt-6 text-on-surface">
            LiD Readiness
          </h3>
        </div>

        {/* Streak Counter */}
        <div className="col-span-4 bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-[120px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-container">
              Lern-Serie
            </span>
            <h2 className="font-headline text-8xl font-black mt-4 leading-none tracking-tighter">
              {currentStreak}
            </h2>
          </div>
          <p className="font-body text-lg font-medium">
            {currentStreak === 1
              ? "Tag in Folge! Weiter so!"
              : "Tage in Folge! Bleib dran!"}
          </p>
        </div>

        {/* Daily Practice CTA */}
        <div className="col-span-4 bg-tertiary-container p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div>
            <div className="h-12 w-12 bg-white/30 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-tertiary">
                history_edu
              </span>
            </div>
            <h3 className="font-headline text-3xl font-black text-on-tertiary leading-tight mb-2">
              Tägliche Übung
            </h3>
            <p className="font-body text-sm text-on-tertiary/80">
              {dueCards.length > 0
                ? `${dueCards.length} Karten warten auf dich.`
                : "Alles erledigt für heute!"}
            </p>
          </div>
          {dueCards.length > 0 && (
            <Link
              href="/practice"
              className="bg-on-tertiary text-tertiary-container py-3 px-6 rounded-xl font-headline font-bold text-sm self-start hover:opacity-90 transition-all active:scale-95"
            >
              Jetzt starten
            </Link>
          )}
        </div>

        {/* Quiz CTA */}
        <Link
          href="/quiz"
          className="col-span-6 bg-surface p-8 rounded-[2rem] shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow overflow-hidden relative"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
          <div>
            <div className="h-12 w-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-secondary text-xl">
                quiz
              </span>
            </div>
            <h3 className="font-headline text-2xl font-black text-on-surface leading-tight mb-1">
              LiD Quiz
            </h3>
            <p className="font-body text-sm text-on-surface-variant">
              310 offizielle Prüfungsfragen
            </p>
          </div>
          <span className="material-symbols-outlined text-outline mt-4 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </Link>

        {/* Tutor Quick CTA */}
        <Link
          href="/tutor"
          className="col-span-6 bg-surface p-8 rounded-[2rem] shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow overflow-hidden relative"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-container/30 rounded-full blur-2xl" />
          <div>
            <div className="h-12 w-12 bg-primary-container rounded-xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-primary text-xl">
                forum
              </span>
            </div>
            <h3 className="font-headline text-2xl font-black text-on-surface leading-tight mb-1">
              KI-Tutor
            </h3>
            <p className="font-body text-sm text-on-surface-variant">
              Dein Tutor für Deutsch und den LiD Test.
            </p>
          </div>
          <span className="material-symbols-outlined text-outline mt-4 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </Link>

        {/* Story Banner */}
        <Link
          href="/story"
          className="col-span-12 relative group cursor-pointer overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1b3535] via-[#1b5555] to-primary flex items-center p-10"
        >
          <div className="relative z-10 w-full flex items-center justify-between">
            <div>
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Kapitel {completedChapters + 1} von 10
              </span>
              <h2 className="font-headline text-5xl font-black text-white tracking-tighter mb-2 leading-none">
                Story fortsetzen
              </h2>
              <p className="text-white/80 font-body text-lg">
                Tauche ein in dein Berliner Abenteuer.
              </p>
            </div>
            <span className="material-symbols-outlined text-white/40 text-6xl group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </div>
        </Link>

      </section>
    </div>
  );
}

function LidGauge({ percentage }: { percentage: number }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="var(--surface-high)"
          strokeWidth="12"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-5xl font-black text-on-surface">
          {percentage}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
          Readiness
        </span>
      </div>
    </div>
  );
}
