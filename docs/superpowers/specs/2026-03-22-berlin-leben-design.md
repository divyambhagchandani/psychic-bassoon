# Berlin Leben — Design Spec

A gamified web app for learning German (A2→B1) and preparing for the Leben in Deutschland exam (Berlin), built as a personal tool.

## Problem

The user needs to learn German and pass the LiD exam for Berlin within a month. Existing tools (Duolingo, Anki, exam prep PDFs) treat these as separate goals. A unified, engaging, German-first experience that adapts to weak areas doesn't exist.

## Solution

A hybrid app with two modes: **Story Mode** (narrative chapters introducing new content) and **Tägliche Übung** (daily spaced-repetition review). LiD civic knowledge is taught entirely in German through realistic Berlin life scenarios, with Claude AI as an integrated tutor and content generator.

## Design Principles

- **German-first**: UI and content in German. Translations appear as hover hints or inline parentheticals, never as the primary language.
- **No lectures**: Content is delivered through character conversations and real situations, not textbook explanations.
- **Adaptive simplicity**: SM-2 spaced repetition tracks wrong answers and resurfaces them at increasing intervals. No complex ML — just proven flashcard science.
- **Not propaganda**: Characters have opinions. They explain the system but also critique it. The tone is authentic and human.

---

## Characters

Six recurring characters, all in their 20s, reflecting Berlin's diversity:

| Character | Background | Role | Personality |
|-----------|-----------|------|-------------|
| **Leyla** (28) | Turkish-German, Neukölln | Law student | Explains your rights unprompted. Passionate about Grundgesetz but roasts bureaucracy. Go-to for legal/admin situations. |
| **Minh** (25) | Vietnamese-German, parents via DDR worker programs | Startup worker, Mitte | History nerd who tells it through his family's story. Your WG-mate. |
| **Jule** (26) | Non-binary, from Sachsen | Kita worker, Friedrichshain | Activist energy. Knows education system and Grundrechte from lived experience. Always organizing something. |
| **Olu** (29) | Nigerian, 4 years in Berlin | Nurse at Charité | Navigated the entire Sozialversicherung maze. Dry humor. Calls you to decode official letters. |
| **Franzi** (24) | From München | Poli-sci student at FU | Idealistic, debates politics at every Späti visit. Your other WG-mate. Gets heated about coalitions. |
| **Karim** (27) | Syrian, arrived 2015 | Runs an Imbiss in Kreuzberg | Did the LiD exam himself. Pragmatic, funny, brutally honest about integration life. |

---

## Chapters

10 chapters, each anchored by a character and a Berlin life scenario that maps to LiD exam topics:

### Kapitel 1 — Der Brief vom Amt (mit Leyla)
A confusing official letter arrives. Leyla translates the Beamtendeutsch and rants about how the system works.
**LiD:** Meldepflicht, Behörden, Föderalismus, Amtssprache

### Kapitel 2 — Stolpersteine (mit Minh)
Walking through Mitte, Minh stops at a Stolperstein and tells you about his grandparents' journey from Vietnam to the DDR.
**LiD:** NS-Zeit, DDR, Wiedervereinigung, Erinnerungskultur

### Kapitel 3 — Krankenschein (mit Olu)
You're sick. Olu walks you through the Krankenkasse system — public vs private, what's covered, how to call in sick.
**LiD:** Sozialversicherung, Krankenversicherung, Pflegeversicherung

### Kapitel 4 — Wahlkampf im Späti (mit Franzi)
Election posters are everywhere. Over beers, Franzi explains Erst- und Zweitstimme, parties, and why Berlin politics is its own circus.
**LiD:** Bundestag, Wahlen, Parteien, Demokratie, Koalition

### Kapitel 5 — Demo am Samstag (mit Jule)
Jule invites you to a protest. On the way, they explain Versammlungsfreiheit, Meinungsfreiheit, and what the police can and can't do.
**LiD:** Grundrechte Art. 1-19, Versammlungsfreiheit, Meinungsfreiheit, Rechtsstaat

### Kapitel 6 — Steuererklärung und Schmerz (mit Karim)
Tax season. Karim is doing his Steuererklärung for the Imbiss and roping you in.
**LiD:** Steuern, Arbeitsrecht, Gewerkschaften, Gewerbefreiheit

### Kapitel 7 — Ärger mit dem Vermieter (mit Leyla)
Your landlord is being shady. Leyla switches into lawyer mode — tenant rights, Mietvertrag clauses, where to complain.
**LiD:** Grundrechte, Mietrecht, Verbraucherschutz, Rechtsweg

### Kapitel 8 — Kindergeburtstag Chaos (mit Jule)
You help Jule organize a birthday at the Kita. Conversations with parents reveal the Bildungssystem.
**LiD:** Bildungssystem, Schulpflicht, Erziehung, Jugendschutz

### Kapitel 9 — WG-Abend: Europa und die Welt (mit Minh & Franzi)
A WG dinner debate about the EU, NATO, and Germany's role in the world.
**LiD:** EU, NATO, UNO, Weimarer Republik, Grundgesetz history

### Kapitel 10 — Karim's Imbiss-Eröffnung (alle zusammen)
Karim's Imbiss reopens. Everyone's there. A celebration chapter weaving Berlin-specific LiD questions through conversations with the whole cast.
**LiD:** Berlin: Abgeordnetenhaus, Bezirke, Landeswappen, comprehensive review

---

## Chapter Flow

Each chapter follows this sequence:

1. **Story Intro** — Narrative text in German, with highlighted vocab (hover for translation)
2. **Vocab Preview** — Key words for the chapter with translations
3. **Exercises** — 5-8 mixed-type questions (see Exercise Types below)
4. **Results** — Score breakdown, weak areas flagged, wrong answers explained
5. **Blitz Bonus** — Optional timed MCQ sprint for extra XP

---

## Exercise Types

Listed by priority (MCQ is primary to match LiD exam format):

| Type | Description | Purpose |
|------|-------------|---------|
| **Multiple Choice** | 4-option questions in German, mirroring LiD format | Primary — exam preparation |
| **Fill-in-the-Blank** | Type the missing German word | Active recall, spelling |
| **Sentence Building** | Drag words into correct German word order | Grammar (word order, cases) |
| **Matching Pairs** | Connect German terms to definitions | Vocab clusters |
| **Reading Comprehension** | Read a German paragraph, answer questions | Comprehension at A2-B1 |
| **Blitz Round** | Timed MCQ sprint at end of chapter | Speed, exam pressure |

---

## Two Modes

### Story Mode
- Linear chapter progression
- Unlock next chapter at 70%+ score on current chapter
- New content, narrative, character interactions
- Typical session: 20-40 minutes

### Tägliche Übung (Daily Practice)
- Dashboard showing: streak counter, due review cards, weak areas
- Pulls cards from spaced repetition queue, weakest first
- Typical session: 10-15 minutes
- Available independent of story progress

---

## Spaced Repetition — SM-2

Every exercise answer creates a review card:

- **Correct** → interval increases: 1d → 3d → 7d → 14d → 30d
- **Incorrect** → interval resets to 1d, tagged as "schwach"
- Each card has an **ease factor** (starting at 2.5) that adjusts based on performance
- Daily practice pulls all cards where `nextReview <= today`, sorted by: schwach first, then by ease factor ascending

Card data model:
```json
{
  "id": "string",
  "question": "Was ist Meldepflicht?",
  "answer": "Die Pflicht, sich bei der Meldebehörde anzumelden",
  "chapter": 1,
  "exerciseType": "mcq",
  "tags": ["lid", "bürgeramt"],
  "interval": 3,
  "ease": 2.5,
  "nextReview": "2026-03-25",
  "correctStreak": 2,
  "totalAttempts": 4,
  "totalCorrect": 3
}
```

---

## Claude API Integration

Three distinct roles, each with a tailored system prompt:

### 1. Tutor Chat (Claude Sonnet)
- Always accessible from sidebar/bottom panel
- User types in German (or English if stuck)
- Claude responds in German with inline translations for harder words
- System prompt: "You are a friendly German tutor. The user is A2 level. Respond in German, keeping sentences short. Add English translations in parentheses for B1+ vocabulary. Correct grammar mistakes gently."
- Streaming responses via API route

### 2. Wrong Answer Explainer (Claude Haiku)
- Triggered by "Warum?" button after incorrect answers
- Receives: the question, user's wrong answer, correct answer, chapter context
- Responds in simple German explaining why the correct answer is right
- Non-streaming, quick response

### 3. Content Generator (Claude Sonnet)
- Available after completing all 10 chapters
- Analyzes user's error history (weak tags, low-ease cards)
- Generates new exercises in the same JSON schema
- Maintains character voices for scenario-based questions
- Output: structured JSON that gets added to the exercise pool

---

## Gamification

| Element | Mechanic | Purpose |
|---------|----------|---------|
| **Daily Streak** | Complete daily review to maintain. Visual fire counter. | Habit formation, daily return |
| **Chapter Progress** | Progress bar per chapter. 70% to unlock next. | Progression map, visible path |
| **XP System** | Points per exercise. Bonus for streaks, blitz rounds. | Session reward, level feeling |
| **LiD Readiness %** | Percentage of official LiD topics with mastered cards | The real goal — exam readiness |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js App (App Router)          │
│                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │  Story    │  │  Daily    │  │  Tutor   │ │
│  │  Mode     │  │  Practice │  │  Chat    │ │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘ │
│       │               │              │       │
│  ┌────┴───────────────┴──────────────┴────┐ │
│  │        Zustand Store (persisted)       │ │
│  │   progress | srQueue | streak | xp     │ │
│  └────────────────┬───────────────────────┘ │
│                   │                          │
│              localStorage                    │
├──────────────────────────────────────────────┤
│           Next.js API Routes                 │
│                                              │
│  POST /api/chat    → Claude Sonnet (stream)  │
│  POST /api/explain → Claude Haiku            │
│  POST /api/generate→ Claude Sonnet (JSON)    │
└──────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, API routes, file-based routing |
| Language | TypeScript | Type safety for content schemas |
| Styling | Tailwind CSS | Rapid UI development |
| State | Zustand + persist middleware | Lightweight, localStorage sync |
| Animations | Framer Motion | Drag-and-drop, card flips, celebrations |
| AI | @anthropic-ai/sdk | Claude API via server-side API routes |
| Content | Static JSON files in repo | Versionable, reviewable, extendable |

### Content Schema

Chapter content stored as structured JSON:

```json
{
  "id": "chapter-1",
  "title": "Der Brief vom Amt",
  "character": "leyla",
  "storyText": "Ein Brief liegt im Briefkasten...",
  "vocab": [
    { "de": "der Bescheid", "en": "official notice", "example": "..." }
  ],
  "exercises": [
    {
      "type": "mcq",
      "question": "Was muss man nach dem Umzug machen?",
      "options": ["Sich anmelden", "Einen Antrag stellen", "..."],
      "correct": 0,
      "tags": ["lid", "meldepflicht"],
      "explanation": "Nach dem Umzug muss man sich..."
    }
  ]
}
```

---

## German-First UI Strategy

Since the user is A2, the UI uses German with smart scaffolding:

- **Navigation**: German labels with small English subtitles for the first few sessions, then fade English out
- **Vocab hover**: German words in story/exercises show English translation on hover
- **Feedback messages**: "Richtig!" / "Leider falsch" — always German first
- **Claude tutor**: defaults to German, switches to English only if user writes in English
- **Settings**: bilingual (the one exception — settings should never be confusing)

---

## Scope & Priorities

### Must Have (Week 1-2)
- Story Mode with at least chapters 1-3 fully authored
- MCQ and fill-in-the-blank exercise types
- SM-2 spaced repetition engine
- Daily practice dashboard with streak
- Basic progress tracking

### Should Have (Week 3)
- Remaining chapters 4-10
- Sentence building (drag-and-drop) and matching exercises
- Claude tutor chat integration
- Wrong answer explainer
- XP system and LiD readiness tracker

### Nice to Have (Week 4)
- Claude content generator for post-story exercises
- Blitz round timed mode
- Reading comprehension exercises
- Animations and polish
- Chapter unlock celebrations
