export const FEEDBACK = {
  correct: [
    "Richtig!",
    "Sehr gut!",
    "Genau!",
    "Prima!",
    "Wunderbar!",
  ],
  incorrect: [
    "Leider falsch.",
    "Nicht ganz.",
    "Versuch es nochmal!",
    "Fast richtig!",
  ],
  streakMessages: {
    3: "Drei Tage hintereinander! Weiter so!",
    7: "Eine Woche! Du bist fantastisch!",
    14: "Zwei Wochen! Unglaublich!",
    30: "Ein ganzer Monat! Du bist ein Held!",
  } as Record<number, string>,
  chapterComplete: "Kapitel abgeschlossen!",
  chapterPerfect: "Perfekt! Alle richtig!",
  dailyComplete: "Tägliche Übung geschafft!",
  noCardsDue: "Keine Karten fällig. Komm später zurück!",
  unlockNext: "Nächstes Kapitel freigeschaltet!",
} as const;

export function getRandomFeedback(correct: boolean): string {
  const pool = correct ? FEEDBACK.correct : FEEDBACK.incorrect;
  return pool[Math.floor(Math.random() * pool.length)];
}
