// src/components/IntroScreen.jsx
import React from 'react';

const PHASES = [
  { key: 'wonder',   emoji: '🤔', label: 'Wonder',   desc: 'A math mystery!' },
  { key: 'story',    emoji: '📖', label: 'Story',    desc: 'The school fair count' },
  { key: 'simulate', emoji: '🧪', label: 'Simulate', desc: '3 Station Sandbox' },
  { key: 'play',     emoji: '🎮', label: 'Practice', desc: '100 challenges' },
  { key: 'reflect',  emoji: '📓', label: 'Reflect',  desc: 'Quiz & review' },
];

export default function IntroScreen({ onStart, onResume, hasSession }) {
  return (
    <div className="home-screen-redesign">

      {/* Top Pill Badge */}
      <div className="home-top-badge">
        ✨ <strong>Grade 2 Math</strong>
      </div>

      {/* Main Title & Subtitle */}
      <div className="home-title-block">
        <h1 className="home-main-title">
          Column Addition
        </h1>
        <h2 className="home-sub-title">
          Addition & Subtraction with Regrouping
        </h2>
      </div>

      {/* Hero Card Text */}
      <div className="home-hero-card">
        <p>
          Join <strong>Wei Ming</strong> to master column addition, carrying, and borrowing up to <strong>1000</strong>! 🧁
        </p>
      </div>

      {/* 5 Cards Grid */}
      <div className="home-phases-grid">
        {PHASES.map((p) => (
          <div key={p.key} className="home-phase-card">
            <div className="home-phase-emoji">{p.emoji}</div>
            <div className="home-phase-title"><strong>{p.label}</strong></div>
            <div className="home-phase-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Resume Banner */}
      {hasSession && (
        <div className="intro-resume-banner" style={{ margin: '16px 0 8px 0' }}>
          <span style={{ fontSize: 24 }}>🔄</span>
          <p style={{ margin: 0 }}>You have a saved session! Resume where you left off?</p>
          <button className="btn btn-success btn-sm" onClick={onResume}>
            Resume
          </button>
        </div>
      )}

      {/* Big Gold CTA Button */}
      <div className="home-cta-block">
        <button
          className="home-cta-button"
          onClick={onStart}
        >
          🚀 <strong>Begin Your Journey!</strong>
        </button>
      </div>

      {/* Bottom Feature Badges */}
      <div className="home-bottom-badges">
        <div className="home-feature-pill">
          <span>🎯</span> <strong>100 Questions</strong>
        </div>
        <div className="home-feature-pill">
          <span>➕</span> <strong>Column Addition</strong>
        </div>
        <div className="home-feature-pill">
          <span>🏆</span> <strong>Badges & XP</strong>
        </div>
      </div>

    </div>
  );
}
