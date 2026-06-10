// src/components/simulations/BlockBuilder.jsx
import React, { useState, useEffect } from 'react';
import Base10Block from '../shared/Base10Block.jsx';
import { SFX } from '../../utils/audio.js';

export default function BlockBuilder({ onComplete }) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [placed, setPlaced] = useState({ H: 0, T: 0, O: 0 });
  const [target, setTarget] = useState({ H: 2, T: 4, O: 5 }); // initial
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const targets = [
    { H: 2, T: 3, O: 5 }, // 235
    { H: 3, T: 5, O: 8 }, // 358
    { H: 1, T: 4, O: 2 }, // 142
  ];

  useEffect(() => {
    setTarget(targets[problemIndex % targets.length]);
    setPlaced({ H: 0, T: 0, O: 0 });
    setShowFeedback(false);
    setIsWrong(false);
  }, [problemIndex]);

  const targetNumber = target.H * 100 + target.T * 10 + target.O;
  const currentNumber = placed.H * 100 + placed.T * 10 + placed.O;

  const handleAdjust = (place, amount) => {
    SFX.click();
    setPlaced(prev => {
      const newVal = Math.max(0, Math.min(9, prev[place] + amount));
      return { ...prev, [place]: newVal };
    });
  };

  const handleCheck = () => {
    const correct = placed.H === target.H && placed.T === target.T && placed.O === target.O;
    if (correct) {
      SFX.correct();
      setShowFeedback(true);
      setIsWrong(false);
      setTimeout(() => {
        if (problemIndex < 2) {
          setProblemIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      SFX.wrong();
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 800);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Station Title & Progress */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          margin: '0 0 4px 0',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>Station A: Base-10 Block Builder</h2>
        <div style={{
          fontSize: '13px',
          color: '#b0b0d0',
          fontWeight: '600',
          fontFamily: 'var(--font-body)'
        }}>
          Problem {problemIndex + 1} of 3
        </div>
      </div>

      {/* Target display */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(80, 227, 194, 0.15))',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        padding: '12px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '12px', color: '#88a3e0', fontWeight: '800', letterSpacing: '1px' }}>BUILD THE TARGET</div>
        <div style={{
          fontSize: '48px',
          fontWeight: '900',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          textShadow: '0 0 15px rgba(255,255,255,0.2)',
          lineHeight: '1'
        }}>
          {targetNumber}
        </div>
      </div>

      {/* Target Breakdown scaffolding */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <div style={{ color: '#5c7cfa', fontWeight: 'bold', fontSize: '14px' }}>{target.H} Hundreds</div>
        <div style={{ color: '#ff8a50', fontWeight: 'bold', fontSize: '14px' }}>{target.T} Tens</div>
        <div style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>{target.O} Ones</div>
      </div>

      {/* Columns & Shelves */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        width: '100%',
        minHeight: '280px',
        alignItems: 'stretch'
      }}>
        {/* HUNDREDS COLUMN */}
        <div style={{
          background: 'rgba(92,124,250,0.06)',
          border: '1.5px solid rgba(92,124,250,0.2)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'relative',
          boxShadow: placed.H === target.H ? '0 0 15px rgba(92,124,250,0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#5c7cfa', letterSpacing: '0.5px' }}>HUNDREDS</div>
          
          {/* Blocks container */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center',
            alignContent: 'center',
            minHeight: '120px',
            width: '100%'
          }}>
            {Array.from({ length: placed.H }).map((_, i) => (
              <div key={i} style={{ animation: 'bounceIn 0.2s ease forwards' }}>
                <Base10Block type="hundred" size={40} label={false} />
              </div>
            ))}
            {placed.H === 0 && (
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', fontStyle: 'italic' }}>Empty</span>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleAdjust('H', -1)}
              disabled={placed.H === 0}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.H === 0 ? 'rgba(255,255,255,0.05)' : '#e74c3c',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.H === 0 ? 0.3 : 1
              }}
            >-</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', minWidth: '20px', textAlign: 'center' }}>
              {placed.H}
            </span>
            <button
              onClick={() => handleAdjust('H', 1)}
              disabled={placed.H === 9}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.H === 9 ? 'rgba(255,255,255,0.05)' : '#27ae60',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.H === 9 ? 0.3 : 1
              }}
            >+</button>
          </div>
        </div>

        {/* TENS COLUMN */}
        <div style={{
          background: 'rgba(255,138,80,0.06)',
          border: '1.5px solid rgba(255,138,80,0.2)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'relative',
          boxShadow: placed.T === target.T ? '0 0 15px rgba(255,138,80,0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#ff8a50', letterSpacing: '0.5px' }}>TENS</div>

          {/* Blocks container */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            justifyContent: 'center',
            alignContent: 'center',
            minHeight: '120px',
            width: '100%'
          }}>
            {Array.from({ length: placed.T }).map((_, i) => (
              <div key={i} style={{ animation: 'bounceIn 0.2s ease forwards' }}>
                <Base10Block type="ten" size={8} label={false} />
              </div>
            ))}
            {placed.T === 0 && (
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', fontStyle: 'italic' }}>Empty</span>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleAdjust('T', -1)}
              disabled={placed.T === 0}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.T === 0 ? 'rgba(255,255,255,0.05)' : '#e74c3c',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.T === 0 ? 0.3 : 1
              }}
            >-</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', minWidth: '20px', textAlign: 'center' }}>
              {placed.T}
            </span>
            <button
              onClick={() => handleAdjust('T', 1)}
              disabled={placed.T === 9}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.T === 9 ? 'rgba(255,255,255,0.05)' : '#27ae60',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.T === 9 ? 0.3 : 1
              }}
            >+</button>
          </div>
        </div>

        {/* ONES COLUMN */}
        <div style={{
          background: 'rgba(76,175,80,0.06)',
          border: '1.5px solid rgba(76,175,80,0.2)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'relative',
          boxShadow: placed.O === target.O ? '0 0 15px rgba(76,175,80,0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#4caf50', letterSpacing: '0.5px' }}>ONES</div>

          {/* Blocks container */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            justifyContent: 'center',
            alignContent: 'center',
            minHeight: '120px',
            width: '100%'
          }}>
            {Array.from({ length: placed.O }).map((_, i) => (
              <div key={i} style={{ animation: 'bounceIn 0.2s ease forwards' }}>
                <Base10Block type="one" size={12} />
              </div>
            ))}
            {placed.O === 0 && (
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', fontStyle: 'italic' }}>Empty</span>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleAdjust('O', -1)}
              disabled={placed.O === 0}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.O === 0 ? 'rgba(255,255,255,0.05)' : '#e74c3c',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.O === 0 ? 0.3 : 1
              }}
            >-</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', minWidth: '20px', textAlign: 'center' }}>
              {placed.O}
            </span>
            <button
              onClick={() => handleAdjust('O', 1)}
              disabled={placed.O === 9}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                background: placed.O === 9 ? 'rgba(255,255,255,0.05)' : '#27ae60',
                color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                opacity: placed.O === 9 ? 0.3 : 1
              }}
            >+</button>
          </div>
        </div>
      </div>

      {/* Main Check / Action Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <button
          onClick={handleCheck}
          disabled={showFeedback}
          style={{
            padding: '14px 48px',
            fontSize: '18px',
            fontWeight: '800',
            border: 'none',
            borderRadius: '16px',
            background: isWrong
              ? '#f44336'
              : showFeedback
                ? '#2ecc71'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff',
            cursor: showFeedback ? 'default' : 'pointer',
            boxShadow: isWrong
              ? '0 0 20px rgba(244,67,54,0.5)'
              : showFeedback
                ? '0 0 20px rgba(46,204,113,0.5)'
                : '0 6px 20px rgba(29,78,216,0.3)',
            transition: 'all 0.2s ease',
            transform: isWrong ? 'scale(1.05)' : 'none'
          }}
        >
          {isWrong
            ? 'Try Again! ❌'
            : showFeedback
              ? 'Correct! 🎉'
              : 'Check Blocks! 🔍'}
        </button>

        {/* Dynamic scaffolding helper display */}
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: '600',
          fontFamily: 'var(--font-body)',
          height: '20px'
        }}>
          {currentNumber > 0 && `Your blocks show: ${currentNumber}`}
        </div>
      </div>
    </div>
  );
}
