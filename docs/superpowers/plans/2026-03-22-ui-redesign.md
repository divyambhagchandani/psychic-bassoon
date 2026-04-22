# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Berlin Leben from a dark indigo theme to a light CivicPulse-inspired aesthetic with teal/gold/cyan palette, new typography, bento grid dashboard, and Material Symbols icons.

**Architecture:** Theme-first approach — update globals.css color tokens (with backward-compatible aliases), swap fonts, restyle navbar, then update dashboard and remaining pages. Old Tailwind classes (`bg-card`, `text-muted`, etc.) continue working via aliases, so changes cascade safely.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Zustand, Space Grotesk + Manrope fonts, Material Symbols Outlined

**Spec:** `docs/superpowers/specs/2026-03-22-ui-redesign-design.md`

---

## Task 1: Update Global Theme (globals.css)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the color palette and font vars in globals.css**

Replace the entire file with:

```css
@import "tailwindcss";

:root {
  /* ─── New M3-inspired tokens ─── */
  --primary: #1b6565;
  --primary-hover: #166262;
  --primary-container: #a5e9e8;
  --on-primary-container: #025858;
  --secondary: #ffd709;
  --on-secondary: #5b4b00;
  --tertiary: #00e3fd;
  --tertiary-container: #b3f5ff;
  --on-tertiary: #004d57;
  --background: #f7f7f3;
  --surface: #ffffff;
  --surface-high: #e8e9e4;
  --surface-container: #f1f1ed;
  --on-surface: #2d2f2d;
  --on-surface-variant: #5a5c59;
  --outline: #767774;
  --outline-variant: #adadaa;
  --error: #b31b25;
  --error-container: #ffdad6;
  --success: #22c55e;

  /* ─── Backward-compatible aliases ─── */
  --foreground: var(--on-surface);
  --card: var(--surface);
  --card-hover: var(--surface-high);
  --border: var(--outline-variant);
  --muted: var(--on-surface-variant);
  --accent: var(--primary-container);
  --danger: var(--error);
  --warning: var(--secondary);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-hover: var(--card-hover);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-container: var(--primary-container);
  --color-on-primary-container: var(--on-primary-container);
  --color-secondary: var(--secondary);
  --color-on-secondary: var(--on-secondary);
  --color-tertiary: var(--tertiary);
  --color-tertiary-container: var(--tertiary-container);
  --color-on-tertiary: var(--on-tertiary);
  --color-surface: var(--surface);
  --color-surface-high: var(--surface-high);
  --color-surface-container: var(--surface-container);
  --color-on-surface: var(--on-surface);
  --color-on-surface-variant: var(--on-surface-variant);
  --color-outline: var(--outline);
  --color-outline-variant: var(--outline-variant);
  --color-error: var(--error);
  --color-error-container: var(--error-container);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --color-warning: var(--warning);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --font-headline: var(--font-space-grotesk);
  --font-body: var(--font-manrope);
  --font-sans: var(--font-manrope);
}

body {
  background: var(--background);
  color: var(--on-surface);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background: var(--outline-variant);
  border-radius: 3px;
}
```

- [ ] **Step 2: Verify the app still renders**

Run: `npm run dev` and check browser — all pages should now show with the light color palette. Existing classes like `bg-card`, `text-muted`, `border-border` work via aliases.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: switch to light CivicPulse color palette with M3 tokens"
```

---

## Task 2: Update Fonts and Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace font imports and add Material Symbols**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berlin Leben — Lerne Deutsch & bestehe den LiD-Test",
  description:
    "Gamified German learning and Leben in Deutschland exam prep for Berlin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify fonts load**

Run: `npm run dev` — check that body text renders in Manrope. Open DevTools → Elements → check `font-family` on body.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: switch to Space Grotesk + Manrope fonts, add Material Symbols"
```

---

## Task 3: Restyle Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Rewrite the Navbar with CivicPulse styling**

Replace the entire file with:

```tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";

const navItems = [
  { href: "/", label: "Startseite", icon: "grid_view" },
  { href: "/story", label: "Geschichte", icon: "auto_stories" },
  { href: "/practice", label: "Üben", icon: "fitness_center" },
  { href: "/tutor", label: "Tutor", icon: "forum" },
];

export default function Navbar() {
  const pathname = usePathname();
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const totalXp = useStreakStore((s) => s.totalXp);
  const cards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const dueCount = useMemo(() => getDueCards().length, [cards, getDueCards]);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-20 bg-[#f7f7f3]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(27,101,101,0.06)]">
      <Link
        href="/"
        className="text-2xl font-black text-primary tracking-tighter font-headline"
      >
        Berlin Leben
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 font-headline font-bold tracking-tight transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface/70 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-surface-high rounded-full px-4 py-2">
          <span className="material-symbols-outlined text-primary text-sm">
            local_fire_department
          </span>
          <span className="text-xs font-bold font-headline">
            {currentStreak} TAGE
          </span>
        </div>

        {dueCount > 0 && (
          <Link
            href="/practice"
            className="flex items-center gap-1 bg-secondary rounded-full px-4 py-2"
          >
            <span className="text-xs font-bold text-on-secondary">
              {dueCount} fällig
            </span>
          </Link>
        )}

        <div className="flex items-center gap-1 bg-primary-container rounded-full px-4 py-2">
          <span className="material-symbols-outlined text-on-primary-container text-sm">
            bolt
          </span>
          <span className="text-xs font-bold text-on-primary-container">
            {totalXp}
          </span>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify navbar renders**

Run: `npm run dev` — check navbar is taller (80px), has glassmorphism backdrop, teal logo, colored pills for streak/due/XP.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "style: restyle navbar with glassmorphism, colored pills, headline font"
```

---

## Task 4: Widen Layout

**Files:**
- Modify: `src/components/layout/ClientProviders.tsx`

- [ ] **Step 1: Change max-w-5xl to max-w-7xl**

In `ClientProviders.tsx`, change the `<main>` className from:
```
mx-auto w-full max-w-5xl flex-1 px-4 py-6
```
to:
```
mx-auto w-full max-w-7xl flex-1 px-8 py-8
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/ClientProviders.tsx
git commit -m "style: widen main layout to max-w-7xl"
```

---

## Task 5: Rewrite Dashboard with Bento Grid

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite the dashboard page**

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { useStreakStore } from "@/stores/streakStore";
import { useSRStore } from "@/stores/srStore";
import { useProgressStore } from "@/stores/progressStore";
import { useEffect, useMemo } from "react";

export default function Dashboard() {
  const { currentStreak, longestStreak, totalXp, todayXp, checkStreakStatus } =
    useStreakStore();
  const getLevel = useStreakStore((s) => s.getLevel);
  const cards = useSRStore((s) => s.cards);
  const getDueCards = useSRStore((s) => s.getDueCards);
  const getLidReadiness = useSRStore((s) => s.getLidReadiness);
  const chapterScores = useProgressStore((s) => s.chapterScores);
  const unlockedChapters = useProgressStore((s) => s.unlockedChapters);

  useEffect(() => {
    checkStreakStatus();
  }, [checkStreakStatus]);

  const dueCards = useMemo(() => getDueCards(), [cards, getDueCards]);
  const lidReadiness = useMemo(() => getLidReadiness(), [cards, getLidReadiness]);
  const completedChapters = Object.keys(chapterScores).length;
  const level = getLevel();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10" />
        <h1 className="font-headline text-6xl font-black text-on-surface tracking-tighter mb-4">
          Willkommen zurück!
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          Level {level} · {totalXp} XP gesamt · {todayXp} XP heute
        </p>
      </header>

      {/* Bento Grid */}
      <section className="grid grid-cols-12 gap-8">
        {/* LiD Readiness Gauge */}
        <div className="col-span-4 bg-surface p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
          <LidGauge percentage={lidReadiness} />
          <h3 className="font-headline text-lg font-bold mt-6 text-on-surface">
            LiD Readiness
          </h3>
        </div>

        {/* Streak Counter */}
        <div className="col-span-4 bg-primary p-8 rounded-[2rem] text-white flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-[120px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-container">
              Lern-Serie
            </span>
            <h2 className="font-headline text-8xl font-black mt-4 leading-none tracking-tighter">
              {currentStreak}
            </h2>
          </div>
          <p className="font-body text-lg font-medium">
            {currentStreak === 1
              ? "Tag in Folge! Weiter so!"
              : "Tage in Folge! Bleib dran!"}
          </p>
        </div>

        {/* Daily Practice CTA */}
        <div className="col-span-4 bg-tertiary-container p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div>
            <div className="h-12 w-12 bg-white/30 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-tertiary">
                history_edu
              </span>
            </div>
            <h3 className="font-headline text-3xl font-black text-on-tertiary leading-tight mb-2">
              Tägliche Übung
            </h3>
            <p className="font-body text-sm text-on-tertiary/80">
              {dueCards.length > 0
                ? `${dueCards.length} Karten warten auf dich.`
                : "Alles erledigt für heute!"}
            </p>
          </div>
          {dueCards.length > 0 && (
            <Link
              href="/practice"
              className="bg-on-tertiary text-tertiary-container py-3 px-6 rounded-xl font-headline font-bold text-sm self-start hover:opacity-90 transition-all active:scale-95"
            >
              Jetzt starten
            </Link>
          )}
        </div>

        {/* Story Banner */}
        <Link
          href="/story"
          className="col-span-12 relative group cursor-pointer overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1b3535] via-[#1b5555] to-primary flex items-center p-10"
        >
          <div className="relative z-10 w-full flex items-center justify-between">
            <div>
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Kapitel {completedChapters + 1} von 10
              </span>
              <h2 className="font-headline text-5xl font-black text-white tracking-tighter mb-2 leading-none">
                Story fortsetzen
              </h2>
              <p className="text-white/80 font-body text-lg">
                Tauche ein in dein Berliner Abenteuer.
              </p>
            </div>
            <span className="material-symbols-outlined text-white/40 text-6xl group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </div>
        </Link>

        {/* Tutor CTA */}
        <Link
          href="/tutor"
          className="col-span-12 bg-surface p-8 rounded-[2rem] shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow"
        >
          <div className="h-14 w-14 bg-primary-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">
              forum
            </span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-on-surface">
              Mit dem Tutor sprechen
            </h3>
            <p className="font-body text-on-surface-variant">
              Frag auf Deutsch — dein KI-Tutor hilft dir weiter.
            </p>
          </div>
          <span className="material-symbols-outlined text-outline ml-auto group-hover:text-primary transition-colors">
            chevron_right
          </span>
        </Link>
      </section>
    </div>
  );
}

function LidGauge({ percentage }: { percentage: number }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="var(--surface-high)"
          strokeWidth="12"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-5xl font-black text-on-surface">
          {percentage}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
          Readiness
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard renders**

Run: `npm run dev` — check dashboard shows hero with blur blob, 3-column bento grid (gauge, streak, practice CTA), full-width story banner, and tutor card.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "style: rewrite dashboard with bento grid, LiD gauge, streak card"
```

---

## Task 6: Restyle Practice Pages

**Files:**
- Modify: `src/components/practice/DailyDashboard.tsx`
- Modify: `src/components/practice/PracticeSession.tsx`
- Modify: `src/components/practice/SessionComplete.tsx`

- [ ] **Step 1: Read current files**

Read all three files to understand the current markup and class names.

- [ ] **Step 2: Update DailyDashboard.tsx**

Apply these class replacements throughout the file:
- `rounded-xl` → `rounded-[2rem]`
- `border-border bg-card` → `border-outline-variant/20 bg-surface`
- Add `shadow-sm` to main cards
- Add `font-headline` to stat numbers and headings
- Replace emoji icons with Material Symbols: use `<span className="material-symbols-outlined text-error">warning</span>` for Schwach, `<span className="material-symbols-outlined text-secondary">schedule</span>` for Fällig, `<span className="material-symbols-outlined text-primary">check_circle</span>` for Stark
- Start button: `bg-primary text-white` → keep, add `rounded-xl font-headline font-bold hover:bg-primary-hover active:scale-95 transition-all`

- [ ] **Step 3: Update PracticeSession.tsx**

Apply these changes:
- Flashcard container: `rounded-xl border border-border bg-card` → `rounded-[2rem] border border-outline-variant/20 bg-surface shadow-sm`
- "Antwort zeigen" button: add `font-headline font-bold`
- Right/Wrong buttons: keep existing `bg-success`/`bg-danger` → these map to new values via aliases
- Add `font-headline` to card front/back text

- [ ] **Step 4: Update SessionComplete.tsx**

Apply these changes:
- Container: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Stat numbers: add `font-headline font-black`
- Accuracy percentage: add `text-4xl font-headline font-black`
- CTA buttons: add `font-headline font-bold rounded-xl active:scale-95 transition-all`

- [ ] **Step 5: Verify practice flow**

Run: `npm run dev`, navigate to /practice — check that DailyDashboard, flashcards, and completion screen all render with updated styling.

- [ ] **Step 6: Commit**

```bash
git add src/components/practice/DailyDashboard.tsx src/components/practice/PracticeSession.tsx src/components/practice/SessionComplete.tsx
git commit -m "style: restyle practice pages with new theme"
```

---

## Task 7: Restyle Story Pages

**Files:**
- Modify: `src/components/story/ChapterMap.tsx`
- Modify: `src/components/story/ChapterFlow.tsx`
- Modify: `src/components/story/StoryReader.tsx`
- Modify: `src/components/story/ChapterResults.tsx`
- Modify: `src/components/story/VocabPreview.tsx`

- [ ] **Step 1: Read current files**

Read all five files to understand the current markup.

- [ ] **Step 2: Update ChapterMap.tsx**

Apply these changes:
- Chapter cards: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Unlocked cards: add `hover:shadow-md transition-shadow`
- Locked cards: `bg-card opacity-50` → `bg-surface-high opacity-60` with a lock icon: `<span className="material-symbols-outlined text-outline">lock</span>`
- Completed badge: add `font-headline font-bold`
- Score display: add `font-headline`
- Replace any emoji with Material Symbols

- [ ] **Step 3: Update ChapterFlow.tsx**

- Container backgrounds: `bg-card` → `bg-surface`
- Phase transition buttons: add `font-headline font-bold rounded-xl active:scale-95 transition-all`
- Progress indicators: keep existing patterns, colors cascade via aliases

- [ ] **Step 4: Update StoryReader.tsx**

- Story text container: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Paragraph text: add `font-body text-lg leading-relaxed text-on-surface-variant`
- Vocab highlighted words: keep `text-primary border-b border-primary/30` (works via alias)
- "Next" button: add `font-headline font-bold`

- [ ] **Step 5: Update ChapterResults.tsx**

- Score circle: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Score percentage: `text-4xl font-bold` → `text-5xl font-headline font-black`
- XP earned: add `font-headline font-bold text-primary`
- Action buttons: add `font-headline font-bold rounded-xl active:scale-95 transition-all`
- Replace emoji with Material Symbols where used

- [ ] **Step 6: Update VocabPreview.tsx**

- Vocab cards: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- German word: add `font-headline font-bold text-lg`
- Article/plural: `text-muted` → keep (alias works)
- Example sentence: `text-muted italic` → keep
- "Continue" button: add `font-headline font-bold`

- [ ] **Step 7: Verify story flow**

Run: `npm run dev`, navigate to /story and click through a chapter — check chapter map, story reader, vocab preview, exercises, and results all render correctly.

- [ ] **Step 8: Commit**

```bash
git add src/components/story/ChapterMap.tsx src/components/story/ChapterFlow.tsx src/components/story/StoryReader.tsx src/components/story/ChapterResults.tsx src/components/story/VocabPreview.tsx
git commit -m "style: restyle story pages with new theme"
```

---

## Task 8: Restyle Exercise Components

**Files:**
- Modify: `src/components/exercises/ExercisePlayer.tsx`
- Modify: `src/components/exercises/ExerciseResult.tsx`
- Modify: `src/components/exercises/McqExercise.tsx`
- Modify: `src/components/exercises/FillBlankExercise.tsx`
- Modify: `src/components/exercises/SentenceBuildExercise.tsx`
- Modify: `src/components/exercises/MatchingExercise.tsx`
- Modify: `src/components/exercises/ReadingExercise.tsx`
- Modify: `src/components/exercises/BlitzExercise.tsx`

- [ ] **Step 1: Read all exercise component files**

Read all eight files.

- [ ] **Step 2: Update ExercisePlayer.tsx**

- Progress bar track: `h-2 rounded-full bg-card` → `h-2 rounded-full bg-surface-high`
- Progress bar fill: keep `bg-primary` (alias works)
- Container: add `rounded-[2rem]` if needed

- [ ] **Step 3: Update ExerciseResult.tsx**

- Success card: `border-success/30 bg-success/5` → `border-success/30 bg-success/5` (keep — aliases work)
- Error card: `border-danger/30 bg-danger/5` → keep (aliases map danger→error color)
- Icon replacement: `✅` → `<span className="material-symbols-outlined text-success" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>`
- Icon replacement: `❌` → `<span className="material-symbols-outlined text-danger" style={{fontVariationSettings: "'FILL' 1"}}>cancel</span>`

- [ ] **Step 4: Update McqExercise.tsx**

- Option buttons: `rounded-xl border border-border bg-card` → `rounded-xl border border-outline-variant/20 bg-surface hover:bg-surface-high`
- Selected correct: keep `bg-success/20 border-success` (aliases work)
- Selected wrong: keep `bg-danger/20 border-danger` (aliases work)
- Question text: add `font-headline font-bold text-lg`

- [ ] **Step 5: Update FillBlankExercise.tsx**

- Input field: `border border-border bg-card` → `border border-outline-variant bg-surface`
- Focus state: keep `focus:border-primary`
- Hint text: keep `text-muted`
- Submit button: add `font-headline font-bold`

- [ ] **Step 6: Update SentenceBuildExercise.tsx**

- Word tiles: `rounded-lg border border-border bg-card` → `rounded-xl border border-outline-variant/20 bg-surface shadow-sm`
- Selected tiles: keep `bg-primary/20 text-primary`
- Drop zone: `border-dotted border-border` → `border-dotted border-outline-variant`

- [ ] **Step 7: Update MatchingExercise.tsx**

- Match cards: `rounded-xl border border-border bg-card` → `rounded-xl border border-outline-variant/20 bg-surface`
- Matched pairs: keep `border-success bg-success/10`
- Active selection: keep `border-primary`

- [ ] **Step 8: Update ReadingExercise.tsx**

- Passage container: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Passage text: add `font-body text-lg leading-relaxed`
- MCQ options: same pattern as McqExercise

- [ ] **Step 9: Update BlitzExercise.tsx**

- Timer bar: keep color logic (`bg-danger`, `bg-warning`, `bg-primary`)
- Options: `rounded-xl border border-border bg-card` → `rounded-xl border border-outline-variant/20 bg-surface hover:bg-surface-high`
- Timer text: add `font-headline font-bold`

- [ ] **Step 10: Verify exercises**

Run: `npm run dev`, navigate to a chapter and play through exercises — check all exercise types render correctly with new styling.

- [ ] **Step 11: Commit**

```bash
git add src/components/exercises/
git commit -m "style: restyle all exercise components with new theme"
```

---

## Task 9: Restyle Chat, German Components, Tutor, and Settings

**Files:**
- Modify: `src/components/chat/TutorChat.tsx`
- Modify: `src/app/tutor/page.tsx`
- Modify: `src/components/german/VocabHighlight.tsx`
- Modify: `src/components/german/BilingualLabel.tsx`
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: Read all files**

Read all five files.

- [ ] **Step 2: Update TutorChat.tsx**

- Chat panel: `bg-card border-border` → `bg-surface border-outline-variant/20 shadow-2xl`
- Add `rounded-[2rem]` to the panel
- User messages: `bg-primary text-white` → keep
- Bot messages: `bg-card` → `bg-surface-high`
- Input area: `bg-card border-border` → `bg-surface border-outline-variant`
- Toggle button: replace emoji with Material Symbol `<span className="material-symbols-outlined">forum</span>`
- Send button: add `active:scale-95 transition-all`

- [ ] **Step 3: Update tutor/page.tsx**

- Chat container: apply same styles as TutorChat panel
- Header: add `font-headline font-bold`
- Messages area: `bg-background` → keep (alias works for light bg)

- [ ] **Step 4: Update VocabHighlight.tsx**

- Tooltip container: `bg-card border-border` → `bg-surface border-outline-variant/20 shadow-lg`
- Word styling: keep `text-primary border-b border-primary/30`
- Tooltip text: keep `text-muted`/`text-foreground` (aliases work)

- [ ] **Step 5: Update BilingualLabel.tsx**

- `text-muted` → keep (alias works)

- [ ] **Step 6: Update settings/page.tsx**

- Section cards: `rounded-xl border border-border bg-card` → `rounded-[2rem] bg-surface shadow-sm`
- Toggle switches: `bg-primary` when active → keep; `bg-border` when inactive → keep (alias works)
- Heading: add `font-headline font-bold`
- Radio buttons: active `bg-primary text-white` → keep; inactive add `hover:bg-surface-high`

- [ ] **Step 7: Verify all pages**

Run: `npm run dev` and check:
- /tutor — full-page chat
- /settings — toggle/radio styling
- Floating chat widget (bottom-right toggle)
- Vocab tooltips in story reader

- [ ] **Step 8: Commit**

```bash
git add src/components/chat/TutorChat.tsx src/app/tutor/page.tsx src/components/german/VocabHighlight.tsx src/components/german/BilingualLabel.tsx src/app/settings/page.tsx
git commit -m "style: restyle chat, tutor, vocab, and settings with new theme"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full app walkthrough**

Run: `npm run dev` and walk through every page:
1. Dashboard (/) — bento grid, gauge, streak, story banner, tutor card
2. Story (/story) — chapter map
3. Practice (/practice) — daily dashboard
4. Tutor (/tutor) — full-page chat
5. Settings (/settings) — toggles and radio buttons
6. Floating chat widget — toggle open/close

- [ ] **Step 2: Check for any remaining dark-theme artifacts**

Search for any hardcoded dark colors:
```bash
grep -rn "#0f0f13\|#1a1a24\|#22222e\|#2a2a3a\|#6366f1\|#818cf8\|#a78bfa\|#ef4444\|#f59e0b" src/
```

Fix any found.

- [ ] **Step 3: Run build check**

```bash
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "style: fix remaining dark-theme artifacts"
```
