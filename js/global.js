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
    document.querySelectorAll('a,button,.wcard,.project-row,.gallery-item,.scard,.nijam-preview-card')
      .forEach(el => {
        el.addEventListener('mouseenter', ()=>cur.classList.add('big'));
        el.addEventListener('mouseleave', ()=>cur.classList.remove('big'));
      });
  }

  /* ── ACTIVE NAV ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (h === page || (page==='' && h==='index.html')) a.classList.add('active');
  });

  /* ── DATELINE ── */
  document.querySelectorAll('.nav-dateline').forEach(el => {
    el.textContent = new Date().toLocaleDateString('en-US',
      {weekday:'short',month:'short',day:'numeric',year:'numeric'}).toUpperCase();
  });

  /* ── HAMBURGER ── */
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  /* ── SCROLL REVEAL ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold:.1, rootMargin:'0px 0px -28px 0px' });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── PROGRESS BAR ── */
  const pb = document.querySelector('.progress-bar');
  if (pb) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      pb.style.width = (h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    }, {passive:true});
  }

  /* ── FILTER BUTTONS (generic) ── */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const key = group.dataset.filterGroup;
    group.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      group.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.filter;
      document.querySelectorAll(`[data-tag][data-filter-scope="${key}"]`).forEach(card => {
        card.style.display = (tag==='all'||card.dataset.tag===tag)?'':'none';
      });
    });
  });

  /* ── BACK TO TOP ── */
  document.querySelectorAll('.back-to-top').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); })
  );

  /* ── TICKER pause on hover ── */
  document.querySelectorAll('.ticker-track').forEach(t => {
    t.addEventListener('mouseenter', ()=>t.style.animationPlayState='paused');
    t.addEventListener('mouseleave', ()=>t.style.animationPlayState='running');
  });

});