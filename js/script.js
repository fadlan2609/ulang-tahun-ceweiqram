// ===== GLOBAL VARIABLES =====
let musicPlaying = false;
let backgroundMusic;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Website Ulang Tahun - Loading...");
    
    // Initialize music
    initMusic();
    
    // Initialize login page
    initLoginPage();
});

// ===== MUSIC CONTROL =====
function initMusic() {
    backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (musicToggle && backgroundMusic) {
        musicToggle.addEventListener('click', toggleMusic);
        
        setTimeout(() => {
            if (!musicPlaying && backgroundMusic) {
                backgroundMusic.play().then(() => {
                    musicPlaying = true;
                    updateMusicButton();
                }).catch(e => {
                    console.log('Autoplay blocked. User must click to play music.');
                });
            }
        }, 1000);
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (musicPlaying) {
        backgroundMusic.pause();
        musicPlaying = false;
    } else {
        backgroundMusic.play().catch(e => {
            showToast('Silakan klik tombol musik untuk memulai audio.', 'info');
        });
        musicPlaying = true;
    }
    updateMusicButton();
}

function updateMusicButton() {
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        if (musicPlaying) {
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="sr-only">Hentikan musik</span>';
        } else {
            musicToggle.innerHTML = '<i class="fas fa-music-slash"></i><span class="sr-only">Putar musik</span>';
        }
    }
}

// ===== LOGIN PAGE =====
function initLoginPage() {
    console.log("Initializing Login Page...");
    
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('login-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Check credentials - ZHAFIRAH NUR
            if (username === 'zhafnur_12' && password === '12092002') {
                showLoginMessage('Login berhasil! Mengarahkan ke kejutan...', 'success');
                
                localStorage.setItem('birthdayLoggedIn', 'true');
                localStorage.setItem('birthdayUsername', username);
                
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1500);
            } else {
                showLoginMessage('Username atau password salah. Coba lagi!', 'error');
            }
        });
    }
    
    // Check if already logged in
    if (localStorage.getItem('birthdayLoggedIn') === 'true') {
        window.location.href = 'main.html';
    }
}

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = 'message';
        loginMessage.classList.add(type);
        
        setTimeout(() => {
            loginMessage.textContent = '';
            loginMessage.className = 'message';
        }, 3000);
    }
}

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
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'info' ? '#2196F3' : '#25D366'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
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