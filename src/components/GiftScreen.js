"use client";
import { useState } from 'react';

export default function GiftScreen({ onClose }) {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const vouchers = [
    { title: "Kupon Bebas Ngambek 1 Hari", icon: "😡❌" },
    { title: "Kupon Traktir Makan Sepuasnya", icon: "🍔🍕" },
    { title: "Kupon Nonton Bioskop Film Bebas", icon: "🎟️🎬" }
  ];

  return (
    <div className="glass-card" style={{ maxWidth: '700px', width: '95%', textAlign: 'center', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '30px' }}>Kado Spesial Buat Kamu 🎁</h2>
      
      {!isOpened ? (
        <div 
          onClick={() => setIsOpened(true)}
          style={{ cursor: 'pointer', animation: 'wobble 2s infinite', fontSize: '8rem' }}
        >
          🎁
        </div>
      ) : (
        <div style={{ animation: 'zoomIn 0.5s' }}>
          <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '20px' }}>Yeeey! Kamu dapet 3 Kupon Spesial. Silakan diklaim kapan aja! 🎉</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {vouchers.map((v, i) => (
              <div 
                key={i}
                onClick={() => setSelectedVoucher(i)}
                style={{
                  background: selectedVoucher === i ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)',
                  color: selectedVoucher === i ? '#d57eeb' : 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: selectedVoucher === i ? '#d57eeb' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'left' }}>{v.title}</span>
                
                {selectedVoucher === i && <span style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>✅</span>}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.9rem', color: '#ffd1dc', fontStyle: 'italic', marginBottom: '20px' }}>*Syarat dan ketentuan berlaku (yaitu persetujuan pacarmu wkkwkw)</p>
        </div>
      )}

      <button className="magic-btn" onClick={onClose} style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.2)' }}>Kembali</button>
    </div>
  );
}
