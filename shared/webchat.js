/**
 * Flourish & Blotts — the whole Connectly webchat SDK integration for the demo.
 *
 * If you are here to answer "how do I embed the widget", this is the only file
 * you need: it reads and persists the connection settings, mounts and unmounts
 * the panel, and keeps the header controls honest. It imports nothing and
 * depends on nothing but `window.ConnectlyWebchat` (defined by the classic
 * /vendor/connectly-webchat.js script) and the `data-*` hooks in shared.html.
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
 * Both `clientKey` and `apiBaseUrl` resolve in this order:
 *
 *  1. `window.MAGICSTORE_BUILD` — the backend target picked at BUILD time by
 *     `pnpm build:local:magicstore` / `pnpm build:dev:magicstore`, stamped
 *     into `shared/build-config.js` by `scripts/gen-build-config.mjs`. This is
 *     a classic (non-module) script, loaded before this one, so the global —
 *     when present — is already set by the time these functions run. Guard
 *     every read with `?.`: `pnpm start:magicstore` serves `examples/` with
 *     only the local config generated, but nothing stops that file from being
 *     absent entirely, and this heuristic below must still work then.
 *  2. The `isLocalHost()` hostname heuristic — the fallback of last resort,
 *     for whenever there is no generated config at all: this demo is deployed
 *     as a static resource with no server-side templating, and it can be
 *     mounted at any host and any URL sub-path, so the only signal available
 *     at load time is whether `window.location.hostname` looks local.
 *     `isLocalHost()` below is the one place that checks it; everything else
 *     asks that function.
 *
 * When hosted (anything that is not a local hostname):
 *  - `clientKey` falls back to `SKoOimb6xSgq8jqvQ03Rqia5HMqCGfPyljlLLvgIcaKtmKOO4i`,
 *    the ACTIVE webchat client key for business "Connectly"
 *    (`2d503e81-e270-4467-a05f-21a900efbbc1`) on dev, bound to the single dev
 *    webchat channel `309b744a-16db-4acd-aaa3-82c61c0dd8a5`. The local literal
 *    below is not provisioned there, so it would not work.
 *  - `apiBaseUrl` falls back to the dev grpc-gateway, `https://api.dev.connectly.ai`.
 *
 * On localhost (and other local hostnames — see LOCAL_HOSTNAMES):
 *  - `clientKey` falls back to `expecto_patronum_wingardium_leviosa`, a real
 *    local dev key, not a placeholder string: it is `defaultClientKey` in the
 *    backend repo at `scripts/webchat/init-client-key/main.go`, "deliberately
 *    human-readable and stable so js/webchat-debug/config.json and the
 *    frontend SDK can hardcode it across DB resets". It binds to the seeded
 *    local "Connectly AI" business (`2d503e81-e270-4467-a05f-21a900efbbc1`)
 *    from `base/db/migrations/20210520072606_bootstrap_data.up.sql`, and only
 *    works against a local backend that has run that provisioning script —
 *    it is inert anywhere else, including when hosted.
 *  - `apiBaseUrl` keeps the local dev default, `http://localhost:4004`.
 *
 * Both literals are also hardcoded in `landing.html` (which imports nothing,
 * so it cannot share these constants, including the host check), as the
 * `placeholder`s on the clientKey/apiBaseUrl fields in `shared.html`, and in
 * `scripts/gen-build-config.mjs`, which is the source of truth for the
 * build-time pair. Rotate all four together.
 *
 * This only changes the *defaults* — resolveConfig()'s precedence (query
 * param > localStorage > this default) is unchanged for both fields.
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
  if (window.MAGICSTORE_BUILD?.clientKey) return window.MAGICSTORE_BUILD.clientKey;
  return isLocalHost()
    ? 'expecto_patronum_wingardium_leviosa'
    : 'SKoOimb6xSgq8jqvQ03Rqia5HMqCGfPyljlLLvgIcaKtmKOO4i';
}

const WIDGET_DEFAULTS = {
  clientKey: defaultClientKey(),
  apiBaseUrl: defaultApiBaseUrl(),
  autoInit: '0',
};

const CHAT_TITLE = 'Flourish & Blotts';

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

const isChatMounted = () => Boolean(window.ConnectlyWebchat && window.ConnectlyWebchat.isMounted());

function syncChatToggle() {
  const toggle = document.querySelector('[data-chat-toggle]');
  if (!toggle) return;
  const mounted = isChatMounted();
  const label = mounted ? 'Close chat' : 'Init chat';
  if (toggle.textContent !== label) toggle.textContent = label;
  toggle.setAttribute('aria-pressed', String(mounted));
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
  setHint('');
  // onMountedChange keeps the toggle label honest without polling — it fires on
  // this mount, on toggleChat()'s destroy() below, and on the panel's own ×
  // button, which calls that same destroy().
  window.ConnectlyWebchat.init({ ...config, title: CHAT_TITLE, onMountedChange: syncChatToggle });
}

function toggleChat() {
  if (isChatMounted()) {
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
