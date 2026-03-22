import type { ReviewQuality, ReviewResult } from "@/types/sr";

export function computeNextReview(
  quality: ReviewQuality,
  previousInterval: number,
  previousEase: number,
  correctStreak: number
): ReviewResult {
  if (quality < 3) {
    return {
      interval: 1,
      ease: Math.max(1.3, previousEase - 0.2),
      correctStreak: 0,
      isSchwach: true,
    };
  }

  const newEase = Math.max(
    1.3,
    previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  let newInterval: number;
  const newStreak = correctStreak + 1;

  if (newStreak === 1) {
    newInterval = 1;
  } else if (newStreak === 2) {
    newInterval = 3;
  } else {
    newInterval = Math.min(30, Math.round(previousInterval * newEase));
  }

  return {
    interval: newInterval,
    ease: newEase,
    correctStreak: newStreak,
    isSchwach: false,
  };
}

export function getDueCardsForToday<
  T extends { nextReview: string; isSchwach: boolean; ease: number },
>(cards: T[]): T[] {
  const today = new Date().toISOString().split("T")[0];
  return cards
    .filter((card) => card.nextReview <= today)
    .sort((a, b) => {
      if (a.isSchwach !== b.isSchwach) return a.isSchwach ? -1 : 1;
      return a.ease - b.ease;
    });
}

export function mapAnswerToQuality(
  correct: boolean,
  _exerciseType: string,
  timeTakenMs?: number
): ReviewQuality {
  if (!correct) return 1;
  if (timeTakenMs && timeTakenMs < 3000) return 5;
  if (timeTakenMs && timeTakenMs < 8000) return 4;
  return 3;
}
