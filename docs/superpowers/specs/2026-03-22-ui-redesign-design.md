# UI Redesign: CivicPulse-Inspired Light Theme

## Summary

Full visual redesign of Berlin Leben, adopting the CivicPulse aesthetic: light theme, teal/gold/cyan palette, Space Grotesk + Manrope typography, bento grid dashboard, Material Symbols icons, and glassmorphism effects. Desktop only — no mobile-specific layouts needed.

## Decisions

- **Theme**: Light (#f7f7f3 background, white cards)
- **Navigation**: Upgraded top navbar (not sidebar), no mobile bottom nav
- **Dashboard**: Full bento grid with circular LiD gauge, bold streak card, colorful CTAs, story banner
- **Approach**: Theme-first — lay global foundation, then update pages

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#1b6565` | Main interactive, logo, active states |
| `--primary-container` | `#a5e9e8` | Light teal backgrounds, XP badge |
| `--on-primary` | `#bbfffe` | Text on primary surfaces |
| `--on-primary-container` | `#025858` | Text on primary-container |
| `--secondary` | `#ffd709` | Gold accents, due cards badge, chapter tags |
| `--on-secondary` | `#5b4b00` | Text on secondary surfaces |
| `--tertiary` | `#00e3fd` | Cyan accents, practice CTA |
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
| `--error-container` | `#fb5151` | Error backgrounds |
| `--success` | `#22c55e` | Correct answers (keep existing) |

## Typography

- **Headlines**: `Space Grotesk` — weights 700-900, letter-spacing -0.03em, used for page titles, stat values, card headers
- **Body/Labels**: `Manrope` — weights 400-700, used for body text, descriptions, nav links, labels
- Load via `next/font/google` replacing Geist Sans/Mono

## Icons

Replace all emoji icons with Material Symbols Outlined. Load via Google Fonts link in layout.tsx `<head>`.

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
- Right: Colored pills — streak (gray bg), due cards (gold bg), XP (mint bg)
- Glass effect: semi-transparent bg + backdrop-blur

## Dashboard (Bento Grid)

### Hero Section
```
<header>
  <h1 class="font-headline text-6xl font-black tracking-tighter">
    Hallo, <span class="text-primary">Divyam.</span>
  </h1>
  <p class="text-on-surface-variant text-xl">
    Deine Vorbereitung läuft hervorragend...
  </p>
</header>
```
Decorative blur blob behind the heading.

### Stats Bento Grid (3-column, 12-col grid)

| Cell | Span | Style |
|---|---|---|
| **LiD Gauge** | col-span-4 | White card, SVG circular progress ring, percentage center, "Readiness" label |
| **Streak** | col-span-4 | Primary bg, white text, huge number (text-8xl), motivational subtitle |
| **Daily Practice CTA** | col-span-4 | Tertiary-container bg, due card count, "Jetzt starten" button |

### Story Banner (full-width)
- Spans full grid width
- Gradient background (dark to primary)
- Chapter progress tag (gold pill)
- "Story Mode Starten" headline + description
- Arrow CTA button

### Tutor CTA
- Separate card below the grid linking to /tutor

## Other Pages

Apply the new theme globally. Page-specific changes:

### Story (/story)
- ChapterMap: Cards with `rounded-[2rem]`, primary-container backgrounds for unlocked, `surface-high` for locked with lock icon (Material Symbol)
- ChapterFlow/StoryReader: Warm surface backgrounds, headline font for chapter titles, primary-colored vocab highlights

### Practice (/practice)
- DailyDashboard: Cards with colored category badges (Schwach = error, Fällig = secondary, Stark = primary)
- PracticeSession: Flashcards with `rounded-[2rem]`, primary bg for "show answer" button
- SessionComplete: Big stat numbers in headline font, streak celebration

### Tutor (/tutor)
- Full-page chat restyled with surface containers, primary-colored user messages, rounded message bubbles

### Settings (/settings)
- Surface-container cards with `rounded-[2rem]`, primary toggle switches

## Files Modified

1. `src/app/globals.css` — New color palette, font vars, scrollbar styling for light theme
2. `src/app/layout.tsx` — Space Grotesk + Manrope fonts, Material Symbols link
3. `src/components/layout/Navbar.tsx` — Complete restyle
4. `src/components/layout/ClientProviders.tsx` — Remove max-w-5xl constraint, widen layout
5. `src/app/page.tsx` — Full bento grid dashboard rewrite
6. `src/components/practice/DailyDashboard.tsx` — Restyle cards
7. `src/components/practice/PracticeSession.tsx` — Restyle flashcards
8. `src/components/practice/SessionComplete.tsx` — Restyle stats
9. `src/components/story/ChapterMap.tsx` — Restyle chapter cards
10. `src/components/story/ChapterFlow.tsx` — Minor style updates
11. `src/components/story/StoryReader.tsx` — Restyle prose, vocab highlights
12. `src/components/chat/TutorChat.tsx` — Restyle chat bubbles
13. `src/app/tutor/page.tsx` — Restyle full-page chat
14. `src/app/settings/page.tsx` — Restyle settings cards
15. Exercise components — Update button/card styles to new palette

## Out of Scope

- Mobile-specific layouts (responsive breakpoints, bottom nav)
- Dark mode toggle
- Sidebar navigation
- Character avatar images
- New functionality — this is purely visual
