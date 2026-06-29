# GTA VI – Fan Website
### Lebanese University · Faculty of Engineering · Branch 2 – Roumieh
### Full Stack Development – Final Project 2026

**Student:** Peter Feghali   


---

## Project Description

A fan-made, three-page website dedicated to **Grand Theft Auto VI**, built as the
final project for the Full Stack Development course at Lebanese University (Branch 2 – Roumieh).

The site covers the game's characters, world locations, a screenshot gallery, official
media, and a live game-data browser powered by the RAWG.io API — all wrapped in a
dark, cinematic Vice City aesthetic with neon pink and cyan accents.

---

## Pages

| Page | File | Description |
|---|---|---|
| **Home** | `index.html` | Hero section, features grid, 3-column Flexbox gallery (unique requirement), animated stats, and game-info card |
| **World** | `world.html` | Character cards (6), location cards (5), and a story timeline (5 events) |
| **Media** | `media.html` | Official YouTube trailer embed + RAWG.io API game browser with search, filter, sort, and pagination |

---

## Technologies Used

| Technology | Usage |
|---|---|
| **HTML5** | Semantic elements throughout — `<nav>`, `<section>`, `<article>`, `<footer>`, `<main>` |
| **CSS3** | Custom properties, Flexbox layout, CSS Grid, keyframe animations, responsive media queries |
| **Bootstrap 5.3** | Navbar collapse, utility classes, responsive breakpoints |
| **JavaScript ES6** | All logic written as ES6 classes — no jQuery, no older syntax |
| **RAWG.io API** | Public gaming database — game titles, ratings, platform tags, cover art |
| **Font Awesome 6** | Icons throughout the site |
| **Google Fonts** | Bebas Neue (display headings) + Inter (body text) |

---

## File Structure

```
gta6-website/
├── index.html              ← Home page
├── world.html              ← World / Characters / Locations
├── media.html              ← Trailer + API game browser
│
├── css/
│   └── style.css           ← All hand-written styles (600+ lines)
│
├── js/
│   ├── app.js              ← Shared: Navbar, CounterAnimation, ScrollReveal
│   ├── home.js             ← FeaturesSection, Gallery, StatsSection, AboutSection
│   ├── world.js            ← CharactersSection, LocationsSection, Timeline
│   └── media.js            ← ApiManager, GameCard, SearchFilter, MediaPage
│
├── screenshots/            ← Evidence: mobile / tablet / desktop screenshots
│   ├── desktop.png
│   ├── tablet.png
│   └── mobile.png
│
└── README.md
```

---

## API Used

**API Ninjas** – Games endpoint (metacritic scores, platforms, genres)
Endpoint: `https://api.api-ninjas.com/v1/games`  
Docs / Registration: <https://api-ninjas.com> *(free — no credit card required)*

### How to set up your API key

1. Visit <https://api-ninjas.com> and click **Get API key**
2. Register with your email (takes about 30 seconds)
3. Copy your key
4. Open `js/media.js`
5. On **line 22**, replace `YOUR_RAWG_API_KEY` with your actual key:

```js
const API_KEY = 'paste_your_key_here';
```

6. Save the file — the Media page will now load live game data

> **Note:** If no key is set, the error state is shown with a clear message explaining
> exactly what to do. All other pages work perfectly without an API key.

---

## Unique Front-End Requirement

> **Assigned to Peter Feghali:**  
> *"Create a responsive 3-column layout using Flexbox for a gallery"*

### Where it is implemented

- **HTML:** `index.html` — `#gallery` section, elements `#galleryFilters` and `#galleryGrid`
- **CSS:** `css/style.css` — section **8. GALLERY (UNIQUE REQUIREMENT)**, lines marked with comments
- **JS:** `js/home.js` — `GalleryItem` class and `Gallery` class

### How it works

```css
/* 3 columns on desktop */
.gallery-grid  { display: flex; flex-wrap: wrap; gap: 20px; }
.gallery-item  { flex: 1 1 calc(33.333% - 14px); }

/* 2 columns on tablet (≤992px) */
@media (max-width: 992px) {
  .gallery-item { flex: 1 1 calc(50% - 10px); }
}

/* 1 column on mobile (≤768px) */
@media (max-width: 768px) {
  .gallery-item { flex: 1 1 100%; }
}
```

The gallery also features **category filter buttons** (All / City / Characters / Nature /
Vehicles) powered by the `Gallery` ES6 class in `home.js`. Clicking a filter fades
the grid out, swaps the cards, and fades it back in — with no page reload.

The gallery contains **16 curated items** (own content), satisfying the 15+ requirement.

---

## Own Content Summary (15+ items required)

| Category | Items | Count |
|---|---|---|
| Gallery cards (Home) | 16 themed Vice City scenes | 16 |
| Game features (Home) | Vice City, AI, vehicles, online, etc. | 6 |
| Game info rows (Home) | Developer, platforms, engine, etc. | 8 |
| Characters (World) | Lucia, Jason, Boobie Ike, Cal, Dave, Raul | 6 |
| Locations (World) | Vice City, Keys, Everglades, Port Gellhorn, Countryside | 5 |
| Timeline events (World) | Trailer 1, protagonists reveal, Trailer 2, release | 5 |
| **Total** | | **46 items** |

---

## Deployment Guide

### Option A – GitHub Pages (recommended, completely free)

1. Push this repository to a **public** GitHub repo
2. Go to **Settings → Pages**
3. Under *Source*, select `main` branch and `/ (root)` folder
4. Click **Save** — your site will be live at:
   `https://yourusername.github.io/your-repo-name`

### Option B – Netlify

1. Go to <https://netlify.com> and log in
2. Drag and drop the entire `gta6-website/` folder onto the Netlify dashboard
3. Your site is live instantly with a `*.netlify.app` URL

### Option C – Vercel

1. Go to <https://vercel.com> and connect your GitHub account
2. Click **Add New → Project** and import your repository
3. Click **Deploy** — no configuration needed for a static site

> All three options are 100% free and require no server-side code.

---

## Version Control Notes

Commits should be descriptive and incremental throughout development. Examples:

```
feat: add navbar with scroll effect
feat: implement 3-column flexbox gallery with filter buttons
feat: add character cards to world page
feat: integrate RAWG API with loading/error/empty states
fix: correct gallery flex calc to account for gap
style: add neon glow effect to hero roman numeral
docs: complete README with AI-use appendix
```

---

## AI-Use Appendix

*(Required disclosure — honest and specific as per project guidelines)*

### Tools Used

| Tool | What it was used for |
|---|---|
| **Claude (Anthropic)** | Initial project architecture, ES6 class structure, CSS custom-property naming, debugging flexbox gap calculation, writing JSDoc-style comments |
| **ChatGPT (OpenAI)** | Brainstorming GTA VI character descriptions and location lore, suggesting colour palette names for Vice City theme |

### Sample Prompts Used

1. *"I need to build a responsive 3-column gallery using only Flexbox (no Grid). Each item should be `calc(33.333% - gap)` and collapse to 2 columns on tablet and 1 on mobile. Show me the CSS and explain the math."*

2. *"Write an ES6 class called `Gallery` that holds an array of `GalleryItem` objects, renders filter buttons from a category list, and re-renders the grid with a fade transition when a filter is clicked. No jQuery."*

3. *"My RAWG API fetch throws a second error when the response is not JSON — for example on a 503 server error it returns HTML. How do I safely handle this without calling `.json()` on a non-JSON body?"*

### What the AI Got Wrong — and How I Fixed It

**1. Gallery flex item calculation was overflowing**

Claude initially suggested `flex: 1 1 33.333%` without accounting for the `gap`
between columns. With a `20px` gap, three items at exactly `33.333%` each add up to
`100% + 40px`, causing the third card to wrap to a new row on its own.

*Fix:* I changed it to `flex: 1 1 calc(33.333% - 14px)` — subtracting roughly
two-thirds of the total gap per item (`40px / 3 ≈ 13.3px`, rounded to 14px).
I tested this at multiple viewport widths in DevTools until the three columns
sat perfectly side-by-side.

**2. `ScrollReveal` re-triggering on gallery filter broke animations**

When the `Gallery` class filtered items and re-rendered the grid, the `ScrollReveal`
class (set up once on `DOMContentLoaded`) had already unobserved the old elements.
The new cards injected by the filter had no observer and never received `.sr-visible`,
so they stayed invisible after the fade-in.

*Fix:* I added a call to `new ScrollReveal('.gallery-item')` inside `Gallery._renderItems()`
after the grid HTML is updated, so each new batch of cards gets its own fresh
`IntersectionObserver`. This meant `ScrollReveal` also needed to not add `.sr-hidden` to
elements that were already observed — I handled this by scoping the selector to only
elements that don't yet have `.sr-hidden` or `.sr-visible` on them.

---

## Disclaimer

This is a **fan-made educational website** created for a university course project.
Grand Theft Auto VI, Rockstar Games, Vice City, and all related trademarks and
intellectual property belong to **Rockstar Games / Take-Two Interactive**.
This site is not affiliated with, endorsed by, or connected to Rockstar Games in any way.
