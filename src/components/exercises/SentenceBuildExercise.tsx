"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Reorder } from "framer-motion";
import type { SentenceBuildExercise as SentenceBuildType } from "@/types/content";
import ExerciseResult from "./ExerciseResult";
import { getElapsed, markStart } from "@/lib/timing";

interface TaggedWord {
  id: number;
  word: string;
}

interface SentenceBuildExerciseProps {
  exercise: SentenceBuildType;
  onAnswer: (correct: boolean, timeTakenMs: number) => void;
}

let nextId = 0;
function tagWords(words: string[]): TaggedWord[] {
  return words.map((word) => ({ id: nextId++, word }));
}

export default function SentenceBuildExercise({
  exercise,
  onAnswer,
}: SentenceBuildExerciseProps) {
  const [available, setAvailable] = useState<TaggedWord[]>(() =>
    tagWords(shuffle([...exercise.correctOrder, ...(exercise.distractors || [])]))
  );
  const [selected, setSelected] = useState<TaggedWord[]>([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const startTimeRef = useRef(0);
  useEffect(() => { markStart(startTimeRef); }, []);

  const addWord = (tw: TaggedWord) => {
    if (answered) return;
    setSelected((prev) => [...prev, tw]);
    setAvailable((prev) => prev.filter((w) => w.id !== tw.id));
  };

  const removeWord = (tw: TaggedWord) => {
    if (answered) return;
    setAvailable((prev) => [...prev, tw]);
    setSelected((prev) => prev.filter((w) => w.id !== tw.id));
  };

  const handleCheck = () => {
    if (answered || selected.length === 0) return;
    const isCorrect =
      selected.length === exercise.correctOrder.length &&
      selected.every((tw, i) => tw.word === exercise.correctOrder[i]);
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect, getElapsed(startTimeRef));
  };

  const selectedIds = selected.map((tw) => tw.id);
  const handleReorder = useCallback(
    (newOrder: number[]) => {
      if (!answered) {
        setSelected((prev) => {
          const map = new Map(prev.map((tw) => [tw.id, tw]));
          return newOrder.map((id) => map.get(id)!);
        });
      }
    },
    [answered]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-headline font-bold">
        Bilde den Satz: <span className="text-muted font-normal">{exercise.prompt}</span>
      </h3>

      {/* Selected words (reorderable) */}
      <div className="min-h-[56px] rounded-[2rem] border border-outline-variant bg-surface shadow-sm p-3">
        {selected.length === 0 ? (
          <p className="text-muted text-sm">Tippe auf die Wörter unten...</p>
        ) : (
          <Reorder.Group
            axis="x"
            values={selectedIds}
            onReorder={handleReorder}
            className="flex flex-wrap gap-2"
          >
            {selected.map((tw) => (
              <Reorder.Item
                key={tw.id}
                value={tw.id}
                className={`cursor-grab rounded-lg px-3 py-1.5 text-sm font-medium ${
                  answered
                    ? correct
                      ? "bg-success/20 text-success"
                      : "bg-danger/20 text-danger"
                    : "bg-primary/20 text-primary"
                }`}
                onClick={() => removeWord(tw)}
              >
                {tw.word}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((tw) => (
          <button
            key={tw.id}
            onClick={() => addWord(tw)}
            disabled={answered}
            className="rounded-xl border border-outline-variant/20 bg-surface shadow-sm px-3 py-1.5 text-sm hover:bg-surface-high transition-colors disabled:opacity-50"
          >
            {tw.word}
          </button>
        ))}
      </div>

      {answered && !correct && (
        <p className="text-sm text-muted">
          Richtige Antwort: {exercise.correctOrder.join(" ")}
        </p>
      )}

      {!answered && selected.length > 0 && (
        <button
          onClick={handleCheck}
          className="rounded-xl bg-primary px-6 py-2.5 font-headline font-bold text-white hover:bg-primary-hover active:scale-95 transition-all"
        >
          Prüfen
        </button>
      )}

      {answered && (
        <ExerciseResult
          correct={correct}
          explanation={exercise.explanation}
          exerciseId={exercise.id}
        />
      )}
    </div>
  );
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
