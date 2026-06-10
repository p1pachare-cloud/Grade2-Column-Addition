// src/components/FloatingNumbers.jsx
import React from 'react';

const NUMBERS = ['100', '200', '300', '1000', '500', '750', '123', '456', '789', '642', '381', '917', '555', '800', '234'];

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {NUMBERS.map((num, i) => (
        <div
          key={i}
          className="floating-number"
          style={{
            left: `${(i * 6.5 + 3) % 95}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${18 + (i % 7) * 3}s`,
            fontSize: `${2 + (i % 3)}rem`,
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
}
