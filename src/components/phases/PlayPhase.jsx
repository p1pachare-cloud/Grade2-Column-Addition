// src/components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HundredFlat, TenRod, OneCube, NumberAsBlocks } from '../shared/Base10Block.jsx';
import PlaceValueChart from '../shared/PlaceValueChart.jsx';
import Mascot from '../shared/Mascot.jsx';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import { correctNarration, incorrectNarration } from '../../utils/narration.js';
import questionBank from '../../data/questionBank.js';
import { shuffleArray, generateDistractors3Digit, toWordForm } from '../../utils/shuffle.js';
import { calcXP, calcStars, getWorldName, getWorldEmoji } from '../../utils/scoring.js';
import { checkBadges, getBadgeById } from '../../utils/badgeEngine.js';

// ─── Constants ────────────────────────────────────────────────────
const QUESTIONS_PER_WORLD = 10;
const TOTAL_WORLDS = 10;

// ─── Question Visual ──────────────────────────────────────────────
function QuestionVisual({ question }) {
  const { visual, number, compareA, compareB, patternSequence, hundreds, tens, ones, topNumber, bottomNumber, operation } = question;

  if ((visual === 'column' || visual === 'word_problem') && topNumber !== undefined && bottomNumber !== undefined) {
    return (
      <div className="question-visual" style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '12px 0' }}>
        <ColumnGrid
          topNumber={topNumber}
          bottomNumber={bottomNumber}
          operation={operation}
          answer=""
          interactive={false}
          size="md"
        />
      </div>
    );
  }

  if (visual === 'blocks' && number !== undefined) {
    const h = hundreds !== undefined ? hundreds : Math.floor(number / 100);
    const t = tens !== undefined ? tens : Math.floor((number % 100) / 10);
    const o = ones !== undefined ? ones : number % 10;
    return (
      <div className="question-visual">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: Math.min(h, 9) }).map((_, i) => <HundredFlat key={i} size={40} label={false} />)}
          {Array.from({ length: t }).map((_, i) => <TenRod key={i} size={9} label={false} />)}
          {Array.from({ length: o }).map((_, i) => <OneCube key={i} size={11} />)}
        </div>
      </div>
    );
  }

  if (visual === 'chart' && number !== undefined) {
    const h = hundreds !== undefined ? hundreds : Math.floor(number / 100);
    const t = tens !== undefined ? tens : Math.floor((number % 100) / 10);
    const o = ones !== undefined ? ones : number % 10;
    return (
      <div className="question-visual">
        <PlaceValueChart hundreds={h} tens={t} ones={o} />
      </div>
    );
  }

  if (visual === 'comparison' && compareA !== undefined) {
    return (
      <div className="question-visual">
        <div className="compare-num-box">{compareA}</div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-muted)' }}>___</span>
        <div className="compare-num-box">{compareB}</div>
      </div>
    );
  }

  if (visual === 'number_line' && patternSequence) {
    return (
      <div className="question-visual" style={{ flexDirection: 'column', gap: 6 }}>
        <div className="pattern-display">
          {patternSequence.map((n, i) => (
            <div key={i} className="pattern-chip">{n}</div>
          ))}
          <div className="pattern-blank">?</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Find the pattern and fill in the blank</div>
      </div>
    );
  }

  if (visual === 'words') {
    return null; // no visual needed for words questions
  }

  if (visual === 'picture' && number !== undefined) {
    return (
      <div className="question-visual">
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: Math.min(Math.floor(number / 100), 9) }).map((_, i) => (
            <HundredFlat key={i} size={36} label={false} />
          ))}
          {Array.from({ length: Math.floor((number % 100) / 10) }).map((_, i) => (
            <TenRod key={i} size={8} label={false} />
          ))}
          {Array.from({ length: number % 10 }).map((_, i) => (
            <OneCube key={i} size={10} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─── MCQ Question ─────────────────────────────────────────────────
function MCQQuestion({ question, onAnswer, showHint, hintLevel }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const options = question.options || [];

  function pick(opt) {
    if (locked) return;
    setSelected(opt);
    setLocked(true);
    const correct = opt === question.correctAnswer || String(opt) === String(question.correctAnswer);
    setTimeout(() => onAnswer(correct, opt), 600);
  }

  function getClass(opt) {
    if (!locked) return '';
    const isCorrect = String(opt) === String(question.correctAnswer);
    const isSelected = String(opt) === String(selected);
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'wrong';
    return '';
  }

  return (
    <div>
      <div className="mcq-options">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`mcq-option ${getClass(opt)}`}
            onClick={() => pick(opt)}
            disabled={locked}
          >
            {opt}
          </button>
        ))}
      </div>

      {showHint && hintLevel >= 1 && question.hint1 && (
        <div className="hint-panel">💡 {question.hint1}</div>
      )}
      {showHint && hintLevel >= 2 && question.hint2 && (
        <div className="hint-panel" style={{ marginTop: 6 }}>💡💡 {question.hint2}</div>
      )}
    </div>
  );
}

// ─── World Complete Modal ─────────────────────────────────────────
function WorldCompleteModal({ world, score, stars, xpGained, onNext, onRetry, isLastWorld }) {
  return (
    <div className="feedback-overlay">
      <div className="world-complete-modal">
        <div style={{ fontSize: 48, marginBottom: 8 }}>{getWorldEmoji(world)}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--blue-deep)', marginBottom: 4 }}>
          {getWorldName(world)} Complete!
        </h2>
        <div className="world-score-display">{score}/{QUESTIONS_PER_WORLD}</div>
        <div className="world-stars-row">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>
          ))}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
          +{xpGained} XP earned
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {score < QUESTIONS_PER_WORLD && (
            <button className="btn btn-ghost btn-sm" onClick={onRetry}>🔄 Try Again</button>
          )}
          {!isLastWorld ? (
            <button className="btn btn-primary" onClick={onNext}>Next World →</button>
          ) : (
            <button className="btn btn-gold" onClick={onNext}>🏆 See Results!</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Badge Unlock Modal ───────────────────────────────────────────
function BadgeModal({ badgeId, onClose }) {
  const badge = getBadgeById(badgeId);
  if (!badge) return null;
  return (
    <div className="badge-unlock-overlay">
      <div className="badge-unlock-modal">
        <div className="badge-unlock-icon">🏅</div>
        <div className="badge-unlock-title">Badge Unlocked!</div>
        <div className="badge-unlock-label">{badge.label}</div>
        <div className="badge-unlock-desc">{badge.description}</div>
        <button className="btn btn-gold" style={{ marginTop: 16 }} onClick={onClose}>
          Awesome! 🎉
        </button>
      </div>
    </div>
  );
}

// ─── Feedback Modal ───────────────────────────────────────────────
function FeedbackModal({ correct, explanation, onContinue }) {
  return (
    <div className="feedback-overlay">
      <div className={`feedback-modal ${correct ? 'correct-modal' : 'wrong-modal'}`}>
        <div className="feedback-icon">{correct ? '🎉' : '💪'}</div>
        <div className={`feedback-title ${correct ? 'correct' : 'wrong'}`}>
          {correct ? 'Brilliant!' : 'Not quite!'}
        </div>
        <div className="feedback-explanation">{explanation}</div>
        <button
          className={`btn ${correct ? 'btn-success' : 'btn-primary'}`}
          onClick={onContinue}
        >
          {correct ? 'Next Question →' : 'I understand, continue →'}
        </button>
      </div>
    </div>
  );
}

// ─── Prepare world questions ──────────────────────────────────────
function prepareWorldQuestions(worldIndex) {
  // Filter questions for the specific world, so world 0 gets col_add_no_regroup, world 1 gets col_add_regroup_ones, etc.
  const filtered = questionBank.filter(q => q.world === worldIndex);
  if (filtered.length > 0) {
    return shuffleArray(filtered);
  }
  // Fallback
  const allQ = shuffleArray(questionBank);
  return allQ.slice(0, QUESTIONS_PER_WORLD);
}


// ─── Main PlayPhase ───────────────────────────────────────────────
export default function PlayPhase({
  audioEnabled,
  onComplete,
  gameState,
  onGameStateUpdate,
}) {
  const [currentWorld, setCurrentWorld] = useState(gameState.currentWorld || 0);
  const [worldQuestions, setWorldQuestions] = useState(() => prepareWorldQuestions(gameState.currentWorld || 0));
  const [qIdx, setQIdx] = useState(0);
  const [worldScore, setWorldScore] = useState(0);
  const [worldXP, setWorldXP] = useState(0);
  const [streak, setStreak] = useState(gameState.streak || 0);
  const [totalXP, setTotalXP] = useState(gameState.totalXP || 0);
  const [worldScores, setWorldScores] = useState(gameState.worldScores || Array(TOTAL_WORLDS).fill(null));
  const [badges, setBadges] = useState(gameState.badges || []);
  const [maxStreak, setMaxStreak] = useState(gameState.maxStreak || 0);
  const [wordFormCorrect, setWordFormCorrect] = useState(gameState.wordFormCorrect || 0);
  const [patternCorrect, setPatternCorrect] = useState(gameState.patternCorrect || 0);

  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastExplanation, setLastExplanation] = useState('');
  const [showWorldComplete, setShowWorldComplete] = useState(false);
  const [pendingBadge, setPendingBadge] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [attemptNum, setAttemptNum] = useState(1);
  const [xpFloat, setXpFloat] = useState(null);
  const [xpFloatKey, setXpFloatKey] = useState(0);

  const question = worldQuestions[qIdx];

  // Sync to parent
  useEffect(() => {
    onGameStateUpdate({
      currentWorld,
      worldScores,
      streak,
      maxStreak,
      totalXP,
      badges,
      wordFormCorrect,
      patternCorrect,
    });
  }, [currentWorld, worldScores, streak, maxStreak, totalXP, badges]);

  function showXPFloat(amount) {
    setXpFloat(amount);
    setXpFloatKey(k => k + 1);
    setTimeout(() => setXpFloat(null), 900);
  }

  // Ref to track the accurate final world score (avoids stale closure bug)
  const worldScoreRef = React.useRef(worldScore);
  React.useEffect(() => { worldScoreRef.current = worldScore; }, [worldScore]);

  function handleAnswer(correct, chosenOption) {
    const hintsUsed = hintLevel;
    const xp = correct ? calcXP(attemptNum, hintsUsed, streak) : 0;
    const newStreak = correct ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);

    setLastCorrect(correct);
    setLastExplanation(question.explanation || '');
    setShowFeedback(true);

    if (correct) {
      SFX.correct();
      if (audioEnabled) narrate(correctNarration());
      const newScore = worldScoreRef.current + 1;
      worldScoreRef.current = newScore;
      const newXP = totalXP + xp;
      setWorldScore(newScore);
      setTotalXP(newXP);
      setWorldXP(w => w + xp);
      setStreak(newStreak);
      setMaxStreak(newMaxStreak);
      showXPFloat(xp);
      if (newStreak > 0 && newStreak % 5 === 0) SFX.streak();

      // Track special counts
      if (question.type === 'word_add' || question.type === 'word_sub') {
        setWordFormCorrect(c => c + 1);
      }
      if (question.type.includes('borrow')) {
        setPatternCorrect(c => c + 1);
      }
    } else {
      SFX.wrong();
      if (audioEnabled) narrate(incorrectNarration());
      setStreak(0);
    }
  }

  function handleFeedbackContinue() {
    setShowFeedback(false);
    setShowHint(false);
    setHintLevel(0);
    setAttemptNum(1);

    if (qIdx < worldQuestions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      // World complete
      // Use worldScoreRef.current to avoid stale state closure on last question
      const newScores = [...worldScores];
      const finalScore = worldScoreRef.current;
      newScores[currentWorld] = finalScore;
      setWorldScores(newScores);

      // Check badges
      const stateForBadge = {
        phaseComplete: { wonder: true, story: true, simulate: true, play: false, reflect: false },
        simStationsComplete: [true, true, true],
        worldScores: newScores,
        badges,
        maxStreak: Math.max(maxStreak, streak),
        wordFormCorrect,
        patternCorrect,
      };
      const newBadges = checkBadges(stateForBadge);
      if (newBadges.length > 0) {
        setBadges(prev => [...prev, ...newBadges]);
        setPendingBadge(newBadges[0]);
      } else {
        setShowWorldComplete(true);
      }
    }
  }

  function handleBadgeDismiss() {
    setPendingBadge(null);
    setShowWorldComplete(true);
  }

  function handleWorldNext() {
    setShowWorldComplete(false);
    if (currentWorld < TOTAL_WORLDS - 1) {
      const next = currentWorld + 1;
      setCurrentWorld(next);
      setWorldQuestions(prepareWorldQuestions(next));
      setQIdx(0);
      setWorldScore(0);
      worldScoreRef.current = 0;
      setWorldXP(0);
    } else {
      onComplete({ worldScores, totalXP, badges, maxStreak });
    }
  }

  function handleWorldRetry() {
    setShowWorldComplete(false);
    setWorldQuestions(prepareWorldQuestions(currentWorld));
    setQIdx(0);
    setWorldScore(0);
    worldScoreRef.current = 0;
    setWorldXP(0);
  }

  function handleHint() {
    if (hintLevel < 2) {
      setHintLevel(h => h + 1);
      setShowHint(true);
    }
  }

  function jumpToWorld(w) {
    const unlocked = w === 0 || worldScores[w - 1] !== null;
    if (!unlocked) return;
    setCurrentWorld(w);
    setWorldQuestions(prepareWorldQuestions(w));
    setQIdx(0);
    setWorldScore(0);
    worldScoreRef.current = 0;
    setWorldXP(0);
    setShowWorldComplete(false);
    setShowFeedback(false);
  }

  if (!question) return null;

  const progress = (qIdx / worldQuestions.length) * 100;
  const worldStars = calcStars(worldScore);

  return (
    <div className="play-phase">
      {/* XP float */}
      {xpFloat && (
        <div key={xpFloatKey} className="xp-float">+{xpFloat} XP ⭐</div>
      )}

      {/* World map strip */}
      <div className="world-map-strip">
        {Array.from({ length: TOTAL_WORLDS }).map((_, i) => {
          const unlocked = i === 0 || worldScores[i - 1] !== null;
          const done = worldScores[i] !== null;
          const active = i === currentWorld;
          return (
            <button
              key={i}
              className={`world-map-btn ${active ? 'active' : done ? 'complete' : unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => jumpToWorld(i)}
              disabled={!unlocked}
              title={unlocked ? getWorldName(i) : 'Locked — complete previous world first'}
            >
              <span className="world-num">{getWorldEmoji(i)}</span>
              <span style={{ fontSize: 9, fontWeight: 700 }}>{getWorldName(i).split(' ')[0]}</span>
              <span className="world-stars">
                {done ? '⭐'.repeat(calcStars(worldScores[i])) : unlocked ? '○○○' : '🔒'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <div className="question-card">
        {/* Header */}
        <div className="question-header">
          <div className="question-world-label">
            {getWorldEmoji(currentWorld)} {getWorldName(currentWorld)}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--green-deep)', fontWeight: 700 }}>
              ✅ {worldScore}/{QUESTIONS_PER_WORLD}
            </div>
            <div className="question-counter">Q {qIdx + 1}/{QUESTIONS_PER_WORLD}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '6px 20px 0' }}>
          <div className="question-progress-bar">
            <div className="question-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Body */}
        <div className="question-body">
          {/* Type badge */}
          <div className="question-type-badge">
            {question.type === 'col_add_no_regroup' && '➕ Column Addition'}
            {question.type === 'col_add_regroup_ones' && '➕ Regroup Ones'}
            {question.type === 'col_add_regroup_tens' && '➕ Regroup Tens'}
            {question.type === 'col_add_regroup_both' && '➕ Regroup Both'}
            {question.type === 'col_sub_no_borrow' && '➖ Column Subtraction'}
            {question.type === 'col_sub_borrow_tens' && '➖ Borrow Tens'}
            {question.type === 'col_sub_borrow_hundreds' && '➖ Borrow Hundreds'}
            {question.type === 'col_sub_borrow_two' && '➖ Double Borrow'}
            {question.type === 'word_add' && '📖 Word Problem (Addition)'}
            {question.type === 'word_sub' && '📖 Word Problem (Subtraction)'}
          </div>

          {/* Question text */}
          <div className="question-text">{question.questionText}</div>

          {/* Visual */}
          <QuestionVisual question={question} />

          {/* MCQ — key ensures component remounts & resets state on each new question */}
          <MCQQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            showHint={showHint}
            hintLevel={hintLevel}
          />

          {/* Hint button */}
          <div className="hint-area">
            {hintLevel < 2 && !showFeedback && (
              <button className="hint-btn" onClick={handleHint}>
                💡 {hintLevel === 0 ? 'Get a Hint' : 'Another Hint'} (−2 XP)
              </button>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'center' }}>
              🔥 Streak: {streak}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFeedback && (
        <FeedbackModal
          correct={lastCorrect}
          explanation={lastExplanation}
          onContinue={handleFeedbackContinue}
        />
      )}

      {pendingBadge && (
        <BadgeModal badgeId={pendingBadge} onClose={handleBadgeDismiss} />
      )}

      {showWorldComplete && (
        <WorldCompleteModal
          world={currentWorld}
          score={worldScores[currentWorld]}
          stars={calcStars(worldScores[currentWorld])}
          xpGained={worldXP}
          onNext={handleWorldNext}
          onRetry={handleWorldRetry}
          isLastWorld={currentWorld === TOTAL_WORLDS - 1}
        />
      )}
    </div>
  );
}
