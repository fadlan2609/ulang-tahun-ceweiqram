document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Cek state lilin sudah padam atau belum
    const candlesBlown = localStorage.getItem('candlesBlown') === 'true';

    // Sembunyikan lilin jika sudah padam
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

    // Music control
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('background-music');
    let musicPlaying = false;

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', function() {
            if (musicPlaying) {
                bgMusic.pause();
                musicPlaying = false;
                this.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                bgMusic.play().catch(() => {});
                musicPlaying = true;
                this.innerHTML = '<i class="fas fa-music-slash"></i>';
            }
        });

        setTimeout(() => {
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            }).catch(() => {});
        }, 1000);
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('birthdayLoggedIn');
            localStorage.removeItem('birthdayUsername');
            localStorage.removeItem('candlesBlown');
            window.location.href = 'login.html';
        });
    }

    // Create stars background
    createStars();
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