'use strict';

/* ── API CONFIGURATION ──────────────────────────────────────── */
const API_KEY     = 'h4jr2y3ptgswNUFvtqMf0N4KLz5EMAhQ5PBHvbAM';  // ← paste your key here
const BASE_URL    = 'https://api.api-ninjas.com/v1/games';
const SEARCH_TERM = 'grand theft auto';
const PAGE_SIZE   = 9;   // results shown per page

/* ─────────────────────────────────────────────────────────────
   GameCard
   Wraps one API Ninjas game object and renders a styled card.

   API Ninjas games response shape:
     { name, platform, genre, score, url }
     score  = Metacritic score  0–100
   ───────────────────────────────────────────────────────────── */
class GameCard {
  constructor(rawGame) {
    this.name     = rawGame.name     || 'Unknown Title';
    this.platform = rawGame.platform || '';
    this.genre    = rawGame.genre    || '';
    this.score    = rawGame.score    || 0;   // Metacritic 0–100
    this.url      = rawGame.url      || '#';
  }

  /* Convert raw Metacritic score to a /5 rating for display */
  _ratingOf5() {
    return (this.score / 20).toFixed(1);   // e.g. 97 → 4.9
  }

  /* Gradient placeholder — different colour per genre */
  _gradient() {
    const map = {
      action:    'linear-gradient(135deg,#1a0533,#6b1069,#e91e8c)',
      racing:    'linear-gradient(135deg,#1a0000,#7c0000,#f5222d)',
      adventure: 'linear-gradient(135deg,#001433,#003a8c,#00d4ff)',
      rpg:       'linear-gradient(135deg,#002400,#1a4a1a,#52c41a)',
      shooter:   'linear-gradient(135deg,#1a1100,#5d4037,#d4a017)',
    };
    const key = Object.keys(map).find(k =>
      this.genre.toLowerCase().includes(k)
    );
    return map[key] || 'linear-gradient(135deg,#0d0020,#4b0082,#9900cc)';
  }

  _icon() {
    const g = this.genre.toLowerCase();
    if (g.includes('action'))    return 'fas fa-gun';
    if (g.includes('racing'))    return 'fas fa-car-side';
    if (g.includes('adventure')) return 'fas fa-compass';
    if (g.includes('rpg'))       return 'fas fa-shield-halved';
    if (g.includes('shooter'))   return 'fas fa-crosshairs';
    return 'fas fa-gamepad';
  }

  /* Platform tag – shorten long strings */
  _shortPlatform(str) {
    if (!str) return '';
    if (/PlayStation\s*5/i.test(str))  return 'PS5';
    if (/PlayStation\s*4/i.test(str))  return 'PS4';
    if (/PlayStation\s*3/i.test(str))  return 'PS3';
    if (/PlayStation\s*2/i.test(str))  return 'PS2';
    if (/PlayStation\s*1|PS1|PSX/i.test(str)) return 'PS1';
    if (/Xbox Series/i.test(str))      return 'Xbox Series';
    if (/Xbox One/i.test(str))         return 'Xbox One';
    if (/Xbox 360/i.test(str))         return 'Xbox 360';
    if (/Nintendo Switch/i.test(str))  return 'Switch';
    if (/PC|Windows/i.test(str))       return 'PC';
    return str.slice(0, 10);
  }

  /* Score badge colour */
  _scoreColor() {
    if (this.score >= 85) return '#52c41a';   // green  – great
    if (this.score >= 70) return '#f5c518';   // gold   – good
    if (this.score  > 0)  return '#fa8c16';   // orange – mixed
    return 'var(--text-muted)';               // grey   – no score
  }

  render() {
    const platformTag = this.platform
      ? `<span class="game-tag">${this._shortPlatform(this.platform)}</span>`
      : '';
    const genreTag = this.genre
      ? `<span class="game-tag">${this.genre}</span>`
      : '';

    const scoreHtml = this.score
      ? `<span style="color:${this._scoreColor()};font-weight:700;font-size:0.92rem;">
           ${this.score}<span style="font-size:0.72rem;color:var(--text-muted)">/100</span>
         </span>
         <span class="game-rating" style="margin-left:8px">
           <i class="fas fa-star" aria-hidden="true"></i>
           <span>${this._ratingOf5()}</span>
         </span>`
      : `<span style="color:var(--text-muted);font-size:0.85rem">No score</span>`;

    const linkHtml = this.url && this.url !== '#'
      ? `<a href="${this.url}" target="_blank" rel="noopener"
            style="color:var(--cyan);font-size:0.78rem;margin-top:4px;display:inline-block">
           View on Metacritic ↗
         </a>`
      : '';

    return `
      <div class="game-card">
        <div class="game-thumb">
          <div class="game-thumb-placeholder" style="background:${this._gradient()}">
            <i class="${this._icon()}" aria-hidden="true"></i>
          </div>
        </div>
        <div class="game-card-body">
          <div class="game-tags">${platformTag}${genreTag}</div>
          <h4>${this.name}</h4>
          <div class="game-meta">
            <div style="display:flex;align-items:center;gap:4px">${scoreHtml}</div>
          </div>
          ${linkHtml}
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   ApiManager
   Handles all API Ninjas fetch calls.
   API Ninjas uses page-based pagination (0, 1, 2 …).
   Each page returns up to 10 results.
   There is no total count — we detect end-of-results when the
   returned array is empty.
   ───────────────────────────────────────────────────────────── */
class ApiManager {
  constructor() {
    this.currentPage  = 0;
    this.hasMore      = true;   // false when API returns empty array
    this.hasPrevious  = false;
  }

  async fetchGames(query = SEARCH_TERM, page = 0) {
    /* Key guard */
    if (!API_KEY || API_KEY === 'YOUR_API_NINJAS_KEY') {
      throw new Error(
        'No API key set. Open js/media.js and replace YOUR_API_NINJAS_KEY ' +
        'with your free key from api-ninjas.com → My Account.'
      );
    }

    const params = new URLSearchParams({
      name: query,
      page,
    });

    const response = await fetch(`${BASE_URL}?${params}`, {
      headers: { 'X-Api-Key': API_KEY },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'Invalid API key. Double-check it at api-ninjas.com → My Account.'
        );
      }
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    /* API Ninjas returns an array; empty = no more pages */
    const results  = Array.isArray(data) ? data : [];
    this.hasMore   = results.length > 0;
    this.hasPrevious = page > 0;
    this.currentPage = page;

    return results.map(g => new GameCard(g));
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

    /* Platform filter – partial match on the platform string */
    if (this.platform) {
      result = result.filter(g =>
        g.platform.toLowerCase().includes(this.platform)
      );
    }

    /* Sort */
    switch (this.sort) {
      case 'rating':
        result.sort((a, b) => b.score - a.score);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'released':
        /* API Ninjas doesn't return release year — fall back to score */
        result.sort((a, b) => b.score - a.score);
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
    this._el.prevBtn?.addEventListener('click', () => this._load(this.apiPage - 1));
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
    const displayPage = this.apiPage + 1;  // show 1-based to user
    if (this._el.indicator) {
      this._el.indicator.textContent = `Page ${displayPage}`;
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
        this.apiPage = page - 1;
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
