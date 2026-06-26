let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;

let targetPanX = 0, targetPanY = 0;
let currentPanX = 0, currentPanY = 0;

let targetZoom = 0; 
let currentZoom = 0;

let isDragging = false;
let previousMouseX = 0, previousMouseY = 0;

// --- 1. Dynamic Element Renderer ---
// --- Updated 1. Dynamic Element Renderer & Router Fix ---
function initPortfolio() {
  const spaceContainer = document.getElementById('space-container');
  if (!spaceContainer) return;

  portfolioItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'project-item';
    row.dataset.category = item.category;
    
    if (item.id === "project-archive" || item.id === "about-me") {
      row.classList.add('navigation-node');
    }

    // SPATIAL EXTRA GAP: We multiply your coordinates slightly here to 
    // automatically spread items further apart without breaking data.js
    const gapMultiplierX = 1.3; // Spreads them wider on left/right axes
    const gapMultiplierY = 1.2; // Spreads them wider vertically
    
    const calculatedX = item.x * gapMultiplierX;
    const calculatedY = item.y * gapMultiplierY;

    // Save individual layout coordinates to CSS variables
    row.style.setProperty('--tx', `${calculatedX}vw`);
    row.style.setProperty('--ty', `${calculatedY}vh`);
    row.style.setProperty('--tz', `${item.z}px`);
    row.style.transform = `translate3d(${calculatedX}vw, ${calculatedY}vh, ${item.z}px)`;

    // Asset image node injection
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    
    // Title label node injection
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.innerText = item.title;

    row.appendChild(img);
    row.appendChild(title);
    spaceContainer.appendChild(row);

    // FIX: Explicitly bind target listeners to ensure redirection triggers 
    // regardless of whether user clicks the raw text, padding, or image node
    row.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Determine destination target string safely
      const destination = item.redirectUrl;
      if (!destination || destination === '#') return;

      // Trigger high-end fade out before routing context windows
      document.body.style.opacity = 0;
      document.body.style.transition = "opacity 0.3s ease";
      
      setTimeout(() => {
        window.location.href = destination;
      }, 300);
    });
  });

  // Start smooth rendering frame loops
  animate();
}

function updateDrag(clientX, clientY) {
  if (!isDragging) return;
  const deltaX = clientX - previousMouseX;
  const deltaY = clientY - previousMouseY;

  targetPanX += deltaX * 0.6;
  targetPanY += deltaY * 0.6;

  previousMouseX = clientX;
  previousMouseY = clientY;
}

window.addEventListener('mousedown', (e) => {
  if(e.target.closest('.filter-menu')) return;
  startDrag(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    updateDrag(e.clientX, e.clientY);
  } else {
    // Soft subtle vector orientation tracking tilt when passive
    targetRotationX = (e.clientX / window.innerWidth - 0.5) * 12;
    targetRotationY = (e.clientY / window.innerHeight - 0.5) * -12;
  }
});

window.addEventListener('mouseup', () => isDragging = false);

// Mobile Touch Architecture Wireups
let initialTouchDist = 0;
window.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  } else if (e.touches.length === 2) {
    initialTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    updateDrag(e.touches[0].clientX, e.touches[0].clientY);
  } else if (e.touches.length === 2 && initialTouchDist > 0) {
    const currentDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    targetZoom += (currentDist - initialTouchDist) * 2.5;
    initialTouchDist = currentDist;
  }
}, { passive: true });

window.addEventListener('touchend', () => isDragging = false);

// --- 4. Animation Matrix Engine ---
function animate() {
  const spaceContainer = document.getElementById('space-container');
  
  currentRotationX += (targetRotationX - currentRotationX) * 0.08;
  currentRotationY += (targetRotationY - currentRotationY) * 0.08;
  currentPanX += (targetPanX - currentPanX) * 0.08;
  currentPanY += (targetPanY - currentPanY) * 0.08;
  currentZoom += (targetZoom - currentZoom) * 0.08;

  if (spaceContainer) {
    spaceContainer.style.transform = `
      translate3d(${currentPanX}px, ${currentPanY}px, ${currentZoom}px) 
      rotateX(${currentRotationY}deg) 
      rotateY(${currentRotationX}deg)
    `;
  }
  requestAnimationFrame(animate);
}

// --- 5. Filtering Matrix System ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.filter-btn.active').classList.remove('active');
    e.target.classList.add('active');

    const filterValue = e.target.dataset.filter;
    const items = document.querySelectorAll('.project-item');

    items.forEach(item => {
      if (item.classList.contains('navigation-node')) return;

      if (filterValue === 'all' || item.dataset.category === filterValue) {
        item.classList.remove('dimmed');
      } else {
        item.classList.add('dimmed');
      }
    });
  });
});

// --- 6. Particle Sparkle Trail Engine ---
window.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.35) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    const size = Math.random() * 5 + 3;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }
});

// Launch initialization lifecycle
initPortfolio();