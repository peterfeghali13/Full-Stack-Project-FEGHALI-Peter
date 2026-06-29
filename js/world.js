

'use strict';

/* ─────────────────────────────────────────────────────────────
   Character  –  a single character card
   ───────────────────────────────────────────────────────────── */
class Character {
  constructor({ name, role, description, gradient, icon, traits }) {
    this.name        = name;
    this.role        = role;
    this.description = description;
    this.gradient    = gradient;
    this.icon        = icon;
    this.traits      = traits;  // string[]
  }

  render() {
    const traitsHtml = this.traits
      .map(t => `<span class="trait-tag">${t}</span>`)
      .join('');

    return `
      <div class="character-card">
        <div class="character-portrait"
             style="background:${this.gradient}"
             aria-hidden="true">
          <i class="${this.icon}"></i>
        </div>
        <div class="character-body">
          <span class="character-role">${this.role}</span>
          <h3>${this.name}</h3>
          <p>${this.description}</p>
          <div class="character-traits" aria-label="Traits">
            ${traitsHtml}
          </div>
        </div>
      </div>
    `;
  }
}

/* ─────────────────────────────────────────────────────────────
   CharactersSection  –  renders all 6 character cards
   ───────────────────────────────────────────────────────────── */
class CharactersSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // 6 curated characters (own content)
    this.characters = [
      new Character({
        name: 'Lucia',
        role: 'Protagonist',
        description:
          'The first playable female lead in the mainline GTA series. A woman from humble origins in Leonida who carves her own path through the criminal underworld through sheer determination and street cunning.',
        gradient: 'linear-gradient(135deg,#1a0010,#7c1a35,#c2185b)',
        icon: 'fas fa-person-dress',
        traits: ['Survivor', 'Street Smart', 'Resilient', 'Ambitious'],
      }),
      new Character({
        name: 'Jason',
        role: 'Protagonist',
        description:
          'Lucia\'s partner in crime and co-protagonist. Raised in Leonida\'s unforgiving environment, Jason is fiercely loyal to those he trusts — and utterly merciless to those who cross him.',
        gradient: 'linear-gradient(135deg,#0d1117,#1f2937,#374151)',
        icon: 'fas fa-person',
        traits: ['Tactical', 'Loyal', 'Street-wise', 'Determined'],
      }),
      new Character({
        name: 'Boobie Ike',
        role: 'Crime Boss',
        description:
          'A flamboyant and powerful crime lord who controls significant territory across Vice City. His gaudy exterior conceals an exceptionally calculating and ruthless criminal mind.',
        gradient: 'linear-gradient(135deg,#1a0033,#4b0082,#7b1fa2)',
        icon: 'fas fa-crown',
        traits: ['Charismatic', 'Ruthless', 'Wealthy', 'Influential'],
      }),
      new Character({
        name: 'Cal',
        role: 'Supporting',
        description:
          'A mysterious connection from the fringes of Leonida\'s criminal network. Cal serves as both an asset and a potential liability — his true motivations remain unclear.',
        gradient: 'linear-gradient(135deg,#001a00,#1b5e20,#388e3c)',
        icon: 'fas fa-user-secret',
        traits: ['Mysterious', 'Resourceful', 'Unpredictable'],
      }),
      new Character({
        name: 'Dave',
        role: 'Supporting',
        description:
          'One of Lucia and Jason\'s most reliable contacts in Leonida. Dave\'s deep local knowledge of the state\'s criminal networks and hideouts proves invaluable throughout the story.',
        gradient: 'linear-gradient(135deg,#001433,#0d2d6b,#1565c0)',
        icon: 'fas fa-user',
        traits: ['Reliable', 'Resourceful', 'Low Profile'],
      }),
      new Character({
        name: 'Raul',
        role: 'Antagonist',
        description:
          'A high-ranking enforcer with deep ties to organised crime across Leonida\'s underworld. Raul\'s violent nature and pride put him on an inevitable collision course with Lucia and Jason.',
        gradient: 'linear-gradient(135deg,#1a0500,#7c1a00,#c62828)',
        icon: 'fas fa-skull',
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
   Location  –  a single location card
   ───────────────────────────────────────────────────────────── */
class Location {
  constructor({ name, type, description, gradient, icon }) {
    this.name        = name;
    this.type        = type;
    this.description = description;
    this.gradient    = gradient;
    this.icon        = icon;
  }

  render() {
    return `
      <div class="location-card">
        <div class="location-bg"
             style="background:${this.gradient}"
             aria-hidden="true">
          <i class="${this.icon}"></i>
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
   LocationsSection  –  renders all 5 location cards
   ───────────────────────────────────────────────────────────── */
class LocationsSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // 5 curated locations (own content)
    this.locations = [
      new Location({
        name: 'Vice City',
        type: 'Major City',
        description:
          'The neon-drenched, sun-kissed capital of Leonida State. Inspired by Miami, it\'s a city of extremes — obscene wealth beside desperate poverty, all set against an endless ocean horizon.',
        gradient: 'linear-gradient(135deg,#1a0033,#6b0f6b,#e91e8c)',
        icon: 'fas fa-city',
      }),
      new Location({
        name: 'The Leonida Keys',
        type: 'Island Chain',
        description:
          'A string of tropical islands south of Vice City, inspired by the Florida Keys. Luxury resorts, isolated marinas, and hidden criminal operations pepper the archipelago.',
        gradient: 'linear-gradient(135deg,#003049,#0077b6,#00b4d8)',
        icon: 'fas fa-mountain-sun',
      }),
      new Location({
        name: 'The Everglades',
        type: 'Wilderness',
        description:
          'A vast and mysterious swampland stretching across inland Leonida. Airboats, alligators, and criminal hideouts lurk beneath the dense green canopy.',
        gradient: 'linear-gradient(135deg,#002400,#1b5e20,#33691e)',
        icon: 'fas fa-tree',
      }),
      new Location({
        name: 'Port Gellhorn',
        type: 'Port Town',
        description:
          'A gritty industrial harbour town north of Vice City. The docks are a major hub for smuggling operations, tightly controlled by feuding criminal factions.',
        gradient: 'linear-gradient(135deg,#1a1100,#5d4037,#8d6e63)',
        icon: 'fas fa-anchor',
      }),
      new Location({
        name: 'Leonida Countryside',
        type: 'Rural Area',
        description:
          'Sun-baked flatlands, orange groves, and forgotten highways connect Leonida\'s cities. A world apart from Vice City\'s glitz — with its own cast of dangerous characters.',
        gradient: 'linear-gradient(135deg,#3b2500,#7c5200,#d4a017)',
        icon: 'fas fa-sun',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.locations.map(l => l.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   TimelineEvent  –  a single entry in the story timeline
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
   Timeline  –  renders all 5 timeline events
   ───────────────────────────────────────────────────────────── */
class Timeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // 5 curated timeline events (own content)
    this.events = [
      new TimelineEvent({
        date: 'December 5, 2023',
        title: 'Trailer 1 Drops — The World Stops',
        description:
          'Rockstar Games released the first official GTA VI trailer after years of speculation, amassing over 90 million views within 24 hours — shattering YouTube records. Vice City was confirmed as the setting, and the world met Lucia.',
      }),
      new TimelineEvent({
        date: 'December 2023',
        title: 'Lucia & Jason Confirmed',
        description:
          'The trailer introduced dual protagonists to the mainstream: Lucia, the first female lead in the mainline GTA series in over two decades, and Jason, her partner. The announcement sparked global conversation about representation in gaming.',
      }),
      new TimelineEvent({
        date: '2024',
        title: 'Trailer 2 – The World Expands',
        description:
          'A second trailer deepened the world of Leonida, showcasing Vice City\'s diverse neighbourhoods, the Everglades-inspired wilderness, the Leonida Keys, and further hints at the overarching criminal storyline driving Lucia and Jason.',
      }),
      new TimelineEvent({
        date: 'May 2025',
        title: 'Release Date Confirmed',
        description:
          'Rockstar Games officially confirmed that GTA VI would launch in 2025 on PlayStation 5 and Xbox Series X|S. The PC version was confirmed to follow at a later, unannounced date.',
      }),
      new TimelineEvent({
        date: '2025',
        title: 'GTA VI Launches on Console',
        description:
          'Grand Theft Auto VI launches on PS5 and Xbox Series X|S, delivering the most technically ambitious open world ever created by Rockstar Games — and setting a new benchmark for the entire industry.',
      }),
    ];
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.events.map(e => e.render()).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   Boot – world page initialisation
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new CharactersSection('charactersGrid').render();
  new LocationsSection('locationsGrid').render();
  new Timeline('timelineContainer').render();
});
