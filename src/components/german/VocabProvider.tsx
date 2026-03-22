"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { VocabWord } from "@/types/content";

interface VocabContextType {
  vocabMap: Map<string, VocabWord>;
  loadVocab: (words: VocabWord[]) => void;
  lookup: (german: string) => VocabWord | undefined;
}

const VocabContext = createContext<VocabContextType | null>(null);

export function VocabProvider({ children }: { children: ReactNode }) {
  const [vocabMap, setVocabMap] = useState<Map<string, VocabWord>>(new Map());

  const loadVocab = useCallback((words: VocabWord[]) => {
    const map = new Map<string, VocabWord>();
    for (const word of words) {
      map.set(word.german.toLowerCase(), word);
    }
    setVocabMap(map);
  }, []);

  const lookup = useCallback(
    (german: string) => vocabMap.get(german.toLowerCase()),
    [vocabMap]
  );

  return (
    <VocabContext.Provider value={{ vocabMap, loadVocab, lookup }}>
      {children}
    </VocabContext.Provider>
  );
}

export function useVocab() {
  const ctx = useContext(VocabContext);
  if (!ctx) throw new Error("useVocab must be used within VocabProvider");
  return ctx;
}
