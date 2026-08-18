document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // ===== AUTO PLAY ANIMASI BUNGA =====
    // Hapus class not-loaded setelah 1 detik untuk memulai animasi
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

    // Buka Gift - tombol hanya untuk efek tambahan (bunga sudah auto play)
    bukaBtn.addEventListener('click', function() {
        bukaBtn.disabled = true;
        bukaBtn.innerHTML = '<i class="fas fa-heart"></i> Bunga mekar untukmu 💐';
        bukaBtn.style.opacity = '0.6';
        
        // Petal jatuh
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
    });

    // Preview
    previewBtn.addEventListener('click', function() {
        const pesan = pesanInput.value.trim() || '💕 (ucapan dari hati)';
        previewContent.textContent = pesan;
        previewBox.classList.remove('hidden');
    });

    // Kirim WhatsApp
    kirimBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const pesan = pesanInput.value.trim();
        if (!pesan) {
            alert('💗 Tulis ucapan terima kasihmu dulu ya!');
            pesanInput.focus();
            return;
        }
        
        const nomor = '6285174105203';
        const text = encodeURIComponent(
            `💗 Hai Iqram! 💗\n\n` +
            `Terima kasih banyak ya udah buatin website ulang tahun yang keren banget untukku! 🥰\n` +
            `Bunga-bunganya juga cantik banget! 🌸\n\n` +
            `${pesan}\n\n` +
            `💕 Dari Zhafirah dengan cinta 💕`
        );
        
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

// Global function for emoji picker
function addEmoji(emoji) {
    const textarea = document.getElementById('pesanUcapan');
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        textarea.value = text.substring(0, start) + emoji + text.substring(end);
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.dispatchEvent(new Event('input'));
    }
}