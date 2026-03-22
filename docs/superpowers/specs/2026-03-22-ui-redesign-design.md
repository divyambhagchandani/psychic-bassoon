# UI Redesign: CivicPulse-Inspired Light Theme

## Summary

Full visual redesign of Berlin Leben, adopting the CivicPulse aesthetic: light theme, teal/gold/cyan palette, Space Grotesk + Manrope typography, bento grid dashboard, Material Symbols icons, and glassmorphism effects. Desktop only — no mobile-specific layouts needed.

## Decisions

- **Theme**: Light (#f7f7f3 background, white cards)
- **Navigation**: Upgraded top navbar (not sidebar), no mobile bottom nav
- **Dashboard**: Full bento grid with circular LiD gauge, bold streak card, colorful CTAs, story banner
- **Approach**: Theme-first — lay global foundation, then update pages

## Color Palette

### New tokens (M3-inspired)

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#1b6565` | Main interactive, logo, active states |
| `--primary-hover` | `#166262` | Hover state for primary buttons |
| `--primary-container` | `#a5e9e8` | Light teal backgrounds, XP badge |
| `--on-primary-container` | `#025858` | Text on primary-container |
| `--secondary` | `#ffd709` | Gold accents, due cards badge, chapter tags |
| `--on-secondary` | `#5b4b00` | Text on secondary surfaces |
| `--tertiary` | `#00e3fd` | Cyan accents, practice CTA |
| `--tertiary-container` | `#b3f5ff` | Light cyan backgrounds for practice CTA card |
| `--on-tertiary` | `#004d57` | Text on tertiary surfaces |
| `--background` | `#f7f7f3` | Page background |
| `--surface` | `#ffffff` | Card/container background |
| `--surface-high` | `#e8e9e4` | Elevated surface, input backgrounds |
| `--surface-container` | `#f1f1ed` | Slightly tinted surfaces |
| `--on-surface` | `#2d2f2d` | Primary text |
| `--on-surface-variant` | `#5a5c59` | Secondary text |
| `--outline` | `#767774` | Borders, dividers |
| `--outline-variant` | `#adadaa` | Subtle borders |
| `--error` | `#b31b25` | Error states, wrong answers |
| `--error-container` | `#ffdad6` | Light error backgrounds |
| `--success` | `#22c55e` | Correct answers |

### Migration: old token aliases

The existing codebase uses simpler token names. To enable incremental migration, `globals.css` will define **both** old and new token names. The old names become aliases pointing to new values:

| Old Token | Maps To | New Value |
|---|---|---|
| `--foreground` | `--on-surface` | `#2d2f2d` |
| `--card` | `--surface` | `#ffffff` |
| `--card-hover` | `--surface-high` | `#e8e9e4` |
| `--border` | `--outline-variant` | `#adadaa` |
| `--primary` | (same name) | `#1b6565` |
| `--primary-hover` | (same name) | `#166262` |
| `--muted` | `--on-surface-variant` | `#5a5c59` |
| `--accent` | `--primary-container` | `#a5e9e8` |
| `--danger` | `--error` | `#b31b25` |
| `--warning` | `--secondary` | `#ffd709` |
| `--success` | (same name) | `#22c55e` |

This means all existing utility classes (`bg-card`, `text-muted`, `border-border`, `text-danger`, etc.) continue to work with the new color values. New components can use the M3-style names. A follow-up cleanup PR can migrate old names to new if desired.

## Typography

- **Headlines**: `Space Grotesk` — weights 700-900, letter-spacing -0.03em, used for page titles, stat values, card headers
- **Body/Labels**: `Manrope` — weights 400-700, used for body text, descriptions, nav links, labels
- Load via `next/font/google` replacing Geist Sans/Mono
- Register as `--font-headline` and `--font-body` CSS vars

## Icons

Replace all emoji icons with Material Symbols Outlined. Load via `<link>` in the root layout's `<head>` section using Next.js metadata or direct `<link>` tag:

```
https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap
```

Helper component pattern:
```tsx
function Icon({ name, fill, className }: { name: string; fill?: boolean; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
```

| Current | New |
|---|---|
| `🔥` streak | `local_fire_department` |
| `⚡` XP | `bolt` |
| `📝` practice | `history_edu` |
| `📖` story | `auto_stories` |
| `🤖` tutor | `forum` |
| `✅` correct | `check_circle` (FILL 1) |
| `❌` wrong | `cancel` (FILL 1) |

## Shape & Effects

- **Border radius**: Cards use `rounded-[2rem]`, buttons `rounded-xl`, pills `rounded-full`
- **Glassmorphism navbar**: `bg-[#f7f7f3]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(27,101,101,0.06)]`
- **Micro-interactions**: `hover:scale-[1.02] active:scale-95 transition-all` on buttons/cards
- **Decorative blurs**: Colored gradient blobs behind hero text (`bg-primary-container/20 blur-3xl`)

## Navbar

- Height: `h-20` (80px), full-width with `px-8`
- Left: "Berlin Leben" in primary, black weight, headline font
- Center: Nav links in headline font, bold, active state = underline border-b-2
- Right: Colored pills — streak (surface-high bg), due cards (secondary bg), XP (primary-container bg)
- Glass effect: semi-transparent bg + backdrop-blur
- Buttons/text on primary use `text-white` (not on-primary) for maximum contrast

## Dashboard (Bento Grid)

### Hero Section
```html
<header class="relative mb-12">
  <div class="absolute -top-10 -left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
  <h1 class="font-headline text-6xl font-black text-on-surface tracking-tighter mb-4">
    Willkommen zurück!
  </h1>
  <p class="font-body text-xl text-on-surface-variant max-w-2xl leading-relaxed">
    Level {level} · {totalXp} XP gesamt · {todayXp} XP heute
  </p>
</header>
```
Uses generic greeting (not personalized — app has no user name).

### Stats Bento Grid (3-column, 12-col grid)

| Cell | Span | Style |
|---|---|---|
| **LiD Gauge** | col-span-4 | White card (`bg-surface`), SVG circular progress ring (stroke-width 12, radius 88, colors: track=`surface-high`, fill=`primary`), percentage in center (font-headline text-5xl font-black), "Readiness" label below |
| **Streak** | col-span-4 | `bg-primary` card, `text-white`, huge number (font-headline text-8xl font-black), motivational subtitle |
| **Daily Practice CTA** | col-span-4 | `bg-tertiary-container` card, `text-on-tertiary`, due card count, button with `bg-on-tertiary text-tertiary-container` |

### Story Banner (full-width)
- Spans full grid width (col-span-12)
- Gradient: `bg-gradient-to-r from-[#1b3535] via-[#1b5555] to-[#1b6565]`
- Chapter progress tag: gold pill (`bg-secondary text-on-secondary`)
- "Story fortsetzen" headline in white + description
- Arrow CTA button: `bg-tertiary text-white`

### Tutor CTA
- Separate card below the grid linking to /tutor
- `bg-surface` with primary border accent

## Other Pages

Apply the new theme globally. Since old token aliases are preserved, all pages get the light theme automatically when `globals.css` changes. Page-specific polish:

### Story (/story)
- ChapterMap: Cards with `rounded-[2rem]`, `bg-surface` for unlocked, `bg-surface-high` + grayscale + lock icon for locked
- ChapterFlow/StoryReader: `bg-surface` backgrounds, headline font for chapter titles, primary-colored vocab highlights

### Practice (/practice)
- DailyDashboard: Cards with colored category badges (Schwach = error, Fällig = secondary, Stark = primary)
- PracticeSession: Flashcards with `rounded-[2rem]`, `bg-primary text-white` for "show answer" button
- SessionComplete: Big stat numbers in headline font, streak celebration

### Tutor (/tutor)
- Full-page chat restyled with `bg-surface-container`, `bg-primary text-white` for user messages, rounded message bubbles

### Settings (/settings)
- `bg-surface-container` cards with `rounded-[2rem]`, `bg-primary` toggle switches

## Layout

- `ClientProviders.tsx`: Change `max-w-5xl` to `max-w-7xl` for wider bento grid, keep centered layout with `mx-auto`
- Navbar: full-width (not constrained)
- Individual pages that need narrow layouts (tutor chat, settings) apply their own `max-w-` constraints

## Files Modified

### Foundation (Phase 1)
1. `src/app/globals.css` — New color palette (both new M3 tokens and old aliases), font vars, light scrollbar styling
2. `src/app/layout.tsx` — Space Grotesk + Manrope via next/font/google, Material Symbols `<link>`
3. `src/components/layout/Navbar.tsx` — Complete restyle: taller, glassmorphism, colored pills, headline font
4. `src/components/layout/ClientProviders.tsx` — Change max-w-5xl to max-w-7xl

### Dashboard (Phase 2)
5. `src/app/page.tsx` — Full bento grid dashboard rewrite with hero, gauge, streak, CTAs

### Practice Pages (Phase 3)
6. `src/app/practice/page.tsx` — Page wrapper styling
7. `src/components/practice/DailyDashboard.tsx` — Restyle cards
8. `src/components/practice/PracticeSession.tsx` — Restyle flashcards
9. `src/components/practice/SessionComplete.tsx` — Restyle stats

### Story Pages (Phase 4)
10. `src/app/story/page.tsx` — Page wrapper styling
11. `src/app/story/[chapterId]/page.tsx` — Dynamic route styling
12. `src/components/story/ChapterMap.tsx` — Restyle chapter cards
13. `src/components/story/ChapterFlow.tsx` — Minor style updates
14. `src/components/story/StoryReader.tsx` — Restyle prose, vocab highlights
15. `src/components/story/ChapterResults.tsx` — Restyle score display
16. `src/components/story/VocabPreview.tsx` — Restyle vocab cards

### Exercise Components (Phase 5)
17. `src/components/exercises/ExercisePlayer.tsx` — Progress bar, button styles
18. `src/components/exercises/ExerciseResult.tsx` — Feedback card styles
19. `src/components/exercises/McqExercise.tsx` — Option buttons
20. `src/components/exercises/FillBlankExercise.tsx` — Input, feedback styles
21. `src/components/exercises/SentenceBuildExercise.tsx` — Word tile styles
22. `src/components/exercises/MatchingExercise.tsx` — Pair card styles
23. `src/components/exercises/ReadingExercise.tsx` — Passage, MCQ styles
24. `src/components/exercises/BlitzExercise.tsx` — Timer, option styles

### Chat & German Components (Phase 6)
25. `src/components/chat/TutorChat.tsx` — Restyle chat bubbles
26. `src/app/tutor/page.tsx` — Restyle full-page chat
27. `src/components/german/VocabHighlight.tsx` — Tooltip styles
28. `src/components/german/BilingualLabel.tsx` — Text color

### Settings (Phase 7)
29. `src/app/settings/page.tsx` — Restyle settings cards

## Out of Scope

- Mobile-specific layouts (responsive breakpoints, bottom nav)
- Dark mode toggle
- Sidebar navigation
- Character avatar images
- New functionality — this is purely visual
- Migrating old token names to new M3 names (can be a follow-up)
