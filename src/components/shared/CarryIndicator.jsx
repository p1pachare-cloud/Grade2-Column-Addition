// src/components/shared/CarryIndicator.jsx
import React, { useEffect } from 'react';

export default function CarryIndicator({ fromColumn, active, onComplete }) {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // 1s animation duration
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  // fromColumn: 'ones' (animates O to T) or 'tens' (animates T to H)
  const isOnes = fromColumn === 'ones';
  
  return (
    <div 
      className={`carry-indicator carry-fly-${isOnes ? 'ones' : 'tens'}`} 
      style={{
        position: 'absolute',
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        background: '#e74c3c',
        color: '#fff',
        borderRadius: '50%',
        fontSize: '14px',
        fontWeight: '900',
        boxShadow: '0 0 10px rgba(231,76,60,0.8)',
        // Inline CSS animations
        animation: isOnes 
          ? 'carryOnesAnimation 1s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
          : 'carryTensAnimation 1s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }}
    >
      1
    </div>
  );
}
