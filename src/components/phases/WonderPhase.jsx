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
    if (audioEnabled) {
      narrate(wonderNarration());
    }
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
      animation: 'fadeIn 0.5s ease-out',
      padding: '0 16px'
    }}>
      {/* Baker Muffins Card */}
      <div className="wonder-hook-card" style={{
        background: 'var(--bg-card)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '28px',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>🧁</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: '900',
            color: 'var(--gold)',
            margin: 0
          }}>
            <strong>Wei Ming's Bakery Challenge!</strong>
          </h2>
          <span style={{ fontSize: 32 }}>🧁</span>
        </div>

        <p style={{
          fontSize: '20px',
          color: '#ffffff',
          lineHeight: '1.65',
          marginBottom: '24px',
          fontWeight: '600'
        }}>
          <strong>Wei Ming</strong> baked <strong style={{ color: 'var(--gold)' }}>347 muffins</strong> for the school fair.<br />
          He sold <strong style={{ color: 'var(--coral)' }}>185 muffins</strong> in the morning.
          How many muffins are <strong>left in the shop</strong>?
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
            background: 'rgba(92,124,250,0.12)',
            border: '1px solid rgba(92,124,250,0.25)',
            borderRadius: '16px',
            padding: '14px',
            width: '200px'
          }}>
            <div style={{ fontSize: '13px', color: '#5c7cfa', fontWeight: '900' }}>BAKED: <strong>347</strong></div>
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
              background: clickedSold ? 'rgba(239,83,80,0.2)' : 'rgba(255,255,255,0.06)',
              border: clickedSold ? '2px dashed #ef5350' : '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '14px',
              width: '200px',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{ fontSize: '13px', color: clickedSold ? '#ef5350' : 'var(--text-secondary)', fontWeight: '900' }}>
              {clickedSold ? 'SOLD: 185 ❌' : 'CLICK TO SELL: 185 🛒'}
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
              gap: '12px',
              fontSize: '24px',
              fontWeight: '900',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              marginBottom: '16px'
            }}>
              <span style={{ background: 'rgba(92,124,250,0.2)', borderRadius: '10px', padding: '6px 14px', color: '#7c9cff' }}>347</span>
              <span>−</span>
              <span style={{ background: 'rgba(239,83,80,0.2)', borderRadius: '10px', padding: '6px 14px', color: '#ff7070' }}>185</span>
              <span>=</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '6px 14px', color: 'var(--gold)' }}>???</span>
            </div>
            <button 
              className="btn btn-orange wonder-reveal-btn" 
              onClick={handleReveal}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(245,124,0,0.4)'
              }}
            >
              🎉 <strong>Reveal the Column Secret!</strong>
            </button>
          </div>
        )}

        {showAnswer && (
          <div style={{ marginTop: '20px', animation: 'bounceIn 0.4s ease' }}>
            <div className="wonder-answer-reveal" style={{
              fontSize: '26px',
              fontWeight: '900',
              color: '#4caf50',
              textShadow: '0 0 12px rgba(76,175,80,0.4)'
            }}>
              <strong>Column Subtraction with Borrowing!</strong> 🔀
            </div>
            <p style={{ marginTop: '14px', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Solving <strong style={{ color: '#fff' }}>347 − 185</strong> requires <strong>borrowing from the Hundreds place</strong>.<br />
              Let's learn how to crack this column code step by step with <strong>Wei Ming</strong>!
            </p>
          </div>
        )}
      </div>

      {/* Mascot bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', alignSelf: 'flex-start', width: '100%' }}>
        <Mascot mood={showAnswer ? 'celebrating' : 'curious'} size={80} />
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
          {!clickedSold
            ? <span>Muffins sold? Click on the <strong>SOLD</strong> tray to remove them! 🧁</span>
            : !showAnswer
            ? <span>Can you solve <strong>347 − 185</strong>? It requires <strong>borrowing</strong>! 🤔</span>
            : <span>Amazing! Let's head over to the story and see how columns work with <strong>Wei Ming</strong>! 📖</span>
          }
        </div>
      </div>

      {showAnswer && (
        <button 
          className="btn btn-primary btn-lg" 
          onClick={onComplete} 
          style={{
            alignSelf: 'center',
            padding: '16px 40px',
            fontSize: '1.15rem',
            fontWeight: '900',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(29,78,216,0.5)',
            marginTop: '12px'
          }}
        >
          📖 <strong>Let's Learn the Story! →</strong>
        </button>
      )}
    </div>
  );
}
