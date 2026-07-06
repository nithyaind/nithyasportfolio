/* ============================================================
   main.js — WORK PAGE ONLY extras
   (cursor, nav, reveal, dateline, back-to-top, and ticker-pause
   are handled globally by js/global.js — do not duplicate them
   here, or event listeners fire twice.)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── WORK HOVER PREVIEW GHOST ──────────────────────────────
  const ghost    = document.querySelector('.work-preview-ghost');
  const ghostImg = ghost?.querySelector('img');

  if (ghost && ghostImg) {
    document.querySelectorAll('[data-preview]').forEach(row => {
      row.addEventListener('mouseenter', () => {
        ghostImg.src = row.dataset.preview;
        ghost.classList.add('visible');
      });
      row.addEventListener('mouseleave', () => ghost.classList.remove('visible'));
      row.addEventListener('mousemove', e => {
        ghost.style.left = e.clientX + 'px';
        ghost.style.top  = e.clientY + 'px';
      });
    });
  }

  // ── COUNT-UP ───────────────────────────────────────────────
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1100;
      const start  = performance.now();
      const tick   = now => {
        const t = Math.min((now - start) / dur, 1);
        const v = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(v * target);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

  // ── CARD TILT EFFECT (subtle 3D on mouse move) ────────────
  document.querySelectorAll('.card, .archive-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
