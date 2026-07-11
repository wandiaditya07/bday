"use client";
import { useState, useEffect } from 'react';

export default function LetterScreen({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  
  const fullText = `Teruntuk Kesayanganku,

Selamat ulang tahun ya! 🎉

Semoga di umur yang baru ini kamu semakin dewasa, semakin cantik, dan selalu bahagia. Terima kasih sudah selalu ada buat aku, sabar ngadepin sifat jelekku, dan selalu ngedukung apapun yang aku lakuin.

Aku mungkin bukan cowok paling romantis, tapi lewat kado digital ini, aku mau kamu tau seberapa berartinya kamu buat aku.

I love you more than words can say. 💕

Peluk jauh,
- Pacarmu`;

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          style={{
            cursor: 'pointer',
            animation: 'pulse 2s infinite',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '6rem' }}>💌</div>
          <p style={{ color: 'white', fontSize: '1.5rem', marginTop: '10px' }}>Ada Surat Buat Kamu (Klik)</p>
        </div>
      ) : (
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', background: 'rgba(255,255,255,0.9)', color: '#333' }}>
          <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {displayedText}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>
          
          {displayedText.length === fullText.length && (
            <button className="magic-btn" onClick={onClose} style={{ marginTop: '30px', background: '#d57eeb', width: '100%' }}>
              Kembali
            </button>
          )}
        </div>
      )}
    </div>
  );
}
