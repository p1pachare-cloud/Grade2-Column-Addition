// src/components/phases/WonderPhase.jsx
import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import { HundredFlat, TenRod, OneCube } from '../shared/Base10Block.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export default function WonderPhase({ audioEnabled, onComplete }) {
  const [clickedSold, setClickedSold] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration());
    return () => stopNarration();
  }, [audioEnabled]);

  const handleReveal = () => {
    SFX.correct();
    setShowAnswer(true);
  };

  return (
    <div className="wonder-phase" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Baker Muffins Card */}
      <div className="wonder-hook-card" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🧁</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: '900',
            color: '#ff8a50',
            margin: 0
          }}>
            The Bakery Challenge!
          </h2>
          <span style={{ fontSize: 32 }}>🧁</span>
        </div>

        <p style={{
          fontSize: '16px',
          color: '#e0e0ff',
          lineHeight: '1.6',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          A baker baked <strong style={{ color: '#ff8a50' }}>347 muffins</strong>.<br />
          She sold <strong style={{ color: '#ff8a50' }}>185 of them</strong>.
          How many muffins are still in the shop?
        </p>

        {/* Dynamic blocks representing 347 and 185 */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {/* Total baked */}
          <div style={{
            background: 'rgba(92,124,250,0.08)',
            border: '1px solid rgba(92,124,250,0.15)',
            borderRadius: '16px',
            padding: '12px',
            width: '180px'
          }}>
            <div style={{ fontSize: '12px', color: '#5c7cfa', fontWeight: 'bold' }}>BAKED: 347</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginTop: '8px' }}>
              <HundredFlat size={24} label={false} />
              <HundredFlat size={24} label={false} />
              <HundredFlat size={24} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
            </div>
          </div>

          {/* Sold */}
          <div 
            onClick={() => { SFX.click(); setClickedSold(true); }}
            style={{
              background: clickedSold ? 'rgba(239,83,80,0.15)' : 'rgba(255,255,255,0.05)',
              border: clickedSold ? '1.5px dashed #ef5350' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '12px',
              width: '180px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '12px', color: clickedSold ? '#ef5350' : '#b0b0d0', fontWeight: 'bold' }}>
              {clickedSold ? 'SOLD: 185 ❌' : 'CLICK TO SELL: 185'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginTop: '8px', opacity: clickedSold ? 0.35 : 1 }}>
              <HundredFlat size={24} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <TenRod size={6} label={false} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
              <OneCube size={8} />
            </div>
          </div>
        </div>

        {clickedSold && !showAnswer && (
          <div style={{ animation: 'bounceIn 0.3s ease', marginTop: '16px' }}>
            <div className="wonder-equation" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '22px',
              fontWeight: '800',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              marginBottom: '12px'
            }}>
              <span style={{ background: 'rgba(92,124,250,0.15)', borderRadius: '8px', padding: '4px 12px', color: '#5c7cfa' }}>347</span>
              <span>−</span>
              <span style={{ background: 'rgba(239,83,80,0.15)', borderRadius: '8px', padding: '4px 12px', color: '#ef5350' }}>185</span>
              <span>=</span>
              <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '4px 12px', color: '#fff3e0' }}>???</span>
            </div>
            <button 
              className="btn btn-orange wonder-reveal-btn" 
              onClick={handleReveal}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245,124,0,0.3)'
              }}
            >
              🎉 Reveal the Challenge!
            </button>
          </div>
        )}

        {showAnswer && (
          <div style={{ marginTop: '20px', animation: 'bounceIn 0.4s ease' }}>
            <div className="wonder-answer-reveal" style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#2ecc71',
              textShadow: '0 0 10px rgba(46,204,113,0.3)'
            }}>
              Subtracting Columns! 🔀
            </div>
            <p style={{ marginTop: '12px', fontSize: '15px', color: '#d0d0ff', lineHeight: '1.6', margin: '12px 0 0 0' }}>
              Calculating <strong>347 − 185</strong> takes borrowing from the hundreds place.
              Let's learn how to crack this column code step by step!
            </p>
          </div>
        )}
      </div>

      {/* Mascot bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', alignSelf: 'flex-start' }}>
        <Mascot mood={showAnswer ? 'celebrating' : 'curious'} size={72} />
        <div className="mascot-bubble" style={{
          fontSize: '15px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px 16px 16px 0',
          padding: '12px 16px',
          color: '#d0d5ff',
          lineHeight: '1.4',
          maxWidth: '80%'
        }}>
          {!clickedSold
            ? "Muffins sold? Click on the 'SOLD' tray to remove them! 🧁"
            : !showAnswer
            ? "Can you solve 347 − 185? It requires borrowing! 🤔"
            : "Amazing! Let's head over to the story and see how columns work! 📖"
          }
        </div>
      </div>

      {showAnswer && (
        <button 
          className="btn btn-primary btn-lg" 
          onClick={onComplete} 
          style={{
            alignSelf: 'center',
            padding: '14px 36px',
            fontSize: '18px',
            fontWeight: '800',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(29,78,216,0.4)'
          }}
        >
          📖 Let's Learn the Story! →
        </button>
      )}
    </div>
  );
}
