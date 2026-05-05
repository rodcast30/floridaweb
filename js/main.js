// =======================================
// SPRAY PARTICLE INTRO ANIMATION (Canvas)
// =======================================
(function sprayIntro() {
  const overlay = document.getElementById('sprayOverlay');
  const canvas = document.getElementById('sprayCanvas');
  const ctx = canvas.getContext('2d');

  let W, H;
  const particles = [];
  const PARTICLE_COUNT = 300;
  const COLORS = ['#E8872B', '#f5a623', '#1B3A5C', '#ffffff', '#FFD580', '#FF8C42'];
  const GRAVITY = 0.03;
  const FRICTION = 0.985;
  let overlayOpacity = 1;
  let animationStarted = false;
  let startTime = 0;
  const REVEAL_DELAY = 400;   // ms before overlay starts fading
  const REVEAL_DURATION = 1800; // ms for full fade

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle(cx, cy) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 10;
    const size = 2 + Math.random() * 6;
    return {
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed * (0.5 + Math.random()),
      vy: Math.sin(angle) * speed * (0.5 + Math.random()),
      size: size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.8 + Math.random() * 0.2,
      decay: 0.003 + Math.random() * 0.008,
      life: 1,
    };
  }

  function spawnWave(cx, cy, count) {
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(cx, cy));
    }
  }

  function update(now) {
    if (!animationStarted) return;

    const elapsed = now - startTime;

    // Update overlay opacity
    if (elapsed > REVEAL_DELAY) {
      const fadeProgress = Math.min((elapsed - REVEAL_DELAY) / REVEAL_DURATION, 1);
      overlayOpacity = 1 - fadeProgress;
    }

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Draw dark background with fading opacity
    ctx.fillStyle = `rgba(15, 38, 64, ${overlayOpacity})`;
    ctx.fillRect(0, 0, W, H);

    // Update & draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.vy += GRAVITY;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life * p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Check if done
    if (overlayOpacity <= 0 && particles.length === 0) {
      overlay.classList.add('done');
      initPage();
      return;
    }

    requestAnimationFrame(update);
  }

  function startSpray() {
    if (animationStarted) return;
    animationStarted = true;
    startTime = performance.now();

    const cx = W / 2;
    const cy = H / 2;

    // Multiple bursts staggered
    spawnWave(cx, cy, PARTICLE_COUNT);
    setTimeout(() => spawnWave(cx, cy, Math.floor(PARTICLE_COUNT * 0.6)), 150);
    setTimeout(() => spawnWave(cx, cy, Math.floor(PARTICLE_COUNT * 0.3)), 350);

    requestAnimationFrame(update);
  }

  resize();
  window.addEventListener('resize', resize);

  // Auto-start after a short delay
  setTimeout(startSpray, 300);
})();

// =======================================
// PAGE INIT (after spray finishes)
// =======================================
function initPage() {
  // GSAP + ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Show WhatsApp float
  gsap.to('#whatsappFloat', { opacity: 1, duration: 0.6, delay: 0.5 });

  // ---- Hero animations ----
  const heroAccent = document.querySelector('.hero__title-accent');
  if (heroAccent) {
    const split = new SplitType(heroAccent, { types: 'chars' });
    gsap.to(split.chars, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0.1,
    });
  }

  gsap.to('.hero__tag', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
  gsap.to('.hero__title-sub', { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' });
  gsap.to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power3.out' });
  gsap.to('.hero__actions', { opacity: 1, y: 0, duration: 0.7, delay: 0.9, ease: 'power3.out' });

  // ---- Counter animations ----
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = Math.round(parseFloat(el.textContent)) + suffix;
      },
    });
  });

  // ---- Scroll animations ----
  document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out',
    });
  });

  document.querySelectorAll('[data-animate="fade-right"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  document.querySelectorAll('[data-animate="fade-left"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  // ---- Magnetic buttons ----
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ---- Header scroll state ----
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: () => {
      if (window.scrollY > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    },
  });

  // ---- Parallax on aroma cards ----
  document.querySelectorAll('.aroma-card__visual').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      y: -20,
      ease: 'none',
    });
  });

  // ---- Fragancia cards stagger ----
  gsap.from('.fragancia-card', {
    scrollTrigger: { trigger: '.fragancias__grid', start: 'top 80%' },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out',
  });
}

// =======================================
// NAV (runs immediately)
// =======================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  document.body.classList.toggle('nav-open');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.classList.remove('nav-open');
  });
});

// ---- Active link on scroll ----
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scrollY = window.scrollY + 150;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) link.classList.add('active');
      else link.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

// ---- Contact form ----
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn');
  const original = btn.textContent;
  btn.textContent = 'Enviado!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});
