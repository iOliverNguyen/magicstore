/**
 * Flourish & Blotts — one module for every page of the demo shop.
 *
 * The pages are markup only: no inline script, no on* attributes. Everything
 * below is wired through delegated listeners, and every renderer returns early
 * when its mount node is missing, so all four pages load the same module.
 *
 * The webchat SDK integration lives on its own in shared/webchat.js. The only
 * contract between the two is one-way: once the shared header and footer are in
 * the document this module fires `magicstore:chrome-ready`, which webchat.js
 * waits on before touching the controls in the header.
 */

/* ------------------------------------------------------------------ *
 * App root
 * ------------------------------------------------------------------ */

// shared/shared.js lives at <appRoot>/shared/shared.js, so '../' is the app root
// regardless of the URL prefix the site is mounted under.
const APP_ROOT = new URL('../', import.meta.url);
const url = (path) => new URL(path, APP_ROOT).href;

/* ------------------------------------------------------------------ *
 * Stock
 * ------------------------------------------------------------------ */

const CATALOG = [
  {
    id: 'lumos',
    name: 'Lumos',
    kind: 'spell',
    price: 4,
    tint: '#C9A227',
    blurb: 'Wandlight, steady and cold. The first scroll every first-year buys, and the one they keep.',
    specs: [
      ['Incantation', 'LOO-mos'],
      ['Wand movement', 'Short flick, upward'],
      ['First taught', 'Year one, Charms'],
      ['Where to find it', 'Scroll case by the door'],
    ],
  },
  {
    id: 'accio',
    name: 'Accio',
    kind: 'spell',
    price: 6,
    tint: '#2F6E63',
    blurb: 'Summons a named object to the hand. Works best when you know exactly what you want.',
    specs: [
      ['Incantation', 'AK-ee-oh'],
      ['Wand movement', 'Draw in toward the chest'],
      ['First taught', 'Year four, Charms'],
      ['Where to find it', 'Scroll case by the door'],
    ],
  },
  {
    id: 'wingardium-leviosa',
    name: 'Wingardium Leviosa',
    kind: 'spell',
    price: 7,
    tint: '#7C6BA8',
    blurb: 'Levitation, feather grade. The swish and flick matter considerably more than the volume.',
    specs: [
      ['Incantation', 'win-GAR-dee-um levi-O-sa'],
      ['Wand movement', 'Swish, then flick'],
      ['First taught', 'Year one, Charms'],
      ['Where to find it', 'Scroll case by the door'],
    ],
  },
  {
    id: 'alohomora',
    name: 'Alohomora',
    kind: 'spell',
    price: 9,
    tint: '#B5762A',
    blurb: 'Opens ordinary locks. Not licensed for Gringotts vaults, and the goblins do check.',
    specs: [
      ['Incantation', 'ah-loh-ho-MOR-ah'],
      ['Wand movement', 'Small clockwise turn'],
      ['First taught', 'Year one, Charms'],
      ['Where to find it', 'Scroll case, lower tray'],
    ],
  },
  {
    id: 'expelliarmus',
    name: 'Expelliarmus',
    kind: 'spell',
    price: 12,
    tint: '#8E2B20',
    blurb: 'Disarms an opponent cleanly. The duelling clubs buy this one by the crate every autumn.',
    specs: [
      ['Incantation', 'ex-pel-ee-AR-mus'],
      ['Wand movement', 'Slash forward from the shoulder'],
      ['First taught', 'Year two, Duelling'],
      ['Where to find it', 'Behind the counter, ask'],
    ],
  },
  {
    id: 'expecto-patronum',
    name: 'Expecto Patronum',
    kind: 'spell',
    price: 25,
    tint: '#4E7FB8',
    blurb: 'Conjures a guardian of pure thought. Requires one memory you can hold under real pressure.',
    specs: [
      ['Incantation', 'ex-PEK-toh pa-TROH-num'],
      ['Wand movement', 'Wide circle, then thrust'],
      ['First taught', 'Year three and up'],
      ['Where to find it', 'Locked case, ask for Mr Blotts'],
    ],
  },
  {
    id: 'quidditch-through-the-ages',
    name: 'Quidditch Through the Ages',
    kind: 'book',
    price: 11,
    tint: '#2F5D3A',
    author: 'Kennilworthy Whisp',
    blurb: 'Seven centuries of the sport, from Queerditch Marsh to the modern Snitch.',
    specs: [
      ['Edition', 'Whizz Hard Books, fourteenth'],
      ['Binding', 'Cloth over board, gilt spine'],
      ['Extent', '176 pages, twelve plates'],
      ['Where to find it', 'Sport and sundry, third bay'],
    ],
  },
  {
    id: 'magical-drafts-and-potions',
    name: 'Magical Drafts and Potions',
    kind: 'book',
    price: 14,
    tint: '#3E5C7E',
    author: 'Arsenius Jigger',
    blurb: 'The standard first-year brewing text. Measurements are given in both drams and stirs.',
    specs: [
      ['Edition', 'Little Red Books, revised'],
      ['Binding', 'Cloth over board, stain resistant'],
      ['Extent', '248 pages, foldout chart'],
      ['Where to find it', 'Set texts, front table'],
    ],
  },
  {
    id: 'standard-book-of-spells-1',
    name: 'The Standard Book of Spells, Grade 1',
    kind: 'book',
    price: 15,
    tint: '#6D3C6B',
    author: 'Miranda Goshawk',
    blurb: "Hogwarts' set text for first years: charms in order, with the mistakes students actually make.",
    specs: [
      ['Edition', 'Obscurus Books, thirty-first'],
      ['Binding', 'Cloth over board, sewn'],
      ['Extent', '312 pages, indexed'],
      ['Where to find it', 'Set texts, front table'],
    ],
  },
  {
    id: 'fantastic-beasts',
    name: 'Fantastic Beasts & Where to Find Them',
    kind: 'book',
    price: 18,
    tint: '#7A4A1F',
    author: 'Newt Scamander',
    blurb: 'A field guide to eighty-five species, with Ministry classifications and honest warnings.',
    specs: [
      ['Edition', 'Obscurus Books, fifty-second'],
      ['Binding', 'Oilcloth, reinforced corners'],
      ['Extent', '288 pages, illustrated'],
      ['Where to find it', 'Beasts, back wall'],
    ],
  },
  {
    id: 'a-history-of-magic',
    name: 'A History of Magic',
    kind: 'book',
    price: 20,
    tint: '#5B3220',
    author: 'Bathilda Bagshot',
    blurb: 'The long account, goblin rebellions included. Heavier than it looks. Bring the bag.',
    specs: [
      ['Edition', 'Little Red Books, eighth'],
      ['Binding', 'Half leather, marbled boards'],
      ['Extent', '704 pages, two maps'],
      ['Where to find it', 'History, back wall, ladder'],
    ],
  },
  {
    id: 'advanced-potion-making',
    name: 'Advanced Potion-Making',
    kind: 'book',
    price: 22,
    tint: '#1F4A47',
    author: 'Libatius Borage',
    blurb: 'Sixth year and beyond. We sell it new; the real margins are in the annotated copies.',
    specs: [
      ['Edition', 'Ninth, corrected'],
      ['Binding', 'Cloth over board, gilt spine'],
      ['Extent', '396 pages, appendix of antidotes'],
      ['Where to find it', 'Set texts, upper shelf'],
    ],
  },
];

/** The window display. The note on each pane says why that item is in the window. */
const FEATURED = [
  { id: 'lumos', note: 'For first years' },
  { id: 'standard-book-of-spells-1', note: 'On every Hogwarts list' },
  { id: 'expecto-patronum', note: 'The showpiece' },
];

const KIND_LABEL = { spell: 'Spell scroll', book: 'Spellbook' };
const NAV_FOR_PAGE = { home: 'home', catalog: 'catalog', 'spell-detail': 'catalog', cart: 'cart' };

/* ------------------------------------------------------------------ *
 * Storage keys and paths
 * ------------------------------------------------------------------ */

const CART_KEY = 'magicstore.cart';
const DETAIL_PATH = url('pages/spell-detail.html');

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

const esc = (value) => String(value).replace(/[&<>"]/g, (character) => ESCAPES[character]);

const BY_ID = new Map(CATALOG.map((item) => [item.id, item]));
const findItem = (id) => BY_ID.get(id) ?? null;

const clampQty = (value) => {
  const qty = Math.floor(Number(value));
  if (!Number.isFinite(qty)) return 1;
  return Math.min(99, Math.max(1, qty));
};

const priceHtml = (amount, extraClass) =>
  `<span class="price ${extraClass || ''}"><span class="price__num">${amount}</span><span class="price__unit">₲</span></span>`;

const artifactHtml = (item, modifier) =>
  `<span class="artifact artifact--${item.kind} ${modifier || ''}" style="--tint: ${esc(item.tint)}" aria-hidden="true"></span>`;

const detailHref = (item) => `${DETAIL_PATH}?id=${encodeURIComponent(item.id)}`;

/* ------------------------------------------------------------------ *
 * Shared chrome
 * ------------------------------------------------------------------ */

async function injectShared() {
  const response = await fetch(url('shared/shared.html'));
  if (!response.ok) throw new Error(`shared.html responded ${response.status}`);
  const markup = await response.text();
  const parsed = new DOMParser().parseFromString(markup, 'text/html');
  document.querySelectorAll('[data-slot]').forEach((slot) => {
    const fragment = parsed.querySelector(`template[data-fragment="${slot.dataset.slot}"]`);
    if (!fragment) return;
    const frag = document.importNode(fragment.content, true);
    // shared.html's anchors are app-root-relative and written without a leading
    // slash, since this same fragment is cloned into pages at two different
    // depths (root pages and pages/*). Resolve each one against APP_ROOT here,
    // right before it lands in the document, so the href is correct regardless
    // of how deep the current page is or what prefix the site is mounted under.
    frag.querySelectorAll('[href]').forEach((el) => {
      const raw = el.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^[a-z]+:/i.test(raw)) return;
      el.setAttribute('href', url(raw));
    });
    slot.appendChild(frag);
  });
  markActiveNav();
  document.dispatchEvent(new CustomEvent('magicstore:chrome-ready'));
}

function markActiveNav() {
  const current = NAV_FOR_PAGE[document.body.dataset.page];
  if (!current) return;
  const link = document.querySelector(`[data-nav="${current}"]`);
  if (!link) return;
  link.classList.add('is-current');
  if (document.body.dataset.page === current) link.setAttribute('aria-current', 'page');
}

let toastTimer = 0;

function announce(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.state = 'on';
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.dataset.state = 'off';
  }, 2600);
}

/* ------------------------------------------------------------------ *
 * The bag
 * ------------------------------------------------------------------ */

function readCart() {
  // `.claude/rules/safe-json-rules.md` asks for destr() over JSON.parse(), but this
  // is a bundler-less static page with no npm resolution at runtime — destr isn't
  // reachable here, so the try/catch is the exception, not an oversight.
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && findItem(line.id)).map((line) => ({ id: line.id, qty: clampQty(line.qty) }));
  } catch (error) {
    console.warn('magicstore: the saved bag could not be read, starting an empty one', error);
    return [];
  }
}

function writeCart(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  paintCartBadge(lines);
  renderCart(lines);
}

const cartCount = (lines) => lines.reduce((total, line) => total + line.qty, 0);
const cartTotal = (lines) => lines.reduce((total, line) => total + findItem(line.id).price * line.qty, 0);

function addToCart(id, qty) {
  const item = findItem(id);
  if (!item) return;
  const lines = readCart();
  const hasLine = lines.some((line) => line.id === id);
  const next = hasLine
    ? lines.map((line) => (line.id === id ? { ...line, qty: clampQty(line.qty + qty) } : line))
    : [...lines, { id, qty: clampQty(qty) }];
  writeCart(next);
  announce(`${item.name} — added to your bag.`);
}

function setQty(id, qty) {
  const lines = readCart();
  const line = lines.find((entry) => entry.id === id);
  if (!line) return;
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  writeCart(lines.map((entry) => (entry.id === id ? { ...entry, qty: clampQty(qty) } : entry)));
}

function removeFromCart(id) {
  const item = findItem(id);
  writeCart(readCart().filter((line) => line.id !== id));
  if (item) announce(`${item.name} — taken out of your bag.`);
}

function paintCartBadge(lines = readCart()) {
  const badge = document.querySelector('[data-cart-badge]');
  if (!badge) return;
  const count = cartCount(lines);
  badge.textContent = String(count);
  badge.hidden = count === 0;
  badge.setAttribute('aria-label', count === 1 ? '1 item in your bag' : `${count} items in your bag`);
}

/* ------------------------------------------------------------------ *
 * Cards
 * ------------------------------------------------------------------ */

function byline(item) {
  if (item.kind === 'book') return `<p class="tome__by">${esc(item.author)}</p>`;
  return `<p class="tome__by">Single-cast scroll, vellum</p>`;
}

function tomeCard(item) {
  return `
    <article class="tome">
      <div class="tome__stage">${artifactHtml(item)}</div>
      <p class="eyebrow">${KIND_LABEL[item.kind]}</p>
      <h3 class="tome__title"><a class="tome__link" href="${detailHref(item)}">${esc(item.name)}</a></h3>
      ${byline(item)}
      <p class="tome__blurb">${esc(item.blurb)}</p>
      <div class="tome__foot">
        ${priceHtml(item.price)}
        <button class="btn btn--quiet" type="button" data-action="add-to-cart" data-id="${item.id}">
          Add to bag<span class="u-sr-only"> — ${esc(item.name)}</span>
        </button>
      </div>
    </article>
  `;
}

/* ------------------------------------------------------------------ *
 * Home: the window display
 * ------------------------------------------------------------------ */

function renderFeatured() {
  const mount = document.querySelector('[data-featured]');
  if (!mount) return;
  mount.innerHTML = FEATURED.map((entry, index) => {
    const item = findItem(entry.id);
    if (!item) return '';
    return `
      <article class="pane" style="--i: ${index}">
        <p class="pane__note">${esc(entry.note)}</p>
        <div class="pane__stage">${artifactHtml(item, 'artifact--md')}</div>
        <h3 class="pane__title"><a class="pane__link" href="${detailHref(item)}">${esc(item.name)}</a></h3>
        <p class="pane__blurb">${esc(item.blurb)}</p>
        <div class="pane__foot">
          ${priceHtml(item.price)}
          <button class="btn btn--quiet" type="button" data-action="add-to-cart" data-id="${item.id}">
            Add to bag<span class="u-sr-only"> — ${esc(item.name)}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

/* ------------------------------------------------------------------ *
 * Catalog
 * ------------------------------------------------------------------ */

let catalogFilter = 'all';

function renderCatalog() {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid) return;

  const matches = CATALOG.filter((item) => catalogFilter === 'all' || item.kind === catalogFilter);
  grid.innerHTML = matches.map(tomeCard).join('');

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === catalogFilter));
  });

  const count = document.querySelector('[data-catalog-count]');
  if (count) {
    count.textContent =
      matches.length === CATALOG.length
        ? `All ${CATALOG.length} lines in stock`
        : `${matches.length} of ${CATALOG.length} lines in stock`;
  }
}

/* ------------------------------------------------------------------ *
 * Detail
 * ------------------------------------------------------------------ */

function renderSpellDetail() {
  const mount = document.querySelector('[data-detail]');
  if (!mount) return;

  const requested = new URLSearchParams(window.location.search).get('id');
  const item = findItem(requested) || CATALOG.find((entry) => entry.kind === 'spell');
  const shelfmates = CATALOG.filter((entry) => entry.kind === item.kind && entry.id !== item.id).slice(0, 3);

  document.title = `${item.name} — Flourish & Blotts`;
  const crumb = document.querySelector('[data-crumb-current]');
  if (crumb) crumb.textContent = item.name;

  mount.innerHTML = `
    <article class="detail">
      <div class="case">
        <div class="case__glass">${artifactHtml(item, 'artifact--lg')}</div>
        <p class="case__plaque"><span class="case__kind">${KIND_LABEL[item.kind]}</span>${priceHtml(item.price, 'price--gilt')}</p>
      </div>
      <div class="detail__body">
        <p class="eyebrow">${item.kind === 'book' ? esc(item.author) : 'Sold as a single-cast scroll'}</p>
        <h1 class="detail__title">${esc(item.name)}</h1>
        <p class="detail__lede">${esc(item.blurb)}</p>
        <dl class="specs">
          ${item.specs.map(([label, value]) => `<div class="specs__row"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}
        </dl>
        <div class="buy" data-buy>
          <div class="stepper">
            <button class="stepper__btn" type="button" data-action="qty-dec" aria-label="One fewer">&minus;</button>
            <label class="u-sr-only" for="qty">Quantity</label>
            <input class="stepper__input" id="qty" type="number" min="1" max="99" value="1" data-qty-input />
            <button class="stepper__btn" type="button" data-action="qty-inc" aria-label="One more">+</button>
          </div>
          <button class="btn btn--primary" type="button" data-action="add-to-cart" data-id="${item.id}">Add to bag</button>
        </div>
      </div>
    </article>
    <section class="alsos" aria-labelledby="alsos-heading">
      <h2 class="alsos__head" id="alsos-heading">Also on this shelf</h2>
      <ul class="alsos__list">
        ${shelfmates
          .map(
            (mate) => `
              <li class="alsos__item">
                ${artifactHtml(mate)}
                <a class="alsos__link" href="${detailHref(mate)}">${esc(mate.name)}</a>
                ${priceHtml(mate.price)}
              </li>
            `,
          )
          .join('')}
      </ul>
    </section>
  `;
}

/* ------------------------------------------------------------------ *
 * Cart
 * ------------------------------------------------------------------ */

function cartLineHtml(line) {
  const item = findItem(line.id);
  return `
    <li class="line">
      <div class="line__stage">${artifactHtml(item)}</div>
      <div class="line__body">
        <h3 class="line__title"><a class="line__link" href="${detailHref(item)}">${esc(item.name)}</a></h3>
        <p class="line__meta">${KIND_LABEL[item.kind]}${item.kind === 'book' ? ` · ${esc(item.author)}` : ''} · ${item.price}₲ each</p>
      </div>
      <div class="stepper stepper--sm">
        <button class="stepper__btn" type="button" data-action="cart-dec" data-id="${item.id}" aria-label="One fewer ${esc(item.name)}">&minus;</button>
        <span class="stepper__count">${line.qty}</span>
        <button class="stepper__btn" type="button" data-action="cart-inc" data-id="${item.id}" aria-label="One more ${esc(item.name)}">+</button>
      </div>
      <p class="line__sum">${priceHtml(item.price * line.qty)}</p>
      <button class="line__remove" type="button" data-action="cart-remove" data-id="${item.id}">
        Remove<span class="u-sr-only"> ${esc(item.name)}</span>
      </button>
    </li>
  `;
}

function renderCart(lines = readCart()) {
  const mount = document.querySelector('[data-cart]');
  if (!mount) return;

  const focus = rememberFocus();

  if (lines.length === 0) {
    mount.innerHTML = `
      <div class="empty">
        <p class="empty__mark" aria-hidden="true">&#10086;</p>
        <h2 class="empty__title">Nothing in the bag yet</h2>
        <p class="empty__note">The scroll case is by the door, the set texts are on the front table.</p>
        <a class="btn btn--primary" href="${url('catalog.html')}">Browse the shelves</a>
      </div>
    `;
  } else {
    const count = cartCount(lines);
    mount.innerHTML = `
      <div class="receipt">
        <p class="receipt__head">Flourish &amp; Blotts <span aria-hidden="true">&#10087;</span> Diagon Alley</p>
        <ul class="receipt__lines">${lines.map(cartLineHtml).join('')}</ul>
        <div class="receipt__total">
          <span class="receipt__total-label">Total due at the counter</span>
          ${priceHtml(cartTotal(lines))}
        </div>
        <p class="receipt__note">
          ${count === 1 ? '1 item' : `${count} items`} held for you.
          Gringotts notes accepted; owl delivery is added at the counter.
        </p>
        <div class="receipt__acts">
          <a class="btn btn--primary" href="${url('catalog.html')}">Keep browsing</a>
          <button class="btn btn--ghost" type="button" data-action="cart-clear">Empty the bag</button>
        </div>
        <span class="seal" aria-hidden="true">FB</span>
      </div>
    `;
  }
  restoreFocus(focus);
}

function rememberFocus() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !active.dataset.action) return null;
  return { action: active.dataset.action, id: active.dataset.id || '' };
}

function restoreFocus(focus) {
  if (!focus) return;
  const selector = focus.id
    ? `[data-action="${focus.action}"][data-id="${focus.id}"]`
    : `[data-action="${focus.action}"]`;
  const target = document.querySelector(selector);
  if (target) target.focus();
}

/* ------------------------------------------------------------------ *
 * Delegated events
 * ------------------------------------------------------------------ */

function qtyFrom(trigger) {
  const scope = trigger.closest('[data-buy]');
  const input = scope && scope.querySelector('[data-qty-input]');
  return input ? clampQty(input.value) : 1;
}

function nudgeQty(trigger, delta) {
  const scope = trigger.closest('[data-buy]');
  const input = scope && scope.querySelector('[data-qty-input]');
  if (!input) return;
  input.value = String(clampQty(clampQty(input.value) + delta));
}

const ACTIONS = {
  'add-to-cart': (trigger) => addToCart(trigger.dataset.id, qtyFrom(trigger)),
  'qty-inc': (trigger) => nudgeQty(trigger, 1),
  'qty-dec': (trigger) => nudgeQty(trigger, -1),
  'cart-inc': (trigger) => setQty(trigger.dataset.id, currentQty(trigger.dataset.id) + 1),
  'cart-dec': (trigger) => setQty(trigger.dataset.id, currentQty(trigger.dataset.id) - 1),
  'cart-remove': (trigger) => removeFromCart(trigger.dataset.id),
  'cart-clear': () => {
    writeCart([]);
    announce('The bag is empty again.');
  },
  filter: (trigger) => {
    catalogFilter = trigger.dataset.filter;
    renderCatalog();
  },
};

function currentQty(id) {
  const line = readCart().find((entry) => entry.id === id);
  return line ? line.qty : 0;
}

function setupDelegation() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    const handler = ACTIONS[trigger.dataset.action];
    if (!handler) return;
    handler(trigger);
  });
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */

function start() {
  setupDelegation();
  paintCartBadge();
  renderFeatured();
  renderCatalog();
  renderSpellDetail();
  renderCart();
}

try {
  await injectShared();
} catch (error) {
  console.error('magicstore: the shared header and footer could not be loaded', error);
} finally {
  start();
}
