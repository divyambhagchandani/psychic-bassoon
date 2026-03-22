import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsState, SettingsActions } from "@/types/store";

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      showEnglishHints: true,
      showEnglishNav: true,
      tutorLanguage: "mixed",

      setShowEnglishHints: (show: boolean) => set({ showEnglishHints: show }),
      setShowEnglishNav: (show: boolean) => set({ showEnglishNav: show }),
      setTutorLanguage: (lang: SettingsState["tutorLanguage"]) =>
        set({ tutorLanguage: lang }),
    }),
    { name: "berlin-leben-settings" }
  )
);
