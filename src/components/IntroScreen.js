"use client";
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState('3d-journey'); // '3d-journey' -> 'cinematic-text'
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  const mountRef = useRef(null);

  const messages = [
    "Semuanya berawal dari pertemuan sederhana...",
    "Hari demi hari, waktu yang kita lewati...",
    "Menjadi cerita yang nggak akan pernah aku lupakan.",
    "Dan hari ini...",
    "Adalah hari di mana tokoh utamaku dilahirkan."
  ];

  // ----------------------------------------------------
  // Phase 1: Three.js 3D Journey
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== '3d-journey' || !mountRef.current) return;

    let animId = null;
    let isEnded = false;
    const container = mountRef.current;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a2a, 0.015);
    scene.background = new THREE.Color(0x0a0a2a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // 1. Spline Curve (Winding but smooth)
    const points = [];
    for (let i = 0; i < 40; i++) {
        points.push(new THREE.Vector3(
            Math.sin(i * 0.4) * 20,
            Math.cos(i * 0.3) * 15,
            -i * 20
        ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = 'centripetal'; 
    
    // Inner Core Tube
    const tubeGeometry = new THREE.TubeGeometry(curve, 600, 0.15, 12, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, wireframe: false });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);
    
    // Outer Grid Tube (Glowing effect)
    const glowGeometry = new THREE.TubeGeometry(curve, 150, 0.6, 20, false);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, transparent: true, opacity: 0.15, wireframe: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const glowTube = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowTube);
    
    // 2. Stars / Particles
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8});
    const starsVertices = [];
    for(let i=0; i<3000; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 800 - 400
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 3. Floating Image Placeholders
    const nodesData = [
        { text: "📸 Perjalanan Kita", img: "/Perjalanan kita.jpg" },
        { text: "📸 Hari Spesial", img: "/Hari spesial.jpg" },
        { text: "📸 Our Story", img: "/our story.jpg" }
    ];
    
    function createTextSprite(message) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'italic 70px Georgia';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 243, 255, 0.8)';
        ctx.shadowBlur = 20;
        ctx.fillText(message, 512, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 1 });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(40, 10, 1);
        return sprite;
    }

    for(let i=0; i<nodesData.length; i++) {
        const t = (i + 1) / (nodesData.length + 1);
        const pt = curve.getPoint(t);
        
        const tangent = curve.getTangent(t).normalize();
        const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

        const sprite = createTextSprite(nodesData[i].text);
        sprite.position.copy(pt);
        sprite.position.y += 6;
        scene.add(sprite);

        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111'; ctx.fillRect(0,0,512,512);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Arial'; ctx.textAlign = 'center';
        ctx.fillText(`Loading Photo...`, 256, 256);
        
        const fallbackMap = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: fallbackMap });
        
        new THREE.TextureLoader().load(nodesData[i].img, function(texture) {
            spriteMat.map = texture;
            spriteMat.needsUpdate = true;
        });

        const imgSprite = new THREE.Sprite(spriteMat);
        imgSprite.scale.set(15, 15, 1);
        
        const sideOffset = (i % 2 === 0) ? 16 : -16; 
        imgSprite.position.copy(pt).add(right.clone().multiplyScalar(sideOffset));
        scene.add(imgSprite);
    }

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 4. Camera Animation
    let progress = 0;
    
    function animate() {
        if(isEnded) return;
        animId = requestAnimationFrame(animate);
        
        progress += 0.0006; 
        
        if (progress >= 0.98) {
            isEnded = true;
            setPhase('cinematic-text');
            return;
        }
        
        const camPos = curve.getPoint(progress);
        const camLook = curve.getPoint(Math.min(progress + 0.01, 1));
        
        camera.position.copy(camPos);
        camera.lookAt(camLook);
        
        renderer.render(scene, camera);
    }
    
    animate();

    return () => {
      isEnded = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [phase]);

  // ----------------------------------------------------
  // Phase 2: Cinematic Text Sequence
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== 'cinematic-text') return;
    
    if (messageIndex >= messages.length) {
      onComplete();
      return;
    }

    setFadeState('fade-in');
    
    const visibleTimer = setTimeout(() => {
      setFadeState('visible');
    }, 1000);

    const fadeOutTimer = setTimeout(() => {
      setFadeState('fade-out');
    }, 3000);

    const nextMessageTimer = setTimeout(() => {
      setMessageIndex(prev => prev + 1);
    }, 4000);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(nextMessageTimer);
    };
  }, [phase, messageIndex, onComplete]);

  // Render Skip Button during 3D phase
  if (phase === '3d-journey') {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        <button 
          onClick={() => setPhase('cinematic-text')}
          style={{ 
            position: 'absolute', top: '20px', right: '20px', 
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', 
            borderRadius: '5px', padding: '5px 15px', color: 'rgba(255,255,255,0.8)', 
            fontSize: '1rem', cursor: 'pointer', zIndex: 1000, backdropFilter: 'blur(5px)' 
          }}
        >
          Skip Intro {">>"}
        </button>
      </div>
    );
  }

  if (messageIndex >= messages.length) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', width: '100%', backgroundColor: 'black', color: 'white',
      fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '2.5rem', textAlign: 'center', padding: '20px'
    }}>
      <div style={{
        opacity: fadeState === 'fade-in' ? 1 : fadeState === 'fade-out' ? 0 : 1,
        transition: 'opacity 1s ease-in-out',
        animation: fadeState === 'fade-in' ? 'fadeIn 1s forwards' : fadeState === 'fade-out' ? 'fadeOut 1s forwards' : 'none'
      }}>
        {messages[messageIndex]}
      </div>
    </div>
  );
}
