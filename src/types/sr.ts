export interface SRCard {
  id: string;
  front: string; // question or German word
  back: string; // answer or English translation
  tags: string[];
  sourceChapter: string;
  sourceExerciseId: string;
  // SM-2 fields
  interval: number; // days until next review
  ease: number; // easiness factor (min 1.3)
  correctStreak: number;
  nextReview: string; // ISO date string
  isSchwach: boolean; // marked as weak
  lastReviewed?: string; // ISO date string
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  interval: number;
  ease: number;
  correctStreak: number;
  isSchwach: boolean;
}
