// src/components/phases/StoryPhase.jsx
import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import Base10Block from '../shared/Base10Block.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import { STORY_NARRATIONS } from '../../utils/narration.js';

// Custom component to render book piles/blocks for books representation
function BookPile({ count, label, color }) {
  // Render hundreds, tens, ones blocks representing the books
  const h = Math.floor(count / 100);
  const t = Math.floor((count % 100) / 10);
  const o = count % 10;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1.5px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      maxWidth: '220px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: color }}>{label} ({count})</div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
        alignContent: 'center',
        minHeight: '110px'
      }}>
        {/* Render base-10 representations */}
        {Array.from({ length: h }).map((_, i) => (
          <Base10Block key={`h-${i}`} type="hundred" size={36} label={false} />
        ))}
        {Array.from({ length: t }).map((_, i) => (
          <Base10Block key={`t-${i}`} type="ten" size={8} label={false} />
        ))}
        {Array.from({ length: o }).map((_, i) => (
          <Base10Block key={`o-${i}`} type="one" size={10} />
        ))}
      </div>
    </div>
  );
}

// Component to display story images with fallback
function StoryImage({ src, alt }) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '340px',
          objectFit: 'contain',
          borderRadius: '12px'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<div style="padding: 40px; text-align: center; color: #88a3e0; font-weight: bold;">[Image: ${alt}]</div>`;
        }}
      />
    </div>
  );
}

export default function StoryPhase({ audioEnabled, onComplete }) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [carryOnes, setCarryOnes] = useState(false);
  const [carryTens, setCarryTens] = useState(false);

  useEffect(() => {
    if (audioEnabled) {
      narrate(STORY_NARRATIONS[panelIdx]());
    }
    // Manage automatic carry triggers for Panel 5, 6, 7 to show animation
    if (panelIdx >= 4) {
      setCarryOnes(true);
    } else {
      setCarryOnes(false);
    }

    if (panelIdx >= 5) {
      setCarryTens(false); // No tens carry in this problem (1+3+5=9)
    }

    return () => stopNarration();
  }, [panelIdx, audioEnabled]);

  function goNext() {
    SFX.click();
    if (panelIdx < STORY_NARRATIONS.length - 1) {
      setPanelIdx(panelIdx + 1);
    } else {
      onComplete();
    }
  }

  function goPrev() {
    SFX.click();
    if (panelIdx > 0) setPanelIdx(panelIdx - 1);
  }

  // Define dynamic visuals for the 7 panels
  const renderVisual = () => {
    switch (panelIdx) {
      case 0: // Panel 1: Mei Ling has 234 books. Mike has 158 books.
        return (
          <StoryImage src="/images/story-panel-1.jpg" alt="Our Book Collection" />
        );
      case 1: // Panel 2: How many books do they have altogether?
        return (
          <StoryImage src="/images/story-panel-2.jpg" alt="The Big Question!" />
        );
      case 2: // Panel 3: Setting up columns
        return (
          <StoryImage src="/images/story-panel-3.jpg" alt="Let's Set It Up! We will use column addition." />
        );
      case 3: // Panel 4: Add the ones (4+8=12)
        return (
          <StoryImage src="/images/story-panel-4.jpg" alt="Start with the Ones!" />
        );
      case 4: // Panel 5: Regroup ones to tens (write 2, carry 1)
        return (
          <StoryImage src="/images/story-panel-5.jpg" alt="Magic Regrouping! 10 ones = 1 ten." />
        );
      case 5: // Panel 6: Add the tens column (1 + 3 + 5 = 9)
        return (
          <StoryImage src="/images/story-panel-6.jpg" alt="Now, Let's Add the Tens!" />
        );
      case 6: // Panel 7: Add hundreds (2 + 1 = 3) -> 392
        return (
          <StoryImage src="/images/story-panel-7.jpg" alt="We Did It! 234 + 158 = 392" />
        );
      default:
        return null;
    }
  };

  const getMascotMood = () => {
    if (panelIdx === 0) return 'curious';
    if (panelIdx === 1) return 'thinking';
    if (panelIdx === 6) return 'celebrating';
    return 'happy';
  };

  const getMascotBubble = () => {
    switch (panelIdx) {
      case 0: return "Look at all these books! Stacking them up is going to take a lot of math! 📚";
      case 1: return "How can we find the total easily? Let's stack them in columns! ➕";
      case 2: return "Make sure to align Hundreds, Tens, and Ones correctly in the grid. 📐";
      case 3: return "4 + 8 = 12. That's greater than 9! We need to regroup. 🔄";
      case 4: return "We carry the 1 to the Tens column, leaving 2 in the Ones place! 🛫";
      case 5: return "Don't forget to add the carried 1 when you add the Tens column! ➕";
      case 6: return "392 books total! You have mastered the column addition steps! 🌟";
      default: return "";
    }
  };

  const panelTexts = [
    "Mei Ling has 234 books. Mike has 158 books.",
    "How many books do they have altogether?",
    "Write the numbers one on top of the other. Hundreds under hundreds, Tens under tens, Ones under ones.",
    "Start with the ones column: 4 ones + 8 ones = 12 ones. Since this is 10 or more, we must regroup!",
    "Regroup 10 ones into 1 ten. Write 2 in the ones column, and carry 1 to the tens column.",
    "Now add the tens column. 1 carried ten + 3 tens + 5 tens = 9 tens. Write 9 in the tens column.",
    "Finally, add the hundreds column: 2 hundreds + 1 hundred = 3 hundreds. They have 392 books altogether!"
  ];

  return (
    <div className="story-phase" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div className="story-panel" style={{
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
        {/* Visual panel */}
        <div className="story-panel-visual" style={{
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '260px'
        }}>
          {renderVisual()}
        </div>

        {/* Text panel */}
        <div className="story-panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            fontSize: '12px',
            color: '#88a3e0',
            fontWeight: '800',
            letterSpacing: '1px'
          }}>
            PANEL {panelIdx + 1} OF {STORY_NARRATIONS.length}
          </div>

          <p className="story-panel-text" style={{
            fontSize: '18px',
            color: '#fff',
            lineHeight: '1.6',
            fontWeight: '600',
            fontFamily: 'var(--font-body)',
            margin: 0
          }}>
            {panelTexts[panelIdx]}
          </p>

          {/* Mascot */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <Mascot mood={getMascotMood()} size={60} />
            <div className="mascot-bubble" style={{
              fontSize: '14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px 12px 12px 0',
              padding: '10px 14px',
              color: '#d0d5ff',
              lineHeight: '1.4',
              maxWidth: '80%'
            }}>{getMascotBubble()}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="story-nav" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '16px',
          marginTop: '10px'
        }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={goPrev}
            disabled={panelIdx === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: panelIdx === 0 ? 'rgba(255,255,255,0.2)' : '#88a3e0',
              cursor: panelIdx === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '700'
            }}
          >
            ← Back
          </button>

          <div className="story-dots" style={{ display: 'flex', gap: '6px' }}>
            {STORY_NARRATIONS.map((_, i) => (
              <div
                key={i}
                className={`story-dot ${i === panelIdx ? 'active' : i < panelIdx ? 'complete' : ''}`}
                onClick={() => { SFX.click(); setPanelIdx(i); }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i === panelIdx 
                    ? '#5c7cfa' 
                    : i < panelIdx 
                      ? '#2ecc71' 
                      : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: i === panelIdx ? 'scale(1.2)' : 'none'
                }}
              />
            ))}
          </div>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={goNext}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '700',
              boxShadow: '0 4px 10px rgba(29,78,216,0.3)'
            }}
          >
            {panelIdx < STORY_NARRATIONS.length - 1 ? 'Next →' : '🧱 Go Simulate! →'}
          </button>
        </div>
      </div>
    </div>
  );
}
