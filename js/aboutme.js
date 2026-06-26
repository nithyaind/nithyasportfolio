document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.story-section');
  const mediaLayers = document.querySelectorAll('.media-layer');

  // --- 1. Intersection Observer Configuration ---
  const observerOptions = {
    root: null,
    threshold: 0.45, // Fires transitions when roughly half the item becomes visible
    rootMargin: "-10% 0px -10% 0px"
  };

  const narrativeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetSection = entry.target.dataset.section;

        // Toggle Text Card Visibility Animations
        const panel = entry.target.querySelector('.text-panel');
        if (panel) panel.classList.add('visible');

        // Toggle Background Matrix Layers
        mediaLayers.forEach(layer => {
          if (layer.dataset.section === targetSection) {
            layer.classList.add('active');
          } else {
            layer.classList.remove('active');
          }
        });
      } else {
        // Remove text animation layer when scrolled away to facilitate clean re-entry
        const panel = entry.target.querySelector('.text-panel');
        if (panel) panel.classList.remove('visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => narrativeObserver.observe(section));

  // --- 2. Infinite Linear Scroll Progress Bar Tracker ---
  window.addEventListener('scroll', () => {
    const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollableHeight > 0) {
      const globalProgress = (window.scrollY / totalScrollableHeight) * 100;
      const progressBar = document.getElementById('about-progress');
      if (progressBar) progressBar.style.height = `${globalProgress}%`;
    }
  }, { passive: true });
});