// src/components/phases/SimulatePhase.jsx
import React, { useState, useEffect } from 'react';
import BlockBuilder from '../simulations/BlockBuilder.jsx';
import ColumnAdd from '../simulations/ColumnAdd.jsx';
import ColumnSub from '../simulations/ColumnSub.jsx';
import { narrate, stopNarration, SFX } from '../../utils/audio.js';
import {
  simulateStation1Intro,
  simulateStation2Intro,
  simulateStation3Intro,
} from '../../utils/narration.js';

const STATIONS = [
  { id: 1, label: '🧱 Block Builder', emoji: '🧱', desc: 'Build 3-digit numbers using Base-10 blocks' },
  { id: 2, label: '➕ Column Addition', emoji: '➕', desc: 'Add numbers step by step and learn to regroup' },
  { id: 3, label: '➖ Column Subtraction', emoji: '➖', desc: 'Subtract numbers step by step and learn to borrow' },
];

const NARRATIONS = [simulateStation1Intro, simulateStation2Intro, simulateStation3Intro];

export default function SimulatePhase({ audioEnabled, onComplete }) {
  const [activeStation, setActiveStation] = useState(0);
  const [completed, setCompleted] = useState([false, false, false]);

  useEffect(() => {
    if (audioEnabled) {
      narrate(NARRATIONS[activeStation]());
    }
    return () => stopNarration();
  }, [activeStation, audioEnabled]);

  function completeStation(i) {
    SFX.levelUp();
    const newCompleted = [...completed];
    newCompleted[i] = true;
    setCompleted(newCompleted);

    if (newCompleted.every(Boolean)) {
      setTimeout(() => onComplete(newCompleted), 1000);
    } else {
      // Find next incomplete station
      const next = newCompleted.findIndex(c => !c);
      if (next >= 0) setActiveStation(next);
    }
  }

  return (
    <div className="simulate-phase" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Station tabs */}
      <div className="station-tabs" style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '10px'
      }}>
        {STATIONS.map((st, i) => (
          <button
            key={st.id}
            className={`station-tab ${i === activeStation ? 'active' : ''} ${completed[i] ? 'complete' : ''}`}
            onClick={() => setActiveStation(i)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: i === activeStation ? '1.5px solid #5c7cfa' : '1px solid rgba(255,255,255,0.1)',
              background: i === activeStation ? 'rgba(92, 124, 250, 0.15)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: i === activeStation ? '0 0 15px rgba(92,124,250,0.2)' : 'none'
            }}
          >
            {completed[i] && <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✓</span>}
            <span>{st.emoji}</span>
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* Station content container */}
      <div className="station-content" style={{
        minHeight: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {activeStation === 0 && <BlockBuilder onComplete={() => completeStation(0)} />}
        {activeStation === 1 && <ColumnAdd onComplete={() => completeStation(1)} />}
        {activeStation === 2 && <ColumnSub onComplete={() => completeStation(2)} />}
      </div>

      {/* Complete prompt (just in case they need to click to advance) */}
      {completed.every(Boolean) && (
        <div style={{
          background: 'rgba(46,204,113,0.15)',
          border: '1.5px solid #2ecc71',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          marginTop: '20px',
          animation: 'bounceIn 0.5s ease'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#2ecc71', fontWeight: 'bold' }}>
            All 3 Simulation Stations Complete!
          </div>
          <p style={{ color: '#b0b0d0', margin: '4px 0 16px 0', fontSize: '14px' }}>
            You are now ready to tackle the play challenges!
          </p>
          <button 
            className="btn btn-success" 
            onClick={() => onComplete(completed)}
            style={{
              padding: '12px 36px',
              fontSize: '16px',
              fontWeight: '800',
              borderRadius: '12px',
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(46,204,113,0.3)'
            }}
          >
            🎮 Go to Play Phase!
          </button>
        </div>
      )}
    </div>
  );
}
