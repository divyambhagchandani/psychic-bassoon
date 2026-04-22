"use client";

import { useSettingsStore } from "@/stores/settingsStore";

interface BilingualLabelProps {
  german: string;
  english: string;
  className?: string;
}

export default function BilingualLabel({
  german,
  english,
  className = "",
}: BilingualLabelProps) {
  const showEnglish = useSettingsStore((s) => s.showEnglishHints);

  return (
    <span className={className}>
      {german}
      {showEnglish && (
        <span className="ml-1.5 text-muted text-sm">({english})</span>
      )}
    </span>
  );
}
