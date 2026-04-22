export const XP_VALUES: Record<string, number> = {
  mcq: 10,
  "fill-blank": 15,
  "sentence-build": 15,
  matching: 12,
  reading: 15,
  blitz: 10,
  blitzSpeedBonus: 5,
  chapterCompletion: 100,
  chapterPerfect: 100,
  dailyPractice: 30,
  streakBonusPerDay: 5,
  streakBonusCap: 50,
};

export function calculateExerciseXp(
  type: string,
  correct: boolean,
  timeTakenMs?: number
): number {
  if (!correct) return 0;
  const base = XP_VALUES[type] ?? 10;
  if (type === "blitz" && timeTakenMs && timeTakenMs < 5000) {
    return base + XP_VALUES.blitzSpeedBonus;
  }
  return base;
}

export function calculateChapterXp(
  correctAnswers: number,
  totalExercises: number
): number {
  let xp = XP_VALUES.chapterCompletion;
  if (correctAnswers === totalExercises) {
    xp += XP_VALUES.chapterPerfect;
  }
  return xp;
}

export function calculateStreakBonus(streakDays: number): number {
  return Math.min(
    streakDays * XP_VALUES.streakBonusPerDay,
    XP_VALUES.streakBonusCap
  );
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(1 + Math.sqrt(totalXp / 50));
}
