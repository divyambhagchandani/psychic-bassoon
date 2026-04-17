"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cache = new Map<string, string>();

export default function TranslateButton({ text }: { text: string }) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Toggle off if already showing
      if (translation !== null) {
        setTranslation(null);
        return;
      }

      const cached = cache.get(text);
      if (cached) {
        setTranslation(cached);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Translation failed");
        const data = await res.json();
        cache.set(text, data.translation);
        setTranslation(data.translation);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setTranslation(null);
      } finally {
        setLoading(false);
      }
    },
    [text, translation]
  );

  return (
    <span className="relative inline-flex items-center">
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={`Translate: ${text}`}
        className="ml-1.5 p-0.5 rounded text-on-surface-variant/40 hover:text-primary transition-colors shrink-0 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">
          {loading ? "hourglass_top" : "translate"}
        </span>
      </span>

      <AnimatePresence>
        {translation !== null && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 z-10 bg-primary text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
          >
            {translation}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
