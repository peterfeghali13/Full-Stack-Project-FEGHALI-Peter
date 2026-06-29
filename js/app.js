'use strict';
class Navbar {
  constructor() {
    this.el = document.getElementById('mainNavbar');
    if (!this.el) return;
    this._bindScroll();
    this._setActive();
  }

  _bindScroll() {
    const onScroll = () => this.el.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Set active link based on current page filename */
  _setActive() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split(/[?#]/)[0];
      if (href === page) link.classList.add('active');
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   ScrollSpy
   Detects which section is currently in view and bolds the
   matching nav link. Works on any page that has sections
   with the IDs listed in sectionMap.
   ───────────────────────────────────────────────────────────── */
class ScrollSpy {
  constructor() {
    /* Map section ID → the nav link href that represents it */
    this.sectionMap = {
      'home':     ['index.html', './'],
      'features': ['#features'],
      'gallery':  ['#gallery'],
      'about':    ['#about'],
      'trailer':  ['media.html'],
      'trailers': ['media.html'],
      'characters': ['world.html'],
      'locations':  ['world.html'],
      'timeline':   ['world.html'],
    };

    /* Collect only sections that actually exist on this page */
    this.sections = Object.keys(this.sectionMap)
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!this.sections.length) return;

    /* All nav links that scrollspy can touch */
    this.spyHrefs = new Set(Object.values(this.sectionMap).flat());
    this.navLinks  = [...document.querySelectorAll('.nav-link')].filter(l =>
      this.spyHrefs.has(l.getAttribute('href'))
    );

    window.addEventListener('scroll', () => this._update(), { passive: true });
    this._update();
  }

  _update() {
    let active = this.sections[0];  // default: first section

    for (const section of this.sections) {
      /* A section is "current" if its top has scrolled past 45% of viewport height */
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.45) {
        active = section;
      }
    }

    if (!active) return;

    const targetHrefs = this.sectionMap[active.id] || [];

    this.navLinks.forEach(link => {
      link.classList.toggle('active', targetHrefs.includes(link.getAttribute('href')));
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   CounterAnimation  –  animates [data-target] numbers
   ───────────────────────────────────────────────────────────── */
class CounterAnimation {
  constructor(selector = '[data-target]') {
    this.elements = document.querySelectorAll(selector);
    if (!this.elements.length) return;
    this._observe();
  }

  _observe() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { this._run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    this.elements.forEach(el => io.observe(el));
  }

  _run(el) {
    const target = parseInt(el.dataset.target, 10);
    const steps  = 60 * 1.6;
    const inc    = target / steps;
    let cur = 0;
    const tick = () => {
      cur += inc;
      if (cur < target) { el.textContent = Math.floor(cur).toLocaleString(); requestAnimationFrame(tick); }
      else               { el.textContent = target.toLocaleString(); }
    };
    requestAnimationFrame(tick);
  }
}

/* ─────────────────────────────────────────────────────────────
   ScrollReveal  –  fade-in-up on scroll entrance
   ───────────────────────────────────────────────────────────── */
class ScrollReveal {
  constructor(selector = '.reveal') {
    this.elements = document.querySelectorAll(selector);
    if (!this.elements.length) return;
    this._prepare();
    this._observe();
  }

  _prepare() {
    this.elements.forEach((el, i) => {
      el.classList.add('sr-hidden');
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });
  }

  _observe() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('sr-hidden');
          e.target.classList.add('sr-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    this.elements.forEach(el => io.observe(el));
  }
}

/* ─────────────────────────────────────────────────────────────
   Boot
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
  new ScrollSpy();
  new ScrollReveal(
    '.feature-card, .character-card, .location-card, ' +
    '.game-card, .gallery-item, .timeline-body, .stat-item, .trailer-card'
  );
});
