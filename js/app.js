'use strict';
class Navbar {
  constructor() {
    this.el = document.getElementById('mainNavbar');
    if (!this.el) return;
    this._bindScroll();
    this._setActive();
  }

  _bindScroll() {
    const onScroll = () => {
      this.el.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load so state is correct
  }

  _setActive() {

    const page = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {

      const href = (link.getAttribute('href') || '').split(/[?#]/)[0];
      if (href === page) {
        link.classList.add('active');
      } else {

        if (link.classList.contains('active') && href !== '') {
          link.classList.remove('active');
        }
      }
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   CounterAnimation
   Finds every [data-target] element and animates its number
   from 0 to the target value when it enters the viewport.
   ───────────────────────────────────────────────────────────── */
class CounterAnimation {
  constructor(selector = '[data-target]') {
    this.elements = document.querySelectorAll(selector);
    if (!this.elements.length) return;
    this._observe();
  }

  _observe() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._runCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    this.elements.forEach(el => io.observe(el));
  }

  _runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600; // ms
    const fps      = 60;
    const steps    = (duration / 1000) * fps;
    const increment = target / steps;
    let current = 0;

    const tick = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(tick);
  }
}

/* 
   ScrollReveal
   Adds .sr-hidden to matching elements, then swaps in
   .sr-visible with staggered delays when each enters view.
   CSS for .sr-hidden / .sr-visible lives in style.css.
   */
class ScrollReveal {
  constructor(selector = '.reveal') {
    this.selector = selector;
    this.elements = document.querySelectorAll(selector);
    if (!this.elements.length) return;
    this._prepare();
    this._observe();
  }

  _prepare() {
    this.elements.forEach((el, i) => {
      el.classList.add('sr-hidden');
      // Stagger within groups of 4
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });
  }

  _observe() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('sr-hidden');
          entry.target.classList.add('sr-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    this.elements.forEach(el => io.observe(el));
  }
}

/* 
   Boot – shared initialisation on every page
    */
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();

  // Reveal-on-scroll for common card types
  new ScrollReveal(
    '.feature-card, .character-card, .location-card, ' +
    '.game-card, .gallery-item, .timeline-body, .stat-item'
  );
});
