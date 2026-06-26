document.addEventListener('DOMContentLoaded', () => {
  const textStream = document.getElementById('text-stream-container');
  const stage = document.getElementById('scrapbook-stage');
  const nodeTrack = document.getElementById('timeline-nodes');

  // --- 1. THE WHIMSICAL COLLAGE COMPILER ---
  blogEntries.forEach((entry, index) => {
    // A. Generate Text Flow Item
    const card = document.createElement('article');
    card.className = 'blog-entry-card';
    card.id = entry.id;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="post-meta">${entry.date} // ${entry.category.toUpperCase()}</div>
      <h1 class="post-title">${entry.title}</h1>
      <div class="post-body">${entry.text}</div>
    `;
    textStream.appendChild(card);

    // B. Build Timeline Node Dots
    const node = document.createElement('div');
    node.className = `t-node ${index === 0 ? 'active-node' : ''}`;
    node.dataset.target = entry.id;
    node.innerHTML = `
      <div class="node-dot"></div>
      <span class="node-label">${entry.date}</span>
    `;
    node.addEventListener('click', () => {
      document.getElementById(entry.id).scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    nodeTrack.appendChild(node);

    // C. Assemble & Stagger Whimsical Scrap Elements
    entry.media.forEach((item) => {
      const pieceWrapper = document.createElement('div');
      pieceWrapper.className = `scrapbook-piece item-from-${entry.id}`;

      // Manufacture specific HTML structures based on the whimsical asset type
      if (item.type === "polaroid") {
        pieceWrapper.classList.add('piece-polaroid');
        pieceWrapper.innerHTML = `
          <img src="${item.src}" alt="scrapbook photo">
          <div class="polaroid-caption">${item.caption || ''}</div>
        `;
      } else if (item.type === "video-scrap") {
        pieceWrapper.classList.add('piece-polaroid');
        pieceWrapper.innerHTML = `
          <video autoplay muted loop playsinline src="${item.src}"></video>
          <div class="polaroid-caption">motion snippet</div>
        `;
      } else if (item.type === "sticker" || item.type === "tape") {
        pieceWrapper.classList.add(`piece-${item.type}`);
        const img = document.createElement('img');
        img.src = item.src;
        pieceWrapper.appendChild(img);
      } else if (item.type === "paper-note") {
        pieceWrapper.classList.add('piece-note');
        pieceWrapper.innerHTML = `<p>${item.text}</p>`;
      }

      // --- RANDOMIZED POSITION GENERATOR ---
      // Spread items whimsically all across the right half of the viewport canvas grid
      const randomX = Math.floor(Math.random() * 55 + 20) + "%";
      const randomY = Math.floor(Math.random() * 50 + 25) + "%";
      
      // Random rotations for a chaotic, non-grid feel
      const finalRotation = (Math.random() * 36 - 18) + "deg";
      const fallingStartRotation = (Math.random() * 90 - 45) + "deg"; // Rotation in the air before landing
      
      // Slight scale variations so stickers look small and notes/polaroids look prominent
      const baseScale = item.type === "sticker" ? 0.9 : (item.type === "tape" ? 1.1 : 1.0);
      const subtleScaleVariation = baseScale + (Math.random() * 0.15 - 0.07);

      pieceWrapper.style.setProperty('--x', randomX);
      pieceWrapper.style.setProperty('--y', randomY);
      pieceWrapper.style.setProperty('--rot', finalRotation);
      pieceWrapper.style.setProperty('--start-rot', fallingStartRotation);
      pieceWrapper.style.setProperty('--scale', subtleScaleVariation);

      stage.appendChild(pieceWrapper);
    });
  });

  // --- 2. TRANSITION DETECTOR (THE COLLAGE DROP MECHANIC) ---
  const trackingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const postId = entry.target.id;
      const connectedPieces = document.querySelectorAll(`.item-from-${postId}`);
      const connectedNode = document.querySelector(`.t-node[data-target="${postId}"]`);

      if (entry.isIntersecting) {
        entry.target.classList.add('active-post');
        
        // Items drop and rotate smoothly into place
        connectedPieces.forEach((piece, index) => {
          setTimeout(() => {
            piece.classList.add('scattered');
          }, index * 80); // Micro-delay between items for a natural cascading look
        });
        
        document.querySelectorAll('.t-node').forEach(n => n.classList.remove('active-node'));
        if (connectedNode) connectedNode.classList.add('active-node');
      } else {
        entry.target.classList.remove('active-post');
        // Items fly back off the page cleanly when you scroll away
        connectedPieces.forEach(piece => piece.classList.remove('scattered'));
      }
    });
  }, { threshold: 0.35, rootMargin: "-5% 0px -5% 0px" });

  document.querySelectorAll('.blog-entry-card').forEach(card => trackingObserver.observe(card));

  // --- 3. TIMELINE SCROLL BAR FILLER ---
  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollMax > 0) {
      const percentage = (window.scrollY / scrollMax) * 100;
      const filler = document.getElementById('timeline-progress');
      if (filler) filler.style.height = `${percentage}%`;
    }
  }, { passive: true });
});