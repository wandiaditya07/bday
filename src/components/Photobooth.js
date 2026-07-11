"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';

export default function Photobooth({ onClose }) {
  const [step, setStep] = useState('select-layout');
  const [layout, setLayout] = useState('single');
  const [style, setStyle] = useState('polaroid');
  
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Responsive Scale State
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const webcamRef = useRef(null);
  const stageRef = useRef(null);

  const layoutConfig = {
    single: { count: 1, width: 640, height: 480 },
    strip: { count: 3, width: 300, height: 900 },
    grid: { count: 4, width: 640, height: 640 }
  };

  const [konvaImages, setKonvaImages] = useState([]);

  useEffect(() => {
    Promise.all(photos.map(src => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => resolve(img);
      });
    })).then(loadedImages => {
      setKonvaImages(loadedImages);
    });
  }, [photos]);

  // Responsive Scaling Logic
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const config = layoutConfig[layout];
        
        // Calculate scale to fit width (with some padding)
        let newScale = (containerWidth - 40) / config.width;
        
        // Ensure it also fits the height of a typical mobile screen (e.g., max 60vh)
        const maxAvailableHeight = window.innerHeight * 0.6;
        const heightScale = maxAvailableHeight / config.height;
        
        if (heightScale < newScale) {
          newScale = heightScale;
        }

        setScale(Math.min(1, newScale)); // Never scale up beyond 1
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [layout, step]);

  const startCaptureSession = async () => {
    setIsCapturing(true);
    setPhotos([]);
    const totalPhotos = layoutConfig[layout].count;
    let captured = [];

    for (let i = 0; i < totalPhotos; i++) {
      for (let sec = 3; sec > 0; sec--) {
        setCountdown(sec);
        await new Promise(r => setTimeout(r, 1000));
      }
      
      setCountdown('📸');
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        captured.push(imageSrc);
        setPhotos([...captured]);
      }
      await new Promise(r => setTimeout(r, 500)); 
    }

    setCountdown(null);
    setIsCapturing(false);
    setStep('style');
  };
  
  const handleRetake = () => {
    setPhotos([]);
    setStep('select-layout');
  };
  
  const downloadPhoto = async () => {
    if (!stageRef.current) return;
    setIsSaving(true);
    
    try {
      const dataURL = stageRef.current.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2
      });

      const link = document.createElement('a');
      link.download = `Photobooth_${layout}_${new Date().getTime()}.png`;
      link.href = dataURL;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload foto", err);
    } finally {
      setIsSaving(false);
    }
  };

  const [vintageImg] = useImage('/Brown and Black Polaroid Vintage Photo Collage.png');
  const [scrapbookImg] = useImage('/Grey Scrapbook Photo Collage Friends Instagram Story.png');

  const renderStyledLayout = () => {
    const config = layoutConfig[layout];
    const w = config.width;
    const h = config.height;
    const bgFill = style === 'neon' ? '#111' : style === 'film' ? '#000' : '#fff';

    return (
      <Group>
        <Rect x={0} y={0} width={w} height={h} fill={bgFill} />
        
        {konvaImages.map((img, idx) => {
          let px = 0, py = 0, pw = w, ph = h;
          
          if (layout === 'single') {
            pw = w - 40; ph = h - 120; px = 20; py = 20;
          } else if (layout === 'strip') {
            pw = w - 40; ph = (h - 140) / 3; px = 20; py = 20 + idx * (ph + 15);
          } else if (layout === 'grid') {
            pw = (w - 60) / 2; ph = (h - 140) / 2; 
            px = 20 + (idx % 2) * (pw + 20);
            py = 20 + Math.floor(idx / 2) * (ph + 20);
          }

          return (
            <Group key={idx} x={px} y={py} width={pw} height={ph} clipX={0} clipY={0} clipWidth={pw} clipHeight={ph}>
                <KonvaImage 
                  image={img} 
                  x={pw/2} y={ph/2} 
                  width={Math.max(pw, ph * (4/3))} 
                  height={Math.max(ph, pw * (3/4))}
                  offsetX={Math.max(pw, ph * (4/3)) / 2}
                  offsetY={Math.max(ph, pw * (3/4)) / 2}
                  scaleX={-1} // mirror
                />
            </Group>
          );
        })}

        {style === 'polaroid' && (
          <Text x={0} y={h - 60} width={w} align="center" text="Happy Birthday! 💕" fontFamily="Courier New" fontSize={36} fill="#333" fontStyle="bold" />
        )}
        
        {style === 'neon' && (
          <>
            <Rect x={10} y={10} width={w - 20} height={h - 20} stroke="#00ffff" strokeWidth={4} shadowColor="#00ffff" shadowBlur={15} />
            <Text x={0} y={h - 55} width={w} align="center" text="CYBER VIBES ⚡" fontFamily="Arial" fontSize={32} fill="#ff00ff" shadowColor="#ff00ff" shadowBlur={10} fontStyle="italic" />
          </>
        )}

        {style === 'film' && (
          <>
            {[...Array(Math.floor(h/40))].map((_, i) => (
              <Rect key={`L-${i}`} x={5} y={15 + i * 40} width={10} height={20} fill="#fff" cornerRadius={2} />
            ))}
            {[...Array(Math.floor(h/40))].map((_, i) => (
              <Rect key={`R-${i}`} x={w - 15} y={15 + i * 40} width={10} height={20} fill="#fff" cornerRadius={2} />
            ))}
          </>
        )}
        
        {style === 'vintage' && vintageImg && (
          <KonvaImage image={vintageImg} x={0} y={0} width={w} height={h} opacity={0.9} listening={false} />
        )}

        {style === 'scrapbook' && scrapbookImg && (
          <KonvaImage image={scrapbookImg} x={0} y={0} width={w} height={h} opacity={0.9} listening={false} />
        )}

        {style === 'love' && (
          <>
            <Rect x={15} y={15} width={w - 30} height={h - 30} stroke="#ff9a9e" strokeWidth={8} cornerRadius={20} />
            <Text x={0} y={h - 60} width={w} align="center" text="💖 Love You 💖" fontFamily="Playfair Display" fontSize={38} fill="#ff9a9e" fontStyle="italic" />
            <Text x={w - 60} y={20} text="✨" fontSize={40} />
            <Text x={20} y={20} text="✨" fontSize={40} />
          </>
        )}
      </Group>
    );
  };

  return (
    <div className="glass-card" ref={containerRef} style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 10px', overflowX: 'hidden' }}>
      <h2 className="title" style={{ marginBottom: '10px' }}>Photobooth Kita 📸</h2>
      
      {/* ---------------- STEP 1: LAYOUT ---------------- */}
      {step === 'select-layout' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p style={{ color: 'white', marginBottom: '25px', fontSize: '1.1rem' }}>Pilih Layout Foto</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className={`magic-btn ${layout === 'single' ? 'active' : ''}`} onClick={() => setLayout('single')} style={{ padding: '10px', width: '120px' }}>1 Foto</button>
            <button className={`magic-btn ${layout === 'strip' ? 'active' : ''}`} onClick={() => setLayout('strip')} style={{ padding: '10px', width: '120px' }}>3 Foto Strip</button>
            <button className={`magic-btn ${layout === 'grid' ? 'active' : ''}`} onClick={() => setLayout('grid')} style={{ padding: '10px', width: '120px' }}>4 Foto Grid</button>
          </div>
          <button className="magic-btn" onClick={() => setStep('capture')} style={{ marginTop: '40px', background: '#a8e6cf', color: '#333' }}>Lanjut ➡️</button>
        </div>
      )}

      {/* ---------------- STEP 2: CAPTURE ---------------- */}
      {step === 'capture' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p style={{ color: 'white', marginBottom: '15px' }}>Siap-siap! ({photos.length} / {layoutConfig[layout].count} foto)</p>
          
          <div style={{ 
            position: 'relative', 
            width: layoutConfig.single.width * scale, 
            height: layoutConfig.single.height * scale, 
            borderRadius: '8px', overflow: 'hidden', background: '#000', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' 
          }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              mirrored={true}
              videoConstraints={{ facingMode: "user", aspectRatio: 4/3 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {countdown !== null && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: `${8 * scale}rem`, fontWeight: 'bold', zIndex: 100, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                {countdown}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
            <button className="magic-btn" onClick={() => setStep('select-layout')} disabled={isCapturing} style={{ background: '#ffb6b9' }}>Batal</button>
            {!isCapturing && (
              <button className="magic-btn" onClick={startCaptureSession} style={{ background: '#a8e6cf', color: '#333' }}>Jepret! 📷</button>
            )}
          </div>
        </div>
      )}

      {/* ---------------- STEP 3: STYLE & SAVE ---------------- */}
      {step === 'style' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p style={{ color: 'white', marginBottom: '15px' }}>Pilih Bingkai & Simpan!</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className={`magic-btn template-btn ${style === 'polaroid' ? 'active' : ''}`} onClick={() => setStyle('polaroid')} style={{ padding: '8px 15px' }}>Classic</button>
            <button className={`magic-btn template-btn ${style === 'neon' ? 'active' : ''}`} onClick={() => setStyle('neon')} style={{ padding: '8px 15px' }}>Neon</button>
            <button className={`magic-btn template-btn ${style === 'film' ? 'active' : ''}`} onClick={() => setStyle('film')} style={{ padding: '8px 15px' }}>Film</button>
            <button className={`magic-btn template-btn ${style === 'vintage' ? 'active' : ''}`} onClick={() => setStyle('vintage')} style={{ padding: '8px 15px' }}>Vintage</button>
            <button className={`magic-btn template-btn ${style === 'scrapbook' ? 'active' : ''}`} onClick={() => setStyle('scrapbook')} style={{ padding: '8px 15px' }}>Scrapbook</button>
            <button className={`magic-btn template-btn ${style === 'love' ? 'active' : ''}`} onClick={() => setStyle('love')} style={{ padding: '8px 15px' }}>Love 💖</button>
          </div>

          <div style={{ 
            width: layoutConfig[layout].width * scale, 
            height: layoutConfig[layout].height * scale,
            borderRadius: '8px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            marginBottom: '20px'
          }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: layoutConfig[layout].width, height: layoutConfig[layout].height }}>
              <Stage width={layoutConfig[layout].width} height={layoutConfig[layout].height} ref={stageRef}>
                <Layer>
                  {renderStyledLayout()}
                </Layer>
              </Stage>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="magic-btn" onClick={handleRetake} style={{ background: '#ffb6b9' }}>Ulangi 📸</button>
            <button className="magic-btn" onClick={downloadPhoto} style={{ background: '#a8e6cf', color: '#333' }} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Karyamu! 💾'}
            </button>
          </div>
        </div>
      )}
      
      <button className="magic-btn" onClick={onClose} style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)' }}>Tutup</button>
    </div>
  );
}
