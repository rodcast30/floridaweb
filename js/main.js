// =======================================
// PAGE INIT
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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviado!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      e.target.reset();
    }, 2500);
  });

  // Prefill producto field from URL ?producto=...
  const params = new URLSearchParams(window.location.search);
  const producto = params.get('producto');
  if (producto) {
    const productoInput = document.getElementById('producto');
    if (productoInput) productoInput.value = producto;
    const consultaInput = document.getElementById('consulta');
    if (consultaInput) {
      consultaInput.value = `Solicito cotización del producto "${producto}". `;
      consultaInput.focus();
    }
  }
}

// =======================================
// PRODUCT MODAL (catalogo.html)
// =======================================
const productModal = document.getElementById('productModal');
if (productModal) {
  const modalVisual = document.getElementById('modalVisual');
  const modalCategory = document.getElementById('modalCategory');
  const modalName = document.getElementById('modalProductName');
  const modalDesc = document.getElementById('modalDesc');
  const modalIntensity = document.getElementById('modalIntensity');
  const modalWeight = document.getElementById('modalWeight');
  const modalWeightSpec = document.getElementById('modalWeightSpec');
  const modalCta = document.getElementById('modalCta');

  function openProductModal(card) {
    // Visual
    const visualSrc = card.querySelector('.aroma-card__visual') || card.querySelector('.tapete-visual');
    modalVisual.innerHTML = '';
    if (card.classList.contains('aroma-card--tapete')) {
      const tap = card.querySelector('.tapete-visual').cloneNode(true);
      modalVisual.appendChild(tap);
      modalVisual.classList.add('product-modal__visual--tapete');
    } else {
      modalVisual.classList.remove('product-modal__visual--tapete');
      const img = card.querySelector('.aroma-card__visual-img');
      if (img) {
        const clone = img.cloneNode(true);
        clone.removeAttribute('class');
        modalVisual.appendChild(clone);
      }
    }

    // Name
    const nameEl = card.querySelector('.aroma-card__name');
    modalName.innerHTML = nameEl.innerHTML;

    // Description
    modalDesc.textContent = card.querySelector('.aroma-card__desc').textContent;

    // Weight
    const weightEl = card.querySelector('.aroma-card__weight');
    if (weightEl) {
      modalWeight.textContent = weightEl.textContent;
      modalWeightSpec.style.display = '';
    } else {
      modalWeightSpec.style.display = 'none';
    }

    // Intensity
    const intensityEl = card.querySelector('.aroma-card__intensity');
    modalIntensity.innerHTML = intensityEl ? intensityEl.innerHTML : '';

    // Category badge
    const badge = card.querySelector('.fragancia-card__badge');
    if (badge) {
      modalCategory.textContent = badge.textContent;
      modalCategory.className = 'product-modal__category ' + Array.from(badge.classList).filter(c => c.startsWith('fragancia-card__badge--')).join(' ');
    }

    // CTA link
    const productName = nameEl.textContent.trim();
    modalCta.href = `contacto.html?producto=${encodeURIComponent(productName)}`;

    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProductModal() {
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.aroma-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card));
  });

  productModal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeProductModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('open')) closeProductModal();
  });
}

// =======================================
// CATALOGO: filtros + buscador
// =======================================
const catalogoControls = document.querySelector('.catalogo-controls');
if (catalogoControls) {
  const filters = document.querySelectorAll('.catalogo-filter');
  const searchInput = document.getElementById('catalogoSearch');
  const emptyEl = document.getElementById('catalogoEmpty');
  const aerosolesSection = document.getElementById('aerosoles');
  const tapetesSection = document.getElementById('tapetes');
  const categories = document.querySelectorAll('.catalogo__category');
  const allCards = document.querySelectorAll('.aroma-card');

  let currentFilter = 'all';

  function applyFilters() {
    const term = (searchInput.value || '').trim().toLowerCase();
    let visibleCount = 0;

    // Section visibility based on filter
    if (currentFilter === 'aerosoles') {
      aerosolesSection.classList.remove('catalogo-section--hidden');
      tapetesSection.classList.add('catalogo-section--hidden');
    } else if (currentFilter === 'tapetes') {
      aerosolesSection.classList.add('catalogo-section--hidden');
      tapetesSection.classList.remove('catalogo-section--hidden');
    } else {
      aerosolesSection.classList.remove('catalogo-section--hidden');
      tapetesSection.classList.remove('catalogo-section--hidden');
    }

    // Card-level search
    allCards.forEach(card => {
      const inHiddenSection =
        (currentFilter === 'aerosoles' && tapetesSection.contains(card)) ||
        (currentFilter === 'tapetes' && aerosolesSection.contains(card));

      if (inHiddenSection) {
        card.classList.add('aroma-card--hidden');
        return;
      }

      if (!term) {
        card.classList.remove('aroma-card--hidden');
        visibleCount++;
        return;
      }

      const name = (card.querySelector('.aroma-card__name')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.aroma-card__desc')?.textContent || '').toLowerCase();
      const badge = (card.querySelector('.fragancia-card__badge')?.textContent || '').toLowerCase();
      const match = name.includes(term) || desc.includes(term) || badge.includes(term);

      card.classList.toggle('aroma-card--hidden', !match);
      if (match) visibleCount++;
    });

    // Hide categories with no visible cards
    categories.forEach(cat => {
      const hasVisible = cat.querySelectorAll('.aroma-card:not(.aroma-card--hidden)').length > 0;
      cat.classList.toggle('catalogo__category--empty', !hasVisible);
    });

    if (emptyEl) emptyEl.hidden = visibleCount > 0;
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

// =======================================
// LAUNCH ANIMATIONS ON LOAD
// =======================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
