document.addEventListener('DOMContentLoaded', () => {
  const textStream = document.getElementById('text-stream-container');
  const stage = document.getElementById('scrapbook-stage');
  const nodeTrack = document.getElementById('timeline-nodes');

  // --- 1. GENERATE DYNAMIC MARKUP FROM CONTENT ARRAY ---
  blogEntries.forEach((entry, index) => {
    // A. Generate Text Block Column Cards
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

    // B. Generate Architectural Sideline Timeline Nodes
    const node = document.createElement('div');
    node.className = `t-node ${index === 0 ? 'active-node' : ''}`;
    node.dataset.target = entry.id;
    node.innerHTML = `
      <div class="node-dot"></div>
      <span class="node-label">${entry.date}</span>
    `;
    
    // Wire up smooth scrolling directly to timeline node clicks
    node.addEventListener('click', () => {
      document.getElementById(entry.id).scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    nodeTrack.appendChild(node);

    // C. Pre-render Scrapbook Media Nodes directly into the Stage canvas
    entry.media.forEach((file, fIndex) => {
      let element;
      if (file.type === "video") {
        element = document.createElement('video');
        element.src = file.src;
        element.autoplay = true;
        element.muted = true;
        element.loop = true;
        element.setAttribute('playsinline', '');
      } else {
        element = document.createElement('img');
        element.src = file.src;
      }
      
      element.className = `scrapbook-piece item-from-${entry.id}`;
      
      // Calculate layout coordinates ahead of time so items throw randomly across the right sector
      // Generates horizontal positions clustered around the central grid workspace
      const xCoord = Math.floor(Math.random() * 40 + 30) + "%";
      const yCoord = Math.floor(Math.random() * 40 + 30) + "%";
      const rotationDeg = (Math.random() * 30 - 15) + "deg";
      // Subtle layered opacity differences for depth texturing
      const opacityScale = (Math.random() * 0.15 + 0.85);

      element.style.setProperty('--x', xCoord);
      element.style.setProperty('--y', yCoord);
      element.style.setProperty('--rot', rotationDeg);
      element.style.setProperty('--target-opacity', opacityScale);

      stage.appendChild(element);
    });
  });

  // --- 2. INTERSECTION TRACKING & ANIMATION SCATTER FLIGHTS ---
  const trackingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const postId = entry.target.id;
      const index = entry.target.dataset.index;
      const connectedPieces = document.querySelectorAll(`.item-from-${postId}`);
      const connectedNode = document.querySelector(`.t-node[data-target="${postId}"]`);

      if (entry.isIntersecting) {
        entry.target.classList.add('active-post');
        
        // Throw the media items onto the stage layout structure
        connectedPieces.forEach(piece => piece.classList.add('scattered'));
        
        // Sync active styles to matching timeline side tracker dots
        document.querySelectorAll('.t-node').forEach(n => n.classList.remove('active-node'));
        if (connectedNode) connectedNode.classList.add('active-node');
      } else {
        entry.target.classList.remove('active-post');
        // Retrieve pieces smoothly back into hidden storage when scrolled past
        connectedPieces.forEach(piece => piece.classList.remove('scattered'));
      }
    });
  }, { threshold: 0.4, rootMargin: "-10% 0px -10% 0px" });

  document.querySelectorAll('.blog-entry-card').forEach(card => trackingObserver.observe(card));

  // --- 3. TIMELINE SCROLL BAR COUNTER FILLER ---
  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollMax > 0) {
      const percentage = (window.scrollY / scrollMax) * 100;
      const filler = document.getElementById('timeline-progress');
      if (filler) filler.style.height = `${percentage}%`;
    }
  }, { passive: true });
});