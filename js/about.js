/* ============================================================
   ABOUT PAGE — interactive bits only
   (the old cinematic scroll-story engine is gone; this page is
   a normal page with two small click interactions)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Equal-parts toggle ── */
  const epBtns = document.querySelectorAll('.ep-btn');
  epBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      epBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ep-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  /* ── Expandable value cards (click to open/close, one at a time) ── */
  document.querySelectorAll('.about-value').forEach(card => {
    card.addEventListener('click', () => {
      const wasOpen = card.classList.contains('open');
      document.querySelectorAll('.about-value.open').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });

});