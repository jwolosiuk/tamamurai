// tamamurai — pixel-art samurai tamagotchi
// Decyzja co 15 minut. Obserwuj, nie zarządzaj.

const STORAGE_KEY = 'tamamurai.state';
const TICK_MS = 15 * 60 * 1000;
const NIGHT_START_HOUR = 22;
const DAY_START_HOUR = 6;
const TRAINING_WINDOW = [6.5, 7.0];   // 06:30 – 07:00
const HUNGER_THRESHOLD = 75;
const SPRITE_SIZE = 16;
const CANVAS_SIZE = 256;
const SCALE = CANVAS_SIZE / SPRITE_SIZE;
const SPRITE_FRAME_MS = 1500;

const STATE_NAMES = {
  meditating: 'medytuje',
  sleeping: 'śpi',
  eating: 'je',
  training: 'trenuje',
};

const PALETTE = {
  '.': null,           // transparent
  'K': '#1a1a1a',      // ink
  'S': '#e8c39e',      // skin
  'R': '#c0392b',      // vermilion kimono
  'W': '#f4ecd8',      // cream
  'Y': '#d4a84a',      // obi gold
  'G': '#555548',      // steel / sword
  'B': '#8a7f6a',      // bowl
};

// Każdy sprite: 16 wierszy × 16 znaków. Funkcja validateSprites() poniżej weryfikuje wymiary.
const SPRITES = {
  meditating: [
    [
      "................",
      "................",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KSKSSKSK....",
      "....KSSSSSSK....",
      "....KSSSSSSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWWWWWWWWWWWR.",
      ".RWWYYYYYYYYWWR.",
      ".RWWWWWWWWWWWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
    [
      "................",
      ".......G........",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KKKKKKKK....",
      "....KSSSSSSK....",
      "....KSSSSSSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWWWWWWWWWWWR.",
      ".RWWYYYYYYYYWWR.",
      ".RWWWWWWWWWWWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
  ],
  sleeping: [
    [
      "............K...",
      "...........KKK..",
      "............K...",
      "...........K....",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KKKKKKKK....",
      "....KSSSSSSK....",
      "....KSSSSSSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWYYYYYYYYWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
    [
      "...........K....",
      "..........KKK...",
      "...........K....",
      "..........K.....",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KKKKKKKK....",
      "....KSSSSSSK....",
      "....KSSSSSSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWYYYYYYYYWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
  ],
  eating: [
    [
      "................",
      "................",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KSKSSKSK....",
      "....KSSSSSSK....",
      "....KSS..SSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWWWWWWWWWWWR.",
      ".RWWYYYYYYYYWWR.",
      "...BBBBBBBBBBB..",
      "...BWWWWWWWWWB..",
      "...BBBBBBBBBBB..",
      "KKKKKKKKKKKKKKKK",
    ],
    [
      "................",
      "................",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KSKSSKSK....",
      "....KSSSSSSK....",
      "....KSSSSSSK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      ".RWWWWWWWWWWWWR.",
      ".RWWYYYYYYYYWWR.",
      "...BBBBBBBBBBB..",
      "...BBBBBBBBBBB..",
      "...BBBBBBBBBBB..",
      "KKKKKKKKKKKKKKKK",
    ],
  ],
  training: [
    [
      "................",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KSKSSKSK....",
      "....KSSSSSSK....",
      "....KS.SS.SK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      "GGGGGGGGGGGGGGGG",
      ".RWWWWWWWWWWWWR.",
      ".RWWYYYYYYYYWWR.",
      ".RWWWWWWWWWWWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
    [
      "................",
      ".....KKKKKK.....",
      "....KSSSSSSK....",
      "....KSKSSKSK....",
      "....KSSSSSSK....",
      "....KS.SS.SK....",
      ".....KSSSSK.....",
      "..RRRRRRRRRRRR..",
      ".RRWWWWWWWWWWRR.",
      "..GGGGGGGGGGGG..",
      "GGGGGGGGGGGGGGGG",
      ".RWWYYYYYYYYWWR.",
      ".RWWWWWWWWWWWWR.",
      "RRWWWWWWWWWWWWRR",
      "RRRRRRRRRRRRRRRR",
      "KKKKKKKKKKKKKKKK",
    ],
  ],
};

const SAYINGS = {
  meditating: [
    "Samuraj medytuje pod sakurą.",
    "Cisza. Wewnątrz góra Fudżi.",
    "Oddech wchodzi, oddech wychodzi.",
    "Liść opada bez pośpiechu.",
    "Myśl jest chmurą — przepływa.",
  ],
  sleeping: [
    "Samuraj śpi spokojnie.",
    "Sen o księżycu nad rzeką.",
    "Cisza nocy chroni jego sny.",
    "Oddech głęboki jak studnia.",
  ],
  eating: [
    "Samuraj je miskę ryżu.",
    "Każde ziarno z wdzięcznością.",
    "Smak prostoty.",
    "Ciało dziękuje za posiłek.",
  ],
  training: [
    "Samuraj ćwiczy katę.",
    "Miecz tnie powietrze precyzyjnie.",
    "Każdy ruch jest wszystkim.",
    "Tysiąc razy ten sam cios.",
  ],
};

function validateSprites() {
  for (const [name, frames] of Object.entries(SPRITES)) {
    frames.forEach((sprite, i) => {
      if (sprite.length !== SPRITE_SIZE) {
        throw new Error(`Sprite ${name}[${i}] ma ${sprite.length} wierszy, oczekiwano ${SPRITE_SIZE}`);
      }
      sprite.forEach((row, y) => {
        if (row.length !== SPRITE_SIZE) {
          throw new Error(`Sprite ${name}[${i}] wiersz ${y} ma ${row.length} znaków, oczekiwano ${SPRITE_SIZE}`);
        }
      });
    });
  }
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }

function defaultState() {
  const now = Date.now();
  return {
    hunger: 30,
    energy: 70,
    focus: 50,
    discipline: 50,
    currentState: 'meditating',
    lastDecisionAt: now,
    bornAt: now,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hourOfDay(date) {
  return date.getHours() + date.getMinutes() / 60;
}

function isNight(date) {
  const h = hourOfDay(date);
  return h >= NIGHT_START_HOUR || h < DAY_START_HOUR;
}

function isTrainingTime(date) {
  const h = hourOfDay(date);
  return h >= TRAINING_WINDOW[0] && h < TRAINING_WINDOW[1];
}

function decideState(state, when) {
  if (isNight(when)) return 'sleeping';
  if (state.hunger > HUNGER_THRESHOLD) return 'eating';
  if (isTrainingTime(when)) return 'training';
  return 'meditating';
}

function applyDrift(state, slotState) {
  switch (slotState) {
    case 'sleeping':
      state.energy = clamp(state.energy + 6);
      state.hunger = clamp(state.hunger + 1);
      break;
    case 'eating':
      state.hunger = clamp(state.hunger - 50);
      break;
    case 'training':
      state.discipline = clamp(state.discipline + 5);
      state.energy = clamp(state.energy - 8);
      state.hunger = clamp(state.hunger + 4);
      state.focus = clamp(state.focus + 1);
      break;
    case 'meditating':
    default:
      state.focus = clamp(state.focus + 3);
      state.discipline = clamp(state.discipline + 1);
      state.hunger = clamp(state.hunger + 2);
      state.energy = clamp(state.energy - 1);
      break;
  }
  state.currentState = slotState;
}

function catchUp(state, nowMs) {
  let t = state.lastDecisionAt;
  let ticks = 0;
  const maxTicks = 96 * 14; // ~2 tygodnie zaległości, sanity cap
  while (nowMs - t >= TICK_MS && ticks < maxTicks) {
    t += TICK_MS;
    const slotTime = new Date(t);
    const slotState = decideState(state, slotTime);
    applyDrift(state, slotState);
    ticks++;
  }
  state.lastDecisionAt = t;
  return ticks;
}

function pickSaying(name) {
  const list = SAYINGS[name] || [''];
  return list[Math.floor(Math.random() * list.length)];
}

// --- Render ---

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function drawSprite(sprite) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }
}

const els = {
  status: document.getElementById('status'),
  hunger: document.getElementById('bar-hunger'),
  energy: document.getElementById('bar-energy'),
  focus: document.getElementById('bar-focus'),
  discipline: document.getElementById('bar-discipline'),
  age: document.getElementById('meta-age'),
  state: document.getElementById('meta-state'),
};

let transientStatus = null;
let transientStatusUntil = 0;

function setTransientStatus(text, ms = 3000) {
  transientStatus = text;
  transientStatusUntil = Date.now() + ms;
}

let lastRenderedStateName = null;
let lastSayingState = null;
let currentSaying = '';

function render() {
  const frames = SPRITES[state.currentState] || SPRITES.meditating;
  const frameIdx = Math.floor(Date.now() / SPRITE_FRAME_MS) % frames.length;
  drawSprite(frames[frameIdx]);

  els.hunger.style.width = state.hunger + '%';
  els.energy.style.width = state.energy + '%';
  els.focus.style.width = state.focus + '%';
  els.discipline.style.width = state.discipline + '%';

  const ageDays = Math.floor((Date.now() - state.bornAt) / 86400000);
  els.age.textContent = `Wiek: ${ageDays} ${ageDays === 1 ? 'dzień' : 'dni'}`;
  els.state.textContent = `Stan: ${STATE_NAMES[state.currentState]}`;

  if (state.currentState !== lastSayingState) {
    currentSaying = pickSaying(state.currentState);
    lastSayingState = state.currentState;
  }

  if (transientStatus && Date.now() < transientStatusUntil) {
    els.status.textContent = transientStatus;
  } else {
    transientStatus = null;
    els.status.textContent = currentSaying;
  }

  lastRenderedStateName = state.currentState;
}

// --- Tick / actions ---

function tickIfDue() {
  const ticks = catchUp(state, Date.now());
  if (ticks > 0) {
    saveState(state);
    render();
  }
}

function feed() {
  if (state.hunger < 30) {
    setTransientStatus('Samuraj nie jest głodny.');
    render();
    return;
  }
  applyDrift(state, 'eating');
  setTransientStatus('Samuraj przyjmuje miskę z wdzięcznością.');
  saveState(state);
  lastSayingState = null;
  render();
}

function train() {
  if (state.energy < 30) {
    setTransientStatus('Samuraj jest zmęczony — najpierw odpoczynek.');
    render();
    return;
  }
  applyDrift(state, 'training');
  setTransientStatus('Samuraj sięga po katanę.');
  saveState(state);
  lastSayingState = null;
  render();
}

function rest() {
  if (isNight(new Date())) {
    setTransientStatus('Samuraj już śpi.');
    render();
    return;
  }
  applyDrift(state, 'sleeping');
  setTransientStatus('Samuraj składa się do snu.');
  saveState(state);
  lastSayingState = null;
  render();
}

function bow() {
  setTransientStatus('Samuraj odwzajemnia ukłon.', 2500);
  render();
}

// --- Init ---

validateSprites();
const state = loadState();
catchUp(state, Date.now());
saveState(state);

render();

document.getElementById('btn-feed').addEventListener('click', feed);
document.getElementById('btn-train').addEventListener('click', train);
document.getElementById('btn-rest').addEventListener('click', rest);
canvas.addEventListener('click', bow);

setInterval(render, 1000);
setInterval(tickIfDue, 30 * 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tickIfDue();
});

// Debug helpers — w devtools console można zrobić: tamamurai.state, tamamurai.reset()
window.tamamurai = {
  get state() { return state; },
  reset() { localStorage.removeItem(STORAGE_KEY); location.reload(); },
  forceTick() { state.lastDecisionAt = Date.now() - TICK_MS - 1000; tickIfDue(); },
  rewind(hours) { state.lastDecisionAt = Date.now() - hours * 3600 * 1000; saveState(state); location.reload(); },
};
