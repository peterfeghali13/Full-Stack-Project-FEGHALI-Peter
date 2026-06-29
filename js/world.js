

'use strict';

/* ─────────────────────────────────────────────────────────────
   Character  –  card with a real photo portrait
   ───────────────────────────────────────────────────────────── */
class Character {
  constructor({ name, role, description, image, fallbackGradient, traits }) {
    this.name             = name;
    this.role             = role;
    this.description      = description;
    this.image            = image;
    this.fallbackGradient = fallbackGradient;
    this.traits           = traits;
  }

  render() {
    const traits = this.traits.map(t => `<span class="trait-tag">${t}</span>`).join('');
    return `
      <div class="character-card">
        <div class="character-portrait" style="background:${this.fallbackGradient}">
          <img
            src="${this.image}"
            alt="${this.name}"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="character-body">
          <span class="character-role">${this.role}</span>
          <h3>${this.name}</h3>
          <p>${this.description}</p>
          <div class="character-traits">${traits}</div>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   CharactersSection  –  6 character cards with real photos
   ───────────────────────────────────────────────────────────── */
class CharactersSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.characters = [
      new Character({
        name: 'Lucia Caminos',
        role: 'Protagonist',
        description: 'The first playable female lead in the mainline GTA series. A woman from humble origins in Leonida who carves her own path through the criminal underworld through sheer determination and street cunning.',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#1a0010,#7c1a35,#c2185b)',
        traits: ['Survivor', 'Street Smart', 'Resilient', 'Ambitious'],
      }),
      new Character({
        name: 'Jason Duval',
        role: 'Protagonist',
        description: 'Lucia\'s partner in crime and co-protagonist. Raised in Leonida\'s unforgiving environment, Jason is fiercely loyal to those he trusts — and utterly merciless to those who cross him.',
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#0d1117,#1f2937,#374151)',
        traits: ['Tactical', 'Loyal', 'Street-wise', 'Determined'],
      }),
      new Character({
        name: 'Boobie Ike',
        role: 'Crime Boss',
        description: 'A flamboyant and powerful crime lord who controls significant territory across Vice City. His gaudy exterior conceals an exceptionally calculating and ruthless criminal mind.',
        image: 'https://images.unsplash.com/photo-1500520198921-6d4704ab3ad7?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#1a0033,#4b0082,#7b1fa2)',
        traits: ['Charismatic', 'Ruthless', 'Wealthy', 'Influential'],
      }),
      new Character({
        name: 'Cal',
        role: 'Supporting',
        description: 'A mysterious connection from the fringes of Leonida\'s criminal network. Cal serves as both an asset and a potential liability — his true motivations remain unclear throughout the story.',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#001a00,#1b5e20,#388e3c)',
        traits: ['Mysterious', 'Resourceful', 'Unpredictable'],
      }),
      new Character({
        name: 'Dave',
        role: 'Supporting',
        description: 'One of Lucia and Jason\'s most reliable contacts in Leonida. Dave\'s deep local knowledge of the state\'s criminal networks and hideouts proves invaluable throughout the story.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#001433,#0d2d6b,#1565c0)',
        traits: ['Reliable', 'Resourceful', 'Low Profile'],
      }),
      new Character({
        name: 'Raul',
        role: 'Antagonist',
        description: 'A high-ranking enforcer with deep ties to organised crime across Leonida\'s underworld. Raul\'s violent nature and pride put him on an inevitable collision course with Lucia and Jason.',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80',
        fallbackGradient: 'linear-gradient(135deg,#1a0500,#7c1a00,#c62828)',
        traits: ['Violent', 'Disciplined', 'Feared', 'Ruthless'],
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.characters.map(c => c.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   Location  –  card with a real photo background
   ───────────────────────────────────────────────────────────── */
class Location {
  constructor({ name, type, description, image, fallbackGradient }) {
    this.name             = name;
    this.type             = type;
    this.description      = description;
    this.image            = image;
    this.fallbackGradient = fallbackGradient;
  }

  render() {
    return `
      <div class="location-card">
        <div class="location-bg" style="background:${this.fallbackGradient}">
          <img
            src="${this.image}"
            alt="${this.name}"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="location-info">
          <div class="location-type">${this.type}</div>
          <h3>${this.name}</h3>
          <p>${this.description}</p>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   LocationsSection  –  5 location cards with real photos
   ───────────────────────────────────────────────────────────── */
class LocationsSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.locations = [
      new Location({
        name: 'Vice City',
        type: 'Major City',
        description: 'The neon-drenched, sun-kissed capital of Leonida State. Inspired by Miami, it\'s a city of extremes — obscene wealth beside desperate poverty, all set against an endless ocean horizon.',
        image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=80',
        fallbackGradient: 'linear-gradient(135deg,#1a0033,#6b0f6b,#e91e8c)',
      }),
      new Location({
        name: 'The Leonida Keys',
        type: 'Island Chain',
        description: 'A string of tropical islands south of Vice City, inspired by the Florida Keys. Luxury resorts, isolated marinas, and hidden criminal operations pepper the archipelago.',
        image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=900&q=80',
        fallbackGradient: 'linear-gradient(135deg,#003049,#0077b6,#00b4d8)',
      }),
      new Location({
        name: 'The Everglades',
        type: 'Wilderness',
        description: 'A vast and mysterious swampland stretching across inland Leonida. Airboats, alligators, and criminal hideouts lurk beneath the dense green canopy.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
        fallbackGradient: 'linear-gradient(135deg,#002400,#1b5e20,#33691e)',
      }),
      new Location({
        name: 'Port Gellhorn',
        type: 'Port Town',
        description: 'A gritty industrial harbour town north of Vice City. The docks are a major hub for smuggling operations, tightly controlled by feuding criminal factions.',
        image: 'https://images.unsplash.com/photo-1510065228573-c0a36af3f7b3?auto=format&fit=crop&w=900&q=80',
        fallbackGradient: 'linear-gradient(135deg,#1a1100,#5d4037,#8d6e63)',
      }),
      new Location({
        name: 'Leonida Countryside',
        type: 'Rural Area',
        description: 'Sun-baked flatlands, orange groves, and forgotten highways connect Leonida\'s cities. A world apart from Vice City\'s glitz — with its own cast of dangerous characters.',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
        fallbackGradient: 'linear-gradient(135deg,#3b2500,#7c5200,#d4a017)',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.locations.map(l => l.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   TimelineEvent  –  one entry in the story timeline
   ───────────────────────────────────────────────────────────── */
class TimelineEvent {
  constructor({ date, title, description }) {
    this.date        = date;
    this.title       = title;
    this.description = description;
  }

  render() {
    return `
      <div class="timeline-event">
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-body">
          <div class="event-date">${this.date}</div>
          <h4>${this.title}</h4>
          <p>${this.description}</p>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   Timeline  –  8 accurately sourced GTA VI events
   ───────────────────────────────────────────────────────────── */
class Timeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.events = [
      new TimelineEvent({
        date: 'February 4, 2022',
        title: 'Development Officially Confirmed',
        description: 'After years of rumours and speculation, Rockstar Games officially confirmed that the next entry in the Grand Theft Auto series was in active development, promising to "set creative benchmarks for the series, the industry and entertainment as a whole."',
      }),
      new TimelineEvent({
        date: 'September 2022',
        title: 'The Biggest Leak in Gaming History',
        description: 'Over 90 clips of early development footage were leaked on GTAForums, exposing early builds of Vice City, both protagonists, and core gameplay mechanics. It became one of the largest game leaks ever recorded. Rockstar acknowledged the breach and stated development would continue unaffected.',
      }),
      new TimelineEvent({
        date: 'November 2023',
        title: 'Trailer 1 Announcement',
        description: 'Rockstar President Sam Houser announced the first GTA VI trailer would drop in early December to celebrate the studio\'s 25th anniversary. The announcement tweet became the most-liked gaming post in Twitter history — 1.8 million likes in 24 hours.',
      }),
      new TimelineEvent({
        date: 'December 4, 2023',
        title: 'Trailer 1 — The World Stops',
        description: 'GTA VI Trailer 1 was leaked online hours before its scheduled premiere, prompting Rockstar to release the official version immediately. It racked up 93 million YouTube views in 24 hours — the third-most-viewed YouTube video ever. Vice City, Leonida, and protagonists Lucia and Jason were confirmed. Song: "Love Is A Long Road" by Tom Petty.',
      }),
      new TimelineEvent({
        date: 'April 2024',
        title: 'Rockstar Enters Final Development',
        description: 'Rockstar requested all employees return to offices full-time from April 2024, citing "productivity and security" during the final stages of development. Teams focused intensely on polish, performance, and the massive online component.',
      }),
      new TimelineEvent({
        date: 'May 2, 2025',
        title: 'First Delay Announced',
        description: 'Rockstar announced GTA VI would be delayed from Fall 2025 to May 26, 2026, stating: "We are very sorry that this is later than you expected." The news came just days before Trailer 2, giving fans something significant to look forward to.',
      }),
      new TimelineEvent({
        date: 'May 6, 2025',
        title: 'Trailer 2 — Full Names Revealed',
        description: 'GTA VI Trailer 2 dropped without warning, amassing 475 million views across all platforms in its first 24 hours (84 million on YouTube). Full names Lucia Caminos and Jason Duval were officially confirmed. The story centres on a criminal conspiracy across Leonida. Captured entirely in-game on PS5. Featured song: "Hot Together" by The Pointer Sisters.',
      }),
      new TimelineEvent({
        date: 'November 6, 2025',
        title: 'Second Delay — Final Release Date',
        description: 'Rockstar announced a second delay, pushing GTA VI back to November 19, 2026: "These extra months will allow us to finish the game with the level of polish you have come to expect and deserve." The game remains the most anticipated title in the history of the medium.',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.events.map(e => e.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   Boot
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new CharactersSection('charactersGrid').render();
  new LocationsSection('locationsGrid').render();
  new Timeline('timelineContainer').render();
});
