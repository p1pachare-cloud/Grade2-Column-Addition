// src/components/shared/ColumnGrid.jsx
import React from 'react';

export default function ColumnGrid({
  topNumber,
  bottomNumber,
  operation,
  answer = '',
  // missingSlot can be: 'col_ones' | 'col_tens' | 'col_hunds' | 'answer'
  missingSlot = null,
  carryOnes = false, // Carry to Tens
  carryTens = false, // Carry to Hundreds
  borrowTens = false, // Borrowed from Tens to Ones
  borrowHunds = false, // Borrowed from Hundreds to Tens
  // Custom modified top row values (for simulation phase rendering)
  modifiedTop = null, // e.g. { H: 2, T: 3, O: 14 }
  // User input states (if inputting column by column)
  inputs = { H: '', T: '', O: '', answer: '' },
  activeColumn = null, // 'H' | 'T' | 'O' | 'answer'
  interactive = false,
  onCellClick = null, // callbacks for interactive mode
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const decompose = (n) => {
    if (n === undefined || n === null || n === '') return { H: '', T: '', O: '' };
    const num = Number(n);
    return {
      H: Math.floor(num / 100),
      T: Math.floor((num % 100) / 10),
      O: num % 10,
    };
  };

  const top = decompose(topNumber);
  const bot = decompose(bottomNumber);
  const ans = decompose(answer);

  // Determine size-based dimensions
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.2 : 1;
  const cellSize = 60 * scale;
  const fontSize = 28 * scale;
  const headerFontSize = 14 * scale;
  const carryFontSize = 14 * scale;
  const borrowFontSize = 12 * scale;

  return (
    <div className={`col-grid-wrapper size-${size}`} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(3, ${cellSize}px)`,
        gridAutoRows: 'auto',
        gap: `${4 * scale}px`,
        position: 'relative',
        fontFamily: 'var(--font-display), "Nunito", sans-serif',
      }}>
        {/* Row 0: Column Headers */}
        <div className="col-header col-h" style={{
          gridColumn: '1', gridRow: '1',
          background: '#27AE60', color: '#fff', fontWeight: 'bold', fontSize: `${headerFontSize}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: `${28 * scale}px`, borderRadius: '6px'
        }}>H</div>
        <div className="col-header col-t" style={{
          gridColumn: '2', gridRow: '1',
          background: '#F39C12', color: '#fff', fontWeight: 'bold', fontSize: `${headerFontSize}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: `${28 * scale}px`, borderRadius: '6px'
        }}>T</div>
        <div className="col-header col-o" style={{
          gridColumn: '3', gridRow: '1',
          background: '#2980B9', color: '#fff', fontWeight: 'bold', fontSize: `${headerFontSize}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: `${28 * scale}px`, borderRadius: '6px'
        }}>O</div>

        {/* Row 1: Carry Indicators (displayed above numbers) */}
        <div style={{ gridColumn: '1', gridRow: '2', height: `${20 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {carryTens && (
            <div className="carry-digit carry-h" style={{
              background: '#e74c3c', color: 'white', borderRadius: '50%',
              width: `${18 * scale}px`, height: `${18 * scale}px`,
              fontSize: `${carryFontSize}px`, fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'bounceIn 0.3s ease'
            }}>1</div>
          )}
        </div>
        <div style={{ gridColumn: '2', gridRow: '2', height: `${20 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {carryOnes && (
            <div className="carry-digit carry-t" style={{
              background: '#e74c3c', color: 'white', borderRadius: '50%',
              width: `${18 * scale}px`, height: `${18 * scale}px`,
              fontSize: `${carryFontSize}px`, fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'bounceIn 0.3s ease'
            }}>1</div>
          )}
        </div>
        <div style={{ gridColumn: '3', gridRow: '2', height: `${20 * scale}px` }}></div>

        {/* Row 2: Borrow Indicators (crossed-out or modified top numbers) */}
        {/* We overlay small numbers if borrowing happened */}
        <div style={{ gridColumn: '1', gridRow: '3', height: `${20 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {borrowHunds && (
            <span style={{ color: '#ef5350', fontSize: `${borrowFontSize}px`, fontWeight: 'bold', animation: 'bounceIn 0.3s ease' }}>
              {modifiedTop ? modifiedTop.H : top.H - 1}
            </span>
          )}
        </div>
        <div style={{ gridColumn: '2', gridRow: '3', height: `${20 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {borrowTens && (
            <span style={{ color: '#ef5350', fontSize: `${borrowFontSize}px`, fontWeight: 'bold', animation: 'bounceIn 0.3s ease' }}>
              {modifiedTop ? modifiedTop.T : top.T - 1}
            </span>
          )}
          {borrowHunds && !borrowTens && (
            <span style={{ color: '#2ecc71', fontSize: `${borrowFontSize}px`, fontWeight: 'bold', animation: 'bounceIn 0.3s ease' }}>
              +{10}
            </span>
          )}
        </div>
        <div style={{ gridColumn: '3', gridRow: '3', height: `${20 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {borrowTens && (
            <span style={{ color: '#2ecc71', fontSize: `${borrowFontSize}px`, fontWeight: 'bold', animation: 'bounceIn 0.3s ease' }}>
              +{10}
            </span>
          )}
        </div>

        {/* Row 3: Top Number */}
        {/* Hundreds */}
        <div className="col-cell" style={{
          gridColumn: '1', gridRow: '4', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <span style={{ textDecoration: borrowHunds ? 'line-through' : 'none', opacity: borrowHunds ? 0.4 : 1 }}>
            {top.H}
          </span>
        </div>
        {/* Tens */}
        <div className="col-cell" style={{
          gridColumn: '2', gridRow: '4', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <span style={{ textDecoration: (borrowTens || (borrowHunds && modifiedTop && modifiedTop.T !== top.T)) ? 'line-through' : 'none', opacity: (borrowTens || (borrowHunds && modifiedTop && modifiedTop.T !== top.T)) ? 0.4 : 1 }}>
            {top.T}
          </span>
        </div>
        {/* Ones */}
        <div className="col-cell" style={{
          gridColumn: '3', gridRow: '4', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <span style={{ textDecoration: (borrowTens && modifiedTop && modifiedTop.O !== top.O) ? 'line-through' : 'none', opacity: (borrowTens && modifiedTop && modifiedTop.O !== top.O) ? 0.4 : 1 }}>
            {top.O}
          </span>
        </div>

        {/* Row 4: Operation Symbol & Bottom Number */}
        <div className="col-op" style={{
          position: 'absolute',
          left: `-${24 * scale}px`,
          top: `${(28 + 20 + 20) * scale + (cellSize * 1.5) - (fontSize / 2)}px`,
          color: '#fff',
          fontSize: `${fontSize}px`,
          fontWeight: '800',
          fontFamily: 'var(--font-display)'
        }}>
          {operation}
        </div>

        {/* Hundreds */}
        <div className="col-cell" style={{
          gridColumn: '1', gridRow: '5', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{bot.H}</div>
        {/* Tens */}
        <div className="col-cell" style={{
          gridColumn: '2', gridRow: '5', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{bot.T}</div>
        {/* Ones */}
        <div className="col-cell" style={{
          gridColumn: '3', gridRow: '5', width: `${cellSize}px`, height: `${cellSize}px`,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{bot.O}</div>

        {/* Divider Line */}
        <div className="col-divider" style={{
          gridColumn: '1 / -1',
          gridRow: '6',
          height: `${4 * scale}px`,
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '4px',
          margin: `${6 * scale}px 0`
        }} />

        {/* Row 5: Answer Cells (Static or Interactive) */}
        {interactive ? (
          <>
            {/* Hundreds Answer Cell */}
            <div
              className={`col-cell ans-h ${missingSlot === 'col_hunds' ? 'col-blank' : ''} ${activeColumn === 'H' ? 'active' : ''}`}
              onClick={() => onCellClick?.('H')}
              style={{
                gridColumn: '1', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
                background: activeColumn === 'H' ? 'rgba(74, 144, 217, 0.2)' : 'rgba(255,255,255,0.08)',
                border: activeColumn === 'H' ? '2px solid #5c7cfa' : missingSlot === 'col_hunds' ? '2px dashed #5c7cfa' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              {inputs.H !== undefined ? inputs.H : ''}
            </div>

            {/* Tens Answer Cell */}
            <div
              className={`col-cell ans-t ${missingSlot === 'col_tens' ? 'col-blank' : ''} ${activeColumn === 'T' ? 'active' : ''}`}
              onClick={() => onCellClick?.('T')}
              style={{
                gridColumn: '2', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
                background: activeColumn === 'T' ? 'rgba(74, 144, 217, 0.2)' : 'rgba(255,255,255,0.08)',
                border: activeColumn === 'T' ? '2px solid #5c7cfa' : missingSlot === 'col_tens' ? '2px dashed #5c7cfa' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              {inputs.T !== undefined ? inputs.T : ''}
            </div>

            {/* Ones Answer Cell */}
            <div
              className={`col-cell ans-o ${missingSlot === 'col_ones' ? 'col-blank' : ''} ${activeColumn === 'O' ? 'active' : ''}`}
              onClick={() => onCellClick?.('O')}
              style={{
                gridColumn: '3', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
                background: activeColumn === 'O' ? 'rgba(74, 144, 217, 0.2)' : 'rgba(255,255,255,0.08)',
                border: activeColumn === 'O' ? '2px solid #5c7cfa' : missingSlot === 'col_ones' ? '2px dashed #5c7cfa' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              {inputs.O !== undefined ? inputs.O : ''}
            </div>
          </>
        ) : (
          <>
            {/* Non-interactive answer row */}
            <div className="col-cell" style={{
              gridColumn: '1', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {ans.H}
            </div>
            <div className="col-cell" style={{
              gridColumn: '2', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {ans.T}
            </div>
            <div className="col-cell" style={{
              gridColumn: '3', gridRow: '7', width: `${cellSize}px`, height: `${cellSize}px`,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: '#fff', fontSize: `${fontSize}px`, fontWeight: '800',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {ans.O}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
