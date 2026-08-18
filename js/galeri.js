// ============================================
// GALAXY 3D - 30 PHOTOS ROTATING
// ============================================

let scene, camera, renderer;
let orbitGroup;
let isRotating = true;
let isInitialized = false;
let raycaster, mouse;
let photoModal = null;
let clickableObjects = [];

// ============================================
// PHOTO DATA - 30 FOTO
// ============================================
const photos = [];
for (let i = 1; i <= 30; i++) {
    photos.push({
        src: `assets/images/gallery/photo${i}.jpeg`,
        title: `Kenangan Indah ${i}`,
        date: `Momen ${i}`
    });
}

// ============================================
// INIT GALAXY
// ============================================
window.initGalaxy = function() {
    if (typeof THREE === 'undefined') {
        console.log('Three.js not loaded yet, retrying...');
        setTimeout(window.initGalaxy, 500);
        return;
    }
    
    if (isInitialized) return;
    
    const container = document.getElementById('galaxy-container');
    if (!container) {
        console.log('Galaxy container not found');
        return;
    }
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    if (width === 0 || height === 0) {
        console.log('Container not ready, retrying...');
        setTimeout(window.initGalaxy, 200);
        return;
    }
    
    console.log('🌟 Initializing Galaxy 3D with 30 photos...');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.008);
    
    // Camera
    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 2, 14);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    // Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Create galaxy
    createGalaxy();
    createStars();
    createPhotos();
    createParticles();
    
    // Animation
    animate();
    
    // Events
    window.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('click', onPhotoClick);
    renderer.domElement.addEventListener('mousemove', onPhotoHover);
    
    const toggleBtn = document.getElementById('toggle-rotation');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleRotation);
    
    isInitialized = true;
    console.log('✨ Galaxy 3D initialized with', photos.length, 'photos!');
};

function createGalaxy() {
    // Lights
    const ambient = new THREE.AmbientLight(0x404070, 0.4);
    scene.add(ambient);
    
    const mainLight = new THREE.DirectionalLight(0xffd700, 1.2);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xff6b9d, 0.6);
    fillLight.position.set(-3, 2, -5);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0x9B59B6, 0.8);
    backLight.position.set(-5, -3, -8);
    scene.add(backLight);
    
    // Orbit rings
    const ringConfigs = [
        { radius: 2.8, color: 0xffd700, opacity: 0.08, tilt: 0 },
        { radius: 3.8, color: 0xff6b9d, opacity: 0.06, tilt: 0.2 },
        { radius: 4.8, color: 0x9B59B6, opacity: 0.05, tilt: -0.15 },
        { radius: 5.8, color: 0x00d4ff, opacity: 0.04, tilt: 0.1 },
        { radius: 7.0, color: 0xffd700, opacity: 0.03, tilt: -0.25 },
    ];
    
    ringConfigs.forEach(config => {
        const ringGeo = new THREE.RingGeometry(config.radius - 0.05, config.radius + 0.05, 80);
        const ringMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.opacity,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + config.tilt;
        ring.rotation.z = config.tilt * 0.5;
        scene.add(ring);
    });
    
    // Orbit group for photos
    orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
}

function createStars() {
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount; i++) {
        const radius = 15 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) {
            color = new THREE.Color(0xffffff);
        } else if (colorChoice < 0.8) {
            color = new THREE.Color(0x88ccff);
        } else if (colorChoice < 0.9) {
            color = new THREE.Color(0xffdd88);
        } else {
            color = new THREE.Color(0xff88aa);
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });
    
    const stars = new THREE.Points(starsGeo, starsMat);
    stars.userData.isStars = true;
    scene.add(stars);
}

function createParticles() {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 2 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        const color = new THREE.Color().setHSL(0.75 + Math.random() * 0.2, 0.6, 0.5 + Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.isParticle = true;
    scene.add(particles);
}

function createPhotos() {
    clickableObjects = [];
    const count = photos.length;
    
    photos.forEach((photo, index) => {
        const t = (index / count) * Math.PI * 8;
        const radius = 2.2 + (index / count) * 5.5;
        const angle = t + (Math.random() - 0.5) * 0.3;
        const heightOffset = (Math.random() - 0.5) * 2.5;
        
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = heightOffset;
        
        const size = 0.5 + Math.random() * 0.5;
        
        const card = createPhotoCard(photo, size, index);
        card.position.set(x, y, z);
        
        card.rotation.x = (Math.random() - 0.5) * 0.2;
        card.rotation.y = (Math.random() - 0.5) * 0.2;
        card.rotation.z = (Math.random() - 0.5) * 0.2;
        
        card.userData = {
            index: index,
            photoData: photo,
            radius: radius,
            angle: angle,
            speed: 0.002 + Math.random() * 0.003,
            heightOffset: heightOffset,
            floatSpeed: 0.001 + Math.random() * 0.002,
            floatPhase: Math.random() * Math.PI * 2,
            originalY: y,
            isHovered: false,
            targetScale: 1,
            currentScale: 1,
            baseSize: size
        };
        
        orbitGroup.add(card);
        clickableObjects.push(card);
    });
    
    orbitGroup.userData.photoObjects = clickableObjects;
}

function createPhotoCard(photo, size, index) {
    const group = new THREE.Group();
    
    const cardWidth = size;
    const cardHeight = size;
    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    
    const textureLoader = new THREE.TextureLoader();
    let texture;
    try {
        texture = textureLoader.load(photo.src);
        texture.anisotropy = 4;
    } catch (e) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        const hue = (index * 20) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${hue + 40}, 70%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📸', 128, 128);
        texture = new THREE.CanvasTexture(canvas);
    }
    
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    const borderSize = 0.06;
    const borderGeo = new THREE.PlaneGeometry(cardWidth + borderSize, cardHeight + borderSize);
    const borderMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.001;
    
    const innerBorderGeo = new THREE.PlaneGeometry(cardWidth + 0.02, cardHeight + 0.02);
    const innerBorderMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
    });
    const innerBorder = new THREE.Mesh(innerBorderGeo, innerBorderMat);
    innerBorder.position.z = 0.001;
    
    group.add(border);
    group.add(mesh);
    group.add(innerBorder);
    
    group.userData.isPhoto = true;
    group.userData.photoData = photo;
    group.userData.index = index;
    
    return group;
}

function onPhotoClick(event) {
    if (!renderer) return;
    
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const photoMeshes = [];
    clickableObjects.forEach(group => {
        group.children.forEach(child => {
            if (child.isMesh && child.material && child.material.map) {
                child.userData.parentGroup = group;
                photoMeshes.push(child);
            }
        });
    });
    
    const intersects = raycaster.intersectObjects(photoMeshes);
    
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const parentGroup = hit.userData.parentGroup;
        if (parentGroup && parentGroup.userData.photoData) {
            showPhotoModal(parentGroup.userData.photoData);
        }
    }
}

function onPhotoHover(event) {
    if (!renderer) return;
    
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    clickableObjects.forEach(group => {
        group.userData.isHovered = false;
        group.userData.targetScale = 1;
    });
    
    const photoMeshes = [];
    clickableObjects.forEach(group => {
        group.children.forEach(child => {
            if (child.isMesh && child.material && child.material.map) {
                child.userData.parentGroup = group;
                photoMeshes.push(child);
            }
        });
    });
    
    const intersects = raycaster.intersectObjects(photoMeshes);
    
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const parentGroup = hit.userData.parentGroup;
        if (parentGroup) {
            parentGroup.userData.isHovered = true;
            parentGroup.userData.targetScale = 1.5;
            renderer.domElement.style.cursor = 'pointer';
        }
    } else {
        renderer.domElement.style.cursor = 'default';
    }
}

function showPhotoModal(photoData) {
    closePhotoModal();
    
    photoModal = document.createElement('div');
    photoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.88);
        backdrop-filter: blur(30px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.4s ease;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        max-width: 550px;
        width: 100%;
        max-height: 90vh;
        background: linear-gradient(145deg, #1a1a3e, #2a1a4e);
        border-radius: 28px;
        padding: 30px;
        border: 1px solid rgba(255, 215, 0, 0.15);
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
        text-align: center;
        animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 20px;
        font-size: 1.6rem;
        color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Poppins', sans-serif;
    `;
    closeBtn.onmouseover = () => {
        closeBtn.style.color = '#FFD700';
        closeBtn.style.background = 'rgba(255, 215, 0, 0.1)';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.color = 'rgba(255, 255, 255, 0.4)';
        closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
    };
    closeBtn.onclick = closePhotoModal;
    content.appendChild(closeBtn);
    
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        position: relative;
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 20px;
        background: rgba(0, 0, 0, 0.3);
        aspect-ratio: 1/1;
    `;
    
    const img = document.createElement('img');
    img.src = photoData.src;
    img.alt = photoData.title || 'Kenangan Indah';
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        border: 2px solid rgba(255, 215, 0, 0.05);
    `;
    imgContainer.appendChild(img);
    content.appendChild(imgContainer);
    
    const title = document.createElement('h3');
    title.textContent = photoData.title || '💕 Kenangan Indah';
    title.style.cssText = `
        font-family: 'Dancing Script', cursive;
        color: #FFD700;
        font-size: 1.8rem;
        margin-bottom: 4px;
    `;
    content.appendChild(title);
    
    if (photoData.date) {
        const date = document.createElement('p');
        date.textContent = `📅 ${photoData.date}`;
        date.style.cssText = `
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.9rem;
            font-family: 'Poppins', sans-serif;
        `;
        content.appendChild(date);
    }
    
    const love = document.createElement('p');
    love.textContent = '❤️ Terima kasih untuk semua momen indah ❤️';
    love.style.cssText = `
        font-family: 'Dancing Script', cursive;
        font-size: 1.2rem;
        color: rgba(255, 107, 157, 0.6);
        margin-top: 8px;
        animation: pulse 2s ease-in-out infinite;
    `;
    content.appendChild(love);
    
    photoModal.appendChild(content);
    document.body.appendChild(photoModal);
    
    photoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePhotoModal();
        }
    });
    
    document.addEventListener('keydown', closePhotoModalOnEsc);
}

function closePhotoModal() {
    if (photoModal) {
        photoModal.remove();
        photoModal = null;
    }
    document.removeEventListener('keydown', closePhotoModalOnEsc);
}

function closePhotoModalOnEsc(e) {
    if (e.key === 'Escape') {
        closePhotoModal();
    }
}

function toggleRotation() {
    isRotating = !isRotating;
    const btn = document.getElementById('toggle-rotation');
    if (btn) {
        btn.innerHTML = isRotating ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (isRotating && orbitGroup) {
        orbitGroup.rotation.y += 0.002;
    }
    
    if (orbitGroup && orbitGroup.userData.photoObjects) {
        orbitGroup.userData.photoObjects.forEach((group) => {
            const data = group.userData;
            if (data) {
                const floatY = Math.sin(time * data.floatSpeed + data.floatPhase) * 0.2;
                group.position.y = data.originalY + floatY;
                
                data.currentScale += (data.targetScale - data.currentScale) * 0.08;
                const s = data.currentScale;
                group.scale.set(s, s, s);
            }
        });
    }
    
    scene.children.forEach(child => {
        if (child.userData && child.userData.isStars) {
            child.rotation.y += 0.00015;
            child.rotation.x += 0.00005;
        }
    });
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onResize() {
    if (!renderer) return;
    const container = document.getElementById('galaxy-container');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes scaleIn {
        from { transform: scale(0.85) translateY(20px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(animationStyles);

// ============================================
// MAIN - MUSIK TETAP NYALA
// ============================================
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

    // ===== INIT GALAXY =====
    if (typeof THREE !== 'undefined') {
        setTimeout(window.initGalaxy, 300);
    } else {
        setTimeout(function() {
            if (typeof THREE !== 'undefined') {
                window.initGalaxy();
            } else {
                console.error('Three.js failed to load!');
            }
        }, 1000);
    }
});