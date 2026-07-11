"use client";
import { useState, useEffect } from 'react';
import { Heart, Star, Dice5, LogOut, CheckCircle2, Flame, UserCircle2 } from 'lucide-react';

const TOD_QUESTIONS = {
  truth: [
    "Kapan momen yang bikin kamu paling deg-degan pas sama aku?",
    "Apa hal pertama yang kamu pikirin waktu pertama kali kita ketemu?",
    "Hal apa dari aku yang paling sering bikin kamu kangen?",
    "Sebutin satu kebiasaan anehku yang diem-diem kamu suka!",
    "Apa impian terbesar kamu buat kita berdua di masa depan?"
  ],
  dare: [
    "Kirim vn (voice note) nyanyi reff lagu kesukaan kita sekarang!",
    "Bikin gaya wajah paling jelek terus kirim pap-nya ke aku!",
    "Puji aku dengan 3 kata yang paling romantis!",
    "Tulis status WA/IG tentang aku selama 1 jam!",
    "Panggil aku dengan sebutan sayang yang baru dan unik hari ini juga!"
  ]
};

const BOARD_SIZE = 100; // 10x10 grid
const SPECIAL_CELLS = [12, 23, 37, 45, 59, 64, 78, 83, 91, 98]; // Cells that trigger ToD

export default function BoardgameScreen({ onClose }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState({ 1: '', 2: '' });

  const [positions, setPositions] = useState({ 1: 1, 2: 1 });
  const [activePlayer, setActivePlayer] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [todType, setTodType] = useState(null);
  const [todTask, setTodTask] = useState("");

  const startGame = () => {
    if (playerNames[1].trim() && playerNames[2].trim()) {
      setGameStarted(true);
    }
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Simulate dice roll animation
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        movePlayer(finalResult);
      }
    }, 100);
  };

  const movePlayer = (steps) => {
    let currentStep = positions[activePlayer];
    let targetStep = currentStep + steps;
    if (targetStep > BOARD_SIZE) targetStep = BOARD_SIZE;

    const moveInterval = setInterval(() => {
      currentStep++;
      setPositions(prev => ({ ...prev, [activePlayer]: currentStep }));
      
      if (currentStep >= targetStep) {
        clearInterval(moveInterval);
        setIsRolling(false);
        
        // Check for special events after reaching destination
        if (SPECIAL_CELLS.includes(targetStep)) {
          setTimeout(() => {
            setShowModal(true);
          }, 500);
        } else {
          // Switch turn directly if not a special cell
          setActivePlayer(prev => (prev === 1 ? 2 : 1));
        }
      }
    }, 400); // Bergerak 1 kotak tiap 400ms
  };

  const handleTodChoice = (type) => {
    setTodType(type);
    const questions = TOD_QUESTIONS[type];
    const randomTask = questions[Math.floor(Math.random() * questions.length)];
    setTodTask(randomTask);
  };

  const closeTodModal = () => {
    setShowModal(false);
    setTodType(null);
    setTodTask("");
    // Switch turn after completing ToD
    setActivePlayer(prev => (prev === 1 ? 2 : 1));
  };

  // Generate grid cells
  const renderGrid = () => {
    let cells = [];
    for (let idx = 0; idx < BOARD_SIZE; idx++) {
      // Create snaking pattern for 10 columns
      let r = Math.floor(idx / 10); // 0 to 9 (top to bottom)
      let c = idx % 10; // 0 to 9 (left to right)
      let y = 9 - r; // 9 at bottom, 0 at top
      
      let displayNum;
      if (y % 2 === 0) {
        displayNum = y * 10 + c + 1; // Left to right
      } else {
        displayNum = y * 10 + (9 - c) + 1; // Right to left
      }

      const isSpecial = SPECIAL_CELLS.includes(displayNum);
      const hasPlayer1 = positions[1] === displayNum;
      const hasPlayer2 = positions[2] === displayNum;

      cells.push(
        <div 
          key={displayNum} 
          style={{
            width: '100%', 
            aspectRatio: '1/1', 
            background: isSpecial ? 'rgba(213, 126, 235, 0.4)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            fontSize: '0.6rem',
            color: 'white',
            fontWeight: 'bold',
            boxSizing: 'border-box'
          }}
        >
          {displayNum}
          
          <div style={{ position: 'absolute', display: 'flex', gap: '2px', zIndex: 10 }}>
            {hasPlayer1 && (
              <div style={{ animation: activePlayer === 1 && isRolling ? 'bounce 0.5s infinite' : 'none', color: '#ffb6b9' }}>
                <Heart fill="#ffb6b9" size={20} />
              </div>
            )}
            {hasPlayer2 && (
              <div style={{ animation: activePlayer === 2 && isRolling ? 'bounce 0.5s infinite' : 'none', color: '#a8e6cf' }}>
                <Star fill="#a8e6cf" size={20} />
              </div>
            )}
          </div>
        </div>
      );
    }
    return cells;
  };

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{ maxWidth: '400px', width: '95%', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>
          Mulai Bermain 🎲
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', textAlign: 'center' }}>Masukkan nama pemain sebelum masuk ke papan permainan!</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffb6b9', fontWeight: 'bold', marginBottom: '8px' }}>
              <Heart size={18} /> Nama Pemain 1
            </label>
            <input 
              type="text" 
              value={playerNames[1]} 
              onChange={e => setPlayerNames(prev => ({...prev, 1: e.target.value}))}
              placeholder="Contoh: Sayang"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', outline: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a8e6cf', fontWeight: 'bold', marginBottom: '8px' }}>
              <Star size={18} /> Nama Pemain 2
            </label>
            <input 
              type="text" 
              value={playerNames[2]} 
              onChange={e => setPlayerNames(prev => ({...prev, 2: e.target.value}))}
              placeholder="Contoh: Ayang"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', outline: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </div>
        </div>

        <button 
          className="magic-btn" 
          onClick={startGame} 
          disabled={!playerNames[1].trim() || !playerNames[2].trim()}
          style={{ width: '100%', opacity: (!playerNames[1].trim() || !playerNames[2].trim()) ? 0.5 : 1 }}
        >
          Masuk ke Papan 🚀
        </button>
        <button className="magic-btn" onClick={onClose} style={{ width: '100%', marginTop: '15px', background: 'rgba(255,255,255,0.1)' }}>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '650px', width: '95%', maxHeight: '95vh', padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        Ular Tangga Cinta <Flame color="#ffb6b9" />
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontWeight: 'bold', color: activePlayer === 1 ? '#ffb6b9' : 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.3s' }}>
            <Heart size={16} fill={activePlayer === 1 ? '#ffb6b9' : 'none'} /> {playerNames[1]}: {positions[1]}
          </span>
          <span style={{ fontWeight: 'bold', color: activePlayer === 2 ? '#a8e6cf' : 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.3s' }}>
            <Star size={16} fill={activePlayer === 2 ? '#a8e6cf' : 'none'} /> {playerNames[2]}: {positions[2]}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#ffd1dc', marginBottom: '5px' }}>
            Giliran: {playerNames[activePlayer]}
          </span>
          <button className="magic-btn" onClick={rollDice} disabled={isRolling} style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dice5 size={18} /> Kocok Dadu
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', color: '#d57eeb', minHeight: '30px' }}>
        {diceResult ? `Dadu ${playerNames[activePlayer]}: ${diceResult}` : ' '}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(10, 1fr)', 
        gap: '2px', 
        padding: '10px', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        {renderGrid()}
      </div>
      
      <button className="magic-btn" onClick={onClose} style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LogOut size={18} /> Keluar Permainan
      </button>

      {/* TOD Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ color: '#d57eeb', marginBottom: '20px' }}>Truth or Dare! 🔥 ({playerNames[activePlayer]})</h2>
            
            {!todType ? (
              <>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#333' }}>Kamu masuk kotak spesial! Pilih salah satu:</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                  <button className="magic-btn" onClick={() => handleTodChoice('truth')} style={{ background: '#a8e6cf', color: '#2b7a5c' }}>Truth 🗣️</button>
                  <button className="magic-btn" onClick={() => handleTodChoice('dare')} style={{ background: '#ffb6b9', color: '#a83232' }}>Dare 🏃</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#d57eeb', marginBottom: '25px' }}>{todTask}</p>
                <button className="magic-btn" onClick={closeTodModal} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 /> Sudah Dilakukan!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
