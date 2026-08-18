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

        // Auto play jika state true
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

    // ===== BUKA SURAT =====
    const btnBuka = document.getElementById('bukaSuratBtn');
    const suratBody = document.getElementById('suratBody');
    const lines = document.querySelectorAll('.line');

    btnBuka.addEventListener('click', function() {
        suratBody.classList.add('open');
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('show');
            }, 600 + index * 250);
        });
        
        btnBuka.disabled = true;
        btnBuka.innerHTML = '<i class="fas fa-heart"></i> Surat terbuka dengan cinta';
        btnBuka.style.opacity = '0.6';
    });
});