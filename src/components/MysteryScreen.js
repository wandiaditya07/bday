"use client";

export default function MysteryScreen({ onOpen }) {
  return (
    <div className="mystery-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Halo... Aku Punya Sesuatu Buat Kamu 💖</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Coba tekan tombol di bawah ya!</p>
      
      <button 
        className="magic-btn" 
        onClick={onOpen}
        style={{ fontSize: '1.2rem', padding: '15px 30px', animation: 'bounce 2s infinite' }}
      >
        Buka Kejutannya ✨
      </button>
    </div>
  );
}
