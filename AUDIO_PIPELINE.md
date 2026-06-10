# Audio & Narration Pipeline — numberbound

This document describes the audio system for the **numberbound** educational module and explains exactly how to integrate it, maintain it, and extend it.

---

## Overview

The system uses a **hybrid pipeline**:

1. **Pre-generation** — Known narration scripts are generated offline via `scripts/generate_audio.js` using ElevenLabs and stored as static `.mp3` files in `public/assets/audio/`. These load instantly with zero latency.
2. **Dynamic fallback** — If a phrase has no pre-generated MP3, the browser calls ElevenLabs directly via `VITE_ELEVENLABS_API_KEY`.
3. **Web Speech API fallback** — If ElevenLabs is unavailable (no key, network error, or autoplay blocked), the browser's built-in speech synthesis takes over so narration always works.

---

## Files Delivered

| File | Location in your repo | Purpose |
|------|----------------------|---------|
| `audio.js` | `src/utils/audio.js` | Core audio engine (segment helpers, queue, SFX, fallbacks) |
| `audioMap.js` | `src/utils/audioMap.js` | Auto-generated text → MP3 path dictionary |
| `narration.js` | `src/utils/narration.js` | Phase-to-script mapping (parity with UI text) |
| `generate_audio.js` | `scripts/generate_audio.js` | Node script: hits ElevenLabs, saves MP3s, rewrites audioMap |
| `clean_audio.js` | `scripts/clean_audio.js` | Node script: removes orphaned MP3s no longer in audioMap |
| `.env.local` | `.env.local` (project root) | Holds `VITE_ELEVENLABS_API_KEY` — **never commit this** |

---

## Voice Profile

| Setting | Value |
|---------|-------|
| Provider | ElevenLabs |
| Voice | Alice — Clear, Engaging Educator |
| Voice ID | `Xb7hH8MSUJpSbSDYk0k2` |
| Model | `eleven_multilingual_v2` |

### Voice Settings by Style

| Style | Stability | Similarity Boost | Style | Speaker Boost |
|-------|-----------|-----------------|-------|---------------|
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

---

## Step 1 — Place the files

Copy each file into the exact path shown in the **Files Delivered** table above. Create `public/assets/audio/` if it doesn't exist (the generation script creates it automatically, but Vite needs the `public/` folder present).

---

## Step 2 — Add your API key

Open `.env.local` at the project root and replace the placeholder:

```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Get your key from [elevenlabs.io → Profile → API Keys](https://elevenlabs.io).

> ⚠️ Make sure `.env.local` is in your `.gitignore`. It already is if you used the standard Vite template.

---

## Step 3 — Add `type: module` to package.json scripts (if not already set)

The generation scripts use ES module syntax (`import`/`export`). Your `package.json` should have:

```json
{
  "type": "module"
}
```

If it already has `"type": "module"` (standard for Vite projects), you're set.

---

## Step 4 — Pre-generate the audio

Run from the project root:

```bash
node scripts/generate_audio.js
```

This will:
- Hit the ElevenLabs API for each phrase (rate-limited at 500 ms between calls)
- Save `.mp3` files to `public/assets/audio/`
- Rewrite `src/utils/audioMap.js` with the updated mappings

Expected output:
```
🎙  Generating 25 audio files via ElevenLabs…

  [ 1/25] A hawker uncle has one hundred fishballs on each t… ✅
  [ 2/25] He has three full trays. How many fishballs is that… ✅
  ...
──────────────────────────────────────────
✅  Generated : 25
⏭  Skipped   : 0
📝  audioMap  : src/utils/audioMap.js updated
──────────────────────────────────────────
```

Subsequent runs skip files that already exist (re-run safe).

---

## Step 5 — Wire narration into your components

Each phase component already uses the pattern below. If you're adding a new component, follow it:

```jsx
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration } from '../utils/narration';

export default function WonderPhase({ audioEnabled, onComplete }) {
  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration());
    return () => stopNarration();
  }, [audioEnabled]);

  // ... rest of component
}
```

The `audioEnabled` prop comes from `App.jsx` and is toggled by the 🔊/🔇 button.

---

## Segment helpers (from `audio.js`)

| Helper | Style applied |
|--------|--------------|
| `say(text)` | `statement` |
| `ask(text)` | `question` |
| `cheer(text)` | `celebration` |
| `emphasize(text)` | `emphasis` |
| `think(text)` | `thinking` |
| `celebrate(text)` | `celebration` |
| `instruct(text)` | `instruction` |
| `encourage(text)` | `encouragement` |

---

## Sound effects (from `audio.js`)

```js
import { SFX } from '../utils/audio';

SFX.correct();    // ding ding ding — correct answer
SFX.wrong();      // low buzz — incorrect answer
SFX.badge();      // fanfare — badge earned
SFX.streak();     // double ping — streak milestone
SFX.levelUp();    // ascending chime — level up
SFX.blockSnap();  // click — block snapped into place
SFX.merge();      // two tones — blocks merged
SFX.click();      // single click — UI interaction
```

All SFX are generated via the Web Audio API (no external files needed) and respect the `audioEnabled` state.

---

## Adding or updating narration

Follow these four steps **in order** to keep everything in sync:

### 1. Add the phrase to `generate_audio.js`

```js
// In scripts/generate_audio.js, add to the `phrases` array:
{ text: "Your new educational sentence here.", style: 'statement' },
```

> ⚠️ Only add paragraph/question text. Never add titles or headings.

### 2. Re-generate audio

```bash
node scripts/generate_audio.js
```

### 3. (Optional) Clean up orphaned files

If you deleted or edited an existing phrase:

```bash
node scripts/clean_audio.js
```

### 4. Add to `narration.js`

The exact same string must appear in the relevant narration function:

```js
// In src/utils/narration.js:
export function myNewPhaseNarration() {
  return [
    say("Your new educational sentence here."),
  ];
}
```

### 5. Wire into the component

```jsx
import { narrate, stopNarration } from '../utils/audio';
import { myNewPhaseNarration } from '../utils/narration';

useEffect(() => {
  if (audioEnabled) narrate(myNewPhaseNarration());
  return () => stopNarration();
}, [audioEnabled]);
```

> **Critical:** The string passed to `say()` / `ask()` / etc. in `narration.js` must be **character-for-character identical** to the key in `audioMap.js` and to the text shown in the UI. Even a trailing space or different punctuation will cause a cache miss and trigger the dynamic fallback.

---

## Content policy

- ✅ Narrate: paragraph text, questions, feedback messages
- ❌ Never narrate: titles, headings, section labels, button labels

This prevents repetitive title-reading and keeps narration focused on educational content.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| No audio at all | `audioEnabled` is `false` | Check the 🔊 toggle in the UI |
| Falls back to robotic Web Speech | MP3 not pre-generated / key missing | Run `generate_audio.js` or check `.env.local` |
| `getVoices()` returns empty array | Chrome async voice loading | Already handled — the engine waits for `voiceschanged` |
| Autoplay blocked on first load | Browser policy requires user gesture | Already handled — falls back to Web Speech silently |
| Narration overlaps / double-plays | Component not calling `stopNarration()` in cleanup | Add `return () => stopNarration();` to your `useEffect` |
| Old MP3 files accumulating | Edited phrase text | Run `node scripts/clean_audio.js` |
