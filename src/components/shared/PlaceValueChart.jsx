// src/components/shared/PlaceValueChart.jsx — REDESIGNED
import React from 'react';

export default function PlaceValueChart({ hundreds, tens, ones, missing = null, size = 'md', animated = false }) {
  const cols = [
    { label: 'HUNDREDS', value: hundreds, key: 'h', accent: '#5c7cfa', glow: 'rgba(92,124,250,0.35)', bg: 'rgba(92,124,250,0.12)', border: 'rgba(92,124,250,0.40)' },
    { label: 'TENS',     value: tens,     key: 't', accent: '#ff8a50', glow: 'rgba(255,138,80,0.35)',  bg: 'rgba(255,138,80,0.12)',  border: 'rgba(255,138,80,0.40)' },
    { label: 'ONES',     value: ones,     key: 'o', accent: '#4caf50', glow: 'rgba(76,175,80,0.35)',   bg: 'rgba(76,175,80,0.12)',   border: 'rgba(76,175,80,0.40)' },
  ];

  const isLg = size === 'lg';

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      alignItems: 'stretch',
    }}>
      {cols.map((col, i) => {
        const isMissing = missing === col.key;
        const val = isMissing ? '?' : (col.value === null || col.value === undefined ? '–' : col.value);
        return (
          <React.Fragment key={col.key}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              borderRadius: 14,
              overflow: 'hidden',
              border: `2px solid ${col.border}`,
              background: col.bg,
              minWidth: isLg ? 80 : 64,
              boxShadow: animated ? `0 0 18px ${col.glow}` : 'none',
              transition: 'box-shadow 0.4s ease',
            }}>
              {/* Label header */}
              <div style={{
                background: col.accent,
                width: '100%',
                textAlign: 'center',
                padding: isLg ? '6px 8px' : '4px 6px',
                fontSize: isLg ? 11 : 9,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'white',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
              }}>
                {col.label}
              </div>
              {/* Value */}
              <div style={{
                padding: isLg ? '14px 8px' : '10px 6px',
                fontFamily: 'var(--font-display)',
                fontSize: isLg ? 40 : 32,
                fontWeight: 700,
                color: isMissing ? col.accent : 'var(--text-primary)',
                lineHeight: 1,
                minWidth: isLg ? 48 : 36,
                textAlign: 'center',
                animation: animated ? 'chartFill 0.4s ease' : 'none',
              }}>
                {val}
              </div>
            </div>
            {/* Separator dots between columns */}
            {i < cols.length - 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: isLg ? 16 : 12,
                gap: 4,
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
