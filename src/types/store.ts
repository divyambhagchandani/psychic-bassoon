import type { SRCard, ReviewQuality } from "./sr";

// ── Progress Store ──
export interface ChapterScore {
  chapterId: string;
  score: number; // 0-100
  totalExercises: number;
  correctAnswers: number;
  completedAt: string; // ISO date
}

export interface ProgressState {
  chapterScores: Record<string, ChapterScore>;
  unlockedChapters: string[];
  currentChapter: string | null;
}

export interface ProgressActions {
  recordChapterScore: (score: ChapterScore) => void;
  unlockChapter: (chapterId: string) => void;
  isChapterUnlocked: (chapterId: string) => boolean;
  getChapterScore: (chapterId: string) => ChapterScore | undefined;
}

// ── SR Store ──
export interface SRState {
  cards: SRCard[];
}

export interface SRActions {
  addCard: (card: SRCard) => void;
  reviewCard: (cardId: string, quality: ReviewQuality) => void;
  getDueCards: () => SRCard[];
  getLidReadiness: () => number; // percentage 0-100
  getCardById: (cardId: string) => SRCard | undefined;
}

// ── Streak Store ──
export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  todayXp: number;
  lastActiveDate: string | null; // ISO date
}

export interface StreakActions {
  addXp: (amount: number) => void;
  checkStreakStatus: () => void;
  completeDailyPractice: () => void;
  getLevel: () => number;
}

// ── Chat Store ──
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatTab {
  id: string;
  label: string;
  messages: ChatMessage[];
  mode: "chat" | "explain";
  createdAt: string;
}

export interface ChatState {
  tabs: ChatTab[];
  activeTabId: string | null;
  chatOpen: boolean;
}

export interface ChatActions {
  createTab: (label?: string, mode?: ChatTab["mode"]) => string;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  addMessage: (tabId: string, message: ChatMessage) => void;
  updateLastMessage: (tabId: string, content: string) => void;
  setChatOpen: (open: boolean) => void;
  openWithPrompt: (userPrompt: string, mode?: ChatTab["mode"]) => void;
}

// ── Settings Store ──
export interface SettingsState {
  showEnglishHints: boolean;
  showEnglishNav: boolean;
  tutorLanguage: "german" | "english" | "mixed";
}

export interface SettingsActions {
  setShowEnglishHints: (show: boolean) => void;
  setShowEnglishNav: (show: boolean) => void;
  setTutorLanguage: (lang: SettingsState["tutorLanguage"]) => void;
}
