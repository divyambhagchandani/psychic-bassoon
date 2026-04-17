"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LidQuestion } from "@/types/content";
import { useQuizStore } from "@/stores/quizStore";
import { useStreakStore } from "@/stores/streakStore";
import TranslateButton from "./TranslateButton";
import { markStart, getElapsed } from "@/lib/timing";

interface QuizSessionProps {
  questions: LidQuestion[];
  onComplete: (results: SessionResult) => void;
  onQuit: () => void;
}

export interface SessionResult {
  total: number;
  correct: number;
  xpEarned: number;
  wrongQuestions: LidQuestion[];
}

export default function QuizSession({
  questions: initialQuestions,
  onComplete,
  onQuit,
}: QuizSessionProps) {
  const [queue, setQueue] = useState<LidQuestion[]>(() => [...initialQuestions]);
  const [originalCount] = useState(initialQuestions.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{
    correct: number;
    xp: number;
    wrongIds: Set<string>;
    wrong: LidQuestion[];
  }>({ correct: 0, xp: 0, wrongIds: new Set(), wrong: [] });

  const startTimeRef = useRef(0);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const addXp = useStreakStore((s) => s.addXp);

  const current = queue[currentIndex];

  useEffect(() => {
    markStart(startTimeRef);
  }, [currentIndex]);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered || !current) return;
      setSelected(index);
      setAnswered(true);

      const correct = index === current.correctIndex;
      const elapsed = getElapsed(startTimeRef);
      const xp = correct ? 10 : 0;

      answerQuestion(current.id, correct, elapsed);
      if (correct) addXp(xp);

      setResults((prev) => {
        if (correct) {
          return { ...prev, correct: prev.correct + 1, xp: prev.xp + xp };
        }
        // Deduplicate wrong questions
        if (prev.wrongIds.has(current.id)) {
          return prev;
        }
        const newIds = new Set(prev.wrongIds);
        newIds.add(current.id);
        return { ...prev, wrongIds: newIds, wrong: [...prev.wrong, current] };
      });

      // Re-insert wrong answers 3-5 positions later
      if (!correct) {
        setQueue((prev) => {
          const insertAt = Math.min(
            currentIndex + 3 + Math.floor(Math.random() * 3),
            prev.length
          );
          const next = [...prev];
          next.splice(insertAt, 0, current);
          return next;
        });
      }
    },
    [answered, current, currentIndex, answerQuestion, addXp]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= queue.length) {
      onComplete({
        total: originalCount,
        correct: results.correct,
        xpEarned: results.xp,
        wrongQuestions: results.wrong,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (!current) return null;

  const progress = Math.round(((currentIndex + 1) / queue.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onQuit}
          className="text-on-surface-variant hover:text-on-surface transition-colors font-headline font-bold text-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          Beenden
        </button>
        <span className="text-sm font-headline font-bold text-on-surface-variant">
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + "-" + currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="bg-surface rounded-[2rem] p-8 shadow-sm space-y-6"
        >
          {/* Badges */}
          <div className="flex items-center gap-2">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {current.category}
            </span>
            <span className="text-xs text-on-surface-variant font-body">
              #{current.questionNumber}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-headline font-bold text-on-surface leading-relaxed">
            {current.question}
          </h3>

          {/* Options */}
          <div className="grid gap-3">
            {current.options.map((option, i) => {
              let style =
                "border-outline-variant/20 bg-white hover:bg-surface-high";
              if (answered) {
                if (i === current.correctIndex) {
                  style = "border-success bg-success/10";
                } else if (i === selected) {
                  style = "border-danger bg-danger/10";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  aria-disabled={answered}
                  className={`relative rounded-xl border-2 p-4 text-left text-sm font-headline font-bold active:scale-[0.98] transition-all ${style}${answered ? " cursor-default" : ""}`}
                >
                  <span className="flex items-center justify-between">
                    <span>
                      <span className="mr-2 text-on-surface-variant/50">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {option}
                    </span>
                    <TranslateButton text={option} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 text-sm font-body ${
                selected === current.correctIndex
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              <div className="flex items-center gap-2 font-headline font-bold mb-1">
                <span className="material-symbols-outlined text-lg">
                  {selected === current.correctIndex
                    ? "check_circle"
                    : "cancel"}
                </span>
                {selected === current.correctIndex ? "Richtig!" : "Falsch!"}
              </div>
              <p className="text-on-surface/80">{current.explanation}</p>
            </motion.div>
          )}

          {/* Next button */}
          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <button
                onClick={handleNext}
                className="bg-primary text-white py-3 px-8 rounded-xl font-headline font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
              >
                {currentIndex + 1 >= queue.length ? "Ergebnisse" : "Weiter"}
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
