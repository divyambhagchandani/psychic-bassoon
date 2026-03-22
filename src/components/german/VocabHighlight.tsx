"use client";

import { useState, useRef, useEffect } from "react";
import type { VocabWord } from "@/types/content";

interface VocabHighlightProps {
  word: string;
  vocab: VocabWord;
}

export default function VocabHighlight({ word, vocab }: VocabHighlightProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTooltip]);

  return (
    <span ref={ref} className="relative inline-block">
      <span
        className="cursor-pointer border-b border-dotted border-primary text-primary hover:border-primary-hover hover:text-primary-hover transition-colors"
        onClick={() => setShowTooltip((v) => !v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {word}
      </span>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface border border-outline-variant/20 px-3 py-2 text-sm shadow-lg">
          <span className="block font-medium text-foreground">
            {vocab.article ? `${vocab.article} ${vocab.german}` : vocab.german}
          </span>
          <span className="block text-muted">{vocab.english}</span>
          {vocab.exampleSentence && (
            <span className="mt-1 block text-xs text-muted italic">
              {vocab.exampleSentence}
            </span>
          )}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-surface" />
        </span>
      )}
    </span>
  );
}
