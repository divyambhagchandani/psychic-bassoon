"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeechSynthesis() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!isSupported) return;

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      const deDE = voices.find((v) => v.lang === "de-DE");
      const deFallback = voices.find((v) => v.lang.startsWith("de"));
      setVoice(deDE ?? deFallback ?? null);
    };

    pickVoice();
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", pickVoice);
      speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!isSupported) return;
      speechSynthesis.cancel();

      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "de-DE";
      utt.rate = 0.9;
      if (voice) utt.voice = voice;

      utt.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utt.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        onEnd?.();
      };
      utt.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utt;
      speechSynthesis.speak(utt);
    },
    [isSupported, voice],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, [isSupported]);

  return { speak, pause, resume, stop, isSpeaking, isPaused, isSupported };
}
