/* =========================================
   PORTFOLIO SCRIPTS — main.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL REVEAL ──────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        revealObserver.unobserve(el.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── ACTIVE NAV ─────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath ||
        link.getAttribute('href') === currentPath.replace('.html','')) {
      link.classList.add('active');
    }
  });

  // ── BACK TO TOP ────────────────────────
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── PROJECT HOVER PREVIEW ──────────────
  const preview = document.querySelector('.work-item-preview');
  if (preview) {
    const previewImg = preview.querySelector('img');

    document.querySelectorAll('.work-item[data-preview]').forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        previewImg.src = item.dataset.preview;
        preview.classList.add('visible');
      });

      item.addEventListener('mouseleave', () => {
        preview.classList.remove('visible');
      });

      item.addEventListener('mousemove', (e) => {
        preview.style.left = e.clientX + 'px';
        preview.style.top = e.clientY + 'px';
      });
    });
  }

  // ── SMOOTH INTERNAL LINKS ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── NAV SCROLL STYLE ───────────────────
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.borderBottomColor = window.scrollY > 40
        ? 'rgba(245, 243, 238, 0.12)'
        : 'transparent';
    }, { passive: true });
  }

  // ── COUNT-UP ANIMATION ─────────────────
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));

});