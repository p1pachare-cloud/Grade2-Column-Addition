// src/utils/audio.js — FIXED VERSION
// Audio engine: ElevenLabs pre-generated MP3 + Web Speech API fallback
// Fixes: (1) async getVoices() on Chrome, (2) AudioContext auto-play policy

import { audioMap } from './audioMap.js';

// ElevenLabs voice configuration
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID  = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:  { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ─── Segment creators ─────────────────────────────────────────────
export const say       = (text) => ({ text, style: 'statement'    });
export const ask       = (text) => ({ text, style: 'question'     });
export const cheer     = (text) => ({ text, style: 'celebration'  });
export const emphasize = (text) => ({ text, style: 'emphasis'     });
export const think     = (text) => ({ text, style: 'thinking'     });
export const celebrate = (text) => ({ text, style: 'celebration'  });
export const instruct  = (text) => ({ text, style: 'instruction'  });
export const encourage = (text) => ({ text, style: 'encouragement'});

// ─── Audio state ──────────────────────────────────────────────────
let currentQueue  = null;
let currentAudio  = null;
let preloadCache  = {};
let audioEnabled  = true;

export function setAudioEnabled(enabled) {
  audioEnabled = enabled;
  if (!enabled) stopNarration();
}

// ─── URL resolution ───────────────────────────────────────────────
export async function getAudioUrl(text, style = 'statement') {
  // 1. Check pre-generated audio map
  if (audioMap[text]) {
    return audioMap[text];
  }

  // 2. Try ElevenLabs API proxy
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error('No API key');

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const response = await fetch(
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

    if (!response.ok) throw new Error('ElevenLabs API error');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (_) {
    return null; // Signal to use Web Speech API
  }
}

// ─── FIXED: Web Speech API fallback with async voice loading ─────
// On Chrome, getVoices() returns [] on first call — must wait for voiceschanged
function getVoicesAsync() {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    // Voices not loaded yet — wait for the event (fires once on Chrome)
    const onChanged = () => {
      speechSynthesis.removeEventListener('voiceschanged', onChanged);
      resolve(speechSynthesis.getVoices());
    };
    speechSynthesis.addEventListener('voiceschanged', onChanged);
    // Safety timeout — resolve with whatever is available after 2s
    setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', onChanged);
      resolve(speechSynthesis.getVoices());
    }, 2000);
  });
}

async function speakWithWebSpeech(text, onEnd) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return; }

  // Cancel any ongoing speech before starting new
  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang  = 'en-US';
  utter.rate  = 0.92;
  utter.pitch = 1.1;

  try {
    const voices = await getVoicesAsync();
    // Prefer en-GB or en-US voices (clear, child-friendly)
    const preferred = voices.find(v => v.lang === 'en-GB' && !v.localService)
      || voices.find(v => v.lang === 'en-US' && !v.localService)
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
    if (preferred) utter.voice = preferred;
  } catch (_) { /* use default voice */ }

  utter.onend   = onEnd;
  utter.onerror = (e) => {
    // 'interrupted' is normal when cancel() is called — not a real error
    if (e.error !== 'interrupted') onEnd?.();
    else onEnd?.();
  };

  try {
    speechSynthesis.speak(utter);
  } catch (_) {
    onEnd?.();
  }
}

// ─── Queue management ─────────────────────────────────────────────
export async function narrate(segments, reset = false) {
  if (!audioEnabled) return;
  if (!segments || segments.length === 0) return;

  // Stop any existing narration FIRST, then assign the new queue ID.
  // (Previously the order was reversed, so stopNarration() wiped out
  //  the freshly-set currentQueue, causing the loop to exit immediately.)
  stopNarration();

  const queueId = Symbol();
  currentQueue  = queueId;

  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== queueId) return;
    const { text, style } = segments[i];

    // Preload next segment
    if (i + 1 < segments.length) {
      const nextSeg = segments[i + 1];
      if (!preloadCache[nextSeg.text]) {
        getAudioUrl(nextSeg.text, nextSeg.style).then(url => {
          if (url) preloadCache[nextSeg.text] = url;
        });
      }
    }

    // Get URL (from cache or fresh)
    let url = preloadCache[text] || await getAudioUrl(text, style);

    await new Promise(resolve => {
      if (currentQueue !== queueId) { resolve(); return; }

      if (url) {
        const audio = new Audio(url);
        audio.volume = 0.9;
        currentAudio  = audio;
        audio.onended = () => { currentAudio = null; resolve(); };
        audio.onerror = () => {
          currentAudio = null;
          // Fallback to Web Speech API if Audio element fails
          speakWithWebSpeech(text, resolve);
        };
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was blocked — fall back to Web Speech
            currentAudio = null;
            speakWithWebSpeech(text, resolve);
          });
        }
      } else {
        speakWithWebSpeech(text, resolve);
      }
    });

    // Small gap between segments
    if (currentQueue === queueId && i < segments.length - 1) {
      await new Promise(r => setTimeout(r, 180));
    }
  }
}

export function stopNarration() {
  currentQueue = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// ─── FIXED: Sound effects — shared AudioContext with resume on user gesture ──
let _audioCtx = null;

function getAudioContext() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser auto-play policy requires a user gesture first)
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}

const playTone = (frequencies, durations) => {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + durations.slice(0, i).reduce((s, d) => s + d, 0) / 1000;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch (_) { /* ignore in environments without AudioContext */ }
};

export const SFX = {
  correct:   () => audioEnabled && playTone([880, 1100, 1320], [120, 120, 200]),
  wrong:     () => audioEnabled && playTone([220],             [350]),
  badge:     () => audioEnabled && playTone([523, 659, 784, 1047], [100, 100, 100, 250]),
  streak:    () => audioEnabled && playTone([440, 880],        [100, 200]),
  levelUp:   () => audioEnabled && playTone([523, 659, 784, 1047, 1319], [70, 70, 70, 70, 300]),
  blockSnap: () => audioEnabled && playTone([440],             [80]),
  merge:     () => audioEnabled && playTone([660, 880],        [100, 150]),
  click:     () => audioEnabled && playTone([440],             [60]),
};
