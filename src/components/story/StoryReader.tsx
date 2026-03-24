"use client";

import { useState, useCallback, useRef } from "react";
import VocabHighlight from "@/components/german/VocabHighlight";
import AskTutorButton from "@/components/story/AskTutorButton";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { VocabWord } from "@/types/content";

interface StoryReaderProps {
  story: string;
  vocab: VocabWord[];
}

export default function StoryReader({ story, vocab }: StoryReaderProps) {
  const vocabMap = new Map<string, VocabWord>();
  for (const word of vocab) {
    vocabMap.set(word.german.toLowerCase(), word);
  }

  const paragraphs = story.split("\n\n");
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } =
    useSpeechSynthesis();
  const containerRef = useRef<HTMLDivElement>(null);
  const playingGlobal = useRef(false);
  const currentIdx = useRef(0);

  const speakParagraph = useCallback(
    (idx: number) => {
      if (idx >= paragraphs.length) {
        playingGlobal.current = false;
        setActiveParagraph(null);
        return;
      }
      setActiveParagraph(idx);
      currentIdx.current = idx;
      speak(paragraphs[idx], () => {
        if (playingGlobal.current) {
          speakParagraph(idx + 1);
        } else {
          setActiveParagraph(null);
        }
      });
    },
    [paragraphs, speak],
  );

  const handleGlobalPlay = () => {
    if (isPaused) {
      resume();
      return;
    }
    if (isSpeaking) {
      pause();
      return;
    }
    playingGlobal.current = true;
    speakParagraph(0);
  };

  const handleGlobalStop = () => {
    playingGlobal.current = false;
    stop();
    setActiveParagraph(null);
  };

  const handleParagraphPlay = (idx: number) => {
    playingGlobal.current = false;
    setActiveParagraph(idx);
    speak(paragraphs[idx], () => setActiveParagraph(null));
  };

  return (
    <div ref={containerRef} className="space-y-4">
      <AskTutorButton containerRef={containerRef} />
      {/* Global controls */}
      {isSupported && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGlobalPlay}
            aria-label={isSpeaking && !isPaused ? "Pause" : "Play story"}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200 text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-on-surface/8"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {isSpeaking && !isPaused ? "pause" : "play_arrow"}
            </span>
            {isSpeaking && !isPaused ? "Pause" : isPaused ? "Weiter" : "Vorlesen"}
          </button>
          {(isSpeaking || isPaused) && (
            <button
              type="button"
              onClick={handleGlobalStop}
              aria-label="Stop"
              className="inline-flex items-center rounded-full p-1.5 transition-all duration-200 text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-on-surface/8"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                stop
              </span>
            </button>
          )}
        </div>
      )}

      {/* Paragraphs */}
      {paragraphs.map((paragraph, pIdx) => (
        <div
          key={pIdx}
          className={`group relative flex items-start gap-2 rounded-lg transition-colors duration-300 ${
            activeParagraph === pIdx
              ? "bg-primary/5 border-l-2 border-primary pl-2"
              : "pl-[calc(0.5rem+2px)]"
          }`}
        >
          {isSupported && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isSpeaking && activeParagraph === pIdx) {
                  handleGlobalStop();
                } else {
                  handleParagraphPlay(pIdx);
                }
              }}
              aria-label={isSpeaking && activeParagraph === pIdx ? "Stop" : "Listen"}
              className={`mt-1 shrink-0 inline-flex items-center justify-center rounded-full p-0.5 transition-all duration-200 hover:bg-on-surface/8 ${
                activeParagraph === pIdx
                  ? "opacity-70 hover:opacity-100"
                  : "opacity-0 group-hover:opacity-60 hover:!opacity-100"
              }`}
            >
              <span
                className="material-symbols-outlined text-on-surface-variant/50 text-[18px]"
                aria-hidden="true"
              >
                {isSpeaking && activeParagraph === pIdx ? "stop" : "volume_up"}
              </span>
            </button>
          )}
          <p className="font-body text-lg leading-relaxed text-on-surface-variant">
            {highlightWords(paragraph, vocabMap)}
          </p>
        </div>
      ))}
    </div>
  );
}

function highlightWords(
  text: string,
  vocabMap: Map<string, VocabWord>,
): React.ReactNode[] {
  // Split by whitespace but keep punctuation attached
  const words = text.split(/(\s+)/);
  return words.map((segment, i) => {
    // Strip punctuation for lookup
    const clean = segment.replace(/[.,!?;:"""()]/g, "").toLowerCase();
    const vocab = vocabMap.get(clean);

    if (vocab) {
      // Preserve original casing and punctuation
      const leadPunct = segment.match(/^[.,!?;:"""()]+/)?.[0] || "";
      const trailPunct = segment.match(/[.,!?;:"""()]+$/)?.[0] || "";
      const endIdx = trailPunct.length
        ? segment.length - trailPunct.length
        : segment.length;
      const core = segment.slice(leadPunct.length, endIdx);
      return (
        <span key={i}>
          {leadPunct}
          <VocabHighlight word={core} vocab={vocab} />
          {trailPunct}
        </span>
      );
    }

    return <span key={i}>{segment}</span>;
  });
}
