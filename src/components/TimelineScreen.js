"use client";
import { useState } from 'react';

export default function TimelineScreen({ onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const memories = [
    { title: "Pertama Ketemu", date: "Januari 2023", desc: "Malu-malu tapi mau.", img: "https://via.placeholder.com/300x200/d57eeb/ffffff?text=Memori+1" },
    { title: "Kencan Pertama", date: "Februari 2023", desc: "Nonton film seru banget.", img: "https://via.placeholder.com/300x200/fccb90/ffffff?text=Memori+2" },
    { title: "Anniversary Ke-1", date: "Tahun Berikutnya", desc: "Makan malam romantis.", img: "https://via.placeholder.com/300x200/ff9a9e/ffffff?text=Memori+3" },
    { title: "Liburan Bareng", date: "Musim Panas", desc: "Jalan-jalan ke pantai.", img: "https://via.placeholder.com/300x200/a18cd1/ffffff?text=Memori+4" },
    { title: "Ulang Tahunmu!", date: "Hari Ini", desc: "Kejutan spesial buat kamu.", img: "https://via.placeholder.com/300x200/fbc2eb/ffffff?text=Memori+5" }
  ];

  const nextMemory = () => {
    setActiveIndex((prev) => (prev + 1) % memories.length);
  };

  const prevMemory = () => {
    setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '95%', textAlign: 'center', padding: '30px 20px' }}>
      <h2 className="title" style={{ fontSize: '2rem', marginBottom: '20px' }}>Perjalanan Kita 🚀</h2>
      
      <div style={{ position: 'relative', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '1000px', marginBottom: '30px' }}>
        {memories.map((mem, index) => {
          let offset = index - activeIndex;
          if (offset < -2) offset += memories.length;
          if (offset > 2) offset -= memories.length;
          
          let zIndex = 5 - Math.abs(offset);
          let scale = 1 - Math.abs(offset) * 0.2;
          let translateX = offset * 120; // 120px separation
          let opacity = Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.3;
          let display = Math.abs(offset) > 2 ? 'none' : 'block';

          return (
            <div 
              key={index} 
              style={{
                position: 'absolute',
                width: '300px',
                background: 'white',
                borderRadius: '10px',
                padding: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                opacity,
                display
              }}
              onClick={() => setActiveIndex(index)}
            >
              <img src={mem.img} alt={mem.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px', marginBottom: '15px' }} />
              <h3 style={{ color: '#d57eeb', marginBottom: '5px', fontSize: '1.2rem' }}>{mem.title}</h3>
              <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '10px' }}>{mem.date}</p>
              <p style={{ color: '#444', fontSize: '0.9rem' }}>{mem.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <button className="magic-btn" onClick={prevMemory} style={{ padding: '10px 20px' }}>⬅️</button>
        <button className="magic-btn" onClick={nextMemory} style={{ padding: '10px 20px' }}>➡️</button>
      </div>

      <button className="magic-btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)' }}>Kembali</button>
    </div>
  );
}
