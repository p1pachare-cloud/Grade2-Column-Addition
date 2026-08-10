// src/components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { HundredFlat, TenRod, OneCube } from '../shared/Base10Block.jsx';
import PlaceValueChart from '../shared/PlaceValueChart.jsx';
import Mascot from '../shared/Mascot.jsx';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import PopupModal from '../shared/PopupModal.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import { correctNarration, incorrectNarration, questionNarration, hintNarration } from '../../utils/narration.js';
import questionBank from '../../data/questionBank.js';
import { shuffleArray } from '../../utils/shuffle.js';
import { calcXP, calcStars, getWorldName, getWorldEmoji } from '../../utils/scoring.js';
import { checkBadges, getBadgeById } from '../../utils/badgeEngine.js';

const QUESTIONS_PER_WORLD = 10;
const TOTAL_WORLDS = 10;

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

  return null;
}

function MCQQuestion({ question, onAnswer, lockedOptions = [] }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const options = question.options || [];

  function pick(opt) {
    if (locked || lockedOptions.includes(opt)) return;
    setSelected(opt);
    setLocked(true);
    const correct = opt === question.correctAnswer || String(opt) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(correct, opt);
      setLocked(false);
      setSelected(null);
    }, 600);
  }

  function getClass(opt) {
    if (lockedOptions.includes(opt)) return 'wrong disabled';
    if (!selected) return '';
    const isCorrect = String(opt) === String(question.correctAnswer);
    const isSelected = String(opt) === String(selected);
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'wrong';
    return '';
  }

  return (
    <div className="mcq-options">
      {options.map((opt, i) => (
        <button
          key={i}
          className={`mcq-option ${getClass(opt)}`}
          onClick={() => pick(opt)}
          disabled={locked || lockedOptions.includes(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function WorldCompleteModal({ world, score, stars, xpGained, onNext, onRetry, isLastWorld }) {
  return (
    <div className="feedback-overlay">
      <div className="world-complete-modal">
        <div style={{ fontSize: 48, marginBottom: 8 }}>{getWorldEmoji(world)}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', marginBottom: 4 }}>
          {getWorldName(world)} Complete! 🎉
        </h2>
        <div className="world-score-display">{score}/{QUESTIONS_PER_WORLD}</div>
        <div className="world-stars-row">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>
          ))}
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 18 }}>
          +<strong>{xpGained}</strong> XP earned
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {score < QUESTIONS_PER_WORLD && (
            <button className="btn btn-secondary btn-sm" onClick={onRetry}>🔄 Try Again</button>
          )}
          {!isLastWorld ? (
            <button className="btn btn-primary" onClick={onNext}>Next World →</button>
          ) : (
            <button className="btn btn-gold" onClick={onNext}>🏆 See Final Results!</button>
          )}
        </div>
      </div>
    </div>
  );
}

function prepareWorldQuestions(worldIndex) {
  const filtered = questionBank.filter(q => q.world === worldIndex);
  if (filtered.length > 0) {
    return shuffleArray(filtered);
  }
  const allQ = shuffleArray(questionBank);
  return allQ.slice(0, QUESTIONS_PER_WORLD);
}

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

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastExplanation, setLastExplanation] = useState('');

  const [showWorldComplete, setShowWorldComplete] = useState(false);
  const [pendingBadge, setPendingBadge] = useState(null);

  const [showHintModal, setShowHintModal] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintLevel, setHintLevel] = useState(0);

  const [attemptNum, setAttemptNum] = useState(1);
  const [disabledOptions, setDisabledOptions] = useState([]);

  const [xpFloat, setXpFloat] = useState(null);
  const [xpFloatKey, setXpFloatKey] = useState(0);

  const question = worldQuestions[qIdx];

  // Auto narration for every question
  useEffect(() => {
    if (audioEnabled && question) {
      narrate(questionNarration(question.questionText));
    }
    return () => stopNarration();
  }, [question?.id, audioEnabled]);

  // Sync to parent state
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

  const worldScoreRef = useRef(worldScore);
  useEffect(() => { worldScoreRef.current = worldScore; }, [worldScore]);

  function showXPFloat(amount) {
    setXpFloat(amount);
    setXpFloatKey(k => k + 1);
    setTimeout(() => setXpFloat(null), 900);
  }

  function handleAnswer(correct, chosenOption) {
    if (correct) {
      SFX.correct();
      if (audioEnabled) narrate(correctNarration("Fantastic Work! That's correct!"));
      
      const hintsUsed = hintLevel;
      const xp = calcXP(attemptNum, hintsUsed, streak);
      const newStreak = streak + 1;
      const newMaxStreak = Math.max(maxStreak, newStreak);
      const newScore = worldScoreRef.current + 1;

      worldScoreRef.current = newScore;
      setWorldScore(newScore);
      setTotalXP(prev => prev + xp);
      setWorldXP(w => w + xp);
      setStreak(newStreak);
      setMaxStreak(newMaxStreak);
      showXPFloat(xp);

      setLastCorrect(true);
      setLastExplanation(question.explanation || `Great job! ${question.questionText} = ${question.correctAnswer}`);
      setShowFeedbackModal(true);
    } else {
      SFX.wrong();
      if (audioEnabled) narrate(incorrectNarration("Hmm, not quite! Let us check our columns again."));

      setStreak(0);
      setDisabledOptions(prev => [...prev, chosenOption]);

      if (attemptNum === 1) {
        setAttemptNum(2);
        // Show gentle retry prompt
        setHintText(`Not quite ${chosenOption}! Take another look: ${question.hint1 || 'Focus on column place values.'}`);
        setShowHintModal(true);
      } else {
        // Final attempt failed -> show correct answer
        setLastCorrect(false);
        setLastExplanation(`The correct answer is ${question.correctAnswer}. ${question.explanation || ''}`);
        setShowFeedbackModal(true);
      }
    }
  }

  function handleFeedbackContinue() {
    setShowFeedbackModal(false);
    setShowHintModal(false);
    setHintLevel(0);
    setAttemptNum(1);
    setDisabledOptions([]);

    if (qIdx < worldQuestions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      const newScores = [...worldScores];
      const finalScore = worldScoreRef.current;
      newScores[currentWorld] = finalScore;
      setWorldScores(newScores);

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

  function triggerHint() {
    let nextHint = question.hint1 || "Check the ones place first!";
    if (hintLevel >= 1 && question.hint2) nextHint = question.hint2;

    setHintLevel(h => h + 1);
    setHintText(nextHint);
    setShowHintModal(true);

    if (audioEnabled) {
      narrate(hintNarration(nextHint));
    }
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
    setShowFeedbackModal(false);
    setShowHintModal(false);
  }

  if (!question) return null;

  const progress = ((qIdx + 1) / worldQuestions.length) * 100;

  return (
    <div className="play-phase">
      {/* XP float animation */}
      {xpFloat && (
        <div key={xpFloatKey} className="xp-float">+{xpFloat} XP ⭐</div>
      )}

      {/* World map navigation strip */}
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

      {/* Main Question Card */}
      <div className="question-card">
        {/* Header */}
        <div className="question-header">
          <div className="question-world-label">
            {getWorldEmoji(currentWorld)} <strong>{getWorldName(currentWorld)}</strong>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 14, color: 'var(--green)', fontWeight: '900' }}>
              ✅ <strong>{worldScore}/{QUESTIONS_PER_WORLD}</strong>
            </div>
            <div className="question-counter"><strong>Q {qIdx + 1}/{QUESTIONS_PER_WORLD}</strong></div>
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
          {/* Question Type Badge */}
          <div className="question-type-badge">
            {question.type === 'col_add_no_regroup' && '➕ Column Addition (No Regrouping)'}
            {question.type === 'col_add_regroup_ones' && '➕ Regroup Ones'}
            {question.type === 'col_add_regroup_tens' && '➕ Regroup Tens'}
            {question.type === 'col_add_regroup_both' && '➕ Double Regrouping'}
            {question.type === 'col_sub_no_borrow' && '➖ Column Subtraction'}
            {question.type === 'col_sub_borrow_tens' && '➖ Borrow Tens'}
            {question.type === 'col_sub_borrow_hundreds' && '➖ Borrow Hundreds'}
            {question.type === 'col_sub_borrow_two' && '➖ Double Borrowing'}
            {question.type === 'word_add' && '📖 Word Problem (Addition)'}
            {question.type === 'word_sub' && '📖 Word Problem (Subtraction)'}
          </div>

          {/* Question Text */}
          <div className="question-text">
            <strong>{question.questionText}</strong>
          </div>

          {/* Visual representation */}
          <QuestionVisual question={question} />

          {/* MCQ Options */}
          <MCQQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            lockedOptions={disabledOptions}
          />

          {/* Hint & Streak Footer */}
          <div className="hint-area">
            {!showFeedbackModal && (
              <button className="hint-btn" onClick={triggerHint}>
                💡 <strong>{hintLevel === 0 ? 'Get Hint' : 'Another Hint'}</strong> (−2 XP)
              </button>
            )}
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'center', fontWeight: 'bold' }}>
              🔥 <strong>Streak: {streak}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Hint Modal Popup */}
      <PopupModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        title="Helpful Hint"
        type="hint"
        icon="💡"
      >
        <p style={{ fontSize: '16px', lineHeight: '1.5', margin: 0, color: 'var(--text-primary)' }}>
          <strong>{hintText}</strong>
        </p>
      </PopupModal>

      {/* Feedback Modal Popup */}
      <PopupModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackContinue}
        title={lastCorrect ? "Excellent!" : "Keep Going!"}
        type={lastCorrect ? "success" : "error"}
        icon={lastCorrect ? "🎉" : "💡"}
        confirmText="Continue →"
      >
        <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
          <strong>{lastExplanation}</strong>
        </p>
      </PopupModal>

      {/* Badge Unlock Modal Popup */}
      {pendingBadge && (
        <PopupModal
          isOpen={true}
          onClose={() => { setPendingBadge(null); setShowWorldComplete(true); }}
          title="Achievement Unlocked!"
          type="badge"
          icon="🏅"
          confirmText="Awesome! 🎉"
        >
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '20px', color: 'var(--gold)', margin: '8px 0' }}>
              <strong>{getBadgeById(pendingBadge)?.label}</strong>
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {getBadgeById(pendingBadge)?.description}
            </p>
          </div>
        </PopupModal>
      )}

      {/* World Complete Modal */}
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
