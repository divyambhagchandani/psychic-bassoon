"use client";

import VocabHighlight from "@/components/german/VocabHighlight";
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

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, pIdx) => (
        <p key={pIdx} className="text-base leading-relaxed">
          {highlightWords(paragraph, vocabMap)}
        </p>
      ))}
    </div>
  );
}

function highlightWords(
  text: string,
  vocabMap: Map<string, VocabWord>
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
