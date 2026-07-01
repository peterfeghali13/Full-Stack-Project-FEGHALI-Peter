'use strict';

/* ── API CONFIGURATION ──────────────────────────────────────── */
/*
   Wikipedia Action API — completely free, no account, no API key.
   Adding  origin=*  to the query string is all that is needed to
   enable full CORS access from any browser / any static host.

   Docs: https://www.mediawiki.org/wiki/API:Cross-site_requests
*/
const BASE_URL    = 'https://en.wikipedia.org/w/api.php';
const SEARCH_TERM = 'Grand Theft Auto';
const PAGE_SIZE   = 9;

/* ─────────────────────────────────────────────────────────────
   GameCard
   Wraps one Wikipedia page object and renders a styled card.

   Wikipedia response shape (per page, from generator=search):
     { pageid, title, index,
       extract,           ← 2-sentence intro text
       thumbnail: { source, width, height } }
   ───────────────────────────────────────────────────────────── */
class GameCard {
  constructor(page) {
    this.name        = page.title   || 'Unknown Title';
    this.description = this._clean(page.extract || '');
    this.image       = page.thumbnail?.source || null;
    this.pageid      = page.pageid;
    this.url         = `https://en.wikipedia.org/?curid=${page.pageid}`;

    /* Keep platform/genre as empty strings so SearchFilter still works */
    this.platform  = '';
    this.platforms = [];
    this.genre     = '';
    this.score     = 0;
  }

  /* Strip any leftover HTML tags from the extract */
  _clean(html) {
    return html.replace(/<[^>]+>/g, '').trim();
  }

  /* Gradient placeholder when no Wikipedia thumbnail is available */
  _gradient() {
    const lc = this.name.toLowerCase();
    if (lc.includes('vice'))  return 'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)';
    if (lc.includes('san'))   return 'linear-gradient(135deg,#001433,#003a8c,#00d4ff)';
    if (lc.includes('v') || lc.includes('five'))
                               return 'linear-gradient(135deg,#1a1100,#5d4037,#d4a017)';
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

    const desc = this.description
      ? `<p style="font-size:0.82rem;color:var(--text-muted);line-height:1.65;
                   margin:10px 0;display:-webkit-box;-webkit-box-orient:vertical;
                   -webkit-line-clamp:3;overflow:hidden;">
           ${this.description}
         </p>`
      : '';

    return `
      <div class="game-card">
        <div class="game-thumb">${thumbHtml}</div>
        <div class="game-card-body">
          <div class="game-tags">
            <span class="game-tag">GTA Series</span>
            <span class="game-tag">Wikipedia</span>
          </div>
          <h4>${this.name}</h4>
          ${desc}
          <a href="${this.url}" target="_blank" rel="noopener"
             style="color:var(--cyan);font-size:0.78rem;display:inline-block;margin-top:4px;">
            Read on Wikipedia ↗
          </a>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   ApiManager
   Uses Wikipedia's generator=search action with prop=pageimages
   and prop=extracts to fetch cover art + descriptions in one
   request, with no API key and no CORS preflight.

   Pagination: offset-based (gsroffset).  We convert the
   internal 0-based page index to byte offset = page × PAGE_SIZE.
   ───────────────────────────────────────────────────────────── */
class ApiManager {
  constructor() {
    this.currentPage = 0;
    this.hasMore     = true;
    this.hasPrevious = false;
  }

  async fetchGames(query = SEARCH_TERM, page = 0) {
    const offset = page * PAGE_SIZE;

    const params = new URLSearchParams({
      action:       'query',
      generator:    'search',
      gsrsearch:    query,          // e.g. "Grand Theft Auto"
      gsrlimit:     PAGE_SIZE,
      gsroffset:    offset,
      prop:         'pageimages|extracts',
      exintro:      '1',            // only the intro paragraph
      exsentences:  '2',            // limit to 2 sentences
      pithumbsize:  '400',          // thumbnail width in px
      format:       'json',
      origin:       '*',            // ← enables CORS from any domain
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Wikipedia API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.query?.pages) {
      this.hasMore     = false;
      this.hasPrevious = page > 0;
      this.currentPage = page;
      return [];
    }

    /* Pages come back as an object keyed by pageid;
       sort by index to preserve search-ranking order */
    const results = Object.values(data.query.pages)
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    this.hasMore     = !!data.continue;   // Wikipedia sets .continue when more pages exist
    this.hasPrevious = page > 0;
    this.currentPage = page;

    return results.map(p => new GameCard(p));
  }
}

/* ─────────────────────────────────────────────────────────────
   SearchFilter
   Client-side search, sort, and platform filter applied
   to the current page of API results.
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

    /* Text search on title */
    if (this.query) {
      result = result.filter(g =>
        g.name.toLowerCase().includes(this.query)
      );
    }

    /* Platform filter — gracefully ignored for Wikipedia results */
    if (this.platform) {
      result = result.filter(g =>
        g.platform.toLowerCase().includes(this.platform) ||
        g.platforms.some(p => p.toLowerCase().includes(this.platform))
      );
    }

    /* Sort */
    switch (this.sort) {
      case 'rating':
        /* Wikipedia has no score — sort by name alphabetically */
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }
}

/* ─────────────────────────────────────────────────────────────
   MediaPage
   Orchestrates the full media page:
     · loading / error / empty states
     · API fetch + render on page change
     · client-side search, sort, platform filter
     · pagination (prev / next using API page parameter)
   ───────────────────────────────────────────────────────────── */
class MediaPage {
  constructor() {
    this.api         = new ApiManager();
    this.filter      = null;
    this.apiPage     = 0;          // current API page (0-indexed)

    /* DOM references */
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

  /* ── Event listeners ───────────────────────────────────────── */
  _bindEvents() {
    let debounce;
    this._el.search?.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => this._applyClientFilter(), 380);
    });

    this._el.sort?.addEventListener('change',     () => this._applyClientFilter());
    this._el.platform?.addEventListener('change', () => this._applyClientFilter());

    this._el.retry?.addEventListener('click',  () => this._load(this.apiPage));
    this._el.prevBtn?.addEventListener('click', () => this._load(Math.max(0, this.apiPage - 1)));
    this._el.nextBtn?.addEventListener('click', () => this._load(this.apiPage + 1));
  }

  /* ── Client-side filter (no extra API call) ─────────────────── */
  _applyClientFilter() {
    if (!this.filter) return;
    this.filter.update({
      query:    this._el.search?.value   ?? '',
      sort:     this._el.sort?.value     ?? '',
      platform: this._el.platform?.value ?? '',
    });
    this._renderCards(this.filter.apply());
  }

  /* ── UI state machine ───────────────────────────────────────── */
  _setState(state) {
    const { loading, error, empty, grid, resultsBar, pagination } = this._el;

    loading?.classList.add('hidden');
    error?.classList.add('hidden');
    empty?.classList.add('hidden');
    grid?.classList.remove('hidden');
    resultsBar?.classList.add('hidden');
    pagination?.classList.add('hidden');

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
        grid?.classList.remove('hidden');
        resultsBar?.classList.remove('hidden');
        pagination?.classList.remove('hidden');
        break;
    }
  }

  /* ── Render game cards into the grid ───────────────────────── */
  _renderCards(games) {
    if (!games.length) {
      this._setState('empty');
      return;
    }
    this._setState('success');

    if (this._el.grid) {
      this._el.grid.innerHTML = games.map(g => g.render()).join('');
    }
    if (this._el.resultsCnt) {
      this._el.resultsCnt.textContent =
        `Showing ${games.length} result${games.length !== 1 ? 's' : ''}`;
    }

    new ScrollReveal('.game-card');
  }

  /* ── Pagination controls ────────────────────────────────────── */
  _updatePagination() {
    if (this._el.indicator) {
      this._el.indicator.textContent = `Page ${this.apiPage + 1}`;
    }
    if (this._el.prevBtn) this._el.prevBtn.disabled = !this.api.hasPrevious;
    if (this._el.nextBtn) this._el.nextBtn.disabled = !this.api.hasMore;
  }

  /* ── Fetch one API page ─────────────────────────────────────── */
  async _load(page = 0) {
    if (page < 0) return;
    this.apiPage = page;
    this._setState('loading');

    try {
      const games = await this.api.fetchGames(SEARCH_TERM, page);

      if (!games.length && page === 0) {
        /* No results at all */
        this._setState('empty');
        return;
      }

      if (!games.length) {
        /* We went past the last page — back up one */
        this.apiPage = Math.max(0, page - 1);
        this._updatePagination();
        return;
      }

      this.filter = new SearchFilter(games);
      this._renderCards(games);
      this._updatePagination();

    } catch (err) {
      console.error('[MediaPage] fetch error:', err);
      this._setState('error');
      if (this._el.errorMsg) {
        this._el.errorMsg.textContent = err.message;
      }
    }
  }

  init() {
    this._load(0);
  }
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
