document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // ===== MUSIC CONTROL - TETAP NYALA =====
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('background-music');
    let musicPlaying = false;

    // Cek state musik dari localStorage
    const musicState = localStorage.getItem('musicPlaying');
    if (musicState === 'true') {
        musicPlaying = true;
    }

    if (musicToggle && bgMusic) {
        // Update tombol sesuai state
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

        // Auto play musik (tetap nyala)
        if (musicPlaying) {
            bgMusic.play().catch(() => {});
        } else {
            // Jika belum pernah di set, mulai auto play
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
                localStorage.setItem('musicPlaying', 'true');
            }).catch(() => {
                // User harus klik manual jika autoplay diblokir
                console.log('Autoplay blocked, user must click to play');
            });
        }
    }

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('birthdayLoggedIn');
            localStorage.removeItem('birthdayUsername');
            localStorage.removeItem('musicPlaying');
            localStorage.removeItem('candlesBlown');
            window.location.href = 'login.html';
        });
    }

    // ===== STARS BACKGROUND =====
    createStars();

    // ===== CEK STATE LILIN =====
    const candlesBlown = localStorage.getItem('candlesBlown') === 'true';
    const cakeSection = document.getElementById('cake-section');
    const ucapanSection = document.getElementById('ucapan-section');
    const boxesSection = document.getElementById('boxes-section');

    if (candlesBlown) {
        if (cakeSection) cakeSection.style.display = 'none';
        if (ucapanSection) ucapanSection.classList.add('hidden');
        if (boxesSection) boxesSection.classList.remove('hidden');
    }

    // Jika ada hash #boxes-section, scroll ke boxes
    if (window.location.hash === '#boxes-section') {
        setTimeout(function() {
            if (boxesSection) {
                boxesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 500);
    }

    // ===== HOVER EFFECT BOXES =====
    const boxes = document.querySelectorAll('.box-card');
    boxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
});

function createStars() {
    const container = document.getElementById('starsBg');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (2 + Math.random() * 3) + 's';
        star.style.width = (1 + Math.random() * 3) + 'px';
        star.style.height = star.style.width;
        container.appendChild(star);
    }
}