"use client";

import type { VocabWord } from "@/types/content";

interface VocabPreviewProps {
  vocab: VocabWord[];
  onContinue: () => void;
}

export default function VocabPreview({ vocab, onContinue }: VocabPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Neue Vokabeln</h2>
        <p className="text-muted text-sm mt-1">
          Lerne diese Wörter, bevor du die Übungen machst
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {vocab.map((word, i) => (
          <div
            key={i}
            className="rounded-[2rem] bg-surface shadow-sm p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-headline font-bold text-lg text-foreground">
                  {word.article ? `${word.article} ${word.german}` : word.german}
                </p>
                <p className="text-muted text-sm">{word.english}</p>
              </div>
              {word.plural && (
                <span className="text-xs text-muted bg-background px-2 py-0.5 rounded">
                  Pl: {word.plural}
                </span>
              )}
            </div>
            {word.exampleSentence && (
              <p className="mt-2 text-sm text-muted italic border-t border-border pt-2">
                {word.exampleSentence}
                {word.exampleTranslation && (
                  <span className="block text-xs not-italic">
                    {word.exampleTranslation}
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-primary py-3 font-headline font-bold text-white hover:bg-primary-hover transition-all active:scale-95"
      >
        Weiter zu den Übungen →
      </button>
    </div>
  );
}
