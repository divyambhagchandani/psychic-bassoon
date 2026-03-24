"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TranslateResult {
  translation: string;
}

export default function TranslateToast() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [selectedText, setSelectedText] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, TranslateResult>>(new Map());
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    setResult(null);
    setSelectedText("");
    setLoading(false);
  }, []);

  const translate = useCallback(async (text: string) => {
    // Check cache first
    const cached = cacheRef.current.get(text);
    if (cached) {
      setResult(cached);
      setLoading(false);
      setVisible(true);
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);
    setVisible(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Translation failed");

      const data: TranslateResult = await res.json();
      cacheRef.current.set(text, data);
      setResult(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      dismiss();
    } finally {
      setLoading(false);
    }
  }, [dismiss]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        // Check selection length BEFORE any state updates
        const text = window.getSelection()?.toString().trim() || "";

        if (text.length < 15) {
          // Empty or short selection — dismiss after a delay
          if (visible) {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = setTimeout(dismiss, 500);
          }
          return;
        }

        // Skip if selecting inside an input/textarea/contenteditable
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.getAttribute("contenteditable") === "true")
        ) {
          return;
        }

        // Clear any pending dismiss
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }

        setSelectedText(text);
        translate(text);
      }, 300);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [visible, translate, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-0 inset-x-0 z-[45] bg-primary text-white rounded-t-2xl px-5 py-4 pr-20 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] flex items-start gap-3.5"
        >
          <span className="material-symbols-outlined text-[22px] opacity-80 mt-0.5 shrink-0">
            translate
          </span>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div>
                <div className="text-xs uppercase tracking-wide opacity-60 mb-1.5">
                  Translating…
                </div>
                <div className="flex gap-1.5">
                  <div className="h-3.5 w-28 rounded-full bg-white/15 animate-pulse" />
                  <div className="h-3.5 w-20 rounded-full bg-white/10 animate-pulse [animation-delay:200ms]" />
                </div>
              </div>
            ) : result ? (
              <div className="text-[15px] leading-snug">
                {result.translation}
              </div>
            ) : null}
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss translation"
            className="text-xl opacity-50 hover:opacity-100 transition-opacity mt-0.5 shrink-0"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
