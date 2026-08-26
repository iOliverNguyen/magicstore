/**
 * Flourish & Blotts — the whole Connectly webchat SDK integration for the demo.
 *
 * If you are here to answer "how do I embed the widget", this is the only file
 * you need: it reads and persists the connection settings, mounts and unmounts
 * the panel, and keeps the header controls honest. It imports nothing and
 * depends on nothing but `window.ConnectlyWebchat` (defined by the classic
 * /vendor/webchat2026.debug.js script) and the `data-*` hooks in shared.html.
 *
 * Those hooks arrive late, because shared.js fetches the header and footer at
 * runtime. So the delegated listeners below are registered at module scope —
 * they survive markup appearing afterwards — and the one-time DOM sync waits on
 * `magicstore:chrome-ready`, the single one-way event shared.js fires once the
 * chrome is in place.
 */

/* ------------------------------------------------------------------ *
 * Storage keys and widget defaults
 * ------------------------------------------------------------------ */

const STORE_KEYS = {
  clientKey: 'magicstore.clientKey',
  apiBaseUrl: 'magicstore.apiBaseUrl',
  autoInit: 'magicstore.autoInit',
};

/**
 * Shown in the settings panel as the value that will be used when a field is
 * blank. There is no websocket entry: the realtime endpoint is server-owned and
 * arrives on the session mint, so this demo never names a broker.
 *
 * `clientKey` comes from exactly one place: `window.MAGICSTORE_BUILD`, set by
 * `shared/build-config.js` — a classic (non-module) script loaded before this
 * one, generated at BUILD time by `scripts/gen-build-config.mjs` from the
 * `examples/.env*` files. No key is hardcoded here or anywhere else in the tree.
 * The live dev key lives only in `examples/.env.development+local`, which is
 * gitignored; `examples/.env` carries the seeded local key, which is inert
 * outside a locally-provisioned backend and so is safe to check in.
 *
 * Guard every read with `?.` and expect `''`: nothing stops these pages from
 * being served with no generated config at all (a bare `http-server` over
 * `examples/`, or `file://`). An empty key is not fatal — `openChat()` refuses
 * to mount without one, and the settings panel and `?clientKey=` still work.
 *
 * `apiBaseUrl` is not a secret, so it keeps a second fallback below the build
 * config: the `isLocalHost()` hostname heuristic. This demo is deployed as a
 * static resource with no server-side templating and can be mounted at any host
 * and sub-path, so hostname is the only signal available at load time.
 * `isLocalHost()` is the one place that checks it; everything else asks it.
 *
 * `landing.html` repeats the same resolution inline — it deliberately imports
 * nothing, so it cannot share these functions. Keep the two in step.
 *
 * This only sets the *defaults* — resolveConfig()'s precedence (query param >
 * localStorage > this default) is unchanged for both fields.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '']);

function isLocalHost() {
  // '' covers file://, which has no hostname at all.
  return LOCAL_HOSTNAMES.has(window.location.hostname);
}

function defaultApiBaseUrl() {
  if (window.MAGICSTORE_BUILD?.apiBaseUrl) return window.MAGICSTORE_BUILD.apiBaseUrl;
  return isLocalHost() ? 'http://localhost:4004' : 'https://api.dev.connectly.ai';
}

function defaultClientKey() {
  return window.MAGICSTORE_BUILD?.clientKey ?? '';
}

const WIDGET_DEFAULTS = {
  clientKey: defaultClientKey(),
  apiBaseUrl: defaultApiBaseUrl(),
  autoInit: '0',
};

/* ------------------------------------------------------------------ *
 * Chat widget control
 * ------------------------------------------------------------------ */

function readStored(field) {
  const stored = localStorage.getItem(STORE_KEYS[field]);
  return stored === null ? WIDGET_DEFAULTS[field] : stored;
}

/** Unlike readStored(), does not fall back to WIDGET_DEFAULTS — null/'' means "unset". */
function readStoredRaw(field) {
  return localStorage.getItem(STORE_KEYS[field]);
}

/** Query param wins and is persisted, so `?autoInit=1` survives the next refresh. */
function resolveConfig() {
  const params = new URLSearchParams(window.location.search);
  Object.keys(STORE_KEYS).forEach((field) => {
    const fromQuery = params.get(field);
    if (fromQuery !== null) localStorage.setItem(STORE_KEYS[field], fromQuery.trim());
  });
  return Object.fromEntries(Object.keys(STORE_KEYS).map((field) => [field, readStored(field)]));
}

function setHint(message) {
  const hint = document.querySelector('[data-chat-hint]');
  if (!hint) return;
  hint.textContent = message;
  hint.hidden = message === '';
}

// isOpen() ("is the panel showing"), not isMounted() ("is the widget present on the
// page"): this button's label is about visibility, and once the widget is initialized
// the element stays present (isMounted() stays true) even while the panel is closed.
// See ConnectlyWebchat.isMounted's doc comment on this split.
const isChatOpen = () => Boolean(window.ConnectlyWebchat && window.ConnectlyWebchat.isOpen());

function syncChatToggle() {
  const toggle = document.querySelector('[data-chat-toggle]');
  if (!toggle) return;
  const open = isChatOpen();
  const label = open ? 'Close chat' : 'Init chat';
  if (toggle.textContent !== label) toggle.textContent = label;
  toggle.setAttribute('aria-pressed', String(open));
}

function openChat() {
  if (!window.ConnectlyWebchat) {
    setHint('The widget bundle is missing. Run pnpm start:webchat2026:magicstore to sync vendor/.');
    return;
  }
  // No wsUrl: leaving it off is what lets the mint's endpoint through. Passing one
  // here would take the SDK's dev-override branch and the server's value could
  // never be used.
  // Both fields fall back to the defaults when blank, so emptying a stale key in
  // Connection settings is how you get back to the one this demo ships with — a
  // value saved by an earlier visit otherwise wins forever.
  const config = {
    clientKey: readStored('clientKey').trim() || WIDGET_DEFAULTS.clientKey,
    apiBaseUrl: readStored('apiBaseUrl').trim() || WIDGET_DEFAULTS.apiBaseUrl,
  };
  // No key at all: the build config is missing or was generated without one (the
  // dev key is not checked in — see WIDGET_DEFAULTS above). Mounting with '' would
  // just fail against the backend with a less obvious message.
  if (!config.clientKey) {
    setHint(
      'No clientKey. Paste one in Connection settings, add ?clientKey=… , or rebuild with pnpm build:dev:magicstore.',
    );
    return;
  }
  setHint('');
  // `open: true` opens the panel as soon as it mounts, matching this button's
  // "click to open" role instead of leaving a bare launcher behind. onOpenChange keeps
  // the toggle label honest without polling — it fires whenever the panel's own ×
  // button (or anything else) closes it, from the `connectly-webchat:close` event.
  // No `title` override: the panel title comes from the merchant's widget_ui (panel.title),
  // so the demo reflects the configured header instead of masking it.
  window.ConnectlyWebchat.init({ ...config, open: true, onOpenChange: syncChatToggle });
}

function toggleChat() {
  if (isChatOpen()) {
    // A full teardown, not a close: this drops the session on purpose, so the next
    // open() mints a fresh one. onOpenChange still fires — destroy() emits `close` on
    // the way out when the panel was showing — so the label needs no help here.
    window.ConnectlyWebchat.destroy();
    return;
  }
  openChat();
}

function setupWebchat() {
  const toggle = document.querySelector('[data-chat-toggle]');
  if (!toggle) return;

  const config = resolveConfig();
  // Only an actual stored value pre-fills the field. Falling back to the resolved
  // default here (as readStored() does) would print the real clientKey as text on
  // every first-ever visit, making the placeholder below it unreachable — see the
  // settings__note copy in shared.html: "what is saved beats the defaults shown
  // as placeholders".
  document.querySelectorAll('[data-config]').forEach((input) => {
    input.value = readStoredRaw(input.dataset.config) || '';
  });
  const autoBox = document.querySelector('[data-widget-autoinit]');
  if (autoBox) autoBox.checked = config.autoInit === '1';

  syncChatToggle();

  if (config.autoInit === '1' && config.clientKey.trim()) openChat();
}

/* ------------------------------------------------------------------ *
 * Delegated events
 * ------------------------------------------------------------------ */

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest('[data-chat-toggle]')) return;
  toggleChat();
});

document.addEventListener('input', (event) => {
  const field = event.target;
  if (!(field instanceof Element)) return;
  if (field.matches('[data-config]')) {
    localStorage.setItem(STORE_KEYS[field.dataset.config], field.value.trim());
    setHint('');
    return;
  }
  if (field.matches('[data-widget-autoinit]')) {
    localStorage.setItem(STORE_KEYS.autoInit, field.checked ? '1' : '0');
  }
});

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */

// webchat.js is a module script and runs before shared.js's injectShared() has
// asynchronously injected the fragment containing [data-chat-toggle], so
// magicstore:chrome-ready is the only path that ever fires this.
document.addEventListener('magicstore:chrome-ready', setupWebchat, { once: true });
