'use strict';

/* ─────────────────────────────────────────────────────────────
   Feature  –  one "What Awaits You" card (now a clickable link)
   ───────────────────────────────────────────────────────────── */
class Feature {
  constructor({ icon, title, description, href }) {
    this.icon        = icon;
    this.title       = title;
    this.description = description;
    this.href        = href || 'world.html';
  }

  render() {
    return `
      <a href="${this.href}" class="feature-card-link">
        <div class="feature-card">
          <div class="feature-icon" aria-hidden="true">
            <i class="${this.icon}"></i>
          </div>
          <h3>${this.title}</h3>
          <p>${this.description}</p>
          <span class="feature-arrow">Learn more &rarr;</span>
        </div>
      </a>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   FeaturesSection  –  six clickable feature cards
   ───────────────────────────────────────────────────────────── */
class FeaturesSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.features  = [
      new Feature({
        icon: 'fas fa-city',
        title: 'Vice City Reborn',
        description: 'A stunning reimagining of the iconic neon-soaked city, more alive than ever with dynamic weather, fully simulated crowds, and a seamless real-time day/night cycle.',
        href: 'world.html#locations',
      }),
      new Feature({
        icon: 'fas fa-users',
        title: 'Dual Protagonists',
        description: 'Play as Lucia Caminos and Jason Duval in an interconnected story — two lives, one unstoppable force navigating the lawless state of Leonida.',
        href: 'world.html#characters',
      }),
      new Feature({
        icon: 'fas fa-globe-americas',
        title: 'Massive Open World',
        description: 'Explore the fictional state of Leonida — mountains, Everglades swamps, sun-drenched beaches, and the sprawling urban chaos of Vice City in unprecedented detail.',
        href: 'world.html#locations',
      }),
      new Feature({
        icon: 'fas fa-brain',
        title: 'Next-Gen AI',
        description: 'NPCs remember your actions, adapt to your reputation, and generate emergent stories — making every encounter feel different and every playthrough unique.',
        href: 'world.html',
      }),
      new Feature({
        icon: 'fas fa-car-side',
        title: 'Hundreds of Vehicles',
        description: 'Exotic supercars, airboats, helicopters, motorcycles, and trucks — each modelled with realistic physics so every ride feels viscerally different.',
        href: 'world.html',
      }),
      new Feature({
        icon: 'fas fa-network-wired',
        title: 'GTA Online 2.0',
        description: 'A completely revamped multiplayer experience with new heists, persistent businesses, social activities, and a living online economy.',
        href: 'media.html',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.features.map(f => f.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   GalleryItem  –  one card in the 3-column Flexbox gallery.
   Clicking opens the Bootstrap lightbox modal.
   ───────────────────────────────────────────────────────────── */
class GalleryItem {
  constructor({ id, title, description, category, image, gradient }) {
    this.id          = id;
    this.title       = title;
    this.description = description;
    this.category    = category;
    this.image       = image;
    this.gradient    = gradient;
  }

  render(delay = 0) {
    return `
      <div class="gallery-item"
           data-category="${this.category}"
           data-id="${this.id}"
           data-title="${this.title}"
           data-description="${this.description}"
           data-gradient="${this.gradient}"
           data-image="${this.image}"
           style="animation-delay:${delay}s;cursor:pointer"
           tabindex="0"
           role="button"
           aria-label="View ${this.title}">
        <div class="gallery-thumb" style="background:${this.gradient}">
          <img
            src="${this.image}"
            alt="${this.title}"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="gallery-overlay">
          <h4>${this.title}</h4>
          <p>${this.description}</p>
          <span class="gallery-tag">${this.category}</span>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   Gallery  –  UNIQUE REQUIREMENT
   Responsive 3-column Flexbox gallery with:
     · Category filter buttons
     · Fade transition between filters
     · Lightbox modal on click
   ───────────────────────────────────────────────────────────── */
class Gallery {
  constructor(gridId, filtersId) {
    this.grid         = document.getElementById(gridId);
    this.filtersEl    = document.getElementById(filtersId);
    this.activeFilter = 'all';
    this.modal        = null;  // Bootstrap modal instance

    // 16 curated GTA VI gallery items — using your own photos stored in assets/images/
    this.items = [
      new GalleryItem({ id: 1,  title: 'Neon Vice City Strip',    description: 'The iconic boulevard at night, bathed in electric pink and purple neon light stretching to the horizon.',     category: 'city',       image: 'assets/images/neon_vice_city.jpg',           gradient: 'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)' }),
      new GalleryItem({ id: 2,  title: 'Vice City Beach Sunset',  description: 'Golden-hour waves rolling onto the shores of Vice City as the sun melts into the ocean.',                    category: 'city',       image: 'assets/images/vice_city_beach_sunset.avif',  gradient: 'linear-gradient(135deg,#7c2d00,#c73e0a,#fa8c16)' }),
      new GalleryItem({ id: 3,  title: 'Downtown Skyline',        description: 'Towering glass skyscrapers pierce the night sky, their reflections shimmering in the bay below.',             category: 'city',       image: 'assets/images/downtown_skyline.avif',         gradient: 'linear-gradient(135deg,#001433,#003a8c,#00d4ff)' }),
      new GalleryItem({ id: 4,  title: 'Vice City Harbor',        description: 'Luxury yachts and cargo ships share the moonlit bay, a collision of old money and new crime.',                category: 'city',       image: 'assets/images/vice_city_harbor.jpg',          gradient: 'linear-gradient(135deg,#001d3d,#003566,#0077b6)' }),
      new GalleryItem({ id: 5,  title: 'Night Club District',     description: 'Vice City\'s entertainment zone pulses long after midnight — music, lights, and danger around every corner.',  category: 'city',       image: 'assets/images/night_club.jpg',                gradient: 'linear-gradient(135deg,#0d0020,#4b0082,#9900cc)' }),
      new GalleryItem({ id: 6,  title: 'Lucia Caminos',           description: 'The first playable female lead in the mainline GTA series. Tough, resourceful, and determined to survive.',   category: 'characters', image: 'assets/images/lucia.jpg',                    gradient: 'linear-gradient(135deg,#1a0010,#7c1a35,#c2185b)' }),
      new GalleryItem({ id: 7,  title: 'Jason Duval',             description: 'Lucia\'s partner and co-protagonist. Shaped by Leonida\'s brutal streets, loyal to those he trusts.',          category: 'characters', image: 'assets/images/jason.jpg',                    gradient: 'linear-gradient(135deg,#0d1117,#1f2937,#374151)' }),
      new GalleryItem({ id: 8,  title: 'Lucia & Jason',           description: 'Two protagonists. One unstoppable criminal force. Their bond is the heart of GTA VI\'s story.',               category: 'characters', image: 'assets/images/jason_lucia.jpg',              gradient: 'linear-gradient(135deg,#1a0533,#52005e,#c2185b)' }),
      new GalleryItem({ id: 9,  title: 'Boobie Ike',              description: 'Vice City\'s most flamboyant and feared crime lord. His outrageous style masks a calculating criminal mind.',  category: 'characters', image: 'assets/images/bookie_ike.jpg',               gradient: 'linear-gradient(135deg,#1a0033,#4b0082,#7b1fa2)' }),
      new GalleryItem({ id: 17, title: 'Brian',                   description: 'A seasoned Leonida local with deep connections. Indispensable — if unpredictable — ally for Lucia and Jason.', category: 'characters', image: 'assets/images/brian.jpg',                    gradient: 'linear-gradient(135deg,#001433,#0d2d6b,#1565c0)' }),
      new GalleryItem({ id: 18, title: 'Cal',                     description: 'A mysterious figure from Leonida\'s criminal fringes. His true loyalties and motivations remain a mystery.',   category: 'characters', image: 'assets/images/cal.jpg',                      gradient: 'linear-gradient(135deg,#001a00,#1b5e20,#388e3c)' }),
      new GalleryItem({ id: 19, title: 'Raul',                    description: 'A feared enforcer with deep ties to organised crime. Raul is Lucia and Jason\'s most dangerous adversary.',    category: 'characters', image: 'assets/images/raul.jpg',                     gradient: 'linear-gradient(135deg,#1a0500,#7c1a00,#c62828)' }),
      new GalleryItem({ id: 10, title: 'Everglades at Dawn',      description: 'Misty swamplands before the sun rises over Leonida — alligators, airboats, and hidden criminal hideouts.',   category: 'nature',     image: 'assets/images/everglades_at_dawn.avif',      gradient: 'linear-gradient(135deg,#002400,#1a4a1a,#52c41a)' }),
      new GalleryItem({ id: 11, title: 'Tropical Coastline',      description: 'Crystal-clear turquoise waters lap against white sand beaches along the Leonida Keys coastline.',             category: 'nature',     image: 'assets/images/tropical_coastline.avif',      gradient: 'linear-gradient(135deg,#003049,#006994,#00b4d8)' }),
      new GalleryItem({ id: 12, title: 'Leonida Keys Islands',    description: 'A tropical archipelago south of Vice City — paradise on the surface, with criminal operations beneath.',     category: 'nature',     image: 'assets/images/leonida_keys.jpg',             gradient: 'linear-gradient(135deg,#002a4a,#00688b,#36cfc9)' }),
      new GalleryItem({ id: 13, title: 'Countryside at Dusk',     description: 'Sun-baked flatlands, orange groves, and forgotten highways stretching to the Leonida horizon.',               category: 'nature',     image: 'assets/images/country_side_at_dusk.jpg',     gradient: 'linear-gradient(135deg,#3b2500,#7c5200,#d4a017)' }),
      new GalleryItem({ id: 14, title: 'Exotic Supercar',         description: 'Next-generation vehicle physics push the limits of speed through Vice City\'s neon-lit streets at night.',   category: 'vehicles',   image: 'assets/images/exotic_super_cars.jpg',        gradient: 'linear-gradient(135deg,#1a0000,#7c0000,#f5222d)' }),
      new GalleryItem({ id: 15, title: 'Police Helicopter Chase', description: 'Five-star wanted level — every helicopter, cruiser, and NOOSE van in Leonida is on your tail.',              category: 'vehicles',   image: 'assets/images/police_helicopter.jpg',        gradient: 'linear-gradient(135deg,#001133,#003399,#004fff)' }),
      new GalleryItem({ id: 16, title: 'Swamp Airboat',           description: 'Navigate the Everglades in a fan-driven airboat — the fastest way through Leonida\'s wild wetlands.',         category: 'vehicles',   image: 'assets/images/swamp_airboat.jpg',            gradient: 'linear-gradient(135deg,#002200,#1a4a00,#389e0d)' }),
    ];

    this.categories = ['all', 'city', 'characters', 'nature', 'vehicles'];
  }

  /* ── Initialise Bootstrap modal ─────────────────────────── */
  _initModal() {
    const modalEl = document.getElementById('galleryModal');
    if (modalEl && window.bootstrap) {
      this.modal = new bootstrap.Modal(modalEl);
    }
  }

  /* ── Open modal with item data ──────────────────────────── */
  _openModal(item) {
    document.getElementById('modalTitle').textContent  = item.title;
    document.getElementById('modalDesc').textContent   = item.description;
    document.getElementById('modalTag').textContent    = item.category;
    document.getElementById('galleryModalTitle').textContent = item.title;

    const thumb = document.getElementById('modalThumb');
    thumb.style.background = item.gradient;
    // Show real image in modal, fallback to gradient
    thumb.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title}"
        style="width:100%;height:100%;object-fit:cover;border-radius:8px"
        onerror="this.style.display='none'"
      />
    `;

    if (this.modal) this.modal.show();
  }

  /* ── Bind click + keyboard on grid items ────────────────── */
  _bindItemEvents() {
    if (!this.grid) return;
    this.grid.querySelectorAll('.gallery-item').forEach(el => {
      const open = () => {
        const item = {
          title:       el.dataset.title,
          description: el.dataset.description,
          category:    el.dataset.category,
          gradient:    el.dataset.gradient,
          image:       el.dataset.image,
        };
        this._openModal(item);
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }

  /* ── Render filter buttons ──────────────────────────────── */
  _renderFilters() {
    if (!this.filtersEl) return;
    this.filtersEl.innerHTML = this.categories
      .map(cat => `
        <button class="filter-btn ${cat === 'all' ? 'active' : ''}"
                data-filter="${cat}"
                aria-pressed="${cat === 'all'}">
          ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      `)
      .join('');

    this.filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filtersEl.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        this.activeFilter = btn.dataset.filter;
        this._renderItems();
      });
    });
  }

  /* ── Render gallery cards ───────────────────────────────── */
  _renderItems() {
    if (!this.grid) return;
    const filtered = this.activeFilter === 'all'
      ? this.items
      : this.items.filter(i => i.category === this.activeFilter);

    this.grid.style.opacity = '0';
    setTimeout(() => {
      this.grid.innerHTML = filtered.map((item, i) => item.render(i * 0.045)).join('');
      this.grid.style.transition = 'opacity 0.3s ease';
      this.grid.style.opacity    = '1';
      this._bindItemEvents();
      new ScrollReveal('.gallery-item');
    }, 220);
  }

  init() {
    this._initModal();
    this._renderFilters();
    this._renderItems();
  }
}

/* ─────────────────────────────────────────────────────────────
   Stat  –  animated counter data model
   ───────────────────────────────────────────────────────────── */
class Stat {
  constructor({ value, suffix = '', label }) {
    this.value  = value;
    this.suffix = suffix;
    this.label  = label;
  }
  render() {
    return `
      <div class="stat-item">
        <span class="stat-value">
          <span class="stat-number" data-target="${this.value}">0</span>${this.suffix}
        </span>
        <span class="stat-label">${this.label}</span>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   StatsSection
   ───────────────────────────────────────────────────────────── */
class StatsSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stats = [
      new Stat({ value: 50,  suffix: '+', label: 'Hours of Story Content' }),
      new Stat({ value: 700, suffix: '+', label: 'Unique Vehicles' }),
      new Stat({ value: 12,  suffix: '',  label: 'Years in Development' }),
      new Stat({ value: 2,   suffix: '',  label: 'Playable Protagonists' }),
    ];
  }
  render() {
    if (!this.container) return;
    this.container.innerHTML = this.stats.map(s => s.render()).join('');
    new CounterAnimation('.stat-number');
  }
}

/* ─────────────────────────────────────────────────────────────
   AboutSection  –  game-info card
   ───────────────────────────────────────────────────────────── */
class AboutSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.rows = [
      { label: 'Developer',   value: 'Rockstar Games' },
      { label: 'Publisher',   value: 'Take-Two Interactive' },
      { label: 'Setting',     value: 'Leonida / Vice City' },
      { label: 'Platforms',   value: 'PS5 &middot; Xbox Series X|S &middot; PC (later)' },
      { label: 'Release',     value: 'November 19, 2026' },
      { label: 'Engine',      value: 'RAGE Engine (Gen 9)' },
      { label: 'Mode',        value: 'Single-Player + Online' },
      { label: 'Protagonists',value: 'Lucia Caminos &amp; Jason Duval' },
    ];
  }
  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="info-card-header"><h3>Game Info</h3></div>
      ${this.rows.map(r => `
        <div class="info-row">
          <span class="info-label">${r.label}</span>
          <span class="info-value">${r.value}</span>
        </div>
      `).join('')}
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   Boot
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new FeaturesSection('featuresGrid').render();
  new Gallery('galleryGrid', 'galleryFilters').init();
  new StatsSection('statsGrid').render();
  new AboutSection('gameInfoCard').render();
});
