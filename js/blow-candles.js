// ===== BLOW CANDLES FEATURE =====
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        return;
    }

    // ===== INISIALISASI ULANG =====
    function initCandles() {
        console.log('🔥 Inisialisasi lilin...');
        
        // Ambil semua lilin
        const flames = document.querySelectorAll('.flame');
        const totalCandles = flames.length;
        
        // Reset counter
        const candlesLitElement = document.getElementById('candles-lit');
        if (candlesLitElement) {
            candlesLitElement.textContent = totalCandles;
        }
        
        // Reset counter display
        const counterDisplay = document.querySelector('.candle-counter .counter-display');
        if (counterDisplay) {
            counterDisplay.innerHTML = `<span id="candles-lit">${totalCandles}</span> / ${totalCandles}`;
        }
        
        // Reset semua lilin
        flames.forEach(flame => {
            flame.classList.remove('blown');
            flame.classList.remove('listening');
            // Reset style dengan benar
            flame.style.cssText = '';
            flame.style.animation = 'flicker 1.5s infinite alternate';
            flame.style.transform = 'translateX(-50%) scale(1)';
            flame.style.opacity = '1';
            flame.style.display = 'block';
            flame.style.visibility = 'visible';
            flame.style.position = 'absolute';
            flame.style.top = '-35px';
            flame.style.left = '50%';
            flame.style.width = '20px';
            flame.style.height = '40px';
            flame.style.background = 'radial-gradient(ellipse at center, #ffcc00, #ff6b00, transparent 70%)';
            flame.style.borderRadius = '50% 50% 20% 20%';
            flame.style.boxShadow = 'none';
        });
        
        // Reset tombol blow
        const blowButton = document.getElementById('blow-button');
        if (blowButton) {
            blowButton.disabled = false;
            blowButton.innerHTML = '<i class="fas fa-wind"></i> Tekan untuk Meniup Lilin';
            blowButton.style.background = 'linear-gradient(135deg, #ff6b8b, #ff8e53)';
            blowButton.classList.remove('blowing');
            blowButton.style.opacity = '1';
            blowButton.style.pointerEvents = 'auto';
        }
        
        // Reset status mic
        const micStatus = document.getElementById('mic-status');
        if (micStatus) {
            micStatus.innerHTML = '<i class="fas fa-microphone-slash"></i> Microphone belum diaktifkan';
            micStatus.classList.remove('active');
            micStatus.style.display = 'flex';
            micStatus.style.background = 'rgba(255, 68, 68, 0.1)';
            micStatus.style.color = '#ff4444';
        }
        
        // Sembunyikan instruksi dan result
        const blowInstruction = document.getElementById('blow-instruction');
        if (blowInstruction) {
            blowInstruction.style.display = 'none';
        }
        const blowResult = document.getElementById('blow-result');
        if (blowResult) {
            blowResult.style.display = 'none';
        }
        
        // Hapus confetti
        const confettiContainer = document.getElementById('confettiContainer');
        if (confettiContainer) {
            confettiContainer.innerHTML = '';
        }
        
        // Tampilkan cake section
        const cakeSection = document.getElementById('cake-section');
        if (cakeSection) {
            cakeSection.style.display = 'block';
            cakeSection.style.opacity = '1';
            cakeSection.style.visibility = 'visible';
            cakeSection.style.position = 'relative';
            cakeSection.style.height = 'auto';
        }
        
        // Sembunyikan ucapan
        const ucapanSection = document.getElementById('ucapan-section');
        if (ucapanSection) {
            ucapanSection.classList.add('hidden');
            ucapanSection.style.display = 'none';
        }
        
        // Sembunyikan boxes
        const boxesSection = document.getElementById('boxes-section');
        if (boxesSection) {
            boxesSection.classList.add('hidden');
            boxesSection.style.display = 'none';
        }
        
        // Hapus state localStorage
        localStorage.removeItem('candlesBlown');
        
        console.log('✅ Lilin siap dengan', totalCandles, 'lilin');
        
        // Tampilkan microphone modal setelah reset
        setTimeout(() => {
            const micModal = document.getElementById('mic-modal');
            if (micModal && totalCandles > 0) {
                micModal.style.display = 'flex';
            }
        }, 500);
    }

    // ===== FUNGSI UTAMA =====
    let audioContext, microphone, analyser, javascriptNode;
    let isMicActive = false;
    let isListening = false;
    let candlesLit = 0;
    let blowTimeout;

    // ===== TIUP LILIN =====
    function blowOutRandomCandle() {
        const flames = document.querySelectorAll('.flame');
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
        
        // Tambahkan class blown
        flameElement.classList.add('blown');
        flameElement.classList.remove('listening');
        
        // Animasi padam
        flameElement.style.animation = 'blowOut 0.8s forwards';
        flameElement.style.opacity = '0';
        flameElement.style.transform = 'translateX(-50%) scale(0)';
        flameElement.style.display = 'none';
        
        // Play sound
        playBlowSound();
        
        // Update counter
        const flames = document.querySelectorAll('.flame');
        const litCandles = Array.from(flames).filter(flame => 
            !flame.classList.contains('blown')
        );
        candlesLit = litCandles.length;
        
        const candlesLitElement = document.getElementById('candles-lit');
        if (candlesLitElement) {
            candlesLitElement.textContent = candlesLit;
        }
        
        // Update counter display
        const counterDisplay = document.querySelector('.candle-counter .counter-display');
        if (counterDisplay) {
            counterDisplay.innerHTML = `<span id="candles-lit">${candlesLit}</span> / ${flames.length}`;
        }
        
        // Jika semua lilin padam
        if (candlesLit === 0) {
            localStorage.setItem('candlesBlown', 'true');
            
            setTimeout(() => {
                const cakeSection = document.getElementById('cake-section');
                const ucapanSection = document.getElementById('ucapan-section');
                
                if (cakeSection) {
                    cakeSection.style.display = 'none';
                }
                if (ucapanSection) {
                    ucapanSection.classList.remove('hidden');
                    ucapanSection.style.display = 'block';
                }
                
                // Buat confetti
                createConfetti();
                
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

    function createConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        
        const colors = ['#ff6b8b', '#ffd700', '#6b8bff', '#ffcc00', '#6bff8b', '#cc6bff', '#ff4757'];
        
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                width: ${5 + Math.random() * 8}px;
                height: ${5 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                top: -20px;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
                opacity: 0.9;
                z-index: 999;
            `;
            container.appendChild(piece);
            
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.remove();
                }
            }, 5000);
        }
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        const blowButton = document.getElementById('blow-button');
        const allowMicBtn = document.getElementById('allow-mic');
        const skipMicBtn = document.getElementById('skip-mic');
        const nextBtn = document.getElementById('nextBtn');
        const backToCakeBtn = document.getElementById('backToCakeBtn');

        // === BLOW BUTTON ===
        if (blowButton) {
            const newBlowBtn = blowButton.cloneNode(true);
            blowButton.parentNode.replaceChild(newBlowBtn, blowButton);
            
            newBlowBtn.addEventListener('click', function() {
                if (!isMicActive) {
                    blowOutRandomCandle();
                    return;
                }
                if (candlesLit === 0) return;
                startListeningForBlow();
            });
        }

        // === ALLOW MIC ===
        if (allowMicBtn) {
            const newAllowBtn = allowMicBtn.cloneNode(true);
            allowMicBtn.parentNode.replaceChild(newAllowBtn, allowMicBtn);
            
            newAllowBtn.addEventListener('click', async function() {
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
                    
                    const micModal = document.getElementById('mic-modal');
                    if (micModal) micModal.style.display = 'none';
                    
                    const micStatus = document.getElementById('mic-status');
                    if (micStatus) {
                        micStatus.innerHTML = '<i class="fas fa-microphone"></i> Microphone aktif';
                        micStatus.classList.add('active');
                        micStatus.style.background = 'rgba(37, 211, 102, 0.1)';
                        micStatus.style.color = '#25D366';
                    }
                    
                    const blowBtn = document.getElementById('blow-button');
                    if (blowBtn) {
                        blowBtn.disabled = false;
                        blowBtn.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Mematikan Lilin';
                        blowBtn.style.background = 'linear-gradient(135deg, #ff6b8b, #ff8e53)';
                    }
                    
                    showToast('Microphone berhasil diaktifkan!', 'success');
                    
                } catch (error) {
                    console.error('Error accessing microphone:', error);
                    const micModal = document.getElementById('mic-modal');
                    if (micModal) micModal.style.display = 'none';
                    isMicActive = false;
                    
                    const blowBtn = document.getElementById('blow-button');
                    if (blowBtn) {
                        blowBtn.disabled = false;
                        blowBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Klik untuk Mematikan Lilin';
                        blowBtn.style.background = 'linear-gradient(135deg, #6b8bff, #8e53ff)';
                        blowBtn.onclick = function() {
                            blowOutRandomCandle();
                        };
                    }
                    
                    showToast('Tidak dapat mengakses microphone. Mode manual.', 'error');
                }
            });
        }

        // === SKIP MIC ===
        if (skipMicBtn) {
            const newSkipBtn = skipMicBtn.cloneNode(true);
            skipMicBtn.parentNode.replaceChild(newSkipBtn, skipMicBtn);
            
            newSkipBtn.addEventListener('click', function() {
                const micModal = document.getElementById('mic-modal');
                if (micModal) micModal.style.display = 'none';
                isMicActive = false;
                
                const blowBtn = document.getElementById('blow-button');
                if (blowBtn) {
                    blowBtn.disabled = false;
                    blowBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Klik untuk Mematikan Lilin';
                    blowBtn.style.background = 'linear-gradient(135deg, #6b8bff, #8e53ff)';
                    blowBtn.onclick = function() {
                        blowOutRandomCandle();
                    };
                }
                
                showToast('Mode manual diaktifkan', 'info');
            });
        }

        // === NEXT BUTTON ===
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            newNextBtn.addEventListener('click', function() {
                const ucapanSection = document.getElementById('ucapan-section');
                const boxesSection = document.getElementById('boxes-section');
                
                if (ucapanSection) {
                    ucapanSection.classList.add('hidden');
                    ucapanSection.style.display = 'none';
                }
                if (boxesSection) {
                    boxesSection.classList.remove('hidden');
                    boxesSection.style.display = 'block';
                }
                
                window.location.hash = 'boxes-section';
                
                setTimeout(() => {
                    if (boxesSection) {
                        boxesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            });
        }

        // === BACK TO CAKE ===
        if (backToCakeBtn) {
            const newBackBtn = backToCakeBtn.cloneNode(true);
            backToCakeBtn.parentNode.replaceChild(newBackBtn, backToCakeBtn);
            
            newBackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Kembali ke lilin...');
                initCandles();
                
                setTimeout(() => {
                    const cakeSection = document.getElementById('cake-section');
                    if (cakeSection) {
                        cakeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
                
                showToast('🕯️ Lilin direset! Tiup lagi ya!', 'info');
            });
        }
    }

    // ===== START LISTENING =====
    function startListeningForBlow() {
        const flames = document.querySelectorAll('.flame');
        const litCandles = Array.from(flames).filter(flame => 
            !flame.classList.contains('blown')
        );
        candlesLit = litCandles.length;
        
        if (candlesLit === 0 || !isMicActive || isListening) return;
        
        isListening = true;
        const blowButton = document.getElementById('blow-button');
        if (blowButton) {
            blowButton.disabled = true;
            blowButton.classList.add('blowing');
            blowButton.innerHTML = '<i class="fas fa-volume-up"></i> Dengarkan dan TIUP sekarang...';
        }
        
        const blowInstruction = document.getElementById('blow-instruction');
        if (blowInstruction) {
            blowInstruction.style.display = 'flex';
        }
        
        const micStatus = document.getElementById('mic-status');
        if (micStatus) micStatus.style.display = 'none';
        
        const blowResult = document.getElementById('blow-result');
        if (blowResult) blowResult.style.display = 'none';
        
        flames.forEach(flame => {
            if (!flame.classList.contains('blown')) {
                flame.classList.add('listening');
                flame.style.animation = 'listeningFlame 0.6s infinite alternate';
                flame.style.boxShadow = '0 0 25px #ffcc00, 0 0 50px #ffcc00';
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
                    
                    const blowBtn = document.getElementById('blow-button');
                    if (blowBtn) {
                        blowBtn.disabled = false;
                        blowBtn.classList.remove('blowing');
                        blowBtn.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Lilin Berikutnya';
                    }
                    
                    const blowInstruction = document.getElementById('blow-instruction');
                    if (blowInstruction) blowInstruction.style.display = 'none';
                    
                    const blowResult = document.getElementById('blow-result');
                    if (blowResult) {
                        blowResult.style.display = 'flex';
                        document.getElementById('result-text').textContent = 'Sukses! Lilin padam! 🔥';
                    }
                    
                    flames.forEach(flame => {
                        flame.classList.remove('listening');
                        flame.style.animation = '';
                        flame.style.boxShadow = 'none';
                    });
                    
                    setTimeout(() => {
                        if (blowResult) blowResult.style.display = 'none';
                        const micStatus = document.getElementById('mic-status');
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
                
                const blowBtn = document.getElementById('blow-button');
                if (blowBtn) {
                    blowBtn.disabled = false;
                    blowBtn.classList.remove('blowing');
                    blowBtn.innerHTML = '<i class="fas fa-wind"></i> TEKAN & TIUP untuk Mematikan Lilin';
                }
                
                const blowInstruction = document.getElementById('blow-instruction');
                if (blowInstruction) blowInstruction.style.display = 'none';
                
                const blowResult = document.getElementById('blow-result');
                if (blowResult) {
                    blowResult.style.display = 'flex';
                    document.getElementById('result-text').textContent = 'Tidak ada tiupan terdeteksi. Coba lagi!';
                }
                
                flames.forEach(flame => {
                    flame.classList.remove('listening');
                    flame.style.animation = '';
                    flame.style.boxShadow = 'none';
                });
                
                setTimeout(() => {
                    if (blowResult) blowResult.style.display = 'none';
                    const micStatus = document.getElementById('mic-status');
                    if (micStatus) micStatus.style.display = 'flex';
                }, 3000);
            }
        }, 8000);
    }

    // ===== INIT =====
    // Cek apakah lilin sudah padam
    if (localStorage.getItem('candlesBlown') === 'true') {
        const cakeSection = document.getElementById('cake-section');
        const ucapanSection = document.getElementById('ucapan-section');
        const boxesSection = document.getElementById('boxes-section');
        
        if (cakeSection) cakeSection.style.display = 'none';
        if (ucapanSection) {
            ucapanSection.classList.remove('hidden');
            ucapanSection.style.display = 'block';
        }
        if (boxesSection) boxesSection.classList.remove('hidden');
        
        // Setup event listeners
        setTimeout(setupEventListeners, 300);
        return;
    }

    // Inisialisasi lilin
    setTimeout(() => {
        initCandles();
        setupEventListeners();
    }, 300);
});

// ===== TOAST FUNCTION =====
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const bgColor = type === 'error' ? '#ff4444' : type === 'info' ? '#2196F3' : '#25D366';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(toast);
    
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (toast.parentNode === document.body) {
            document.body.removeChild(toast);
        }
    }, 3000);
}