# Select-to-Translate Feature Design

## Context

Berlin Leben is a gamified German learning app for A2 learners preparing for the "Leben in Deutschland" exam. German text appears throughout the app — in stories, exercises, chat, and the dashboard. Currently, only individual vocab words in stories can be translated (via VocabHighlight tooltips). When users encounter unfamiliar phrases or sentences elsewhere, they have no in-app way to understand them.

This feature adds a global "select to translate" capability: highlight any phrase/sentence anywhere in the app, and a bottom toast bar slides up with the English translation and a brief grammar note — powered by Claude AI.

## Requirements

- **Trigger**: Automatically on text selection (no extra click). Uses `selectionchange` event with 300ms debounce.
- **Threshold**: Only fires for selections ≥ 15 characters (~2+ German words), so single-word selections are left to VocabHighlight.
- **Scope**: Works on every page in the app (global component).
- **Content**: English translation + brief grammar note (compound word breakdown, case, tense, or structure — whichever is most useful for an A2 learner).
- **UX**: Bottom toast bar in primary teal (#1b6565). Slides up with Framer Motion animation. Shimmer loading skeleton while waiting. Dismissible via ✕, clicking elsewhere, or making a new selection.
- **Performance**: In-memory cache (`useRef(new Map())`) for instant re-lookups. `AbortController` to cancel in-flight requests on rapid re-selection.
- **Exclusions**: Skips selections inside `<input>`, `<textarea>`, and `[contenteditable]` elements.

## Architecture

**Approach: Self-contained component** — all logic in a single `TranslateToast` component mounted in `ClientProviders`.

### Files to Create

1. **`src/components/translate/TranslateToast.tsx`** — The full feature component.
   - `useEffect` attaches `selectionchange` listener on `document`
   - 300ms debounced handler reads `window.getSelection().toString()`
   - Checks length threshold (≥15 chars) and active element (not input/textarea)
   - Calls `/api/translate` with `AbortController`
   - Caches results in `useRef<Map<string, TranslateResult>>()`
   - Renders `motion.div` toast with `AnimatePresence` (slide up/down)
   - States: hidden → loading (shimmer) → result (translation + grammar note)

2. **`src/app/api/translate/route.ts`** — API endpoint.
   - Follows `/api/explain` pattern (non-streaming, JSON response)
   - Input: `{ text: string }`
   - Output: `{ translation: string, grammarNote: string }`
   - Uses `TRANSLATOR_SYSTEM_PROMPT` and `MODELS.translator`
   - `max_tokens: 256`
   - JSON-parses Claude's response, with fallback if parsing fails

### Files to Modify

3. **`src/lib/prompts.ts`** — Add `TRANSLATOR_SYSTEM_PROMPT`:
   - Instruct Claude to return valid JSON: `{ "translation": "...", "grammarNote": "..." }`
   - Translate German to natural English
   - Grammar note: compound breakdown, case, tense, or word order — whichever helps an A2 learner most
   - Keep grammar notes under 15 words
   - Handle non-German text gracefully

4. **`src/lib/claude.ts`** — Add `translator: "claude-sonnet-4-5-20250514"` to `MODELS`.

5. **`src/components/layout/ClientProviders.tsx`** — Mount `<TranslateToast />` after `<TutorChat />`.

## Toast Layout

```
┌──────────────────────────────────────────────────────────┐
│ 🌐  …to extend my residence permit.                   ✕ │
│     📚 Aufenthaltstitel = Aufenthalt + Titel;            │
│        verlängern uses "um…zu" infinitive clause         │
└──────────────────────────────────────────────────────────┘
```

- Fixed to bottom of viewport (`fixed bottom-0 inset-x-0 z-30`)
- Primary teal background, white text
- `translate` Material Symbol icon on the left
- Translation text (15px) on top, grammar note (12px, 65% opacity) below
- ✕ dismiss button on the right

## Edge Cases

- **Input/textarea selection**: Detected via `document.activeElement?.tagName` — skip translation
- **Rapid re-selections**: `AbortController` cancels previous request; debounce coalesces rapid events
- **Empty selection (deselect)**: Dismiss toast after 500ms delay to avoid flicker during re-selection
- **VocabHighlight coexistence**: Single-word clicks on VocabHighlight produce selections below the 15-char threshold → no conflict
- **TutorChat overlap**: Toast uses `z-30`, below TutorChat's `z-40`
- **Non-German text selected**: Prompt handles gracefully, returns empty translation with note
- **Same text re-selected**: Returns instantly from in-memory cache

## Verification

1. Run `npm run dev` and open the app
2. Navigate to a story page, select a German sentence → toast should appear with translation
3. Select text on the dashboard, in exercises, in the tutor chat → all should work
4. Click inside a text input and select text → toast should NOT appear
5. Select the same sentence twice → second time should be instant (cached)
6. Rapidly select different phrases → no stale results, only the latest selection shown
7. Dismiss via ✕ → toast slides down
8. Click elsewhere to deselect → toast dismisses after brief delay
