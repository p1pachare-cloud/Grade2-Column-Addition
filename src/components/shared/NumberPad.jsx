// src/components/shared/NumberPad.jsx
import React from 'react';

export default function NumberPad({ value, onChange, onSubmit, max = 999 }) {
  const handleDigit = (digit) => {
    const str = String(value || '');
    if (str.length >= String(max).length) return;
    onChange(str === '0' ? String(digit) : str + digit);
  };

  const handleBackspace = () => {
    const str = String(value || '');
    if (str.length <= 1) {
      onChange('');
    } else {
      onChange(str.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad-container" style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '16px',
      maxWidth: '280px',
      width: '100%',
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Display value (if any is active/visualized) */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'var(--font-display)',
        textShadow: '0 0 10px rgba(255,255,255,0.3)'
      }}>
        {value === '' ? <span style={{ opacity: 0.35 }}>?</span> : value}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        {digits.map(d => (
          <button
            key={d}
            type="button"
            className="numpad-btn"
            onClick={() => handleDigit(d)}
            style={{
              height: '60px',
              width: '100%',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              color: '#fff',
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
            }}
          >
            {d}
          </button>
        ))}

        {/* Clear */}
        <button
          type="button"
          className="numpad-btn clear"
          onClick={handleClear}
          style={{
            height: '60px',
            width: '100%',
            borderRadius: '12px',
            border: '1px solid rgba(239, 83, 80, 0.3)',
            background: 'rgba(239, 83, 80, 0.15)',
            color: '#ef9a9a',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          C
        </button>

        {/* 0 */}
        <button
          type="button"
          className="numpad-btn"
          onClick={() => handleDigit(0)}
          style={{
            height: '60px',
            width: '100%',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            color: '#fff',
            fontSize: '20px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          0
        </button>

        {/* Backspace */}
        <button
          type="button"
          className="numpad-btn backspace"
          onClick={handleBackspace}
          style={{
            height: '60px',
            width: '100%',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ⌫
        </button>
      </div>

      {onSubmit && (
        <button
          type="button"
          className="numpad-submit-btn"
          onClick={onSubmit}
          disabled={value === ''}
          style={{
            height: '50px',
            width: '100%',
            borderRadius: '12px',
            border: 'none',
            background: value === '' ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #42a5f5, #1e88e5)',
            color: value === '' ? 'rgba(255, 255, 255, 0.3)' : '#fff',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            cursor: value === '' ? 'not-allowed' : 'pointer',
            boxShadow: value === '' ? 'none' : '0 4px 12px rgba(30,136,229,0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '4px'
          }}
        >
          OK
        </button>
      )}
    </div>
  );
}
