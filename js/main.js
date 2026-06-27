/* ============================================================
   NITHYA SUNKARA INDLAMURI — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ────────────────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Smooth ring lag
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Grow on hover
    const hoverEls = document.querySelectorAll('a, button, .card, .work-row, .archive-card, .nijam-card, .filter-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // ── SCROLL REVEAL ────────────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── ACTIVE NAV ───────────────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
    // Special magenta for Nijam
    if (href === 'nijam.html' && path === 'nijam.html') {
      a.classList.remove('active');
      a.classList.add('active-magenta');
    }
  });

  // ── DATELINE ─────────────────────────────────────────────
  const dateline = document.querySelector('.nav-dateline');
  if (dateline) {
    const now  = new Date();
    const opts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateline.textContent = now.toLocaleDateString('en-US', opts).toUpperCase();
  }

  // ── WORK/ARCHIVE HOVER PREVIEW ───────────────────────────
  const ghost    = document.querySelector('.work-preview-ghost');
  const ghostImg = ghost?.querySelector('img');

  if (ghost && ghostImg) {
    document.querySelectorAll('[data-preview]').forEach(row => {
      row.addEventListener('mouseenter', e => {
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

  // ── NIJAM FILTER BUTTONS ──────────────────────────────────
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const storyItems   = document.querySelectorAll('[data-tag]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = btn.dataset.filter;
      storyItems.forEach(item => {
        if (tag === 'all' || item.dataset.tag === tag) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ── COUNT-UP ─────────────────────────────────────────────
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

  // ── BACK TO TOP ──────────────────────────────────────────
  document.querySelectorAll('.back-to-top').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── TILT EFFECT on cards (subtle, whimsical) ─────────────
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

  // ── MARQUEE pause on hover ────────────────────────────────
  document.querySelectorAll('.ticker-track').forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

});