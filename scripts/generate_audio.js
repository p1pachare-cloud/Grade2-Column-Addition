// scripts/generate_audio.js
// Offline audio pre-generation script — runs with Node.js, not in the browser.
// Usage: node scripts/generate_audio.js
//
// What it does:
//   1. Reads the `phrases` array below (text + style pairs).
//   2. Calls the ElevenLabs TTS API for each phrase using per-style voice settings.
//   3. Saves each .mp3 to public/assets/audio/ with a slugified filename.
//   4. Writes/overwrites src/utils/audioMap.js with the updated text→path mapping.
//
// Requirements:
//   - VITE_ELEVENLABS_API_KEY must be set in your .env.local file.
//   - Run from the project root: node scripts/generate_audio.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// ─── Load API key from .env.local ────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌  .env.local not found. Create it with VITE_ELEVENLABS_API_KEY=your_key');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && key.trim() === 'VITE_ELEVENLABS_API_KEY') {
      return rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  console.error('❌  VITE_ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}

// ─── ElevenLabs config ────────────────────────────────────────────
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:  { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ─── Phrases to generate ─────────────────────────────────────────
// CONTENT POLICY: Only paragraph text and questions — NEVER titles/headings.
// Each entry must exactly match the text shown in the corresponding UI component.
const phrases = [
  // Wonder phase
  { text: "A hawker uncle has one hundred fishballs on each tray.", style: 'statement' },
  { text: "He has three full trays. How many fishballs is that?", style: 'question' },
  { text: "Hmm... can you figure it out before we open the trays?", style: 'thinking' },

  // Story panel 1
  { text: "Mei Ling goes to the wet market with her grandmother every Saturday.", style: 'statement' },
  { text: "Today they are counting eggs for a big order!", style: 'statement' },

  // Story panel 2
  { text: "One full tray has one hundred eggs.", style: 'statement' },
  { text: "That is ONE HUNDRED. We write it as 100.", style: 'emphasis' },
  { text: "It has the digit 1 in the hundreds place, and zeros in the tens and ones places.", style: 'statement' },

  // Story panel 3
  { text: "Two trays have two hundred eggs. Three trays have three hundred eggs.", style: 'statement' },
  { text: "We are counting in hundreds: one hundred, two hundred, three hundred, all the way to one thousand!", style: 'statement' },

  // Story panel 4
  { text: "Mei Ling finds two full trays, three rows of ten, and five single eggs.", style: 'statement' },
  { text: "That gives us two hundred and thirty-five eggs altogether!", style: 'emphasis' },

  // Story panel 5
  { text: "Two hundred and thirty-five is written as 235.", style: 'statement' },
  { text: "In expanded form: 200 plus 30 plus 5 equals 235.", style: 'statement' },
  { text: "Now YOU can build any number up to one thousand!", style: 'celebration' },

  // Simulate station 1
  { text: "Let's build numbers using hundreds, tens, and ones blocks!", style: 'instruction' },
  { text: "Drag the blue hundred flats, orange ten rods, and green unit cubes to make the target number.", style: 'instruction' },

  // Simulate station 2
  { text: "Now let's fill in the place value chart.", style: 'instruction' },
  { text: "How many hundreds, tens, and ones does this number have?", style: 'question' },

  // Simulate station 3
  { text: "Great work! Now let's place numbers on the number line and compare them.", style: 'instruction' },
  { text: "Which number is greater? Look at the hundreds digit first!", style: 'question' },

  // Practice feedback
  { text: "Brilliant! You know your hundreds!", style: 'celebration' },
  { text: "Let's look at the place value chart again!", style: 'encouragement' },

  // Reflect phase
  { text: "What does the hundreds digit in a number tell us?", style: 'question' },
  { text: "Think about the egg trays from the story. Can you explain it?", style: 'thinking' },
];

// ─── Helpers ─────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  const apiKey   = loadEnv();
  const audioDir = path.join(ROOT, 'public', 'assets', 'audio');
  const mapPath  = path.join(ROOT, 'src', 'utils', 'audioMap.js');

  fs.mkdirSync(audioDir, { recursive: true });

  const audioMap = {};
  let generated  = 0;
  let skipped    = 0;
  let failed     = 0;

  // De-duplicate by text (keep last occurrence)
  const unique = [];
  const seen   = new Set();
  for (const phrase of [...phrases].reverse()) {
    if (!seen.has(phrase.text)) {
      seen.add(phrase.text);
      unique.unshift(phrase);
    }
  }

  console.log(`\n🎙  Generating ${unique.length} audio files via ElevenLabs…\n`);

  for (let i = 0; i < unique.length; i++) {
    const { text, style } = unique[i];
    const slug     = slugify(text);
    const filename = `audio_${slug}_0.mp3`;
    const filePath = path.join(audioDir, filename);
    const assetUrl = `/assets/audio/${filename}`;

    process.stdout.write(`  [${String(i + 1).padStart(2)}/${unique.length}] ${text.slice(0, 60)}… `);

    // Skip if already exists
    if (fs.existsSync(filePath)) {
      audioMap[text] = assetUrl;
      console.log('⏭  skipped (exists)');
      skipped++;
      continue;
    }

    try {
      const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: settings,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      audioMap[text] = assetUrl;
      console.log('✅');
      generated++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      failed++;
    }

    // Rate-limit: 500ms between calls
    if (i < unique.length - 1) await sleep(500);
  }

  // Write audioMap.js
  const lines = Object.entries(audioMap)
    .map(([text, url]) => `  ${JSON.stringify(text)}: ${JSON.stringify(url)},`);

  const mapContent = `// src/utils/audioMap.js
// Auto-generated by scripts/generate_audio.js — DO NOT edit manually.
// Re-run \`node scripts/generate_audio.js\` to update.

export const audioMap = {
${lines.join('\n')}
};
`;

  fs.writeFileSync(mapPath, mapContent, 'utf-8');

  console.log(`\n──────────────────────────────────────────`);
  console.log(`✅  Generated : ${generated}`);
  console.log(`⏭  Skipped   : ${skipped}`);
  if (failed) console.log(`❌  Failed    : ${failed}`);
  console.log(`📝  audioMap  : src/utils/audioMap.js updated`);
  console.log(`──────────────────────────────────────────\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
