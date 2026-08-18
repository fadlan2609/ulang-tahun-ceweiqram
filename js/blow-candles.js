// ===== BLOW CANDLES FEATURE =====
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        return;
    }

    // Cek apakah lilin sudah padam
    if (localStorage.getItem('candlesBlown') === 'true') {
        // Sembunyikan lilin dan tampilkan menu
        const cakeSection = document.getElementById('cake-section');
        const ucapanSection = document.getElementById('ucapan-section');
        const boxesSection = document.getElementById('boxes-section');
        
        if (cakeSection) cakeSection.style.display = 'none';
        if (ucapanSection) ucapanSection.classList.add('hidden');
        if (boxesSection) boxesSection.classList.remove('hidden');
        return;
    }

    const blowButton = document.getElementById('blow-button');
    const micModal = document.getElementById('mic-modal');
    const allowMicBtn = document.getElementById('allow-mic');
    const skipMicBtn = document.getElementById('skip-mic');
    const micStatus = document.getElementById('mic-status');
    const blowInstruction = document.getElementById('blow-instruction');
    const blowResult = document.getElementById('blow-result');
    const resultText = document.getElementById('result-text');
    const candlesLitElement = document.getElementById('candles-lit');
    const flames = document.querySelectorAll('.flame');
    const ucapanSection = document.getElementById('ucapan-section');
    const cakeSection = document.getElementById('cake-section');
    const boxesSection = document.getElementById('boxes-section');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!blowButton) return;
    
    let audioContext, microphone, analyser, javascriptNode;
    let isMicActive = false;
    let isListening = false;
    let candlesLit = flames.length;
    let blowTimeout;
    
    if (candlesLitElement) {
        candlesLitElement.textContent = candlesLit;
    }
    
    // Show microphone modal
    setTimeout(() => {
        if (micModal && candlesLit > 0) {
            micModal.style.display = 'flex';
        } else if (!micModal) {
            blowButton.disabled = false;
            blowButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Klik untuk Mematikan Lilin';
            blowButton.onclick = function() {
                blowOutRandomCandle();
            };
        }
    }, 1500);
    
    // Allow microphone
    if (allowMicBtn) {
        allowMicBtn.addEventListener('click', async function() {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error('Browser tidak mendukung akses microphone');
                }
                
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
                });
                
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
                
                analyser.smoothingTimeConstant = 0.3;
                analyser.fftSize = 512;
                
                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                
                isMicActive = true;
                if (micModal) micModal.style.display = 'none';
                
                if (micStatus) {
                    micStatus.innerHTML = '<i class="fas fa-microphone"></i> Microphone aktif';
                    micStatus.classList.add('active');
                }
                
                blowButton.disabled = false;
                blowButton.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Mematikan Lilin';
                blowButton.style.background = 'linear-gradient(135deg, #ff6b8b, #ff8e53)';
                
            } catch (error) {
                console.error('Error accessing microphone:', error);
                if (micModal) micModal.style.display = 'none';
                isMicActive = false;
                
                blowButton.disabled = false;
                blowButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Klik untuk Mematikan Lilin';
                blowButton.style.background = 'linear-gradient(135deg, #6b8bff, #8e53ff)';
                blowButton.onclick = function() {
                    blowOutRandomCandle();
                };
            }
        });
    }
    
    // Skip microphone
    if (skipMicBtn) {
        skipMicBtn.addEventListener('click', function() {
            if (micModal) micModal.style.display = 'none';
            isMicActive = false;
            
            blowButton.disabled = false;
            blowButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Klik untuk Mematikan Lilin';
            blowButton.style.background = 'linear-gradient(135deg, #6b8bff, #8e53ff)';
            blowButton.onclick = function() {
                blowOutRandomCandle();
            };
        });
    }
    
    // Blow button click
    blowButton.addEventListener('click', function() {
        if (!isMicActive) {
            blowOutRandomCandle();
            return;
        }
        if (candlesLit === 0) return;
        startListeningForBlow();
    });
    
    function startListeningForBlow() {
        if (candlesLit === 0 || !isMicActive || isListening) return;
        
        isListening = true;
        blowButton.disabled = true;
        blowButton.classList.add('blowing');
        blowButton.innerHTML = '<i class="fas fa-volume-up"></i> Dengarkan dan TIUP sekarang...';
        
        if (blowInstruction) blowInstruction.style.display = 'flex';
        if (micStatus) micStatus.style.display = 'none';
        if (blowResult) blowResult.style.display = 'none';
        
        flames.forEach(flame => {
            if (!flame.classList.contains('blown')) {
                flame.classList.add('listening');
            }
        });
        
        if (javascriptNode) {
            javascriptNode.onaudioprocess = function() {
                if (!isListening) return;
                
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                
                let total = 0;
                for (let i = 0; i < array.length; i++) {
                    total += array[i];
                }
                const average = total / array.length;
                
                if (average > 50) {
                    blowOutRandomCandle();
                    isListening = false;
                    javascriptNode.onaudioprocess = null;
                    
                    blowButton.disabled = false;
                    blowButton.classList.remove('blowing');
                    blowButton.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Lilin Berikutnya';
                    if (blowInstruction) blowInstruction.style.display = 'none';
                    
                    if (blowResult) {
                        blowResult.style.display = 'flex';
                        resultText.textContent = 'Sukses! Lilin padam! 🔥';
                    }
                    
                    flames.forEach(flame => {
                        flame.classList.remove('listening');
                    });
                    
                    setTimeout(() => {
                        if (blowResult) blowResult.style.display = 'none';
                        if (micStatus) micStatus.style.display = 'flex';
                    }, 2000);
                    
                    clearTimeout(blowTimeout);
                }
            };
        }
        
        blowTimeout = setTimeout(() => {
            if (isListening) {
                isListening = false;
                if (javascriptNode) javascriptNode.onaudioprocess = null;
                
                blowButton.disabled = false;
                blowButton.classList.remove('blowing');
                blowButton.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Mematikan Lilin';
                if (blowInstruction) blowInstruction.style.display = 'none';
                
                if (blowResult) {
                    blowResult.style.display = 'flex';
                    resultText.textContent = 'Tidak ada tiupan terdeteksi. Coba lagi!';
                }
                
                flames.forEach(flame => {
                    flame.classList.remove('listening');
                });
                
                setTimeout(() => {
                    if (blowResult) blowResult.style.display = 'none';
                    if (micStatus) micStatus.style.display = 'flex';
                }, 3000);
            }
        }, 8000);
    }
    
    function blowOutRandomCandle() {
        if (candlesLit === 0) return;
        
        const litCandles = Array.from(flames).filter(flame => 
            !flame.classList.contains('blown')
        );
        
        if (litCandles.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * litCandles.length);
        const candleToBlow = litCandles[randomIndex];
        blowOutCandle(candleToBlow);
    }
    
    function blowOutCandle(flameElement) {
        if (flameElement.classList.contains('blown')) return;
        
        flameElement.classList.add('blown');
        flameElement.classList.remove('listening');
        flameElement.style.animation = 'blowOut 0.8s forwards';
        
        playBlowSound();
        
        candlesLit--;
        
        if (candlesLitElement) {
            candlesLitElement.textContent = candlesLit;
        }
        
        if (candlesLit === 0) {
            // Simpan state ke localStorage
            localStorage.setItem('candlesBlown', 'true');
            
            setTimeout(() => {
                if (cakeSection) cakeSection.style.display = 'none';
                if (ucapanSection) ucapanSection.classList.remove('hidden');
                createConfetti();
                
                const bgMusic = document.getElementById('background-music');
                if (bgMusic) {
                    bgMusic.play().catch(() => {});
                }
            }, 1000);
        }
    }
    
    function playBlowSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 180;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) {}
    }
    
    // Next button - show boxes
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (ucapanSection) ucapanSection.classList.add('hidden');
            if (boxesSection) boxesSection.classList.remove('hidden');
            
            // Update URL hash agar saat refresh tetap di menu
            window.location.hash = 'boxes-section';
            
            setTimeout(() => {
                boxesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        });
    }
    
    function createConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        
        const colors = ['#ff6b8b', '#ffd700', '#6b8bff', '#ffcc00', '#6bff8b', '#cc6bff', '#ff4757'];
        
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.cssText = `
                left: ${Math.random() * 100}%;
                width: ${5 + Math.random() * 8}px;
                height: ${5 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation-duration: ${2 + Math.random() * 3}s;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(piece);
            
            setTimeout(() => piece.remove(), 5000);
        }
    }
});