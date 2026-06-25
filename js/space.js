let lastMouseX = 0;
let lastMouseY = 0;
let activeImages = [];
const distanceThreshold = 75; 

// --- 1. Dynamic Project Row Generator ---
function initPortfolio() {
  // Variables declared inside execution scope to guarantee DOM readiness
  const projectContainer = document.getElementById('project-list-container');
  const canvas = document.getElementById('scrapbook-canvas');

  // Runtime Safety Guardrail
  if (!projectContainer || !canvas) {
    console.error("Initialization Failed: Required HTML containers ('project-list-container' or 'scrapbook-canvas') were not found in the DOM.");
    return;
  }

  portfolioItems.forEach(item => {
    // Generate row markup wrapper
    const row = document.createElement('div');
    row.className = 'project-item';
    row.dataset.category = item.category;
    
    // Flag navigational portals distinctly
    if (item.id === "project-archive" || item.id === "about-me") {
      row.classList.add('navigation-node');
    }

    // Build internal layout components
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.innerText = item.title;

    const meta = document.createElement('span');
    meta.className = 'project-category';
    
    // Assign clean text tags
    const labelPrefix = (item.id === "project-archive" || item.id === "about-me") ? "Index" : item.category;
    meta.innerText = `${labelPrefix} // ${item.id.toUpperCase()}`;

    row.appendChild(title);
    row.appendChild(meta);
    projectContainer.appendChild(row);

    // --- 2. Interactive Scrapbook Loop (Using item.src) ---
    row.addEventListener('mousemove', (e) => {
      const distance = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);

      if (distance > distanceThreshold) {
        // Spawns the main project image along the cursor path
        spawnScrapbookImage(canvas, item.src, e.clientX, e.clientY);
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    row.addEventListener('mouseleave', () => {
      clearScrapbookCanvas();
    });

    // --- 3. Dynamic Router Configuration ---
    row.addEventListener('click', () => {
      document.body.style.opacity = 0;
      
      setTimeout(() => {
        if (item.actionType === "page" || item.id === "project-archive" || item.id === "about-me") {
          window.location.href = item.redirectUrl;
        } else {
          // Fallback if you add panel templates later
          window.location.href = item.redirectUrl || '#';
        }
      }, 400);
    });
  });
}

// --- 4. Scrapbook Spawning Engine ---
function spawnScrapbookImage(canvasElement, src, x, y) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'scrapbook-img';
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  // Randomize rotation to create that beautiful hand-tossed look
  const randomRotation = (Math.random() * 20 - 10) + 'deg';
  img.style.setProperty('--random-rotation', randomRotation);

  canvasElement.appendChild(img);
  activeImages.push(img);

  // Keep max stack to 8 to prevent browser performance bottlenecks
  if (activeImages.length > 8) {
    const oldestImg = activeImages.shift();
    oldestImg.classList.add('fade-out');
    setTimeout(() => oldestImg.remove(), 400);
  }
}

function clearScrapbookCanvas() {
  activeImages.forEach(img => {
    img.classList.add('fade-out');
    setTimeout(() => img.remove(), 400);
  });
  activeImages = [];
}

// --- 5. Categorical Filtering Framework ---
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

// --- 6. Sparkle Particle Cursor Engine ---
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

// Initialize Ecosystem
initPortfolio();