let targetZoom = 0; 
let currentZoom = 0;
const depthInterval = -400; // Leaves exactly 400px of clean breathing room between portals

function initPortfolio() {
  const spaceContainer = document.getElementById('space-container');
  if (!spaceContainer) return;

  spaceContainer.innerHTML = '';

  portfolioItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'project-item';
    card.dataset.category = item.category;
    
    // Matrix Position Calculation along the deep Z axis hallway
    const calculatedZ = (index * depthInterval) - 500;
    const sideOffset = (index % 3 === 1) ? -16 : (index % 3 === 2 ? 16 : 0);
    const verticalOffset = (index % 2 === 0) ? -4 : 4;

    card.style.setProperty('--tx', `${sideOffset}vw`);
    card.style.setProperty('--ty', `${verticalOffset}vh`);
    card.style.setProperty('--tz', `${calculatedZ}px`);
    card.style.transform = `translate3d(${sideOffset}vw, ${verticalOffset}vh, ${calculatedZ}px)`;

    // 1. Core Project Asset Image Image
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    card.appendChild(img);

    // 2. Immersive Title Label Capsule
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.innerText = item.title;
    card.appendChild(title);

    // NEW: 3. Dynamic Typographic Description Panel
    if (item.description) {
      const descPanel = document.createElement('div');
      descPanel.className = 'project-description-panel';
      descPanel.innerHTML = typeof item.description === 'string' ? item.description : '';
      card.appendChild(descPanel);
    }

    // NEW: 4. Space Environmental Background Glow Backdrop
    const backgroundGlow = document.createElement('div');
    backgroundGlow.className = 'spatial-bg-backdrop';
    // Generates a soft ambient halo tint based on your theme
    backgroundGlow.style.background = `radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)`;
    card.appendChild(backgroundGlow);

    spaceContainer.appendChild(card);

    // --- Absolute Unfailing Redirect Listener ---
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const url = item.redirectUrl;
      if (!url || url === '#') return;

      document.body.style.opacity = 0;
      document.body.style.transition = "opacity 0.35s ease-out";
      
      setTimeout(() => {
        window.location.href = url;
      }, 350);
    });
  });

  animate();
}

// --- CORE SCROLL TRACKING MECHANICS ---
window.addEventListener('wheel', (e) => {
  // Pull elements forward on scroll wheel ticks
  targetZoom += e.deltaY * -1.3;
  
  // Dynamic boundary locks: locks scrolling before the first portal and clips at the final blog node
  const maximumTunnelDepth = Math.abs(portfolioItems.length * depthInterval) + 800;
  targetZoom = Math.min(Math.max(targetZoom, -50), maximumTunnelDepth); 
}, { passive: true });

// Mobile Swiping System Compatibility
let touchStartY = 0;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', (e) => {
  const currentY = e.touches[0].clientY;
  targetZoom += (currentY - touchStartY) * 2.5;
  touchStartY = currentY;
  
  const maximumTunnelDepth = Math.abs(portfolioItems.length * depthInterval) + 800;
  targetZoom = Math.min(Math.max(targetZoom, -50), maximumTunnelDepth);
}, { passive: true });

// --- RENDER MATRIX FRAME ANIMATION LOOP ---
function animate() {
  const spaceContainer = document.getElementById('space-container');
  const introPortal = document.getElementById('intro-portal');
  
  currentZoom += (targetZoom - currentZoom) * 0.08; // LERP equation

  if (spaceContainer) {
    spaceContainer.style.transform = `translate3d(0, 0, ${currentZoom}px)`;
  }

  // Fade out the center rectangle box intro frame as the user scrolls deep into the space
  if (introPortal) {
    const introFadeFraction = Math.max(0, 1 - (currentZoom / 350));
    introPortal.style.opacity = introFadeFraction;
    introPortal.style.transform = `translate3d(-50%, -50%, 0px) scale(${1 + (currentZoom / 1000)})`;
    introPortal.style.pointerEvents = introFadeFraction < 0.1 ? 'none' : 'auto';
  }

  // --- FOCAL DEPTH FIELD PROXIMITY CALCULATOR ---
  const cards = document.querySelectorAll('.project-item');
  cards.forEach((card, index) => {
    const staticZ = (index * depthInterval) - 500;
    const currentRelativeDepth = staticZ + currentZoom;

    if (currentRelativeDepth > 150 || currentRelativeDepth < -1000) {
      // Element is completely behind the viewer lens or buried deep in distant fog canvas layers
      card.style.opacity = 0;
      card.style.pointerEvents = 'none';
    } else {
      // Bring item into clear focus right as it approaches reading range
      const factor = 1 - Math.abs(currentRelativeDepth) / 1000;
      card.style.opacity = Math.max(0, Math.min(1, factor * 1.5));
      
      // Re-enable click fields only if the portal is in clear focus range
      card.style.pointerEvents = currentRelativeDepth < 50 ? 'auto' : 'none';
    }
  });

  requestAnimationFrame(animate);
}

// --- SPARKLE DUST ENGINE ---
window.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.5) {
    const particle = document.createElement('div');
    particle.className = 'sparkle';
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 500);
  }
});

initPortfolio();