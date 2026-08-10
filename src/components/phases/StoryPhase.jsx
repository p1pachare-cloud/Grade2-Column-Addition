// src/components/phases/StoryPhase.jsx
import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import Base10Block from '../shared/Base10Block.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import { STORY_NARRATIONS } from '../../utils/narration.js';

function StoryImage({ src, alt }) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 28px rgba(0, 0, 0, 0.3)'
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '340px',
          objectFit: 'contain',
          borderRadius: '16px'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<div style="padding: 40px; text-align: center; color: #88a3e0; font-weight: bold; background: rgba(255,255,255,0.05); border-radius: 16px; width: 100%;">[Story Illustration: ${alt}]</div>`;
        }}
      />
    </div>
  );
}

export default function StoryPhase({ audioEnabled, onComplete }) {
  const [panelIdx, setPanelIdx] = useState(0);

  useEffect(() => {
    if (audioEnabled) {
      narrate(STORY_NARRATIONS[panelIdx]());
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

  const renderVisual = () => {
    switch (panelIdx) {
      case 0:
        return <StoryImage src="/images/story-panel-1.jpg" alt="Wei Ming's Book Collection" />;
      case 1:
        return <StoryImage src="/images/story-panel-2.jpg" alt="The Total Book Count" />;
      case 2:
        return <StoryImage src="/images/story-panel-3.jpg" alt="Setting Up Columns in Grid" />;
      case 3:
        return <StoryImage src="/images/story-panel-4.jpg" alt="Add Ones Column: 4 + 8 = 12" />;
      case 4:
        return <StoryImage src="/images/story-panel-5.jpg" alt="Regrouping Ones to Tens" />;
      case 5:
        return <StoryImage src="/images/story-panel-6.jpg" alt="Adding Tens Column: 1 + 3 + 5 = 9" />;
      case 6:
        return <StoryImage src="/images/story-panel-7.jpg" alt="Adding Hundreds Column: 2 + 1 = 3 -> Total 392" />;
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
      case 0: return <span>Look at <strong>Wei Ming's</strong> book collection! Stacking them up is going to take a lot of math! 📚</span>;
      case 1: return <span>How can we find the total easily? Let's stack them in <strong>columns</strong>! ➕</span>;
      case 2: return <span>Make sure to align <strong>Hundreds</strong>, <strong>Tens</strong>, and <strong>Ones</strong> correctly in the grid. 📐</span>;
      case 3: return <span><strong>4 + 8 = 12</strong>. That's greater than 9! We need to <strong>regroup</strong>. 🔄</span>;
      case 4: return <span>We <strong>carry the 1</strong> to the Tens column, leaving <strong>2</strong> in the Ones place! 🛫</span>;
      case 5: return <span>Don't forget to add the <strong>carried 1</strong> when you add the Tens column! ➕</span>;
      case 6: return <span><strong>392 books</strong> total! You have mastered column addition with <strong>Wei Ming</strong>! 🌟</span>;
      default: return "";
    }
  };

  const panelJSX = [
    <p key="0"><strong>Wei Ming</strong> has <strong>234 books</strong>. His friend has <strong>158 books</strong>.</p>,
    <p key="1">How many books do they have <strong>altogether</strong>?</p>,
    <p key="2">Write the numbers one on top of the other. <strong>Hundreds</strong> under hundreds, <strong>Tens</strong> under tens, <strong>Ones</strong> under ones.</p>,
    <p key="3">Start with the <strong>Ones column</strong>: <strong>4 ones + 8 ones = 12 ones</strong>. Since this is 10 or more, we must <strong>regroup</strong>!</p>,
    <p key="4">Regroup <strong>10 ones into 1 ten</strong>. Write <strong>2</strong> in the ones column, and <strong>carry 1</strong> to the tens column.</p>,
    <p key="5">Now add the <strong>Tens column</strong>: <strong>1 carried ten + 3 tens + 5 tens = 9 tens</strong>. Write <strong>9</strong> in the tens column.</p>,
    <p key="6">Finally, add the <strong>Hundreds column</strong>: <strong>2 hundreds + 1 hundred = 3 hundreds</strong>. They have <strong>392 books</strong> altogether!</p>
  ];

  return (
    <div className="story-phase" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'fadeIn 0.5s ease-out',
      padding: '0 16px'
    }}>
      <div className="story-panel" style={{
        background: 'var(--bg-card)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '24px',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Step Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '12px'
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            color: 'var(--gold)',
            fontWeight: '900',
            letterSpacing: '1px'
          }}>
            STORY STEP {panelIdx + 1} OF {STORY_NARRATIONS.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {STORY_NARRATIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i === panelIdx ? 'var(--blue-primary)' : i < panelIdx ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Visual Content */}
        <div style={{ width: '100%', minHeight: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {renderVisual()}
        </div>

        {/* Paragraph Text */}
        <div style={{
          fontSize: '22px',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: '1.65',
          maxWidth: '720px',
          margin: '12px 0',
          fontWeight: '600'
        }}>
          {panelJSX[panelIdx]}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={goPrev}
            disabled={panelIdx === 0}
            style={{
              padding: '12px 28px',
              fontSize: '16px',
              borderRadius: '14px',
              opacity: panelIdx === 0 ? 0.4 : 1,
              cursor: panelIdx === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ⬅ <strong>Back</strong>
          </button>
          <button
            className="btn btn-primary"
            onClick={goNext}
            style={{
              padding: '12px 32px',
              fontSize: '17px',
              borderRadius: '14px',
              fontWeight: '900',
              boxShadow: '0 4px 20px rgba(92,124,250,0.45)'
            }}
          >
            {panelIdx === STORY_NARRATIONS.length - 1 ? <strong>Complete Story 🎉</strong> : <strong>Next Step ➔</strong>}
          </button>
        </div>
      </div>

      {/* Mascot bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', alignSelf: 'flex-start', width: '100%' }}>
        <Mascot mood={getMascotMood()} size={80} />
        <div className="mascot-bubble" style={{
          fontSize: '18px',
          background: 'var(--bg-card)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          borderRadius: '20px 20px 20px 0',
          padding: '16px 22px',
          color: '#ffffff',
          lineHeight: '1.55',
          maxWidth: '85%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
        }}>
          {getMascotBubble()}
        </div>
      </div>
    </div>
  );
}
