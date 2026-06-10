// src/components/ResultsScreen.jsx — REDESIGNED
import React, { useEffect, useState } from 'react';
import { calcStars, getWorldName, getWorldEmoji } from '../utils/scoring.js';
import { getBadgeById } from '../utils/badgeEngine.js';

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      dur: 2.2 + Math.random() * 1.4,
      color: ['#ffc107','#5c7cfa','#4caf50','#ff8a50','#ab47bc','#26c6da'][i % 6],
      size: 7 + Math.random() * 7,
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: -20, left: `${p.left}%`,
          width: p.size, height: p.size, borderRadius: p.id % 3 === 0 ? '50%' : 2,
          background: p.color,
          animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

export default function ResultsScreen({ gameState, onRestart }) {
  const { worldScores = [], totalXP = 0, badges = [], maxStreak = 0 } = gameState;
  const totalStars    = worldScores.reduce((s, ws) => s + calcStars(ws || 0), 0);
  const totalAnswered = worldScores.filter(ws => ws !== null).reduce((s, ws) => s + ws, 0);
  const totalPossible = worldScores.filter(ws => ws !== null).length * 10;
  const accuracy      = totalPossible > 0 ? Math.round((totalAnswered / totalPossible) * 100) : 0;
  const earnedBadges  = badges.map(id => getBadgeById(id)).filter(Boolean);

  const STATS = [
    { label: 'Total XP',    value: totalXP,               icon: '⚡', color: 'var(--gold)' },
    { label: 'Best Streak', value: `${maxStreak}🔥`,       icon: '🔥', color: '#ff7043'     },
    { label: 'Stars',       value: `${totalStars}⭐`,      icon: '⭐', color: 'var(--gold)'  },
    { label: 'Accuracy',    value: `${accuracy}%`,         icon: '🎯', color: '#4caf50'     },
    { label: 'Badges',      value: earnedBadges.length,    icon: '🏅', color: '#ab47bc'     },
  ];

  return (
    <>
      <Confetti />
      <div className="results-screen2">
        {/* Hero */}
        <div className="results-hero2">
          <div className="results-trophy2">🏆</div>
          <h1 className="results-title2">Lesson Complete!</h1>
          <p className="results-subtitle2">Column Addition & Subtraction within 1000</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Singapore MOE Primary 2 Mathematics · Lesson 2.1
          </p>
          <div className="results-stars2">
            {'⭐'.repeat(Math.min(totalStars, 5))}
          </div>
        </div>

        {/* Stats */}
        <div className="results-stats2">
          {STATS.map((s, i) => (
            <div key={i} className="results-stat2" style={{ '--sc': s.color }}>
              <div className="results-stat-icon2">{s.icon}</div>
              <div className="results-stat-value2">{s.value}</div>
              <div className="results-stat-label2">{s.label}</div>
            </div>
          ))}
        </div>

        {/* World breakdown */}
        <div className="results-worlds-block">
          <div className="results-section-title">🌍 World Scores</div>
          <div className="results-worlds-list">
            {worldScores.map((ws, i) =>
              ws !== null ? (
                <div key={i} className="results-world-row">
                  <span className="results-world-emoji">{getWorldEmoji(i)}</span>
                  <span className="results-world-name">{getWorldName(i)}</span>
                  <div className="results-world-bar-wrap">
                    <div className="results-world-bar-fill" style={{
                      width: `${(ws / 10) * 100}%`,
                      background: ws >= 9 ? '#4caf50' : ws >= 7 ? 'var(--blue-primary)' : 'var(--orange-accent)',
                    }} />
                  </div>
                  <span className="results-world-score">{ws}/10</span>
                  <span style={{ fontSize: 14 }}>{'⭐'.repeat(calcStars(ws))}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div className="results-badges-block">
            <div className="results-section-title">🏅 Badges Earned</div>
            <div className="results-badges-grid">
              {earnedBadges.map(b => (
                <div key={b.id} className="results-badge-pill">
                  <span>🏅</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="results-cta-row">
          <button className="btn btn-ghost" onClick={onRestart}>🔄 Start Again</button>
          <button className="btn btn-primary btn-lg" onClick={onRestart}>🚀 Play Again!</button>
        </div>
      </div>
    </>
  );
}
