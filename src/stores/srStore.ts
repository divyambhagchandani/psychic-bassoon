import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SRState, SRActions } from "@/types/store";
import type { SRCard, ReviewQuality } from "@/types/sr";
import {
  computeNextReview,
  getDueCardsForToday,
  mapAnswerToQuality,
} from "@/lib/sm2";

export { mapAnswerToQuality };

export const useSRStore = create<SRState & SRActions>()(
  persist(
    (set, get) => ({
      cards: [],

      addCard: (card: SRCard) =>
        set((state) => {
          if (state.cards.some((c) => c.id === card.id)) return state;
          return { cards: [...state.cards, card] };
        }),

      reviewCard: (cardId: string, quality: ReviewQuality) =>
        set((state) => {
          const cards = state.cards.map((card) => {
            if (card.id !== cardId) return card;

            const result = computeNextReview(
              quality,
              card.interval,
              card.ease,
              card.correctStreak
            );

            const today = new Date();
            const nextReview = new Date(today);
            nextReview.setDate(nextReview.getDate() + result.interval);

            return {
              ...card,
              interval: result.interval,
              ease: result.ease,
              correctStreak: result.correctStreak,
              isSchwach: result.isSchwach,
              nextReview: nextReview.toISOString().split("T")[0],
              lastReviewed: today.toISOString().split("T")[0],
            };
          });

          return { cards };
        }),

      getDueCards: () => getDueCardsForToday(get().cards),

      getLidReadiness: () => {
        const cards = get().cards;
        if (cards.length === 0) return 0;
        const mastered = cards.filter((c) => c.correctStreak >= 3).length;
        return Math.round((mastered / cards.length) * 100);
      },

      getCardById: (cardId: string) =>
        get().cards.find((c) => c.id === cardId),
    }),
    { name: "berlin-leben-sr" }
  )
);
