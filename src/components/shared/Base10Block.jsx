// src/components/shared/Base10Block.jsx
import React from 'react';

export function HundredFlat({ size = 60, label = true, animated = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 60 60"
      className="block-hundred"
      style={animated ? { animation: 'blockSnap 0.3s ease' } : {}}
    >
      <rect width="60" height="60" fill="#4A90D9" rx="3" />
      {[6,12,18,24,30,36,42,48,54].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#2E6DB4" strokeWidth="0.5" />
      ))}
      {[6,12,18,24,30,36,42,48,54].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="60" y2={y} stroke="#2E6DB4" strokeWidth="0.5" />
      ))}
      {label && (
        <text x="30" y="35" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Fredoka One, cursive">100</text>
      )}
    </svg>
  );
}

export function TenRod({ size = 12, label = true, animated = false }) {
  const h = size * 5;
  return (
    <svg
      width={size} height={h} viewBox="0 0 12 60"
      className="block-ten"
      style={animated ? { animation: 'blockSnap 0.3s ease' } : {}}
    >
      <rect width="12" height="60" fill="#FF8A50" rx="2" />
      {[6,12,18,24,30,36,42,48,54].map(y => (
        <line key={y} x1="0" y1={y} x2="12" y2={y} stroke="#E65C00" strokeWidth="0.5" />
      ))}
      {label && (
        <text x="6" y="34" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Fredoka One, cursive">10</text>
      )}
    </svg>
  );
}

export function OneCube({ size = 14, animated = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 14 14"
      className="block-one"
      style={animated ? { animation: 'blockSnap 0.3s ease' } : {}}
    >
      <rect width="14" height="14" fill="#4CAF50" rx="2" />
      <text x="7" y="10" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Fredoka One, cursive">1</text>
    </svg>
  );
}

// Reusable grouped block display
export default function Base10Block({ type = 'hundred', size, label = true, animated = false }) {
  if (type === 'hundred') return <HundredFlat size={size} label={label} animated={animated} />;
  if (type === 'ten')     return <TenRod size={size} label={label} animated={animated} />;
  return <OneCube size={size} animated={animated} />;
}

// Show a number as base-10 blocks
export function NumberAsBlocks({ number, maxFlats = 9 }) {
  const h = Math.min(Math.floor(number / 100), maxFlats);
  const t = Math.floor((number % 100) / 10);
  const o = number % 10;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: h }).map((_, i) => (
        <HundredFlat key={`h${i}`} size={48} />
      ))}
      {Array.from({ length: t }).map((_, i) => (
        <TenRod key={`t${i}`} size={10} />
      ))}
      {Array.from({ length: o }).map((_, i) => (
        <OneCube key={`o${i}`} size={12} />
      ))}
    </div>
  );
}
