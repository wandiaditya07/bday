"use client";
import { useState } from 'react';

export default function PrankScreen({ onYes }) {
  const [yesScale, setYesScale] = useState(1);
  const [noPos, setNoPos] = useState({ top: '80%', left: '50%', transform: 'translate(-50%, -50%)' });
  const [isMoved, setIsMoved] = useState(false);

  const handleHoverNo = () => {
    // Generate random position between 10% and 80% to keep it on screen
    const newTop = Math.floor(Math.random() * 70) + 10 + '%';
    const newLeft = Math.floor(Math.random() * 70) + 10 + '%';
    setNoPos({ top: newTop, left: newLeft, transform: 'translate(-50%, -50%)' });
    setYesScale(prev => prev + 0.5);
    setIsMoved(true);
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', height: '350px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <h1 id="prank-title" style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center', color: 'white' }}>Kamu sayang aku ngga? 🥺</h1>
      
      <button 
        className="magic-btn" 
        onClick={onYes}
        style={{ marginBottom: '20px', zIndex: 2, transition: 'transform 0.3s ease', transform: `scale(${yesScale})` }}
      >
        Iya sayang ❤️
      </button>
      
      <button 
        className="magic-btn" 
        onMouseEnter={handleHoverNo}
        onClick={handleHoverNo}
        style={{ 
          position: 'absolute', 
          top: isMoved ? noPos.top : '75%', 
          left: isMoved ? noPos.left : '50%',
          transform: isMoved ? noPos.transform : 'translate(-50%, 0)',
          background: 'rgba(255,255,255,0.4)', 
          zIndex: 1, 
          transition: 'all 0.1s ease'
        }}
      >
        Engga 😜
      </button>
    </div>
  );
}
