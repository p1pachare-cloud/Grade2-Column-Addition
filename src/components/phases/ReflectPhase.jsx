// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectQuestionNarration } from '../../utils/narration.js';
import { getBadgeById } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';

const REFLECT_PROMPTS = [
  {
    id: 'regroup',
    question: 'What does regrouping mean when we add in columns?',
    subtext: 'Think about what happened in Station B when the ones digits added up to 10 or more.',
    placeholder: 'e.g. When the sum in a column is 10 or more, we carry 1 to the next column...',
    example: 'When the sum of a column is 10 or more, we bundle 10 of them together and carry 1 to the column on the left (e.g. 10 Ones become 1 Ten).',
    icon: '🔄'
  },
  {
    id: 'borrow',
    question: 'Why do we borrow when doing column subtraction?',
    subtext: 'Think about Station C when the top digit was smaller than the bottom digit.',
    placeholder: 'e.g. We borrow from the column on the left because we do not have enough to subtract...',
    example: 'We borrow when the top digit is smaller than the bottom digit. We take 1 from the left column and add 10 to our current column so we can subtract.',
    icon: '🔀'
  },
  {
    id: 'order',
    question: 'Why must we always start column math from the Ones place instead of the Hundreds place?',
    subtext: 'Imagine what would happen to carried or borrowed digits if you started from the left.',
    placeholder: 'e.g. If we start from the left, we would not know if we need to add carried numbers or borrow...',
    example: 'Because carrying and borrowing move values between columns from right to left. Starting at the Ones column ensures carried or borrowed values are included correctly.',
    icon: '📐'
  }
];

const LEARNINGS = [
  { icon: '📐', text: 'Line up columns: Hundreds under Hundreds, Tens under Tens, Ones under Ones' },
  { icon: ' Ones', text: 'Always start calculations from the rightmost column (Ones)' },
  { icon: '🔄', text: 'Regroup 10 ones into 1 ten when the sum of a column is 10 or more' },
  { icon: '🔀', text: 'Borrow 1 ten (broken into 10 ones) when subtracting a larger digit from a smaller one' },
  { icon: '➕', text: 'Always remember to add carried digits in the tens and hundreds column' }
];

export default function ReflectPhase({ audioEnabled, onComplete, gameState }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [submitted, setSubmitted] = useState([false, false, false]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(reflectQuestionNarration());
    return () => stopNarration();
  }, [audioEnabled, promptIdx]);

  function submitAnswer() {
    const newSubmitted = [...submitted];
    newSubmitted[promptIdx] = true;
    setSubmitted(newSubmitted);
    if (promptIdx < REFLECT_PROMPTS.length - 1) {
      setPromptIdx(promptIdx + 1);
    } else {
      setAllDone(true);
    }
  }

  const totalStars = (gameState.worldScores || []).reduce((s, ws) => s + calcStars(ws || 0), 0);
  const totalXP    = gameState.totalXP || 0;
  const earnedBadges = (gameState.badges || []).map(id => getBadgeById(id)).filter(Boolean);
  const maxStreak  = gameState.maxStreak || 0;

  if (allDone) {
    return (
      <div className="reflect-phase" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="reflect-complete-wrap" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1.5px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '24px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Hero */}
          <div className="reflect-complete-hero" style={{ textAlign: 'center' }}>
            <div className="reflect-complete-trophy" style={{ fontSize: '64px', marginBottom: '10px' }}>🏆</div>
            <h2 className="reflect-complete-title" style={{ fontSize: '28px', color: '#fff', fontFamily: 'var(--font-display)', margin: '0 0 8px 0' }}>Amazing Work!</h2>
            <p className="reflect-complete-sub" style={{ fontSize: '15px', color: '#b0b0d0', lineHeight: '1.6', margin: 0 }}>
              You've completed the <span style={{ color: '#ffb74d', fontWeight: 800 }}>Column Addition & Subtraction</span> lesson!<br />
              You can now align columns, carry, and borrow up to 1000 like a math wizard.
            </p>
          </div>

          {/* Stats grid */}
          <div className="reflect-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px'
          }}>
            <div className="reflect-stat-card" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              padding: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚡</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{totalXP}</div>
              <div style={{ fontSize: '12px', color: '#88a3e0' }}>Total XP</div>
            </div>
            <div className="reflect-stat-card" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              padding: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔥</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{maxStreak}</div>
              <div style={{ fontSize: '12px', color: '#88a3e0' }}>Best Streak</div>
            </div>
            <div className="reflect-stat-card" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              padding: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>⭐</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{totalStars}</div>
              <div style={{ fontSize: '12px', color: '#88a3e0' }}>Stars Earned</div>
            </div>
            <div className="reflect-stat-card" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              padding: '16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏅</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{earnedBadges.length}</div>
              <div style={{ fontSize: '12px', color: '#88a3e0' }}>Badges</div>
            </div>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="reflect-badges-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="reflect-badges-title" style={{ fontSize: '14px', fontWeight: 'bold', color: '#88a3e0' }}>🏅 Badges Earned</div>
              <div className="reflect-badges-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {earnedBadges.map(b => (
                  <div key={b.id} style={{ background: '#5c7cfa', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{b.label}</div>
                ))}
              </div>
            </div>
          )}

          {/* What you learned */}
          <div className="reflect-learned-block" style={{
            background: 'rgba(0,0,0,0.15)', borderRadius: '16px', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <div className="reflect-learned-title" style={{ fontSize: '14px', fontWeight: 'bold', color: '#88a3e0' }}>📚 What You Learned</div>
            <div className="reflect-learned-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LEARNINGS.map((item, i) => (
                <div key={i} className="reflect-learned-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="reflect-learned-icon" style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span className="reflect-learned-text" style={{ fontSize: '14px', color: '#e0e0ff' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-success btn-lg" onClick={onComplete}
            style={{
              alignSelf: 'center',
              width: '100%',
              maxWidth: '320px',
              padding: '14px 0',
              fontSize: '16px',
              fontWeight: '800',
              borderRadius: '12px',
              border: 'none',
              background: '#2ecc71',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(46,204,113,0.3)'
            }}>
            🎓 Complete Lesson!
          </button>
        </div>
      </div>
    );
  }

  const prompt = REFLECT_PROMPTS[promptIdx];
  const charCount = answers[promptIdx].trim().length;

  return (
    <div className="reflect-phase" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div className="reflect-progress-bar-wrap" style={{ display: 'flex', gap: '6px', width: '100%' }}>
        {REFLECT_PROMPTS.map((_, i) => (
          <div key={i} className={`reflect-progress-seg ${i < promptIdx ? 'done' : i === promptIdx ? 'active' : ''}`} style={{
            height: '6px',
            flex: 1,
            borderRadius: '3px',
            background: i === promptIdx ? '#5c7cfa' : i < promptIdx ? '#2ecc71' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>

      {/* Question card */}
      <div className="reflect-question-card" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="reflect-question-header" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="reflect-question-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(92,124,250,0.15)',
            padding: '4px 12px',
            borderRadius: '20px',
            alignSelf: 'flex-start',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#5c7cfa'
          }}>
            <span>{prompt.icon}</span>
            <span>Question {promptIdx + 1} of {REFLECT_PROMPTS.length}</span>
          </div>
          <div className="reflect-question-mascot-row" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <Mascot mood="thinking" size={56} />
            <div>
              <h3 className="reflect-question-text" style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', margin: '0 0 4px 0' }}>{prompt.question}</h3>
              <p className="reflect-question-sub" style={{ fontSize: '13px', color: '#b0b0d0', margin: 0 }}>{prompt.subtext}</p>
            </div>
          </div>
        </div>

        {/* Answer area */}
        <div className="reflect-answer-area" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="reflect-answer-label" style={{ fontSize: '13px', fontWeight: 'bold', color: '#88a3e0' }}>✏️ Your Answer</div>
          <textarea
            className="reflect-textarea"
            placeholder={prompt.placeholder}
            value={answers[promptIdx]}
            onChange={e => {
              const a = [...answers];
              a[promptIdx] = e.target.value;
              setAnswers(a);
            }}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          <div className="reflect-char-count" style={{ fontSize: '12px', color: charCount >= 3 ? '#2ecc71' : 'rgba(255,255,255,0.35)', fontWeight: 'bold' }}>
            {charCount < 3 ? `${3 - charCount} more characters to unlock` : '✓ Ready to submit!'}
          </div>
        </div>

        {/* Model answer */}
        <div className="reflect-model-answer" style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          padding: '12px',
          borderLeft: '4px solid #ffb74d'
        }}>
          <div className="reflect-model-label" style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffb74d', marginBottom: '2px' }}>💡 Hint / Example Answer</div>
          <div className="reflect-model-text" style={{ fontSize: '13px', color: '#e0e0ff', lineHeight: '1.4' }}>{prompt.example}</div>
        </div>
      </div>

      {/* Next button */}
      <button
        className="btn btn-primary btn-lg"
        style={{
          width: '100%',
          maxWidth: '340px',
          alignSelf: 'center',
          padding: '12px 0',
          fontSize: '16px',
          fontWeight: '800',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: '#fff',
          cursor: charCount < 3 ? 'not-allowed' : 'pointer',
          opacity: charCount < 3 ? 0.5 : 1,
          boxShadow: charCount < 3 ? 'none' : '0 4px 12px rgba(29,78,216,0.3)'
        }}
        onClick={submitAnswer}
        disabled={charCount < 3}
      >
        {promptIdx < REFLECT_PROMPTS.length - 1 ? 'Next Question →' : '🎉 Complete Reflection!'}
      </button>
    </div>
  );
}
