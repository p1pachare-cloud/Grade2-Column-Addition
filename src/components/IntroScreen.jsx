// src/components/IntroScreen.jsx
import React from 'react';

const PHASES = [
  { key: 'wonder',   emoji: '🔍', label: 'Wonder',   desc: 'Discover the mystery' },
  { key: 'story',    emoji: '📖', label: 'Story',    desc: 'Learn with Mei Ling' },
  { key: 'simulate', emoji: '🧪', label: 'Simulate', desc: 'Add/subtract blocks' },
  { key: 'play',     emoji: '🎮', label: 'Play',     desc: '100 fun challenges' },
  { key: 'reflect',  emoji: '📓', label: 'Reflect',  desc: 'Show what you know' },
];

export default function IntroScreen({ onStart, onResume, hasSession }) {
  return (
    <div className="intro-screen">

      {/* Curriculum badge */}
      <div className="intro-badge">✨ Intellia SG · Grade 2 Maths</div>

      {/* Title */}
      <div className="intro-hero">
        <h1 className="intro-title">
          Column Addition
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.3rem)', color: 'var(--text-secondary)', marginTop: 0 }}>
          Addition & Subtraction with Regrouping
        </p>
      </div>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🤖</div>
        <div className="speech-bubble">
          Ready to master column addition and subtraction? 🧁
        </div>
      </div>

      {/* Description */}
      <p className="intro-subtitle">
        Join Mei Ling and Mike to solve the bakery's muffin orders! Learn how to align column columns, carry, and borrow to add and subtract numbers up to 1000!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {PHASES.map((p, i) => (
            <div key={p.key} className="intro-journey-step">
              <div className="intro-journey-icon">{p.emoji}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Resume banner */}
      {hasSession && (
        <div className="intro-resume-banner">
          <span style={{ fontSize: 26 }}>🔄</span>
          <p>You have a saved session! Resume from where you left off?</p>
          <button className="btn btn-success btn-sm" onClick={onResume}>Resume</button>
        </div>
      )}

      {/* CTA */}
      <div className="intro-buttons">
        <button className="btn btn-primary btn-lg" onClick={onStart} style={{ borderRadius: '999px' }}>
          {hasSession ? '🆕 Start Fresh' : '🚀 Begin Your Journey!'}
        </button>
      </div>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">⏱️</div>
          <div className="feature-card-label">~16 minutes</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🏅</div>
          <div className="feature-card-label">8 Badges</div>
        </div>
      </div>

    </div>
  );
}
