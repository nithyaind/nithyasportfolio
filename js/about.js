/* ============================================================
   ABOUT STORY ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const sections  = document.querySelectorAll('.story-section');
  const bgLayers  = document.querySelectorAll('.bg-layer');
  const dots      = document.querySelectorAll('.chapter-dot');
  const progress  = document.querySelector('.story-progress');
  const scrollCue = document.querySelector('.scroll-cue');

  /* ── SECTION → BACKGROUND MAPPING ── */
  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.dataset.section;

      /* switch background */
      bgLayers.forEach(l => l.classList.remove('active'));
      const target = document.querySelector(`.bg-layer[data-section="${id}"]`);
      if (target) target.classList.add('active');

      /* update dots */
      const chapterIdx = entry.target.dataset.chapter;
      if (chapterIdx !== undefined) {
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.chapter-dot[data-chapter="${chapterIdx}"]`);
        if (dot) dot.classList.add('active');
      }

      /* dark nav for story (all bg-photo sections) */
      const nav = document.querySelector('.site-nav');
      if (nav) nav.classList.add('dark');
    });
  }, { threshold: 0.45 });

  /* ── TEXT FADE IN ── */
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const panel = entry.target.querySelector('.text-panel');
      if (panel) {
        if (entry.isIntersecting) {
          panel.classList.add('visible');
        } else {
          panel.classList.remove('visible');
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => {
    mediaObserver.observe(s);
    textObserver.observe(s);
  });

  /* ── PROGRESS ── */
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progress) progress.style.width = pct + '%';
    if (scrollCue) {
      scrollCue.classList.toggle('hidden', h.scrollTop > 80);
    }
  }, { passive: true });

  /* ── CHAPTER DOTS (click to jump) ── */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const ch    = dot.dataset.chapter;
      const target = document.querySelector(`.story-section[data-chapter="${ch}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    /* tooltip on hover */
    dot.setAttribute('title', dot.dataset.label || '');
  });

  /* ── SCROLL CUE ── */
  const cue = document.querySelector('.scroll-cue');
  if (cue) {
    cue.addEventListener('click', () =>
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    );
  }

  /* ── PARALLAX on bg images (subtle) ── */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.bg-layer.active img, .bg-layer.active video').forEach(el => {
      el.style.transform = `translateY(${scrollY * 0.08}px)`;
    });
  }, { passive: true });

  /* ── PAGE LOAD ── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .8s ease';
  window.addEventListener('load', () => {
    setTimeout(() => { document.body.style.opacity = '1'; }, 60);
  });

});