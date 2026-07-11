"use client";
import { useState, useEffect, useRef } from 'react';
import Photobooth from '@/components/Photobooth';
import QuizScreen from '@/components/QuizScreen';
import BoardgameScreen from '@/components/BoardgameScreen';
import MysteryScreen from '@/components/MysteryScreen';
import TimelineScreen from '@/components/TimelineScreen';
import LetterScreen from '@/components/LetterScreen';
import GiftScreen from '@/components/GiftScreen';
import IntroScreen from '@/components/IntroScreen';
import PrankScreen from '@/components/PrankScreen';
import confetti from 'canvas-confetti';

export default function BirthdayApp() {
  const [activeScreen, setActiveScreen] = useState('start');
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (activeScreen === 'surprise') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [activeScreen]);


  useEffect(() => {
    // Initialize audio (Using an external URL for a calm & warm track - Lofi Radio Stream)
    audioRef.current = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv');
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container">
      {/* Background Animations */}
      <div className="background-animation">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Start Screen */}
      <section className={`screen ${activeScreen === 'start' ? 'active' : 'hidden'}`} style={{ background: 'black', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          className="magic-btn" 
          style={{ fontSize: '1.5rem', padding: '15px 30px', animation: 'pulse 2s infinite' }}
          onClick={() => {
            setActiveScreen('intro');
            toggleMusic();
          }}
        >
          Mulai Film 🎬
        </button>
      </section>

      {/* Intro / Cinematic Fade Screen */}
      <section className={`screen ${activeScreen === 'intro' ? 'active' : 'hidden'}`} style={{ background: 'black' }}>
        {activeScreen === 'intro' && <IntroScreen onComplete={() => setActiveScreen('prank')} />}
      </section>

      {/* Prank Screen */}
      <section className={`screen ${activeScreen === 'prank' ? 'active' : 'hidden'}`}>
        {activeScreen === 'prank' && <PrankScreen onYes={() => setActiveScreen('mystery')} />}
      </section>

      {/* Mystery Screen */}
      <section className={`screen ${activeScreen === 'mystery' ? 'active' : 'hidden'}`}>
        {activeScreen === 'mystery' && <MysteryScreen onOpen={() => setActiveScreen('surprise')} />}
      </section>

      {/* Surprise Screen */}
      <section className={`screen ${activeScreen === 'surprise' ? 'active' : 'hidden'}`}>
        <div className="glass-card">
          <h1 className="title">Selamat Ulang Tahun, Sayang! 🎉</h1>
          <div className="photo-placeholder" style={{ border: 'none', background: 'transparent' }}>
            <img 
              src="/Selamat ulang tahun.jpg" 
              alt="Selamat Ulang Tahun" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} 
            />
          </div>
          <div className="message">
            <p>Semoga di umur yang baru ini kamu selalu diberikan kebahagiaan, kesehatan, dan semua impian kamu bisa terwujud.</p>
            <p>Terima kasih sudah selalu ada dan menjadi bagian terindah dalam hariku.</p>
            <p className="love-sign">With all my love, 💕</p>
          </div>
          <div className="bubble-menu" style={{ flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px', margin: '40px auto 0', gap: '15px' }}>

            <div className="bubble-wrapper" onClick={() => setActiveScreen('quiz')}>
              <div className="nav-bubble">
                <span className="icon">🎮</span>
                <span className="label">Kuis</span>
              </div>
            </div>
            <div className="bubble-wrapper" onClick={() => setActiveScreen('boardgame')}>
              <div className="nav-bubble">
                <span className="icon">🎲</span>
                <span className="label">ToD</span>
              </div>
            </div>
            <div className="bubble-wrapper" onClick={() => setActiveScreen('photobooth')}>
              <div className="nav-bubble">
                <span className="icon">📸</span>
                <span className="label">Kamera</span>
              </div>
            </div>
            <div className="bubble-wrapper" onClick={() => setActiveScreen('letter')}>
              <div className="nav-bubble">
                <span className="icon">💌</span>
                <span className="label">Surat</span>
              </div>
            </div>
            <div className="bubble-wrapper" onClick={() => setActiveScreen('gift')}>
              <div className="nav-bubble">
                <span className="icon">🎁</span>
                <span className="label">Kado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Screens */}
      <section className={`screen ${activeScreen === 'timeline' ? 'active' : 'hidden'}`}>
        {activeScreen === 'timeline' && <TimelineScreen onClose={() => setActiveScreen('surprise')} />}
      </section>

      <section className={`screen ${activeScreen === 'quiz' ? 'active' : 'hidden'}`}>
        {activeScreen === 'quiz' && <QuizScreen onClose={() => setActiveScreen('surprise')} />}
      </section>

      <section className={`screen ${activeScreen === 'boardgame' ? 'active' : 'hidden'}`}>
        {activeScreen === 'boardgame' && <BoardgameScreen onClose={() => setActiveScreen('surprise')} />}
      </section>

      <section className={`screen ${activeScreen === 'photobooth' ? 'active' : 'hidden'}`}>
        {activeScreen === 'photobooth' && <Photobooth onClose={() => setActiveScreen('surprise')} />}
      </section>

      <section className={`screen ${activeScreen === 'letter' ? 'active' : 'hidden'}`}>
        {activeScreen === 'letter' && <LetterScreen onClose={() => setActiveScreen('surprise')} />}
      </section>

      <section className={`screen ${activeScreen === 'gift' ? 'active' : 'hidden'}`}>
        {activeScreen === 'gift' && <GiftScreen onClose={() => setActiveScreen('surprise')} />}
      </section>
      
      {/* Audio Element */}
      <div id="music-player" onClick={toggleMusic} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
        <div className={`vinyl ${isPlaying ? 'playing' : ''}`}>🎵</div>
      </div>
    </div>
  );
}
