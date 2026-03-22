"use client";

import Link from "next/link";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";
import { useProgressStore } from "@/stores/progressStore";
import { useEffect } from "react";

export default function Dashboard() {
  const { currentStreak, longestStreak, totalXp, todayXp, checkStreakStatus } =
    useStreakStore();
  const getLevel = useStreakStore((s) => s.getLevel);
  const dueCards = useSRStore((s) => s.getDueCards());
  const lidReadiness = useSRStore((s) => s.getLidReadiness());
  const chapterScores = useProgressStore((s) => s.chapterScores);
  const unlockedChapters = useProgressStore((s) => s.unlockedChapters);

  useEffect(() => {
    checkStreakStatus();
  }, [checkStreakStatus]);

  const completedChapters = Object.keys(chapterScores).length;
  const level = getLevel();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Willkommen zurück!</h1>
        <p className="text-muted mt-1">
          Level {level} · {totalXp} XP gesamt · {todayXp} XP heute
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Streak" value={`🔥 ${currentStreak}`} sub={`Rekord: ${longestStreak}`} />
        <StatCard
          label="Fällige Karten"
          value={String(dueCards.length)}
          sub={dueCards.length > 0 ? "Jetzt üben!" : "Alles erledigt"}
          highlight={dueCards.length > 0}
        />
        <StatCard
          label="LiD-Bereitschaft"
          value={`${lidReadiness}%`}
          sub="Leben in Deutschland"
        />
        <StatCard
          label="Kapitel"
          value={`${completedChapters}/10`}
          sub={`${unlockedChapters.length} freigeschaltet`}
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {dueCards.length > 0 && (
          <Link
            href="/practice"
            className="flex items-center gap-4 rounded-xl border border-warning/30 bg-warning/5 p-5 hover:bg-warning/10 transition-colors"
          >
            <span className="text-3xl">📝</span>
            <div>
              <h3 className="font-semibold">Tägliche Übung</h3>
              <p className="text-sm text-muted">
                {dueCards.length} Karten warten auf dich
              </p>
            </div>
          </Link>
        )}

        <Link
          href="/story"
          className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors"
        >
          <span className="text-3xl">📖</span>
          <div>
            <h3 className="font-semibold">Geschichte fortsetzen</h3>
            <p className="text-sm text-muted">
              Kapitel {completedChapters + 1} von 10
            </p>
          </div>
        </Link>

        <Link
          href="/tutor"
          className="flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5 hover:bg-accent/10 transition-colors"
        >
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-semibold">Mit dem Tutor sprechen</h3>
            <p className="text-sm text-muted">
              Frag auf Deutsch!
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-warning/30 bg-warning/5"
          : "border-border bg-card"
      }`}
    >
      <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted mt-0.5">{sub}</p>
    </div>
  );
}
