"use client";

import { motion } from "framer-motion";
import type { SessionResult } from "./QuizSession";

interface QuizResultsProps {
  result: SessionResult;
  onContinue: () => void;
  onDashboard: () => void;
}

export default function QuizResults({
  result,
  onContinue,
  onDashboard,
}: QuizResultsProps) {
  const pct = Math.round((result.correct / result.total) * 100);
  const isPerfect = result.correct === result.total;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Score header */}
      <div className="bg-surface rounded-[2rem] p-10 shadow-sm text-center space-y-4">
        <div className="text-5xl mb-2">{isPerfect ? "🎉" : "📊"}</div>
        <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight">
          {result.correct} / {result.total}
        </h2>
        <p className="text-on-surface-variant font-body text-lg">
          {pct}% richtig
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-8 pt-4">
          <div className="text-center">
            <span className="material-symbols-outlined text-success text-2xl">
              check_circle
            </span>
            <p className="font-headline font-bold text-on-surface mt-1">
              {result.correct}
            </p>
            <p className="text-xs text-on-surface-variant">Richtig</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-danger text-2xl">
              cancel
            </span>
            <p className="font-headline font-bold text-on-surface mt-1">
              {result.total - result.correct}
            </p>
            <p className="text-xs text-on-surface-variant">Falsch</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-secondary text-2xl">
              bolt
            </span>
            <p className="font-headline font-bold text-on-surface mt-1">
              +{result.xpEarned}
            </p>
            <p className="text-xs text-on-surface-variant">XP</p>
          </div>
        </div>
      </div>

      {/* Wrong questions review */}
      {result.wrongQuestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-headline text-lg font-bold text-on-surface">
            Zum Wiederholen ({result.wrongQuestions.length})
          </h3>
          <div className="space-y-3">
            {result.wrongQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-surface rounded-xl p-5 shadow-sm border-l-4 border-danger"
              >
                <p className="text-sm font-headline font-bold text-on-surface mb-2">
                  {q.question}
                </p>
                <p className="text-xs text-success font-body flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    check
                  </span>
                  {q.options[q.correctIndex]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onDashboard}
          className="bg-surface-high text-on-surface py-3 px-8 rounded-xl font-headline font-bold hover:opacity-90 transition-all active:scale-95"
        >
          Dashboard
        </button>
        <button
          onClick={onContinue}
          className="bg-primary text-white py-3 px-8 rounded-xl font-headline font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
        >
          Weiter üben
          <span className="material-symbols-outlined text-lg">
            arrow_forward
          </span>
        </button>
      </div>
    </motion.div>
  );
}
