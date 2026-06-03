/* ═══════════════════════════════════════════════════
   ELEGANCE — Premium Interactions
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function animateCursor() {
    dot.style.transform  = `translate(${mx - 5}px, ${my - 5}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateCursor);
  })();

  function addHoverCursor(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }
  addHoverCursor('a, button, .arch-card, .ed-card, .cat-card, .look-card, .loc-card, .testi-photo-card');


  /* ── NAVBAR: scroll state ── */
  const nav     = document.getElementById('siteNav');
  const navLinkEls = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });


  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.contains('mobile-open');
      navLinksEl.classList.toggle('mobile-open', !isOpen);
      hamburger.classList.toggle('is-open', !isOpen);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        navLinksEl.classList.remove('mobile-open');
        hamburger.classList.remove('is-open');
      }
    });
  }


  /* ── ARCH CAROUSEL ── */
  const track   = document.getElementById('archTrack');
  const prevBtn = document.getElementById('archPrev');
  const nextBtn = document.getElementById('archNext');

  if (track && prevBtn && nextBtn) {
    const cards = Array.from(track.querySelectorAll('.arch-card'));
    let current = 2; // start at featured center

    function getCardWidth() {
      if (!cards[0]) return 220;
      return cards[0].getBoundingClientRect().width + 14;
    }

    function goTo(idx) {
      const max = cards.length - 1;
      current = Math.max(0, Math.min(idx, max));
      const offset = current * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;

      cards.forEach((c, i) => {
        const dist = Math.abs(i - current);
        c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        if (dist === 0) {
          c.style.opacity = '1';
          c.style.transform = 'translateY(-28px) scale(1.03)';
        } else if (dist === 1) {
          c.style.opacity = '0.72';
          c.style.transform = 'translateY(-8px) scale(0.98)';
        } else if (dist === 2) {
          c.style.opacity = '0.45';
          c.style.transform = 'translateY(0px) scale(0.95)';
        } else {
          c.style.opacity = '0.25';
          c.style.transform = 'translateY(4px) scale(0.92)';
        }
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch / drag swipe
    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    });

    let mouseDown = false;
    track.addEventListener('mousedown', (e) => { mouseDown = true; startX = e.clientX; });
    document.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    });

    // Autoplay
    let autoplay = setInterval(() => goTo(current < cards.length - 1 ? current + 1 : 0), 4000);
    const wrap = track.closest('.arch-carousel');
    if (wrap) {
      wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
      wrap.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => goTo(current < cards.length - 1 ? current + 1 : 0), 4000);
      });
    }

    // Click on card to center it
    cards.forEach((c, i) => c.addEventListener('click', () => goTo(i)));

    goTo(2);
  }


  /* ── SCROLL REVEAL ── */
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(el => revealObs.observe(el));


  /* ── WORDMARK PARALLAX ── */
  const wordmark = document.getElementById('wordmarkText');
  if (wordmark) {
    window.addEventListener('scroll', () => {
      const sec  = wordmark.closest('.about-section');
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const pct  = 1 - rect.bottom / (window.innerHeight + rect.height);
      wordmark.style.transform = `translateX(${pct * -22}%)`;
    }, { passive: true });
  }


  /* ── HERO MOUSE PARALLAX ── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      heroContent.style.transform = `translate(${dx * 7}px, ${dy * 5}px)`;
    });
  }


  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ── MOBILE NAV STYLES (injected) ── */
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    .nav-links.mobile-open {
      display: flex !important;
      flex-direction: column;
      position: fixed;
      top: 70px; left: 0; right: 0;
      background: rgba(12,12,12,0.97);
      backdrop-filter: blur(24px);
      padding: 32px 40px;
      gap: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      z-index: 99;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hamburger.is-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .hamburger.is-open span:nth-child(2) { opacity: 0; }
    .hamburger.is-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  `;
  document.head.appendChild(mobileStyle);

  // Trigger scroll event on load for active link
  window.dispatchEvent(new Event('scroll'));

});
