'use strict';

/* ─────────────────────────────────────────────────────────────
   Feature  –  a single "what awaits you" card
   ───────────────────────────────────────────────────────────── */
class Feature {
  constructor({ icon, title, description }) {
    this.icon        = icon;
    this.title       = title;
    this.description = description;
  }

  render() {
    return `
      <div class="feature-card">
        <div class="feature-icon" aria-hidden="true">
          <i class="${this.icon}"></i>
        </div>
        <h3>${this.title}</h3>
        <p>${this.description}</p>
      </div>
    `;
  }
}

/* 
   FeaturesSection  –  renders all six feature cards
    */
class FeaturesSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // 6 curated features (own content)
    this.features = [
      new Feature({
        icon: 'fas fa-city',
        title: 'Vice City Reborn',
        description: 'A stunning reimagining of the iconic neon-soaked city, more alive than ever with dynamic weather, fully simulated crowds, and a seamless real-time day/night cycle.',
      }),
      new Feature({
        icon: 'fas fa-users',
        title: 'Dual Protagonists',
        description: 'Play as Lucia and Jason in an interconnected story inspired by real criminal history — two lives, one unstoppable force navigating the lawless state of Leonida.',
      }),
      new Feature({
        icon: 'fas fa-globe-americas',
        title: 'Massive Open World',
        description: 'Explore the fictional state of Leonida — mountains, Everglades swamps, sun-drenched beaches, and the sprawling urban chaos of Vice City in unprecedented detail.',
      }),
      new Feature({
        icon: 'fas fa-brain',
        title: 'Next-Gen AI',
        description: 'NPCs remember your actions, adapt to your reputation, and generate emergent stories — making every encounter feel different and every playthrough unique.',
      }),
      new Feature({
        icon: 'fas fa-car-side',
        title: 'Hundreds of Vehicles',
        description: 'Exotic supercars, airboats, helicopters, motorcycles, and trucks — each modelled with realistic physics so every ride feels viscerally different.',
      }),
      new Feature({
        icon: 'fas fa-network-wired',
        title: 'GTA Online 2.0',
        description: 'A completely revamped multiplayer experience launching alongside the game, featuring new heists, persistent businesses, and a living online economy.',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.features.map(f => f.render()).join('');
  }
}

/* 
   GalleryItem  –  one card in the 3-column Flexbox gallery
    */
class GalleryItem {
  constructor({ id, title, description, category, gradient, icon }) {
    this.id          = id;
    this.title       = title;
    this.description = description;
    this.category    = category;
    this.gradient    = gradient;
    this.icon        = icon;
  }

  render(delay = 0) {
    return `
      <div class="gallery-item"
           data-category="${this.category}"
           style="animation-delay:${delay}s"
           tabindex="0"
           role="img"
           aria-label="${this.title}">
        <div class="gallery-thumb" style="background:${this.gradient}" aria-hidden="true">
          <i class="${this.icon}"></i>
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

/* 
   Gallery  –  UNIQUE UI REQUIREMENT
   Responsive 3-column Flexbox gallery with category filtering.

   Layout logic (all in style.css):
     .gallery-grid → display:flex; flex-wrap:wrap
     .gallery-item → flex: 1 1 calc(33.333% - 14px)  [3-col desktop]
     @992px        → flex: 1 1 calc(50% - 10px)       [2-col tablet]
     @768px        → flex: 1 1 100%                    [1-col mobile]
   */
class Gallery {
  constructor(gridId, filtersId) {
    this.grid        = document.getElementById(gridId);
    this.filtersEl   = document.getElementById(filtersId);
    this.activeFilter = 'all';

    // ── 16 curated GTA VI gallery items (own content)
    this.items = [
      new GalleryItem({ id: 1,  title: 'Neon Vice City Strip',    description: 'The iconic boulevard at night, bathed in electric pink light.',     category: 'city',       gradient: 'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)', icon: 'fas fa-city' }),
      new GalleryItem({ id: 2,  title: 'Vice City Beach Sunset',  description: 'Golden-hour waves rolling onto the shores of Vice City.',            category: 'city',       gradient: 'linear-gradient(135deg,#7c2d00,#c73e0a,#fa8c16)', icon: 'fas fa-umbrella-beach' }),
      new GalleryItem({ id: 3,  title: 'Downtown Skyline',        description: 'Glass towers reflected in the bay at blue hour.',                    category: 'city',       gradient: 'linear-gradient(135deg,#001433,#003a8c,#00d4ff)', icon: 'fas fa-building' }),
      new GalleryItem({ id: 4,  title: 'Vice City Harbor',        description: 'Luxury yachts and cargo ships share the moonlit bay.',               category: 'city',       gradient: 'linear-gradient(135deg,#001d3d,#003566,#0077b6)', icon: 'fas fa-anchor' }),
      new GalleryItem({ id: 5,  title: 'Night Club District',     description: 'Vice City\'s entertainment zone pulses long after midnight.',        category: 'city',       gradient: 'linear-gradient(135deg,#0d0020,#4b0082,#9900cc)', icon: 'fas fa-music' }),
      new GalleryItem({ id: 6,  title: 'Lucia – Protagonist',     description: 'The first female lead in the mainline GTA series.',                  category: 'characters', gradient: 'linear-gradient(135deg,#1a0010,#7c1a35,#c2185b)', icon: 'fas fa-person-dress' }),
      new GalleryItem({ id: 7,  title: 'Jason – Protagonist',     description: 'Lucia\'s partner and co-lead of GTA VI.',                            category: 'characters', gradient: 'linear-gradient(135deg,#0d1117,#1f2937,#4b5563)', icon: 'fas fa-person' }),
      new GalleryItem({ id: 8,  title: 'Lucia & Jason',           description: 'Two protagonists, one unstoppable criminal force.',                  category: 'characters', gradient: 'linear-gradient(135deg,#1a0533,#52005e,#c2185b)', icon: 'fas fa-users' }),
      new GalleryItem({ id: 9,  title: 'Boobie Ike',              description: 'Vice City\'s most flamboyant and feared crime lord.',                category: 'characters', gradient: 'linear-gradient(135deg,#1a0033,#4b0082,#7b1fa2)', icon: 'fas fa-crown' }),
      new GalleryItem({ id: 10, title: 'Everglades at Dawn',      description: 'Misty swamplands before the sun rises over Leonida.',                category: 'nature',     gradient: 'linear-gradient(135deg,#002400,#1a4a1a,#52c41a)', icon: 'fas fa-tree' }),
      new GalleryItem({ id: 11, title: 'Tropical Coastline',      description: 'Crystal-clear waters off the Leonida Keys.',                         category: 'nature',     gradient: 'linear-gradient(135deg,#003049,#006994,#00b4d8)', icon: 'fas fa-water' }),
      new GalleryItem({ id: 12, title: 'Leonida Keys Islands',    description: 'Tropical archipelago paradise south of Vice City.',                  category: 'nature',     gradient: 'linear-gradient(135deg,#002a4a,#00688b,#36cfc9)', icon: 'fas fa-mountain-sun' }),
      new GalleryItem({ id: 13, title: 'Countryside at Dusk',     description: 'Sun-baked flatlands stretching to the Leonida horizon.',             category: 'nature',     gradient: 'linear-gradient(135deg,#3b2500,#7c5200,#d4a017)', icon: 'fas fa-sun' }),
      new GalleryItem({ id: 14, title: 'Exotic Supercar',         description: 'Next-gen vehicle physics pushing the limits of speed.',              category: 'vehicles',   gradient: 'linear-gradient(135deg,#1a0000,#7c0000,#f5222d)', icon: 'fas fa-car-side' }),
      new GalleryItem({ id: 15, title: 'Police Helicopter Chase', description: 'Five-star wanted level — every unit on your tail.',                  category: 'vehicles',   gradient: 'linear-gradient(135deg,#001133,#003399,#004fff)', icon: 'fas fa-helicopter' }),
      new GalleryItem({ id: 16, title: 'Swamp Airboat',           description: 'Navigate the Everglades in a fan-driven airboat.',                  category: 'vehicles',   gradient: 'linear-gradient(135deg,#002200,#1a4a00,#389e0d)', icon: 'fas fa-ship' }),
    ];

    this.categories = ['all', 'city', 'characters', 'nature', 'vehicles'];
  }

  /* Render filter buttons */
  _renderFilters() {
    if (!this.filtersEl) return;

    this.filtersEl.innerHTML = this.categories
      .map(cat => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        return `
          <button class="filter-btn ${cat === 'all' ? 'active' : ''}"
                  data-filter="${cat}"
                  aria-pressed="${cat === 'all'}">
            ${label}
          </button>
        `;
      })
      .join('');

    this.filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => this._onFilter(btn));
    });
  }

  _onFilter(btn) {
    // Update active state on buttons
    this.filtersEl.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    this.activeFilter = btn.dataset.filter;
    this._renderItems();
  }

  /* Render (or re-render) gallery cards with a quick fade */
  _renderItems() {
    if (!this.grid) return;

    const filtered = this.activeFilter === 'all'
      ? this.items
      : this.items.filter(item => item.category === this.activeFilter);

    // Brief fade-out → update → fade-in
    this.grid.style.opacity = '0';
    setTimeout(() => {
      this.grid.innerHTML = filtered
        .map((item, i) => item.render(i * 0.045))
        .join('');
      this.grid.style.transition = 'opacity 0.3s ease';
      this.grid.style.opacity    = '1';

      // Re-run scroll reveal on new items
      new ScrollReveal('.gallery-item');
    }, 220);
  }

  init() {
    this._renderFilters();
    this._renderItems();
  }
}

/*
   Stat  –  data model for one animated counter block
   */
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

/* 
   StatsSection  –  renders animated stat counters
  */
class StatsSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // Own curated data
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
    // CounterAnimation is defined in app.js (loaded before home.js)
    new CounterAnimation('.stat-number');
  }
}

/* 
   AboutSection  –  renders the game-info card
   */
class AboutSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // Own curated data
    this.rows = [
      { label: 'Developer',  value: 'Rockstar Games' },
      { label: 'Publisher',  value: 'Take-Two Interactive' },
      { label: 'Setting',    value: 'Leonida / Vice City' },
      { label: 'Platforms',  value: 'PS5 &middot; Xbox Series X|S &middot; PC' },
      { label: 'Release',    value: '2025' },
      { label: 'Engine',     value: 'RAGE Engine (Gen 9)' },
      { label: 'Mode',       value: 'Single-Player + Online' },
      { label: 'Rating',     value: 'TBC (Mature 17+)' },
    ];
  }

  render() {
    if (!this.container) return;

    const rows = this.rows
      .map(r => `
        <div class="info-row">
          <span class="info-label">${r.label}</span>
          <span class="info-value">${r.value}</span>
        </div>
      `)
      .join('');

    this.container.innerHTML = `
      <div class="info-card-header">
        <h3>Game Info</h3>
      </div>
      ${rows}
    `;
  }
}

/*
   Boot – home page initialisation
   */
document.addEventListener('DOMContentLoaded', () => {
  new FeaturesSection('featuresGrid').render();
  new Gallery('galleryGrid', 'galleryFilters').init();
  new StatsSection('statsGrid').render();
  new AboutSection('gameInfoCard').render();
});
