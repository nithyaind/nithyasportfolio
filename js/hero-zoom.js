/**
 * hero-zoom.js
 * ──────────────────────────────────────────────────────────────
 * Scroll-scrubbed landing hero for index.html.
 *
 *   0%        scattered work thumbnails at rest, no text visible
 *   0–50%     tiles spiral inward toward center + fade out, while
 *             the headline builds in word by word, then fades
 *   35–85%    the .scatter-hero image scales up to fill the screen
 *   70–100%   the fixed nav fades in, then the name overlay fades in
 *
 * Degrades safely: if prefers-reduced-motion is on, or if the
 * hero markup isn't present, or if anything throws, we fall back
 * to a plain static hero with the nav always visible — never a
 * half-animated or blank page.
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('landing-hero');
    if (!section) return;

    const heroImg        = document.getElementById('scatter-hero');
    const overlay        = section.querySelector('.scatter-hero-overlay');
    const headline       = document.getElementById('landing-headline');
    const headlineText   = document.getElementById('landing-headline-text');
    const nameOverlay    = document.getElementById('landing-name');
    const scatterItems   = Array.from(section.querySelectorAll('.scatter-item:not(.scatter-hero)'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Words revealed one at a time as you scroll — {t, em} so the
       italic/orange word(s) stay styled the same way. Edit this
       array (not the HTML) to change the headline copy. */
    const HEADLINE_WORDS = [
      { t: 'Two' }, { t: 'truths' }, { t: 'and' }, { t: 'a' },
      { t: 'lie' },
    ];

    function staticFallback() {
      section.classList.add('static-fallback');
      if (nameOverlay) nameOverlay.classList.add('visible');
      document.body.classList.remove('hero-nav-hidden');
    }

    if (prefersReduced || !heroImg) {
      staticFallback();
      return;
    }

    try {
      // Precompute each tile's polar coordinates relative to center,
      // so we can spiral it inward (shrinking radius + rotating angle)
      // purely by moving its own left/top — no per-tile CSS rotation.
      const tiles = scatterItems.map((el, i) => {
        const sx = parseFloat(getComputedStyle(el).getPropertyValue('--sx')) || 50;
        const sy = parseFloat(getComputedStyle(el).getPropertyValue('--sy')) || 50;
        const dx = sx - 50, dy = sy - 50;
        return {
          el,
          baseAngle: Math.atan2(dy, dx),
          baseRadius: Math.hypot(dx, dy),
          delay: i * 0.05, // stagger so tiles don't all move in lockstep
        };
      });

      document.body.classList.add('hero-nav-hidden');

      function update() {
        const rect  = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        const p = total > 0 ? scrolled / total : 0;

        // ── Tiles: spiral inward + fade, staggered per tile ──
        tiles.forEach(({ el, baseAngle, baseRadius, delay }) => {
          const raw = (p - delay) / (0.5 - delay || 1);
          const sp  = Math.min(Math.max(raw, 0), 1);
          const eased = sp * sp * (3 - 2 * sp); // smoothstep
          const angle  = baseAngle + eased * Math.PI * 1.4; // ~1.25 turns, same direction = a real spiral, not a scatter
          const radius = baseRadius * (1 - eased * 0.92);
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          el.style.left = x + '%';
          el.style.top  = y + '%';
          el.style.opacity = String(1 - eased);
          el.style.transform = `translate(-50%,-50%) scale(${1 - eased * 0.55})`;
        });

        // ── Headline: invisible at rest, builds word by word,
        //    then fades back out before the hero tile takes over ──
        const textIn  = Math.min(Math.max(p / 0.18, 0), 1);
        const textOut = Math.min(Math.max((p - 0.32) / 0.15, 0), 1);
        const headlineOpacity = textIn * (1 - textOut);
        if (headline) headline.style.opacity = String(headlineOpacity);
        if (headlineText) {
          const count = Math.round(textIn * HEADLINE_WORDS.length);
          headlineText.innerHTML = HEADLINE_WORDS.slice(0, count)
            .map(w => w.em ? `<em>${w.t}</em>` : w.t)
            .join(' ');
        }

        // ── Hero tile: clean scale-only zoom to fullscreen, no rotation ──
        const zoomP = Math.min(Math.max((p - 0.35) / 0.5, 0), 1);
        const ease  = zoomP * zoomP * (3 - 2 * zoomP);
        const scale = 1 + ease * 7.2;
        heroImg.style.transform = `translate(-50%,-50%) scale(${scale})`;
        if (overlay) overlay.style.opacity = String(ease);

        // ── Nav + name reveal ──
        const revealP = Math.min(Math.max((p - 0.55) / 0.3, 0), 1);
        document.body.classList.toggle('hero-nav-hidden', revealP <= 0.02);
        if (nameOverlay) {
          nameOverlay.style.opacity = String(revealP);
          nameOverlay.classList.toggle('visible', revealP > 0.5);
        }
      }

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { update(); ticking = false; });
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    } catch (err) {
      console.error('hero-zoom.js error, falling back to static hero:', err);
      staticFallback();
    }
  });
})();