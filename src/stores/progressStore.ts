import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProgressState, ProgressActions, ChapterScore } from "@/types/store";

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      chapterScores: {},
      unlockedChapters: ["chapter-1"],
      currentChapter: null,

      recordChapterScore: (score: ChapterScore) =>
        set((state) => {
          const newScores = {
            ...state.chapterScores,
            [score.chapterId]: score,
          };
          const newUnlocked = [...state.unlockedChapters];

          if (score.score >= 70) {
            const chapterNum = parseInt(
              score.chapterId.replace("chapter-", "")
            );
            const nextChapterId = `chapter-${chapterNum + 1}`;
            if (chapterNum < 10 && !newUnlocked.includes(nextChapterId)) {
              newUnlocked.push(nextChapterId);
            }
          }

          return { chapterScores: newScores, unlockedChapters: newUnlocked };
        }),

      unlockChapter: (chapterId: string) =>
        set((state) => ({
          unlockedChapters: state.unlockedChapters.includes(chapterId)
            ? state.unlockedChapters
            : [...state.unlockedChapters, chapterId],
        })),

      isChapterUnlocked: (chapterId: string) =>
        get().unlockedChapters.includes(chapterId),

      getChapterScore: (chapterId: string) =>
        get().chapterScores[chapterId],
    }),
    { name: "berlin-leben-progress" }
  )
);
