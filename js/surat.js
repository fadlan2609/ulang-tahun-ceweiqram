document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('birthdayLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

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