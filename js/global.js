/* ============================================================
   GLOBAL JS — cursor · nav · scroll reveal · progress
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (cur && trail) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });
    const animTrail = () => {
      tx += (mx - tx) * .1;
      ty += (my - ty) * .1;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(animTrail);
    };
    animTrail();
    document.querySelectorAll('a,button,.story-card,.chapter-dot,.filter-btn,.cta-btn,.read-more')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cur.classList.add('big'));
        el.addEventListener('mouseleave', () => cur.classList.remove('big'));
      });
  }

  /* ── ACTIVE NAV ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
    if (a.classList.contains('nijam-link') && page === 'nijam.html') {
      a.classList.remove('active');
      a.classList.add('active');
    }
  });

  /* ── DATELINE ── */
  document.querySelectorAll('.nav-dateline').forEach(el => {
    el.textContent = new Date().toLocaleDateString('en-US',
      { weekday:'short', year:'numeric', month:'short', day:'numeric' }).toUpperCase();
  });

  /* ── SCROLL REVEAL ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── PROGRESS BAR ── */
  const pb = document.querySelector('.progress-bar');
  if (pb) {
    const updatePB = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      pb.style.width = pct + '%';
    };
    window.addEventListener('scroll', updatePB, { passive: true });
  }

  /* ── NIJAM FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.filter;
      document.querySelectorAll('[data-tag]').forEach(card => {
        card.style.display = (tag === 'all' || card.dataset.tag === tag) ? '' : 'none';
      });
    });
  });

  /* ── BACK TO TOP ── */
  document.querySelectorAll('.back-to-top').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); })
  );

});