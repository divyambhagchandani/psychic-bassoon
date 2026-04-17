import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizState, QuizActions, QuizSRCard } from "@/types/store";
import type { LidQuestion } from "@/types/content";
import {
  computeNextReview,
  getDueCardsForToday,
  mapAnswerToQuality,
} from "@/lib/sm2";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeNewCard(questionId: string): QuizSRCard {
  return {
    questionId,
    interval: 0,
    ease: 2.5,
    correctStreak: 0,
    nextReview: new Date().toISOString().split("T")[0],
    isSchwach: false,
    totalAttempts: 0,
    totalCorrect: 0,
  };
}

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set, get) => ({
      cards: {},

      answerQuestion: (questionId, correct, timeTakenMs) => {
        const quality = mapAnswerToQuality(correct, "mcq", timeTakenMs);
        const state = get();
        const existing = state.cards[questionId] ?? makeNewCard(questionId);

        const result = computeNextReview(
          quality,
          existing.interval,
          existing.ease,
          existing.correctStreak
        );

        const today = new Date();
        const nextReview = new Date(today);
        nextReview.setDate(nextReview.getDate() + result.interval);

        set({
          cards: {
            ...state.cards,
            [questionId]: {
              ...existing,
              interval: result.interval,
              ease: result.ease,
              correctStreak: result.correctStreak,
              isSchwach: result.isSchwach,
              nextReview: nextReview.toISOString().split("T")[0],
              lastReviewed: today.toISOString().split("T")[0],
              totalAttempts: existing.totalAttempts + 1,
              totalCorrect: existing.totalCorrect + (correct ? 1 : 0),
            },
          },
        });
      },

      getNextQuestions: (allQuestions, count = 10) => {
        const cards = get().cards;
        const cardValues = Object.values(cards);
        const dueCards = getDueCardsForToday(
          cardValues.map((c) => ({
            ...c,
            nextReview: c.nextReview,
            isSchwach: c.isSchwach,
            ease: c.ease,
          }))
        );

        const dueIds = new Set(dueCards.map((c) => c.questionId));
        const seenIds = new Set(Object.keys(cards));

        // Tier 1: due schwach
        const tier1 = shuffle(
          allQuestions.filter(
            (q) => dueIds.has(q.id) && cards[q.id]?.isSchwach
          )
        );
        // Tier 2: due normal
        const tier2 = shuffle(
          allQuestions.filter(
            (q) => dueIds.has(q.id) && !cards[q.id]?.isSchwach
          )
        );
        // Tier 3: unseen
        const tier3 = shuffle(
          allQuestions.filter((q) => !seenIds.has(q.id))
        );

        const result = [...tier1, ...tier2, ...tier3].slice(0, count);

        // If all seen and none due, random sample for continued practice
        if (result.length === 0) {
          return shuffle(allQuestions).slice(0, count);
        }

        return result;
      },

      getStats: (totalQuestions: number) => {
        const cards = get().cards;
        const values = Object.values(cards);
        const attempted = values.length;
        const mastered = values.filter((c) => c.correctStreak >= 3).length;
        const weak = values.filter((c) => c.isSchwach).length;
        const totalAttempts = values.reduce((s, c) => s + c.totalAttempts, 0);
        const totalCorrect = values.reduce((s, c) => s + c.totalCorrect, 0);
        const accuracy =
          totalAttempts > 0
            ? Math.round((totalCorrect / totalAttempts) * 100)
            : 0;

        return { total: totalQuestions, attempted, mastered, weak, accuracy };
      },

      getDueCount: () => {
        const cards = Object.values(get().cards);
        return getDueCardsForToday(
          cards.map((c) => ({
            nextReview: c.nextReview,
            isSchwach: c.isSchwach,
            ease: c.ease,
          }))
        ).length;
      },
    }),
    { name: "berlin-leben-quiz" }
  )
);
