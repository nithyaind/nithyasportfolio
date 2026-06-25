let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;

let targetPanX = 0, targetPanY = 0;
let currentPanX = 0, currentPanY = 0;

let targetZoom = 0; 
let currentZoom = 0;

let isDragging = false;
let previousMouseX = 0, previousMouseY = 0;

// --- 1. Dynamic Element Renderer ---
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

    // Set variable transformation variables safely
    row.style.setProperty('--tx', `${item.x}vw`);
    row.style.setProperty('--ty', `${item.y}vh`);
    row.style.setProperty('--tz', `${item.z}px`);
    row.style.transform = `translate3d(${item.x}vw, ${item.y}vh, ${item.z}px)`;

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

    // Direct redirection execution setup
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = item.redirectUrl;
      }, 400);
    });
  });

  // Start smooth LERP engine rendering frame loops
  animate();
}

// --- 2. Zoom Tracking Matrix (Mouse Wheel Scroll) ---
window.addEventListener('wheel', (e) => {
  targetZoom += e.deltaY * -0.85;
  // Boundary guardrails to lock flight lines safely
  targetZoom = Math.min(Math.max(targetZoom, -1800), 600); 
}, { passive: true });

// --- 3. Drag, Tilt & Pan Camera Controls ---
function startDrag(clientX, clientY) {
  isDragging = true;
  previousMouseX = clientX;
  previousMouseY = clientY;
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