// src/components/simulations/ColumnAdd.jsx
import React, { useState, useEffect } from 'react';
import ColumnGrid from '../shared/ColumnGrid.jsx';
import NumberPad from '../shared/NumberPad.jsx';
import CarryIndicator from '../shared/CarryIndicator.jsx';
import { SFX } from '../../utils/audio.js';

const PROBLEMS = [
  { top: 245, bot: 138, regO: true, regT: false, ansO: 3, ansT: 8, ansH: 3, total: 383, desc: "Regroup in Ones: 5 + 8 = 13 (Write 3, carry 1)" },
  { top: 362, bot: 154, regO: false, regT: true, ansO: 6, ansT: 1, ansH: 5, total: 516, desc: "Regroup in Tens: 6 + 5 = 11 (Write 1, carry 1)" },
  { top: 275, bot: 148, regO: true, regT: true, ansO: 3, ansT: 2, ansH: 4, total: 423, desc: "Regroup in both Ones & Tens!" },
  { top: 123, bot: 245, regO: false, regT: false, ansO: 8, ansT: 6, ansH: 3, total: 368, desc: "No regrouping needed. Just straight column addition." },
  { top: 439, bot: 252, regO: true, regT: false, ansO: 1, ansT: 9, ansH: 6, total: 691, desc: "Regroup in Ones: 9 + 2 = 11" }
];

export default function ColumnAdd({ onComplete }) {
  const [probIndex, setProbIndex] = useState(0);
  const [step, setStep] = useState('ones'); // 'ones' | 'regroup_ones' | 'tens' | 'regroup_tens' | 'hunds' | 'success'
  const [inputs, setInputs] = useState({ H: '', T: '', O: '' });
  const [currentVal, setCurrentVal] = useState('');
  const [carryOnes, setCarryOnes] = useState(false);
  const [carryTens, setCarryTens] = useState(false);
  const [activeColumn, setActiveColumn] = useState('O'); // 'O' | 'T' | 'H'
  const [feedback, setFeedback] = useState('Let\'s add the ones column! What is the ones digit of the sum?');
  const [showRegroupBtn, setShowRegroupBtn] = useState(false);

  // Animation triggers
  const [animCarryOnes, setAnimCarryOnes] = useState(false);
  const [animCarryTens, setAnimCarryTens] = useState(false);

  const problem = PROBLEMS[probIndex];

  useEffect(() => {
    // Reset state for new problem
    setStep('ones');
    setInputs({ H: '', T: '', O: '' });
    setCurrentVal('');
    setCarryOnes(false);
    setCarryTens(false);
    setActiveColumn('O');
    setFeedback(`Let's solve ${problem.top} + ${problem.bot}. Start with the Ones column: ${problem.top % 10} + ${problem.bot % 10} = ?`);
    setShowRegroupBtn(false);
    setAnimCarryOnes(false);
    setAnimCarryTens(false);
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
        if (problem.regO) {
          setFeedback('Correct! 5 + 8 = 13 (or 9 + 2 = 11). Since it is 10 or more, we must regroup! Tap the Regroup button below.');
          setShowRegroupBtn(true);
          setStep('regroup_ones');
        } else {
          setFeedback('Correct! Now let\'s add the Tens column.');
          setStep('tens');
          setActiveColumn('T');
          setCurrentVal('');
        }
      } else {
        SFX.wrong();
        setFeedback('Hmm, not quite. Add the ones column digits again.');
        setCurrentVal('');
        setInputs(prev => ({ ...prev, O: '' }));
      }
    } 
    else if (step === 'tens') {
      const correctDigit = problem.ansT;
      if (valNum === correctDigit) {
        SFX.correct();
        if (problem.regT) {
          setFeedback('Correct! The sum of tens digits + carried 1 is 10 or more. We must regroup! Tap the Regroup button.');
          setShowRegroupBtn(true);
          setStep('regroup_tens');
        } else {
          setFeedback('Correct! Finally, let\'s add the Hundreds column.');
          setStep('hunds');
          setActiveColumn('H');
          setCurrentVal('');
        }
      } else {
        SFX.wrong();
        setFeedback(carryOnes 
          ? 'Not quite. Don\'t forget to add the 1 carried from the Ones column!'
          : 'Hmm, that is not correct. Try adding the tens digits again.'
        );
        setCurrentVal('');
        setInputs(prev => ({ ...prev, T: '' }));
      }
    } 
    else if (step === 'hunds') {
      const correctDigit = problem.ansH;
      if (valNum === correctDigit) {
        SFX.correct();
        setFeedback(`Fantastic! ${problem.top} + ${problem.bot} = ${problem.total}!`);
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
        setFeedback(carryTens
          ? 'Incorrect. Remember to include the 1 carried from the Tens column!'
          : 'Incorrect. Try adding the hundreds digits again.'
        );
        setCurrentVal('');
        setInputs(prev => ({ ...prev, H: '' }));
      }
    }
  };

  const handleRegroupClick = () => {
    SFX.merge();
    setShowRegroupBtn(false);

    if (step === 'regroup_ones') {
      // Trigger fly animation
      setAnimCarryOnes(true);
    } else if (step === 'regroup_tens') {
      // Trigger fly animation
      setAnimCarryTens(true);
    }
  };

  const handleCarryOnesComplete = () => {
    setAnimCarryOnes(false);
    setCarryOnes(true);
    setStep('tens');
    setActiveColumn('T');
    setCurrentVal('');
    setFeedback('Perfect! 10 Ones regrouped into 1 Ten. Now add the Tens column (including the carried 1).');
  };

  const handleCarryTensComplete = () => {
    setAnimCarryTens(false);
    setCarryTens(true);
    setStep('hunds');
    setActiveColumn('H');
    setCurrentVal('');
    setFeedback('Great job! 10 Tens regrouped into 1 Hundred. Now add the Hundreds column (including the carried 1).');
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
      {animCarryOnes && (
        <div style={{ position: 'absolute', top: '220px', right: '40%' }}>
          <CarryIndicator fromColumn="ones" active={animCarryOnes} onComplete={handleCarryOnesComplete} />
        </div>
      )}
      {animCarryTens && (
        <div style={{ position: 'absolute', top: '220px', right: '45%' }}>
          <CarryIndicator fromColumn="tens" active={animCarryTens} onComplete={handleCarryTensComplete} />
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
        }}>Station B: Column Addition</h2>
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

      {/* Main Workspace: Column grid & Numpad side-by-side */}
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
            operation="+"
            carryOnes={carryOnes}
            carryTens={carryTens}
            interactive={true}
            inputs={inputs}
            activeColumn={activeColumn}
            size="lg"
          />

          {showRegroupBtn && (
            <button
              onClick={handleRegroupClick}
              style={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '12px 28px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(231,76,60,0.6)',
                animation: 'pulseGlow 1.5s infinite',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔄 Regroup!
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
            disabled={showRegroupBtn || step === 'success'}
          />
        </div>
      </div>
    </div>
  );
}
