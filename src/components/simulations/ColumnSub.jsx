// src/components/simulations/ColumnSub.jsx
import React, { useState, useEffect } from 'react';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import NumberPad from '../shared/NumberPad.jsx';
import BorrowIndicator from '../shared/BorrowIndicator.jsx';
import { SFX } from '../../utils/audio.js';

const PROBLEMS = [
  { top: 378, bot: 145, ansO: 3, ansT: 3, ansH: 2, total: 233, desc: "No borrowing needed. Direct column subtraction." },
  { top: 542, bot: 217, ansO: 5, ansT: 2, ansH: 3, total: 325, desc: "Borrow from Tens: 2 < 7, so borrow 1 ten to make 12 ones." },
  { top: 628, bot: 354, ansO: 4, ansT: 7, ansH: 2, total: 274, desc: "Borrow from Hundreds: 2 tens < 5 tens, borrow 1 hundred." },
  { top: 712, bot: 389, ansO: 3, ansT: 2, ansH: 3, total: 323, desc: "Double borrowing: Borrow in ones, then borrow in tens!" },
  { top: 802, bot: 367, ansO: 5, ansT: 3, ansH: 4, total: 435, desc: "Zero Zone: Borrow across zero in tens place." }
];

export default function ColumnSub({ onComplete }) {
  const [probIndex, setProbIndex] = useState(0);
  const [step, setStep] = useState('ones'); // 'ones' | 'borrow_ones' | 'tens' | 'borrow_tens' | 'hunds' | 'success'
  const [inputs, setInputs] = useState({ H: '', T: '', O: '' });
  const [currentVal, setCurrentVal] = useState('');
  
  // Borrow states
  const [borrowTens, setBorrowTens] = useState(false);
  const [borrowHunds, setBorrowHunds] = useState(false);
  const [modifiedTop, setModifiedTop] = useState({ H: 0, T: 0, O: 0 });
  const [activeColumn, setActiveColumn] = useState('O');
  const [feedback, setFeedback] = useState('');
  const [showBorrowBtn, setShowBorrowBtn] = useState(false);

  // Animation triggers
  const [animBorrowTens, setAnimBorrowTens] = useState(false);
  const [animBorrowHunds, setAnimBorrowHunds] = useState(false);

  const problem = PROBLEMS[probIndex];

  useEffect(() => {
    // Initial top digits
    const topH = Math.floor(problem.top / 100);
    const topT = Math.floor((problem.top % 100) / 10);
    const topO = problem.top % 10;

    setStep('ones');
    setInputs({ H: '', T: '', O: '' });
    setCurrentVal('');
    setBorrowTens(false);
    setBorrowHunds(false);
    setModifiedTop({ H: topH, T: topT, O: topO });
    setActiveColumn('O');
    setShowBorrowBtn(false);
    setAnimBorrowTens(false);
    setAnimBorrowHunds(false);

    // Check if ones column needs borrow right away
    const botO = problem.bot % 10;
    if (topO < botO) {
      setFeedback(`Let's solve ${problem.top} − ${problem.bot}. Ones: ${topO} is smaller than ${botO}! We must borrow. Tap the Borrow button.`);
      setShowBorrowBtn(true);
    } else {
      setFeedback(`Let's solve ${problem.top} − ${problem.bot}. Start with the Ones column: ${topO} − ${botO} = ?`);
    }
  }, [probIndex]);

  const handleNumChange = (val) => {
    setCurrentVal(val);
    setInputs(prev => ({ ...prev, [activeColumn]: val }));
  };

  const handleVerify = () => {
    const valNum = Number(currentVal);

    if (step === 'ones') {
      const correctDigit = problem.ansO;
      if (valNum === correctDigit) {
        SFX.correct();
        
        // Advance to tens. Check if tens column needs borrow
        const botT = Math.floor((problem.bot % 100) / 10);
        const currentTopT = modifiedTop.T;
        
        if (currentTopT < botT) {
          setFeedback('Correct! Now look at the Tens column: the top digit is smaller than the bottom digit. Tap Borrow!');
          setShowBorrowBtn(true);
          setStep('borrow_tens');
          setActiveColumn('T');
          setCurrentVal('');
        } else {
          setFeedback('Correct! Now let\'s subtract the Tens column.');
          setStep('tens');
          setActiveColumn('T');
          setCurrentVal('');
        }
      } else {
        SFX.wrong();
        setFeedback('Incorrect. Subtract the ones again. Remember to use the new borrowed value if you borrowed!');
        setCurrentVal('');
        setInputs(prev => ({ ...prev, O: '' }));
      }
    }
    else if (step === 'tens') {
      const correctDigit = problem.ansT;
      if (valNum === correctDigit) {
        SFX.correct();
        setFeedback('Correct! Finally, subtract the Hundreds column.');
        setStep('hunds');
        setActiveColumn('H');
        setCurrentVal('');
      } else {
        SFX.wrong();
        setFeedback('Incorrect. Subtract the tens column digits again.');
        setCurrentVal('');
        setInputs(prev => ({ ...prev, T: '' }));
      }
    }
    else if (step === 'hunds') {
      const correctDigit = problem.ansH;
      if (valNum === correctDigit) {
        SFX.correct();
        setFeedback(`Fantastic! ${problem.top} − ${problem.bot} = ${problem.total}!`);
        setStep('success');
        setActiveColumn(null);
        setTimeout(() => {
          if (probIndex < PROBLEMS.length - 1) {
            setProbIndex(prev => prev + 1);
          } else {
            onComplete();
          }
        }, 2000);
      } else {
        SFX.wrong();
        setFeedback('Incorrect. Subtract the hundreds column digits again.');
        setCurrentVal('');
        setInputs(prev => ({ ...prev, H: '' }));
      }
    }
  };

  const handleBorrowClick = () => {
    SFX.merge();
    setShowBorrowBtn(false);

    if (step === 'ones') {
      // Borrowing from Tens to Ones
      // If Tens place is 0, we must borrow from Hundreds to Tens first!
      if (modifiedTop.T === 0) {
        setFeedback('The Tens digit is 0! We must borrow from the Hundreds first.');
        setAnimBorrowHunds(true);
      } else {
        setAnimBorrowTens(true);
      }
    } else if (step === 'borrow_tens') {
      // Borrowing from Hundreds to Tens
      setAnimBorrowHunds(true);
    }
  };

  const handleBorrowTensComplete = () => {
    setAnimBorrowTens(false);
    setBorrowTens(true);
    setModifiedTop(prev => ({
      ...prev,
      T: prev.T - 1,
      O: prev.O + 10
    }));
    setStep('ones');
    setFeedback(`1 Ten borrowed! Ones digit becomes ${modifiedTop.O + 10}. Now subtract: ${modifiedTop.O + 10} − ${problem.bot % 10} = ?`);
  };

  const handleBorrowHundsComplete = () => {
    setAnimBorrowHunds(false);
    setBorrowHunds(true);
    setModifiedTop(prev => ({
      ...prev,
      H: prev.H - 1,
      T: prev.T + 10
    }));

    if (step === 'ones' && modifiedTop.T === 0) {
      // We had to borrow from H to T, now we can borrow from T to O!
      setFeedback('Now that Tens has 10 rods, we can borrow 1 Ten for the Ones column. Tap Borrow!');
      setShowBorrowBtn(true);
    } else {
      setStep('tens');
      setFeedback(`1 Hundred borrowed! Tens digit becomes ${modifiedTop.T + 10}. Now subtract: ${modifiedTop.T + 10} − ${Math.floor((problem.bot % 100) / 10)} = ?`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      maxWidth: '850px',
      margin: '0 auto',
      padding: '24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      {/* Animation elements */}
      {animBorrowTens && (
        <div style={{ position: 'absolute', top: '180px', left: '30%', right: '30%', height: '100px' }}>
          <BorrowIndicator fromColumn="tens" active={animBorrowTens} onComplete={handleBorrowTensComplete} />
        </div>
      )}
      {animBorrowHunds && (
        <div style={{ position: 'absolute', top: '180px', left: '30%', right: '30%', height: '100px' }}>
          <BorrowIndicator fromColumn="hundreds" active={animBorrowHunds} onComplete={handleBorrowHundsComplete} />
        </div>
      )}

      {/* Station Title */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          margin: '0 0 4px 0'
        }}>Station C: Column Subtraction</h2>
        <div style={{
          fontSize: '13px',
          color: '#b0b0d0',
          fontWeight: '600'
        }}>
          Problem {probIndex + 1} of 5 — {problem.desc}
        </div>
      </div>

      {/* Feedback bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1.5px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '12px 20px',
        width: '100%',
        color: '#e0e0ff',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {feedback}
      </div>

      {/* Main Workspace */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        width: '100%',
        marginTop: '10px'
      }}>
        {/* Grid Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <ColumnGrid
            topNumber={problem.top}
            bottomNumber={problem.bot}
            operation="-"
            borrowTens={borrowTens}
            borrowHunds={borrowHunds}
            modifiedTop={modifiedTop}
            interactive={true}
            inputs={inputs}
            activeColumn={activeColumn}
            size="lg"
          />

          {showBorrowBtn && (
            <button
              onClick={handleBorrowClick}
              style={{
                background: 'linear-gradient(135deg, #f39c12, #d35400)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '12px 28px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(243,156,18,0.6)',
                animation: 'pulseGlow 1.5s infinite',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔀 Borrow!
            </button>
          )}
        </div>

        {/* Numpad Column */}
        <div>
          <NumberPad
            value={currentVal}
            onChange={handleNumChange}
            onSubmit={handleVerify}
            max={9}
            disabled={showBorrowBtn || step === 'success'}
          />
        </div>
      </div>
    </div>
  );
}
