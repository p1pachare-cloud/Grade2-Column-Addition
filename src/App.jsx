// src/App.jsx
import React, { useState, useEffect } from 'react';
import FloatingNumbers from './components/FloatingNumbers.jsx';
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import PopupModal from './components/shared/PopupModal.jsx';
import { setAudioEnabled, SFX } from './utils/audio.js';

// ─── Phase definitions ────────────────────────────────────────────
const PHASES = [
  { key: 'intro',    label: 'Start',    emoji: '🏠', showInBar: false },
  { key: 'wonder',   label: 'Wonder',   emoji: '🔍', showInBar: true,  num: '01' },
  { key: 'story',    label: 'Story',    emoji: '📖', showInBar: true,  num: '02' },
  { key: 'simulate', label: 'Simulate', emoji: '🧪', showInBar: true,  num: '03' },
  { key: 'play',     label: 'Practice', emoji: '🎮', showInBar: true,  num: '04' },
  { key: 'reflect',  label: 'Reflect',  emoji: '📓', showInBar: true,  num: '05' },
  { key: 'results',  label: 'Results',  emoji: '🏆', showInBar: false },
];

const BAR_PHASES = PHASES.filter(p => p.showInBar);

// ─── Default game state ───────────────────────────────────────────
const DEFAULT_STATE = {
  phase: 'intro',
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  simStationsComplete: [false, false, false],
  currentWorld: 0,
  worldScores: Array(10).fill(null),
  streak: 0,
  maxStreak: 0,
  totalXP: 0,
  badges: [],
  wordFormCorrect: 0,
  patternCorrect: 0,
  audioEnabled: true,
};

const STORAGE_KEY = 'usa_game_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function App() {
  const [gs, setGs] = useState(DEFAULT_STATE);
  const [audioOn, setAudioOn] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.phase && saved.phase !== 'intro') {
      setHasSaved(true);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (gs.phase !== 'intro') saveState(gs);
  }, [gs]);

  // Sync audio state
  useEffect(() => {
    setAudioEnabled(audioOn);
  }, [audioOn]);

  function updatePhase(phase) {
    setGs(prev => ({ ...prev, phase }));
  }

  function completePhase(phase) {
    setGs(prev => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, [phase]: true },
    }));
  }

  function handleStart() {
    SFX.click();
    setGs({ ...DEFAULT_STATE, audioEnabled: audioOn, phase: 'wonder' });
  }

  function handleResume() {
    SFX.click();
    const saved = loadState();
    if (saved) {
      setGs(saved);
      setAudioOn(saved.audioEnabled ?? true);
    }
    setHasSaved(false);
  }

  function handleWonderComplete()   { completePhase('wonder');   updatePhase('story');    }
  function handleStoryComplete()    { completePhase('story');    updatePhase('simulate'); }

  function handleSimulateComplete(stationsComplete) {
    setGs(prev => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, simulate: true },
      simStationsComplete: stationsComplete || [true, true, true],
      phase: 'play',
    }));
  }

  function handlePlayComplete(playData) {
    setGs(prev => ({
      ...prev,
      phaseComplete: { ...prev.phaseComplete, play: true },
      worldScores:   playData.worldScores || prev.worldScores,
      totalXP:       playData.totalXP    || prev.totalXP,
      badges:        playData.badges     || prev.badges,
      maxStreak:     playData.maxStreak  || prev.maxStreak,
      phase: 'reflect',
    }));
  }

  function handleGameStateUpdate(partial) {
    setGs(prev => ({ ...prev, ...partial }));
  }

  function handleReflectComplete() { completePhase('reflect'); updatePhase('results'); }

  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY);
    setGs({ ...DEFAULT_STATE, phase: 'intro' });
    setHasSaved(false);
  }

  function goHomePrompt() {
    setShowExitConfirm(true);
  }

  function confirmExitHome() {
    setShowExitConfirm(false);
    setGs(prev => ({ ...prev, phase: 'intro' }));
  }

  function canAccessPhase(phaseKey) {
    const order = ['wonder', 'story', 'simulate', 'play', 'reflect'];
    const targetIdx = order.indexOf(phaseKey);
    if (targetIdx <= 0) return true;
    return gs.phaseComplete[order[targetIdx - 1]];
  }

  function navigateToPhase(phaseKey) {
    if (gs.phase === 'intro' || gs.phase === 'results') return;
    if (canAccessPhase(phaseKey)) updatePhase(phaseKey);
  }

  const showNav = gs.phase !== 'intro' && gs.phase !== 'results';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">

        {/* ─── Sound / Audio Toggle (RIGHT-CENTER OF THE SCREEN - Only in lesson phases) ─── */}
        {gs.phase !== 'intro' && (
          <button
            className="audio-toggle-btn audio-toggle-right-center"
            onClick={() => { SFX.click(); setAudioOn(a => !a); }}
            aria-label={audioOn ? 'Mute audio' : 'Enable audio'}
            title={audioOn ? 'Mute Audio Narration' : 'Enable Audio Narration'}
          >
            <span className="audio-toggle-icon">{audioOn ? '🔊' : '🔇'}</span>
            <span className="audio-toggle-label">{audioOn ? 'Sound ON' : 'Muted'}</span>
          </button>
        )}

        {/* ─── Journey bar (fixed top-center) ─── */}
        {showNav && (
          <nav className="journey-bar" aria-label="Lesson phases">
            {BAR_PHASES.map((phase, i) => {
              const isActive    = phase.key === gs.phase;
              const isCompleted = gs.phaseComplete[phase.key];
              const accessible  = canAccessPhase(phase.key);
              return (
                <React.Fragment key={phase.key}>
                  <div className={`journey-step ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
                    <button
                      className="journey-step-dot"
                      onClick={() => navigateToPhase(phase.key)}
                      title={phase.label}
                      disabled={!accessible && !isCompleted}
                      style={{ cursor: accessible || isCompleted ? 'pointer' : 'not-allowed', border: 'none' }}
                      aria-label={phase.label}
                    >
                      {isCompleted ? '✓' : phase.num}
                    </button>
                    <span className="journey-step-label">{phase.emoji} {phase.label}</span>
                  </div>
                  {i < BAR_PHASES.length - 1 && (
                    <div className={`journey-connector ${gs.phaseComplete[BAR_PHASES[i].key] ? 'filled' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* ─── Home button (fixed top-left) ─── */}
        {showNav && (
          <button className="home-btn" onClick={goHomePrompt} aria-label="Go home">
            🏠 <strong>Home</strong>
          </button>
        )}

        {/* ─── Main phase content ─── */}
        <div style={{ width: '100%', paddingTop: showNav ? '68px' : '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {gs.phase === 'intro' && (
            <IntroScreen
              onStart={handleStart}
              onResume={handleResume}
              hasSession={hasSaved}
            />
          )}
          {gs.phase === 'wonder' && (
            <WonderPhase audioEnabled={audioOn} onComplete={handleWonderComplete} />
          )}
          {gs.phase === 'story' && (
            <StoryPhase audioEnabled={audioOn} onComplete={handleStoryComplete} />
          )}
          {gs.phase === 'simulate' && (
            <SimulatePhase audioEnabled={audioOn} onComplete={handleSimulateComplete} />
          )}
          {gs.phase === 'play' && (
            <PlayPhase
              audioEnabled={audioOn}
              onComplete={handlePlayComplete}
              gameState={gs}
              onGameStateUpdate={handleGameStateUpdate}
            />
          )}
          {gs.phase === 'reflect' && (
            <ReflectPhase audioEnabled={audioOn} onComplete={handleReflectComplete} gameState={gs} />
          )}
          {gs.phase === 'results' && (
            <ResultsScreen gameState={gs} onRestart={handleRestart} />
          )}

        </div>

        {/* Exit Confirmation Modal */}
        <PopupModal
          isOpen={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          title="Return to Main Menu?"
          type="exit"
          icon="🚪"
          confirmText="Yes, Go Home"
          cancelText="Keep Playing"
          onConfirm={confirmExitHome}
        >
          <p style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
            Your current lesson progress will be saved automatically so you can resume anytime!
          </p>
        </PopupModal>

      </div>
    </>
  );
}
