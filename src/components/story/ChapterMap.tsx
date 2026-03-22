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
                  className="block rounded-[2rem] bg-surface shadow-sm p-5 hover:shadow-md transition-shadow"
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
                        className={`text-sm font-headline font-bold ${
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
                <div className="rounded-[2rem] bg-surface-high opacity-60 p-5">
                  <p className="text-xs text-muted uppercase">
                    Kapitel {ch.number}
                  </p>
                  <p className="mt-1 font-semibold">{ch.title}</p>
                  <p className="text-xs text-muted mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: "1rem" }}>lock</span>
                    Gesperrt
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
