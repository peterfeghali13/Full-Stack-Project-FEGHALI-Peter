'use strict';

/* ── API CONFIGURATION ──────────────────────────────────────── */
const BASE_URL  = 'https://en.wikipedia.org/w/api.php';
const PAGE_SIZE = 6;

/* ── HARDCODED GTA GAME LIST ────────────────────────────────── */
/*
   We control exactly which titles appear (only real GTA games)
   and supply the platform data that Wikipedia doesn't provide.
   Wikipedia is used only to fetch descriptions + cover art
   for these specific titles — no search needed.
*/
const GTA_GAMES = [
  { title: 'Grand Theft Auto',                         platforms: ['PC', 'PlayStation'],                              released: '1997' },
  { title: 'Grand Theft Auto 2',                       platforms: ['PC', 'PlayStation'],                              released: '1999' },
  { title: 'Grand Theft Auto III',                     platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2001' },
  { title: 'Grand Theft Auto: Vice City',              platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2002' },
  { title: 'Grand Theft Auto: San Andreas',            platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2004' },
  { title: 'Grand Theft Auto: Liberty City Stories',   platforms: ['PlayStation'],                                    released: '2005' },
  { title: 'Grand Theft Auto: Vice City Stories',      platforms: ['PlayStation'],                                    released: '2006' },
  { title: 'Grand Theft Auto IV',                      platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2008' },
  { title: 'Grand Theft Auto IV: The Lost and Damned', platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2009' },
  { title: 'Grand Theft Auto: The Ballad of Gay Tony', platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2009' },
  { title: 'Grand Theft Auto: Chinatown Wars',         platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],   released: '2009' },
  { title: 'Grand Theft Auto V',                       platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2013' },
  { title: 'Grand Theft Auto Online',                  platforms: ['PC', 'PlayStation', 'Xbox'],                      released: '2013' },
  { title: 'Grand Theft Auto VI',                      platforms: ['PlayStation', 'Xbox'],                            released: '2026', releaseLabel: 'Releasing soon — November 19th, 2026' },
];

/* ─────────────────────────────────────────────────────────────
   GameCard
   Wraps one Wikipedia page object + one GTA_GAMES entry.
   ───────────────────────────────────────────────────────────── */
class GameCard {
  constructor(wikiPage, gameEntry) {
    this.name        = wikiPage.title    || gameEntry.title;
    this.description = this._clean(wikiPage.extract || '');
    this.image       = wikiPage.thumbnail?.source   || null;
    this.pageid      = wikiPage.pageid   || null;
    this.url         = this.pageid
      ? `https://en.wikipedia.org/?curid=${this.pageid}`
      : `https://en.wikipedia.org/wiki/${encodeURIComponent(gameEntry.title)}`;

    /* Platform data comes from the hardcoded list — always populated */
    this.platforms   = gameEntry.platforms || [];
    this.platform    = this.platforms.join(', ');
    this.releaseYear = gameEntry.released     || '';   // raw year, used for sorting
    this.released    = gameEntry.releaseLabel || gameEntry.released || ''; // shown on the card
    this.isCustomReleaseLabel = Boolean(gameEntry.releaseLabel);

    /* Kept for SearchFilter compatibility */
    this.genre = '';
    this.score = 0;
  }

  _clean(html) {
    return html.replace(/<[^>]+>/g, '').trim();
  }

  _gradient() {
    const lc = this.name.toLowerCase();
    if (lc.includes('vice'))          return 'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)';
    if (lc.includes('san andreas'))   return 'linear-gradient(135deg,#001a00,#004d00,#00aa00)';
    if (lc.includes('iv') || lc.includes('four'))
                                       return 'linear-gradient(135deg,#001433,#003a8c,#00d4ff)';
    if (lc.includes('online'))        return 'linear-gradient(135deg,#00001a,#00004d,#0000ff)';
    if (lc.includes('vi') || lc.includes('six'))
                                       return 'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)';
    return 'linear-gradient(135deg,#0d0020,#4b0082,#9900cc)';
  }

  render() {
    const thumbHtml = this.image
      ? `<img src="${this.image}" alt="${this.name} cover"
              loading="lazy"
              style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<div style="width:100%;height:100%;background:${this._gradient()};
                     display:flex;align-items:center;justify-content:center;">
           <i class="fas fa-gamepad"
              style="font-size:2rem;color:rgba(255,255,255,.35);" aria-hidden="true"></i>
         </div>`;

    const platformTags = this.platforms
      .map(p => `<span class="game-tag">${p}</span>`)
      .join('');

    const releasedHtml = this.released
      ? `<span style="color:var(--text-muted);font-size:0.78rem;display:block;margin-top:6px;">
           ${this.isCustomReleaseLabel ? this.released : `Released: ${this.released}`}
         </span>`
      : '';

    const descHtml = this.description
      ? `<p style="font-size:0.82rem;color:var(--text-muted);line-height:1.65;margin:10px 0;
                   display:-webkit-box;-webkit-box-orient:vertical;
                   -webkit-line-clamp:3;overflow:hidden;">
           ${this.description}
         </p>`
      : '';

    return `
      <a href="${this.url}" target="_blank" rel="noopener" class="game-card-link">
        <div class="game-card">
          <div class="game-thumb">${thumbHtml}</div>
          <div class="game-card-body">
            <div class="game-tags">${platformTags}</div>
            <h4>${this.name}</h4>
            ${releasedHtml}
            ${descHtml}
            <span class="game-wiki-hint">Read on Wikipedia ↗</span>
          </div>
        </div>
      </a>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   ApiManager
   Fetches Wikipedia descriptions + thumbnails for each entry
   in GTA_GAMES using the titles= parameter (no search needed,
   no custom headers, no CORS issue, no API key).
   All 14 titles are loaded in a single request and cached —
   pagination and filtering are handled client-side.
   ───────────────────────────────────────────────────────────── */
class ApiManager {
  constructor() {
    this._cache = null;   // populated on first fetch, reused after
  }

  async fetchAllGames() {
    if (this._cache) return this._cache;

    const titles = GTA_GAMES.map(g => g.title).join('|');
    const params = new URLSearchParams({
      action:      'query',
      titles:      titles,
      prop:        'pageimages|extracts',
      exintro:     '1',
      exsentences: '2',
      pithumbsize: '400',
      pilicense:   'any',   // ← include non-free (fair-use) box art too — otherwise
                             //    Wikipedia only returns freely-licensed images, which
                             //    is why current titles like GTA Online / GTA VI (whose
                             //    only cover art is non-free) fell back to the gradient
      redirects:   '1',     // ← auto-resolve if a title is a redirect to the real
                             //    article, instead of silently returning nothing
      format:      'json',
      origin:      '*',   // ← enables CORS from any domain, no preflight
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Wikipedia API error ${response.status}: ${response.statusText}`);
    }

    const data  = await response.json();
    const pages = data.query?.pages || {};

    /* Match Wikipedia pages back to our ordered GTA_GAMES list */
    this._cache = GTA_GAMES.map(game => {
      const wikiPage = Object.values(pages).find(
        p => p.title.toLowerCase() === game.title.toLowerCase()
      ) || { title: game.title };
      return new GameCard(wikiPage, game);
    });

    return this._cache;
  }
}

/* ─────────────────────────────────────────────────────────────
   SearchFilter
   Client-side search, platform filter, and sort applied to ALL
   14 GTA game cards loaded upfront.
   ───────────────────────────────────────────────────────────── */
class SearchFilter {
  constructor(games) {
    this.allGames = games;
    this.query    = '';
    this.sort     = '';
    this.platform = '';
  }

  update({ query, sort, platform }) {
    if (query    !== undefined) this.query    = query.trim().toLowerCase();
    if (sort     !== undefined) this.sort     = sort;
    if (platform !== undefined) this.platform = platform.toLowerCase();
  }

  apply() {
    let result = [...this.allGames];

    /* Title search */
    if (this.query) {
      result = result.filter(g =>
        g.name.toLowerCase().includes(this.query)
      );
    }

    /* Platform filter — g.platforms is now populated from GTA_GAMES */
    if (this.platform) {
      result = result.filter(g =>
        g.platforms.some(p => p.toLowerCase().includes(this.platform))
      );
    }

    /* Sort */
    if (this.sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sort === 'rating') {
      /* No score data — sort by release year */
      result.sort((a, b) => (a.releaseYear || '').localeCompare(b.releaseYear || ''));
    }

    return result;
  }
}

/* ─────────────────────────────────────────────────────────────
   MediaPage
   · One-time fetch of all 14 GTA games from Wikipedia
   · All search / sort / platform filtering done client-side
   · Pagination done client-side — no extra API calls
   ───────────────────────────────────────────────────────────── */
class MediaPage {
  constructor() {
    this.api         = new ApiManager();
    this.filter      = null;
    this.displayPage = 0;   // client-side page (0-indexed)

    this._el = {
      loading:    document.getElementById('apiLoading'),
      error:      document.getElementById('apiError'),
      errorMsg:   document.getElementById('apiErrorMsg'),
      empty:      document.getElementById('apiEmpty'),
      grid:       document.getElementById('gamesGrid'),
      resultsBar: document.getElementById('resultsBar'),
      resultsCnt: document.getElementById('resultsCount'),
      pagination: document.getElementById('paginationControls'),
      indicator:  document.getElementById('pageIndicator'),
      prevBtn:    document.getElementById('prevBtn'),
      nextBtn:    document.getElementById('nextBtn'),
      search:     document.getElementById('searchInput'),
      sort:       document.getElementById('sortSelect'),
      platform:   document.getElementById('platformFilter'),
      retry:      document.getElementById('retryBtn'),
    };

    this._bindEvents();
  }

  _bindEvents() {
    let debounce;
    this._el.search?.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        this.displayPage = 0;
        this._applyClientFilter();
      }, 380);
    });

    this._el.sort?.addEventListener('change', () => {
      this.displayPage = 0;
      this._applyClientFilter();
    });
    this._el.platform?.addEventListener('change', () => {
      this.displayPage = 0;
      this._applyClientFilter();
    });

    this._el.retry?.addEventListener('click', () => this._load());

    this._el.prevBtn?.addEventListener('click', () => {
      if (this.displayPage > 0) { this.displayPage--; this._applyClientFilter(); }
    });
    this._el.nextBtn?.addEventListener('click', () => {
      this.displayPage++;
      this._applyClientFilter();
    });
  }

  /* Filter + paginate all 14 games client-side */
  _applyClientFilter() {
    if (!this.filter) return;

    this.filter.update({
      query:    this._el.search?.value   ?? '',
      sort:     this._el.sort?.value     ?? '',
      platform: this._el.platform?.value ?? '',
    });

    const allFiltered = this.filter.apply();
    const start       = this.displayPage * PAGE_SIZE;
    const slice       = allFiltered.slice(start, start + PAGE_SIZE);
    const hasMore     = (start + PAGE_SIZE) < allFiltered.length;

    if (this._el.indicator) {
      this._el.indicator.textContent = `Page ${this.displayPage + 1}`;
    }
    if (this._el.prevBtn) this._el.prevBtn.disabled = this.displayPage === 0;
    if (this._el.nextBtn) this._el.nextBtn.disabled = !hasMore;

    this._renderCards(slice, allFiltered.length);
  }

  _setState(state) {
    const { loading, error, empty, grid, resultsBar, pagination } = this._el;
    loading?.classList.add('hidden');
    error?.classList.add('hidden');
    empty?.classList.add('hidden');
    resultsBar?.classList.add('hidden');
    pagination?.classList.add('hidden');
    grid?.classList.remove('hidden');

    switch (state) {
      case 'loading':
        loading?.classList.remove('hidden');
        grid?.classList.add('hidden');
        break;
      case 'error':
        error?.classList.remove('hidden');
        grid?.classList.add('hidden');
        break;
      case 'empty':
        empty?.classList.remove('hidden');
        grid?.classList.add('hidden');
        break;
      case 'success':
        resultsBar?.classList.remove('hidden');
        pagination?.classList.remove('hidden');
        break;
    }
  }

  _renderCards(games, total) {
    if (!games.length) { this._setState('empty'); return; }
    this._setState('success');

    if (this._el.grid) {
      this._el.grid.innerHTML = games.map(g => g.render()).join('');
      this._el.grid.dataset.count = games.length < 3 ? String(games.length) : 'full';
    }
    if (this._el.resultsCnt) {
      const of = total != null && total !== games.length ? ` of ${total}` : '';
      this._el.resultsCnt.textContent =
        `Showing ${games.length}${of} result${total !== 1 ? 's' : ''}`;
    }
    new ScrollReveal('.game-card');
  }

  async _load() {
    this._setState('loading');
    try {
      const games = await this.api.fetchAllGames();
      if (!games.length) { this._setState('empty'); return; }
      this.filter = new SearchFilter(games);
      this._applyClientFilter();
    } catch (err) {
      console.error('[MediaPage] fetch error:', err);
      this._setState('error');
      if (this._el.errorMsg) this._el.errorMsg.textContent = err.message;
    }
  }

  init() { this._load(); }
}

/* ─────────────────────────────────────────────────────────────
   TrailerModal  –  shared Bootstrap modal that plays a YouTube
   trailer inline (embedded iframe) instead of leaving the site.
   Mirrors the gallery lightbox modal: stacked media on top,
   then badge / title / description below.
   ───────────────────────────────────────────────────────────── */
class TrailerModal {
  constructor() {
    const el = document.getElementById('trailerModal');
    this.el       = el;
    this.instance = (el && window.bootstrap) ? new bootstrap.Modal(el) : null;
    this.videoEl  = document.getElementById('trailerModalVideo');

    // Stop playback the moment the modal finishes closing
    if (this.el) {
      this.el.addEventListener('hidden.bs.modal', () => this._stop());
    }
  }

  open({ videoId, title, badge, badgeClass, description }) {
    document.getElementById('trailerModalTitle').textContent   = title;
    document.getElementById('trailerModalHeading').textContent = title;
    document.getElementById('trailerModalDesc').textContent    = description;

    const badgeEl = document.getElementById('trailerModalBadge');
    badgeEl.textContent = badge;
    badgeEl.className   = 'trailer-badge' + (badgeClass ? ` ${badgeClass}` : '');

    // Embed the YouTube player with autoplay, muted-free, no related videos
    this.videoEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;

    if (this.instance) this.instance.show();
  }

  /* Remove the iframe so audio/video actually stops once closed */
  _stop() {
    this.videoEl.innerHTML = '';
  }
}

/* ─────────────────────────────────────────────────────────────
   TrailersSection  –  binds both trailer thumbnails to the
   TrailerModal, reading trailer data straight off data-* attrs.
   ───────────────────────────────────────────────────────────── */
class TrailersSection {
  constructor() {
    this.modal = new TrailerModal();
    this._bindEvents();
  }

  _bindEvents() {
    document.querySelectorAll('.trailer-thumb').forEach(thumb => {
      const open = () => {
        this.modal.open({
          videoId:    thumb.dataset.videoId,
          title:      thumb.dataset.title,
          badge:      thumb.dataset.badge,
          badgeClass: thumb.dataset.badgeClass,
          description: thumb.dataset.description,
        });
      };
      thumb.addEventListener('click', open);
      thumb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   Boot – media page initialisation
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new TrailersSection();
  new MediaPage().init();
});
