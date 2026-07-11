document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startMovieBtn = document.getElementById('start-movie-btn');
    const introScreen = document.getElementById('intro-screen');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const cineTexts = [
        document.getElementById('cine-text-1'),
        document.getElementById('cine-text-2'),
        document.getElementById('cine-text-3'),
        document.getElementById('cine-text-4'),
        document.getElementById('cine-text-5')
    ];
    let introTimeouts = [];
    let cinematicAnimId = null;
    let isIntroEnded = false;

    const prankScreen = document.getElementById('prank-screen');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    const openBtn = document.getElementById('open-btn');
    const mysteryScreen = document.getElementById('mystery-screen');
    const surpriseScreen = document.getElementById('surprise-screen');
    const timelineScreen = document.getElementById('timeline-screen');
    const carouselScreen = document.getElementById('carousel-screen');
    
    const journeyBtn = document.getElementById('journey-btn');
    const backBtn = document.getElementById('back-btn');
    const closeCarouselBtn = document.getElementById('close-carousel-btn');
    
    const btn3ds = document.querySelectorAll('.btn-3d');
    const carousel3d = document.getElementById('carousel-3d');
    const carouselTitle = document.getElementById('carousel-title');
    const particleContainer = document.getElementById('particle-container');
    let heartInterval;
    
    // Quiz Elements
    const quizScreen = document.getElementById('quiz-screen');
    const quizBtn = document.getElementById('quiz-btn');
    const closeQuizBtn = document.getElementById('close-quiz-btn');
    const backFromQuizBtn = document.getElementById('back-from-quiz-btn');
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const quizProgress = document.getElementById('quiz-progress');
    
    // Board Game Elements
    const boardgameBtn = document.getElementById('boardgame-btn');
    const boardgameScreen = document.getElementById('boardgame-screen');
    const exitBoardBtn = document.getElementById('exit-board-btn');
    const boardGrid = document.getElementById('board-grid');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResult = document.getElementById('dice-result');
    const playerStatus = document.getElementById('player-status');
    
    // ToD Elements
    const todModal = document.getElementById('tod-modal');
    const todQuestion = document.getElementById('tod-question');
    const todChoices = document.getElementById('tod-choices');
    const truthBtn = document.getElementById('truth-btn');
    const dareBtn = document.getElementById('dare-btn');
    const todResultArea = document.getElementById('tod-result-area');
    const todTask = document.getElementById('tod-task');
    const todDoneBtn = document.getElementById('tod-done-btn');
    
    const detailModal = document.getElementById('detail-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImgContainer = document.getElementById('modal-img-container');
    
    let currentAngle = 0;
    let autoRotateInterval;
    let isDragging = false;
    let startX = 0;
    
    // Cinematic Intro Logic
    startMovieBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        startScreen.classList.add('hidden');
        introScreen.classList.remove('hidden');
        setTimeout(() => {
            introScreen.classList.add('active');
            playCinematicSequence();
        }, 100);
    });

    function playCinematicSequence() {
        if(typeof THREE === 'undefined') {
            console.error("Three.js not loaded. Skipping intro.");
            endIntro();
            return;
        }

        const container = document.getElementById('three-container');
        container.innerHTML = '';
        
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
        curve.curveType = 'centripetal'; // Makes it smoother
        
        // Inner Core Tube
        const tubeGeometry = new THREE.TubeGeometry(curve, 600, 0.15, 12, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.9,
            wireframe: false
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        scene.add(tube);
        
        // Outer Grid Tube (Efek jaring yang mulus melingkar)
        const glowGeometry = new THREE.TubeGeometry(curve, 150, 0.6, 20, false);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00f3ff, 
            transparent: true, 
            opacity: 0.15,
            wireframe: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
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
        const nodes = [
            "📸 Memori 2023",
            "📸 Perjalanan Kita",
            "📸 Hari Spesial",
            "📸 Our Story"
        ];
        
        function createTextSprite(message) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
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

        for(let i=0; i<nodes.length; i++) {
            const t = (i + 1) / (nodes.length + 1);
            const pt = curve.getPoint(t);
            
            // Hitung arah kanan dari jalur untuk menaruh foto di samping
            const tangent = curve.getTangent(t).normalize();
            const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

            // 1. Teks Sprite
            const sprite = createTextSprite(nodes[i]);
            sprite.position.copy(pt);
            sprite.position.y += 6; // Teks agak ke atas
            scene.add(sprite);

            // 2. Image Sprite (Foto Kanan/Kiri)
            // Buat tekstur fallback jika foto asli belum ada
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#333'; ctx.fillRect(0,0,512,512);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Arial'; ctx.textAlign = 'center';
            ctx.fillText(`foto${i+1}.jpg`, 256, 240);
            ctx.font = '24px Arial'; ctx.fillText(`(Ganti dengan foto aslimu)`, 256, 290);
            
            const fallbackMap = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({ map: fallbackMap });
            
            // Coba load foto asli
            new THREE.TextureLoader().load(`foto${i+1}.jpg`, function(texture) {
                spriteMat.map = texture;
                spriteMat.needsUpdate = true;
            });

            const imgSprite = new THREE.Sprite(spriteMat);
            imgSprite.scale.set(15, 15, 1);
            
            // Selang-seling kanan (15) dan kiri (-15)
            const sideOffset = (i % 2 === 0) ? 16 : -16; 
            imgSprite.position.copy(pt).add(right.clone().multiplyScalar(sideOffset));
            imgSprite.position.y += 0; // Sejajar dengan garis
            scene.add(imgSprite);
        }

        window.addEventListener('resize', () => {
            if(!isIntroEnded) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // 4. Camera Animation
        let progress = 0;
        
        function animate() {
            if(isIntroEnded) return;
            cinematicAnimId = requestAnimationFrame(animate);
            
            progress += 0.0006; 
            
            if (progress >= 0.98) {
                end3DAndStartText();
                return;
            }
            
            const camPos = curve.getPoint(progress);
            const camLook = curve.getPoint(Math.min(progress + 0.01, 1));
            
            camera.position.copy(camPos);
            camera.lookAt(camLook);
            
            // Bintang tidak lagi memutar agar tidak pusing
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    function end3DAndStartText() {
        if(cinematicAnimId) cancelAnimationFrame(cinematicAnimId);
        
        const container = document.getElementById('three-container');
        if(container) {
            container.style.transition = 'opacity 2s ease';
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = '';
                container.style.display = 'none';
            }, 2000);
        }

        playTextSequence();
    }

    function playTextSequence() {
        let cumulativeDelay = 1000;
        
        cineTexts.forEach((textElement) => {
            let t1 = setTimeout(() => {
                textElement.classList.add('visible');
            }, cumulativeDelay);
            introTimeouts.push(t1);
            
            cumulativeDelay += 3500;
            
            let t2 = setTimeout(() => {
                textElement.classList.remove('visible');
            }, cumulativeDelay);
            introTimeouts.push(t2);
            
            cumulativeDelay += 2000;
        });
        
        let tEnd = setTimeout(endIntro, cumulativeDelay + 1000);
        introTimeouts.push(tEnd);
    }
    
    function endIntro() {
        if(isIntroEnded) return;
        isIntroEnded = true;
        
        if(cinematicAnimId) cancelAnimationFrame(cinematicAnimId);
        introTimeouts.forEach(clearTimeout);
        cineTexts.forEach(txt => txt.classList.remove('visible'));
        
        introScreen.classList.remove('active');
        introScreen.style.transition = 'opacity 2s ease';
        introScreen.style.opacity = '0';
        
        setTimeout(() => {
            introScreen.classList.add('hidden');
            prankScreen.classList.remove('hidden');
            setTimeout(() => prankScreen.classList.add('active'), 100);
            
            const container = document.getElementById('three-container');
            if(container) container.innerHTML = '';
            
            // Munculkan Music Player
            const musicPlayer = document.getElementById('music-player');
            if(musicPlayer) musicPlayer.classList.remove('hidden');
        }, 2000);
    }
    
    skipIntroBtn.addEventListener('click', endIntro);
    
    // Prank Logic
    let yesClickCount = 0;
    const prankTitle = document.getElementById('prank-title');
    
    yesBtn.addEventListener('click', () => {
        yesClickCount++;
        if(yesClickCount === 1) {
            prankTitle.innerHTML = 'Beneran nih? <span style="display:inline-block; transform: scale(1.5); transition: transform 0.3s; transform-origin: left center; margin-left: 5px;">🥺</span>';
            yesBtn.style.transform = 'scale(1.1)';
        } else if(yesClickCount === 2) {
            prankTitle.innerHTML = 'Nggak bohong kan? <span style="display:inline-block; transform: scale(2.2); transition: transform 0.3s; transform-origin: left center; margin-left: 10px;">😭</span>';
            yesBtn.style.transform = 'scale(1.2)';
        } else if(yesClickCount >= 3) {
            prankScreen.classList.remove('active');
            prankScreen.classList.add('hidden');
            mysteryScreen.classList.remove('hidden');
            setTimeout(() => mysteryScreen.classList.add('active'), 100);
        }
    });

    const moveNoBtn = () => {
        const card = prankScreen.querySelector('.glass-card');
        const cardRect = card.getBoundingClientRect();
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        const maxX = cardRect.width - btnWidth - 40;
        const maxY = cardRect.height - btnHeight - 40;
        
        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));
        
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.bottom = 'auto';
    };

    noBtn.addEventListener('mouseenter', moveNoBtn);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoBtn();
    });
    // Coba tangkap klik jika kursor sangat cepat
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoBtn();
    });

    // Transisi layar mystery
    openBtn.addEventListener('click', () => {
        openBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mysteryScreen.classList.remove('active');
            mysteryScreen.classList.add('hidden');
            surpriseScreen.classList.remove('hidden');
            setTimeout(() => {
                surpriseScreen.classList.add('active');
                fireConfetti();
            }, 100);
        }, 300);
    });

    journeyBtn.addEventListener('click', () => {
        surpriseScreen.classList.remove('active');
        surpriseScreen.classList.add('hidden');
        timelineScreen.classList.remove('hidden');
        setTimeout(() => timelineScreen.classList.add('active'), 100);
    });

    backBtn.addEventListener('click', () => {
        timelineScreen.classList.remove('active');
        timelineScreen.classList.add('hidden');
        surpriseScreen.classList.remove('hidden');
        setTimeout(() => surpriseScreen.classList.add('active'), 100);
    });

    closeCarouselBtn.addEventListener('click', () => {
        stopAutoRotate();
        clearInterval(heartInterval);
        carouselScreen.classList.remove('active');
        carouselScreen.classList.add('hidden');
        timelineScreen.classList.remove('hidden');
        setTimeout(() => timelineScreen.classList.add('active'), 100);
    });

    // 3D Carousel Data
    const photoData = {
        '2023': ['Foto 1 (2023)', 'Foto 2 (2023)', 'Foto 3 (2023)', 'Foto 4 (2023)', 'Foto 5 (2023)', 'Foto 6 (2023)'],
        '2024': ['Foto 1 (2024)', 'Foto 2 (2024)', 'Foto 3 (2024)', 'Foto 4 (2024)', 'Foto 5 (2024)'],
        '2025': ['Foto 1 (2025)', 'Foto 2 (2025)', 'Foto 3 (2025)', 'Foto 4 (2025)', 'Foto 5 (2025)', 'Foto 6 (2025)', 'Foto 7 (2025)'],
        '2026': ['Foto 1 (2026)', 'Foto 2 (2026)', 'Foto 3 (2026)', 'Foto 4 (2026)']
    };

    // Initialize 3D Carousel
    btn3ds.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const year = e.target.getAttribute('data-year');
            open3DCarousel(year);
        });
    });

    function open3DCarousel(year) {
        carouselTitle.innerText = `Memori ${year}`;
        carousel3d.innerHTML = '';
        particleContainer.innerHTML = ''; // Bersihkan partikel lama
        
        const photos = photoData[year];
        const numPanels = photos.length;
        const radius = Math.round((200 / 2) / Math.tan(Math.PI / numPanels)) + 50; 

        photos.forEach((photoText, index) => {
            const panel = document.createElement('div');
            panel.className = 'carousel-panel';
            panel.innerText = photoText;
            const angle = (360 / numPanels) * index;
            panel.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            
            // Interaction
            panel.addEventListener('click', () => {
                if(!isDragging) {
                    modalImgContainer.innerText = photoText;
                    detailModal.classList.remove('hidden');
                    stopAutoRotate();
                }
            });

            carousel3d.appendChild(panel);
        });

        currentAngle = 0;
        updateCarousel();
        
        timelineScreen.classList.remove('active');
        timelineScreen.classList.add('hidden');
        carouselScreen.classList.remove('hidden');
        setTimeout(() => {
            carouselScreen.classList.add('active');
            startAutoRotate();
            startFloatingHearts(photos);
        }, 100);
    }

    function updateCarousel() {
        carousel3d.style.transform = `rotateY(${currentAngle}deg)`;
    }

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            currentAngle -= 0.3; 
            updateCarousel();
        }, 30);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    // Drag / Swipe Logic
    let isMouseDown = false;
    let dragStartX = 0;
    let dragStartAngle = 0;

    const handleStart = (clientX) => {
        isMouseDown = true;
        isDragging = false;
        dragStartX = clientX;
        dragStartAngle = currentAngle;
        stopAutoRotate();
        carousel3d.style.transition = 'none'; 
    };

    const handleMove = (clientX) => {
        if (!isMouseDown) return;
        const diffX = clientX - dragStartX;
        if(Math.abs(diffX) > 5) isDragging = true; 
        currentAngle = dragStartAngle + diffX * 0.5; 
        updateCarousel();
    };

    const handleEnd = () => {
        isMouseDown = false;
        carousel3d.style.transition = 'transform 1s ease-out';
        setTimeout(() => {
            isDragging = false;
            startAutoRotate();
        }, 100);
    };

    carouselScreen.addEventListener('mousedown', (e) => handleStart(e.clientX));
    carouselScreen.addEventListener('mousemove', (e) => handleMove(e.clientX));
    carouselScreen.addEventListener('mouseup', handleEnd);
    carouselScreen.addEventListener('mouseleave', () => { if(isMouseDown) handleEnd(); });

    carouselScreen.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX));
    carouselScreen.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX));
    carouselScreen.addEventListener('touchend', handleEnd);

    // Close Modal
    closeModal.addEventListener('click', () => {
        detailModal.classList.add('hidden');
        startAutoRotate();
    });

    // Particle Logic
    function startFloatingHearts(photos) {
        clearInterval(heartInterval);
        for(let i=0; i<4; i++) {
            spawnHeart(photos);
        }
        heartInterval = setInterval(() => {
            spawnHeart(photos);
        }, 1500);
    }
    
    function spawnHeart(photos) {
        if(carouselScreen.classList.contains('hidden')) {
            clearInterval(heartInterval);
            return;
        }
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        heart.innerText = randomPhoto;
        
        const size = Math.random() * 50 + 50; // 50px - 100px
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${Math.random() * 90}%`;
        
        const duration = Math.random() * 10 + 10; // 10s - 20s
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        
        particleContainer.appendChild(heart);
        setTimeout(() => {
            if(heart.parentNode) heart.parentNode.removeChild(heart);
        }, (duration + 2) * 1000);
    }

    function fireConfetti() {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };
        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
        }
        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    // Quiz Logic
    const quizQuestions = [
        { q: "Di mana pertama kali kita ketemu?", options: ["Di Kampus", "Di Cafe", "Di Mall", "Di Jalan"], answer: 1 },
        { q: "Apa makanan favorit yang sering kita makan bareng?", options: ["Nasi Goreng", "Mie Ayam", "Ayam Geprek", "Martabak"], answer: 2 },
        { q: "Siapa yang paling sering ngaret kalau janjian?", options: ["Aku dong", "Kamu lah", "Sama aja", "Gak pernah ngaret"], answer: 0 },
        { q: "Apa panggilan kesayangan pertamaku buat kamu?", options: ["Sayang", "Babe", "Ayang", "Cinta"], answer: 2 },
        { q: "Warna baju apa yang aku pakai pas kencan pertama?", options: ["Hitam", "Putih", "Biru", "Pink"], answer: 0 },
        { q: "Hal apa yang paling bikin aku ngambek?", options: ["Dicuekin", "Telat balas chat", "Lupa janji", "Semua benar"], answer: 3 },
        { q: "Apa film pertama yang kita tonton bareng?", options: ["Horror", "Romance", "Action", "Comedy"], answer: 1 },
        { q: "Berapa lama kita pdkt sebelum akhirnya jadian?", options: ["1 Bulan", "3 Bulan", "6 Bulan", "Langsung jadian"], answer: 1 },
        { q: "Hal apa yang paling aku suka dari kamu?", options: ["Senyummu", "Perhatianmu", "Humormu", "Semuanya"], answer: 3 },
        { q: "Di tahun 2026 ini, apa harapan terbesarku buat kita?", options: ["Makin kaya", "Selalu sama-sama", "Bisa jalan-jalan", "Lulus cepat"], answer: 1 }
    ];

    let currentQuestionIndex = 0;

    quizBtn.addEventListener('click', () => {
        surpriseScreen.classList.remove('active');
        surpriseScreen.classList.add('hidden');
        
        quizScreen.classList.remove('hidden');
        setTimeout(() => {
            quizScreen.classList.add('active');
            startQuiz();
        }, 100);
    });

    function startQuiz() {
        currentQuestionIndex = 0;
        quizContent.classList.remove('hidden');
        quizResult.classList.add('hidden');
        closeQuizBtn.classList.remove('hidden');
        loadQuestion();
    }

    function loadQuestion() {
        const currentQ = quizQuestions[currentQuestionIndex];
        quizProgress.innerText = `Pertanyaan ${currentQuestionIndex + 1} / 10`;
        questionText.innerText = currentQ.q;
        optionsContainer.innerHTML = '';
        
        currentQ.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.addEventListener('click', () => handleAnswer(index, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(selectedIndex, btnElement) {
        const currentQ = quizQuestions[currentQuestionIndex];
        
        const allBtns = optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.style.pointerEvents = 'none');
        
        if(selectedIndex === currentQ.answer) {
            btnElement.classList.add('correct');
            setTimeout(() => {
                currentQuestionIndex++;
                if(currentQuestionIndex < quizQuestions.length) {
                    loadQuestion();
                } else {
                    showQuizResult();
                }
            }, 1000);
        } else {
            btnElement.classList.add('wrong');
            setTimeout(() => {
                btnElement.classList.remove('wrong');
                allBtns.forEach(b => b.style.pointerEvents = 'auto');
            }, 800);
        }
    }

    function showQuizResult() {
        quizContent.classList.add('hidden');
        closeQuizBtn.classList.add('hidden');
        quizResult.classList.remove('hidden');
        fireConfetti();
    }

    function exitQuiz() {
        quizScreen.classList.remove('active');
        quizScreen.classList.add('hidden');
        surpriseScreen.classList.remove('hidden');
        setTimeout(() => surpriseScreen.classList.add('active'), 100);
    }

    closeQuizBtn.addEventListener('click', exitQuiz);
    backFromQuizBtn.addEventListener('click', exitQuiz);

    // --- BOARD GAME LOGIC ---
    let playerPos = 1;
    const totalSquares = 100;
    
    // Ular dan Tangga
    const snakesAndLadders = {
        4: 14,
        9: 31,
        17: 7,
        20: 38,
        28: 84,
        40: 59,
        51: 67,
        54: 34,
        62: 19,
        64: 60,
        71: 91,
        87: 24,
        93: 73,
        95: 75,
        99: 78
    };
    
    const todSquares = [5, 12, 18, 25, 33, 42, 50, 57, 68, 77, 85, 96];
    
    const truthQuestions = [
        "Apa rahasia yang belum pernah kamu kasih tau ke aku?",
        "Momen apa pas sama aku yang bikin kamu paling deg-degan?",
        "Kalau bisa ngulang satu hari dari masa lalu kita, hari apa yang kamu pilih?",
        "Apa kebiasaan burukku yang diam-diam kamu maklumin?",
        "Siapa orang pertama yang kamu kasih tau pas kita mulai pdkt?",
        "Jujur, apa hal yang paling kamu takutin dari hubungan kita?",
        "Kapan momen kamu ngerasa bener-bener bersyukur punya aku?",
        "Ada nggak hal yang pengen banget kamu lakuin bareng tapi belum kesampaian?",
        "Pernah nggak kamu cemburu tapi diam aja? Pas kejadian apa?",
        "Apa hal kecil dariku yang selalu bikin kamu kangen?"
    ];
    
    const dareTasks = [
        "Cium pipiku sekarang juga!",
        "Kirim VN ke aku bilang 'I Love You' pake nada paling manja.",
        "Kasih HP kamu ke aku selama 1 menit buat buka apapun bebas.",
        "Peluk aku erat-erat selama 15 detik tanpa ngomong apa-apa.",
        "Upload foto terlucu/teraib kita berdua di story IG/WA sekarang.",
        "Nyanyiin reff lagu romantis ke aku sambil tatap mata.",
        "Pijitin bahu aku selama 2 menit.",
        "Bikin puisi gombal spontan pakai kata 'Bulan' dan 'Sate'.",
        "Tiru ekspresi wajah marahku yang paling lucu.",
        "Ganti wallpaper HP kamu pakai foto aibku selama 1 jam."
    ];

    boardgameBtn.addEventListener('click', () => {
        surpriseScreen.classList.remove('active');
        surpriseScreen.classList.add('hidden');
        boardgameScreen.classList.remove('hidden');
        setTimeout(() => {
            boardgameScreen.classList.add('active');
            initBoard();
        }, 100);
    });

    exitBoardBtn.addEventListener('click', () => {
        boardgameScreen.classList.remove('active');
        boardgameScreen.classList.add('hidden');
        surpriseScreen.classList.remove('hidden');
        setTimeout(() => surpriseScreen.classList.add('active'), 100);
    });

    function initBoard() {
        boardGrid.innerHTML = '<div id="player-token" class="player-token">👩‍❤️‍👨</div>';
        
        const boardLayout = [];
        for(let row = 0; row < 10; row++) {
            const maxSquare = 100 - (row * 10);
            const rowArr = [];
            for(let col = 0; col < 10; col++) {
                if(row % 2 === 0) { 
                    rowArr.push(maxSquare - col);
                } else { 
                    rowArr.push(maxSquare - 9 + col);
                }
            }
            boardLayout.push(...rowArr);
        }
        
        boardLayout.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.id = `cell-${num}`;
            cell.innerHTML = `<span class="cell-number">${num}</span>`;
            
            if(snakesAndLadders[num]) {
                const info = document.createElement('div');
                info.className = 'big-icon';
                if(snakesAndLadders[num] > num) {
                    info.innerHTML = `
                        <div class="custom-ladder">
                            <div class="rung"></div><div class="rung"></div><div class="rung"></div><div class="rung"></div>
                        </div>
                    `;
                } else {
                    info.innerText = '🐍';
                }
                cell.appendChild(info);
            } else if(todSquares.includes(num)) {
                const info = document.createElement('div');
                info.className = 'big-icon';
                info.innerText = '🔥';
                cell.appendChild(info);
            }
            
            boardGrid.appendChild(cell);
        });
        
        playerPos = 1;
        // Beri sedikit delay agar rendering grid selesai sebelum update posisi
        setTimeout(updateTokenPosition, 100);
    }

    function updateTokenPosition() {
        const token = document.getElementById('player-token');
        const targetCell = document.getElementById(`cell-${playerPos}`);
        
        if (targetCell && token) {
            const gridRect = boardGrid.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();
            
            const top = cellRect.top - gridRect.top + (cellRect.height / 2) - 12.5; 
            const left = cellRect.left - gridRect.left + (cellRect.width / 2) - 12.5;
            
            token.style.top = `${top}px`;
            token.style.left = `${left}px`;
        }
        playerStatus.innerText = `Posisi: Kotak ${playerPos}`;
    }

    rollDiceBtn.addEventListener('click', () => {
        if(playerPos >= totalSquares) return;
        
        rollDiceBtn.disabled = true;
        let rollCount = 0;
        
        const rollAnim = setInterval(() => {
            diceResult.innerText = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
            rollCount++;
            if(rollCount > 10) {
                clearInterval(rollAnim);
                
                const steps = Math.floor(Math.random() * 6) + 1;
                diceResult.innerText = `🎲 Dapat: ${steps}!`;
                
                movePlayer(steps);
            }
        }, 50);
    });

    function movePlayer(steps) {
        if(steps === 0) {
            setTimeout(checkSquareEvent, 300);
            return;
        }
        
        playerPos++;
        if(playerPos > totalSquares) {
            playerPos = totalSquares;
        }
        
        updateTokenPosition();
        
        if(playerPos === totalSquares) {
            setTimeout(checkSquareEvent, 300);
            return;
        }
        
        setTimeout(() => {
            movePlayer(steps - 1);
        }, 250);
    }

    function checkSquareEvent() {
        if(snakesAndLadders[playerPos]) {
            const newPos = snakesAndLadders[playerPos];
            const isLadder = newPos > playerPos;
            diceResult.innerText = isLadder ? `Yeay! Naik tangga ke ${newPos}` : `Oops! Turun ular ke ${newPos}`;
            playerPos = newPos;
            updateTokenPosition();
            
            setTimeout(() => checkToD(), 600);
        } else {
            checkToD();
        }
    }

    function checkToD() {
        if(playerPos === totalSquares) {
            diceResult.innerText = `🎉 KAMU MENANG! 🎉`;
            fireConfetti();
            rollDiceBtn.disabled = false;
            return;
        }
        
        if(todSquares.includes(playerPos)) {
            todModal.classList.remove('hidden');
            todChoices.classList.remove('hidden');
            todResultArea.classList.add('hidden');
            todQuestion.innerText = "Kotak Tantangan! Pilih salah satu:";
        } else {
            rollDiceBtn.disabled = false;
        }
    }

    truthBtn.addEventListener('click', () => {
        todChoices.classList.add('hidden');
        todResultArea.classList.remove('hidden');
        const randomQ = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
        todTask.innerText = `Tanya: "${randomQ}"`;
    });

    dareBtn.addEventListener('click', () => {
        todChoices.classList.add('hidden');
        todResultArea.classList.remove('hidden');
        const randomD = dareTasks[Math.floor(Math.random() * dareTasks.length)];
        todTask.innerText = `Tantangan: "${randomD}"`;
    });

    todDoneBtn.addEventListener('click', () => {
        todModal.classList.add('hidden');
        diceResult.innerText = `Tantangan selesai! Lanjut main!`;
        rollDiceBtn.disabled = false;
    });

    // --- NEW MEGA FEATURES LOGIC ---
    
    // 1. Music Player
    const musicPlayer = document.getElementById('music-player');
    const bgm = document.getElementById('bgm');
    const vinylRecord = document.getElementById('vinyl-record');
    
    musicPlayer.addEventListener('click', () => {
        if(bgm.paused) {
            bgm.play();
            vinylRecord.classList.add('playing');
        } else {
            bgm.pause();
            vinylRecord.classList.remove('playing');
        }
    });

    // 2. Letter Screen
    const letterBtn = document.getElementById('letter-btn');
    const letterScreen = document.getElementById('letter-screen');
    const exitLetterBtn = document.getElementById('exit-letter-btn');
    const typedText = document.getElementById('typed-text');
    let typingInterval;
    
    const letterContent = `Hai Cantik,\n\nSelamat ulang tahun ya! 🎉\nSemoga di umur yang baru ini, kamu semakin dewasa, semakin bersinar, dan semua yang kamu impikan bisa terwujud.\n\nTerima kasih sudah bertahan, terima kasih sudah selalu memberikan warna yang indah di setiap hariku.\n\nAku mungkin bukan orang yang paling romantis, tapi aku harap website kecil ini bisa bikin kamu senyum hari ini.\n\nI love you, now and always. ❤️\n\n- Dari cowokmu yang paling tampan`;

    function typeWriterEffect() {
        typedText.textContent = '';
        let i = 0;
        clearInterval(typingInterval);
        typingInterval = setInterval(() => {
            if (i < letterContent.length) {
                typedText.textContent += letterContent.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 60);
    }

    letterBtn.addEventListener('click', () => {
        prankScreen.classList.remove('active');
        setTimeout(() => {
            prankScreen.classList.add('hidden');
            letterScreen.classList.remove('hidden');
            setTimeout(() => {
                letterScreen.classList.add('active');
                typeWriterEffect();
            }, 100);
        }, 500);
    });

    exitLetterBtn.addEventListener('click', () => {
        clearInterval(typingInterval);
        letterScreen.classList.remove('active');
        setTimeout(() => {
            letterScreen.classList.add('hidden');
            prankScreen.classList.remove('hidden');
            setTimeout(() => prankScreen.classList.add('active'), 100);
        }, 500);
    });

    // 3. Gift Screen
    const giftBtn = document.getElementById('gift-btn');
    const giftScreen = document.getElementById('gift-screen');
    const exitGiftBtn = document.getElementById('exit-gift-btn');
    const giftBox = document.getElementById('gift-box');
    const couponsContainer = document.getElementById('coupons-container');
    const giftTitle = document.getElementById('gift-title');

    giftBtn.addEventListener('click', () => {
        giftBox.classList.remove('open');
        giftBox.style.display = 'block';
        couponsContainer.classList.add('hidden');
        giftTitle.textContent = "Ada Kado Buat Kamu! 🎁";
        
        prankScreen.classList.remove('active');
        setTimeout(() => {
            prankScreen.classList.add('hidden');
            giftScreen.classList.remove('hidden');
            setTimeout(() => giftScreen.classList.add('active'), 100);
        }, 500);
    });

    giftBox.addEventListener('click', () => {
        giftBox.classList.add('open');
        setTimeout(() => {
            giftBox.style.display = 'none';
            giftTitle.textContent = "Yeay! Kupon Spesial! 🎉";
            couponsContainer.classList.remove('hidden');
        }, 500);
    });

    exitGiftBtn.addEventListener('click', () => {
        giftScreen.classList.remove('active');
        setTimeout(() => {
            giftScreen.classList.add('hidden');
            prankScreen.classList.remove('hidden');
            setTimeout(() => prankScreen.classList.add('active'), 100);
        }, 500);
    });

    // 4. Photobooth Screen
    const photoboothBtn = document.getElementById('photobooth-btn');
    const photoboothScreen = document.getElementById('photobooth-screen');
    const exitPhotoboothBtn = document.getElementById('exit-photobooth-btn');
    
    const cameraStream = document.getElementById('camera-stream');
    const photoCanvas = document.getElementById('photo-canvas');
    const snapBtn = document.getElementById('snap-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const downloadBtn = document.getElementById('download-btn');
    const polaroidFrame = document.getElementById('polaroid-frame');
    let stream = null;

    // Event listener untuk tombol template photobooth
    const templateBtns = document.querySelectorAll('.template-btn');
    const customOverlay = document.getElementById('custom-overlay');

    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.getAttribute('data-template');
            
            // Hapus semua class template-* dari polaroidFrame
            polaroidFrame.className = '';
            polaroidFrame.classList.add(`template-${template}`);
            
            // Logika khusus untuk template custom PNG
            if (template === 'custom1') {
                customOverlay.src = 'Brown and Black Polaroid Vintage Photo Collage.png';
                customOverlay.style.display = 'block';
                polaroidFrame.style.border = 'none'; // Sembunyikan styling dasar
                polaroidFrame.style.background = 'transparent';
                polaroidFrame.style.padding = '0';
                polaroidFrame.querySelector('.frame-text').style.display = 'none'; // Sembunyikan teks karena collage biasanya sudah ada teks
            } else if (template === 'custom2') {
                customOverlay.src = 'Grey Scrapbook Photo Collage Friends Instagram Story.png';
                customOverlay.style.display = 'block';
                polaroidFrame.style.border = 'none';
                polaroidFrame.style.background = 'transparent';
                polaroidFrame.style.padding = '0';
                polaroidFrame.querySelector('.frame-text').style.display = 'none';
            } else {
                customOverlay.style.display = 'none';
                customOverlay.src = '';
                polaroidFrame.style.border = '';
                polaroidFrame.style.background = '';
                polaroidFrame.style.padding = '';
                polaroidFrame.querySelector('.frame-text').style.display = 'block';
            }
        });
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            cameraStream.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
            alert("Yah, gagal mengakses kamera. Pastikan browser diizinkan ya!");
        }
    }

    function stopCamera() {
        if(stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    photoboothBtn.addEventListener('click', () => {
        cameraStream.classList.remove('hidden');
        photoCanvas.classList.add('hidden');
        snapBtn.classList.remove('hidden');
        retakeBtn.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        
        prankScreen.classList.remove('active');
        setTimeout(() => {
            prankScreen.classList.add('hidden');
            photoboothScreen.classList.remove('hidden');
            setTimeout(() => {
                photoboothScreen.classList.add('active');
                startCamera();
            }, 100);
        }, 500);
    });

    exitPhotoboothBtn.addEventListener('click', () => {
        stopCamera();
        photoboothScreen.classList.remove('active');
        setTimeout(() => {
            photoboothScreen.classList.add('hidden');
            prankScreen.classList.remove('hidden');
            setTimeout(() => prankScreen.classList.add('active'), 100);
        }, 500);
    });

    snapBtn.addEventListener('click', () => {
        // Pastikan kita mendapatkan dimensi yang valid (menghindari error blank/transparan)
        const vWidth = cameraStream.videoWidth || cameraStream.getBoundingClientRect().width || 640;
        const vHeight = cameraStream.videoHeight || cameraStream.getBoundingClientRect().height || 360;

        photoCanvas.width = vWidth;
        photoCanvas.height = vHeight;

        const ctx = photoCanvas.getContext('2d');
        
        // Cermin kamera
        ctx.translate(photoCanvas.width, 0);
        ctx.scale(-1, 1);
        
        // Gambar video persis apa adanya ke canvas (CSS object-fit: cover yang akan mengurus potongannya)
        ctx.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        cameraStream.classList.add('hidden');
        photoCanvas.classList.remove('hidden');
        
        snapBtn.classList.add('hidden');
        retakeBtn.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
    });

    retakeBtn.addEventListener('click', () => {
        cameraStream.classList.remove('hidden');
        photoCanvas.classList.add('hidden');
        
        snapBtn.classList.remove('hidden');
        retakeBtn.classList.add('hidden');
        downloadBtn.classList.add('hidden');
    });

    downloadBtn.addEventListener('click', async () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Menyimpan... ⏳';
        downloadBtn.disabled = true;
        
        try {
            // Gunakan html2canvas untuk menangkap seluruh frame div termasuk border dan bayangan
            const canvas = await html2canvas(polaroidFrame, {
                backgroundColor: null,
                scale: 2
            });
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'Photobooth-Kita.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error saving image", err);
            alert("Maaf, terjadi kesalahan saat menyimpan gambar.");
        }
        
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    });

});
