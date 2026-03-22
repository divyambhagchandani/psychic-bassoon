"use client";

import { useState, useMemo } from "react";
import { useSRStore, mapAnswerToQuality } from "@/stores/srStore";
import { useStreakStore } from "@/stores/streakStore";
import { XP_VALUES } from "@/lib/xp";
import type { SRCard } from "@/types/sr";

interface PracticeSessionProps {
  onComplete: (results: {
    reviewed: number;
    correct: number;
    xpEarned: number;
  }) => void;
}

export default function PracticeSession({ onComplete }: PracticeSessionProps) {
  const srCards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const dueCards = useMemo(() => getDueCards(), [srCards, getDueCards]);
  const reviewCard = useSRStore((s) => s.reviewCard);
  const addXp = useStreakStore((s) => s.addXp);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; xp: number }[]>([]);
  const [cards] = useState<SRCard[]>(dueCards); // snapshot at start

  const currentCard = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;

  if (!currentCard) {
    return <p className="text-muted text-center py-20">Keine Karten fällig</p>;
  }

  const handleAnswer = (correct: boolean) => {
    const quality = mapAnswerToQuality(correct, "practice");
    reviewCard(currentCard.id, quality);

    const xp = correct ? 10 : 0;
    if (xp > 0) addXp(xp);

    setResults((prev) => [...prev, { correct, xp }]);
    setShowAnswer(false);

    if (isLast) {
      const allResults = [...results, { correct, xp }];
      onComplete({
        reviewed: allResults.length,
        correct: allResults.filter((r) => r.correct).length,
        xpEarned:
          allResults.reduce((sum, r) => sum + r.xp, 0) +
          XP_VALUES.dailyPractice,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-card overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / cards.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm text-muted">
          {currentIndex + 1}/{cards.length}
        </span>
      </div>

      {/* Card */}
      <div className="rounded-[2rem] border border-outline-variant/20 bg-surface p-6 text-center space-y-4 shadow-sm">
        {currentCard.isSchwach && (
          <span className="inline-block rounded-full bg-danger/10 px-2.5 py-0.5 text-xs text-danger">
            Schwach
          </span>
        )}

        <p className="text-lg font-headline font-semibold">{currentCard.front}</p>

        {showAnswer ? (
          <>
            <div className="border-t border-border pt-4">
              <p className="text-muted font-headline">{currentCard.back}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 rounded-xl border border-danger bg-danger/10 py-3 font-medium text-danger hover:bg-danger/20 transition-colors"
              >
                Falsch ✗
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 rounded-xl border border-success bg-success/10 py-3 font-medium text-success hover:bg-success/20 transition-colors"
              >
                Richtig ✓
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full rounded-xl bg-primary py-3 font-headline font-bold text-white hover:bg-primary-hover transition-colors"
          >
            Antwort zeigen
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {currentCard.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-card px-2.5 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
