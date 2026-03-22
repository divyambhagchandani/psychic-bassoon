"use client";

import Link from "next/link";
import { useProgressStore } from "@/stores/progressStore";

const CHAPTERS = Array.from({ length: 10 }, (_, i) => ({
  id: `chapter-${i + 1}`,
  number: i + 1,
  title: [
    "Willkommen in Berlin",
    "Das Bürgeramt",
    "Im Krankenhaus",
    "Schule und Bildung",
    "Demokratie verstehen",
    "Arbeit und Soziales",
    "Geschichte Berlins",
    "Kultur und Freizeit",
    "Rechte und Pflichten",
    "Leben in Deutschland",
  ][i],
}));

export default function ChapterMap() {
  const unlockedChapters = useProgressStore((s) => s.unlockedChapters);
  const chapterScores = useProgressStore((s) => s.chapterScores);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Geschichte</h1>
        <p className="text-muted mt-1">10 Kapitel durch Berlin</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CHAPTERS.map((ch) => {
          const unlocked = unlockedChapters.includes(ch.id);
          const score = chapterScores[ch.id];

          return (
            <div key={ch.id}>
              {unlocked ? (
                <Link
                  href={`/story/${ch.id}`}
                  className="block rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted uppercase">
                        Kapitel {ch.number}
                      </p>
                      <p className="mt-1 font-semibold">{ch.title}</p>
                    </div>
                    {score ? (
                      <span
                        className={`text-sm font-bold ${
                          score.score >= 70 ? "text-success" : "text-warning"
                        }`}
                      >
                        {score.score}%
                      </span>
                    ) : (
                      <span className="text-primary text-sm">Starten →</span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 p-5 opacity-50">
                  <p className="text-xs text-muted uppercase">
                    Kapitel {ch.number}
                  </p>
                  <p className="mt-1 font-semibold">{ch.title}</p>
                  <p className="text-xs text-muted mt-1">🔒 Gesperrt</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
