/* ============================================================
   GLOBAL JS
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   ✏️  "RIGHT NOW" WIDGET — EDIT THIS, NOTHING ELSE, TO UPDATE IT
   Shows up automatically in the footer of every page. Update
   these three lines whenever what you're doing changes — no
   HTML editing required anywhere.
   ──────────────────────────────────────────────────────────── */
const NOW_STATUS = {
  shooting: "a scrapbook coming-of-age piece for నిజము [Nijam]",
  reading:  "a stack of half-finished New Yorker longreads",
  building: "this portfolio (yes, really)"
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ── */
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (cur && trail) {
    let mx=0,my=0,tx=0,ty=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    const animT = () => {
      tx+=(mx-tx)*.1; ty+=(my-ty)*.1;
      trail.style.left=tx+'px'; trail.style.top=ty+'px';
      requestAnimationFrame(animT);
    };
    animT();
    document.querySelectorAll('a,button,.card,.project-row,.gallery-item,.filter-btn,.tab-btn,.story-card,.nijam-card')
      .forEach(el => {
        el.addEventListener('mouseenter', ()=>cur.classList.add('big'));
        el.addEventListener('mouseleave', ()=>cur.classList.remove('big'));
      });
  }

  /* ── CURSOR CAPTION LABEL ──
     A little handwritten note that follows the cursor and says
     something different depending on what you're hovering —
     works site-wide via event delegation, so it applies even to
     cards/rows that get built dynamically by page-specific JS
     (nijam.html, archive.html, etc). Only runs on devices with a
     real mouse, and respects reduced-motion. */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canHover && !prefersReduced) {
    const label = document.createElement('div');
    label.id = 'cursor-label';
    document.body.appendChild(label);

    let lx = -9999, ly = -9999, tx2 = -9999, ty2 = -9999;
    document.addEventListener('mousemove', e => { tx2 = e.clientX; ty2 = e.clientY; });
    (function animateLabel() {
      lx += (tx2 - lx) * 0.18;
      ly += (ty2 - ly) * 0.18;
      label.style.transform = `translate(${lx + 18}px, ${ly + 12}px) rotate(-4deg)`;
      requestAnimationFrame(animateLabel);
    })();

    /* Order matters — first match wins, so specific selectors go first. */
    const CURSOR_TEXTS = [
      { sel: '.nav-dropdown a',                                       text: 'peek →' },
      { sel: '.nav-link.has-drop',                                    text: 'browse ↓' },
      { sel: '.nav-link.nijam-link',                                  text: 'read the paper →' },
      { sel: '.nav-link',                                             text: 'go →' },
      { sel: '.lightbox-nav, .lightbox-prev, .lightbox-next',         text: 'next shot' },
      { sel: '.gallery-item',                                         text: 'zoom in ↗' },
      { sel: '.project-row-link',                                     text: 'view project ↗' },
      { sel: '.project-row',                                          text: 'peek inside →' },
      { sel: '.work-row',                                             text: 'view case study →' },
      { sel: '.card',                                                 text: 'take a look →' },
      { sel: '.story-card, .hero-story',                              text: 'read on →' },
      { sel: '.nijam-card',                                           text: 'read on →' },
      { sel: '.filter-btn, .tab-btn, .gfilter-btn',                   text: 'filter' },
      { sel: '.identity-link, .see-all, .read-more, .gallery-ext-link, .nijam-read-all', text: 'this way →' },
      { sel: 'a[href^="mailto:"]',                                    text: 'say hi ✉' },
      { sel: '.back-to-top',                                          text: 'up we go ↑' },
      { sel: '.btn',                                                  text: 'click' },
      { sel: 'a, button',                                             text: 'click' },
    ];

    function findLabelText(el) {
      const withData = el.closest('[data-cursor]');
      if (withData) return withData.dataset.cursor;
      for (const { sel, text } of CURSOR_TEXTS) {
        if (el.closest(sel)) return text;
      }
      return null;
    }

    document.addEventListener('mouseover', e => {
      const text = findLabelText(e.target);
      if (text) {
        label.textContent = text;
        label.classList.add('visible');
      }
    });
    document.addEventListener('mouseout', e => {
      const related = e.relatedTarget;
      if (!related || !findLabelText(related)) label.classList.remove('visible');
    });
  }

  /* ── MOBILE HAMBURGER ── */
  const ham = document.getElementById('nav-hamburger');
  const linksWrap = document.getElementById('nav-links-wrap');
  if (ham && linksWrap) {
    ham.addEventListener('click', () => {
      linksWrap.classList.toggle('open');
      ham.textContent = linksWrap.classList.contains('open') ? '✕' : '☰';
    });
  }

  /* ── ACTIVE NAV ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
    if (a.classList.contains('nijam-link') && page === 'nijam.html')
      a.classList.add('orange-active');
  });

  /* ── DATELINE ── */
  document.querySelectorAll('.nav-dateline').forEach(el => {
    el.innerHTML = new Date().toLocaleDateString('en-US',
      {weekday:'short',year:'numeric',month:'short',day:'numeric'}).toUpperCase()
      + '<br>Chapel Hill, NC';
  });

  /* ── PROGRESS BAR ── */
  const pb = document.querySelector('.progress-bar');
  if (pb) {
    window.addEventListener('scroll', () => {
      const h=document.documentElement;
      pb.style.width = (h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    }, {passive:true});
  }

  /* ── SCROLL REVEAL (generic .reveal) ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, {threshold:.1, rootMargin:'0px 0px -28px 0px'});
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── NIJAM FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.filter;
      document.querySelectorAll('[data-tag]').forEach(c => {
        c.style.display = (tag==='all' || c.dataset.tag===tag) ? '' : 'none';
      });
    });
  });

  /* ── BACK TO TOP ── */
  document.querySelectorAll('.back-to-top').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); })
  );

  /* ── TICKER PAUSE ── */
  document.querySelectorAll('.ticker-track').forEach(t => {
    t.addEventListener('mouseenter', ()=>t.style.animationPlayState='paused');
    t.addEventListener('mouseleave', ()=>t.style.animationPlayState='running');
  });

  /* ── "RIGHT NOW" FOOTER WIDGET ──
     Auto-injects into every .site-footer, right above the
     copyright line. Nothing to add to the HTML — just keep the
     NOW_STATUS object at the top of this file up to date. */
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const bottomBar = footer.querySelector('.footer-bottom');
    const strip = document.createElement('div');
    strip.className = 'now-strip';
    strip.innerHTML = `
      <span class="now-label"><span class="now-dot"></span>Right now</span>
      <span class="now-item">📷 Shooting <em>${NOW_STATUS.shooting}</em></span>
      <span class="now-item">📖 Reading <em>${NOW_STATUS.reading}</em></span>
      <span class="now-item">💻 Building <em>${NOW_STATUS.building}</em></span>
    `;
    if (bottomBar) {
      footer.querySelector('.footer-grid')?.insertAdjacentElement('afterend', strip);
    } else {
      footer.appendChild(strip);
    }
  }

  /* ── GRACEFUL FALLBACK FOR MISSING/PLACEHOLDER IMAGES ──
     Several image paths in this project are still content
     placeholders (see README "Content You Still Need to Write").
     Rather than showing a broken-image icon to visitors, swap
     in a subtle branded placeholder until real photos are added. */
  document.addEventListener('error', e => {
    const el = e.target;
    if (el.tagName === 'IMG' && !el.dataset.fallbackApplied) {
      el.dataset.fallbackApplied = 'true';
      el.classList.add('img-missing');
      el.alt = el.alt || 'Image coming soon';
    }
  }, true);

});