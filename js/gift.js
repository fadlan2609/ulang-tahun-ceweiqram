document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // ===== MUSIK TETAP NYALA =====
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('background-music');
    let musicPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (musicToggle && bgMusic) {
        if (musicPlaying) {
            musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
        } else {
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }

        musicToggle.addEventListener('click', function() {
            if (musicPlaying) {
                bgMusic.pause();
                musicPlaying = false;
                this.innerHTML = '<i class="fas fa-music"></i>';
                localStorage.setItem('musicPlaying', 'false');
            } else {
                bgMusic.play().catch(() => {});
                musicPlaying = true;
                this.innerHTML = '<i class="fas fa-music-slash"></i>';
                localStorage.setItem('musicPlaying', 'true');
            }
        });

        if (musicPlaying) {
            bgMusic.play().catch(() => {});
        }
    }

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('birthdayLoggedIn');
            localStorage.removeItem('birthdayUsername');
            localStorage.removeItem('musicPlaying');
            window.location.href = 'login.html';
        });
    }

    // ===== AUTO PLAY ANIMASI BUNGA =====
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
    }, 1000);

    // ===== ELEMEN =====
    const bukaBtn = document.getElementById('bukaGiftBtn');
    const previewBtn = document.getElementById('previewBtn');
    const kirimBtn = document.getElementById('kirimBtn');
    const pesanInput = document.getElementById('pesanUcapan');
    const previewBox = document.getElementById('previewBox');
    const previewContent = document.getElementById('previewContent');
    const charCount = document.getElementById('charCount');
    const statusMessage = document.getElementById('statusMessage');

    // Buat elemen status pengiriman jika belum ada
    let sendStatus = document.querySelector('.send-status');
    if (!sendStatus) {
        sendStatus = document.createElement('div');
        sendStatus.className = 'send-status';
        sendStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Pesan terkirim!</span>';
        const giftCard = document.querySelector('.gift-card');
        if (giftCard) {
            giftCard.appendChild(sendStatus);
        }
    }

    // Character counter
    if (pesanInput && charCount) {
        pesanInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            if (length > 450) {
                charCount.style.color = '#ff6b6b';
            } else {
                charCount.style.color = 'rgba(255,255,255,0.3)';
            }
        });
    }

    // ===== BUKA BUKET BUNGA + KIRIM WA OTOMATIS =====
    bukaBtn.addEventListener('click', function() {
        bukaBtn.disabled = true;
        bukaBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const petal = document.createElement('div');
                const colors = ['#ff6b9d', '#ff4757', '#ff7fae', '#ffb3c6', '#ff9ff3', '#fdcb6e', '#f368e0'];
                petal.style.cssText = `
                    position: fixed;
                    width: ${12 + Math.random() * 10}px;
                    height: ${12 + Math.random() * 10}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50% 0 50% 50%;
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    pointer-events: none;
                    animation: petalFallGift ${3 + Math.random() * 3}s linear forwards;
                    z-index: 999;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                document.body.appendChild(petal);
                setTimeout(() => petal.remove(), 6000);
            }, i * 100);
        }

        const nomor = '6282147774953';
        const pesan = 'Pesanan atas nama Zhafirah Nur sudah boleh dikirim sekarang ya, saya sudah dirumah, Terimakasih';
        const text = encodeURIComponent(pesan);
        
        setTimeout(() => {
            try {
                window.open(`https://wa.me/${nomor}?text=${text}`, '_blank');
                
                bukaBtn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
                bukaBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                
                sendStatus.className = 'send-status show success';
                sendStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Pesan berhasil dikirim ke WhatsApp!</span>';
                
                setTimeout(() => {
                    sendStatus.className = 'send-status';
                }, 5000);
                
            } catch (error) {
                console.error('Error opening WhatsApp:', error);
                bukaBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal, coba lagi';
                bukaBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                
                sendStatus.className = 'send-status show error';
                sendStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Gagal membuka WhatsApp. Coba manual!</span>';
                
                setTimeout(() => {
                    bukaBtn.disabled = false;
                    bukaBtn.innerHTML = '<i class="fas fa-gift"></i> Buka Buket Bunga';
                    bukaBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff4757)';
                    sendStatus.className = 'send-status';
                }, 3000);
            }
        }, 800);
    });

    // ===== PREVIEW =====
    previewBtn.addEventListener('click', function() {
        const pesan = pesanInput.value.trim() || '(ucapan dari hati)';
        previewContent.textContent = pesan;
        previewBox.classList.remove('hidden');
    });

    // ===== KIRIM UCAPAN DENGAN NAMA PENGIRIM =====
    kirimBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const pesan = pesanInput.value.trim();
        if (!pesan) {
            alert('Tulis ucapan terima kasihmu dulu ya!');
            pesanInput.focus();
            return;
        }
        
        const nomor = '6285174105203';
        
        // Ambil nama pengirim dari input
        const pengirim = document.getElementById('pengirim').value || 'Zhafirah Nur';
        
        // Kirim pesan + nama pengirim di akhir
        const text = encodeURIComponent(pesan + '\n\n- ' + pengirim);
        
        window.open(`https://wa.me/${nomor}?text=${text}`, '_blank');
        
        statusMessage.classList.remove('hidden');
        kirimBtn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
        kirimBtn.style.opacity = '0.6';
        kirimBtn.disabled = true;
        
        setTimeout(() => {
            kirimBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Kirim ke WhatsApp';
            kirimBtn.style.opacity = '1';
            kirimBtn.disabled = false;
        }, 5000);
    });
});