// scripts/clean_audio.js
// Removes orphaned MP3 files from public/assets/audio/ that are no longer
// referenced in src/utils/audioMap.js.
//
// Usage: node scripts/clean_audio.js
// Run from the project root after deleting or modifying narration text.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

async function main() {
  const audioDir = path.join(ROOT, 'public', 'assets', 'audio');
  const mapPath  = path.join(ROOT, 'src', 'utils', 'audioMap.js');

  if (!fs.existsSync(audioDir)) {
    console.log('ℹ️  No audio directory found — nothing to clean.');
    return;
  }

  if (!fs.existsSync(mapPath)) {
    console.error('❌  src/utils/audioMap.js not found. Run generate_audio.js first.');
    process.exit(1);
  }

  // Dynamically import the audioMap to get the current set of valid paths
  const { audioMap } = await import(pathToFileURL(mapPath).href);

  // Collect all valid MP3 filenames from the map values
  const validFiles = new Set(
    Object.values(audioMap).map(url => path.basename(url))
  );

  // Scan the audio directory
  const allFiles = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

  let removed = 0;
  let kept    = 0;

  console.log(`\n🧹  Scanning ${allFiles.length} file(s) in public/assets/audio/…\n`);

  for (const file of allFiles) {
    if (!validFiles.has(file)) {
      fs.unlinkSync(path.join(audioDir, file));
      console.log(`  🗑  Removed orphan: ${file}`);
      removed++;
    } else {
      kept++;
    }
  }

  console.log(`\n──────────────────────────────────────────`);
  console.log(`🗑  Removed : ${removed}`);
  console.log(`✅  Kept    : ${kept}`);
  console.log(`──────────────────────────────────────────\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
