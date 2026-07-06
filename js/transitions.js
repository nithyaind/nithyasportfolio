/**
 * transitions.js
 * ──────────────────────────────────────────────────────────────
 * Immersive page-transition system for nithyasportfolio.
 *
 * Effects included:
 *  1. Page-enter curtain   — two panels wipe away on load (top+bottom or left+right)
 *  2. Page-exit curtain    — panels slam closed before navigating away
 *  3. Link image morph     — hovered project image "flies" to fill the screen on click
 *  4. Hero text scramble   — letters scramble-in on page load
 *  5. Parallax scroll      — hero images drift on scroll
 *  6. Magnetic nav links   — links subtly pull toward cursor
 *
 * Usage: <script src="js/transitions.js"></script>
 * Include AFTER global.js on every page. No dependencies.
 */

(function () {
  'use strict';

  /* ── 0. Respect reduced-motion ───────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Build the curtain overlay ────────────────────────── */
  function buildCurtain() {
    if (document.getElementById('pg-curtain')) return;

    const curtain = document.createElement('div');
    curtain.id = 'pg-curtain';
    curtain.innerHTML = `
      <div class="pg-panel pg-panel-a"></div>
      <div class="pg-panel pg-panel-b"></div>
    `;
    document.body.appendChild(curtain);
  }

  /* ── 2. Enter animation (curtains part on load) ──────────── */
  function pageEnter() {
    if (prefersReduced) return;
    buildCurtain();
    const curtain = document.getElementById('pg-curtain');
    curtain.classList.add('is-entering');

    // Allow paint, then trigger open
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.classList.add('is-open');
        document.body.classList.add('pg-ready'); // reveals body content
        setTimeout(() => curtain.classList.add('is-done'), 900);
      });
    });
  }

  /* ── 3. Exit animation (curtains close, then navigate) ───── */
  function pageExit(href) {
    if (prefersReduced) {
      window.location.href = href;
      return;
    }
    buildCurtain();
    const curtain = document.getElementById('pg-curtain');
    curtain.classList.remove('is-done', 'is-open');
    curtain.classList.add('is-exiting');

    setTimeout(() => {
      window.location.href = href;
    }, 600);
  }

  /* ── 4. Intercept internal link clicks ───────────────────── */
  function interceptLinks() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');

      // Skip: external, anchor-only, mailto, tel, javascript:
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        link.hostname !== window.location.hostname ||
        link.target === '_blank'
      ) return;

      e.preventDefault();
      pageExit(href);
    });
  }

  /* ── 5. Image morph on work-row / card hover+click ───────── */
  function buildMorphLayer() {
    if (document.getElementById('pg-morph')) return;
    const el = document.createElement('div');
    el.id = 'pg-morph';
    el.innerHTML = '<img id="pg-morph-img" src="" alt="" />';
    document.body.appendChild(el);
  }

  function morphImage(imgSrc, originRect, href) {
    if (prefersReduced || !imgSrc) {
      pageExit(href);
      return;
    }

    buildMorphLayer();
    const morph    = document.getElementById('pg-morph');
    const morphImg = document.getElementById('pg-morph-img');

    // Start from the hovered element's bounding box
    morph.style.cssText = `
      position: fixed;
      top:    ${originRect.top}px;
      left:   ${originRect.left}px;
      width:  ${originRect.width}px;
      height: ${originRect.height}px;
      z-index: 9999;
      overflow: hidden;
      pointer-events: none;
      transition: top .55s cubic-bezier(.77,0,.18,1),
                  left .55s cubic-bezier(.77,0,.18,1),
                  width .55s cubic-bezier(.77,0,.18,1),
                  height .55s cubic-bezier(.77,0,.18,1),
                  opacity .3s ease .5s;
      opacity: 1;
    `;
    morphImg.src = imgSrc;
    morphImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';

    // Animate to full-screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        morph.style.top    = '0px';
        morph.style.left   = '0px';
        morph.style.width  = '100vw';
        morph.style.height = '100vh';

        setTimeout(() => {
          morph.style.opacity = '0';
          pageExit(href);
        }, 500);
      });
    });
  }

  /* ── 6. Hero text scramble ───────────────────────────────── */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function scramble(el, finalText, duration) {
    if (prefersReduced) { el.textContent = finalText; return; }
    let frame = 0;
    const frames = Math.round((duration / 1000) * 60);
    const interval = setInterval(() => {
      el.textContent = finalText
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < Math.floor((frame / frames) * finalText.length)) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      frame++;
      if (frame >= frames) {
        clearInterval(interval);
        el.textContent = finalText;
      }
    }, 1000 / 60);
  }

  function initScramble() {
    const hero = document.querySelector('.hero-name');
    if (!hero) return;
    const lines = hero.querySelectorAll('.name-line');
    lines.forEach((line, i) => {
      const text = line.textContent.trim();
      line.textContent = text; // preserve
      setTimeout(() => scramble(line, text, 900), 300 + i * 200);
    });
  }

  /* ── 7. Parallax on hero / section images ────────────────── */
  function initParallax() {
    if (prefersReduced) return;

    const targets = document.querySelectorAll(
      '.hero, .card img, .identity-portrait img, .gallery-item img'
    );
    if (!targets.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        targets.forEach(el => {
          const rect = el.closest('[class]')?.getBoundingClientRect();
          if (!rect) return;
          const center = rect.top + rect.height / 2;
          const offset = (center - window.innerHeight / 2) * 0.06;
          el.style.transform = `translateY(${offset}px) scale(1.04)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 8. Magnetic nav links ───────────────────────────────── */
  function initMagneticLinks() {
    if (prefersReduced) return;
    document.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('mousemove', e => {
        const rect = link.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * 0.2;
        const dy   = (e.clientY - cy) * 0.2;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
    });
  }

  /* ── 9. Wire up project-row / card click → morph exit ────── */
  function initMorphLinks() {
    // Work cards on index.html
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', e => {
        const href = card.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
        e.preventDefault();
        const img  = card.querySelector('img');
        const src  = img ? img.src : null;
        const rect = card.getBoundingClientRect();
        morphImage(src, rect, href);
      });
    });

    // Project rows on archive.html (data-preview holds image src)
    document.querySelectorAll('.project-row').forEach(row => {
      row.addEventListener('click', e => {
        // Only morph when clicking the "View" link cell, not toggling expand
        const viewLink = e.target.closest('.project-row-link');
        if (!viewLink) return;
        e.stopPropagation();
        const href = viewLink.getAttribute('data-href') || viewLink.onclick?.toString().match(/'([^']+)'/)?.[1];
        if (!href) return;
        const src  = row.dataset.preview || null;
        const rect = row.getBoundingClientRect();
        morphImage(src, rect, href);
      });
    });
  }

  /* ── 10. Scroll-triggered section reveals (enhance existing) */
  function initReveal() {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
  }

  /* ── Init ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    pageEnter();
    interceptLinks();
    initScramble();
    initParallax();
    initMagneticLinks();
    initMorphLinks();
    initReveal();
  });

  // Handle back/forward browser navigation (bfcache)
  window.addEventListener('pageshow', e => {
    if (e.persisted) pageEnter();
  });

})();