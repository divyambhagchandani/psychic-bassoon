"use client";

import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface SpeakButtonProps {
  text: string;
  /** Always visible (e.g. inside a tooltip). Default: hidden until parent `group` hover. */
  alwaysVisible?: boolean;
  className?: string;
}

export default function SpeakButton({
  text,
  alwaysVisible,
  className = "",
}: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

  if (!isSupported) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSpeaking ? "Stop" : "Listen"}
      className={`inline-flex items-center justify-center rounded-full p-0.5 transition-all duration-200 hover:bg-on-surface/8 ${
        alwaysVisible
          ? "opacity-70 hover:opacity-100"
          : "opacity-0 group-hover:opacity-60 hover:!opacity-100"
      } ${className}`}
    >
      <span
        className="material-symbols-outlined text-on-surface-variant/50 text-[18px]"
        aria-hidden="true"
      >
        {isSpeaking ? "stop" : "volume_up"}
      </span>
    </button>
  );
}
