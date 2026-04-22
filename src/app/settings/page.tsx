"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export default function SettingsPage() {
  const {
    showEnglishHints,
    showEnglishNav,
    tutorLanguage,
    setShowEnglishHints,
    setShowEnglishNav,
    setTutorLanguage,
  } = useSettingsStore();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-headline font-bold">Einstellungen</h1>

      <div className="space-y-4">
        <ToggleSetting
          label="Englische Hinweise anzeigen"
          labelEn="Show English hints"
          checked={showEnglishHints}
          onChange={setShowEnglishHints}
        />

        <ToggleSetting
          label="Englische Navigation"
          labelEn="Show English navigation"
          checked={showEnglishNav}
          onChange={setShowEnglishNav}
        />

        <div className="rounded-[2rem] bg-surface shadow-sm p-4">
          <p className="font-medium">Tutor-Sprache</p>
          <p className="text-sm text-muted mb-3">Tutor language</p>
          <div className="flex gap-2">
            {(
              [
                { value: "german", label: "Deutsch" },
                { value: "mixed", label: "Gemischt" },
                { value: "english", label: "English" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTutorLanguage(opt.value)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tutorLanguage === opt.value
                    ? "bg-primary text-white"
                    : "bg-background border border-border hover:bg-surface-high"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  labelEn,
  checked,
  onChange,
}: {
  label: string;
  labelEn: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[2rem] bg-surface shadow-sm p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted">{labelEn}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
