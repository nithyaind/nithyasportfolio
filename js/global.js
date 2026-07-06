/* ============================================================
   GLOBAL JS
   ============================================================ */
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