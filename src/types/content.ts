// ── Vocab ──
export interface VocabWord {
  german: string;
  english: string;
  article?: string; // der/die/das
  plural?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

// ── Exercise types (discriminated union on `type`) ──
interface ExerciseBase {
  id: string;
  type: string;
  tags: string[];
  explanation: string;
  xpValue: number;
}

export interface McqExercise extends ExerciseBase {
  type: "mcq";
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface FillBlankExercise extends ExerciseBase {
  type: "fill-blank";
  sentence: string; // contains ___
  answer: string;
  acceptAlternatives?: string[];
  hint?: string;
}

export interface SentenceBuildExercise extends ExerciseBase {
  type: "sentence-build";
  prompt: string; // English sentence to translate
  correctOrder: string[];
  distractors?: string[];
}

export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  pairs: { left: string; right: string }[];
}

export interface ReadingExercise extends ExerciseBase {
  type: "reading";
  passage: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface BlitzExercise extends ExerciseBase {
  type: "blitz";
  question: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds: number;
}

export type Exercise =
  | McqExercise
  | FillBlankExercise
  | SentenceBuildExercise
  | MatchingExercise
  | ReadingExercise
  | BlitzExercise;

// ── Characters ──
export interface Character {
  id: string;
  name: string;
  age: number;
  origin: string;
  neighborhood: string;
  occupation: string;
  personality: string;
  speech: string; // how they talk
  emoji: string;
}

// ── Chapter ──
export interface Chapter {
  id: string;
  number: number;
  title: string;
  titleEnglish: string;
  description: string;
  characters: string[]; // character IDs
  story: string; // narrative text
  vocab: VocabWord[];
  exercises: Exercise[];
  blitzQuestions: BlitzExercise[];
  lidTopics: string[]; // cross-ref to lid-topics.json
}

// ── LiD Topics ──
export interface LidTopic {
  id: string;
  category: string;
  topic: string;
  topicEnglish: string;
  berlinSpecific: boolean;
}
