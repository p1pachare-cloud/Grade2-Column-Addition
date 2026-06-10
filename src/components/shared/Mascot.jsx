// src/components/shared/Mascot.jsx
import React from 'react';

const MOODS = {
  idle: { color: '#4A90D9', eyeAnim: false, bounce: false },
  curious: { color: '#FF8A50', eyeAnim: true, bounce: false },
  happy: { color: '#4CAF50', eyeAnim: false, bounce: true },
  thinking: { color: '#9C27B0', eyeAnim: false, bounce: false },
  celebrating: { color: '#FFD700', eyeAnim: false, bounce: true },
};

export default function Mascot({ mood = 'idle', size = 80, bubble = null }) {
  const cfg = MOODS[mood] || MOODS.idle;

  return (
    <div className="mascot-container">
      <svg
        className="mascot-svg"
        width={size}
        height={size}
        viewBox="0 0 80 80"
        style={{ animation: cfg.bounce ? 'celebrate 1s ease infinite' : mood === 'thinking' ? 'none' : 'none' }}
      >
        {/* Body */}
        <rect x="15" y="30" width="50" height="38" rx="8" fill={cfg.color} />
        {/* Head */}
        <rect x="18" y="8" width="44" height="30" rx="10" fill={cfg.color} />
        {/* Face plate */}
        <rect x="22" y="12" width="36" height="22" rx="6" fill="white" opacity="0.92" />
        {/* Eyes */}
        {mood === 'celebrating' ? (
          <>
            <text x="30" y="27" fontSize="10" textAnchor="middle">^</text>
            <text x="50" y="27" fontSize="10" textAnchor="middle">^</text>
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="30" cy="23" r="5" fill="#333" />
            <circle cx="50" cy="23" r="5" fill="#333" />
            <circle cx="32" cy="21" r="2" fill="white" />
            <circle cx="52" cy="21" r="2" fill="white" />
            {/* Thinking dots */}
            <circle cx="58" cy="10" r="2.5" fill={cfg.color} opacity="0.8" />
            <circle cx="64" cy="7" r="2" fill={cfg.color} opacity="0.6" />
            <circle cx="69" cy="5" r="1.5" fill={cfg.color} opacity="0.4" />
          </>
        ) : (
          <>
            <circle cx="30" cy="23" r="5" fill="#333" />
            <circle cx="50" cy="23" r="5" fill="#333" />
            <circle cx="32" cy="21" r="2" fill="white" />
            <circle cx="52" cy="21" r="2" fill="white" />
            {cfg.eyeAnim && (
              <>
                <circle cx="30" cy="23" r="5" fill="#333">
                  <animate attributeName="ry" values="5;1;5" dur="2s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </>
        )}
        {/* Mouth */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <path d="M 30 30 Q 40 36 50 30" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <path d="M 30 31 Q 40 29 50 31" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 30 30 Q 40 34 50 30" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {/* Antenna */}
        <line x1="40" y1="8" x2="40" y2="2" stroke={cfg.color} strokeWidth="2" />
        <circle cx="40" cy="2" r="3" fill={cfg.color === '#FFD700' ? '#FF8A50' : cfg.color} />
        {/* Arms */}
        <rect x="5" y="34" width="12" height="8" rx="4" fill={cfg.color} />
        <rect x="63" y="34" width="12" height="8" rx="4" fill={cfg.color} />
        {/* Legs */}
        <rect x="22" y="64" width="12" height="10" rx="5" fill={cfg.color} />
        <rect x="46" y="64" width="12" height="10" rx="5" fill={cfg.color} />
        {/* Chest panel */}
        <rect x="30" y="38" width="20" height="14" rx="4" fill="white" opacity="0.4" />
        <circle cx="36" cy="45" r="2" fill="white" opacity="0.9" />
        <circle cx="44" cy="45" r="2" fill="white" opacity="0.9" />
        {/* LearnFlow label */}
        <text x="40" y="57" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold" opacity="0.8">LearnFlow</text>
      </svg>
      {bubble && (
        <div className="mascot-bubble">{bubble}</div>
      )}
    </div>
  );
}
