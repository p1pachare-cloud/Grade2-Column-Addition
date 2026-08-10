// src/components/shared/NumberPad.jsx
import React from 'react';
import { SFX } from '../../utils/audio.js';

export default function NumberPad({
  value,
  onChange,
  onSubmit,
  max = 999,
  disabled = false,
}) {
  const handleDigit = (digit) => {
    if (disabled) return;
    SFX.click();
    const str = String(value || '');
    if (str.length >= String(max).length) return;
    onChange(str === '0' ? String(digit) : str + digit);
  };

  const handleBackspace = () => {
    if (disabled) return;
    SFX.click();
    const str = String(value || '');
    if (str.length <= 1) {
      onChange('');
    } else {
      onChange(str.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (disabled) return;
    SFX.click();
    onChange('');
  };

  const handleOK = () => {
    if (disabled || value === '' || value === null || value === undefined) return;
    SFX.click();
    if (onSubmit) onSubmit();
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      className="numpad-wrapper"
      style={{
        background: 'rgba(25, 25, 75, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        padding: '18px',
        width: '260px',
        margin: '0 auto',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'not-allowed' : 'auto',
        transition: 'all 0.3s ease',
        userSelect: 'none',
      }}
    >
      {/* Display Screen */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(10, 10, 35, 0.9), rgba(18, 18, 50, 0.95))',
          border: '1.5px solid rgba(92, 124, 250, 0.3)',
          borderRadius: '16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(92, 124, 250, 0.15)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '30px',
            fontWeight: '900',
            color: value !== '' && value !== null && value !== undefined ? 'var(--gold)' : 'rgba(255, 255, 255, 0.25)',
            textShadow: value !== '' && value !== null && value !== undefined ? '0 0 12px rgba(255, 193, 7, 0.6)' : 'none',
            letterSpacing: '2px',
          }}
        >
          {value === '' || value === null || value === undefined ? '?' : value}
        </span>
      </div>

      {/* Digits Grid 3x4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {digits.map((d) => (
          <button
            key={d}
            type="button"
            className="numpad-key-btn"
            onClick={() => handleDigit(d)}
            disabled={disabled}
          >
            {d}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          className="numpad-key-btn numpad-clear-btn"
          onClick={handleClear}
          disabled={disabled}
          title="Clear input"
        >
          C
        </button>

        {/* 0 Digit */}
        <button
          type="button"
          className="numpad-key-btn"
          onClick={() => handleDigit(0)}
          disabled={disabled}
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          className="numpad-key-btn numpad-backspace-btn"
          onClick={handleBackspace}
          disabled={disabled}
          title="Backspace"
        >
          ⌫
        </button>
      </div>

      {/* Submit / OK Button */}
      {onSubmit && (
        <button
          type="button"
          className="numpad-submit-action-btn"
          onClick={handleOK}
          disabled={disabled || value === '' || value === null || value === undefined}
        >
          <strong>OK</strong>
        </button>
      )}
    </div>
  );
}
