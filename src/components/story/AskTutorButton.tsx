"use client";

import { useState, useEffect, useRef, useCallback, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/stores/chatStore";
import { EXPLAIN_TEXT_PROMPT } from "@/lib/prompts";

interface AskTutorButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function AskTutorButton({ containerRef }: AskTutorButtonProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selectedTextRef = useRef("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    const text = selectedTextRef.current;
    if (!text) return;
    useChatStore.getState().openWithPrompt(EXPLAIN_TEXT_PROMPT(text), "explain");
    setVisible(false);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim() || "";

        if (text.length < 3 || !selection?.rangeCount) {
          if (visible) {
            if (dismissRef.current) clearTimeout(dismissRef.current);
            dismissRef.current = setTimeout(() => setVisible(false), 400);
          }
          return;
        }

        // Check if selection is inside the story container
        const anchor = selection.anchorNode;
        if (!containerRef.current || !anchor || !containerRef.current.contains(anchor)) {
          return;
        }

        // Skip if inside inputs
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.getAttribute("contenteditable") === "true")
        ) {
          return;
        }

        // Clear dismiss timer
        if (dismissRef.current) {
          clearTimeout(dismissRef.current);
          dismissRef.current = null;
        }

        selectedTextRef.current = text;

        // Position near selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const aboveSpace = rect.top;
        const buttonHeight = 36;

        // Using fixed positioning, so use viewport-relative coords directly
        setPosition({
          top:
            aboveSpace > 60
              ? rect.top - buttonHeight - 8
              : rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
        setVisible(true);
      }, 300);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [visible, containerRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 4 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          onClick={handleClick}
          className="fixed z-50 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-primary-hover transition-colors active:scale-95"
          style={{
            top: position.top,
            left: position.left,
            transform: "translateX(-50%)",
          }}
        >
          <span className="material-symbols-outlined text-[16px]">forum</span>
          Ask Tutor
        </motion.button>
      )}
    </AnimatePresence>
  );
}
