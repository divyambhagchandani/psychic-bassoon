import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StreakState, StreakActions } from "@/types/store";
import { calculateLevel, calculateStreakBonus } from "@/lib/xp";

export const useStreakStore = create<StreakState & StreakActions>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0,
      todayXp: 0,
      lastActiveDate: null,

      addXp: (amount: number) =>
        set((state) => ({
          totalXp: state.totalXp + amount,
          todayXp: state.todayXp + amount,
        })),

      checkStreakStatus: () =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          if (!state.lastActiveDate) return state;

          const lastDate = new Date(state.lastActiveDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays > 1) {
            return { currentStreak: 0, todayXp: 0 };
          }
          if (diffDays === 1) {
            return { todayXp: 0 };
          }
          return state;
        }),

      completeDailyPractice: () =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          const isNewDay = state.lastActiveDate !== today;

          const newStreak = isNewDay
            ? state.currentStreak + 1
            : state.currentStreak;
          const streakBonus = isNewDay ? calculateStreakBonus(newStreak) : 0;

          return {
            currentStreak: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
            lastActiveDate: today,
            totalXp: state.totalXp + streakBonus,
            todayXp: state.todayXp + streakBonus,
          };
        }),

      getLevel: () => calculateLevel(get().totalXp),
    }),
    { name: "berlin-leben-streak" }
  )
);
