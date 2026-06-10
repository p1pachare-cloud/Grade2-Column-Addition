// src/components/shared/BorrowIndicator.jsx
import React, { useEffect } from 'react';

export default function BorrowIndicator({ fromColumn, active, onComplete }) {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200); // 1.2s total animation time
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  // fromColumn: 'tens' (borrow from T to O) or 'hundreds' (borrow from H to T)
  const isTens = fromColumn === 'tens';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 50,
      overflow: 'visible'
    }}>
      {/* Red "-1" taking away */}
      <div style={{
        position: 'absolute',
        color: '#e74c3c',
        fontSize: '18px',
        fontWeight: 'bold',
        textShadow: '0 0 4px rgba(231,76,60,0.5)',
        left: isTens ? '50%' : '16%', // center or left-most
        top: '20px',
        transform: 'translateX(-50%)',
        animation: 'borrowMinusAnim 1s ease-out forwards'
      }}>
        -1
      </div>

      {/* Green "+10" flying to target */}
      <div style={{
        position: 'absolute',
        background: '#2ecc71',
        color: 'white',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '13px',
        fontWeight: 'bold',
        boxShadow: '0 0 10px rgba(46,204,113,0.8)',
        left: isTens ? '50%' : '16%',
        top: '20px',
        animation: isTens 
          ? 'borrowPlusToOnesAnim 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          : 'borrowPlusToTensAnim 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }}>
        +10
      </div>
    </div>
  );
}
