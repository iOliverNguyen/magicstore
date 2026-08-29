/*! @connectly/webchat 1.1.0-91536174 (dirty) */
function nr(c) {
  const l = new Error(c);
  return l.source = "ulid", l;
}
const Zc = "0123456789ABCDEFGHJKMNPQRSTVWXYZ", Oa = Zc.length, Zd = Math.pow(2, 48) - 1, yb = 10, vb = 16;
function Sb(c) {
  let l = Math.floor(c() * Oa);
  return l === Oa && (l = Oa - 1), Zc.charAt(l);
}
function Tb(c, l) {
  if (isNaN(c))
    throw new Error(c + " must be a number");
  if (c > Zd)
    throw nr("cannot encode time greater than " + Zd);
  if (c < 0)
    throw nr("time must be positive");
  if (Number.isInteger(Number(c)) === !1)
    throw nr("time must be an integer");
  let a, r = "";
  for (; l > 0; l--)
    a = c % Oa, r = Zc.charAt(a) + r, c = (c - a) / Oa;
  return r;
}
function Eb(c, l) {
  let a = "";
  for (; c > 0; c--)
    a = Sb(l) + a;
  return a;
}
function wb(c = !1, l) {
  l || (l = typeof window < "u" ? window : null);
  const a = l && (l.crypto || l.msCrypto);
  if (a)
    return () => {
      const r = new Uint8Array(1);
      return a.getRandomValues(r), r[0] / 255;
    };
  try {
    const r = require("crypto");
    return () => r.randomBytes(1).readUInt8() / 255;
  } catch {
  }
  if (c) {
    try {
      console.error("secure crypto unusable, falling back to insecure Math.random()!");
    } catch {
    }
    return () => Math.random();
  }
  throw nr("secure crypto unusable, insecure Math.random not allowed");
}
function Rb(c) {
  return c || (c = wb()), function(a) {
    return isNaN(a) && (a = Date.now()), Tb(a, yb) + Eb(vb, c);
  };
}
const Ab = Rb();
class An extends Error {
  constructor(l, a, r, o) {
    super(a), this.name = "WebchatHttpError", this.status = l, this.errorCode = r, this.body = o;
  }
}
const xb = /* @__PURE__ */ new Set([408, 429]);
function Yc(c) {
  return c instanceof An ? c.status >= 400 && c.status < 500 && !xb.has(c.status) : !1;
}
function Kd(c) {
  return c instanceof An ? `status=${c.status} ${c.message}` : c instanceof Error ? c.message : String(c);
}
class Fn extends Error {
  constructor(l) {
    super(l), this.name = "WebchatValidationError";
  }
}
class Is extends Error {
  constructor(l = "webchat: visitor identity changed while the request was in flight") {
    super(l), this.name = "WebchatIdentityChangedError";
  }
}
class Ta extends Error {
  constructor(l = "webchat: the session was refused and will not be retried — reload to start a new one") {
    super(l), this.name = "WebchatTerminatedError";
  }
}
class Ob extends Error {
  constructor(l, a, r) {
    super(a), this.name = "WebchatUploadError", this.status = l, this.body = r;
  }
}
const xi = "warn";
function Gc() {
  return typeof window > "u" ? xi : window.connectlyWebchatDefaultLogLevel ?? xi;
}
const bl = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};
function Mb(c) {
  return c in bl;
}
const Cb = "[connectly-webchat]";
function $s() {
}
function On(c, l = Cb) {
  const a = bl[c], r = (o) => (...f) => o(l, ...f);
  return {
    error: a >= bl.error ? r(console.error.bind(console)) : $s,
    warn: a >= bl.warn ? r(console.warn.bind(console)) : $s,
    info: a >= bl.info ? r(console.info.bind(console)) : $s,
    debug: a >= bl.debug ? r(console.debug.bind(console)) : $s
  };
}
const Db = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, zb = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, Ub = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function kb(c, l) {
  if (c === "__proto__" || c === "constructor" && l && typeof l == "object" && "prototype" in l) {
    Nb(c);
    return;
  }
  return l;
}
function Nb(c) {
  console.warn(`[destr] Dropping "${c}" key to prevent prototype pollution.`);
}
function Kc(c, l = {}) {
  if (typeof c != "string")
    return c;
  if (c[0] === '"' && c[c.length - 1] === '"' && c.indexOf("\\") === -1)
    return c.slice(1, -1);
  const a = c.trim();
  if (a.length <= 9)
    switch (a.toLowerCase()) {
      case "true":
        return !0;
      case "false":
        return !1;
      case "undefined":
        return;
      case "null":
        return null;
      case "nan":
        return Number.NaN;
      case "infinity":
        return Number.POSITIVE_INFINITY;
      case "-infinity":
        return Number.NEGATIVE_INFINITY;
    }
  if (!Ub.test(c)) {
    if (l.strict)
      throw new SyntaxError("[destr] Invalid JSON");
    return c;
  }
  try {
    if (Db.test(c) || zb.test(c)) {
      if (l.strict)
        throw new Error("[destr] Possible prototype pollution");
      return JSON.parse(c, kb);
    }
    return JSON.parse(c);
  } catch (r) {
    if (l.strict)
      throw r;
    return c;
  }
}
const Mm = "http://localhost:4004";
function Si(c, l) {
  return `${c.replace(/\/+$/, "")}${l}`;
}
async function Bb(c) {
  const l = await c.text();
  if (l)
    return Kc(l);
}
function Pd(c, l) {
  if (c && typeof c == "object" && !Array.isArray(c)) {
    const a = c[l];
    if (typeof a == "string" && a !== "")
      return a;
  }
}
async function Ti(c, l, a, r) {
  const o = {
    ...a.body ? { "Content-Type": "application/json" } : {},
    ...a.headers
  };
  r && (o.Authorization = `Bearer ${r}`);
  const f = await c(l, { ...a, headers: o }), d = await Bb(f);
  if (!f.ok) {
    const _ = Pd(d, "message") ?? `webchat request failed: ${f.status} ${f.statusText}`;
    throw new An(f.status, _, Pd(d, "errorCode"), d);
  }
  return d ?? {};
}
class Cm {
  constructor(l) {
    this.apiBaseUrl = l.apiBaseUrl, this.fetchFn = l.fetchFn ?? ((...a) => fetch(...a)), this.logger = l.logger ?? On(l.logLevel ?? xi, "[connectly-webchat:rest]");
  }
  createOrRefreshSession(l) {
    return Ti(this.fetchFn, Si(this.apiBaseUrl, "/external/v1/webchat/session"), { method: "POST", body: JSON.stringify(l) });
  }
  send(l, a) {
    return Ti(this.fetchFn, Si(this.apiBaseUrl, "/external/v1/webchat/send"), { method: "POST", body: JSON.stringify(a) }, l);
  }
  history(l, a = {}) {
    const o = new URLSearchParams(Object.entries(a).filter(([, d]) => d != null).map(([d, _]) => [d, String(_)])).toString(), f = `/external/v1/webchat/history${o ? `?${o}` : ""}`;
    return Ti(this.fetchFn, Si(this.apiBaseUrl, f), { method: "GET" }, l);
  }
  ack(l, a) {
    return Ti(this.fetchFn, Si(this.apiBaseUrl, "/external/v1/webchat/ack"), { method: "POST", body: JSON.stringify(a) }, l);
  }
  createUploadIntent(l, a) {
    return Ti(this.fetchFn, Si(this.apiBaseUrl, "/external/v1/webchat/attachments/upload-intent"), { method: "POST", body: JSON.stringify(a) }, l);
  }
  resolveAttachment(l, a) {
    const r = `/external/v1/webchat/attachments/${encodeURIComponent(a)}/resolve`;
    return Ti(this.fetchFn, Si(this.apiBaseUrl, r), { method: "POST", body: "{}" }, l);
  }
  getWidgetConfig(l, a) {
    const o = `/external/v1/webchat/widget-config?${new URLSearchParams({ client_key: l }).toString()}`;
    return Ti(this.fetchFn, Si(this.apiBaseUrl, o), { method: "GET", signal: a });
  }
  async uploadToS3(l, a, r, o) {
    const f = new FormData();
    Object.entries(a).forEach(([_, b]) => f.append(_, b)), f.append("file", r);
    const d = await this.fetchFn(l, { method: "POST", body: f, signal: o });
    if (!d.ok) {
      const _ = await d.text().catch(() => {
      });
      throw this.logger.warn(`attachment upload to S3 failed: ${d.status} ${d.statusText}`), new Ob(d.status, `webchat: attachment upload failed: ${d.status} ${d.statusText}`, _);
    }
  }
}
const Lb = "connectly:webchat:v2:", Hb = 300 * 1e3, jb = 10 * 1e3, qb = 2 ** 31 - 1, Yb = 30 * 1e3, Tc = 5;
function Gb(c) {
  return !Number.isFinite(c) || c <= Date.now();
}
function Jd(c) {
  return typeof c == "string" && c.length > 0;
}
function Vb(c) {
  if (c)
    return c;
  try {
    if (typeof window < "u" && window.localStorage)
      return window.localStorage;
  } catch {
  }
  return null;
}
class Xb {
  constructor(l) {
    this.session = null, this.refreshTimer = null, this.sessionMintInFlight = null, this.refreshRetries = 0, this.sessionGeneration = 0, this.disposed = !1, this.clientKey = l.clientKey, this.rest = l.rest, this.storage = Vb(l.storage), this.protocolVersion = l.protocolVersion, this.onTokenChange = l.onTokenChange, this.onSessionReset = l.onSessionReset, this.onTerminal = l.onTerminal, this.onRefreshStalled = l.onRefreshStalled, this.refreshSkewMs = l.refreshSkewMs ?? Hb, this.storageKey = `${Lb}${l.clientKey}`, this.logger = l.logger ?? On(l.logLevel ?? xi, "[connectly-webchat:session]");
  }
  getToken() {
    var l;
    return ((l = this.session) == null ? void 0 : l.sessionToken) ?? null;
  }
  generation() {
    return this.sessionGeneration;
  }
  async ensureSession() {
    const l = this.session ?? this.load();
    return !l || Gb(l.expiresAt) ? this.mintSession(l == null ? void 0 : l.refreshToken) : (this.session || (this.session = l), this.refreshTimer === null && this.scheduleProactiveRefresh(), l);
  }
  refreshNow() {
    const l = this.session ?? this.load();
    return this.mintSession(l == null ? void 0 : l.refreshToken);
  }
  mintSession(l) {
    return this.sessionMintInFlight ?? (this.sessionMintInFlight = this.runMint(l)), this.sessionMintInFlight;
  }
  async runMint(l) {
    try {
      return l ? await this.refreshOrRecreate(l) : await this.createFromClientKey();
    } finally {
      this.sessionMintInFlight = null;
    }
  }
  async refreshOrRecreate(l) {
    var a, r;
    try {
      return await this.refreshWith(l);
    } catch (o) {
      if (!(o instanceof An) || o.status !== 401)
        throw o;
      if (this.session && this.session.refreshToken !== l)
        return this.session;
      this.logger.warn("stored refresh token was rejected — the previous visitor is unreachable; minting a brand-new one"), this.clear();
      const f = await this.createFromClientKey({ deferTokenChange: !0 });
      return this.sessionGeneration += 1, (a = this.onSessionReset) == null || a.call(this, this.sessionGeneration), (r = this.onTokenChange) == null || r.call(this, f.sessionToken), f;
    }
  }
  async refreshWith(l) {
    this.logger.debug("refreshing session token");
    const a = await this.rest.createOrRefreshSession({
      refreshToken: l,
      protocolVersion: this.protocolVersion
    });
    return this.adopt(a);
  }
  async createFromClientKey(l) {
    this.logger.info("minting a new session from clientKey");
    const a = await this.rest.createOrRefreshSession({
      clientKey: this.clientKey,
      protocolVersion: this.protocolVersion
    });
    return this.adopt(a, l);
  }
  adopt(l, a) {
    var d;
    if (!Jd(l.sessionToken) || !Jd(l.refreshToken))
      throw new An(502, "webchat: session response missing sessionToken/refreshToken", void 0, l);
    const r = Number(l.expiresIn);
    if (!Number.isFinite(r) || r <= 0)
      throw new An(502, "webchat: session response has no usable expiresIn", void 0, l);
    const o = {
      sessionToken: l.sessionToken,
      refreshToken: l.refreshToken,
      expiresAt: Date.now() + r * 1e3,
      wsUrl: l.wsUrl ?? ""
    }, f = o.wsUrl === "" ? "(empty — REST-only)" : o.wsUrl;
    return this.logger.info(`session mint succeeded: expires in ${r}s, wsUrl=${f}`), this.session = o, this.persist(o), this.scheduleProactiveRefresh(), a != null && a.deferTokenChange || (d = this.onTokenChange) == null || d.call(this, o.sessionToken), o;
  }
  async withAuth(l) {
    const a = await this.ensureSession();
    try {
      return await l(a.sessionToken);
    } catch (r) {
      if (r instanceof An && r.status === 401) {
        await this.refreshNow();
        const o = this.getToken();
        if (!o)
          throw r;
        return l(o);
      }
      throw r;
    }
  }
  clear() {
    var l;
    this.session = null, this.refreshRetries = 0, this.refreshTimer && (clearTimeout(this.refreshTimer), this.refreshTimer = null);
    try {
      (l = this.storage) == null || l.removeItem(this.storageKey);
    } catch {
    }
  }
  dispose() {
    this.disposed = !0, this.refreshTimer && (clearTimeout(this.refreshTimer), this.refreshTimer = null);
  }
  revive() {
    this.disposed = !1;
  }
  scheduleProactiveRefresh() {
    if (this.refreshTimer && (clearTimeout(this.refreshTimer), this.refreshTimer = null), this.disposed || !this.session || !Number.isFinite(this.session.expiresAt))
      return;
    this.refreshRetries = 0;
    const l = this.session.expiresAt - Date.now() - this.refreshSkewMs, a = Math.min(Math.max(l, jb), qb);
    this.logger.debug(`proactive refresh armed in ${Math.round(a / 1e3)}s`), this.refreshTimer = setTimeout(() => this.runProactiveRefresh(), a);
  }
  async runProactiveRefresh() {
    var l, a;
    if (!this.disposed) {
      this.refreshTimer = null, this.logger.info("running proactive session refresh");
      try {
        await this.refreshNow();
        return;
      } catch (r) {
        if (this.disposed)
          return;
        if (Yc(r)) {
          this.logger.error(`proactive refresh failed with a terminal error — tearing down (${Kd(r)})`), (l = this.onTerminal) == null || l.call(this, r);
          return;
        }
        if (this.refreshRetries >= Tc) {
          this.logger.warn(`proactive refresh exhausted its retry budget (${Tc} attempts): ${Kd(r)}`), (a = this.onRefreshStalled) == null || a.call(this, r);
          return;
        }
        this.logger.debug(`proactive refresh attempt failed transiently, retrying (${this.refreshRetries + 1}/${Tc})`, r);
      }
      this.refreshRetries += 1, this.refreshTimer = setTimeout(() => this.runProactiveRefresh(), Yb);
    }
  }
  load() {
    var r;
    let l;
    try {
      l = (r = this.storage) == null ? void 0 : r.getItem(this.storageKey);
    } catch {
      return null;
    }
    if (!l)
      return null;
    const a = Kc(l);
    return !a || typeof a != "object" || typeof a.sessionToken != "string" || typeof a.refreshToken != "string" || typeof a.expiresAt != "number" || typeof a.wsUrl != "string" ? null : {
      sessionToken: a.sessionToken,
      refreshToken: a.refreshToken,
      expiresAt: a.expiresAt,
      wsUrl: a.wsUrl
    };
  }
  persist(l) {
    var a;
    try {
      const r = {
        sessionToken: l.sessionToken,
        refreshToken: l.refreshToken,
        expiresAt: l.expiresAt,
        wsUrl: l.wsUrl
      };
      (a = this.storage) == null || a.setItem(this.storageKey, JSON.stringify(r));
    } catch {
    }
  }
}
function Pe(c, l, a, r) {
  function o(f) {
    return f instanceof a ? f : new a(function(d) {
      d(f);
    });
  }
  return new (a || (a = Promise))(function(f, d) {
    function _(T) {
      try {
        g(r.next(T));
      } catch (V) {
        d(V);
      }
    }
    function b(T) {
      try {
        g(r.throw(T));
      } catch (V) {
        d(V);
      }
    }
    function g(T) {
      T.done ? f(T.value) : o(T.value).then(_, b);
    }
    g((r = r.apply(c, [])).next());
  });
}
function Qb(c) {
  return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
}
var Fs = { exports: {} }, Wd;
function Zb() {
  if (Wd) return Fs.exports;
  Wd = 1;
  var c = typeof Reflect == "object" ? Reflect : null, l = c && typeof c.apply == "function" ? c.apply : function(x, B, q) {
    return Function.prototype.apply.call(x, B, q);
  }, a;
  c && typeof c.ownKeys == "function" ? a = c.ownKeys : Object.getOwnPropertySymbols ? a = function(x) {
    return Object.getOwnPropertyNames(x).concat(Object.getOwnPropertySymbols(x));
  } : a = function(x) {
    return Object.getOwnPropertyNames(x);
  };
  function r(N) {
    console && console.warn && console.warn(N);
  }
  var o = Number.isNaN || function(x) {
    return x !== x;
  };
  function f() {
    f.init.call(this);
  }
  Fs.exports = f, Fs.exports.once = qe, f.EventEmitter = f, f.prototype._events = void 0, f.prototype._eventsCount = 0, f.prototype._maxListeners = void 0;
  var d = 10;
  function _(N) {
    if (typeof N != "function")
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof N);
  }
  Object.defineProperty(f, "defaultMaxListeners", {
    enumerable: !0,
    get: function() {
      return d;
    },
    set: function(N) {
      if (typeof N != "number" || N < 0 || o(N))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + N + ".");
      d = N;
    }
  }), f.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, f.prototype.setMaxListeners = function(x) {
    if (typeof x != "number" || x < 0 || o(x))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + x + ".");
    return this._maxListeners = x, this;
  };
  function b(N) {
    return N._maxListeners === void 0 ? f.defaultMaxListeners : N._maxListeners;
  }
  f.prototype.getMaxListeners = function() {
    return b(this);
  }, f.prototype.emit = function(x) {
    for (var B = [], q = 1; q < arguments.length; q++) B.push(arguments[q]);
    var Z = x === "error", ue = this._events;
    if (ue !== void 0)
      Z = Z && ue.error === void 0;
    else if (!Z)
      return !1;
    if (Z) {
      var ie;
      if (B.length > 0 && (ie = B[0]), ie instanceof Error)
        throw ie;
      var ke = new Error("Unhandled error." + (ie ? " (" + ie.message + ")" : ""));
      throw ke.context = ie, ke;
    }
    var Be = ue[x];
    if (Be === void 0)
      return !1;
    if (typeof Be == "function")
      l(Be, this, B);
    else
      for (var $e = Be.length, ut = F(Be, $e), q = 0; q < $e; ++q)
        l(ut[q], this, B);
    return !0;
  };
  function g(N, x, B, q) {
    var Z, ue, ie;
    if (_(B), ue = N._events, ue === void 0 ? (ue = N._events = /* @__PURE__ */ Object.create(null), N._eventsCount = 0) : (ue.newListener !== void 0 && (N.emit(
      "newListener",
      x,
      B.listener ? B.listener : B
    ), ue = N._events), ie = ue[x]), ie === void 0)
      ie = ue[x] = B, ++N._eventsCount;
    else if (typeof ie == "function" ? ie = ue[x] = q ? [B, ie] : [ie, B] : q ? ie.unshift(B) : ie.push(B), Z = b(N), Z > 0 && ie.length > Z && !ie.warned) {
      ie.warned = !0;
      var ke = new Error("Possible EventEmitter memory leak detected. " + ie.length + " " + String(x) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      ke.name = "MaxListenersExceededWarning", ke.emitter = N, ke.type = x, ke.count = ie.length, r(ke);
    }
    return N;
  }
  f.prototype.addListener = function(x, B) {
    return g(this, x, B, !1);
  }, f.prototype.on = f.prototype.addListener, f.prototype.prependListener = function(x, B) {
    return g(this, x, B, !0);
  };
  function T() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function V(N, x, B) {
    var q = { fired: !1, wrapFn: void 0, target: N, type: x, listener: B }, Z = T.bind(q);
    return Z.listener = B, q.wrapFn = Z, Z;
  }
  f.prototype.once = function(x, B) {
    return _(B), this.on(x, V(this, x, B)), this;
  }, f.prototype.prependOnceListener = function(x, B) {
    return _(B), this.prependListener(x, V(this, x, B)), this;
  }, f.prototype.removeListener = function(x, B) {
    var q, Z, ue, ie, ke;
    if (_(B), Z = this._events, Z === void 0)
      return this;
    if (q = Z[x], q === void 0)
      return this;
    if (q === B || q.listener === B)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete Z[x], Z.removeListener && this.emit("removeListener", x, q.listener || B));
    else if (typeof q != "function") {
      for (ue = -1, ie = q.length - 1; ie >= 0; ie--)
        if (q[ie] === B || q[ie].listener === B) {
          ke = q[ie].listener, ue = ie;
          break;
        }
      if (ue < 0)
        return this;
      ue === 0 ? q.shift() : ce(q, ue), q.length === 1 && (Z[x] = q[0]), Z.removeListener !== void 0 && this.emit("removeListener", x, ke || B);
    }
    return this;
  }, f.prototype.off = f.prototype.removeListener, f.prototype.removeAllListeners = function(x) {
    var B, q, Z;
    if (q = this._events, q === void 0)
      return this;
    if (q.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : q[x] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete q[x]), this;
    if (arguments.length === 0) {
      var ue = Object.keys(q), ie;
      for (Z = 0; Z < ue.length; ++Z)
        ie = ue[Z], ie !== "removeListener" && this.removeAllListeners(ie);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (B = q[x], typeof B == "function")
      this.removeListener(x, B);
    else if (B !== void 0)
      for (Z = B.length - 1; Z >= 0; Z--)
        this.removeListener(x, B[Z]);
    return this;
  };
  function P(N, x, B) {
    var q = N._events;
    if (q === void 0)
      return [];
    var Z = q[x];
    return Z === void 0 ? [] : typeof Z == "function" ? B ? [Z.listener || Z] : [Z] : B ? se(Z) : F(Z, Z.length);
  }
  f.prototype.listeners = function(x) {
    return P(this, x, !0);
  }, f.prototype.rawListeners = function(x) {
    return P(this, x, !1);
  }, f.listenerCount = function(N, x) {
    return typeof N.listenerCount == "function" ? N.listenerCount(x) : W.call(N, x);
  }, f.prototype.listenerCount = W;
  function W(N) {
    var x = this._events;
    if (x !== void 0) {
      var B = x[N];
      if (typeof B == "function")
        return 1;
      if (B !== void 0)
        return B.length;
    }
    return 0;
  }
  f.prototype.eventNames = function() {
    return this._eventsCount > 0 ? a(this._events) : [];
  };
  function F(N, x) {
    for (var B = new Array(x), q = 0; q < x; ++q)
      B[q] = N[q];
    return B;
  }
  function ce(N, x) {
    for (; x + 1 < N.length; x++)
      N[x] = N[x + 1];
    N.pop();
  }
  function se(N) {
    for (var x = new Array(N.length), B = 0; B < x.length; ++B)
      x[B] = N[B].listener || N[B];
    return x;
  }
  function qe(N, x) {
    return new Promise(function(B, q) {
      function Z(ie) {
        N.removeListener(x, ue), q(ie);
      }
      function ue() {
        typeof N.removeListener == "function" && N.removeListener("error", Z), B([].slice.call(arguments));
      }
      me(N, x, ue, { once: !0 }), x !== "error" && lt(N, Z, { once: !0 });
    });
  }
  function lt(N, x, B) {
    typeof N.on == "function" && me(N, "error", x, B);
  }
  function me(N, x, B, q) {
    if (typeof N.on == "function")
      q.once ? N.once(x, B) : N.on(x, B);
    else if (typeof N.addEventListener == "function")
      N.addEventListener(x, function Z(ue) {
        q.once && N.removeEventListener(x, Z), B(ue);
      });
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof N);
  }
  return Fs.exports;
}
var Kb = Zb(), Dm = /* @__PURE__ */ Qb(Kb), Re;
(function(c) {
  c[c.timeout = 1] = "timeout", c[c.transportClosed = 2] = "transportClosed", c[c.clientDisconnected = 3] = "clientDisconnected", c[c.clientClosed = 4] = "clientClosed", c[c.clientConnectToken = 5] = "clientConnectToken", c[c.clientRefreshToken = 6] = "clientRefreshToken", c[c.subscriptionUnsubscribed = 7] = "subscriptionUnsubscribed", c[c.subscriptionSubscribeToken = 8] = "subscriptionSubscribeToken", c[c.subscriptionRefreshToken = 9] = "subscriptionRefreshToken", c[c.transportWriteError = 10] = "transportWriteError", c[c.connectionClosed = 11] = "connectionClosed", c[c.badConfiguration = 12] = "badConfiguration", c[c.subscriptionGetState = 13] = "subscriptionGetState", c[c.sharedPollGetSignature = 14] = "sharedPollGetSignature";
})(Re || (Re = {}));
var Rn;
(function(c) {
  c[c.connectCalled = 0] = "connectCalled", c[c.transportClosed = 1] = "transportClosed", c[c.noPing = 2] = "noPing", c[c.subscribeTimeout = 3] = "subscribeTimeout", c[c.unsubscribeError = 4] = "unsubscribeError";
})(Rn || (Rn = {}));
var El;
(function(c) {
  c[c.disconnectCalled = 0] = "disconnectCalled", c[c.unauthorized = 1] = "unauthorized", c[c.badProtocol = 2] = "badProtocol", c[c.messageSizeLimit = 3] = "messageSizeLimit", c[c.stateInvalidated = 3014] = "stateInvalidated";
})(El || (El = {}));
var ar;
(function(c) {
  c[c.subscribeCalled = 0] = "subscribeCalled", c[c.transportClosed = 1] = "transportClosed";
})(ar || (ar = {}));
var Ua;
(function(c) {
  c[c.unsubscribeCalled = 0] = "unsubscribeCalled", c[c.unauthorized = 1] = "unauthorized", c[c.clientClosed = 2] = "clientClosed", c[c.stateInvalidated = 2502] = "stateInvalidated";
})(Ua || (Ua = {}));
var Ma;
(function(c) {
  c[c.channelCompaction = 1] = "channelCompaction", c[c.rejectUnrecovered = 2] = "rejectUnrecovered";
})(Ma || (Ma = {}));
var He;
(function(c) {
  c.Disconnected = "disconnected", c.Connecting = "connecting", c.Connected = "connected";
})(He || (He = {}));
var ht;
(function(c) {
  c.Unsubscribed = "unsubscribed", c.Subscribing = "subscribing", c.Subscribed = "subscribed";
})(ht || (ht = {}));
function Pb(c, l) {
  return c.lastIndexOf(l, 0) === 0;
}
function zm(c) {
  return c == null ? !1 : typeof c == "function";
}
function Jb(c, l) {
  if (globalThis.console) {
    const a = globalThis.console[c];
    zm(a) && a.apply(globalThis.console, l);
  }
}
function Wb(c, l) {
  return Math.floor(Math.random() * (l - c + 1) + c);
}
function Ri(c, l, a) {
  c > 31 && (c = 31);
  const r = Wb(0, Math.min(a, l * Math.pow(2, c)));
  return Math.min(a, l + r);
}
function Ib(c) {
  return "error" in c && c.error !== null;
}
function Ca(c) {
  return Math.min(c * 1e3, 2147483647);
}
var It;
(function(c) {
  c[c.Live = 0] = "Live", c[c.Stream = 1] = "Stream", c[c.State = 2] = "State";
})(It || (It = {}));
class Pc extends Dm {
  /** Subscription constructor should not be used directly, create subscriptions using Client method. */
  constructor(l, a, r) {
    super(), this._resubscribeTimeout = null, this._refreshTimeout = null, this._getState = null, this._map = !1, this._mapPresenceType = 1, this._mapPhase = null, this._mapStateBuffer = [], this._mapStreamBuffer = [], this._mapCursor = "", this._mapPageSize = 0, this._mapUnrecoverableStrategy = "from_scratch", this._debounceMs = 0, this._debouncePending = /* @__PURE__ */ new Map(), this._sharedPoll = !1, this._sharedPollEpoch = "", this._sharedPollTrackedItems = /* @__PURE__ */ new Map(), this._sharedPollGetSignature = null, this._sharedPollSignatureRefreshTimeout = null, this._sharedPollSignatureRefreshAttempts = 0, this._sharedPollTrackRetryTimeout = null, this._sharedPollTrackRetryAttempts = 0, this._sharedPollReplayRetryTimeout = null, this._sharedPollReplayRetryAttempts = 0, this._sharedPollSignatures = [], this._sharedPollSignatureRefreshTargetMs = null, this._sharedPollSignatureRefreshInFlight = !1, this.channel = a, this.state = ht.Unsubscribed, this._centrifuge = l, this._token = "", this._getToken = null, this._data = null, this._getData = null, this._recover = !1, this._offset = null, this._epoch = null, this._id = 0, this._recoverable = !1, this._positioned = !1, this._joinLeave = !1, this._minResubscribeDelay = 500, this._maxResubscribeDelay = 2e4, this._resubscribeTimeout = null, this._resubscribeAttempts = 0, this._promises = {}, this._promiseId = 0, this._inflight = !1, this._refreshTimeout = null, this._delta = "", this._delta_negotiated = !1, this._tagsFilter = null, this._prevValueMap = /* @__PURE__ */ new Map(), this._unsubPromise = Promise.resolve(), this._deltaNumPubs = 0, this._deltaNumFull = 0, this._deltaNumDelta = 0, this._deltaBytesReceived = 0, this._deltaBytesDecoded = 0, this._setOptions(r), this.type = this._sharedPoll ? "shared_poll" : this._map ? "map" : "stream", this._centrifuge._debugEnabled ? (this.on("state", (o) => {
      this._debug("subscription state", a, o.oldState, "->", o.newState);
    }), this.on("error", (o) => {
      this._debug("subscription error", a, o);
    })) : this.on("error", function() {
      Function.prototype();
    });
  }
  /** ready returns a Promise which resolves upon subscription goes to Subscribed
   * state and rejects in case of subscription goes to Unsubscribed state.
   * Optional timeout can be passed.*/
  ready(l) {
    return this.state === ht.Unsubscribed ? Promise.reject({ code: Re.subscriptionUnsubscribed, message: this.state }) : this.state === ht.Subscribed ? Promise.resolve() : new Promise((a, r) => {
      const o = {
        resolve: a,
        reject: r
      };
      l && (o.timeout = setTimeout(function() {
        r({ code: Re.timeout, message: "timeout" });
      }, l)), this._promises[this._nextPromiseId()] = o;
    });
  }
  /** subscribe to a channel.*/
  subscribe() {
    this._isSubscribed() || (this._resubscribeAttempts = 0, this._setSubscribing(ar.subscribeCalled, "subscribe called"));
  }
  /** unsubscribe from a channel, keeping position state.*/
  unsubscribe() {
    this._unsubPromise = this._setUnsubscribed(Ua.unsubscribeCalled, "unsubscribe called", !0);
  }
  _debouncedPublish(l, a, r) {
    const o = this._debouncePending.get(l);
    if (o)
      return o.data = a, o.dirty = !0, Promise.resolve({});
    const f = { data: a, dirty: !1, timer: null };
    return f.timer = setTimeout(() => {
      const _ = this._debouncePending.get(l);
      if (!_ || !_.dirty) {
        this._debouncePending.delete(l);
        return;
      }
      _.dirty = !1;
      const b = _.data;
      (r ? this._centrifuge.mapPublish(this.channel, l, b) : this._centrifuge.publish(this.channel, b)).catch(() => {
      }), _.timer = setTimeout(() => {
        const T = this._debouncePending.get(l);
        if (!T || !T.dirty) {
          this._debouncePending.delete(l);
          return;
        }
        this._debouncePending.delete(l), this._debouncedPublish(l, T.data, r);
      }, this._debounceMs);
    }, this._debounceMs), this._debouncePending.set(l, f), r ? this._centrifuge.mapPublish(this.channel, l, a) : this._centrifuge.publish(this.channel, a);
  }
  _cancelDebounce(l) {
    const a = this._debouncePending.get(l);
    a && (clearTimeout(a.timer), this._debouncePending.delete(l));
  }
  _cancelAllDebounce() {
    for (const [, l] of this._debouncePending)
      clearTimeout(l.timer);
    this._debouncePending.clear();
  }
  /** get online presence for a channel.*/
  presence() {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._centrifuge.presence(this.channel);
    });
  }
  /** presence stats for a channel (num clients and unique users).*/
  presenceStats() {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._centrifuge.presenceStats(this.channel);
    });
  }
  /**
   * Sets server-side tags filter for the subscription.
   * This only applies on the next subscription attempt, not the current one.
   * Cannot be used together with delta option.
   *
   * @param tagsFilter - Filter configuration object or null to remove filter
   * @throws {Error} If both delta and tagsFilter are configured
   *
   * @example
   * ```typescript
   * // Simple equality filter
   * sub.setTagsFilter({
   *   key: 'ticker',
   *   cmp: 'eq',
   *   val: 'BTC'
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Complex filter with logical operators
   * sub.setTagsFilter({
   *   op: 'and',
   *   nodes: [
   *     { key: 'ticker', cmp: 'eq', val: 'BTC' },
   *     { key: 'price', cmp: 'gt', val: '50000' }
   *   ]
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Filter with IN operator
   * sub.setTagsFilter({
   *   key: 'ticker',
   *   cmp: 'in',
   *   vals: ['BTC', 'ETH', 'SOL']
   * });
   * ```
   */
  setTagsFilter(l) {
    if (l && this._delta)
      throw new Error("cannot use delta and tagsFilter together");
    this._tagsFilter = l, this._map && (this._recover = !1, this._offset = null, this._epoch = null);
  }
  /** setData allows setting subscription data. This only applied on the next subscription attempt,
   * Note that if getData callback is configured, it will override this value during resubscriptions. */
  setData(l) {
    this._data = l;
  }
  /** deltaStats returns delta compression statistics for this subscription.
   * Only meaningful when delta compression is enabled (delta: 'fossil'). */
  deltaStats() {
    const l = this._deltaBytesDecoded;
    return {
      numPublications: this._deltaNumPubs,
      numFullPayloads: this._deltaNumFull,
      numDeltaPayloads: this._deltaNumDelta,
      bytesReceived: this._deltaBytesReceived,
      bytesDecoded: l,
      compressionRatio: l > 0 ? 1 - this._deltaBytesReceived / l : 0
    };
  }
  _methodCall() {
    return this._isSubscribed() ? Promise.resolve() : this._isUnsubscribed() ? Promise.reject({
      code: Re.subscriptionUnsubscribed,
      message: this.state
    }) : new Promise((l, a) => {
      const r = this._centrifuge._config.timeout, o = setTimeout(() => {
        a({ code: Re.timeout, message: "timeout" });
      }, r);
      this._promises[this._nextPromiseId()] = {
        timeout: o,
        resolve: l,
        reject: a
      };
    });
  }
  _nextPromiseId() {
    return ++this._promiseId;
  }
  _needRecover() {
    return this._recover === !0;
  }
  _isUnsubscribed() {
    return this.state === ht.Unsubscribed;
  }
  _isSubscribing() {
    return this.state === ht.Subscribing;
  }
  _isSubscribed() {
    return this.state === ht.Subscribed;
  }
  _setState(l) {
    if (this.state !== l) {
      const a = this.state;
      return this.state = l, this.emit("state", { newState: l, oldState: a, channel: this.channel }), !0;
    }
    return !1;
  }
  _usesToken() {
    return this._token !== "" || this._getToken !== null;
  }
  _clearSubscribingState() {
    this._resubscribeAttempts = 0, this._clearResubscribeTimeout();
  }
  _clearSubscribedState() {
    this._clearRefreshTimeout(), this._clearSharedPollSignatureRefresh(), this._clearSharedPollTrackRetry(), this._clearSharedPollReplayRetry(), this._sharedPollSignatureRefreshTargetMs = null, this._sharedPollSignatureRefreshInFlight = !1;
  }
  /** Called on "state invalidated" — unsubscribe code 2502 for this channel,
   *  or connection disconnect code 3014. Clears the token (next subscribe
   *  fetches a fresh one) and the fossil delta base (every subscription type
   *  uses _prevValueMap; a stale base would corrupt decoding of the first
   *  publication after re-subscribe).
   *
   *  Map subscriptions restart from scratch: their recovery position and
   *  materialized-state buffers are dropped so the next subscribe does a full
   *  STATE re-sync.
   *
   *  Stream/shared-poll subscriptions instead reset the recovery position to a
   *  sentinel epoch ("_") the server can never match (offset 0), leaving
   *  _recover untouched: a recoverable subscription then resubscribes with
   *  was_recovering=true, recovered=false (so the app reloads via its existing
   *  recovery-failure path rather than treating it as a brand-new first
   *  subscribe), while a non-recoverable one simply resubscribes. The real
   *  epoch/offset are adopted from the subscribe reply. */
  _invalidateState() {
    this._token = "", this._prevValueMap = /* @__PURE__ */ new Map(), this._map ? (this._offset = null, this._epoch = null, this._recover = !1, this._mapStateBuffer = [], this._mapStreamBuffer = [], this._mapCursor = "", this._mapPhase = null) : (this._offset = 0, this._epoch = "_");
  }
  _setSubscribed(l) {
    if (!this._isSubscribing())
      return;
    if (this._clearSubscribingState(), l.id && (this._id = l.id), l.recoverable && (this._recover = !0, this._offset = l.offset || 0, this._epoch = l.epoch || ""), l.delta ? this._delta_negotiated = !0 : this._delta_negotiated = !1, l.publish_debounce && (this._debounceMs = l.publish_debounce), this._sharedPoll) {
      const o = l.epoch || "";
      if (this._sharedPollEpoch !== "" && this._sharedPollEpoch !== o)
        for (const f of this._sharedPollTrackedItems.keys())
          this._sharedPollTrackedItems.set(f, 0);
      this._sharedPollEpoch = o;
    }
    this._setState(ht.Subscribed);
    const a = this._centrifuge._getSubscribeContext(this.channel, l);
    this.emit("subscribed", a), this._resolvePromises();
    const r = l.publications;
    if (r && r.length > 0)
      for (const o in r)
        r.hasOwnProperty(o) && this._handlePublication(r[o]);
    l.expires === !0 && (this._refreshTimeout = setTimeout(() => this._refresh(), Ca(l.ttl)));
  }
  _setSubscribing(l, a) {
    return Pe(this, void 0, void 0, function* () {
      this._isSubscribing() || (this._isSubscribed() && this._clearSubscribedState(), this._id = 0, this._setState(ht.Subscribing) && this.emit("subscribing", { channel: this.channel, code: l, reason: a }), this._centrifuge._transport && this._centrifuge._transport.emulation() && (yield this._unsubPromise), this._isSubscribing() && this._subscribe());
    });
  }
  _subscribe() {
    return this._debug("subscribing on", this.channel), this._isTransportOpen() ? this._inflight ? null : (this._inflight = !0, this._map ? (this._mapSubscribe(), null) : this._getState && this._offset === null ? (this._loadStreamState(), null) : this._canSubscribeWithoutGettingToken() ? this._subscribeWithoutToken() : (this._getSubscriptionToken().then((l) => this._handleTokenResponse(l)).catch((l) => this._handleTokenError(l)), null)) : (this._debug("delay subscribe on", this.channel, "till connected"), null);
  }
  _isTransportOpen() {
    return this._centrifuge._transportIsOpen;
  }
  _canSubscribeWithoutGettingToken() {
    return !this._usesToken() || !!this._token;
  }
  _subscribeWithoutToken() {
    return this._getData ? (this._getDataAndSubscribe(this._token), null) : this._sendSubscribe(this._token);
  }
  /** Load stream position from app via getState callback, then proceed to subscribe
   * with recovery from that position. Called only when _offset is null:
   * - Initial subscribe (no saved position)
   * - After position reset due to failed recovery (see _setSubscribed)
   *
   * NOT called on normal reconnects where the SDK has a saved position — in that
   * case recovery is attempted first, and getState is only invoked if recovery fails.
   *
   * The app's getState callback should:
   * 1. Read cf_stream_top_position (or equivalent) FIRST to capture the stream position
   * 2. Then read its own data from the database/API
   * 3. Render/update the UI
   * 4. Return the captured stream position
   *
   * This order is critical: reading position first ensures it's a lower bound.
   * Recovered publications may overlap with data the app already loaded — this
   * requires idempotent updates or offset-based dedup. */
  _loadStreamState() {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    this._getState().then((l) => {
      if (!this._isSubscribing()) {
        this._inflight = !1;
        return;
      }
      this._offset = l.offset, this._epoch = l.epoch, this._recover = !0, this._canSubscribeWithoutGettingToken() ? this._subscribeWithoutToken() : this._getSubscriptionToken().then((a) => this._handleTokenResponse(a)).catch((a) => this._handleTokenError(a));
    }).catch((l) => {
      if (!this._isSubscribing()) {
        this._inflight = !1;
        return;
      }
      this._inflight = !1, this._subscribeError({
        code: Re.subscriptionGetState,
        message: (l == null ? void 0 : l.toString()) || "getState failed",
        temporary: !0
      });
    });
  }
  _getDataAndSubscribe(l) {
    if (!this._getData) {
      this._inflight = !1;
      return;
    }
    this._getData({ channel: this.channel }).then((a) => {
      if (!this._isSubscribing()) {
        this._inflight = !1;
        return;
      }
      this._data = a, this._sendSubscribe(l);
    }).catch((a) => this._handleGetDataError(a));
  }
  _handleGetDataError(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (l instanceof xn) {
      this._inflight = !1, this._failUnauthorized();
      return;
    }
    this.emit("error", {
      type: "subscribeData",
      channel: this.channel,
      error: {
        code: Re.badConfiguration,
        message: (l == null ? void 0 : l.toString()) || ""
      }
    }), this._inflight = !1, this._scheduleResubscribe();
  }
  _handleTokenResponse(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (!l) {
      this._inflight = !1, this._failUnauthorized();
      return;
    }
    this._token = l, this._getData ? this._getDataAndSubscribe(l) : this._sendSubscribe(l);
  }
  _handleTokenError(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (l instanceof xn) {
      this._inflight = !1, this._failUnauthorized();
      return;
    }
    this.emit("error", {
      type: "subscribeToken",
      channel: this.channel,
      error: {
        code: Re.subscriptionSubscribeToken,
        message: (l == null ? void 0 : l.toString()) || ""
      }
    }), this._inflight = !1, this._scheduleResubscribe();
  }
  _sendSubscribe(l) {
    if (!this._isTransportOpen())
      return this._inflight = !1, null;
    const a = this._buildSubscribeCommand(l);
    return this._centrifuge._call(a).then((r) => {
      this._inflight = !1;
      const o = r.reply.subscribe;
      this._handleSubscribeResponse(o), r.next && r.next();
    }, (r) => {
      this._inflight = !1, this._handleSubscribeError(r.error), r.next && r.next();
    }), a;
  }
  _buildSubscribeCommand(l) {
    const a = { channel: this.channel };
    if (l && (a.token = l), this._data && (a.data = this._data), this._sharedPoll)
      return a.type = 4, this._delta && (a.delta = this._delta), { subscribe: a };
    if (this._positioned && (a.positioned = !0), this._recoverable && (a.recoverable = !0), this._joinLeave && (a.join_leave = !0), a.flag = Ma.channelCompaction, this._getState && (a.flag |= Ma.rejectUnrecovered), this._needRecover()) {
      a.recover = !0;
      const r = this._getOffset();
      r && (a.offset = r);
      const o = this._getEpoch();
      o && (a.epoch = o);
    }
    return this._delta && (a.delta = this._delta), this._tagsFilter && (a.tf = this._tagsFilter), { subscribe: a };
  }
  _debug(...l) {
    this._centrifuge._debug(...l);
  }
  _handleSubscribeError(l) {
    if (this._isSubscribing()) {
      if (l.code === Re.timeout) {
        this._centrifuge._disconnect(Rn.subscribeTimeout, "subscribe timeout", !0);
        return;
      }
      if (l.code === 112 && this._getState) {
        this._offset = null, this._epoch = null, this._recover = !1, this._prevValueMap = /* @__PURE__ */ new Map(), this._scheduleResubscribe();
        return;
      }
      this._subscribeError(l);
    }
  }
  _handleSubscribeResponse(l) {
    this._isSubscribing() && (this._setSubscribed(l), this._sharedPoll && this._sharedPollReplayTrack());
  }
  _setUnsubscribed(l, a, r) {
    if (this._isUnsubscribed())
      return Promise.resolve();
    let o = Promise.resolve();
    return this._isSubscribed() ? (r && (o = this._centrifuge._unsubscribe(this)), this._clearSubscribedState()) : this._isSubscribing() && (this._inflight && r && (o = this._centrifuge._unsubscribe(this)), this._clearSubscribingState()), this._inflight = !1, this._id = 0, this._sharedPollEpoch = "", this._sharedPollSignatures = [], this._sharedPollTrackedItems.clear(), this._sharedPollSignatureRefreshInFlight = !1, this._sharedPollSignatureRefreshTargetMs = null, this._cancelAllDebounce(), this._setState(ht.Unsubscribed) && this.emit("unsubscribed", { channel: this.channel, code: l, reason: a }), this._rejectPromises({ code: Re.subscriptionUnsubscribed, message: this.state }), o;
  }
  _handlePublication(l) {
    if (this._delta && this._delta_negotiated) {
      const r = (this._map || this._sharedPoll) && l.key || "", { newData: o, newPrevValue: f, isDelta: d, wireBytes: _, fullBytes: b } = this._centrifuge._codec.applyDeltaIfNeeded(l, this._prevValueMap.get(r));
      l.data = o, this._deltaNumPubs++, this._deltaBytesReceived += _, this._deltaBytesDecoded += b, d ? this._deltaNumDelta++ : this._deltaNumFull++, l.removed ? this._prevValueMap.delete(r) : this._prevValueMap.set(r, f);
    }
    let a;
    if (this._sharedPoll) {
      if (l.key && !this._sharedPollTrackedItems.has(l.key))
        return;
      l.key && (l.removed ? this._sharedPollTrackedItems.delete(l.key) : l.version && this._sharedPollTrackedItems.set(l.key, l.version)), a = this._getSharedPollUpdateContext(l);
    } else this._map ? a = this._getMapUpdateContext(l) : a = this._centrifuge._getPublicationContext(this.channel, l);
    this.emit("publication", a), (this._map || this._sharedPoll) && this.emit("update", a), l.offset && (this._offset = l.offset), l.epoch && (this._epoch = l.epoch);
  }
  /** Seed per-key delta tracking from state/stream entries.
   * Handles JSON-escaped data (server-side delta escaping) and protobuf data.
   * Decodes escaped data back to original format for user consumption. */
  _seedDeltaTracking(l) {
    if (!(!this._delta || !l.key)) {
      if (typeof l.data == "string") {
        const a = l.data;
        l.removed ? this._prevValueMap.delete(l.key) : this._prevValueMap.set(l.key, new TextEncoder().encode(a));
        const r = a.length;
        this._deltaNumPubs++, this._deltaNumFull++, this._deltaBytesReceived += r, this._deltaBytesDecoded += r, l.data = JSON.parse(a);
      } else if (l.data instanceof Uint8Array) {
        l.removed ? this._prevValueMap.delete(l.key) : this._prevValueMap.set(l.key, l.data);
        const a = l.data.length;
        this._deltaNumPubs++, this._deltaNumFull++, this._deltaBytesReceived += a, this._deltaBytesDecoded += a;
      }
    }
  }
  _handleJoin(l) {
    const a = this._centrifuge._getJoinLeaveContext(l.info);
    this.emit("join", { channel: this.channel, info: a });
  }
  _handleLeave(l) {
    const a = this._centrifuge._getJoinLeaveContext(l.info);
    this.emit("leave", { channel: this.channel, info: a });
  }
  _resolvePromises() {
    for (const l in this._promises)
      this._promises.hasOwnProperty(l) && (this._promises[l].timeout && clearTimeout(this._promises[l].timeout), this._promises[l].resolve(), delete this._promises[l]);
  }
  _rejectPromises(l) {
    for (const a in this._promises)
      this._promises.hasOwnProperty(a) && (this._promises[a].timeout && clearTimeout(this._promises[a].timeout), this._promises[a].reject(l), delete this._promises[a]);
  }
  _scheduleResubscribe() {
    if (!this._isSubscribing()) {
      this._debug("not in subscribing state, skip resubscribe scheduling", this.channel);
      return;
    }
    const l = this, a = this._getResubscribeDelay();
    this._resubscribeTimeout = setTimeout(function() {
      l._isSubscribing() && l._subscribe();
    }, a), this._debug("resubscribe scheduled after " + a, this.channel);
  }
  _subscribeError(l) {
    if (this._isSubscribing())
      if (l.code < 100 || l.code === 109 || l.temporary === !0) {
        l.code === 109 && (this._token = "");
        const a = {
          channel: this.channel,
          type: "subscribe",
          error: l
        };
        this._centrifuge.state === He.Connected && this.emit("error", a), this._scheduleResubscribe();
      } else
        this._setUnsubscribed(l.code, l.message, !1);
  }
  _getResubscribeDelay() {
    const l = Ri(this._resubscribeAttempts, this._minResubscribeDelay, this._maxResubscribeDelay);
    return this._resubscribeAttempts++, l;
  }
  _setOptions(l) {
    if (l) {
      if (l.since && (this._offset = l.since.offset || 0, this._epoch = l.since.epoch || "", this._recover = !0), l.data && (this._data = l.data), l.getData && (this._getData = l.getData), l.minResubscribeDelay !== void 0 && (this._minResubscribeDelay = l.minResubscribeDelay), l.maxResubscribeDelay !== void 0 && (this._maxResubscribeDelay = l.maxResubscribeDelay), l.token && (this._token = l.token), l.getToken && (this._getToken = l.getToken), l.positioned === !0 && (this._positioned = !0), l.recoverable === !0 && (this._recoverable = !0), l.joinLeave === !0 && (this._joinLeave = !0), l.delta) {
        if (l.delta !== "fossil")
          throw new Error("unsupported delta format");
        this._delta = l.delta;
      }
      if (l.tagsFilter && (this._tagsFilter = l.tagsFilter), this._tagsFilter && this._delta)
        throw new Error("cannot use delta and tagsFilter together");
      l.getState && (this._getState = l.getState, this._recover = !0), l.map === !0 && (this._map = !0), l.mapPageSize !== void 0 && (this._mapPageSize = l.mapPageSize), l.mapPresenceType !== void 0 && (this._mapPresenceType = l.mapPresenceType, this._map = !0), l.mapUnrecoverableStrategy && (this._mapUnrecoverableStrategy = l.mapUnrecoverableStrategy), l.sharedPoll === !0 && (this._sharedPoll = !0), l.sharedPollGetSignature && (this._sharedPollGetSignature = l.sharedPollGetSignature);
    }
  }
  _getOffset() {
    const l = this._offset;
    return l !== null ? l : 0;
  }
  _getEpoch() {
    const l = this._epoch;
    return l !== null ? l : "";
  }
  _clearRefreshTimeout() {
    this._refreshTimeout !== null && (clearTimeout(this._refreshTimeout), this._refreshTimeout = null);
  }
  _clearResubscribeTimeout() {
    this._resubscribeTimeout !== null && (clearTimeout(this._resubscribeTimeout), this._resubscribeTimeout = null);
  }
  _getSubscriptionToken() {
    this._debug("get subscription token for channel", this.channel);
    const l = {
      channel: this.channel
    }, a = this._getToken;
    return a === null ? (this.emit("error", {
      type: "configuration",
      channel: this.channel,
      error: {
        code: Re.badConfiguration,
        message: "provide a function to get channel subscription token"
      }
    }), Promise.reject(new xn(""))) : a(l);
  }
  _refresh() {
    this._clearRefreshTimeout();
    const l = this;
    this._getSubscriptionToken().then(function(a) {
      if (!l._isSubscribed())
        return;
      if (!a) {
        l._failUnauthorized();
        return;
      }
      l._token = a;
      const o = {
        sub_refresh: {
          channel: l.channel,
          token: a
        }
      };
      l._centrifuge._call(o).then((f) => {
        const d = f.reply.sub_refresh;
        l._refreshResponse(d), f.next && f.next();
      }, (f) => {
        l._refreshError(f.error), f.next && f.next();
      });
    }).catch(function(a) {
      if (a instanceof xn) {
        l._failUnauthorized();
        return;
      }
      l.emit("error", {
        type: "refreshToken",
        channel: l.channel,
        error: {
          code: Re.subscriptionRefreshToken,
          message: a !== void 0 ? a.toString() : ""
        }
      }), l._refreshTimeout = setTimeout(() => l._refresh(), l._getRefreshRetryDelay());
    });
  }
  _refreshResponse(l) {
    this._isSubscribed() && (this._debug("subscription token refreshed, channel", this.channel), this._clearRefreshTimeout(), l.expires === !0 && (this._refreshTimeout = setTimeout(() => this._refresh(), Ca(l.ttl))));
  }
  _refreshError(l) {
    this._isSubscribed() && (l.code < 100 || l.temporary === !0 ? (this.emit("error", {
      type: "refresh",
      channel: this.channel,
      error: l
    }), this._refreshTimeout = setTimeout(() => this._refresh(), this._getRefreshRetryDelay())) : this._setUnsubscribed(l.code, l.message, !0));
  }
  _getRefreshRetryDelay() {
    return Ri(0, 1e4, 2e4);
  }
  _failUnauthorized() {
    this._setUnsubscribed(Ua.unauthorized, "unauthorized", !0);
  }
  // ============ Shared Poll Internal Helpers ============
  // Send ONE or MORE signature batches in a single sub_refresh frame.
  // Splits across frames when the estimated payload exceeds the wire frame
  // budget — keeps each request well under the 64k Centrifugo frame limit.
  _sendTrackRequest(l, a) {
    if (l.length === 0)
      return Promise.resolve();
    const r = 6e4, o = [];
    let f = [], d = 100;
    if (a && a.length > 0)
      for (const b of a)
        d += b.length + 4;
    for (const b of l) {
      let g = 100;
      for (const T of b.items)
        g += T.key.length + 16;
      f.length > 0 && d + g > r && (o.push(f), f = [], d = 100), f.push(b), d += g;
    }
    f.length > 0 && o.push(f);
    const _ = (b, g) => new Promise((T, V) => {
      const P = {
        channel: this.channel,
        type: 1,
        track: b.map((F) => ({
          signature: F.signature,
          items: F.items.map((ce) => ce.version > 0 ? ce : { key: ce.key })
        }))
      };
      g && g.length > 0 && (P.untrack = g);
      const W = { sub_refresh: P };
      this._centrifuge._call(W).then((F) => {
        this._handleTrackResponse(F.reply.sub_refresh), F.next && F.next(), T();
      }, (F) => {
        F.next && F.next(), V(F.error);
      });
    });
    return o.reduce((b, g, T) => b.then(() => _(g, T === 0 ? a : void 0)), Promise.resolve());
  }
  _sendUntrackRequest(l) {
    return new Promise((a, r) => {
      const f = { sub_refresh: {
        channel: this.channel,
        type: 2,
        untrack: l
      } };
      this._centrifuge._call(f).then((d) => {
        d.next && d.next(), a();
      }, (d) => {
        d.next && d.next(), r(d.error);
      });
    });
  }
  _handleTrackResponse(l) {
    if (this._clearSharedPollTrackRetry(), l && l.items && l.items.length > 0)
      for (const a of l.items)
        this._handlePublication(a);
    if (l && l.expires === !0 && l.ttl > 0) {
      const a = Date.now() + l.ttl * 1e3;
      this._maybeScheduleSharedPollSignatureRefresh(a);
    }
  }
  // Reschedule the consolidating refresh timer if `targetMs` is earlier than
  // the currently scheduled target. No-op when a sooner refresh is already
  // pending. Pass null to clear and reset (e.g. after consolidation succeeded).
  _maybeScheduleSharedPollSignatureRefresh(l) {
    if (l === null) {
      this._sharedPollSignatureRefreshTargetMs = null, this._clearSharedPollSignatureRefresh();
      return;
    }
    this._isSubscribed() && (this._sharedPollSignatureRefreshTargetMs !== null && l >= this._sharedPollSignatureRefreshTargetMs || (this._sharedPollSignatureRefreshTargetMs = l, this._clearSharedPollSignatureRefresh(), this._sharedPollSignatureRefreshTimeout = setTimeout(() => this._sharedPollRefreshSignature(), Math.max(0, l - Date.now()))));
  }
  _clearSharedPollSignatureRefresh() {
    this._sharedPollSignatureRefreshTimeout !== null && (clearTimeout(this._sharedPollSignatureRefreshTimeout), this._sharedPollSignatureRefreshTimeout = null), this._sharedPollSignatureRefreshAttempts = 0;
  }
  _clearSharedPollTrackRetry() {
    this._sharedPollTrackRetryTimeout !== null && (clearTimeout(this._sharedPollTrackRetryTimeout), this._sharedPollTrackRetryTimeout = null), this._sharedPollTrackRetryAttempts = 0;
  }
  _clearSharedPollReplayRetry() {
    this._sharedPollReplayRetryTimeout !== null && (clearTimeout(this._sharedPollReplayRetryTimeout), this._sharedPollReplayRetryTimeout = null), this._sharedPollReplayRetryAttempts = 0;
  }
  _handleTrackError(l) {
    if (this._isSubscribed()) {
      if (this.emit("error", {
        type: "track",
        channel: this.channel,
        error: l
      }), l.code === 109) {
        this._sharedPollRefreshSignature();
        return;
      }
      (l.code < 100 || l.temporary === !0) && (this._sharedPollTrackRetryTimeout = setTimeout(() => this._sharedPollReplayTrack(), Ri(this._sharedPollTrackRetryAttempts++, 1e3, 15e3)));
    }
  }
  // _sharedPollRefreshSignature obtains a fresh consolidated signature
  // covering all currently tracked keys, then replaces the library with the
  // single new entry. Triggered by the TTL timer (server's `expires/ttl`
  // response) and by 109 errors on track commands. The in-flight guard
  // collapses concurrent refresh attempts into one.
  _sharedPollRefreshSignature() {
    if (this._clearSharedPollSignatureRefresh(), !this._isSubscribed() || !this._sharedPollGetSignature || this._sharedPollTrackedItems.size === 0 || this._sharedPollSignatureRefreshInFlight)
      return;
    this._sharedPollSignatureRefreshTargetMs = null, this._sharedPollSignatureRefreshInFlight = !0;
    const l = Array.from(this._sharedPollTrackedItems.keys()), a = this;
    this._sharedPollGetSignature({ keys: l }).then((r) => {
      if (a._sharedPollSignatureRefreshInFlight = !1, !a._isSubscribed())
        return;
      a._sharedPollSignatureRefreshAttempts = 0;
      const o = new Set(r.keys), f = [];
      for (const g of l)
        o.has(g) || (a._sharedPollTrackedItems.delete(g), f.push(g), a.emit("update", {
          channel: a.channel,
          key: g,
          data: null,
          removed: !0
        }));
      f.length > 0 && a._sendUntrackRequest(f).catch((g) => {
        a.emit("error", { type: "untrack", channel: a.channel, error: g });
      });
      const d = [];
      for (const g of r.keys) {
        const T = a._sharedPollTrackedItems.get(g);
        T !== void 0 && d.push({ key: g, version: T });
      }
      const _ = new Set(r.keys), b = a._sharedPollSignatures.filter((g) => g.keys.some((T) => a._sharedPollTrackedItems.has(T) && !_.has(T)));
      a._sharedPollSignatures = d.length > 0 ? [{ keys: r.keys, signature: r.signature }, ...b] : b, d.length !== 0 && a._sendTrackRequest([{ items: d, signature: r.signature }]).catch((g) => {
        a._handleTrackError(g);
      });
    }).catch((r) => {
      a._sharedPollSignatureRefreshInFlight = !1, a.emit("error", {
        type: "signatureRefresh",
        channel: a.channel,
        error: {
          code: Re.sharedPollGetSignature,
          message: r !== void 0 ? r.toString() : ""
        }
      }), a._sharedPollSignatureRefreshTimeout = setTimeout(() => a._sharedPollRefreshSignature(), Ri(a._sharedPollSignatureRefreshAttempts++, 5e3, 3e4));
    });
  }
  // _sharedPollReplayTrack runs after subscribe completes — on initial
  // subscribe AND after every reconnect. It reuses every cached signature
  // in _sharedPollSignatures so that mass reconnects don't trigger mass
  // getSignature calls on the application backend.
  //
  // For each cached batch:
  //   - Build a track command with the batch's ORIGINAL key set (HMAC was
  //     signed over those keys, so the full set must be sent). Versions are
  //     CURRENT per-connection versions, so the server pushes only what's
  //     changed.
  //   - Any keys in the batch that were locally untracked() since the original
  //     track() are sent in the same frame's `untrack` field — the server
  //     validates the full HMAC then removes them immediately, avoiding a
  //     separate round-trip.
  //
  // getSignature is invoked only when there are no cached signatures (e.g.
  // initial subscribe where track(keys) was called without explicit sig).
  // Once a signature is expired beyond the server's grace period, the next
  // track command returns error 109 — _handleTrackError then triggers
  // _sharedPollRefreshSignature for a fresh consolidated signature.
  _sharedPollReplayTrack() {
    if (!this._isSubscribed() || this._sharedPollTrackedItems.size === 0 && this._sharedPollSignatures.length === 0)
      return;
    const l = /* @__PURE__ */ new Set(), a = [], r = [];
    for (const d of this._sharedPollSignatures) {
      const _ = d.keys.map((b) => {
        var g;
        return {
          key: b,
          version: (g = this._sharedPollTrackedItems.get(b)) !== null && g !== void 0 ? g : 0
        };
      });
      a.push({ items: _, signature: d.signature });
      for (const b of d.keys)
        this._sharedPollTrackedItems.has(b) ? l.add(b) : r.push(b);
    }
    a.length > 0 && this._sendTrackRequest(a, r).catch((d) => {
      this._handleTrackError(d);
    });
    const o = [];
    for (const d of this._sharedPollTrackedItems.keys())
      l.has(d) || o.push(d);
    if (o.length === 0)
      return;
    if (!this._sharedPollGetSignature) {
      this.emit("error", {
        type: "track",
        channel: this.channel,
        error: { code: Re.sharedPollGetSignature, message: "getSignature callback required for tracked keys without an explicit signature" }
      });
      return;
    }
    const f = this;
    this._sharedPollGetSignature({ keys: o }).then((d) => {
      if (!f._isSubscribed())
        return;
      f._clearSharedPollReplayRetry();
      const _ = new Set(d.keys), b = [];
      for (const T of o)
        _.has(T) || (f._sharedPollTrackedItems.delete(T), b.push(T), f.emit("update", {
          channel: f.channel,
          key: T,
          data: null,
          removed: !0
        }));
      b.length > 0 && f._sendUntrackRequest(b).catch((T) => {
        f.emit("error", { type: "untrack", channel: f.channel, error: T });
      });
      const g = [];
      for (const T of d.keys) {
        const V = f._sharedPollTrackedItems.get(T);
        V !== void 0 && g.push({ key: T, version: V });
      }
      g.length !== 0 && (f._sharedPollSignatures.push({
        keys: d.keys,
        signature: d.signature
      }), f._sendTrackRequest([{ items: g, signature: d.signature }]).catch((T) => {
        f._handleTrackError(T);
      }));
    }).catch((d) => {
      f.emit("error", {
        type: "signatureRefresh",
        channel: f.channel,
        error: {
          code: Re.sharedPollGetSignature,
          message: d !== void 0 ? d.toString() : ""
        }
      }), f._sharedPollReplayRetryTimeout = setTimeout(() => f._sharedPollReplayTrack(), Ri(f._sharedPollReplayRetryAttempts++, 5e3, 3e4));
    });
  }
  // ============ Keyed Subscription Methods ============
  /** Entry point for map subscriptions */
  _mapSubscribe() {
    if (this._debug("starting map subscribe on", this.channel), this._mapStateBuffer = [], this._mapStreamBuffer = [], this._mapCursor = "", this._recover && this._offset !== null && this._epoch !== null || (this._prevValueMap = /* @__PURE__ */ new Map()), this._mapPhase = It.State, this._recover && this._offset !== null && this._epoch !== null) {
      this._debug("map subscribe: recovering from position, skipping to stream phase"), this._mapPhase = It.Stream, this._fetchStream();
      return;
    }
    this._canSubscribeWithoutGettingToken() ? this._fetchSnapshot() : this._getSubscriptionToken().then((l) => {
      if (!this._isSubscribing()) {
        this._inflight = !1;
        return;
      }
      if (!l) {
        this._inflight = !1, this._failUnauthorized();
        return;
      }
      this._token = l, this._fetchSnapshot();
    }).catch((l) => this._handleTokenError(l));
  }
  /** Fetch a page of snapshot data */
  _fetchSnapshot(l) {
    if (!this._isSubscribing() || !this._isTransportOpen()) {
      this._inflight = !1;
      return;
    }
    const a = this._buildMapSubscribeCommand(It.State, l);
    this._debug("map subscribe: fetching snapshot page", l ? `cursor=${l}` : "initial"), this._centrifuge._call(a).then((r) => {
      const o = r.reply.subscribe;
      this._handleMapStateResponse(o), r.next && r.next();
    }, (r) => {
      this._handleMapSubscribeError(r.error), r.next && r.next();
    });
  }
  /** Process snapshot response */
  _handleMapStateResponse(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (!l.phase) {
      this._debug("map subscribe: server forced LIVE transition during state pagination"), this._handleMapLiveResponse(l);
      return;
    }
    if (!this._epoch && l.epoch && (this._epoch = l.epoch, this._offset = l.offset || 0), this._epoch && l.epoch && this._epoch !== l.epoch) {
      this._debug("map subscribe: epoch changed during snapshot pagination, restarting"), this._mapStateBuffer = [], this._mapCursor = "", this._epoch = null, this._offset = null, this._prevValueMap = /* @__PURE__ */ new Map(), this._fetchSnapshot();
      return;
    }
    if (l.state && l.state.length > 0)
      for (const a of l.state)
        this._seedDeltaTracking(a), this._mapStateBuffer.push(this._getMapUpdateContext(a));
    if (l.cursor) {
      this._mapCursor = l.cursor, this._fetchSnapshot(this._mapCursor);
      return;
    }
    this._transitionFromSnapshot();
  }
  /** Transition from STATE to STREAM phase after snapshot pagination completes */
  _transitionFromSnapshot() {
    this._debug("map subscribe: snapshot complete, transitioning to stream phase"), this._mapPhase = It.Stream, this._fetchStream();
  }
  /** Fetch stream data (offset-based catch-up) */
  _fetchStream() {
    if (!this._isSubscribing() || !this._isTransportOpen()) {
      this._inflight = !1;
      return;
    }
    const l = this._buildMapSubscribeCommand(It.Stream);
    this._debug("map subscribe: fetching stream from offset", this._offset), this._centrifuge._call(l).then((a) => {
      const r = a.reply.subscribe;
      this._handleMapStreamResponse(r), a.next && a.next();
    }, (a) => {
      this._handleMapSubscribeError(a.error), a.next && a.next();
    });
  }
  /** Process stream response */
  _handleMapStreamResponse(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (!l.phase) {
      this._debug("map subscribe: server forced LIVE transition during stream"), this._handleMapLiveResponse(l);
      return;
    }
    if (this._epoch && l.epoch && this._epoch !== l.epoch) {
      this._debug("map subscribe: epoch changed during stream, restarting"), this._mapStateBuffer = [], this._mapStreamBuffer = [], this._epoch = null, this._offset = null, this._prevValueMap = /* @__PURE__ */ new Map(), this._mapPhase = It.State, this._fetchSnapshot();
      return;
    }
    if (l.publications && l.publications.length > 0)
      for (const a of l.publications)
        this._seedDeltaTracking(a), this._mapStreamBuffer.push(this._getMapUpdateContext(a));
    l.offset !== void 0 && (this._offset = l.offset), this._fetchStream();
  }
  /** Process live response - complete the map subscription */
  _handleMapLiveResponse(l) {
    if (!this._isSubscribing()) {
      this._inflight = !1;
      return;
    }
    if (this._inflight = !1, this._epoch && l.epoch && this._epoch !== l.epoch) {
      this._debug("map subscribe: epoch changed during live transition, restarting"), this._mapStateBuffer = [], this._mapStreamBuffer = [], this._epoch = null, this._offset = null, this._prevValueMap = /* @__PURE__ */ new Map(), this._inflight = !0, this._mapPhase = It.State, this._fetchSnapshot();
      return;
    }
    if (l.state && l.state.length > 0)
      for (const r of l.state)
        this._seedDeltaTracking(r), this._mapStateBuffer.push(this._getMapUpdateContext(r));
    if (l.publications && l.publications.length > 0)
      for (const r of l.publications) {
        if (this._delta && l.delta) {
          const o = r.key || "", { newData: f, newPrevValue: d, isDelta: _, wireBytes: b, fullBytes: g } = this._centrifuge._codec.applyDeltaIfNeeded(r, this._prevValueMap.get(o));
          r.data = f, this._deltaNumPubs++, this._deltaBytesReceived += b, this._deltaBytesDecoded += g, _ ? this._deltaNumDelta++ : this._deltaNumFull++, r.removed ? this._prevValueMap.delete(o) : this._prevValueMap.set(o, d);
        } else this._delta && r.key && (r.removed ? this._prevValueMap.delete(r.key) : this._prevValueMap.set(r.key, r.data));
        this._mapStreamBuffer.push(this._getMapUpdateContext(r));
      }
    this._offset = l.offset || 0, this._epoch = l.epoch || "", this._clearSubscribingState(), l.id && (this._id = l.id), this._recover = l.recoverable === !0, l.delta ? this._delta_negotiated = !0 : this._delta_negotiated = !1, l.publish_debounce && (this._debounceMs = l.publish_debounce), this._setState(ht.Subscribed);
    const a = this._centrifuge._getSubscribeContext(this.channel, l);
    if (a.state = this._mapStateBuffer, this.emit("subscribed", a), this._resolvePromises(), !a.recovered) {
      if (this._mapStreamBuffer.length > 0) {
        const r = /* @__PURE__ */ new Map();
        for (const o of this._mapStateBuffer)
          r.set(o.key, o);
        for (const o of this._mapStreamBuffer)
          o.removed ? r.delete(o.key) : r.set(o.key, o);
        this._mapStateBuffer = Array.from(r.values()), this._mapStreamBuffer = [];
      }
      this.emit("sync", { entries: this._mapStateBuffer });
    }
    for (const r of this._mapStreamBuffer)
      this.emit("publication", r), this.emit("update", r);
    this._mapStateBuffer = [], this._mapStreamBuffer = [], this._mapPhase = null, l.expires === !0 && (this._refreshTimeout = setTimeout(() => this._refresh(), Ca(l.ttl)));
  }
  /** Handle errors during map subscription process */
  _handleMapSubscribeError(l) {
    if (this._inflight = !1, !!this._isSubscribing()) {
      if (l.code === Re.timeout) {
        this._centrifuge._disconnect(Rn.subscribeTimeout, "subscribe timeout", !0);
        return;
      }
      if (this._mapStateBuffer = [], this._mapStreamBuffer = [], this._mapPhase = null, this._prevValueMap = /* @__PURE__ */ new Map(), l.code === 112 && this._mapUnrecoverableStrategy === "from_scratch") {
        this._debug("map subscribe: unrecoverable position, restarting from scratch"), this._offset = null, this._epoch = null, this._recover = !1, this._scheduleResubscribe();
        return;
      }
      this._subscribeError(l);
    }
  }
  /** Build map subscribe command for a specific phase */
  _buildMapSubscribeCommand(l, a) {
    const r = {
      channel: this.channel,
      type: this._mapPresenceType || 1,
      // 1=MAP, 2=MAP_CLIENTS, 3=MAP_USERS
      phase: l
    };
    return this._token && (r.token = this._token), this._tagsFilter && (r.tf = this._tagsFilter), this._delta && (r.delta = this._delta), r.flag = Ma.channelCompaction, l === It.State && (this._mapPageSize > 0 && (r.limit = this._mapPageSize), a && (r.cursor = a), this._epoch ? (r.offset = this._offset, r.epoch = this._epoch) : this._data && (r.data = this._data)), l === It.Stream && (this._mapPageSize > 0 && (r.limit = this._mapPageSize), r.offset = this._offset, r.epoch = this._epoch, this._recover && (r.recover = !0, this._mapStreamBuffer.length === 0 && this._data && (r.data = this._data))), { subscribe: r };
  }
  /** Convert raw publication to MapUpdateContext */
  _getMapUpdateContext(l) {
    const a = {
      channel: this.channel,
      data: l.data,
      key: l.key || ""
    };
    return l.removed === !0 && (a.removed = !0), l.offset !== void 0 && (a.offset = l.offset), l.info && (a.info = this._centrifuge._getJoinLeaveContext(l.info)), l.tags && (a.tags = l.tags), a;
  }
  /** Convert raw publication to SharedPollUpdateContext */
  _getSharedPollUpdateContext(l) {
    const a = {
      channel: this.channel,
      key: l.key || "",
      data: l.data
    };
    return l.removed === !0 && (a.removed = !0), l.version !== void 0 && (a.version = l.version), a;
  }
}
class $b extends Pc {
  /** Publish data to the channel. */
  publish(l) {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._debounceMs > 0 ? this._debouncedPublish("", l, !1) : this._centrifuge.publish(this.channel, l);
    });
  }
  /** history for a channel. By default it does not return publications (only current
   *  StreamPosition data) – provide an explicit limit > 0 to load publications.*/
  history(l) {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._centrifuge.history(this.channel, l);
    });
  }
}
class Ec extends Pc {
  /** Publish data to a key. */
  publish(l, a) {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._debounceMs > 0 ? this._debouncedPublish(l, a, !0) : this._centrifuge.mapPublish(this.channel, l, a);
    });
  }
  /** Remove a key. */
  remove(l) {
    return Pe(this, void 0, void 0, function* () {
      return yield this._methodCall(), this._cancelDebounce(l), this._centrifuge.mapRemove(this.channel, l);
    });
  }
}
class Fb extends Pc {
  /** Track items in a shared poll subscription.
   *
   * Overloads:
   * - `track(keys: string[])` — pass key names only (version defaults to 0).
   *   Requires `getSignature` callback in subscription options. The SDK
   *   automatically obtains a signature before sending the track request.
   * - `track(items: SharedPollTrackItem[], signature: string)` — pass items
   *   with explicit versions and a pre-computed HMAC signature.
   *
   * Items are stored in local state immediately. If subscribed, the track request
   * is sent right away. If not yet subscribed, items will be sent via replay
   * (with a fresh signature from getSignature) after subscribe completes.
   *
   * **Fire-and-forget** (similar to subscribe/unsubscribe): returns void and never
   * throws for in-flight failures. Subscribe to the `error` event to observe
   * failures: `type: 'track'` covers both the server-side track request and
   * the `getSignature` callback when using `track(keys)`. Server-revoked keys
   * arrive as synthetic `update` events with `removed: true`. */
  track(l, a) {
    if (l.length === 0)
      return;
    let r;
    const o = a;
    typeof l[0] == "string" ? r = l.map((_) => ({ key: _, version: 0 })) : r = l;
    for (const d of r) {
      const _ = this._sharedPollTrackedItems.get(d.key);
      (_ === void 0 || d.version > _) && this._sharedPollTrackedItems.set(d.key, d.version);
    }
    if (o !== void 0) {
      this._sharedPollSignatures.push({
        keys: r.map((d) => d.key),
        signature: o
      }), this._isSubscribed() && this._sendTrackRequest([{ items: r, signature: o }]).catch((d) => {
        this._handleTrackError(d);
      });
      return;
    }
    if (!this._sharedPollGetSignature) {
      this.emit("error", {
        type: "track",
        channel: this.channel,
        error: { code: Re.sharedPollGetSignature, message: "getSignature callback required for track(keys)" }
      });
      return;
    }
    if (!this._isSubscribed())
      return;
    const f = r.map((d) => d.key);
    this._sharedPollGetSignature({ keys: f }).then((d) => {
      if (!this._isSubscribed())
        return;
      const _ = new Set(d.keys), b = [];
      for (const T of f)
        _.has(T) || (this._sharedPollTrackedItems.delete(T), b.push(T), this.emit("update", {
          channel: this.channel,
          key: T,
          data: null,
          removed: !0
        }));
      b.length > 0 && this._sendUntrackRequest(b).catch((T) => {
        this.emit("error", { type: "untrack", channel: this.channel, error: T });
      });
      const g = [];
      for (const T of d.keys) {
        const V = this._sharedPollTrackedItems.get(T);
        V !== void 0 && g.push({ key: T, version: V });
      }
      g.length !== 0 && (this._sharedPollSignatures.push({
        keys: d.keys,
        signature: d.signature
      }), this._sendTrackRequest([{ items: g, signature: d.signature }]).catch((T) => {
        this._handleTrackError(T);
      }));
    }).catch((d) => {
      this.emit("error", {
        type: "track",
        channel: this.channel,
        error: { code: Re.sharedPollGetSignature, message: d !== void 0 ? d.toString() : "getSignature failed" }
      });
    });
  }
  /** Stop tracking specific keys in a shared poll subscription.
   * Keys are removed from local state immediately. If subscribed, the untrack
   * request is sent right away. If not yet subscribed, the keys simply won't
   * be included in the replay after subscribe completes.
   *
   * **Fire-and-forget** (similar to subscribe/unsubscribe): returns void and never
   * throws for in-flight failures. Subscribe to the `error` event with
   * `type: 'untrack'` to observe failures of the untrack request. */
  untrack(l) {
    for (const a of l)
      this._sharedPollTrackedItems.delete(a);
    this._sharedPollSignatures = this._sharedPollSignatures.filter((a) => a.keys.some((r) => this._sharedPollTrackedItems.has(r))), this._isSubscribed() && this._sendUntrackRequest(l).catch((a) => {
      this.emit("error", {
        type: "untrack",
        channel: this.channel,
        error: a
      });
    });
  }
  /** Returns the set of currently tracked keys in a shared poll subscription. */
  trackedKeys() {
    return new Set(this._sharedPollTrackedItems.keys());
  }
}
class e_ {
  constructor(l, a) {
    this.endpoint = l, this.options = a, this._transport = null;
  }
  name() {
    return "sockjs";
  }
  subName() {
    return "sockjs-" + this._transport.transport;
  }
  emulation() {
    return !1;
  }
  supported() {
    return this.options.sockjs !== null;
  }
  initialize(l, a) {
    this._transport = new this.options.sockjs(this.endpoint, null, this.options.sockjsOptions), this._transport.onopen = () => {
      a.onOpen();
    }, this._transport.onerror = (r) => {
      a.onError(r);
    }, this._transport.onclose = (r) => {
      a.onClose(r);
    }, this._transport.onmessage = (r) => {
      a.onMessage(r.data);
    };
  }
  close() {
    this._transport.close();
  }
  send(l) {
    this._transport.send(l);
  }
}
class Id {
  constructor(l, a) {
    this.endpoint = l, this.options = a, this._transport = null;
  }
  name() {
    return "websocket";
  }
  subName() {
    return "websocket";
  }
  emulation() {
    return !1;
  }
  supported() {
    return this.options.websocket !== void 0 && this.options.websocket !== null;
  }
  initialize(l, a) {
    let r = "";
    l === "protobuf" && (r = "centrifuge-protobuf"), r !== "" ? this._transport = new this.options.websocket(this.endpoint, r) : this._transport = new this.options.websocket(this.endpoint), l === "protobuf" && (this._transport.binaryType = "arraybuffer"), this._transport.onopen = () => {
      a.onOpen();
    }, this._transport.onerror = (o) => {
      a.onError(o);
    }, this._transport.onclose = (o) => {
      a.onClose(o);
    }, this._transport.onmessage = (o) => {
      a.onMessage(o.data);
    };
  }
  close() {
    this._transport.close();
  }
  send(l) {
    this._transport.send(l);
  }
}
class t_ {
  constructor(l, a) {
    this.endpoint = l, this.options = a, this._abortController = null, this._utf8decoder = new TextDecoder(), this._protocol = "json";
  }
  name() {
    return "http_stream";
  }
  subName() {
    return "http_stream";
  }
  emulation() {
    return !0;
  }
  _handleErrors(l) {
    if (!l.ok)
      throw new Error(l.status);
    return l;
  }
  _fetchEventTarget(l, a, r) {
    const o = new EventTarget(), f = l.options.fetch;
    return f(a, r).then(l._handleErrors).then((d) => {
      o.dispatchEvent(new Event("open"));
      let _ = "", b = 0, g = new Uint8Array();
      const T = d.body.getReader();
      return new l.options.readableStream({
        start(V) {
          function P() {
            return T.read().then(({ done: W, value: F }) => {
              if (W) {
                o.dispatchEvent(new Event("close")), V.close();
                return;
              }
              try {
                if (l._protocol === "json")
                  for (_ += l._utf8decoder.decode(F); b < _.length; )
                    if (_[b] === `
`) {
                      const ce = _.substring(0, b);
                      o.dispatchEvent(new MessageEvent("message", { data: ce })), _ = _.substring(b + 1), b = 0;
                    } else
                      ++b;
                else {
                  const ce = new Uint8Array(g.length + F.length);
                  for (ce.set(g), ce.set(F, g.length), g = ce; ; ) {
                    const se = l.options.decoder.decodeReply(g);
                    if (se.ok) {
                      const qe = g.slice(0, se.pos);
                      o.dispatchEvent(new MessageEvent("message", { data: qe })), g = g.slice(se.pos);
                      continue;
                    }
                    break;
                  }
                }
              } catch (ce) {
                o.dispatchEvent(new Event("error", { detail: ce })), o.dispatchEvent(new Event("close")), V.close();
                return;
              }
              P();
            }).catch(function(W) {
              o.dispatchEvent(new Event("error", { detail: W })), o.dispatchEvent(new Event("close")), V.close();
            });
          }
          return P();
        }
      });
    }).catch((d) => {
      o.dispatchEvent(new Event("error", { detail: d })), o.dispatchEvent(new Event("close"));
    }), o;
  }
  supported() {
    return this.options.fetch !== null && this.options.readableStream !== null && typeof TextDecoder < "u" && typeof AbortController < "u" && typeof EventTarget < "u" && typeof Event < "u" && typeof MessageEvent < "u" && typeof Error < "u";
  }
  initialize(l, a, r) {
    this._protocol = l, this._abortController = new AbortController();
    let o, f;
    l === "json" ? (o = {
      Accept: "application/json",
      "Content-Type": "application/json"
    }, f = r) : (o = {
      Accept: "application/octet-stream",
      "Content-Type": "application/octet-stream"
    }, f = r);
    const d = {
      method: "POST",
      headers: o,
      body: f,
      mode: "cors",
      credentials: "same-origin",
      signal: this._abortController.signal
    }, _ = this._fetchEventTarget(this, this.endpoint, d);
    _.addEventListener("open", () => {
      a.onOpen();
    }), _.addEventListener("error", (b) => {
      this._abortController.abort(), a.onError(b);
    }), _.addEventListener("close", () => {
      this._abortController.abort(), a.onClose({
        code: 4,
        reason: "connection closed"
      });
    }), _.addEventListener("message", (b) => {
      a.onMessage(b.data);
    });
  }
  close() {
    this._abortController.abort();
  }
  send(l, a, r) {
    let o, f;
    const d = {
      session: a,
      node: r,
      data: l
    };
    this._protocol === "json" ? (o = {
      "Content-Type": "application/json"
    }, f = JSON.stringify(d)) : (o = {
      "Content-Type": "application/octet-stream"
    }, f = this.options.encoder.encodeEmulationRequest(d));
    const _ = this.options.fetch, b = {
      method: "POST",
      headers: o,
      body: f,
      mode: "cors",
      credentials: "same-origin"
    };
    _(this.options.emulationEndpoint, b);
  }
}
class n_ {
  constructor(l, a) {
    this.endpoint = l, this.options = a, this._protocol = "json", this._transport = null, this._onClose = null;
  }
  name() {
    return "sse";
  }
  subName() {
    return "sse";
  }
  emulation() {
    return !0;
  }
  supported() {
    return this.options.eventsource !== null && this.options.fetch !== null;
  }
  initialize(l, a, r) {
    let o;
    globalThis && globalThis.document && globalThis.document.baseURI ? o = new URL(this.endpoint, globalThis.document.baseURI) : o = new URL(this.endpoint), o.searchParams.append("cf_connect", r);
    const f = {}, d = new this.options.eventsource(o.toString(), f);
    this._transport = d;
    const _ = this;
    d.onopen = function() {
      a.onOpen();
    }, d.onerror = function(b) {
      d.close(), a.onError(b), a.onClose({
        code: 4,
        reason: "connection closed"
      });
    }, d.onmessage = function(b) {
      a.onMessage(b.data);
    }, _._onClose = function() {
      a.onClose({
        code: 4,
        reason: "connection closed"
      });
    };
  }
  close() {
    this._transport.close(), this._onClose !== null && this._onClose();
  }
  send(l, a, r) {
    const o = {
      session: a,
      node: r,
      data: l
    }, f = {
      "Content-Type": "application/json"
    }, d = JSON.stringify(o), _ = this.options.fetch, b = {
      method: "POST",
      headers: f,
      body: d,
      mode: "cors",
      credentials: "same-origin"
    };
    _(this.options.emulationEndpoint, b);
  }
}
class i_ {
  constructor(l, a) {
    this.endpoint = l, this.options = a, this._transport = null, this._stream = null, this._writer = null, this._utf8decoder = new TextDecoder(), this._protocol = "json";
  }
  name() {
    return "webtransport";
  }
  subName() {
    return "webtransport";
  }
  emulation() {
    return !1;
  }
  supported() {
    return this.options.webtransport !== void 0 && this.options.webtransport !== null;
  }
  initialize(l, a) {
    return Pe(this, void 0, void 0, function* () {
      let r;
      globalThis && globalThis.document && globalThis.document.baseURI ? r = new URL(this.endpoint, globalThis.document.baseURI) : r = new URL(this.endpoint), l === "protobuf" && r.searchParams.append("cf_protocol", "protobuf"), this._protocol = l;
      const o = new EventTarget();
      this._transport = new this.options.webtransport(r.toString()), this._transport.closed.then(() => {
        a.onClose({
          code: 4,
          reason: "connection closed"
        });
      }).catch(() => {
        a.onClose({
          code: 4,
          reason: "connection closed"
        });
      });
      try {
        yield this._transport.ready;
      } catch {
        this.close();
        return;
      }
      let f;
      try {
        f = yield this._transport.createBidirectionalStream();
      } catch {
        this.close();
        return;
      }
      this._stream = f, this._writer = this._stream.writable.getWriter(), o.addEventListener("close", () => {
        a.onClose({
          code: 4,
          reason: "connection closed"
        });
      }), o.addEventListener("message", (d) => {
        a.onMessage(d.data);
      }), this._startReading(o), a.onOpen();
    });
  }
  _startReading(l) {
    return Pe(this, void 0, void 0, function* () {
      const a = this._stream.readable.getReader();
      let r = "", o = 0, f = new Uint8Array();
      try {
        for (; ; ) {
          const { done: d, value: _ } = yield a.read();
          if (_.length > 0)
            if (this._protocol === "json")
              for (r += this._utf8decoder.decode(_); o < r.length; )
                if (r[o] === `
`) {
                  const b = r.substring(0, o);
                  l.dispatchEvent(new MessageEvent("message", { data: b })), r = r.substring(o + 1), o = 0;
                } else
                  ++o;
            else {
              const b = new Uint8Array(f.length + _.length);
              for (b.set(f), b.set(_, f.length), f = b; ; ) {
                const g = this.options.decoder.decodeReply(f);
                if (g.ok) {
                  const T = f.slice(0, g.pos);
                  l.dispatchEvent(new MessageEvent("message", { data: T })), f = f.slice(g.pos);
                  continue;
                }
                break;
              }
            }
          if (d)
            break;
        }
      } catch {
        l.dispatchEvent(new Event("close"));
      }
    });
  }
  close() {
    return Pe(this, void 0, void 0, function* () {
      try {
        this._writer && (yield this._writer.close()), this._transport.close();
      } catch {
      }
    });
  }
  send(l) {
    return Pe(this, void 0, void 0, function* () {
      let a;
      this._protocol === "json" ? a = new TextEncoder().encode(l + `
`) : a = l;
      try {
        yield this._writer.write(a);
      } catch {
        this.close();
      }
    });
  }
}
const l_ = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  -1,
  -1,
  -1,
  -1,
  36,
  -1,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  -1,
  -1,
  -1,
  63,
  -1
];
class a_ {
  constructor(l) {
    this.a = l, this.pos = 0;
  }
  haveBytes() {
    return this.pos < this.a.length;
  }
  getByte() {
    const l = this.a[this.pos];
    if (this.pos++, this.pos > this.a.length)
      throw new RangeError("out of bounds");
    return l;
  }
  getChar() {
    return String.fromCharCode(this.getByte());
  }
  // Read base64-encoded unsigned integer.
  getInt() {
    let l = 0, a;
    for (; this.haveBytes() && (a = l_[127 & this.getByte()]) >= 0; )
      l = (l << 6) + a;
    return this.pos--, l >>> 0;
  }
}
class s_ {
  constructor() {
    this.a = [];
  }
  toByteArray(l) {
    return Array.isArray(l) ? this.a : new Uint8Array(this.a);
  }
  // Copy from array at start to end.
  putArray(l, a, r) {
    for (let o = a; o < r; o++)
      this.a.push(l[o]);
  }
}
function r_(c) {
  let l = 0, a = 0, r = 0, o = 0, f = 0, d = c.length;
  for (; d >= 16; )
    l = l + c[f + 0] | 0, a = a + c[f + 1] | 0, r = r + c[f + 2] | 0, o = o + c[f + 3] | 0, l = l + c[f + 4] | 0, a = a + c[f + 5] | 0, r = r + c[f + 6] | 0, o = o + c[f + 7] | 0, l = l + c[f + 8] | 0, a = a + c[f + 9] | 0, r = r + c[f + 10] | 0, o = o + c[f + 11] | 0, l = l + c[f + 12] | 0, a = a + c[f + 13] | 0, r = r + c[f + 14] | 0, o = o + c[f + 15] | 0, f += 16, d -= 16;
  for (; d >= 4; )
    l = l + c[f + 0] | 0, a = a + c[f + 1] | 0, r = r + c[f + 2] | 0, o = o + c[f + 3] | 0, f += 4, d -= 4;
  switch (o = ((o + (r << 8) | 0) + (a << 16) | 0) + (l << 24) | 0, d) {
    //@ts-ignore fallthrough is needed.
    case 3:
      o = o + (c[f + 2] << 8) | 0;
    /* falls through */
    //@ts-ignore fallthrough is needed.
    case 2:
      o = o + (c[f + 1] << 16) | 0;
    /* falls through */
    case 1:
      o = o + (c[f + 0] << 24) | 0;
  }
  return o >>> 0;
}
function u_(c, l) {
  let a = 0;
  const r = new a_(l), o = c.length, f = l.length, d = r.getInt();
  if (r.getChar() !== `
`)
    throw new Error("size integer not terminated by '\\n'");
  const _ = new s_();
  for (; r.haveBytes(); ) {
    const b = r.getInt();
    let g;
    switch (r.getChar()) {
      case "@":
        if (g = r.getInt(), r.haveBytes() && r.getChar() !== ",")
          throw new Error("copy command not terminated by ','");
        if (a += b, a > d)
          throw new Error("copy exceeds output file size");
        if (g + b > o)
          throw new Error("copy extends past end of input");
        _.putArray(c, g, g + b);
        break;
      case ":":
        if (a += b, a > d)
          throw new Error("insert command gives an output larger than predicted");
        if (b > f)
          throw new Error("insert count exceeds size of delta");
        _.putArray(r.a, r.pos, r.pos + b), r.pos += b;
        break;
      case ";": {
        const T = _.toByteArray(c);
        if (b !== r_(T))
          throw new Error("bad checksum");
        if (a !== d)
          throw new Error("generated size does not match predicted size");
        return T;
      }
      default:
        throw new Error("unknown delta operator");
    }
  }
  throw new Error("unterminated delta");
}
class $d {
  name() {
    return "json";
  }
  encodeCommands(l) {
    return l.map((a) => JSON.stringify(a)).join(`
`);
  }
  decodeReplies(l) {
    return l.trim().split(`
`).map((a) => JSON.parse(a));
  }
  applyDeltaIfNeeded(l, a) {
    let r, o, f;
    if (l.delta) {
      f = !0;
      const d = new TextEncoder().encode(l.data), _ = u_(a, d);
      r = JSON.parse(new TextDecoder().decode(_)), o = _;
    } else
      f = !1, r = JSON.parse(l.data), o = new TextEncoder().encode(l.data);
    return { newData: r, newPrevValue: o, isDelta: f, wireBytes: l.data.length, fullBytes: o.length };
  }
}
const c_ = {
  headers: {},
  token: "",
  getToken: null,
  data: null,
  getData: null,
  debug: !1,
  name: "js",
  version: "",
  fetch: null,
  readableStream: null,
  websocket: null,
  eventsource: null,
  sockjs: null,
  sockjsOptions: {},
  emulationEndpoint: "/emulation",
  minReconnectDelay: 500,
  maxReconnectDelay: 2e4,
  timeout: 5e3,
  maxServerPingDelay: 1e4,
  networkEventTarget: null
};
class xn extends Error {
  constructor(l) {
    super(l), this.name = this.constructor.name;
  }
}
class rr extends Dm {
  /** Constructs Centrifuge client. Call connect() method to start connecting. */
  constructor(l, a) {
    super(), this._reconnectTimeout = null, this._refreshTimeout = null, this._serverPingTimeout = null, this.state = He.Disconnected, this._transportIsOpen = !1, this._endpoint = l, this._emulation = !1, this._transports = [], this._currentTransportIndex = 0, this._triedAllTransports = !1, this._transportWasOpen = !1, this._transport = null, this._transportId = 0, this._deviceWentOffline = !1, this._transportClosed = !0, this._codec = new $d(), this._reconnecting = !1, this._reconnectTimeout = null, this._reconnectAttempts = 0, this._client = null, this._session = "", this._node = "", this._subs = {}, this._serverSubs = {}, this._commandId = 0, this._commands = [], this._batching = !1, this._refreshRequired = !1, this._refreshTimeout = null, this._callbacks = {}, this._token = "", this._data = null, this._dispatchPromise = Promise.resolve(), this._serverPing = 0, this._serverPingTimeout = null, this._sendPong = !1, this._promises = {}, this._promiseId = 0, this._debugEnabled = !1, this._networkEventsSet = !1, this._config = Object.assign(Object.assign({}, c_), a), this._configure(), this._debugEnabled ? (this.on("state", (r) => {
      this._debug("client state", r.oldState, "->", r.newState);
    }), this.on("error", (r) => {
      this._debug("client error", r);
    })) : this.on("error", function() {
      Function.prototype();
    });
  }
  /** newSubscription allocates new Subscription to a channel. Since server only allows
   * one subscription per channel per client this method throws if client already has
   * channel subscription in internal registry.
   * */
  newSubscription(l, a) {
    if (this.getSubscription(l) !== null)
      throw new Error("Subscription to the channel " + l + " already exists");
    const r = new $b(this, l, a);
    return this._subs[l] = r, r;
  }
  /** newMapSubscription allocates new map Subscription to a channel. Since server only allows
   * one subscription per channel per client this method throws if client already has
   * channel subscription in internal registry.
   *
   * Experimental. Requires Centrifugo >= v6.8.0. API may change in a backwards-incompatible
   * way in subsequent minor releases. */
  newMapSubscription(l, a) {
    if (this.getSubscription(l) !== null)
      throw new Error("Subscription to the channel " + l + " already exists");
    const r = new Ec(this, l, {
      token: a == null ? void 0 : a.token,
      getToken: a == null ? void 0 : a.getToken,
      data: a == null ? void 0 : a.data,
      minResubscribeDelay: a == null ? void 0 : a.minResubscribeDelay,
      maxResubscribeDelay: a == null ? void 0 : a.maxResubscribeDelay,
      delta: a == null ? void 0 : a.delta,
      tagsFilter: a == null ? void 0 : a.tagsFilter,
      map: !0,
      mapPageSize: a == null ? void 0 : a.pageSize,
      mapUnrecoverableStrategy: a == null ? void 0 : a.unrecoverableStrategy
    });
    return this._subs[l] = r, r;
  }
  /** Create a map subscription for observing individual connections (clients presence).
   * Each entry has key=clientId and contains full ClientInfo.
   * Use this to track connections per channel.
   * The channel should be the full presence channel name (e.g., "$clients:games").
   *
   * Experimental. Requires Centrifugo >= v6.8.0. API may change in a backwards-incompatible
   * way in subsequent minor releases. */
  newMapClientsSubscription(l, a) {
    if (this.getSubscription(l) !== null)
      throw new Error("Subscription to the channel " + l + " already exists");
    const r = new Ec(this, l, {
      token: a == null ? void 0 : a.token,
      getToken: a == null ? void 0 : a.getToken,
      data: a == null ? void 0 : a.data,
      minResubscribeDelay: a == null ? void 0 : a.minResubscribeDelay,
      maxResubscribeDelay: a == null ? void 0 : a.maxResubscribeDelay,
      delta: a == null ? void 0 : a.delta,
      tagsFilter: a == null ? void 0 : a.tagsFilter,
      map: !0,
      mapPresenceType: 2,
      // MAP_CLIENTS_PRESENCE
      mapPageSize: a == null ? void 0 : a.pageSize,
      mapUnrecoverableStrategy: a == null ? void 0 : a.unrecoverableStrategy
    });
    return this._subs[l] = r, r;
  }
  /** Create a map subscription for observing unique users (users presence).
   * Each entry has key=userId (no ClientInfo stored).
   * User entries expire via TTL, providing debounce for quick reconnects.
   * The channel should be the full presence channel name (e.g., "$users:games").
   *
   * Experimental. Requires Centrifugo >= v6.8.0. API may change in a backwards-incompatible
   * way in subsequent minor releases. */
  newMapUsersSubscription(l, a) {
    if (this.getSubscription(l) !== null)
      throw new Error("Subscription to the channel " + l + " already exists");
    const r = new Ec(this, l, {
      token: a == null ? void 0 : a.token,
      getToken: a == null ? void 0 : a.getToken,
      data: a == null ? void 0 : a.data,
      minResubscribeDelay: a == null ? void 0 : a.minResubscribeDelay,
      maxResubscribeDelay: a == null ? void 0 : a.maxResubscribeDelay,
      delta: a == null ? void 0 : a.delta,
      tagsFilter: a == null ? void 0 : a.tagsFilter,
      map: !0,
      mapPresenceType: 3,
      // MAP_USERS_PRESENCE
      mapPageSize: a == null ? void 0 : a.pageSize,
      mapUnrecoverableStrategy: a == null ? void 0 : a.unrecoverableStrategy
    });
    return this._subs[l] = r, r;
  }
  /** newSharedPollSubscription allocates a new shared poll Subscription to a channel.
   * Shared poll subscriptions use server-side polling to aggregate interest sets
   * and deliver periodic updates with version tracking. Track items after subscribing
   * using the track() method on the returned Subscription.
   *
   * Experimental. Requires Centrifugo >= v6.8.0. API may change in a backwards-incompatible
   * way in subsequent minor releases. */
  newSharedPollSubscription(l, a) {
    if (this.getSubscription(l) !== null)
      throw new Error("Subscription to the channel " + l + " already exists");
    const r = new Fb(this, l, {
      token: a == null ? void 0 : a.token,
      getToken: a == null ? void 0 : a.getToken,
      data: a == null ? void 0 : a.data,
      minResubscribeDelay: a == null ? void 0 : a.minResubscribeDelay,
      maxResubscribeDelay: a == null ? void 0 : a.maxResubscribeDelay,
      delta: a == null ? void 0 : a.delta,
      sharedPoll: !0,
      sharedPollGetSignature: a == null ? void 0 : a.getSignature
    });
    return this._subs[l] = r, r;
  }
  /** getSubscription returns Subscription if it's registered in the internal
   * registry or null. */
  getSubscription(l) {
    return this._getSub(l);
  }
  /** Get a map subscription by channel. */
  getMapSubscription(l) {
    return this._getSub(l);
  }
  /** Get a shared poll subscription by channel. */
  getSharedPollSubscription(l) {
    return this._getSub(l);
  }
  /** removeSubscription allows removing Subcription from the internal registry. */
  removeSubscription(l) {
    l && (l.state !== ht.Unsubscribed && l.unsubscribe(), this._removeSubscription(l));
  }
  /** Remove a map subscription. */
  removeMapSubscription(l) {
    this.removeSubscription(l);
  }
  /** Remove a shared poll subscription. */
  removeSharedPollSubscription(l) {
    this.removeSubscription(l);
  }
  /** Get a map with all current client-side subscriptions. */
  subscriptions() {
    return this._subs;
  }
  /** Get all map subscriptions. */
  mapSubscriptions() {
    const l = {};
    for (const [a, r] of Object.entries(this._subs))
      r.type === "map" && (l[a] = r);
    return l;
  }
  /** Get all shared poll subscriptions. */
  sharedPollSubscriptions() {
    const l = {};
    for (const [a, r] of Object.entries(this._subs))
      r.type === "shared_poll" && (l[a] = r);
    return l;
  }
  /** ready returns a Promise which resolves upon client goes to Connected
   * state and rejects in case of client goes to Disconnected or Failed state.
   * Users can provide optional timeout in milliseconds. */
  ready(l) {
    return Pe(this, void 0, void 0, function* () {
      switch (this.state) {
        case He.Disconnected:
          throw { code: Re.clientDisconnected, message: "client disconnected" };
        case He.Connected:
          return;
        default:
          return new Promise((a, r) => {
            const o = { resolve: a, reject: r };
            l && (o.timeout = setTimeout(() => {
              r({ code: Re.timeout, message: "timeout" });
            }, l)), this._promises[this._nextPromiseId()] = o;
          });
      }
    });
  }
  /** connect to a server. */
  connect() {
    if (this._isConnected()) {
      this._debug("connect called when already connected");
      return;
    }
    if (this._isConnecting()) {
      this._debug("connect called when already connecting");
      return;
    }
    this._debug("connect called"), this._reconnectAttempts = 0, this._startConnecting();
  }
  /** disconnect from a server. */
  disconnect() {
    this._disconnect(El.disconnectCalled, "disconnect called", !1);
  }
  /** setToken allows setting connection token. Or resetting used token to be empty.  */
  setToken(l) {
    this._token = l;
  }
  /** setData allows setting connection data. This only affects the next connection attempt,
   * not the current one. Note that if getData callback is configured, it will override
   * this value during reconnects. */
  setData(l) {
    this._data = l;
  }
  /** setHeaders allows setting connection emulated headers. */
  setHeaders(l) {
    this._config.headers = l;
  }
  /** send asynchronous data to a server (without any response from a server
   * expected, see rpc method if you need response). */
  send(l) {
    return Pe(this, void 0, void 0, function* () {
      const a = {
        send: {
          data: l
        }
      };
      if (yield this._methodCall(), !this._transportSendCommands([a]))
        throw this._createErrorObject(Re.transportWriteError, "transport write error");
    });
  }
  /** rpc to a server - i.e. a call which waits for a response with data. */
  rpc(l, a) {
    return Pe(this, void 0, void 0, function* () {
      const r = {
        rpc: {
          method: l,
          data: a
        }
      };
      return yield this._methodCall(), {
        data: (yield this._callPromise(r, (f) => f.rpc)).data
      };
    });
  }
  /** publish data to a channel. */
  publish(l, a) {
    return Pe(this, void 0, void 0, function* () {
      const r = {
        publish: {
          channel: l,
          data: a
        }
      };
      return yield this._methodCall(), yield this._callPromise(r, () => ({})), {};
    });
  }
  /** Publish data to a key in a map channel without holding a MapSubscription.
   * Use this when you need to write to a map channel from outside a subscription
   * context (e.g. a standalone publisher). When you already hold a MapSubscription,
   * prefer `sub.publish(key, data)` instead — it enforces the method-call guard and
   * applies debounce configuration. */
  mapPublish(l, a, r) {
    return Pe(this, void 0, void 0, function* () {
      const o = {
        publish: { channel: l, type: 1, key: a, data: r }
      };
      return yield this._methodCall(), yield this._callPromise(o, () => ({})), {};
    });
  }
  /** Remove a key from a map channel without holding a MapSubscription.
   * Use this when you need to remove a key from outside a subscription context.
   * When you already hold a MapSubscription, prefer `sub.remove(key)` instead —
   * it enforces the method-call guard and cancels any pending debounced publish. */
  mapRemove(l, a) {
    return Pe(this, void 0, void 0, function* () {
      const r = {
        publish: { channel: l, type: 1, key: a, removed: !0 }
      };
      return yield this._methodCall(), yield this._callPromise(r, () => ({})), {};
    });
  }
  /** history for a channel. By default it does not return publications (only current
   *  StreamPosition data) – provide an explicit limit > 0 to load publications.*/
  history(l, a) {
    return Pe(this, void 0, void 0, function* () {
      const r = {
        history: this._getHistoryRequest(l, a)
      };
      yield this._methodCall();
      const o = yield this._callPromise(r, (d) => d.history), f = [];
      if (o.publications)
        for (let d = 0; d < o.publications.length; d++)
          f.push(this._getPublicationContext(l, o.publications[d]));
      return {
        publications: f,
        epoch: o.epoch || "",
        offset: o.offset || 0
      };
    });
  }
  /** presence for a channel. */
  presence(l) {
    return Pe(this, void 0, void 0, function* () {
      const a = {
        presence: {
          channel: l
        }
      };
      yield this._methodCall();
      const o = (yield this._callPromise(a, (f) => f.presence)).presence;
      for (const f in o)
        if (Object.prototype.hasOwnProperty.call(o, f)) {
          const d = o[f], _ = d.conn_info, b = d.chan_info;
          _ && (d.connInfo = _), b && (d.chanInfo = b);
        }
      return { clients: o };
    });
  }
  presenceStats(l) {
    return Pe(this, void 0, void 0, function* () {
      const a = {
        presence_stats: {
          channel: l
        }
      };
      yield this._methodCall();
      const r = yield this._callPromise(a, (o) => o.presence_stats);
      return {
        numUsers: r.num_users,
        numClients: r.num_clients
      };
    });
  }
  /** start command batching (collect into temporary buffer without sending to a server)
   * until stopBatching called.*/
  startBatching() {
    this._batching = !0;
  }
  /** stop batching commands and flush collected commands to the
   * network (all in one request/frame).*/
  stopBatching() {
    const l = this;
    Promise.resolve().then(function() {
      Promise.resolve().then(function() {
        l._batching = !1, l._flush();
      });
    });
  }
  _debug(...l) {
    this._debugEnabled && Jb("debug", l);
  }
  _codecName() {
    return this._codec.name();
  }
  /** @internal */
  _formatOverride() {
  }
  _configure() {
    if (!("Promise" in globalThis))
      throw new Error("Promise polyfill required");
    if (!this._endpoint)
      throw new Error("endpoint configuration required");
    if (this._config.token !== null && (this._token = this._config.token), this._config.data !== null && (this._data = this._config.data), this._codec = new $d(), this._formatOverride(), (this._config.debug === !0 || typeof localStorage < "u" && typeof localStorage.getItem == "function" && localStorage.getItem("centrifuge.debug")) && (this._debugEnabled = !0), this._debug("config", this._config), typeof this._endpoint != "string") if (Array.isArray(this._endpoint)) {
      this._transports = this._endpoint, this._emulation = !0;
      for (const l in this._transports)
        if (this._transports.hasOwnProperty(l)) {
          const a = this._transports[l];
          if (!a.endpoint || !a.transport)
            throw new Error("malformed transport configuration");
          const r = a.transport;
          if (["websocket", "http_stream", "sse", "sockjs", "webtransport"].indexOf(r) < 0)
            throw new Error("unsupported transport name: " + r);
        }
    } else
      throw new Error("unsupported url configuration type: only string or array of objects are supported");
  }
  _setState(l) {
    if (this.state !== l) {
      this._reconnecting = !1;
      const a = this.state;
      return this.state = l, this.emit("state", { newState: l, oldState: a }), !0;
    }
    return !1;
  }
  _isDisconnected() {
    return this.state === He.Disconnected;
  }
  _isConnecting() {
    return this.state === He.Connecting;
  }
  _isConnected() {
    return this.state === He.Connected;
  }
  _nextCommandId() {
    return ++this._commandId;
  }
  _setNetworkEvents() {
    if (this._networkEventsSet)
      return;
    let l = null;
    this._config.networkEventTarget !== null ? l = this._config.networkEventTarget : typeof globalThis.addEventListener < "u" && (l = globalThis), l && (l.addEventListener("offline", () => {
      this._debug("offline event triggered"), (this.state === He.Connected || this.state === He.Connecting) && (this._disconnect(Rn.transportClosed, "transport closed", !0), this._deviceWentOffline = !0);
    }), l.addEventListener("online", () => {
      this._debug("online event triggered"), this.state === He.Connecting && (this._deviceWentOffline && !this._transportClosed && (this._deviceWentOffline = !1, this._transportClosed = !0), this._clearReconnectTimeout(), this._startReconnecting());
    }), this._networkEventsSet = !0);
  }
  _getReconnectDelay() {
    const l = Ri(this._reconnectAttempts, this._config.minReconnectDelay, this._config.maxReconnectDelay);
    return this._reconnectAttempts += 1, l;
  }
  _clearOutgoingRequests() {
    for (const l in this._callbacks)
      if (this._callbacks.hasOwnProperty(l)) {
        const a = this._callbacks[l];
        clearTimeout(a.timeout);
        const r = a.errback;
        if (!r)
          continue;
        r({ error: this._createErrorObject(Re.connectionClosed, "connection closed") });
      }
    this._callbacks = {};
  }
  _clearConnectedState() {
    this._client = null, this._clearServerPingTimeout(), this._clearRefreshTimeout();
    for (const l in this._subs) {
      if (!this._subs.hasOwnProperty(l))
        continue;
      const a = this._subs[l];
      a.state === ht.Subscribed && a._setSubscribing(ar.transportClosed, "transport closed");
    }
    for (const l in this._serverSubs)
      this._serverSubs.hasOwnProperty(l) && this.emit("subscribing", { channel: l });
  }
  _handleWriteError(l) {
    for (const a of l) {
      const r = a.id;
      if (!(r in this._callbacks))
        continue;
      const o = this._callbacks[r];
      clearTimeout(this._callbacks[r].timeout), delete this._callbacks[r];
      const f = o.errback;
      f({ error: this._createErrorObject(Re.transportWriteError, "transport write error") });
    }
  }
  _transportSendCommands(l) {
    if (!l.length)
      return !0;
    if (!this._transport)
      return !1;
    try {
      this._transport.send(this._codec.encodeCommands(l), this._session, this._node);
    } catch (a) {
      return this._debug("error writing commands", a), this._handleWriteError(l), !1;
    }
    return !0;
  }
  _initializeTransport() {
    let l;
    this._config.websocket !== null ? l = this._config.websocket : typeof globalThis.WebSocket != "function" && typeof globalThis.WebSocket != "object" || (l = globalThis.WebSocket);
    let a = null;
    this._config.sockjs !== null ? a = this._config.sockjs : typeof globalThis.SockJS < "u" && (a = globalThis.SockJS);
    let r = null;
    this._config.eventsource !== null ? r = this._config.eventsource : typeof globalThis.EventSource < "u" && (r = globalThis.EventSource);
    let o = null;
    this._config.fetch !== null ? o = this._config.fetch : typeof globalThis.fetch < "u" && (o = globalThis.fetch);
    let f = null;
    if (this._config.readableStream !== null ? f = this._config.readableStream : typeof globalThis.ReadableStream < "u" && (f = globalThis.ReadableStream), this._emulation) {
      this._currentTransportIndex >= this._transports.length && (this._triedAllTransports = !0, this._currentTransportIndex = 0);
      let W = 0;
      for (; ; ) {
        if (W >= this._transports.length)
          throw new Error("no supported transport found");
        const F = this._transports[this._currentTransportIndex], ce = F.transport, se = F.endpoint;
        if (ce === "websocket") {
          if (this._debug("trying websocket transport"), this._transport = new Id(se, {
            websocket: l
          }), !this._transport.supported()) {
            this._debug("websocket transport not available"), this._currentTransportIndex++, W++;
            continue;
          }
        } else if (ce === "webtransport") {
          if (this._debug("trying webtransport transport"), this._transport = new i_(se, {
            webtransport: globalThis.WebTransport,
            decoder: this._codec,
            encoder: this._codec
          }), !this._transport.supported()) {
            this._debug("webtransport transport not available"), this._currentTransportIndex++, W++;
            continue;
          }
        } else if (ce === "http_stream") {
          if (this._debug("trying http_stream transport"), this._transport = new t_(se, {
            fetch: o,
            readableStream: f,
            emulationEndpoint: this._config.emulationEndpoint,
            decoder: this._codec,
            encoder: this._codec
          }), !this._transport.supported()) {
            this._debug("http_stream transport not available"), this._currentTransportIndex++, W++;
            continue;
          }
        } else if (ce === "sse") {
          if (this._debug("trying sse transport"), this._transport = new n_(se, {
            eventsource: r,
            fetch: o,
            emulationEndpoint: this._config.emulationEndpoint
          }), !this._transport.supported()) {
            this._debug("sse transport not available"), this._currentTransportIndex++, W++;
            continue;
          }
        } else if (ce === "sockjs") {
          if (this._debug("trying sockjs"), this._transport = new e_(se, {
            sockjs: a,
            sockjsOptions: this._config.sockjsOptions
          }), !this._transport.supported()) {
            this._debug("sockjs transport not available"), this._currentTransportIndex++, W++;
            continue;
          }
        } else
          throw new Error("unknown transport " + ce);
        break;
      }
    } else {
      if (Pb(this._endpoint, "http"))
        throw new Error("Provide explicit transport endpoints configuration in case of using HTTP (i.e. using array of TransportEndpoint instead of a single string), or use ws(s):// scheme in an endpoint if you aimed using WebSocket transport");
      if (this._debug("client will use websocket"), this._transport = new Id(this._endpoint, {
        websocket: l
      }), !this._transport.supported())
        throw new Error("WebSocket constructor not found, make sure it is available globally or passed as a dependency in Centrifuge options");
    }
    const d = this, _ = this._transport, b = this._nextTransportId();
    d._debug("id of transport", b);
    let g = !1;
    const T = [];
    if (this._transport.emulation()) {
      const W = d._sendConnect(!0);
      T.push(W);
    }
    this._setNetworkEvents();
    const V = this._codec.encodeCommands(T);
    this._transportClosed = !1;
    let P;
    P = setTimeout(function() {
      _.close();
    }, this._config.timeout), this._transport.initialize(this._codecName(), {
      onOpen: function() {
        if (P && (clearTimeout(P), P = null), d._transportId != b) {
          d._debug("open callback from non-actual transport"), _.close();
          return;
        }
        g = !0, d._debug(_.subName(), "transport open"), !_.emulation() && (d._transportIsOpen = !0, d._transportWasOpen = !0, d.startBatching(), d._sendConnect(!1), d._sendSubscribeCommands(), d.stopBatching(), d.emit("__centrifuge_debug:connect_frame_sent", {}));
      },
      onError: function(W) {
        if (d._transportId != b) {
          d._debug("error callback from non-actual transport");
          return;
        }
        d._debug("transport level error", W);
      },
      onClose: function(W) {
        if (P && (clearTimeout(P), P = null), d._transportId != b) {
          d._debug("close callback from non-actual transport");
          return;
        }
        d._debug(_.subName(), "transport closed"), d._transportClosed = !0, d._transportIsOpen = !1;
        let F = "connection closed", ce = !0, se = 0;
        if (W && "code" in W && W.code && (se = W.code), W && W.reason)
          try {
            const qe = JSON.parse(W.reason);
            F = qe.reason, ce = qe.reconnect;
          } catch {
            F = W.reason, (se >= 3500 && se < 4e3 || se >= 4500 && se < 5e3) && (ce = !1);
          }
        se < 3e3 ? (se === 1009 ? (se = El.messageSizeLimit, F = "message size limit exceeded", ce = !1) : (se = Rn.transportClosed, F = "transport closed"), d._emulation && !d._transportWasOpen && (d._currentTransportIndex++, d._currentTransportIndex >= d._transports.length && (d._triedAllTransports = !0, d._currentTransportIndex = 0))) : d._transportWasOpen = !0, d._isConnecting() && !g && d.emit("error", {
          type: "transport",
          error: {
            code: Re.transportClosed,
            message: "transport closed"
          },
          transport: _.name()
        }), d._reconnecting = !1, d._disconnect(se, F, ce);
      },
      onMessage: function(W) {
        d._dataReceived(W);
      }
    }, V), d.emit("__centrifuge_debug:transport_initialized", {});
  }
  _sendConnect(l) {
    const a = this._constructConnectCommand(), r = this;
    return this._call(a, l).then((o) => {
      const f = o.reply.connect;
      r._connectResponse(f), o.next && o.next();
    }, (o) => {
      r._connectError(o.error), o.next && o.next();
    }), a;
  }
  _startReconnecting() {
    if (this._debug("start reconnecting"), !this._isConnecting()) {
      this._debug("stop reconnecting: client not in connecting state");
      return;
    }
    if (this._reconnecting) {
      this._debug("reconnect already in progress, return from reconnect routine");
      return;
    }
    if (this._transportClosed === !1) {
      this._debug("waiting for transport close");
      return;
    }
    this._reconnecting = !0;
    const l = this._token === "";
    if (!(this._refreshRequired || l && this._config.getToken !== null)) {
      this._config.getData ? this._config.getData().then((o) => {
        this._isConnecting() && (this._data = o, this._initializeTransport());
      }).catch((o) => this._handleGetDataError(o)) : this._initializeTransport();
      return;
    }
    const r = this;
    this._getToken().then(function(o) {
      if (r._isConnecting()) {
        if (o == null || o == null) {
          r._failUnauthorized();
          return;
        }
        r._token = o, r._debug("connection token refreshed"), r._config.getData ? r._config.getData().then(function(f) {
          r._isConnecting() && (r._data = f, r._initializeTransport());
        }).catch((f) => r._handleGetDataError(f)) : r._initializeTransport();
      }
    }).catch(function(o) {
      if (!r._isConnecting())
        return;
      if (o instanceof xn) {
        r._failUnauthorized();
        return;
      }
      r.emit("error", {
        type: "connectToken",
        error: {
          code: Re.clientConnectToken,
          message: o !== void 0 ? o.toString() : ""
        }
      });
      const f = r._getReconnectDelay();
      r._debug("error on getting connection token, reconnect after " + f + " milliseconds", o), r._reconnecting = !1, r._reconnectTimeout = setTimeout(() => {
        r._startReconnecting();
      }, f);
    });
  }
  _handleGetDataError(l) {
    if (l instanceof xn) {
      this._failUnauthorized();
      return;
    }
    this.emit("error", {
      type: "connectData",
      error: {
        code: Re.badConfiguration,
        message: (l == null ? void 0 : l.toString()) || ""
      }
    });
    const a = this._getReconnectDelay();
    this._debug("error on getting connect data, reconnect after " + a + " milliseconds", l), this._reconnecting = !1, this._reconnectTimeout = setTimeout(() => {
      this._startReconnecting();
    }, a);
  }
  _connectError(l) {
    this.state === He.Connecting && (l.code === 109 && (this._refreshRequired = !0), l.code < 100 || l.temporary === !0 || l.code === 109 ? (this.emit("error", {
      type: "connect",
      error: l
    }), this._debug("closing transport due to connect error"), this._disconnect(l.code, l.message, !0)) : this._disconnect(l.code, l.message, !1));
  }
  _scheduleReconnect() {
    if (!this._isConnecting())
      return;
    let l = !1;
    this._emulation && !this._transportWasOpen && !this._triedAllTransports && (l = !0);
    let a = this._getReconnectDelay();
    l && (a = 0), this._debug("reconnect after " + a + " milliseconds"), this._clearReconnectTimeout(), this._reconnectTimeout = setTimeout(() => {
      this._startReconnecting();
    }, a);
  }
  _constructConnectCommand() {
    const l = {};
    this._token && (l.token = this._token), this._data && (l.data = this._data), this._config.name && (l.name = this._config.name), this._config.version && (l.version = this._config.version), Object.keys(this._config.headers).length > 0 && (l.headers = this._config.headers);
    const a = {};
    let r = !1;
    for (const o in this._serverSubs)
      if (this._serverSubs.hasOwnProperty(o) && this._serverSubs[o].recoverable) {
        r = !0;
        const f = {
          recover: !0
        };
        this._serverSubs[o].offset && (f.offset = this._serverSubs[o].offset), this._serverSubs[o].epoch && (f.epoch = this._serverSubs[o].epoch), a[o] = f;
      }
    return r && (l.subs = a), {
      connect: l
    };
  }
  _getHistoryRequest(l, a) {
    const r = {
      channel: l
    };
    return a !== void 0 && (a.since && (r.since = {
      offset: a.since.offset
    }, a.since.epoch && (r.since.epoch = a.since.epoch)), a.limit !== void 0 && (r.limit = a.limit), a.reverse === !0 && (r.reverse = !0)), r;
  }
  _methodCall() {
    return this._isConnected() ? Promise.resolve() : new Promise((l, a) => {
      const r = setTimeout(function() {
        a({ code: Re.timeout, message: "timeout" });
      }, this._config.timeout);
      this._promises[this._nextPromiseId()] = {
        timeout: r,
        resolve: l,
        reject: a
      };
    });
  }
  _callPromise(l, a) {
    return new Promise((r, o) => {
      this._call(l, !1).then((f) => {
        var d;
        const _ = a(f.reply);
        r(_), (d = f.next) === null || d === void 0 || d.call(f);
      }, (f) => {
        var d;
        o(f.error), (d = f.next) === null || d === void 0 || d.call(f);
      });
    });
  }
  _dataReceived(l) {
    this._serverPing > 0 && this._waitServerPing();
    const a = this._codec.decodeReplies(l);
    this._dispatchPromise = this._dispatchPromise.then(() => {
      let r;
      this._dispatchPromise = new Promise((o) => {
        r = o;
      }), this._dispatchSynchronized(a, r);
    });
  }
  _dispatchSynchronized(l, a) {
    let r = Promise.resolve();
    for (const o in l)
      l.hasOwnProperty(o) && (r = r.then(() => this._dispatchReply(l[o])));
    r = r.then(() => {
      a();
    });
  }
  _dispatchReply(l) {
    let a;
    const r = new Promise((f) => {
      a = f;
    });
    if (l == null)
      return this._debug("dispatch: got undefined or null reply"), a(), r;
    const o = l.id;
    return o && o > 0 ? this._handleReply(l, a) : l.push ? this._handlePush(l.push, a) : this._handleServerPing(a), r;
  }
  _call(l, a) {
    return new Promise((r, o) => {
      l.id = this._nextCommandId(), this._registerCall(l.id, r, o), a || this._addCommand(l);
    });
  }
  _startConnecting() {
    this._debug("start connecting"), this._setState(He.Connecting) && this.emit("connecting", { code: Rn.connectCalled, reason: "connect called" }), this._client = null, this._startReconnecting();
  }
  _disconnect(l, a, r) {
    if (l === El.stateInvalidated) {
      this._token = "", this._refreshRequired = !0;
      for (const _ in this._subs)
        this._subs.hasOwnProperty(_) && this._subs[_]._invalidateState();
    }
    if (this._isDisconnected())
      return;
    this._transportIsOpen = !1;
    const o = this.state;
    this._reconnecting = !1;
    const f = {
      code: l,
      reason: a
    };
    let d = !1;
    if (r ? d = this._setState(He.Connecting) : (d = this._setState(He.Disconnected), this._rejectPromises({ code: Re.clientDisconnected, message: "disconnected" })), this._clearOutgoingRequests(), o === He.Connecting && this._clearReconnectTimeout(), o === He.Connected && this._clearConnectedState(), d && (this._isConnecting() ? this.emit("connecting", f) : this.emit("disconnected", f)), this._transport) {
      this._debug("closing existing transport");
      const _ = this._transport;
      this._transport = null, _.close(), this._transportClosed = !0, this._nextTransportId();
    } else
      this._debug("no transport to close");
    this._scheduleReconnect();
  }
  _failUnauthorized() {
    this._disconnect(El.unauthorized, "unauthorized", !1);
  }
  _getToken() {
    return this._debug("get connection token"), this._config.getToken ? this._config.getToken({}) : (this.emit("error", {
      type: "configuration",
      error: {
        code: Re.badConfiguration,
        message: "token expired but no getToken function set in the configuration"
      }
    }), Promise.reject(new xn("")));
  }
  _refresh() {
    const l = this._client, a = this;
    this._getToken().then(function(r) {
      if (l !== a._client)
        return;
      if (!r) {
        a._failUnauthorized();
        return;
      }
      if (a._token = r, a._debug("connection token refreshed"), !a._isConnected())
        return;
      const o = {
        refresh: { token: a._token }
      };
      a._call(o, !1).then((f) => {
        const d = f.reply.refresh;
        a._refreshResponse(d), f.next && f.next();
      }, (f) => {
        a._refreshError(f.error), f.next && f.next();
      });
    }).catch(function(r) {
      if (a._isConnected()) {
        if (r instanceof xn) {
          a._failUnauthorized();
          return;
        }
        a.emit("error", {
          type: "refreshToken",
          error: {
            code: Re.clientRefreshToken,
            message: r !== void 0 ? r.toString() : ""
          }
        }), a._refreshTimeout = setTimeout(() => a._refresh(), a._getRefreshRetryDelay());
      }
    });
  }
  _refreshError(l) {
    l.code < 100 || l.temporary === !0 ? (this.emit("error", {
      type: "refresh",
      error: l
    }), this._refreshTimeout = setTimeout(() => this._refresh(), this._getRefreshRetryDelay())) : this._disconnect(l.code, l.message, !1);
  }
  _getRefreshRetryDelay() {
    return Ri(0, 5e3, 1e4);
  }
  _refreshResponse(l) {
    this._refreshTimeout && (clearTimeout(this._refreshTimeout), this._refreshTimeout = null), l.expires && (this._client = l.client, this._refreshTimeout = setTimeout(() => this._refresh(), Ca(l.ttl)));
  }
  _removeSubscription(l) {
    l !== null && delete this._subs[l.channel];
  }
  _unsubscribe(l) {
    if (!this._transportIsOpen)
      return Promise.resolve();
    const r = { unsubscribe: {
      channel: l.channel
    } }, o = this;
    return new Promise((d, _) => {
      this._call(r, !1).then((b) => {
        d(), b.next && b.next();
      }, (b) => {
        d(), b.next && b.next(), o._disconnect(Rn.unsubscribeError, "unsubscribe error", !0);
      });
    });
  }
  _getSub(l, a) {
    if (a && a > 0) {
      for (const o in this._subs)
        if (this._subs.hasOwnProperty(o)) {
          const f = this._subs[o];
          if (f._id === a)
            return f;
        }
      return null;
    }
    const r = this._subs[l];
    return r || null;
  }
  _isServerSub(l) {
    return this._serverSubs[l] !== void 0;
  }
  _sendSubscribeCommands() {
    const l = [];
    for (const a in this._subs) {
      if (!this._subs.hasOwnProperty(a))
        continue;
      const r = this._subs[a];
      if (r._inflight !== !0 && r.state === ht.Subscribing) {
        const o = r._subscribe();
        o && l.push(o);
      }
    }
    return l;
  }
  _connectResponse(l) {
    if (this._transportIsOpen = !0, this._transportWasOpen = !0, this._reconnectAttempts = 0, this._refreshRequired = !1, this._isConnected())
      return;
    this._client = l.client, this._setState(He.Connected), this._refreshTimeout && clearTimeout(this._refreshTimeout), l.expires && (this._refreshTimeout = setTimeout(() => this._refresh(), Ca(l.ttl))), this._session = l.session, this._node = l.node, this.startBatching(), this._sendSubscribeCommands(), this.stopBatching();
    const a = {
      client: l.client,
      transport: this._transport.subName()
    };
    l.data && (a.data = l.data), this.emit("connected", a), this._resolvePromises(), this._processServerSubs(l.subs || {}), l.ping && l.ping > 0 ? (this._serverPing = l.ping * 1e3, this._sendPong = l.pong === !0, this._waitServerPing()) : this._serverPing = 0;
  }
  _processServerSubs(l) {
    for (const a in l) {
      if (!l.hasOwnProperty(a))
        continue;
      const r = l[a];
      this._serverSubs[a] = {
        offset: r.offset,
        epoch: r.epoch,
        recoverable: r.recoverable || !1
      };
      const o = this._getSubscribeContext(a, r);
      this.emit("subscribed", o);
    }
    for (const a in l) {
      if (!l.hasOwnProperty(a))
        continue;
      const r = l[a];
      if (r.recovered) {
        const o = r.publications;
        if (o && o.length > 0)
          for (const f in o)
            o.hasOwnProperty(f) && this._handlePublication(a, o[f]);
      }
    }
    for (const a in this._serverSubs)
      this._serverSubs.hasOwnProperty(a) && (l[a] || (this.emit("unsubscribed", { channel: a }), delete this._serverSubs[a]));
  }
  _clearRefreshTimeout() {
    this._refreshTimeout !== null && (clearTimeout(this._refreshTimeout), this._refreshTimeout = null);
  }
  _clearReconnectTimeout() {
    this._reconnectTimeout !== null && (clearTimeout(this._reconnectTimeout), this._reconnectTimeout = null);
  }
  _clearServerPingTimeout() {
    this._serverPingTimeout !== null && (clearTimeout(this._serverPingTimeout), this._serverPingTimeout = null);
  }
  _waitServerPing() {
    this._config.maxServerPingDelay !== 0 && this._isConnected() && (this._clearServerPingTimeout(), this._serverPingTimeout = setTimeout(() => {
      this._isConnected() && this._disconnect(Rn.noPing, "no ping", !0);
    }, this._serverPing + this._config.maxServerPingDelay));
  }
  _getSubscribeContext(l, a) {
    const r = {
      channel: l,
      positioned: !1,
      recoverable: !1,
      wasRecovering: !1,
      recovered: !1,
      hasRecoveredPublications: !1
    };
    a.recovered && (r.recovered = !0), a.positioned && (r.positioned = !0), a.recoverable && (r.recoverable = !0), a.was_recovering && (r.wasRecovering = !0);
    let o = "";
    "epoch" in a && (o = a.epoch);
    let f = 0;
    return "offset" in a && (f = a.offset), (r.positioned || r.recoverable) && (r.streamPosition = {
      offset: f,
      epoch: o
    }), Array.isArray(a.publications) && a.publications.length > 0 && (r.hasRecoveredPublications = !0), a.data && (r.data = a.data), r;
  }
  _handleReply(l, a) {
    const r = l.id;
    if (!(r in this._callbacks)) {
      a();
      return;
    }
    const o = this._callbacks[r];
    if (clearTimeout(this._callbacks[r].timeout), delete this._callbacks[r], Ib(l)) {
      const f = o.errback;
      if (!f) {
        a();
        return;
      }
      const d = { code: l.error.code, message: l.error.message || "", temporary: l.error.temporary || !1 };
      f({ error: d, next: a });
    } else {
      const f = o.callback;
      if (!f)
        return;
      f({ reply: l, next: a });
    }
  }
  _handleJoin(l, a, r) {
    const o = this._getSub(l, r);
    if (!o) {
      if (l && this._isServerSub(l)) {
        const f = { channel: l, info: this._getJoinLeaveContext(a.info) };
        this.emit("join", f);
      }
      return;
    }
    o._handleJoin(a);
  }
  _handleLeave(l, a, r) {
    const o = this._getSub(l, r);
    if (!o) {
      if (l && this._isServerSub(l)) {
        const f = { channel: l, info: this._getJoinLeaveContext(a.info) };
        this.emit("leave", f);
      }
      return;
    }
    o._handleLeave(a);
  }
  _handleUnsubscribe(l, a) {
    const r = this._getSub(l, 0);
    if (!r && l) {
      this._isServerSub(l) && (delete this._serverSubs[l], this.emit("unsubscribed", { channel: l }));
      return;
    }
    a.code < 2500 ? r._setUnsubscribed(a.code, a.reason, !1) : (a.code === Ua.stateInvalidated && r._invalidateState(), r._setSubscribing(a.code, a.reason));
  }
  _handleSubscribe(l, a) {
    this._serverSubs[l] = {
      offset: a.offset,
      epoch: a.epoch,
      recoverable: a.recoverable || !1
    }, this.emit("subscribed", this._getSubscribeContext(l, a));
  }
  _handleDisconnect(l) {
    const a = l.code;
    let r = !0;
    (a >= 3500 && a < 4e3 || a >= 4500 && a < 5e3) && (r = !1), this._disconnect(a, l.reason, r);
  }
  _getPublicationContext(l, a) {
    const r = {
      channel: l,
      data: a.data
    };
    return a.offset && (r.offset = a.offset), a.info && (r.info = this._getJoinLeaveContext(a.info)), a.tags && (r.tags = a.tags), r;
  }
  _getJoinLeaveContext(l) {
    const a = {
      client: l.client,
      user: l.user
    }, r = l.conn_info;
    r && (a.connInfo = r);
    const o = l.chan_info;
    return o && (a.chanInfo = o), a;
  }
  _handlePublication(l, a, r) {
    const o = this._getSub(l, r);
    if (!o) {
      if (l && this._isServerSub(l)) {
        const f = this._getPublicationContext(l, a);
        this.emit("publication", f), a.offset !== void 0 && (this._serverSubs[l].offset = a.offset);
      }
      return;
    }
    o._handlePublication(a);
  }
  _handleMessage(l) {
    this.emit("message", { data: l.data });
  }
  _handleServerPing(l) {
    if (this._sendPong) {
      const a = {};
      this._transportSendCommands([a]);
    }
    l();
  }
  _handlePush(l, a) {
    const r = l.channel, o = l.id;
    l.pub ? this._handlePublication(r, l.pub, o) : l.message ? this._handleMessage(l.message) : l.join ? this._handleJoin(r, l.join, o) : l.leave ? this._handleLeave(r, l.leave, o) : l.unsubscribe ? this._handleUnsubscribe(r, l.unsubscribe) : l.subscribe ? this._handleSubscribe(r, l.subscribe) : l.disconnect && this._handleDisconnect(l.disconnect), a();
  }
  _flush() {
    const l = this._commands.slice(0);
    this._commands = [], this._transportSendCommands(l);
  }
  _createErrorObject(l, a, r) {
    const o = {
      code: l,
      message: a
    };
    return r && (o.temporary = !0), o;
  }
  _registerCall(l, a, r) {
    this._callbacks[l] = {
      callback: a,
      errback: r,
      timeout: null
    }, this._callbacks[l].timeout = setTimeout(() => {
      delete this._callbacks[l], zm(r) && r({ error: this._createErrorObject(Re.timeout, "timeout") });
    }, this._config.timeout);
  }
  _addCommand(l) {
    this._batching ? this._commands.push(l) : this._transportSendCommands([l]);
  }
  _nextPromiseId() {
    return ++this._promiseId;
  }
  _nextTransportId() {
    return ++this._transportId;
  }
  _resolvePromises() {
    for (const l in this._promises)
      this._promises.hasOwnProperty(l) && (this._promises[l].timeout && clearTimeout(this._promises[l].timeout), this._promises[l].resolve(), delete this._promises[l]);
  }
  _rejectPromises(l) {
    for (const a in this._promises)
      this._promises.hasOwnProperty(a) && (this._promises[a].timeout && clearTimeout(this._promises[a].timeout), this._promises[a].reject(l), delete this._promises[a]);
  }
}
rr.SubscriptionState = ht;
rr.State = He;
rr.UnauthorizedError = xn;
const o_ = 1e3, f_ = "the server rejected this session: the session token is expired, a refreshToken was presented instead of a sessionToken, or the client key is no longer live", Um = 0, h_ = 1, d_ = 3500, m_ = 4e3, g_ = 4500;
function p_(c) {
  return c >= d_ && c < m_ || c >= g_;
}
const b_ = {
  [Um]: "client-initiated disconnect",
  [h_]: "unauthorized (token expired — will re-mint and relink)",
  3500: "invalid token",
  3501: "bad request (malformed frame)",
  3502: "stale (no successful connect within stale_close_delay)",
  3503: "force disconnect",
  3504: "connection limit",
  3505: "channel limit",
  3506: "inappropriate protocol",
  3507: "permission denied",
  3508: "not available",
  3509: "too many errors"
};
function __(c) {
  return b_[c] ?? "unrecognized code";
}
const y_ = "webchat", v_ = {
  [He.Connected]: "connected",
  [He.Connecting]: "connecting"
};
function S_(c) {
  return v_[c] ?? "disconnected";
}
const T_ = "configuration";
function E_(c) {
  var r, o;
  if (c.type === T_)
    return null;
  const l = ((r = c.error) == null ? void 0 : r.code) ?? -1, a = ((o = c.error) == null ? void 0 : o.message) ?? "websocket error";
  return {
    code: l,
    message: l === o_ ? `${a} — ${f_}` : a
  };
}
const w_ = ["ready", "events", "typing", "error"], R_ = {
  ready: (c, l) => {
    var a;
    return (a = l.onReady) == null ? void 0 : a.call(l, c.ready);
  },
  events: (c, l) => {
    var a;
    return (a = l.onEvents) == null ? void 0 : a.call(l, c.events.events ?? []);
  },
  typing: (c, l) => {
    var a;
    return (a = l.onTyping) == null ? void 0 : a.call(l, c.typing);
  },
  error: (c, l) => {
    var a;
    return (a = l.onServerError) == null ? void 0 : a.call(l, c.error);
  }
};
class A_ {
  constructor(l) {
    this.centrifuge = null, this.callbacks = {}, this.subscribedChannel = null, this.typingEnabled = l.typingEnabled ?? !1, this.logger = l.logger ?? On(l.logLevel ?? xi, "[connectly-webchat:ws]");
  }
  connect(l, a, r) {
    this.centrifuge && this.disconnect(), this.logger.info(`connecting to ${l}`), this.callbacks = r;
    const o = new rr(l, { data: { token: a } });
    this.centrifuge = o, o.on("connecting", () => {
      var f, d;
      return (d = (f = this.callbacks).onStatus) == null ? void 0 : d.call(f, "connecting");
    }), o.on("connected", () => {
      var f, d;
      this.logger.info("connected"), (d = (f = this.callbacks).onStatus) == null || d.call(f, "connected");
    }), o.on("disconnected", (f) => {
      var d, _, b, g;
      this.logger.info(`disconnected: code ${f.code} (${__(f.code)})`), (_ = (d = this.callbacks).onStatus) == null || _.call(d, "disconnected"), (g = (b = this.callbacks).onDisconnected) == null || g.call(b, { code: f.code, reason: f.reason });
    }), o.on("error", (f) => {
      var _, b;
      const d = E_(f);
      d && ((b = (_ = this.callbacks).onTransportError) == null || b.call(_, d));
    }), o.on("subscribed", (f) => {
      var d, _;
      this.subscribedChannel = f.channel, this.logger.info(`subscribed to ${f.channel} (wasRecovering=${f.wasRecovering}, recovered=${f.recovered})`), (_ = (d = this.callbacks).onSubscribed) == null || _.call(d, {
        channel: f.channel,
        wasRecovering: f.wasRecovering,
        recovered: f.recovered
      });
    }), o.on("unsubscribed", (f) => {
      var d, _;
      this.subscribedChannel === f.channel && (this.subscribedChannel = null), (_ = (d = this.callbacks).onUnsubscribed) == null || _.call(d, { channel: f.channel });
    }), o.on("publication", (f) => {
      this.subscribedChannel !== null && f.channel !== this.subscribedChannel || this.handlePublication(f.data);
    }), o.connect();
  }
  setToken(l) {
    var a;
    (a = this.centrifuge) == null || a.setData({ token: l });
  }
  rehandshake() {
    const { centrifuge: l } = this;
    l && (this.logger.debug("rehandshaking (re-opening the socket with the staged token)"), l.state !== He.Disconnected && l.disconnect(), l.connect());
  }
  resetChannel() {
    this.subscribedChannel = null;
  }
  channel() {
    return this.subscribedChannel;
  }
  async sendTyping(l) {
    if (!this.typingEnabled || !this.centrifuge || this.centrifuge.state !== He.Connected)
      return;
    const a = { typing: { isTyping: l } };
    try {
      await this.centrifuge.rpc(y_, a);
    } catch {
    }
  }
  status() {
    return this.centrifuge ? S_(this.centrifuge.state) : "disconnected";
  }
  disconnect() {
    if (this.centrifuge) {
      try {
        this.centrifuge.disconnect();
      } catch {
      }
      this.centrifuge = null;
    }
    this.subscribedChannel = null, this.callbacks = {};
  }
  handlePublication(l) {
    if (!l || typeof l != "object")
      return;
    const a = w_.find((r) => !!l[r]);
    a && R_[a](l, this.callbacks);
  }
}
const x_ = 1, O_ = 1e3, wc = 50, Fd = 100, M_ = 25, C_ = 10 * 1e3, em = 5, D_ = 500, z_ = 30 * 1e3, Rc = 10, U_ = 5 * 1e3, sr = 4096, k_ = "image/", tm = 5 * 1024 * 1024;
function N_(c, l) {
  return c === null || l > c ? l : c;
}
function B_(c, l) {
  return c === null || l < c ? l : c;
}
function L_(c, l) {
  return Array.from({ length: Math.ceil(c.length / l) }, (a, r) => c.slice(r * l, r * l + l));
}
class H_ {
  constructor(l) {
    this.callbacks = {}, this.restOnly = !1, this.warnedRestOnly = !1, this.terminated = !1, this.resolveInFlight = /* @__PURE__ */ new Map(), this.lastTypingSentAt = 0, this.started = !1, this.closed = !1, this.latestEventId = null, this.oldestEventId = null, this.moreHistory = !0, this.initialHistoryLoaded = !1, this.initialHistory = null, this.loadingOlder = !1, this.lastTailRefreshAt = 0, this.relinkAttempts = 0, this.relinkTimer = null, this.lastRelinkAttemptAt = 0, this.tokenChangeRehandshaked = !1, this.onWake = () => this.relinkIfDown(), this.logger = On(l.logLevel ?? xi, "[connectly-webchat]"), this.rest = new Cm({
      apiBaseUrl: l.apiBaseUrl ?? Mm,
      fetchFn: l.fetchFn,
      logger: this.logger
    }), this.session = new Xb({
      clientKey: l.clientKey,
      rest: this.rest,
      storage: l.storage,
      protocolVersion: l.protocolVersion ?? x_,
      onTokenChange: (a) => this.handleTokenChange(a),
      onSessionReset: () => this.handleSessionReset(),
      onTerminal: (a) => this.enterTerminated(a),
      onRefreshStalled: (a) => this.handleRefreshStalled(a),
      logger: this.logger
    }), this.transport = new A_({
      typingEnabled: l.typingEnabled,
      logger: this.logger
    }), this.wsUrlOverride = l.wsUrl;
  }
  on(l) {
    this.callbacks = { ...this.callbacks, ...l };
  }
  async connect() {
    var l, a, r, o;
    if (!this.started) {
      if (this.terminated) {
        (a = (l = this.callbacks).onStatus) == null || a.call(l, "terminated");
        return;
      }
      this.started = !0, this.closed = !1, this.session.revive();
      try {
        const f = await this.session.ensureSession();
        if (this.closed || !this.started)
          return;
        this.fireAndForget(() => this.ensureInitialHistory());
        const d = this.wsUrlOverride || f.wsUrl;
        if (!d) {
          this.logger.warn(`no wsUrl available (override=${this.wsUrlOverride ?? "(none)"}, mint wsUrl=${f.wsUrl === "" ? "(empty)" : f.wsUrl}) — entering REST-only mode`), this.enterRestOnly();
          return;
        }
        this.restOnly = !1;
        const _ = {
          onReady: (b) => {
            var g, T;
            return (T = (g = this.callbacks).onReady) == null ? void 0 : T.call(g, b);
          },
          onEvents: (b) => this.emitEvents(b, "live"),
          onTyping: (b) => {
            var g, T;
            return (T = (g = this.callbacks).onTyping) == null ? void 0 : T.call(g, b.isTyping);
          },
          onStatus: (b) => {
            var g, T;
            return (T = (g = this.callbacks).onStatus) == null ? void 0 : T.call(g, b);
          },
          onServerError: (b) => {
            var g, T;
            return (T = (g = this.callbacks).onError) == null ? void 0 : T.call(g, b);
          },
          onTransportError: (b) => {
            var g, T;
            return (T = (g = this.callbacks).onError) == null ? void 0 : T.call(g, b);
          },
          onSubscribed: (b) => this.handleSubscribed(b),
          onDisconnected: (b) => this.handleDisconnected(b.code)
        };
        this.transport.connect(d, f.sessionToken, _), this.addWakeListeners();
      } catch (f) {
        if (Yc(f)) {
          this.enterTerminated(f);
          return;
        }
        throw this.started = !1, (o = (r = this.callbacks).onError) == null || o.call(r, f), f;
      }
    }
  }
  enterRestOnly() {
    var l, a;
    this.restOnly = !0, this.warnedRestOnly || (this.warnedRestOnly = !0, this.logger.warn("webchat: no wsUrl configured (neither a `wsUrl` override nor the session mint returned one) — running in REST-only mode: history and send still work, but nothing is realtime.")), (a = (l = this.callbacks).onStatus) == null || a.call(l, "rest-only");
  }
  enterTerminated(l) {
    var a, r, o, f;
    this.terminated || (this.terminated = !0, this.started = !1, this.clearRelinkTimer(), this.removeWakeListeners(), this.transport.disconnect(), this.session.dispose(), (r = (a = this.callbacks).onStatus) == null || r.call(a, "terminated"), (f = (o = this.callbacks).onError) == null || f.call(o, {
      code: "session_terminated",
      message: "webchat: the session was refused and will not be retried — reload to start a new one",
      cause: l
    }));
  }
  handleRefreshStalled(l) {
    var a, r;
    (r = (a = this.callbacks).onError) == null || r.call(a, {
      code: "session_refresh_stalled",
      message: "webchat: could not renew the session after several attempts — will retry when the connection returns",
      cause: l
    });
  }
  disconnect() {
    this.closed = !0, this.started = !1, this.clearRelinkTimer(), this.removeWakeListeners(), this.transport.disconnect(), this.session.dispose(), this.resetHistoryState();
  }
  newClientMessageId() {
    return Ab();
  }
  async sendText(l, a) {
    if (this.terminated)
      throw new Ta();
    if (a.trim() === "")
      throw new Fn("webchat: message body must not be empty");
    if ([...a].length > sr)
      throw new Fn(`webchat: message body must not exceed ${sr} characters`);
    const r = this.session.generation();
    this.logger.debug(`sendText clientMessageId=${l}`);
    const o = await this.session.withAuth((f) => this.rest.send(f, { clientMessageId: l, text: { body: a } }));
    if (this.session.generation() !== r)
      throw new Is();
    return this.logger.debug(`sendText clientMessageId=${l} acked -> roomEventId=${o.roomEventId}`), this.trackEventIds([o.roomEventId]), o;
  }
  async uploadAttachment(l, a) {
    if (this.terminated)
      throw new Ta();
    if (!l || l.size <= 0)
      throw new Fn("webchat: attachment must not be empty");
    if (!l.type.startsWith(k_))
      throw new Fn("webchat: attachments must be images");
    if (l.size > tm)
      throw new Fn(`webchat: attachment must not exceed ${Math.floor(tm / (1024 * 1024))} MB`);
    const r = this.session.generation(), o = await this.session.withAuth((f) => this.rest.createUploadIntent(f, {
      contentType: l.type,
      size: String(l.size),
      filename: l.name || null
    }));
    if (this.session.generation() !== r)
      throw new Is();
    return await this.rest.uploadToS3(o.uploadUrl, o.formFields, l, a), { assetId: o.assetId };
  }
  async sendAttachment(l, a) {
    var d;
    if (this.terminated)
      throw new Ta();
    if (a.assetId === "")
      throw new Fn("webchat: attachment assetId must not be empty");
    const r = (d = a.caption) == null ? void 0 : d.trim(), o = this.session.generation();
    this.logger.debug(`sendAttachment clientMessageId=${l} assetId=${a.assetId}`);
    const f = await this.session.withAuth((_) => this.rest.send(_, {
      clientMessageId: l,
      attachment: { assetId: a.assetId, type: "image", caption: r || null }
    }));
    if (this.session.generation() !== o)
      throw new Is();
    return this.logger.debug(`sendAttachment clientMessageId=${l} acked -> roomEventId=${f.roomEventId}`), this.trackEventIds([f.roomEventId]), f;
  }
  async sendButtonReply(l, a) {
    if (this.terminated)
      throw new Ta();
    if (!a.buttonId)
      throw new Fn("webchat: buttonReply buttonId must not be empty");
    if (!a.sourceEventId)
      throw new Fn("webchat: buttonReply sourceEventId must not be empty");
    const r = this.session.generation();
    this.logger.debug(`sendButtonReply clientMessageId=${l} buttonId=${a.buttonId}`);
    const o = await this.session.withAuth((f) => this.rest.send(f, {
      clientMessageId: l,
      buttonReply: { buttonId: a.buttonId, text: a.text, sourceEventId: a.sourceEventId }
    }));
    if (this.session.generation() !== r)
      throw new Is();
    return this.logger.debug(`sendButtonReply clientMessageId=${l} acked -> roomEventId=${o.roomEventId}`), this.trackEventIds([o.roomEventId]), o;
  }
  resolveAttachment(l) {
    if (this.terminated)
      return Promise.reject(new Ta());
    const a = this.resolveInFlight.get(l);
    if (a)
      return a;
    const r = this.runResolveAttachment(l).finally(() => {
      this.resolveInFlight.delete(l);
    });
    return this.resolveInFlight.set(l, r), r;
  }
  async runResolveAttachment(l) {
    this.logger.debug(`resolveAttachment assetId=${l}`);
    const a = await this.session.withAuth((o) => this.rest.resolveAttachment(o, l)), r = Number(a.expiresInSeconds);
    return {
      url: a.url,
      expiresInSeconds: Number.isFinite(r) ? r : 0
    };
  }
  sendTyping(l) {
    const a = Date.now();
    l && a - this.lastTypingSentAt < O_ || (l && (this.lastTypingSentAt = a), this.fireAndForget(() => this.transport.sendTyping(l)));
  }
  ack(l, a) {
    if (this.terminated || a.length === 0)
      return;
    const r = L_(a, M_);
    this.logger.debug(`ack ${l} for ${a.length} event(s) in ${r.length} batch(es)`), this.fireAndForget(() => r.reduce(async (o, f) => {
      await o;
      try {
        await this.session.withAuth((d) => this.rest.ack(d, { level: l, eventIds: f }));
      } catch (d) {
        this.logger.debug("ack batch failed (best-effort, continuing)", d);
      }
    }, Promise.resolve()));
  }
  status() {
    return this.terminated ? "terminated" : this.restOnly ? "rest-only" : this.transport.status();
  }
  hasMoreHistory() {
    return this.moreHistory;
  }
  async loadInitialHistory() {
    const l = await this.fetchHistory({ limit: wc });
    return l === null ? [] : (this.initialHistoryLoaded = !0, this.moreHistory = l.hasMore && l.events.length > 0, this.emitEvents(l.events, "history-initial"), l.events);
  }
  ensureInitialHistory() {
    return this.initialHistory === null && (this.initialHistory = this.runInitialHistoryLoad()), this.initialHistory;
  }
  async runInitialHistoryLoad() {
    try {
      return await this.loadInitialHistory();
    } catch (l) {
      throw this.initialHistory = null, l;
    }
  }
  async refreshTail() {
    if (this.terminated)
      return [];
    const l = Date.now();
    if (l - this.lastTailRefreshAt < C_)
      return [];
    const a = await this.fetchHistory({ limit: wc });
    return a === null ? [] : (this.lastTailRefreshAt = l, this.oldestEventId === null && (this.moreHistory = a.hasMore && a.events.length > 0), this.emitEvents(a.events, "history-tail"), a.events);
  }
  async loadOlder(l = wc) {
    if (this.terminated || this.loadingOlder || !this.moreHistory || this.oldestEventId === null)
      return [];
    this.loadingOlder = !0;
    try {
      const a = await this.fetchHistory({ beforeEventId: this.oldestEventId, limit: l });
      return a === null ? [] : (this.moreHistory = a.hasMore && a.events.length > 0, this.emitEvents(a.events, "history-older"), a.events);
    } finally {
      this.loadingOlder = !1;
    }
  }
  async fetchHistory(l) {
    const a = this.session.generation(), r = await this.session.withAuth((o) => this.rest.history(o, l));
    return this.session.generation() !== a ? null : { events: r.events ?? [], hasMore: r.hasMore === !0 };
  }
  emitEvents(l, a) {
    var r, o;
    l.length !== 0 && (this.trackEventIds(l.map((f) => f.id)), (o = (r = this.callbacks).onEvents) == null || o.call(r, l, { source: a }));
  }
  trackEventIds(l) {
    l.filter(Boolean).forEach((a) => {
      this.latestEventId = N_(this.latestEventId, a), this.oldestEventId = B_(this.oldestEventId, a);
    });
  }
  handleSubscribed(l) {
    if (this.relinkAttempts = 0, l.wasRecovering && l.recovered)
      return;
    const a = this.initialHistoryLoaded ? this.catchUp() : this.ensureInitialHistory();
    this.fireAndForget(() => a);
  }
  async catchUp() {
    var o;
    const l = this.latestEventId;
    if (l === null) {
      await this.refreshTail();
      return;
    }
    let a = l, r = `after ${em} pages`;
    for (let f = 0; f < em; f += 1) {
      const d = await this.fetchHistory({ afterEventId: a, limit: Fd });
      if (d === null || (this.emitEvents(d.events, "recovery"), !d.hasMore))
        return;
      const _ = (o = d.events.filter((b) => b.id).pop()) == null ? void 0 : o.id;
      if (!_) {
        r = "on a page holding nothing this widget can render";
        break;
      }
      a = _;
    }
    await this.giveUpCatchUp(r);
  }
  async giveUpCatchUp(l) {
    var r, o;
    const a = await this.fetchHistory({ limit: Fd });
    a !== null && (this.emitEvents(a.events, "recovery"), (o = (r = this.callbacks).onError) == null || o.call(r, {
      code: "catchup_truncated",
      message: `webchat: stopped catching up ${l}; some older messages may be missing`
    }));
  }
  handleTokenChange(l) {
    this.transport.setToken(l), this.started && (this.transport.rehandshake(), this.tokenChangeRehandshaked = !0);
  }
  handleSessionReset() {
    var l, a;
    this.resetHistoryState(), this.transport.resetChannel(), this.resolveInFlight.clear(), (a = (l = this.callbacks).onSessionReset) == null || a.call(l);
  }
  resetHistoryState() {
    this.latestEventId = null, this.oldestEventId = null, this.moreHistory = !0, this.initialHistoryLoaded = !1, this.initialHistory = null, this.lastTailRefreshAt = 0;
  }
  handleDisconnected(l) {
    if (!(this.closed || !this.started || this.restOnly || this.terminated || l === Um)) {
      if (p_(l)) {
        this.enterTerminated(new Error(`webchat: server closed the connection with code ${l}`));
        return;
      }
      this.scheduleRelink();
    }
  }
  scheduleRelink() {
    var r, o;
    if (this.relinkTimer !== null || this.closed || this.restOnly || this.terminated)
      return;
    if (this.relinkAttempts >= Rc) {
      this.logger.warn(`relink budget exhausted after ${Rc} attempts — giving up`), (o = (r = this.callbacks).onError) == null || o.call(r, {
        code: "relink_exhausted",
        message: "webchat: could not re-establish the connection"
      });
      return;
    }
    const a = Math.min(z_, D_ * 2 ** this.relinkAttempts) * (0.8 + Math.random() * 0.4);
    this.relinkAttempts += 1, this.logger.info(`scheduling relink attempt ${this.relinkAttempts}/${Rc} in ${Math.round(a)}ms`), this.relinkTimer = setTimeout(() => {
      this.relinkTimer = null, this.fireAndForget(() => this.relinkNow());
    }, a);
  }
  async relinkNow() {
    var l, a;
    if (!(this.closed || !this.started || this.terminated)) {
      this.lastRelinkAttemptAt = Date.now();
      try {
        this.tokenChangeRehandshaked = !1;
        const r = await this.session.ensureSession();
        this.tokenChangeRehandshaked || (this.transport.setToken(r.sessionToken), this.transport.rehandshake());
      } catch (r) {
        if (Yc(r)) {
          this.enterTerminated(r);
          return;
        }
        (a = (l = this.callbacks).onError) == null || a.call(l, r), this.scheduleRelink();
      }
    }
  }
  relinkIfDown() {
    this.closed || !this.started || this.restOnly || this.terminated || typeof document < "u" && document.visibilityState === "hidden" || this.transport.status() === "disconnected" && (Date.now() - this.lastRelinkAttemptAt < U_ || (this.clearRelinkTimer(), this.relinkAttempts = 0, this.fireAndForget(() => this.relinkNow())));
  }
  clearRelinkTimer() {
    this.relinkTimer !== null && (clearTimeout(this.relinkTimer), this.relinkTimer = null);
  }
  async runSafely(l) {
    var a, r;
    try {
      await l();
    } catch (o) {
      (r = (a = this.callbacks).onError) == null || r.call(a, o);
    }
  }
  fireAndForget(l) {
    this.runSafely(l);
  }
  addWakeListeners() {
    typeof window < "u" && window.addEventListener("online", this.onWake), typeof document < "u" && document.addEventListener("visibilitychange", this.onWake);
  }
  removeWakeListeners() {
    typeof window < "u" && window.removeEventListener("online", this.onWake), typeof document < "u" && document.removeEventListener("visibilitychange", this.onWake);
  }
}
var Ac = { exports: {} }, Ea = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nm;
function j_() {
  if (nm) return Ea;
  nm = 1;
  var c = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function a(r, o, f) {
    var d = null;
    if (f !== void 0 && (d = "" + f), o.key !== void 0 && (d = "" + o.key), "key" in o) {
      f = {};
      for (var _ in o)
        _ !== "key" && (f[_] = o[_]);
    } else f = o;
    return o = f.ref, {
      $$typeof: c,
      type: r,
      key: d,
      ref: o !== void 0 ? o : null,
      props: f
    };
  }
  return Ea.Fragment = l, Ea.jsx = a, Ea.jsxs = a, Ea;
}
var im;
function q_() {
  return im || (im = 1, Ac.exports = j_()), Ac.exports;
}
var Y = q_(), xc = { exports: {} }, oe = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lm;
function Y_() {
  if (lm) return oe;
  lm = 1;
  var c = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.portal"), a = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), o = /* @__PURE__ */ Symbol.for("react.profiler"), f = /* @__PURE__ */ Symbol.for("react.consumer"), d = /* @__PURE__ */ Symbol.for("react.context"), _ = /* @__PURE__ */ Symbol.for("react.forward_ref"), b = /* @__PURE__ */ Symbol.for("react.suspense"), g = /* @__PURE__ */ Symbol.for("react.memo"), T = /* @__PURE__ */ Symbol.for("react.lazy"), V = Symbol.iterator;
  function P(y) {
    return y === null || typeof y != "object" ? null : (y = V && y[V] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var W = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, F = Object.assign, ce = {};
  function se(y, k, j) {
    this.props = y, this.context = k, this.refs = ce, this.updater = j || W;
  }
  se.prototype.isReactComponent = {}, se.prototype.setState = function(y, k) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, k, "setState");
  }, se.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function qe() {
  }
  qe.prototype = se.prototype;
  function lt(y, k, j) {
    this.props = y, this.context = k, this.refs = ce, this.updater = j || W;
  }
  var me = lt.prototype = new qe();
  me.constructor = lt, F(me, se.prototype), me.isPureReactComponent = !0;
  var N = Array.isArray, x = { H: null, A: null, T: null, S: null, V: null }, B = Object.prototype.hasOwnProperty;
  function q(y, k, j, L, $, ve) {
    return j = ve.ref, {
      $$typeof: c,
      type: y,
      key: k,
      ref: j !== void 0 ? j : null,
      props: ve
    };
  }
  function Z(y, k) {
    return q(
      y.type,
      k,
      void 0,
      void 0,
      void 0,
      y.props
    );
  }
  function ue(y) {
    return typeof y == "object" && y !== null && y.$$typeof === c;
  }
  function ie(y) {
    var k = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(j) {
      return k[j];
    });
  }
  var ke = /\/+/g;
  function Be(y, k) {
    return typeof y == "object" && y !== null && y.key != null ? ie("" + y.key) : k.toString(36);
  }
  function $e() {
  }
  function ut(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then($e, $e) : (y.status = "pending", y.then(
          function(k) {
            y.status === "pending" && (y.status = "fulfilled", y.value = k);
          },
          function(k) {
            y.status === "pending" && (y.status = "rejected", y.reason = k);
          }
        )), y.status) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function Qe(y, k, j, L, $) {
    var ve = typeof y;
    (ve === "undefined" || ve === "boolean") && (y = null);
    var le = !1;
    if (y === null) le = !0;
    else
      switch (ve) {
        case "bigint":
        case "string":
        case "number":
          le = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case c:
            case l:
              le = !0;
              break;
            case T:
              return le = y._init, Qe(
                le(y._payload),
                k,
                j,
                L,
                $
              );
          }
      }
    if (le)
      return $ = $(y), le = L === "" ? "." + Be(y, 0) : L, N($) ? (j = "", le != null && (j = le.replace(ke, "$&/") + "/"), Qe($, k, j, "", function(wt) {
        return wt;
      })) : $ != null && (ue($) && ($ = Z(
        $,
        j + ($.key == null || y && y.key === $.key ? "" : ("" + $.key).replace(
          ke,
          "$&/"
        ) + "/") + le
      )), k.push($)), 1;
    le = 0;
    var dt = L === "" ? "." : L + ":";
    if (N(y))
      for (var ze = 0; ze < y.length; ze++)
        L = y[ze], ve = dt + Be(L, ze), le += Qe(
          L,
          k,
          j,
          ve,
          $
        );
    else if (ze = P(y), typeof ze == "function")
      for (y = ze.call(y), ze = 0; !(L = y.next()).done; )
        L = L.value, ve = dt + Be(L, ze++), le += Qe(
          L,
          k,
          j,
          ve,
          $
        );
    else if (ve === "object") {
      if (typeof y.then == "function")
        return Qe(
          ut(y),
          k,
          j,
          L,
          $
        );
      throw k = String(y), Error(
        "Objects are not valid as a React child (found: " + (k === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : k) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return le;
  }
  function O(y, k, j) {
    if (y == null) return y;
    var L = [], $ = 0;
    return Qe(y, L, "", "", function(ve) {
      return k.call(j, ve, $++);
    }), L;
  }
  function H(y) {
    if (y._status === -1) {
      var k = y._result;
      k = k(), k.then(
        function(j) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = j);
        },
        function(j) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = j);
        }
      ), y._status === -1 && (y._status = 0, y._result = k);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var I = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var k = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(k)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  };
  function Ee() {
  }
  return oe.Children = {
    map: O,
    forEach: function(y, k, j) {
      O(
        y,
        function() {
          k.apply(this, arguments);
        },
        j
      );
    },
    count: function(y) {
      var k = 0;
      return O(y, function() {
        k++;
      }), k;
    },
    toArray: function(y) {
      return O(y, function(k) {
        return k;
      }) || [];
    },
    only: function(y) {
      if (!ue(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  }, oe.Component = se, oe.Fragment = a, oe.Profiler = o, oe.PureComponent = lt, oe.StrictMode = r, oe.Suspense = b, oe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = x, oe.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return x.H.useMemoCache(y);
    }
  }, oe.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, oe.cloneElement = function(y, k, j) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var L = F({}, y.props), $ = y.key, ve = void 0;
    if (k != null)
      for (le in k.ref !== void 0 && (ve = void 0), k.key !== void 0 && ($ = "" + k.key), k)
        !B.call(k, le) || le === "key" || le === "__self" || le === "__source" || le === "ref" && k.ref === void 0 || (L[le] = k[le]);
    var le = arguments.length - 2;
    if (le === 1) L.children = j;
    else if (1 < le) {
      for (var dt = Array(le), ze = 0; ze < le; ze++)
        dt[ze] = arguments[ze + 2];
      L.children = dt;
    }
    return q(y.type, $, void 0, void 0, ve, L);
  }, oe.createContext = function(y) {
    return y = {
      $$typeof: d,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: f,
      _context: y
    }, y;
  }, oe.createElement = function(y, k, j) {
    var L, $ = {}, ve = null;
    if (k != null)
      for (L in k.key !== void 0 && (ve = "" + k.key), k)
        B.call(k, L) && L !== "key" && L !== "__self" && L !== "__source" && ($[L] = k[L]);
    var le = arguments.length - 2;
    if (le === 1) $.children = j;
    else if (1 < le) {
      for (var dt = Array(le), ze = 0; ze < le; ze++)
        dt[ze] = arguments[ze + 2];
      $.children = dt;
    }
    if (y && y.defaultProps)
      for (L in le = y.defaultProps, le)
        $[L] === void 0 && ($[L] = le[L]);
    return q(y, ve, void 0, void 0, null, $);
  }, oe.createRef = function() {
    return { current: null };
  }, oe.forwardRef = function(y) {
    return { $$typeof: _, render: y };
  }, oe.isValidElement = ue, oe.lazy = function(y) {
    return {
      $$typeof: T,
      _payload: { _status: -1, _result: y },
      _init: H
    };
  }, oe.memo = function(y, k) {
    return {
      $$typeof: g,
      type: y,
      compare: k === void 0 ? null : k
    };
  }, oe.startTransition = function(y) {
    var k = x.T, j = {};
    x.T = j;
    try {
      var L = y(), $ = x.S;
      $ !== null && $(j, L), typeof L == "object" && L !== null && typeof L.then == "function" && L.then(Ee, I);
    } catch (ve) {
      I(ve);
    } finally {
      x.T = k;
    }
  }, oe.unstable_useCacheRefresh = function() {
    return x.H.useCacheRefresh();
  }, oe.use = function(y) {
    return x.H.use(y);
  }, oe.useActionState = function(y, k, j) {
    return x.H.useActionState(y, k, j);
  }, oe.useCallback = function(y, k) {
    return x.H.useCallback(y, k);
  }, oe.useContext = function(y) {
    return x.H.useContext(y);
  }, oe.useDebugValue = function() {
  }, oe.useDeferredValue = function(y, k) {
    return x.H.useDeferredValue(y, k);
  }, oe.useEffect = function(y, k, j) {
    var L = x.H;
    if (typeof j == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return L.useEffect(y, k);
  }, oe.useId = function() {
    return x.H.useId();
  }, oe.useImperativeHandle = function(y, k, j) {
    return x.H.useImperativeHandle(y, k, j);
  }, oe.useInsertionEffect = function(y, k) {
    return x.H.useInsertionEffect(y, k);
  }, oe.useLayoutEffect = function(y, k) {
    return x.H.useLayoutEffect(y, k);
  }, oe.useMemo = function(y, k) {
    return x.H.useMemo(y, k);
  }, oe.useOptimistic = function(y, k) {
    return x.H.useOptimistic(y, k);
  }, oe.useReducer = function(y, k, j) {
    return x.H.useReducer(y, k, j);
  }, oe.useRef = function(y) {
    return x.H.useRef(y);
  }, oe.useState = function(y) {
    return x.H.useState(y);
  }, oe.useSyncExternalStore = function(y, k, j) {
    return x.H.useSyncExternalStore(
      y,
      k,
      j
    );
  }, oe.useTransition = function() {
    return x.H.useTransition();
  }, oe.version = "19.1.8", oe;
}
var am;
function Jc() {
  return am || (am = 1, xc.exports = Y_()), xc.exports;
}
var G = Jc();
const Wc = G.createContext({}), km = {
  namePlaceholder: "Your name (optional)",
  nameAriaLabel: "Your display name",
  visitorLabel: "You",
  supportLabel: "Support",
  typingIndicator: "Support is typing…",
  composerPlaceholder: "Type a message…",
  sendButton: "Send",
  retryButton: "retry",
  messageTooLong: "Message is too long — the limit is {limit} characters.",
  terminatedPlaceholder: "This chat is no longer available — reload the page to start a new one.",
  attachAriaLabel: "Attach an image",
  attachmentLoading: "Loading attachment…",
  attachmentUnavailable: "Attachment unavailable",
  attachmentImage: "Image",
  attachmentVideo: "Video",
  attachmentAudio: "Audio",
  attachmentDocument: "Document",
  attachmentGeneric: "File",
  carouselEmptyCard: "This card has no content.",
  urlButtonFallback: "Open link",
  nonHttpUrlNote: "link unavailable",
  closeButton: "Close chat"
}, G_ = 4e3, V_ = 2e3, X_ = 1, Q_ = 64, Z_ = 48, sm = {
  failed: 0,
  pending: 1,
  sent: 2,
  delivered: 3,
  read: 4
};
function Vc(c, l) {
  return sm[l] > sm[c] ? l : c;
}
function Nm(c) {
  return c.readAt ? "read" : c.deliveredAt ? "delivered" : "sent";
}
const K_ = {
  image: "image",
  video: "video",
  audio: "audio",
  document: "document",
  attachment_type_unspecified: void 0
};
function P_(c) {
  const l = K_[c.type], a = l === "image" || l === "video" ? c[l] : void 0;
  return {
    width: (a == null ? void 0 : a.width) || void 0,
    height: (a == null ? void 0 : a.height) || void 0
  };
}
function J_(c, l) {
  return c ? "ready" : l ? "resolving" : "unavailable";
}
function Bm(c) {
  const l = c.url ?? "", a = c.assetId ?? "";
  return {
    assetId: a,
    type: c.type ?? "attachment_type_unspecified",
    url: l,
    caption: c.caption ?? void 0,
    filename: c.filename ?? void 0,
    size: c.size ?? void 0,
    ...P_(c),
    state: J_(l, a)
  };
}
function W_(c) {
  const l = [], a = [];
  return (c ?? []).forEach((r) => {
    r.quickReply ? l.push(r.quickReply) : r.url && a.push(r.url);
  }), { quickReplies: l, urlButtons: a };
}
function Lm(c) {
  return c ? c.text ? { headerText: c.text } : c.attachment ? { image: Bm(c.attachment) } : {} : {};
}
function I_(c) {
  var f;
  const { headerText: l, image: a } = Lm(c.header), { quickReplies: r, urlButtons: o } = W_(c.buttons);
  return {
    headerText: l,
    image: a,
    text: c.text ?? void 0,
    footerText: ((f = c.footer) == null ? void 0 : f.text) ?? void 0,
    quickReplies: r,
    urlButtons: o
  };
}
function $_(c) {
  const { headerText: l, image: a } = Lm(c.header), { action: r } = c;
  let o = [], f;
  return r != null && r.ctaUrl ? f = r.ctaUrl : r != null && r.quickReplyButtons && (o = r.quickReplyButtons.buttons ?? []), {
    cardIndex: c.cardIndex ?? 0,
    headerText: l,
    image: a,
    bodyText: c.bodyText ?? void 0,
    quickReplies: o,
    ctaUrl: f
  };
}
function F_(c) {
  return { cards: (c.cards ?? []).map($_).sort((a, r) => a.cardIndex - r.cardIndex) };
}
const ey = ["text", "attachment", "buttons", "carousel"], ty = {
  text: (c) => {
    var l;
    return { body: ((l = c.text) == null ? void 0 : l.body) ?? "" };
  },
  attachment: (c) => ({ body: "", attachment: Bm(c.attachment) }),
  buttons: (c) => ({ body: "", buttons: I_(c.buttons) }),
  carousel: (c) => ({ body: "", carousel: F_(c.carousel) })
};
function Hm(c) {
  const l = ey.find((a) => !!c[a]);
  return l ? ty[l](c) : { body: "" };
}
function ny(c) {
  const l = Hm(c);
  return {
    id: c.id,
    authorType: c.authorType,
    body: l.body,
    attachment: l.attachment,
    buttons: l.buttons,
    carousel: l.carousel,
    status: Nm(c),
    createdAt: c.createdAt ?? void 0,
    raw: c
  };
}
function jm(c, l) {
  if (c.id && l.id)
    return c.id === l.id ? 0 : c.id < l.id ? -1 : 1;
  if (!c.id && !l.id) {
    const a = c.createdAt ?? "", r = l.createdAt ?? "";
    return a === r ? 0 : a < r ? -1 : 1;
  }
  return c.id ? -1 : 1;
}
function wa(c) {
  if (c instanceof An)
    return c.errorCode ? `${c.message} (${c.errorCode})` : c.message;
  if (c instanceof Error)
    return c.message;
  if (c && typeof c == "object") {
    const { code: l, message: a } = c;
    if (typeof a == "string")
      return l === void 0 || l === "" ? a : `${a} (${String(l)})`;
    try {
      return JSON.stringify(c);
    } catch {
      return "unknown error";
    }
  }
  return String(c);
}
function qm(c, l) {
  if (!l)
    return c;
  if (!c || c.assetId && l.assetId && c.assetId !== l.assetId)
    return l;
  const a = c.assetId === l.assetId;
  return {
    ...l,
    url: c.url || l.url,
    state: c.url || a && !l.url ? c.state : l.state,
    localPreviewUrl: c.localPreviewUrl
  };
}
function Ym(c, l) {
  return qm(c, l) ?? void 0;
}
function iy(c, l) {
  return l ? c ? { ...l, image: Ym(c.image, l.image) } : l : c;
}
function ly(c, l) {
  if (!l)
    return c;
  if (!c)
    return l;
  const a = /* @__PURE__ */ new Map();
  return c.cards.forEach((r) => {
    var o;
    (o = r.image) != null && o.assetId && a.set(r.image.assetId, r.image);
  }), a.size === 0 ? l : {
    ...l,
    cards: l.cards.map((r) => {
      var f;
      const o = (f = r.image) != null && f.assetId ? a.get(r.image.assetId) : void 0;
      return o ? { ...r, image: Ym(o, r.image) } : r;
    })
  };
}
function ay(c, l) {
  const a = Hm(l);
  return {
    ...c,
    id: l.id,
    body: a.body || c.body,
    attachment: qm(c.attachment, a.attachment),
    buttons: iy(c.buttons, a.buttons),
    carousel: ly(c.carousel, a.carousel),
    status: Vc(c.status, Nm(l)),
    createdAt: c.createdAt ?? l.createdAt ?? void 0,
    raw: l
  };
}
function sy(c, l) {
  if (l.length === 0)
    return c;
  const a = c.slice(), r = /* @__PURE__ */ new Map();
  a.forEach((f, d) => {
    f.id && r.set(f.id, d);
  });
  let o = !1;
  return l.forEach((f) => {
    if (!f.id)
      return;
    const d = r.get(f.id);
    if (d === void 0) {
      a.push(ny(f)), r.set(f.id, a.length - 1), o = !0;
      return;
    }
    a[d] = ay(a[d], f), o = !0;
  }), o ? (a.sort(jm), a) : c;
}
function Oc(c, l, a) {
  if (!l)
    return c;
  let r = !1;
  const o = c.map((f) => {
    var _, b, g, T;
    let d = f;
    return ((_ = f.attachment) == null ? void 0 : _.assetId) === l && (d = { ...d, attachment: a(f.attachment) }), ((g = (b = f.buttons) == null ? void 0 : b.image) == null ? void 0 : g.assetId) === l && (d = { ...d, buttons: { ...f.buttons, image: a(f.buttons.image) } }), (T = f.carousel) != null && T.cards.some((V) => {
      var P;
      return ((P = V.image) == null ? void 0 : P.assetId) === l;
    }) && (d = {
      ...d,
      carousel: {
        ...f.carousel,
        cards: f.carousel.cards.map((V) => {
          var P;
          return ((P = V.image) == null ? void 0 : P.assetId) === l ? { ...V, image: a(V.image) } : V;
        })
      }
    }), d !== f && (r = !0), d;
  });
  return r ? o : c;
}
function Mc(c, l, a) {
  const r = c.findIndex((g) => g.clientMessageId === l);
  if (r < 0)
    return c;
  const o = c.findIndex((g, T) => T !== r && g.id === a), f = c[r], d = o >= 0 ? c[o] : null, _ = {
    ...f,
    id: a,
    status: Vc(Vc(f.status, "sent"), (d == null ? void 0 : d.status) ?? "sent"),
    createdAt: f.createdAt ?? (d == null ? void 0 : d.createdAt),
    raw: (d == null ? void 0 : d.raw) ?? f.raw
  }, b = c.filter((g, T) => T !== r && T !== o);
  return b.push(_), b.sort(jm), b;
}
const ye = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    fontSize: 14,
    color: "#111",
    background: "#fff",
    border: "1px solid #e2e2e2"
  },
  header: {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },
  nameInput: {
    flex: "1 1 120px",
    minWidth: 0,
    padding: "4px 6px",
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 13
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  meta: {
    fontSize: 11,
    color: "#888",
    marginTop: 2
  },
  typing: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#888",
    padding: "0 12px 4px",
    minHeight: 16
  },
  composer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 8,
    borderTop: "1px solid #eee"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.4,
    fontFamily: "inherit",
    resize: "none",
    maxHeight: 120,
    overflowY: "auto"
  },
  composerActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: "none",
    borderRadius: 8,
    background: "var(--cwc-accent, #2563eb)",
    color: "var(--cwc-accent-text, #fff)",
    cursor: "pointer"
  },
  attachBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "var(--cwc-text-muted, #6b7280)",
    cursor: "pointer"
  },
  hiddenFileInput: {
    display: "none"
  },
  figure: {
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  attachmentImage: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    borderRadius: 6
  },
  figcaption: {
    fontSize: 13,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  fileCard: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid rgba(0,0,0,0.15)",
    color: "inherit",
    textDecoration: "none"
  },
  fileName: {
    fontSize: 13,
    wordBreak: "break-all"
  },
  fileMeta: {
    fontSize: 11,
    opacity: 0.75
  },
  attachmentPlaceholder: {
    fontSize: 13,
    fontStyle: "italic",
    opacity: 0.75
  },
  errorBar: {
    padding: "6px 12px",
    background: "#fdecea",
    color: "#b71c1c",
    fontSize: 12
  },
  retryBtn: {
    marginLeft: 6,
    padding: "0 6px",
    border: "1px solid #c62828",
    borderRadius: 4,
    background: "transparent",
    color: "#c62828",
    cursor: "pointer",
    fontSize: 11
  },
  interactiveHeaderText: {
    fontWeight: 600
  },
  interactiveFooterText: {
    fontSize: 12,
    opacity: 0.75,
    marginTop: 4
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6
  },
  quickReplyChip: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid var(--cwc-accent, #2563eb)",
    background: "#fff",
    color: "var(--cwc-accent, #2563eb)",
    fontSize: 12,
    cursor: "pointer"
  },
  quickReplyChipDisabled: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #9db8e8",
    background: "#fff",
    color: "#9db8e8",
    fontSize: 12,
    cursor: "not-allowed"
  },
  quickReplyChipTapped: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid var(--cwc-accent, #2563eb)",
    background: "var(--cwc-accent, #2563eb)",
    color: "var(--cwc-accent-text, #fff)",
    fontSize: 12,
    cursor: "default"
  },
  urlButtonChip: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #999",
    color: "inherit",
    fontSize: 12,
    textDecoration: "none"
  },
  urlButtonInert: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px dashed #c62828",
    color: "#c62828",
    fontSize: 12,
    fontStyle: "italic"
  },
  carouselRail: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    flexWrap: "nowrap",
    paddingBottom: 2
  },
  carouselCard: {
    flex: "0 0 200px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 8,
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.5)"
  },
  carouselCardEmpty: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.75
  }
};
function ry(c) {
  return { width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" };
}
function uy(c) {
  return { display: "flex", flexDirection: "column", alignItems: c ? "flex-end" : "flex-start" };
}
function cy(c) {
  return {
    maxWidth: "78%",
    padding: "6px 10px",
    borderRadius: 10,
    background: c ? "var(--cwc-bubble-visitor, #2563eb)" : "var(--cwc-bubble-agent, #f1f1f1)",
    color: c ? "var(--cwc-bubble-visitor-text, #fff)" : "var(--cwc-bubble-agent-text, #111)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  };
}
const oy = {
  connected: "#2e7d32",
  connecting: "#f9a825",
  disconnected: "#c62828",
  "rest-only": "#757575",
  terminated: "#c62828"
}, fy = {
  pending: "sending…",
  sent: "sent",
  delivered: "delivered",
  read: "read",
  failed: "failed"
};
function hy(c) {
  return fy[c];
}
const dy = {
  image: "attachmentImage",
  video: "attachmentVideo",
  audio: "attachmentAudio",
  document: "attachmentDocument",
  attachment_type_unspecified: "attachmentGeneric"
};
function my(c, l) {
  return l[dy[c] ?? "attachmentGeneric"];
}
const rm = ["B", "KB", "MB", "GB"];
function gy(c) {
  const l = Number(c ?? "");
  if (!Number.isFinite(l) || l <= 0)
    return null;
  const a = Math.min(Math.floor(Math.log(l) / Math.log(1024)), rm.length - 1), r = l / 1024 ** a;
  return `${a === 0 ? r : r.toFixed(1)} ${rm[a]}`;
}
const Ic = G.memo(({ attachment: c, labels: l, onResolve: a, onLoaded: r }) => {
  const { assetId: o, type: f, url: d, caption: _, filename: b, size: g, width: T, height: V, localPreviewUrl: P, state: W } = c, F = P || d;
  G.useEffect(() => {
    !F && o && a(o, "missing");
  }, [F, o, a]);
  const ce = G.useCallback(() => {
    o && a(o, "error");
  }, [o, a]), se = G.useCallback(() => {
    o && r(o);
  }, [o, r]);
  if (W === "unavailable")
    return Y.jsx("div", { style: ye.attachmentPlaceholder, children: l.attachmentUnavailable });
  if (!F)
    return Y.jsx("div", { style: ye.attachmentPlaceholder, children: l.attachmentLoading });
  if (f === "image")
    return Y.jsxs("figure", { style: ye.figure, children: [Y.jsx("img", { src: F, alt: "", width: T, height: V, style: ye.attachmentImage, onError: ce, onLoad: se }), _ ? Y.jsx("figcaption", { style: ye.figcaption, children: _ }) : null] });
  const qe = my(f, l), lt = [b ? qe : null, gy(g)].filter(Boolean).join(" · ");
  return Y.jsxs("div", { style: ye.figure, children: [Y.jsxs("a", { style: ye.fileCard, href: F, target: "_blank", rel: "noreferrer", children: [Y.jsx("span", { style: ye.fileName, children: b || qe }), lt ? Y.jsx("span", { style: ye.fileMeta, children: lt }) : null] }), _ ? Y.jsx("div", { style: ye.figcaption, children: _ }) : null] });
});
Ic.displayName = "AttachmentView";
function py(c, l) {
  return c ? ye.quickReplyChipTapped : l ? ye.quickReplyChipDisabled : ye.quickReplyChip;
}
const $c = G.memo(({ button: c, sourceEventId: l, cardIndex: a, disabled: r, tapped: o, onTap: f }) => {
  const d = G.useCallback(() => {
    f(c, l, a);
  }, [c, l, a, f]);
  return Y.jsx("button", { type: "button", style: py(o, r), disabled: r, onClick: d, children: c.text });
});
$c.displayName = "QuickReplyChip";
const Fc = G.memo(({ button: c, labels: l }) => {
  const { onNavigate: a } = G.useContext(Wc), r = c.text || c.url || l.urlButtonFallback;
  if (!/^https?:\/\//i.test(c.url))
    return Y.jsx("span", { style: ye.urlButtonInert, children: `${r} (${l.nonHttpUrlNote})` });
  const o = a ? (f) => {
    f.preventDefault(), a({ kind: "url", url: c.url, label: r });
  } : void 0;
  return Y.jsx("a", { style: ye.urlButtonChip, href: c.url, target: "_blank", rel: "noreferrer", onClick: o, children: r });
});
Fc.displayName = "UrlButton";
function Gm(c, l, a) {
  return !!c.id && a && l === c.id;
}
const eo = G.memo(({ image: c, headerText: l, labels: a, onResolveAttachment: r, onAttachmentLoaded: o }) => c ? Y.jsx(Ic, { attachment: c, labels: a, onResolve: r, onLoaded: o }) : l ? Y.jsx("div", { style: ye.interactiveHeaderText, children: l }) : null);
eo.displayName = "MessageHeaderView";
const Vm = G.memo(({ buttons: c, sourceEventId: l, disabled: a, repliedWithButtonId: r, labels: o, onQuickReply: f, onResolveAttachment: d, onAttachmentLoaded: _ }) => {
  const b = c.quickReplies.length > 0 || c.urlButtons.length > 0;
  return Y.jsxs("div", { children: [Y.jsx(eo, { image: c.image, headerText: c.headerText, labels: o, onResolveAttachment: d, onAttachmentLoaded: _ }), c.text ? Y.jsx("div", { children: c.text }) : null, c.footerText ? Y.jsx("div", { style: ye.interactiveFooterText, children: c.footerText }) : null, b ? Y.jsxs("div", { style: ye.chipRow, children: [c.quickReplies.map((g, T) => Y.jsx($c, { button: g, sourceEventId: l, disabled: a, tapped: Gm(g, r, !0), onTap: f }, g.id || `qr-${T}`)), c.urlButtons.map((g, T) => Y.jsx(Fc, { button: g, labels: o }, `${g.url}-${T}`))] }) : null] });
});
Vm.displayName = "ButtonsView";
const Xm = G.memo(({ quickReplies: c, ctaUrl: l, sourceEventId: a, cardIndex: r, disabled: o, cardMatches: f, repliedWithButtonId: d, labels: _, onQuickReply: b }) => c.length > 0 ? Y.jsx("div", { style: ye.chipRow, children: c.map((g, T) => Y.jsx($c, { button: g, sourceEventId: a, cardIndex: r, disabled: o, tapped: Gm(g, d, f), onTap: b }, g.id || `qr-${T}`)) }) : l ? Y.jsx("div", { style: ye.chipRow, children: Y.jsx(Fc, { button: l, labels: _ }) }) : null);
Xm.displayName = "CarouselCardActionView";
const Qm = G.memo(({ carousel: c, sourceEventId: l, disabled: a, repliedWithButtonId: r, repliedWithCardIndex: o, labels: f, onQuickReply: d, onResolveAttachment: _, onAttachmentLoaded: b }) => Y.jsx("div", { style: ye.carouselRail, children: c.cards.map((g, T) => {
  const V = !!(g.image || g.headerText), P = !!g.bodyText, F = g.quickReplies.length > 0 || !!g.ctaUrl;
  return Y.jsxs("div", { "data-testid": "carousel-card", style: ye.carouselCard, children: [Y.jsx(eo, { image: g.image, headerText: g.headerText, labels: f, onResolveAttachment: _, onAttachmentLoaded: b }), g.bodyText ? Y.jsx("div", { children: g.bodyText }) : null, Y.jsx(Xm, { quickReplies: g.quickReplies, ctaUrl: g.ctaUrl, sourceEventId: l, cardIndex: T, disabled: a, cardMatches: o === T, repliedWithButtonId: r, labels: f, onQuickReply: d }), !V && !P && !F ? Y.jsx("div", { style: ye.carouselCardEmpty, children: f.carouselEmptyCard }) : null] }, `${l}-${T}`);
}) }));
Qm.displayName = "CarouselView";
const Zm = G.memo(({ message: c, labels: l, onRetry: a, terminated: r, onResolveAttachment: o, onAttachmentLoaded: f, onQuickReply: d }) => {
  const _ = c.authorType === "AUTHOR_TYPE_VISITOR", b = c.status === "failed", g = r || !!c.repliedWith, T = () => a(c);
  return Y.jsxs("div", { style: uy(_), children: [Y.jsxs("div", { style: cy(_), children: [c.attachment ? Y.jsx(Ic, { attachment: c.attachment, labels: l, onResolve: o, onLoaded: f }) : null, c.buttons ? Y.jsx(Vm, { buttons: c.buttons, sourceEventId: c.id ?? "", disabled: g, repliedWithButtonId: c.repliedWithButtonId, labels: l, onQuickReply: d, onResolveAttachment: o, onAttachmentLoaded: f }) : null, c.carousel ? Y.jsx(Qm, { carousel: c.carousel, sourceEventId: c.id ?? "", disabled: g, repliedWithButtonId: c.repliedWithButtonId, repliedWithCardIndex: c.repliedWithCardIndex, labels: l, onQuickReply: d, onResolveAttachment: o, onAttachmentLoaded: f }) : null, c.body] }), Y.jsxs("div", { style: ye.meta, children: [_ ? `${c.displayName || l.visitorLabel} · ${hy(c.status)}` : l.supportLabel, b && !r ? Y.jsx("button", { type: "button", style: ye.retryBtn, onClick: T, children: l.retryButton }) : null] })] });
});
Zm.displayName = "MessageRow";
function by({ clientKey: c, apiBaseUrl: l, wsUrl: a, labels: r, logLevel: o, onNavigate: f, showHeader: d = !0 }) {
  const _ = G.useMemo(() => ({ ...km, ...r }), [r]), [b, g] = G.useState([]), [T, V] = G.useState("connecting"), [P, W] = G.useState(!1), [F, ce] = G.useState(""), [se, qe] = G.useState(""), [lt, me] = G.useState(null), N = T === "terminated", x = G.useRef(null), B = G.useRef(""), q = G.useRef(null), Z = G.useRef(null), ue = G.useRef(null), ie = G.useRef(/* @__PURE__ */ new Set()), ke = G.useRef(/* @__PURE__ */ new Set()), Be = G.useRef([]), $e = G.useRef(!0), ut = G.useRef(null), Qe = G.useRef(!1), O = G.useRef(null), H = G.useRef(null), I = G.useRef(/* @__PURE__ */ new Map()), Ee = G.useRef(/* @__PURE__ */ new Map()), y = G.useRef(/* @__PURE__ */ new Map()), k = G.useRef(o);
  G.useEffect(() => {
    B.current = F;
  }, [F]), G.useEffect(() => {
    Be.current = b;
  }, [b]), G.useEffect(() => {
    k.current = o;
  }, [o]);
  const j = G.useCallback(() => {
    const D = x.current;
    if (!D)
      return;
    const K = Be.current.filter((re) => {
      var X;
      return re.authorType === "AUTHOR_TYPE_BUSINESS" && re.id && !((X = re.raw) != null && X.readAt) && !ie.current.has(re.id);
    }).map((re) => re.id);
    K.forEach((re) => ie.current.add(re)), K.length && D.ack("ACK_LEVEL_READ", K);
  }, []), L = G.useCallback((D) => {
    const K = Ee.current.get(D);
    K && (URL.revokeObjectURL(K), Ee.current.delete(D));
  }, []), $ = G.useCallback(() => {
    Ee.current.forEach((D) => URL.revokeObjectURL(D)), Ee.current.clear();
  }, []), ve = G.useCallback((D, K) => {
    const re = x.current;
    if (!re || !D)
      return;
    const X = I.current.get(D) ?? { inFlight: !1, errorRetries: 0 };
    if (I.current.set(D, X), X.inFlight)
      return;
    if (K === "error") {
      if (X.errorRetries >= X_) {
        g((Se) => Oc(Se, D, (ae) => ({ ...ae, state: "unavailable" })));
        return;
      }
      X.errorRetries += 1;
    }
    X.inFlight = !0, (async () => {
      try {
        const { url: Se } = await re.resolveAttachment(D);
        if (x.current !== re)
          return;
        g((ae) => Oc(ae, D, (Fe) => ({
          ...Fe,
          url: Se,
          state: Se ? "ready" : "unavailable"
        })));
      } catch {
        if (x.current !== re)
          return;
        g((Se) => Oc(Se, D, (ae) => ({ ...ae, state: "unavailable" })));
      } finally {
        X.inFlight = !1;
      }
    })();
  }, []), le = G.useCallback((D) => {
    const K = I.current.get(D);
    K && (K.errorRetries = 0);
  }, []);
  G.useEffect(() => {
    const D = new H_({ clientKey: c, apiBaseUrl: l, wsUrl: a, logLevel: k.current });
    x.current = D, g([]), W(!1), me(null), ie.current.clear(), ke.current.clear(), $e.current = !0, ut.current = null, I.current.clear(), $(), y.current.clear();
    const K = () => x.current === D;
    return D.on({
      onStatus: (X) => {
        K() && (V(X), X === "connected" && me(null));
      },
      onError: (X) => {
        K() && me(wa(X));
      },
      onReady: () => {
        K() && me(null);
      },
      onEvents: (X, he) => {
        if (!K() || !X.length)
          return;
        he.source === "history-older" && q.current && (ut.current = q.current.scrollHeight), g((ae) => sy(ae, X));
        const Se = X.filter((ae) => ae.authorType === "AUTHOR_TYPE_BUSINESS" && ae.id && !ae.deliveredAt && !ke.current.has(ae.id)).map((ae) => ae.id);
        Se.forEach((ae) => ke.current.add(ae)), Se.length && D.ack("ACK_LEVEL_DELIVERED", Se);
      },
      onSessionReset: () => {
        K() && (g([]), ie.current.clear(), ke.current.clear(), W(!1), $e.current = !0, ut.current = null, I.current.clear(), $(), y.current.clear());
      },
      onTyping: (X) => {
        K() && (W(X), Z.current && clearTimeout(Z.current), X && (Z.current = setTimeout(() => W(!1), G_)));
      }
    }), (async () => {
      try {
        await D.connect();
      } catch {
      }
    })(), () => {
      D.disconnect(), x.current = null, Z.current && clearTimeout(Z.current), ue.current && clearTimeout(ue.current), $();
    };
  }, [c, l, a]), G.useEffect(() => {
    const D = q.current;
    if (D) {
      if (ut.current !== null) {
        D.scrollTop = D.scrollHeight - ut.current, ut.current = null;
        return;
      }
      $e.current && (D.scrollTop = D.scrollHeight);
    }
  }, [b, P]);
  const dt = G.useCallback(() => {
    const D = q.current, K = x.current;
    D && ($e.current = D.scrollHeight - D.scrollTop - D.clientHeight <= Q_, K && D.scrollTop <= Z_ && K.hasMoreHistory() && !Qe.current && (Qe.current = !0, (async () => {
      try {
        await K.loadOlder();
      } catch {
      } finally {
        Qe.current = !1;
      }
    })()));
  }, []);
  G.useEffect(() => {
    const D = () => {
      j(), (async () => {
        var X;
        try {
          await ((X = x.current) == null ? void 0 : X.refreshTail());
        } catch {
        }
      })();
    }, K = () => {
      document.visibilityState === "visible" && D();
    };
    return window.addEventListener("focus", D), document.addEventListener("visibilitychange", K), document.visibilityState === "visible" && j(), () => {
      window.removeEventListener("focus", D), document.removeEventListener("visibilitychange", K);
    };
  }, [j]), G.useEffect(() => {
    typeof document < "u" && document.visibilityState === "visible" && j();
  }, [b, j]);
  const ze = G.useCallback((D) => {
    qe(D);
    const K = x.current;
    K && (K.sendTyping(!0), ue.current && clearTimeout(ue.current), ue.current = setTimeout(() => K.sendTyping(!1), V_));
  }, []), wt = G.useCallback(async (D, K) => {
    const re = x.current;
    if (re)
      try {
        const X = await re.sendText(D, K);
        if (x.current !== re)
          return;
        me(null), g((he) => Mc(he, D, X.roomEventId));
      } catch (X) {
        if (x.current !== re)
          return;
        me(wa(X)), g((he) => he.map((Se) => Se.clientMessageId === D ? { ...Se, status: "failed" } : Se));
      }
  }, []), ni = G.useCallback(() => {
    const D = x.current, K = se.trim();
    if (!D || !K)
      return;
    if ([...K].length > sr) {
      me(_.messageTooLong.replace("{limit}", String(sr)));
      return;
    }
    const re = D.newClientMessageId(), X = {
      clientMessageId: re,
      authorType: "AUTHOR_TYPE_VISITOR",
      body: K,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      displayName: B.current || void 0
    };
    $e.current = !0, g((he) => [...he, X]), qe(""), me(null), D.sendTyping(!1), ue.current && clearTimeout(ue.current), wt(re, K);
  }, [se, wt, _]), sn = G.useCallback(async (D, K, re, X) => {
    const he = x.current;
    if (he)
      try {
        const Se = await he.sendButtonReply(D, { buttonId: K, text: re, sourceEventId: X });
        if (x.current !== he)
          return;
        me(null), g((ae) => Mc(ae, D, Se.roomEventId));
      } catch (Se) {
        if (x.current !== he)
          return;
        me(wa(Se)), g((ae) => ae.map((Fe) => Fe.clientMessageId === D ? { ...Fe, status: "failed" } : Fe));
      }
  }, []), Oi = G.useCallback((D, K, re) => {
    const X = x.current;
    if (!X)
      return;
    const he = X.newClientMessageId();
    y.current.set(he, { buttonId: D.id, text: D.text, sourceEventId: K });
    const Se = {
      clientMessageId: he,
      authorType: "AUTHOR_TYPE_VISITOR",
      body: D.text,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      displayName: B.current || void 0
    };
    $e.current = !0, me(null), g((ae) => [...ae, Se].map((Fe) => Fe.id === K ? { ...Fe, repliedWith: he, repliedWithButtonId: D.id, repliedWithCardIndex: re } : Fe)), sn(he, D.id, D.text, K);
  }, [sn]), Mn = G.useCallback(async (D, K, re) => {
    const X = x.current;
    if (X)
      try {
        const he = await X.sendAttachment(D, { assetId: K, caption: re });
        if (x.current !== X)
          return;
        me(null), g((Se) => Mc(Se, D, he.roomEventId).map((ae) => ae.clientMessageId === D && ae.attachment ? { ...ae, attachment: { ...ae.attachment, localPreviewUrl: void 0, state: "resolving" } } : ae)), L(D);
      } catch (he) {
        if (x.current !== X)
          return;
        me(wa(he)), g((Se) => Se.map((ae) => ae.clientMessageId === D ? { ...ae, status: "failed" } : ae));
      }
  }, [L]), Mi = G.useCallback((D) => {
    const K = x.current;
    if (!K)
      return;
    const re = se.trim(), X = K.newClientMessageId(), he = URL.createObjectURL(D);
    Ee.current.set(X, he);
    const Se = {
      clientMessageId: X,
      authorType: "AUTHOR_TYPE_VISITOR",
      body: "",
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      displayName: B.current || void 0,
      attachment: {
        assetId: "",
        type: "image",
        url: "",
        caption: re || void 0,
        filename: D.name || void 0,
        size: String(D.size),
        localPreviewUrl: he,
        state: "uploading"
      }
    };
    $e.current = !0, g((Fe) => [...Fe, Se]), qe(""), me(null), (async () => {
      try {
        const { assetId: Fe } = await K.uploadAttachment(D);
        if (x.current !== K)
          return;
        g((Rl) => Rl.map((Xt) => Xt.clientMessageId === X && Xt.attachment ? { ...Xt, attachment: { ...Xt.attachment, assetId: Fe, state: "ready" } } : Xt)), await Mn(X, Fe, re);
      } catch (Fe) {
        if (x.current !== K)
          return;
        me(wa(Fe)), g((Rl) => Rl.map((Xt) => Xt.clientMessageId === X ? { ...Xt, status: "failed" } : Xt));
      }
    })();
  }, [se, Mn]), Na = G.useCallback((D) => {
    if (!D.clientMessageId || D.status !== "failed")
      return;
    const K = y.current.get(D.clientMessageId);
    if (K) {
      me(null), g((re) => re.map((X) => X.clientMessageId === D.clientMessageId ? { ...X, status: "pending" } : X)), sn(D.clientMessageId, K.buttonId, K.text, K.sourceEventId);
      return;
    }
    if (D.attachment) {
      if (!D.attachment.assetId)
        return;
      me(null), g((re) => re.map((X) => X.clientMessageId === D.clientMessageId ? { ...X, status: "pending" } : X)), Mn(D.clientMessageId, D.attachment.assetId, D.attachment.caption);
      return;
    }
    me(null), g((re) => re.map((X) => X.clientMessageId === D.clientMessageId ? { ...X, status: "pending" } : X)), wt(D.clientMessageId, D.body);
  }, [wt, Mn, sn]), ur = G.useCallback((D) => {
    var re;
    const K = (re = D.target.files) == null ? void 0 : re[0];
    O.current && (O.current.value = ""), K && Mi(K);
  }, [Mi]), Ut = G.useCallback(() => {
    var D;
    (D = O.current) == null || D.click();
  }, []), cr = G.useCallback((D) => {
    ce(D.target.value);
  }, []), Ba = G.useCallback((D) => {
    ze(D.target.value);
  }, [ze]), La = G.useCallback((D) => {
    D.key === "Enter" && !D.shiftKey && (D.preventDefault(), ni());
  }, [ni]);
  G.useEffect(() => {
    const D = H.current;
    D && (D.style.height = "auto", D.style.height = `${Math.min(D.scrollHeight, 120)}px`);
  }, [se]);
  const Ci = G.useMemo(() => b.map((D, K) => {
    const re = D.id ?? D.clientMessageId ?? `idx-${K}`;
    return Y.jsx(Zm, { message: D, labels: _, onRetry: Na, terminated: N, onResolveAttachment: ve, onAttachmentLoaded: le, onQuickReply: Oi }, re);
  }), [b, _, Na, N, ve, le, Oi]), or = G.useMemo(() => ({ onNavigate: f }), [f]);
  return Y.jsx(Wc.Provider, { value: or, children: Y.jsxs("div", { style: ye.root, children: [d ? Y.jsxs("div", { style: ye.header, children: [Y.jsx("span", { style: ry(oy[T]), title: T }), Y.jsx("input", { style: ye.nameInput, value: F, onChange: cr, placeholder: _.namePlaceholder, "aria-label": _.nameAriaLabel })] }) : null, lt ? Y.jsx("div", { style: ye.errorBar, children: lt }) : null, Y.jsx("div", { style: ye.list, ref: q, onScroll: dt, role: "log", "aria-live": "polite", "aria-relevant": "additions", "aria-label": "Conversation", children: Ci }), Y.jsx("div", { style: ye.typing, role: "status", "aria-live": "polite", "aria-atomic": "true", children: P ? _.typingIndicator : "" }), Y.jsxs("div", { style: ye.composer, children: [Y.jsx("textarea", { ref: H, style: ye.input, value: se, rows: 1, disabled: N, placeholder: N ? _.terminatedPlaceholder : _.composerPlaceholder, onChange: Ba, onKeyDown: La }), Y.jsxs("div", { style: ye.composerActions, children: [Y.jsx("input", { ref: O, type: "file", accept: "image/*", style: ye.hiddenFileInput, disabled: N, onChange: ur, tabIndex: -1, "aria-hidden": "true" }), Y.jsx("button", { type: "button", style: ye.attachBtn, disabled: N, onClick: Ut, "aria-label": _.attachAriaLabel, children: Y.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: Y.jsx("path", { d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" }) }) }), Y.jsx("button", { type: "button", style: ye.sendBtn, disabled: N, onClick: ni, "aria-label": _.sendButton, children: Y.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [Y.jsx("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), Y.jsx("path", { d: "M6 12h16" })] }) })] })] })] }) });
}
const _l = 1, um = 64 * 1024;
function Km(c) {
  return c && typeof c == "object" && (Object.values(c).forEach((l) => Km(l)), Object.freeze(c)), c;
}
const bt = Km({
  schemaVersion: _l,
  launcher: {
    side: "right",
    offsetX: 20,
    offsetY: 20,
    size: 56,
    shape: "circle",
    label: "",
    ariaLabel: "Chat with us",
    icon: { kind: "default", url: "" },
    hideOnMobile: !1
  },
  panel: {
    width: 380,
    height: 600,
    radius: 16,
    title: "Chat with us",
    subtitle: "",
    greeting: "",
    showBranding: !0,
    anchor: "launcher"
  },
  theme: {
    accent: "#2563eb",
    accentText: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f5f5f5",
    text: "#111111",
    textMuted: "#6b7280",
    border: "#e2e2e2",
    bubbleVisitor: "#2563eb",
    bubbleVisitorText: "#ffffff",
    bubbleAgent: "#f1f1f1",
    bubbleAgentText: "#111111",
    bubbleRadius: 12,
    fontFamily: "",
    colorScheme: "light"
  },
  zIndex: 2147483e3,
  collision: {
    bottomOffsetSelectors: [],
    bottomOffsetPx: 0,
    maxBottomOffsetPx: 240,
    hideBehindModalDialog: !0
  },
  mobile: {
    breakpointPx: 768,
    launcher: { offsetX: 12, offsetY: 12, size: 52 },
    panel: { fullscreen: !0, width: 0, height: 0, radius: 0 }
  },
  behavior: {
    autoOpen: "never",
    autoOpenDelayMs: 0,
    autoOpenDesktopOnly: !0,
    prefetchPanel: !0
  },
  navigation: { linkTarget: "host" },
  paths: { mode: "all", patterns: [] },
  position: {},
  bundleVersion: ""
}), _y = 24, yy = 60, vy = 60, Sy = 100, Ty = 280, Ey = 200, cm = 200, Cc = 4, om = 200, Dc = 20, wy = 200, Ry = 40, fm = 500, Ay = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i, xy = /^[\w \-,'"]{1,200}$/;
function Pm(c) {
  return typeof c == "object" && c !== null && !Array.isArray(c);
}
function pt(c) {
  return typeof c == "string" ? JSON.stringify(c.length > 40 ? `${c.slice(0, 40)}…` : c) : Array.isArray(c) ? "array" : c === null ? "null" : typeof c == "number" ? String(c) : typeof c;
}
function zt(c, l, a) {
  const r = c[l];
  if (r != null) {
    if (!Pm(r)) {
      a(`${l}: expected object, got ${pt(r)}`);
      return;
    }
    return r;
  }
}
function Je(c, l, a, r, o, f, d) {
  const _ = c == null ? void 0 : c[l];
  if (_ == null)
    return r;
  if (typeof _ != "number")
    return d(`${a}: expected number, got ${pt(_)}`), r;
  if (!Number.isFinite(_))
    return d(`${a}: expected a finite number, got ${pt(_)}`), r;
  if (_ < o || _ > f) {
    const b = Math.min(Math.max(_, o), f);
    return d(`${a}: ${_} is outside ${o}..${f}, clamped to ${b}`), b;
  }
  return _;
}
function wl(c, l, a, r, o) {
  const f = c == null ? void 0 : c[l];
  return f == null ? r : typeof f != "boolean" ? (o(`${a}: expected boolean, got ${pt(f)}`), r) : f;
}
function Ai(c, l, a, r, o, f) {
  const d = c == null ? void 0 : c[l];
  return d == null ? r : typeof d != "string" ? (f(`${a}: expected string, got ${pt(d)}`), r) : d.length > o ? (f(`${a}: longer than ${o} characters, truncated`), [...d].slice(0, o).join("")) : d;
}
function ti(c, l, a, r, o, f) {
  const d = c == null ? void 0 : c[l];
  return d == null ? r : typeof d != "string" || !o.includes(d) ? (f(`${a}: expected one of ${o.join("|")}, got ${pt(d)}`), r) : d;
}
function Pt(c, l, a, r, o) {
  const f = c == null ? void 0 : c[l];
  return f == null ? r : typeof f != "string" || !Ay.test(f) ? (o(`${a}: expected hex color, got ${pt(f)}`), r) : f;
}
function Oy(c, l) {
  const a = c == null ? void 0 : c.fontFamily;
  return a == null || a === "" ? "" : typeof a != "string" || a.length > Ey || !xy.test(a) ? (l(`theme.fontFamily: expected a plain font family list, got ${pt(a)}`), "") : a;
}
function My(c) {
  if (typeof document > "u")
    return !0;
  try {
    return document.querySelector(c), !0;
  } catch {
    return !1;
  }
}
function Cy(c, l) {
  const a = c == null ? void 0 : c.bottomOffsetSelectors;
  if (a == null)
    return [];
  if (!Array.isArray(a))
    return l(`collision.bottomOffsetSelectors: expected array, got ${pt(a)}`), [];
  let r = a;
  r.length > Cc && (l(`collision.bottomOffsetSelectors: more than ${Cc} entries, extras dropped`), r = r.slice(0, Cc));
  const o = [];
  return r.forEach((f, d) => {
    const _ = `collision.bottomOffsetSelectors[${d}]`;
    if (typeof f != "string") {
      l(`${_}: expected string, got ${pt(f)}`);
      return;
    }
    if (f.length > cm) {
      l(`${_}: longer than ${cm} characters, dropped`);
      return;
    }
    if (!My(f)) {
      l(`${_}: not a valid CSS selector, dropped`);
      return;
    }
    o.push(f);
  }), o;
}
function Dy(c, l) {
  const a = c == null ? void 0 : c.patterns;
  if (a == null)
    return [];
  if (!Array.isArray(a))
    return l(`paths.patterns: expected array, got ${pt(a)}`), [];
  let r = a;
  r.length > Dc && (l(`paths.patterns: more than ${Dc} entries, extras dropped`), r = r.slice(0, Dc));
  const o = [];
  return r.forEach((f, d) => {
    if (typeof f != "string") {
      l(`paths.patterns[${d}]: expected string, got ${pt(f)}`);
      return;
    }
    if (f.length > om) {
      l(`paths.patterns[${d}]: longer than ${om} characters, dropped`);
      return;
    }
    o.push(f);
  }), o;
}
function zy(c, l) {
  const a = c == null ? void 0 : c.url;
  return a == null ? "" : typeof a != "string" ? (l(`launcher.icon.url: expected string, got ${pt(a)}`), "") : a.length > fm ? (l(`launcher.icon.url: longer than ${fm} characters, rejected`), "") : a;
}
function Uy(c, l) {
  const a = bt.launcher.icon, r = zt(c ?? {}, "icon", l), o = ti(r, "kind", "launcher.icon.kind", a.kind, ["default", "url", "none"], l), f = (r == null ? void 0 : r.url) !== void 0 && (r == null ? void 0 : r.url) !== null, d = zy(r, l);
  if (o !== "url")
    return { kind: o, url: d };
  if (f && d === "")
    return { kind: "default", url: "" };
  let _ = !1;
  try {
    _ = new URL(d).protocol === "https:";
  } catch {
    _ = !1;
  }
  return _ ? { kind: o, url: d } : (l(`launcher.icon.url: expected an https URL, got ${pt(d)}`), { kind: "default", url: "" });
}
function ky(c, l) {
  const a = bt.launcher;
  return {
    side: ti(c, "side", "launcher.side", a.side, ["left", "right"], l),
    offsetX: Je(c, "offsetX", "launcher.offsetX", a.offsetX, 0, 200, l),
    offsetY: Je(c, "offsetY", "launcher.offsetY", a.offsetY, 0, 200, l),
    size: Je(c, "size", "launcher.size", a.size, 40, 80, l),
    shape: ti(c, "shape", "launcher.shape", a.shape, ["circle", "pill"], l),
    label: Ai(c, "label", "launcher.label", a.label, _y, l),
    ariaLabel: Ai(c, "ariaLabel", "launcher.ariaLabel", a.ariaLabel, yy, l),
    icon: Uy(c, l),
    hideOnMobile: wl(c, "hideOnMobile", "launcher.hideOnMobile", a.hideOnMobile, l)
  };
}
function Ny(c, l) {
  const a = bt.panel;
  return {
    width: Je(c, "width", "panel.width", a.width, 300, 560, l),
    height: Je(c, "height", "panel.height", a.height, 360, 900, l),
    radius: Je(c, "radius", "panel.radius", a.radius, 0, 32, l),
    title: Ai(c, "title", "panel.title", a.title, vy, l),
    subtitle: Ai(c, "subtitle", "panel.subtitle", a.subtitle, Sy, l),
    greeting: Ai(c, "greeting", "panel.greeting", a.greeting, Ty, l),
    showBranding: wl(c, "showBranding", "panel.showBranding", a.showBranding, l),
    anchor: ti(c, "anchor", "panel.anchor", a.anchor, ["launcher", "center"], l)
  };
}
function By(c, l) {
  const a = bt.theme;
  return {
    accent: Pt(c, "accent", "theme.accent", a.accent, l),
    accentText: Pt(c, "accentText", "theme.accentText", a.accentText, l),
    surface: Pt(c, "surface", "theme.surface", a.surface, l),
    surfaceAlt: Pt(c, "surfaceAlt", "theme.surfaceAlt", a.surfaceAlt, l),
    text: Pt(c, "text", "theme.text", a.text, l),
    textMuted: Pt(c, "textMuted", "theme.textMuted", a.textMuted, l),
    border: Pt(c, "border", "theme.border", a.border, l),
    bubbleVisitor: Pt(c, "bubbleVisitor", "theme.bubbleVisitor", a.bubbleVisitor, l),
    bubbleVisitorText: Pt(c, "bubbleVisitorText", "theme.bubbleVisitorText", a.bubbleVisitorText, l),
    bubbleAgent: Pt(c, "bubbleAgent", "theme.bubbleAgent", a.bubbleAgent, l),
    bubbleAgentText: Pt(c, "bubbleAgentText", "theme.bubbleAgentText", a.bubbleAgentText, l),
    bubbleRadius: Je(c, "bubbleRadius", "theme.bubbleRadius", a.bubbleRadius, 0, 24, l),
    fontFamily: Oy(c, l),
    colorScheme: ti(c, "colorScheme", "theme.colorScheme", a.colorScheme, ["light", "dark", "auto"], l)
  };
}
function Ly(c, l) {
  const a = bt.collision;
  return {
    bottomOffsetSelectors: Cy(c, l),
    bottomOffsetPx: Je(c, "bottomOffsetPx", "collision.bottomOffsetPx", a.bottomOffsetPx, 0, 400, l),
    maxBottomOffsetPx: Je(c, "maxBottomOffsetPx", "collision.maxBottomOffsetPx", a.maxBottomOffsetPx, 0, 400, l),
    hideBehindModalDialog: wl(c, "hideBehindModalDialog", "collision.hideBehindModalDialog", a.hideBehindModalDialog, l)
  };
}
function Hy(c, l) {
  const a = bt.mobile, r = c ? zt(c, "launcher", l) : void 0, o = c ? zt(c, "panel", l) : void 0;
  return {
    breakpointPx: Je(c, "breakpointPx", "mobile.breakpointPx", a.breakpointPx, 320, 1024, l),
    launcher: {
      offsetX: Je(r, "offsetX", "mobile.launcher.offsetX", a.launcher.offsetX, 0, 200, l),
      offsetY: Je(r, "offsetY", "mobile.launcher.offsetY", a.launcher.offsetY, 0, 200, l),
      size: Je(r, "size", "mobile.launcher.size", a.launcher.size, 40, 80, l)
    },
    panel: {
      fullscreen: wl(o, "fullscreen", "mobile.panel.fullscreen", a.panel.fullscreen, l),
      width: Je(o, "width", "mobile.panel.width", a.panel.width, 0, 560, l),
      height: Je(o, "height", "mobile.panel.height", a.panel.height, 0, 900, l),
      radius: Je(o, "radius", "mobile.panel.radius", a.panel.radius, 0, 32, l)
    }
  };
}
function jy(c, l) {
  const a = bt.behavior;
  return {
    autoOpen: ti(c, "autoOpen", "behavior.autoOpen", a.autoOpen, ["never", "firstVisit", "everyVisit"], l),
    autoOpenDelayMs: Je(c, "autoOpenDelayMs", "behavior.autoOpenDelayMs", a.autoOpenDelayMs, 0, 6e4, l),
    autoOpenDesktopOnly: wl(c, "autoOpenDesktopOnly", "behavior.autoOpenDesktopOnly", a.autoOpenDesktopOnly, l),
    prefetchPanel: wl(c, "prefetchPanel", "behavior.prefetchPanel", a.prefetchPanel, l)
  };
}
function qy(c, l) {
  return {
    linkTarget: ti(c, "linkTarget", "navigation.linkTarget", bt.navigation.linkTarget, ["host", "newTab"], l)
  };
}
function Yy(c, l) {
  return {
    mode: ti(c, "mode", "paths.mode", bt.paths.mode, ["all", "include", "exclude"], l),
    patterns: Dy(c, l)
  };
}
function Gy(c, l) {
  const a = zt(c, "fixed", l), r = zt(c, "relative", l);
  return a && r && l("fixed/relative: mutually exclusive (a proto oneof), using fixed"), a ? {
    fixed: {
      bottom: Je(a, "bottom", "fixed.bottom", 0, 0, 200, l),
      right: Je(a, "right", "fixed.right", 0, 0, 200, l)
    }
  } : r ? {
    relative: {
      parentElementClass: Ai(r, "parentElementClass", "relative.parentElementClass", "", wy, l)
    }
  } : {};
}
function er(c = []) {
  return { config: bt, warnings: c };
}
function Jm(c) {
  var _;
  if (c == null || !Pm(c) || Object.keys(c).length === 0)
    return er();
  let l = 0;
  try {
    l = ((_ = JSON.stringify(c)) == null ? void 0 : _.length) ?? 0;
  } catch {
    return er(["widget config: not serializable JSON, ignored"]);
  }
  if (l > um)
    return er([`widget config: longer than ${um} JSON characters, ignored`]);
  const a = [], r = (b) => {
    a.push(b);
  }, o = c.schemaVersion;
  if (o != null) {
    if (typeof o != "number" || !Number.isInteger(o) || o < _l)
      return er([
        `schemaVersion: expected an integer >= ${_l}, got ${pt(o)}`
      ]);
    o > _l && r(`schemaVersion: ${o} is newer than this bundle's ${_l}, parsing what is known`);
  }
  const f = ky(zt(c, "launcher", r), r), d = Gy(c, r);
  return d.fixed && (f.offsetY = d.fixed.bottom, f.offsetX = d.fixed.right, f.side = "right"), {
    config: {
      schemaVersion: _l,
      launcher: f,
      panel: Ny(zt(c, "panel", r), r),
      theme: By(zt(c, "theme", r), r),
      zIndex: Je(c, "zIndex", "zIndex", bt.zIndex, 0, 2147483647, r),
      collision: Ly(zt(c, "collision", r), r),
      mobile: Hy(zt(c, "mobile", r), r),
      behavior: jy(zt(c, "behavior", r), r),
      navigation: qy(zt(c, "navigation", r), r),
      paths: Yy(zt(c, "paths", r), r),
      position: d,
      bundleVersion: Ai(c, "bundleVersion", "bundleVersion", "", Ry, r)
    },
    warnings: a
  };
}
const Vy = ["launcher", "panel", "theme", "collision", "behavior", "navigation", "paths"];
function hm(...c) {
  return c.reduce((l, a) => {
    if (!a)
      return l;
    const r = { ...l, ...a };
    return Vy.forEach((o) => {
      const f = a[o];
      f && Object.assign(r, { [o]: { ...l[o], ...f } });
    }), a.mobile && (r.mobile = {
      ...l.mobile,
      ...a.mobile,
      launcher: { ...l.mobile.launcher, ...a.mobile.launcher },
      panel: { ...l.mobile.panel, ...a.mobile.panel }
    }), r;
  }, bt);
}
const Xy = 6e4, Qy = "cwc:wc:v2:", Zy = 5e3, Ky = 2e3, Py = "[connectly-webchat:config]", zc = /* @__PURE__ */ new Map(), dm = /* @__PURE__ */ new Set();
function Jy(c, l) {
  try {
    const a = window.sessionStorage.getItem(c);
    if (!a)
      return null;
    const r = Kc(a);
    if (!r || typeof r.at != "number")
      return null;
    const o = l() - r.at;
    return o < 0 || o >= Xy ? null : r.ui;
  } catch {
    return null;
  }
}
function Wm(c, l, a) {
  try {
    window.sessionStorage.setItem(c, JSON.stringify({ at: a(), ui: l }));
  } catch {
  }
}
function Im(c) {
  return c.widgetUi ?? c.widget_ui;
}
function Da() {
  return { config: bt, source: "default", warnings: [] };
}
function Wy(c) {
  return typeof c == "object" && c !== null && c.name === "AbortError";
}
function Iy(c) {
  const { rest: l, clientKey: a, flightKey: r, storageKey: o, signal: f, logger: d, now: _ } = c;
  if (dm.has(r))
    return;
  dm.add(r);
  const b = setTimeout(async () => {
    if (!(f != null && f.aborted))
      try {
        const g = await l.getWidgetConfig(a, f), T = Im(g);
        Wm(o, T, _), d.info("widget config recovered on retry; it will be used on the next mount");
      } catch {
      }
  }, Zy + Math.random() * Ky);
  f == null || f.addEventListener("abort", () => clearTimeout(b), { once: !0 });
}
function mm(c, l) {
  return l ? l.aborted ? Promise.resolve(Da()) : new Promise((a) => {
    const r = () => a(Da());
    l.addEventListener("abort", r, { once: !0 }), c.then((o) => {
      l.removeEventListener("abort", r), a(o);
    });
  }) : c;
}
async function $y(c) {
  const { rest: l, clientKey: a, storageKey: r, logger: o, now: f } = c;
  try {
    const d = await l.getWidgetConfig(a), _ = Im(d);
    Wm(r, _, f);
    const { config: b, warnings: g } = Jm(_);
    return g.forEach((T) => o.warn(`widget config: ${T}`)), { config: b, source: "server", warnings: g };
  } catch (d) {
    return Wy(d) ? Da() : d instanceof An && d.status >= 400 && d.status < 500 ? (o.error(`widget config refused with ${d.status}: check the webchat client key in the embed snippet (${d.errorCode ?? d.message}). Rendering the default appearance.`), Da()) : (o.warn(`widget config unavailable (${d instanceof Error ? d.message : String(d)}); using defaults`), Iy({ ...c, logger: o, now: f }), Da());
  }
}
function gm(c) {
  const { rest: l, clientKey: a, cacheKeyPrefix: r = Qy, signal: o, now: f = () => Date.now() } = c, d = c.logger ?? On(xi, Py), _ = `${r}${l.apiBaseUrl}|${a}`, b = Jy(_, f);
  if (b !== null) {
    const { config: P, warnings: W } = Jm(b);
    return Promise.resolve({ config: P, source: "cache", warnings: W });
  }
  const g = `${l.apiBaseUrl}|${a}`, T = zc.get(g);
  if (T)
    return mm(T, o);
  const V = $y({ rest: l, clientKey: a, flightKey: g, storageKey: _, signal: o, logger: d, now: f }).finally(() => {
    zc.delete(g);
  });
  return zc.set(g, V), mm(V, o);
}
const Fy = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
function gt(c) {
  return `${c}px`;
}
function ev(c, l) {
  const a = (b, g) => c.style.setProperty(b, g), { launcher: r, panel: o, theme: f, collision: d, mobile: _ } = l;
  a("--cwc-launcher-size", gt(r.size)), a("--cwc-launcher-offset-x", gt(r.offsetX)), a("--cwc-launcher-offset-y", gt(r.offsetY)), a("--cwc-launcher-radius", r.shape === "circle" ? "50%" : "999px"), a("--cwc-panel-width", gt(o.width)), a("--cwc-panel-height", gt(o.height)), a("--cwc-panel-radius", gt(o.radius)), a("--cwc-accent", f.accent), a("--cwc-accent-text", f.accentText), a("--cwc-surface", f.surface), a("--cwc-surface-alt", f.surfaceAlt), a("--cwc-text", f.text), a("--cwc-text-muted", f.textMuted), a("--cwc-border", f.border), a("--cwc-bubble-visitor", f.bubbleVisitor), a("--cwc-bubble-visitor-text", f.bubbleVisitorText), a("--cwc-bubble-agent", f.bubbleAgent), a("--cwc-bubble-agent-text", f.bubbleAgentText), a("--cwc-bubble-radius", gt(f.bubbleRadius)), a("--cwc-font-family", f.fontFamily || Fy), a("--cwc-z-index", String(l.zIndex)), a("--cwc-bottom-offset", gt(d.bottomOffsetPx)), a("--cwc-max-bottom-offset", gt(d.maxBottomOffsetPx)), a("--cwc-m-launcher-size", gt(_.launcher.size)), a("--cwc-m-launcher-offset-x", gt(_.launcher.offsetX)), a("--cwc-m-launcher-offset-y", gt(_.launcher.offsetY)), a("--cwc-m-panel-width", _.panel.fullscreen ? "100vw" : gt(_.panel.width || o.width)), a("--cwc-m-panel-height", _.panel.fullscreen ? "100dvh" : gt(_.panel.height || o.height)), a("--cwc-m-panel-radius", _.panel.fullscreen ? "0px" : gt(_.panel.radius)), c.dataset.cwcSide = r.side, c.dataset.cwcScheme = f.colorScheme;
}
function $m(c, l, a, r) {
  const o = `${l}=${a}`;
  c.warnedIgnoredValues.has(o) || (c.warnedIgnoredValues.add(o), On(Gc()).warn(`ignoring "${l}" value "${a}"; ${r}`));
}
function tv(c) {
  window.connectlyWebchatEmbedOrigin || (window.connectlyWebchatEmbedOrigin = {
    apiBaseUrl: c.apiBaseUrl,
    forced: c.forced,
    warnedIgnoredValues: /* @__PURE__ */ new Set()
  });
}
function nv(c) {
  const l = window.connectlyWebchatEmbedOrigin;
  return !l || !l.forced ? c ?? (l == null ? void 0 : l.apiBaseUrl) : (c !== void 0 && c !== l.apiBaseUrl && $m(l, "api-base-url", c, `this bundle is locked to "${l.apiBaseUrl}"`), l.apiBaseUrl);
}
function iv(c) {
  const l = window.connectlyWebchatEmbedOrigin;
  if (!l || !l.forced)
    return c;
  c !== void 0 && $m(l, "ws-url", c, "this bundle takes its realtime endpoint from the session mint");
}
const lv = 20, av = 1e3, Fm = {
  "font-family": "initial",
  "font-size": "initial",
  "font-style": "initial",
  "font-weight": "initial",
  "font-variant": "initial",
  "line-height": "initial",
  "letter-spacing": "initial",
  "word-spacing": "initial",
  color: "initial",
  "text-align": "initial",
  "text-transform": "initial",
  "text-indent": "initial",
  "text-decoration": "initial",
  "white-space": "initial",
  direction: "initial",
  "unicode-bidi": "initial",
  visibility: "visible",
  cursor: "auto",
  "list-style": "none",
  "-webkit-text-size-adjust": "100%",
  transform: "none",
  filter: "none",
  contain: "none",
  position: "static",
  display: "block",
  width: "0",
  height: "0",
  margin: "0",
  padding: "0",
  overflow: "visible",
  "pointer-events": "none"
};
function pm(c) {
  Object.entries(Fm).forEach(([l, a]) => {
    c.style.setProperty(l, a, "important");
  });
}
function sv(c) {
  const l = {};
  return Object.keys(Fm).forEach((a) => {
    l[a] = c.style.getPropertyValue(a);
  }), l;
}
function rv(c, l) {
  return Object.entries(l).every(([a, r]) => c.style.getPropertyValue(a) === r);
}
function uv(c, l) {
  pm(c);
  const a = sv(c);
  let r = 0, o = Date.now(), f = !1, d = !1, _ = null;
  const b = () => {
    if (d = !1, _ = null, rv(c, a))
      return;
    const T = Date.now();
    if (T - o >= av && (o = T, r = 0), r += 1, r > lv) {
      f || (f = !0, l.warn("host style keeps changing faster than it can be reset (>20/s); giving up on re-asserting the host reset for this element. Something on this page is repeatedly writing style onto the <connectly-webchat> element."));
      return;
    }
    pm(c);
  }, g = new MutationObserver(() => {
    d || (d = !0, _ = setTimeout(b, 0));
  });
  return g.observe(c, { attributes: !0, attributeFilter: ["style"] }), () => {
    g.disconnect(), _ !== null && (clearTimeout(_), _ = null);
  };
}
const bm = "http://www.w3.org/2000/svg";
function cv() {
  const c = document.createElementNS(bm, "svg");
  c.setAttribute("viewBox", "0 0 24 24"), c.setAttribute("aria-hidden", "true"), c.setAttribute("class", "cwc-launcher-icon"), c.setAttribute("fill", "none"), c.setAttribute("stroke-width", "2"), c.setAttribute("stroke-linecap", "round"), c.setAttribute("stroke-linejoin", "round");
  const l = document.createElementNS(bm, "path");
  return l.setAttribute("d", "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"), c.appendChild(l), c;
}
function ov(c, l) {
  c.replaceChildren();
  const { icon: a } = l.launcher;
  if (a.kind !== "none") {
    if (a.kind === "url" && a.url) {
      const r = document.createElement("img");
      r.src = a.url, r.alt = "", r.className = "cwc-launcher-icon", c.appendChild(r);
      return;
    }
    c.appendChild(cv());
  }
}
function fv(c, l) {
  const a = c.querySelector(".cwc-launcher-label"), { label: r, shape: o } = l.launcher, f = o === "pill" && !!r;
  if (c.classList.toggle("cwc-launcher--pill", f), !f) {
    a == null || a.remove();
    return;
  }
  const d = a ?? document.createElement("span");
  d.className = "cwc-launcher-label", d.textContent = r, a || c.appendChild(d);
}
function hv(c, l) {
  const { onActivate: a, getConfig: r, logger: o } = l, f = document.createElement("button");
  f.type = "button", f.className = "cwc-launcher", f.setAttribute("aria-haspopup", "dialog"), f.setAttribute("aria-expanded", "false");
  const d = () => {
    try {
      a();
    } catch (T) {
      o.error("launcher activation handler threw", T);
    }
  };
  f.addEventListener("click", d);
  const _ = (T) => {
    ov(f, T), fv(f, T), f.setAttribute("aria-label", T.launcher.ariaLabel || bt.launcher.ariaLabel);
  };
  _(r());
  const b = (T, V) => {
    _(T), V && V.open !== void 0 && f.setAttribute("aria-expanded", String(V.open));
  }, g = () => {
    f.removeEventListener("click", d), f.remove();
  };
  return c.appendChild(f), { el: f, update: b, destroy: g };
}
let Uc = null;
function dv() {
  return Uc ?? (Uc = Promise.resolve().then(() => Lv)), Uc;
}
const eg = "2026.2.0";
function tg() {
  return window.connectlyWebchatRegistry || (window.connectlyWebchatRegistry = {
    elements: /* @__PURE__ */ new Set(),
    pendingAutoMount: !1,
    version: eg
  }), window.connectlyWebchatRegistry;
}
function mv(c) {
  tg().elements.add(c);
}
function gv(c) {
  tg().elements.delete(c);
}
const ng = `
:host {
  /* Resets the host's box back to the UA default — no inherited display, size,
     spacing or typography from whatever the merchant's page rules matched
     against the element's tag name. "all: initial" does NOT reset custom
     properties, though: they are explicitly excluded from the CSS-wide keyword
     reset (they inherit through everything, by design), so every --cwc-*
     variable set by a caller before this element upgrades is still visible to
     the rules below. Display is set again right after because "all: initial"
     resets display to its initial value, "inline", which is not what a
     positioned, block-level widget host wants. */
  all: initial;
  display: block;
}

/* ---------------------------------------------------------------------------
 * Defaults for every --cwc-* custom property this stylesheet reads.
 *
 * Kept here, not only in applyCssVars.ts, so this sheet is self-sufficient: a
 * host element that has not run applyCssVars yet (the element is upgraded but
 * the config fetch has not settled) still renders a fully-styled launcher from
 * these var() fallbacks-of-fallbacks, rather than an unstyled flash.
 * ------------------------------------------------------------------------- */
:host {
  --cwc-launcher-size: 56px;
  --cwc-launcher-offset-x: 20px;
  --cwc-launcher-offset-y: 20px;
  --cwc-launcher-radius: 50%;
  --cwc-panel-width: 380px;
  --cwc-panel-height: 600px;
  --cwc-panel-radius: 16px;
  --cwc-accent: #2563eb;
  --cwc-accent-text: #ffffff;
  --cwc-surface: #ffffff;
  --cwc-surface-alt: #f5f5f5;
  --cwc-text: #111111;
  --cwc-text-muted: #6b7280;
  --cwc-border: #e2e2e2;
  --cwc-bubble-visitor: #2563eb;
  --cwc-bubble-visitor-text: #ffffff;
  --cwc-bubble-agent: #f1f1f1;
  --cwc-bubble-agent-text: #111111;
  --cwc-bubble-radius: 12px;
  --cwc-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --cwc-z-index: 2147483000;
  --cwc-bottom-offset: 0px;
  --cwc-max-bottom-offset: 240px;
  --cwc-m-launcher-size: 52px;
  --cwc-m-launcher-offset-x: 12px;
  --cwc-m-launcher-offset-y: 12px;
  --cwc-m-panel-width: 100vw;
  --cwc-m-panel-height: 100dvh;
  --cwc-m-panel-radius: 0px;
}

/* No @font-face here: a rule declared inside a shadow root's stylesheet is
   scoped to that tree for style RESOLUTION but @font-face is a document-level
   resource registration — the spec has the UA ignore @font-face rules found
   while parsing a shadow tree's stylesheet entirely. A custom fontFamily is
   therefore always a face the HOST page (or the OS) already provides; see
   WidgetUiTheme.fontFamily in config/schema.ts. */

.cwc-launcher {
  position: fixed;
  /* Three additive terms, each owned by a different layer, which is why this is a
     calc() and not one resolved number: the configured offset (applyCssVars, from
     widget_ui), the collision lift measured against the merchant's own sticky
     elements (the collision observer, a later commit), and the on-screen-keyboard
     lift for mobile Safari/Chrome. The latter two carry their own 0px fallbacks so
     this rule is correct before either observer has ever run — an undefined var()
     in a calc() invalidates the whole declaration at computed-value time, which
     would drop the launcher to the viewport's bottom edge rather than degrade. */
  bottom: calc(var(--cwc-launcher-offset-y) + var(--cwc-bottom-offset, 0px) + var(--cwc-kb-offset, 0px));
  z-index: var(--cwc-z-index);
  width: var(--cwc-launcher-size);
  height: var(--cwc-launcher-size);
  border-radius: var(--cwc-launcher-radius);
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--cwc-accent);
  color: var(--cwc-accent-text);
  font-family: var(--cwc-font-family);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  /* Fixed positioning takes the launcher out of any layout this host
     participates in, so pointer-events must be reasserted explicitly rather
     than relying on an ancestor's value — "all: initial" above already reset
     the host's own pointer-events to its initial "auto", but a merchant
     stylesheet's "* { pointer-events: none }" could still reach a plain host
     rule; it cannot reach into the shadow tree at all, which is the point of
     setting it here rather than depending on inheritance. */
  pointer-events: auto;
  /* --cwc-config-transition is 0s unless the element set it, which it does only when
     the config fetch LOST the 400ms race and the launcher already painted with
     defaults (see #renderWithConfig). Transitioning the placement properties then
     turns a jarring jump into a short slide; on the fast path there is nothing to
     transition from, so the default 0s keeps first paint immediate. */
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    bottom var(--cwc-config-transition, 0s) ease,
    left var(--cwc-config-transition, 0s) ease,
    right var(--cwc-config-transition, 0s) ease,
    width var(--cwc-config-transition, 0s) ease,
    height var(--cwc-config-transition, 0s) ease,
    background var(--cwc-config-transition, 0s) ease;
}

.cwc-launcher:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.24);
}

.cwc-launcher:focus-visible {
  outline: 2px solid var(--cwc-accent-text);
  outline-offset: 2px;
}

.cwc-launcher:active {
  transform: scale(0.97);
}

/* The one thing inline styles fundamentally cannot express, which is a large part of
   why this stylesheet exists at all: a media query and the pseudo-classes above have
   no inline equivalent, so a launcher styled purely from element.style could not honor
   a visitor's reduced-motion preference or show a focus ring. */
@media (prefers-reduced-motion: reduce) {
  .cwc-launcher {
    transition: none;
  }
  .cwc-launcher:hover,
  .cwc-launcher:active {
    transform: none;
  }
}

.cwc-launcher-icon {
  width: 60%;
  height: 60%;
  display: block;
  fill: none;
  stroke: currentColor;
  pointer-events: none;
}

/* A pill launcher (icon + label) must grow along its main axis so the label sits on ONE
   line beside the icon. Without this it inherits the circle's fixed width == launcher-size
   and the text wraps inside the circle (three stacked words). Height stays the launcher
   size, so a pill is as tall as a circle and only as wide as its label needs — the shape
   applyCssVars already promises via the launcher radius. The cwc-launcher--pill class is
   toggled in launcher.ts renderLabel (not a :has() selector — :has() is above this SDK's
   browser floor, see vite.config.ts), so these rules leave the plain circle untouched.
   box-sizing so the horizontal padding counts toward min-width rather than adding to it. */
.cwc-launcher--pill {
  width: auto;
  min-width: var(--cwc-launcher-size);
  padding: 0 20px;
  box-sizing: border-box;
}

.cwc-launcher-label {
  white-space: nowrap;
  line-height: 1;
}

/* The icon is a percentage of the launcher box; on a pill that box is label-width, so pin
   the icon to the launcher HEIGHT and let aspect-ratio hold it square — a bare width:auto
   on a viewBox-only <svg> is sized unreliably by older engines. Kept close to the circle's
   own 60% so the mark reads at the same weight whether the launcher is a circle or a pill. */
.cwc-launcher--pill .cwc-launcher-icon {
  width: auto;
  height: 55%;
  aspect-ratio: 1;
}

:host([data-cwc-side='left']) .cwc-launcher {
  left: var(--cwc-launcher-offset-x);
  right: auto;
}

:host(:not([data-cwc-side='left'])) .cwc-launcher {
  right: var(--cwc-launcher-offset-x);
  left: auto;
}

.cwc-panel {
  position: fixed;
  z-index: var(--cwc-z-index);
  /* The host is pointer-events:none (hostReset), and that inherits into the shadow tree. Like
     the launcher, the panel must re-assert auto — otherwise every click inside it (the close
     button, the composer, quick replies) is swallowed and the open panel is inert. */
  pointer-events: auto;
  width: var(--cwc-panel-width);
  /* 100vh is listed FIRST, not as the fallback var()-style — this is a plain
     CSS cascade fallback, and an engine that does not understand the dvh unit
     on "height" simply never parses the second declaration, keeping the vh one
     in effect. On an engine that understands both, the later declaration
     (dvh) wins, which is what avoids the mobile "URL bar retracts, height
     is now wrong" problem noted on --cwc-m-panel-height in applyCssVars.ts. */
  height: min(var(--cwc-panel-height), 100vh);
  height: min(var(--cwc-panel-height), 100dvh);
  border-radius: var(--cwc-panel-radius);
  overflow: hidden;
  background: var(--cwc-surface);
  color: var(--cwc-text);
  font-family: var(--cwc-font-family);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
  bottom: calc(
    var(--cwc-launcher-offset-y) + var(--cwc-launcher-size) + 12px + var(--cwc-bottom-offset, 0px) +
      var(--cwc-kb-offset, 0px)
  );
}

:host([data-cwc-side='left']) .cwc-panel {
  left: var(--cwc-launcher-offset-x);
  right: auto;
}

:host(:not([data-cwc-side='left'])) .cwc-panel {
  right: var(--cwc-launcher-offset-x);
  left: auto;
}

.cwc-panel__header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 8px 10px 14px;
  box-sizing: border-box;
  background: var(--cwc-accent);
  color: var(--cwc-accent-text);
}

.cwc-panel__titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cwc-panel__title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cwc-panel__subtitle {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  opacity: 0.85;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cwc-panel__close {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.cwc-panel__close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.cwc-panel__close:focus-visible {
  outline: 2px solid var(--cwc-accent-text);
  outline-offset: 1px;
}

.cwc-panel__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* The transcript wrapper that carries the session-recorder masking attributes (see
   mountPanel.tsx). It must be a flex column that can shrink, or WebchatWidget's own
   internal scroller has no bounded height to scroll within. */
.cwc-panel__transcript {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* The container the element creates for the React root. "display: contents" keeps it
   out of the layout entirely so the panel it holds is laid out as though it were a
   direct child of the shadow root — the wrapper exists only as a React mount target
   and a hide/show handle, and should not introduce a box of its own. */
.cwc-panel-host {
  display: contents;
}

/* "hidden" is how close() hides the panel while keeping it mounted (see
   #applyOpenState). An explicit rule is required because "display: contents" above
   would otherwise beat the UA's "[hidden] { display: none }", leaving a "closed"
   panel fully visible. !important so it also wins over the contents rule regardless
   of source order. */
.cwc-panel-host[hidden] {
  display: none !important;
}

/* ---------------------------------------------------------------------------
 * Mobile is a data attribute the element sets from a matchMedia listener (see
 * ConnectlyWebchatElement#connectedCallback), NOT an @media breakpoint here.
 * The breakpoint itself (mobile.breakpointPx) is server-driven and per-business,
 * so it cannot be baked into a static media query — only JS reading the parsed
 * config knows where the line is.
 * ------------------------------------------------------------------------- */
:host([data-cwc-viewport='mobile']) .cwc-launcher {
  width: var(--cwc-m-launcher-size);
  height: var(--cwc-m-launcher-size);
  /* Same three additive terms as the desktop rule above, and for the same reason: mobile
     is the ONE viewport that actually has an on-screen keyboard, so omitting
     --cwc-kb-offset here would drop the keyboard lift on the one rule that needs it
     most, and omitting the 0px fallbacks would invalidate the whole calc() (dropping
     the launcher to the viewport's bottom edge) before either observer has ever run. */
  bottom: calc(var(--cwc-m-launcher-offset-y) + var(--cwc-bottom-offset, 0px) + var(--cwc-kb-offset, 0px));
}

/* Same pill-grows-wide rule for mobile: the mobile launcher rule above re-pins width to the
   mobile size and is more specific than the desktop pill rule, so restate width:auto here.
   Same specificity as that mobile base rule and it comes later, so it wins. (padding and
   box-sizing carry over from the .cwc-launcher--pill rule, which also matches on mobile.) */
:host([data-cwc-viewport='mobile']) .cwc-launcher--pill {
  width: auto;
  min-width: var(--cwc-m-launcher-size);
}

:host([data-cwc-viewport='mobile'][data-cwc-side='left']) .cwc-launcher {
  left: var(--cwc-m-launcher-offset-x);
}

:host([data-cwc-viewport='mobile']:not([data-cwc-side='left'])) .cwc-launcher {
  right: var(--cwc-m-launcher-offset-x);
}

:host([data-cwc-viewport='mobile']) .cwc-panel {
  width: var(--cwc-m-panel-width);
  height: var(--cwc-m-panel-height);
  border-radius: var(--cwc-m-panel-radius);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
}
`;
function pv() {
  return typeof CSSStyleSheet == "function" && "replaceSync" in CSSStyleSheet.prototype && typeof ShadowRoot < "u" && "adoptedStyleSheets" in ShadowRoot.prototype;
}
let tr = null;
function bv() {
  return tr || (tr = new CSSStyleSheet(), tr.replaceSync(ng)), tr;
}
function _v(c) {
  if (pv())
    try {
      return c.adoptedStyleSheets = [...c.adoptedStyleSheets, bv()], "adopted";
    } catch {
    }
  const l = document.createElement("style");
  return l.textContent = ng, c.appendChild(l), "style-element";
}
var U = function(c, l, a, r) {
  if (a === "a" && !r) throw new TypeError("Private accessor was defined without a getter");
  if (typeof l == "function" ? c !== l || !r : !l.has(c)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return a === "m" ? r : a === "a" ? r.call(c) : r ? r.value : l.get(c);
}, _e = function(c, l, a, r, o) {
  if (r === "m") throw new TypeError("Private method is not writable");
  if (r === "a" && !o) throw new TypeError("Private accessor was defined without a setter");
  if (typeof l == "function" ? c !== l || !o : !l.has(c)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? o.call(c, a) : o ? o.value = a : l.set(c, a), a;
}, fe, $t, Et, Jt, Ei, Wt, ei, za, yl, wi, vl, Sl, En, wn, ir, Tl, Tn, Ft, kc, xa, Nc, Xc, _m, Ra, ig, ym, Bc, Qc, vm, lr, Vt, lg, ag;
const ka = "connectly-webchat", yv = "connectly-webchat:", vv = 400, Sv = 150, Tv = [
  "transform",
  "filter",
  "backdrop-filter",
  "perspective",
  "will-change",
  "contain",
  "container-type"
], Ev = [
  "client-key",
  "api-base-url",
  "ws-url",
  "title",
  "open",
  "side",
  "width",
  "height",
  "offset-x",
  "offset-y",
  "z-index",
  "bottom-offset-px",
  "log-level",
  "auto-mount"
];
function Sm(c) {
  return Tv.find((l) => {
    const a = c.getPropertyValue(l);
    return a && a !== "none" && a !== "normal" && a !== "auto";
  });
}
function pl(c, l) {
  const a = c.getAttribute(l);
  if (a === null || a.trim() === "")
    return;
  const r = Number(a);
  return Number.isFinite(r) ? r : void 0;
}
function wv(c) {
  return new Promise((l) => {
    setTimeout(l, c);
  });
}
class Rv extends HTMLElement {
  constructor() {
    super(...arguments), fe.add(this), $t.set(this, null), Et.set(this, On(Gc())), Jt.set(this, null), Ei.set(this, null), Wt.set(this, null), ei.set(this, null), za.set(this, null), yl.set(this, null), wi.set(this, null), vl.set(this, null), Sl.set(this, !1), En.set(this, !1), wn.set(this, 0), ir.set(this, !1), Tl.set(this, void 0), Tn.set(this, bt), Ft.set(this, !1);
  }
  static get observedAttributes() {
    return Ev;
  }
  get clientKey() {
    return this.getAttribute("client-key") ?? "";
  }
  set clientKey(l) {
    this.setAttribute("client-key", l);
  }
  get apiBaseUrl() {
    return this.getAttribute("api-base-url") ?? void 0;
  }
  set apiBaseUrl(l) {
    l === void 0 ? this.removeAttribute("api-base-url") : this.setAttribute("api-base-url", l);
  }
  get wsUrl() {
    return this.getAttribute("ws-url") ?? void 0;
  }
  set wsUrl(l) {
    l === void 0 ? this.removeAttribute("ws-url") : this.setAttribute("ws-url", l);
  }
  get title() {
    return this.getAttribute("title") ?? "";
  }
  set title(l) {
    this.setAttribute("title", l);
  }
  get logLevel() {
    const l = this.getAttribute("log-level");
    return l && Mb(l) ? l : Gc();
  }
  set logLevel(l) {
    this.setAttribute("log-level", l);
  }
  get open() {
    return this.hasAttribute("open");
  }
  set open(l) {
    l ? this.setAttribute("open", "") : this.removeAttribute("open");
  }
  connectedCallback() {
    if (U(this, Sl, "f"))
      return;
    if (this.parentElement === null)
      U(this, Et, "f").debug(`<${ka}> has no light-DOM parent (a shadow root or a document); leaving it in place, so a fixed-position-breaking ancestor of its host cannot be detected from here.`);
    else if (U(this, fe, "m", lg).call(this) && this.parentElement !== document.body && document.body) {
      U(this, Et, "f").warn(`<${ka}> has a transformed or CSS-contained ancestor, which would become the containing block for the launcher's fixed positioning. Re-parenting it to <body>.`), _e(this, Sl, !0, "f");
      try {
        document.body.appendChild(this);
      } finally {
        _e(this, Sl, !1, "f");
      }
    }
    if (U(this, En, "f"))
      return;
    _e(this, En, !0, "f"), _e(this, wn, U(this, wn, "f") + 1, "f"), _e(this, Et, On(this.logLevel), "f"), mv(this), U(this, fe, "m", ag).call(this), _e(this, $t, this.shadowRoot ?? this.attachShadow({ mode: "open" }), "f"), _e(this, za, uv(this, U(this, Et, "f")), "f");
    const l = U(this, ir, "f") ? null : _v(U(this, $t, "f"));
    _e(this, ir, !0, "f"), l === "style-element" && (this.dataset.cwcSheet = l), this.hasAttribute("aria-label") || this.setAttribute("aria-label", U(this, fe, "m", xa).call(this).launcher.ariaLabel), U(this, fe, "m", Xc).call(this), this.open && U(this, fe, "m", Qc).call(this, !0);
  }
  disconnectedCallback() {
    U(this, Sl, "f") || !U(this, En, "f") || U(this, fe, "m", lr).call(this);
  }
  attributeChangedCallback(l, a, r) {
    if (!(a === r || !U(this, En, "f"))) {
      if (l === "client-key") {
        U(this, Et, "f").warn(`client-key changed from ${a ?? "(unset)"} to ${r ?? "(unset)"}; re-initializing`), U(this, fe, "m", lr).call(this), this.connectedCallback();
        return;
      }
      if (l === "log-level") {
        _e(this, Et, On(this.logLevel), "f");
        return;
      }
      if (l === "open") {
        U(this, fe, "m", Qc).call(this, this.open);
        return;
      }
      U(this, fe, "m", ig).call(this);
    }
  }
  openPanel() {
    this.open = !0;
  }
  closePanel() {
    this.open = !1;
  }
  toggle() {
    this.open = !this.open;
  }
  reload() {
    U(this, En, "f") && U(this, fe, "m", Xc).call(this);
  }
  destroy() {
    const l = U(this, Ft, "f");
    U(this, fe, "m", lr).call(this), l && U(this, fe, "m", Vt).call(this, "close", {}), this.remove();
  }
  get isOpen() {
    return U(this, Ft, "f");
  }
  get resolvedConfig() {
    return U(this, Tn, "f");
  }
}
$t = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), Ei = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap(), za = /* @__PURE__ */ new WeakMap(), yl = /* @__PURE__ */ new WeakMap(), wi = /* @__PURE__ */ new WeakMap(), vl = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap(), En = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ new WeakMap(), ir = /* @__PURE__ */ new WeakMap(), Tl = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakSet(), kc = function() {
  return nv(this.apiBaseUrl) ?? Mm;
}, xa = function() {
  return hm(U(this, Tl, "f"), U(this, fe, "m", Nc).call(this), this.config);
}, Nc = function() {
  const l = {}, a = this.getAttribute("side"), r = pl(this, "offset-x"), o = pl(this, "offset-y");
  (a === "left" || a === "right" || r !== void 0 || o !== void 0) && (l.launcher = {
    ...a === "left" || a === "right" ? { side: a } : {},
    ...r !== void 0 ? { offsetX: r } : {},
    ...o !== void 0 ? { offsetY: o } : {}
  });
  const f = pl(this, "width"), d = pl(this, "height"), _ = this.getAttribute("title");
  (f !== void 0 || d !== void 0 || _) && (l.panel = {
    ...f !== void 0 ? { width: f } : {},
    ...d !== void 0 ? { height: d } : {},
    ..._ ? { title: _ } : {}
  });
  const b = pl(this, "z-index");
  b !== void 0 && (l.zIndex = b);
  const g = pl(this, "bottom-offset-px");
  return g !== void 0 && (l.collision = { bottomOffsetPx: g }), l;
}, Xc = async function() {
  var f;
  const { clientKey: l } = this;
  if (!l) {
    U(this, Et, "f").warn(`<${ka}> has no client-key; waiting for one before rendering`);
    return;
  }
  (f = U(this, yl, "f")) == null || f.abort();
  const a = new AbortController();
  _e(this, yl, a, "f");
  const r = new Cm({
    apiBaseUrl: U(this, fe, "m", kc).call(this),
    logger: U(this, Et, "f")
  });
  let o;
  try {
    o = await Promise.race([
      gm({ rest: r, clientKey: l, signal: a.signal, logger: U(this, Et, "f") }),
      wv(vv).then(() => "timeout")
    ]);
  } catch (d) {
    U(this, fe, "m", Vt).call(this, "error", { stage: "config", error: d }), o = "timeout";
  }
  if (!(a.signal.aborted || !U(this, $t, "f"))) {
    if (o === "timeout") {
      U(this, fe, "m", Ra).call(this, hm(void 0, U(this, fe, "m", Nc).call(this), this.config), "default", {
        transition: !0
      }), U(this, fe, "m", _m).call(this, r, l, a);
      return;
    }
    _e(this, Tl, o.config, "f"), o.warnings.length > 0 && U(this, fe, "m", Vt).call(this, "config-warning", { warnings: o.warnings }), U(this, fe, "m", Ra).call(this, U(this, fe, "m", xa).call(this), o.source, { transition: !1 });
  }
}, _m = async function(l, a, r) {
  try {
    const o = await gm({ rest: l, clientKey: a, signal: r.signal, logger: U(this, Et, "f") });
    if (r.signal.aborted || !U(this, $t, "f"))
      return;
    _e(this, Tl, o.config, "f"), o.warnings.length > 0 && U(this, fe, "m", Vt).call(this, "config-warning", { warnings: o.warnings }), U(this, fe, "m", Ra).call(this, U(this, fe, "m", xa).call(this), o.source, { transition: !0 });
  } catch (o) {
    U(this, fe, "m", Vt).call(this, "error", { stage: "config", error: o });
  }
}, Ra = function(l, a, r) {
  var o;
  U(this, $t, "f") && (_e(this, Tn, l, "f"), ev(this, l), U(this, fe, "m", ym).call(this, l), r.transition && this.style.setProperty("--cwc-config-transition", `${Sv}ms`), U(this, Jt, "f") ? U(this, Jt, "f").update(l, { open: U(this, Ft, "f") }) : (_e(this, Jt, hv(U(this, $t, "f"), {
    onActivate: () => this.toggle(),
    getConfig: () => U(this, Tn, "f"),
    logger: U(this, Et, "f")
  }), "f"), U(this, fe, "m", Vt).call(this, "ready", { configSource: a, version: eg })), (o = U(this, Ei, "f")) == null || o.setProps({ config: l }));
}, ig = function() {
  !U(this, En, "f") || !U(this, Jt, "f") || U(this, fe, "m", Ra).call(this, U(this, fe, "m", xa).call(this), "server", { transition: !0 });
}, ym = function(l) {
  var d, _;
  const a = `(max-width: ${l.mobile.breakpointPx}px)`;
  if (((d = U(this, wi, "f")) == null ? void 0 : d.media) === a)
    return;
  if (U(this, fe, "m", Bc).call(this), typeof window.matchMedia != "function") {
    this.dataset.cwcViewport = "desktop";
    return;
  }
  const r = window.matchMedia(a), o = (b) => {
    this.dataset.cwcViewport = b ? "mobile" : "desktop";
  };
  o(r.matches);
  const f = (b) => o(b.matches);
  (_ = r.addEventListener) == null || _.call(r, "change", f), _e(this, wi, r, "f"), _e(this, vl, f, "f");
}, Bc = function() {
  var l, a;
  U(this, wi, "f") && U(this, vl, "f") && ((a = (l = U(this, wi, "f")).removeEventListener) == null || a.call(l, "change", U(this, vl, "f"))), _e(this, wi, null, "f"), _e(this, vl, null, "f");
}, Qc = async function(l) {
  var a;
  if (l !== U(this, Ft, "f")) {
    if (_e(this, Ft, l, "f"), (a = U(this, Jt, "f")) == null || a.update(U(this, Tn, "f"), { open: l }), !l) {
      U(this, Wt, "f") && (U(this, Wt, "f").hidden = !0), U(this, fe, "m", Vt).call(this, "close", {});
      return;
    }
    if (U(this, Wt, "f")) {
      U(this, Wt, "f").hidden = !1, U(this, fe, "m", Vt).call(this, "open", {});
      return;
    }
    if (!U(this, ei, "f")) {
      const r = U(this, fe, "m", vm).call(this).finally(() => {
        U(this, ei, "f") === r && _e(this, ei, null, "f");
      });
      _e(this, ei, r, "f");
    }
    await U(this, ei, "f");
  }
}, vm = async function() {
  var r, o, f;
  if (!U(this, $t, "f"))
    return;
  const l = U(this, wn, "f");
  let a;
  try {
    a = await dv();
  } catch (d) {
    if (l !== U(this, wn, "f"))
      return;
    _e(this, Ft, !1, "f"), this.open = !1, (r = U(this, Jt, "f")) == null || r.update(U(this, Tn, "f"), { open: !1 }), U(this, fe, "m", Vt).call(this, "error", { stage: "panel-load", error: d });
    return;
  }
  if (!(l !== U(this, wn, "f") || !U(this, $t, "f") || !U(this, Ft, "f")))
    try {
      const d = document.createElement("div");
      d.className = "cwc-panel-host", U(this, $t, "f").appendChild(d), _e(this, Wt, d, "f"), _e(this, Ei, a.mountPanel({
        container: d,
        config: U(this, Tn, "f"),
        clientKey: this.clientKey,
        apiBaseUrl: U(this, fe, "m", kc).call(this),
        wsUrl: iv(this.wsUrl),
        labels: this.labels,
        logLevel: this.logLevel,
        onClose: () => this.closePanel()
      }), "f"), U(this, fe, "m", Vt).call(this, "open", {});
    } catch (d) {
      (o = U(this, Wt, "f")) == null || o.remove(), _e(this, Wt, null, "f"), _e(this, Ei, null, "f"), _e(this, Ft, !1, "f"), this.open = !1, (f = U(this, Jt, "f")) == null || f.update(U(this, Tn, "f"), { open: !1 }), U(this, fe, "m", Vt).call(this, "error", { stage: "panel-mount", error: d });
    }
}, lr = function() {
  var l, a, r, o, f;
  (l = U(this, yl, "f")) == null || l.abort(), _e(this, yl, null, "f"), U(this, fe, "m", Bc).call(this), (a = U(this, za, "f")) == null || a.call(this), _e(this, za, null, "f"), (r = U(this, Ei, "f")) == null || r.unmount(), _e(this, Ei, null, "f"), (o = U(this, Wt, "f")) == null || o.remove(), _e(this, Wt, null, "f"), (f = U(this, Jt, "f")) == null || f.destroy(), _e(this, Jt, null, "f"), _e(this, ei, null, "f"), _e(this, Ft, !1, "f"), _e(this, Tl, void 0, "f"), _e(this, En, !1, "f"), _e(this, wn, U(this, wn, "f") + 1, "f"), this.hasAttribute("open") && this.removeAttribute("open"), gv(this);
}, Vt = function(l, a) {
  this.dispatchEvent(new CustomEvent(`${yv}${l}`, {
    detail: a,
    bubbles: !0,
    composed: !0
  }));
}, lg = function() {
  if (typeof getComputedStyle != "function")
    return !1;
  let l = this.parentElement;
  for (; l && l !== document.body; ) {
    if (Sm(getComputedStyle(l)) !== void 0)
      return !0;
    l = l.parentElement;
  }
  return !1;
}, ag = function() {
  if (typeof getComputedStyle != "function" || !document.body)
    return;
  const l = getComputedStyle(document.body), a = Sm(l);
  a && U(this, Et, "f").warn(`<body> has "${a}: ${l.getPropertyValue(a)}", which makes it the containing block for fixed-position elements. The launcher will be positioned relative to <body> rather than the viewport, so it may appear offset or scroll with the page. This cannot be corrected from inside the widget.`);
};
function Av() {
  typeof customElements > "u" || customElements.get(ka) || customElements.define(ka, Rv);
}
typeof window < "u" && (tv({
  apiBaseUrl: "https://api.connectly.ai",
  forced: !0
}), Av());
var Lc = { exports: {} }, Aa = {}, Hc = { exports: {} }, jc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tm;
function xv() {
  return Tm || (Tm = 1, (function(c) {
    function l(O, H) {
      var I = O.length;
      O.push(H);
      e: for (; 0 < I; ) {
        var Ee = I - 1 >>> 1, y = O[Ee];
        if (0 < o(y, H))
          O[Ee] = H, O[I] = y, I = Ee;
        else break e;
      }
    }
    function a(O) {
      return O.length === 0 ? null : O[0];
    }
    function r(O) {
      if (O.length === 0) return null;
      var H = O[0], I = O.pop();
      if (I !== H) {
        O[0] = I;
        e: for (var Ee = 0, y = O.length, k = y >>> 1; Ee < k; ) {
          var j = 2 * (Ee + 1) - 1, L = O[j], $ = j + 1, ve = O[$];
          if (0 > o(L, I))
            $ < y && 0 > o(ve, L) ? (O[Ee] = ve, O[$] = I, Ee = $) : (O[Ee] = L, O[j] = I, Ee = j);
          else if ($ < y && 0 > o(ve, I))
            O[Ee] = ve, O[$] = I, Ee = $;
          else break e;
        }
      }
      return H;
    }
    function o(O, H) {
      var I = O.sortIndex - H.sortIndex;
      return I !== 0 ? I : O.id - H.id;
    }
    if (c.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      c.unstable_now = function() {
        return f.now();
      };
    } else {
      var d = Date, _ = d.now();
      c.unstable_now = function() {
        return d.now() - _;
      };
    }
    var b = [], g = [], T = 1, V = null, P = 3, W = !1, F = !1, ce = !1, se = !1, qe = typeof setTimeout == "function" ? setTimeout : null, lt = typeof clearTimeout == "function" ? clearTimeout : null, me = typeof setImmediate < "u" ? setImmediate : null;
    function N(O) {
      for (var H = a(g); H !== null; ) {
        if (H.callback === null) r(g);
        else if (H.startTime <= O)
          r(g), H.sortIndex = H.expirationTime, l(b, H);
        else break;
        H = a(g);
      }
    }
    function x(O) {
      if (ce = !1, N(O), !F)
        if (a(b) !== null)
          F = !0, B || (B = !0, Be());
        else {
          var H = a(g);
          H !== null && Qe(x, H.startTime - O);
        }
    }
    var B = !1, q = -1, Z = 5, ue = -1;
    function ie() {
      return se ? !0 : !(c.unstable_now() - ue < Z);
    }
    function ke() {
      if (se = !1, B) {
        var O = c.unstable_now();
        ue = O;
        var H = !0;
        try {
          e: {
            F = !1, ce && (ce = !1, lt(q), q = -1), W = !0;
            var I = P;
            try {
              t: {
                for (N(O), V = a(b); V !== null && !(V.expirationTime > O && ie()); ) {
                  var Ee = V.callback;
                  if (typeof Ee == "function") {
                    V.callback = null, P = V.priorityLevel;
                    var y = Ee(
                      V.expirationTime <= O
                    );
                    if (O = c.unstable_now(), typeof y == "function") {
                      V.callback = y, N(O), H = !0;
                      break t;
                    }
                    V === a(b) && r(b), N(O);
                  } else r(b);
                  V = a(b);
                }
                if (V !== null) H = !0;
                else {
                  var k = a(g);
                  k !== null && Qe(
                    x,
                    k.startTime - O
                  ), H = !1;
                }
              }
              break e;
            } finally {
              V = null, P = I, W = !1;
            }
            H = void 0;
          }
        } finally {
          H ? Be() : B = !1;
        }
      }
    }
    var Be;
    if (typeof me == "function")
      Be = function() {
        me(ke);
      };
    else if (typeof MessageChannel < "u") {
      var $e = new MessageChannel(), ut = $e.port2;
      $e.port1.onmessage = ke, Be = function() {
        ut.postMessage(null);
      };
    } else
      Be = function() {
        qe(ke, 0);
      };
    function Qe(O, H) {
      q = qe(function() {
        O(c.unstable_now());
      }, H);
    }
    c.unstable_IdlePriority = 5, c.unstable_ImmediatePriority = 1, c.unstable_LowPriority = 4, c.unstable_NormalPriority = 3, c.unstable_Profiling = null, c.unstable_UserBlockingPriority = 2, c.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, c.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Z = 0 < O ? Math.floor(1e3 / O) : 5;
    }, c.unstable_getCurrentPriorityLevel = function() {
      return P;
    }, c.unstable_next = function(O) {
      switch (P) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = P;
      }
      var I = P;
      P = H;
      try {
        return O();
      } finally {
        P = I;
      }
    }, c.unstable_requestPaint = function() {
      se = !0;
    }, c.unstable_runWithPriority = function(O, H) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var I = P;
      P = O;
      try {
        return H();
      } finally {
        P = I;
      }
    }, c.unstable_scheduleCallback = function(O, H, I) {
      var Ee = c.unstable_now();
      switch (typeof I == "object" && I !== null ? (I = I.delay, I = typeof I == "number" && 0 < I ? Ee + I : Ee) : I = Ee, O) {
        case 1:
          var y = -1;
          break;
        case 2:
          y = 250;
          break;
        case 5:
          y = 1073741823;
          break;
        case 4:
          y = 1e4;
          break;
        default:
          y = 5e3;
      }
      return y = I + y, O = {
        id: T++,
        callback: H,
        priorityLevel: O,
        startTime: I,
        expirationTime: y,
        sortIndex: -1
      }, I > Ee ? (O.sortIndex = I, l(g, O), a(b) === null && O === a(g) && (ce ? (lt(q), q = -1) : ce = !0, Qe(x, I - Ee))) : (O.sortIndex = y, l(b, O), F || W || (F = !0, B || (B = !0, Be()))), O;
    }, c.unstable_shouldYield = ie, c.unstable_wrapCallback = function(O) {
      var H = P;
      return function() {
        var I = P;
        P = H;
        try {
          return O.apply(this, arguments);
        } finally {
          P = I;
        }
      };
    };
  })(jc)), jc;
}
var Em;
function Ov() {
  return Em || (Em = 1, Hc.exports = xv()), Hc.exports;
}
var qc = { exports: {} }, ft = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wm;
function Mv() {
  if (wm) return ft;
  wm = 1;
  var c = Jc();
  function l(b) {
    var g = "https://react.dev/errors/" + b;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var T = 2; T < arguments.length; T++)
        g += "&args[]=" + encodeURIComponent(arguments[T]);
    }
    return "Minified React error #" + b + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function a() {
  }
  var r = {
    d: {
      f: a,
      r: function() {
        throw Error(l(522));
      },
      D: a,
      C: a,
      L: a,
      m: a,
      X: a,
      S: a,
      M: a
    },
    p: 0,
    findDOMNode: null
  }, o = /* @__PURE__ */ Symbol.for("react.portal");
  function f(b, g, T) {
    var V = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: o,
      key: V == null ? null : "" + V,
      children: b,
      containerInfo: g,
      implementation: T
    };
  }
  var d = c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function _(b, g) {
    if (b === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, ft.createPortal = function(b, g) {
    var T = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(l(299));
    return f(b, g, null, T);
  }, ft.flushSync = function(b) {
    var g = d.T, T = r.p;
    try {
      if (d.T = null, r.p = 2, b) return b();
    } finally {
      d.T = g, r.p = T, r.d.f();
    }
  }, ft.preconnect = function(b, g) {
    typeof b == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, r.d.C(b, g));
  }, ft.prefetchDNS = function(b) {
    typeof b == "string" && r.d.D(b);
  }, ft.preinit = function(b, g) {
    if (typeof b == "string" && g && typeof g.as == "string") {
      var T = g.as, V = _(T, g.crossOrigin), P = typeof g.integrity == "string" ? g.integrity : void 0, W = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      T === "style" ? r.d.S(
        b,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: V,
          integrity: P,
          fetchPriority: W
        }
      ) : T === "script" && r.d.X(b, {
        crossOrigin: V,
        integrity: P,
        fetchPriority: W,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, ft.preinitModule = function(b, g) {
    if (typeof b == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var T = _(
            g.as,
            g.crossOrigin
          );
          r.d.M(b, {
            crossOrigin: T,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0
          });
        }
      } else g == null && r.d.M(b);
  }, ft.preload = function(b, g) {
    if (typeof b == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var T = g.as, V = _(T, g.crossOrigin);
      r.d.L(b, T, {
        crossOrigin: V,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, ft.preloadModule = function(b, g) {
    if (typeof b == "string")
      if (g) {
        var T = _(g.as, g.crossOrigin);
        r.d.m(b, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: T,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0
        });
      } else r.d.m(b);
  }, ft.requestFormReset = function(b) {
    r.d.r(b);
  }, ft.unstable_batchedUpdates = function(b, g) {
    return b(g);
  }, ft.useFormState = function(b, g, T) {
    return d.H.useFormState(b, g, T);
  }, ft.useFormStatus = function() {
    return d.H.useHostTransitionStatus();
  }, ft.version = "19.1.8", ft;
}
var Rm;
function Cv() {
  if (Rm) return qc.exports;
  Rm = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (l) {
        console.error(l);
      }
  }
  return c(), qc.exports = Mv(), qc.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Am;
function Dv() {
  if (Am) return Aa;
  Am = 1;
  var c = Ov(), l = Jc(), a = Cv();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function f(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function _(e) {
    if (f(e) !== e)
      throw Error(r(188));
  }
  function b(e) {
    var t = e.alternate;
    if (!t) {
      if (t = f(e), t === null) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var n = e, i = t; ; ) {
      var s = n.return;
      if (s === null) break;
      var u = s.alternate;
      if (u === null) {
        if (i = s.return, i !== null) {
          n = i;
          continue;
        }
        break;
      }
      if (s.child === u.child) {
        for (u = s.child; u; ) {
          if (u === n) return _(s), e;
          if (u === i) return _(s), t;
          u = u.sibling;
        }
        throw Error(r(188));
      }
      if (n.return !== i.return) n = s, i = u;
      else {
        for (var h = !1, m = s.child; m; ) {
          if (m === n) {
            h = !0, n = s, i = u;
            break;
          }
          if (m === i) {
            h = !0, i = s, n = u;
            break;
          }
          m = m.sibling;
        }
        if (!h) {
          for (m = u.child; m; ) {
            if (m === n) {
              h = !0, n = u, i = s;
              break;
            }
            if (m === i) {
              h = !0, i = u, n = s;
              break;
            }
            m = m.sibling;
          }
          if (!h) throw Error(r(189));
        }
      }
      if (n.alternate !== i) throw Error(r(190));
    }
    if (n.tag !== 3) throw Error(r(188));
    return n.stateNode.current === n ? e : t;
  }
  function g(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = g(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var T = Object.assign, V = /* @__PURE__ */ Symbol.for("react.element"), P = /* @__PURE__ */ Symbol.for("react.transitional.element"), W = /* @__PURE__ */ Symbol.for("react.portal"), F = /* @__PURE__ */ Symbol.for("react.fragment"), ce = /* @__PURE__ */ Symbol.for("react.strict_mode"), se = /* @__PURE__ */ Symbol.for("react.profiler"), qe = /* @__PURE__ */ Symbol.for("react.provider"), lt = /* @__PURE__ */ Symbol.for("react.consumer"), me = /* @__PURE__ */ Symbol.for("react.context"), N = /* @__PURE__ */ Symbol.for("react.forward_ref"), x = /* @__PURE__ */ Symbol.for("react.suspense"), B = /* @__PURE__ */ Symbol.for("react.suspense_list"), q = /* @__PURE__ */ Symbol.for("react.memo"), Z = /* @__PURE__ */ Symbol.for("react.lazy"), ue = /* @__PURE__ */ Symbol.for("react.activity"), ie = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), ke = Symbol.iterator;
  function Be(e) {
    return e === null || typeof e != "object" ? null : (e = ke && e[ke] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var $e = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ut(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === $e ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case F:
        return "Fragment";
      case se:
        return "Profiler";
      case ce:
        return "StrictMode";
      case x:
        return "Suspense";
      case B:
        return "SuspenseList";
      case ue:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case W:
          return "Portal";
        case me:
          return (e.displayName || "Context") + ".Provider";
        case lt:
          return (e._context.displayName || "Context") + ".Consumer";
        case N:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case q:
          return t = e.displayName || null, t !== null ? t : ut(e.type) || "Memo";
        case Z:
          t = e._payload, e = e._init;
          try {
            return ut(e(t));
          } catch {
          }
      }
    return null;
  }
  var Qe = Array.isArray, O = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ee = [], y = -1;
  function k(e) {
    return { current: e };
  }
  function j(e) {
    0 > y || (e.current = Ee[y], Ee[y] = null, y--);
  }
  function L(e, t) {
    y++, Ee[y] = e.current, e.current = t;
  }
  var $ = k(null), ve = k(null), le = k(null), dt = k(null);
  function ze(e, t) {
    switch (L(le, t), L(ve, e), L($, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? vd(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = vd(t), e = Sd(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    j($), L($, e);
  }
  function wt() {
    j($), j(ve), j(le);
  }
  function ni(e) {
    e.memoizedState !== null && L(dt, e);
    var t = $.current, n = Sd(t, e.type);
    t !== n && (L(ve, e), L($, n));
  }
  function sn(e) {
    ve.current === e && (j($), j(ve)), dt.current === e && (j(dt), ba._currentValue = I);
  }
  var Oi = Object.prototype.hasOwnProperty, Mn = c.unstable_scheduleCallback, Mi = c.unstable_cancelCallback, Na = c.unstable_shouldYield, ur = c.unstable_requestPaint, Ut = c.unstable_now, cr = c.unstable_getCurrentPriorityLevel, Ba = c.unstable_ImmediatePriority, La = c.unstable_UserBlockingPriority, Ci = c.unstable_NormalPriority, or = c.unstable_LowPriority, D = c.unstable_IdlePriority, K = c.log, re = c.unstable_setDisableYieldValue, X = null, he = null;
  function Se(e) {
    if (typeof K == "function" && re(e), he && typeof he.setStrictMode == "function")
      try {
        he.setStrictMode(X, e);
      } catch {
      }
  }
  var ae = Math.clz32 ? Math.clz32 : Xt, Fe = Math.log, Rl = Math.LN2;
  function Xt(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Fe(e) / Rl | 0) | 0;
  }
  var Ha = 256, ja = 4194304;
  function ii(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function qa(e, t, n) {
    var i = e.pendingLanes;
    if (i === 0) return 0;
    var s = 0, u = e.suspendedLanes, h = e.pingedLanes;
    e = e.warmLanes;
    var m = i & 134217727;
    return m !== 0 ? (i = m & ~u, i !== 0 ? s = ii(i) : (h &= m, h !== 0 ? s = ii(h) : n || (n = m & ~e, n !== 0 && (s = ii(n))))) : (m = i & ~u, m !== 0 ? s = ii(m) : h !== 0 ? s = ii(h) : n || (n = i & ~e, n !== 0 && (s = ii(n)))), s === 0 ? 0 : t !== 0 && t !== s && (t & u) === 0 && (u = s & -s, n = t & -t, u >= n || u === 32 && (n & 4194048) !== 0) ? t : s;
  }
  function Al(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function sg(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function to() {
    var e = Ha;
    return Ha <<= 1, (Ha & 4194048) === 0 && (Ha = 256), e;
  }
  function no() {
    var e = ja;
    return ja <<= 1, (ja & 62914560) === 0 && (ja = 4194304), e;
  }
  function fr(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function xl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function rg(e, t, n, i, s, u) {
    var h = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var m = e.entanglements, p = e.expirationTimes, w = e.hiddenUpdates;
    for (n = h & ~n; 0 < n; ) {
      var M = 31 - ae(n), z = 1 << M;
      m[M] = 0, p[M] = -1;
      var R = w[M];
      if (R !== null)
        for (w[M] = null, M = 0; M < R.length; M++) {
          var A = R[M];
          A !== null && (A.lane &= -536870913);
        }
      n &= ~z;
    }
    i !== 0 && io(e, i, 0), u !== 0 && s === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(h & ~t));
  }
  function io(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var i = 31 - ae(t);
    e.entangledLanes |= t, e.entanglements[i] = e.entanglements[i] | 1073741824 | n & 4194090;
  }
  function lo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var i = 31 - ae(n), s = 1 << i;
      s & t | e[i] & t && (e[i] |= t), n &= ~s;
    }
  }
  function hr(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function dr(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function ao() {
    var e = H.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : qd(e.type));
  }
  function ug(e, t) {
    var n = H.p;
    try {
      return H.p = e, t();
    } finally {
      H.p = n;
    }
  }
  var Cn = Math.random().toString(36).slice(2), ct = "__reactFiber$" + Cn, _t = "__reactProps$" + Cn, Di = "__reactContainer$" + Cn, mr = "__reactEvents$" + Cn, cg = "__reactListeners$" + Cn, og = "__reactHandles$" + Cn, so = "__reactResources$" + Cn, Ol = "__reactMarker$" + Cn;
  function gr(e) {
    delete e[ct], delete e[_t], delete e[mr], delete e[cg], delete e[og];
  }
  function zi(e) {
    var t = e[ct];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Di] || n[ct]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = Rd(e); e !== null; ) {
            if (n = e[ct]) return n;
            e = Rd(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Ui(e) {
    if (e = e[ct] || e[Di]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Ml(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function ki(e) {
    var t = e[so];
    return t || (t = e[so] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function et(e) {
    e[Ol] = !0;
  }
  var ro = /* @__PURE__ */ new Set(), uo = {};
  function li(e, t) {
    Ni(e, t), Ni(e + "Capture", t);
  }
  function Ni(e, t) {
    for (uo[e] = t, e = 0; e < t.length; e++)
      ro.add(t[e]);
  }
  var fg = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), co = {}, oo = {};
  function hg(e) {
    return Oi.call(oo, e) ? !0 : Oi.call(co, e) ? !1 : fg.test(e) ? oo[e] = !0 : (co[e] = !0, !1);
  }
  function Ya(e, t, n) {
    if (hg(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var i = t.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function Ga(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function rn(e, t, n, i) {
    if (i === null) e.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + i);
    }
  }
  var pr, fo;
  function Bi(e) {
    if (pr === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        pr = t && t[1] || "", fo = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + pr + e + fo;
  }
  var br = !1;
  function _r(e, t) {
    if (!e || br) return "";
    br = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var z = function() {
                throw Error();
              };
              if (Object.defineProperty(z.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(z, []);
                } catch (A) {
                  var R = A;
                }
                Reflect.construct(e, [], z);
              } else {
                try {
                  z.call();
                } catch (A) {
                  R = A;
                }
                e.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (A) {
                R = A;
              }
              (z = e()) && typeof z.catch == "function" && z.catch(function() {
              });
            }
          } catch (A) {
            if (A && R && typeof A.stack == "string")
              return [A.stack, R.stack];
          }
          return [null, null];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var s = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      s && s.configurable && Object.defineProperty(
        i.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = i.DetermineComponentFrameRoot(), h = u[0], m = u[1];
      if (h && m) {
        var p = h.split(`
`), w = m.split(`
`);
        for (s = i = 0; i < p.length && !p[i].includes("DetermineComponentFrameRoot"); )
          i++;
        for (; s < w.length && !w[s].includes(
          "DetermineComponentFrameRoot"
        ); )
          s++;
        if (i === p.length || s === w.length)
          for (i = p.length - 1, s = w.length - 1; 1 <= i && 0 <= s && p[i] !== w[s]; )
            s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (p[i] !== w[s]) {
            if (i !== 1 || s !== 1)
              do
                if (i--, s--, 0 > s || p[i] !== w[s]) {
                  var M = `
` + p[i].replace(" at new ", " at ");
                  return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), M;
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      br = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? Bi(n) : "";
  }
  function dg(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Bi(e.type);
      case 16:
        return Bi("Lazy");
      case 13:
        return Bi("Suspense");
      case 19:
        return Bi("SuspenseList");
      case 0:
      case 15:
        return _r(e.type, !1);
      case 11:
        return _r(e.type.render, !1);
      case 1:
        return _r(e.type, !0);
      case 31:
        return Bi("Activity");
      default:
        return "";
    }
  }
  function ho(e) {
    try {
      var t = "";
      do
        t += dg(e), e = e.return;
      while (e);
      return t;
    } catch (n) {
      return `
Error generating stack: ` + n.message + `
` + n.stack;
    }
  }
  function kt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function mo(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function mg(e) {
    var t = mo(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    ), i = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var s = n.get, u = n.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return s.call(this);
        },
        set: function(h) {
          i = "" + h, u.call(this, h);
        }
      }), Object.defineProperty(e, t, {
        enumerable: n.enumerable
      }), {
        getValue: function() {
          return i;
        },
        setValue: function(h) {
          i = "" + h;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Va(e) {
    e._valueTracker || (e._valueTracker = mg(e));
  }
  function go(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), i = "";
    return e && (i = mo(e) ? e.checked ? "true" : "false" : e.value), e = i, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Xa(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var gg = /[\n"\\]/g;
  function Nt(e) {
    return e.replace(
      gg,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function yr(e, t, n, i, s, u, h, m) {
    e.name = "", h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? e.type = h : e.removeAttribute("type"), t != null ? h === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + kt(t)) : e.value !== "" + kt(t) && (e.value = "" + kt(t)) : h !== "submit" && h !== "reset" || e.removeAttribute("value"), t != null ? vr(e, h, kt(t)) : n != null ? vr(e, h, kt(n)) : i != null && e.removeAttribute("value"), s == null && u != null && (e.defaultChecked = !!u), s != null && (e.checked = s && typeof s != "function" && typeof s != "symbol"), m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? e.name = "" + kt(m) : e.removeAttribute("name");
  }
  function po(e, t, n, i, s, u, h, m) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null))
        return;
      n = n != null ? "" + kt(n) : "", t = t != null ? "" + kt(t) : n, m || t === e.value || (e.value = t), e.defaultValue = t;
    }
    i = i ?? s, i = typeof i != "function" && typeof i != "symbol" && !!i, e.checked = m ? e.checked : !!i, e.defaultChecked = !!i, h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.name = h);
  }
  function vr(e, t, n) {
    t === "number" && Xa(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function Li(e, t, n, i) {
    if (e = e.options, t) {
      t = {};
      for (var s = 0; s < n.length; s++)
        t["$" + n[s]] = !0;
      for (n = 0; n < e.length; n++)
        s = t.hasOwnProperty("$" + e[n].value), e[n].selected !== s && (e[n].selected = s), s && i && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + kt(n), t = null, s = 0; s < e.length; s++) {
        if (e[s].value === n) {
          e[s].selected = !0, i && (e[s].defaultSelected = !0);
          return;
        }
        t !== null || e[s].disabled || (t = e[s]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function bo(e, t, n) {
    if (t != null && (t = "" + kt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + kt(n) : "";
  }
  function _o(e, t, n, i) {
    if (t == null) {
      if (i != null) {
        if (n != null) throw Error(r(92));
        if (Qe(i)) {
          if (1 < i.length) throw Error(r(93));
          i = i[0];
        }
        n = i;
      }
      n == null && (n = ""), t = n;
    }
    n = kt(t), e.defaultValue = n, i = e.textContent, i === n && i !== "" && i !== null && (e.value = i);
  }
  function Hi(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var pg = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function yo(e, t, n) {
    var i = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? i ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : i ? e.setProperty(t, n) : typeof n != "number" || n === 0 || pg.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function vo(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, n != null) {
      for (var i in n)
        !n.hasOwnProperty(i) || t != null && t.hasOwnProperty(i) || (i.indexOf("--") === 0 ? e.setProperty(i, "") : i === "float" ? e.cssFloat = "" : e[i] = "");
      for (var s in t)
        i = t[s], t.hasOwnProperty(s) && n[s] !== i && yo(e, s, i);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && yo(e, u, t[u]);
  }
  function Sr(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var bg = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), _g = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Qa(e) {
    return _g.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var Tr = null;
  function Er(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ji = null, qi = null;
  function So(e) {
    var t = Ui(e);
    if (t && (e = t.stateNode)) {
      var n = e[_t] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (yr(
            e,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), t = n.name, n.type === "radio" && t != null) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Nt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var i = n[t];
              if (i !== e && i.form === e.form) {
                var s = i[_t] || null;
                if (!s) throw Error(r(90));
                yr(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              i = n[t], i.form === e.form && go(i);
          }
          break e;
        case "textarea":
          bo(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && Li(e, !!n.multiple, t, !1);
      }
    }
  }
  var wr = !1;
  function To(e, t, n) {
    if (wr) return e(t, n);
    wr = !0;
    try {
      var i = e(t);
      return i;
    } finally {
      if (wr = !1, (ji !== null || qi !== null) && (Cs(), ji && (t = ji, e = qi, qi = ji = null, So(t), e)))
        for (t = 0; t < e.length; t++) So(e[t]);
    }
  }
  function Cl(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var i = n[_t] || null;
    if (i === null) return null;
    n = i[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (e = e.type, i = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !i;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        r(231, t, typeof n)
      );
    return n;
  }
  var un = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Rr = !1;
  if (un)
    try {
      var Dl = {};
      Object.defineProperty(Dl, "passive", {
        get: function() {
          Rr = !0;
        }
      }), window.addEventListener("test", Dl, Dl), window.removeEventListener("test", Dl, Dl);
    } catch {
      Rr = !1;
    }
  var Dn = null, Ar = null, Za = null;
  function Eo() {
    if (Za) return Za;
    var e, t = Ar, n = t.length, i, s = "value" in Dn ? Dn.value : Dn.textContent, u = s.length;
    for (e = 0; e < n && t[e] === s[e]; e++) ;
    var h = n - e;
    for (i = 1; i <= h && t[n - i] === s[u - i]; i++) ;
    return Za = s.slice(e, 1 < i ? 1 - i : void 0);
  }
  function Ka(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Pa() {
    return !0;
  }
  function wo() {
    return !1;
  }
  function yt(e) {
    function t(n, i, s, u, h) {
      this._reactName = n, this._targetInst = s, this.type = i, this.nativeEvent = u, this.target = h, this.currentTarget = null;
      for (var m in e)
        e.hasOwnProperty(m) && (n = e[m], this[m] = n ? n(u) : u[m]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Pa : wo, this.isPropagationStopped = wo, this;
    }
    return T(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Pa);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Pa);
      },
      persist: function() {
      },
      isPersistent: Pa
    }), t;
  }
  var ai = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ja = yt(ai), zl = T({}, ai, { view: 0, detail: 0 }), yg = yt(zl), xr, Or, Ul, Wa = T({}, zl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Cr,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ul && (Ul && e.type === "mousemove" ? (xr = e.screenX - Ul.screenX, Or = e.screenY - Ul.screenY) : Or = xr = 0, Ul = e), xr);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Or;
    }
  }), Ro = yt(Wa), vg = T({}, Wa, { dataTransfer: 0 }), Sg = yt(vg), Tg = T({}, zl, { relatedTarget: 0 }), Mr = yt(Tg), Eg = T({}, ai, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), wg = yt(Eg), Rg = T({}, ai, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Ag = yt(Rg), xg = T({}, ai, { data: 0 }), Ao = yt(xg), Og = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Mg = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Cg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Dg(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Cg[e]) ? !!t[e] : !1;
  }
  function Cr() {
    return Dg;
  }
  var zg = T({}, zl, {
    key: function(e) {
      if (e.key) {
        var t = Og[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ka(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Mg[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Cr,
    charCode: function(e) {
      return e.type === "keypress" ? Ka(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ka(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Ug = yt(zg), kg = T({}, Wa, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), xo = yt(kg), Ng = T({}, zl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Cr
  }), Bg = yt(Ng), Lg = T({}, ai, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Hg = yt(Lg), jg = T({}, Wa, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), qg = yt(jg), Yg = T({}, ai, {
    newState: 0,
    oldState: 0
  }), Gg = yt(Yg), Vg = [9, 13, 27, 32], Dr = un && "CompositionEvent" in window, kl = null;
  un && "documentMode" in document && (kl = document.documentMode);
  var Xg = un && "TextEvent" in window && !kl, Oo = un && (!Dr || kl && 8 < kl && 11 >= kl), Mo = " ", Co = !1;
  function Do(e, t) {
    switch (e) {
      case "keyup":
        return Vg.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function zo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Yi = !1;
  function Qg(e, t) {
    switch (e) {
      case "compositionend":
        return zo(t);
      case "keypress":
        return t.which !== 32 ? null : (Co = !0, Mo);
      case "textInput":
        return e = t.data, e === Mo && Co ? null : e;
      default:
        return null;
    }
  }
  function Zg(e, t) {
    if (Yi)
      return e === "compositionend" || !Dr && Do(e, t) ? (e = Eo(), Za = Ar = Dn = null, Yi = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Oo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Kg = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Uo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Kg[e.type] : t === "textarea";
  }
  function ko(e, t, n, i) {
    ji ? qi ? qi.push(i) : qi = [i] : ji = i, t = Bs(t, "onChange"), 0 < t.length && (n = new Ja(
      "onChange",
      "change",
      null,
      n,
      i
    ), e.push({ event: n, listeners: t }));
  }
  var Nl = null, Bl = null;
  function Pg(e) {
    gd(e, 0);
  }
  function Ia(e) {
    var t = Ml(e);
    if (go(t)) return e;
  }
  function No(e, t) {
    if (e === "change") return t;
  }
  var Bo = !1;
  if (un) {
    var zr;
    if (un) {
      var Ur = "oninput" in document;
      if (!Ur) {
        var Lo = document.createElement("div");
        Lo.setAttribute("oninput", "return;"), Ur = typeof Lo.oninput == "function";
      }
      zr = Ur;
    } else zr = !1;
    Bo = zr && (!document.documentMode || 9 < document.documentMode);
  }
  function Ho() {
    Nl && (Nl.detachEvent("onpropertychange", jo), Bl = Nl = null);
  }
  function jo(e) {
    if (e.propertyName === "value" && Ia(Bl)) {
      var t = [];
      ko(
        t,
        Bl,
        e,
        Er(e)
      ), To(Pg, t);
    }
  }
  function Jg(e, t, n) {
    e === "focusin" ? (Ho(), Nl = t, Bl = n, Nl.attachEvent("onpropertychange", jo)) : e === "focusout" && Ho();
  }
  function Wg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ia(Bl);
  }
  function Ig(e, t) {
    if (e === "click") return Ia(t);
  }
  function $g(e, t) {
    if (e === "input" || e === "change")
      return Ia(t);
  }
  function Fg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Rt = typeof Object.is == "function" ? Object.is : Fg;
  function Ll(e, t) {
    if (Rt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), i = Object.keys(t);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) {
      var s = n[i];
      if (!Oi.call(t, s) || !Rt(e[s], t[s]))
        return !1;
    }
    return !0;
  }
  function qo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Yo(e, t) {
    var n = qo(e);
    e = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (i = e + n.textContent.length, e <= t && i >= t)
          return { node: n, offset: t - e };
        e = i;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = qo(n);
    }
  }
  function Go(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Go(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Vo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Xa(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Xa(e.document);
    }
    return t;
  }
  function kr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var ep = un && "documentMode" in document && 11 >= document.documentMode, Gi = null, Nr = null, Hl = null, Br = !1;
  function Xo(e, t, n) {
    var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Br || Gi == null || Gi !== Xa(i) || (i = Gi, "selectionStart" in i && kr(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), Hl && Ll(Hl, i) || (Hl = i, i = Bs(Nr, "onSelect"), 0 < i.length && (t = new Ja(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: i }), t.target = Gi)));
  }
  function si(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Vi = {
    animationend: si("Animation", "AnimationEnd"),
    animationiteration: si("Animation", "AnimationIteration"),
    animationstart: si("Animation", "AnimationStart"),
    transitionrun: si("Transition", "TransitionRun"),
    transitionstart: si("Transition", "TransitionStart"),
    transitioncancel: si("Transition", "TransitionCancel"),
    transitionend: si("Transition", "TransitionEnd")
  }, Lr = {}, Qo = {};
  un && (Qo = document.createElement("div").style, "AnimationEvent" in window || (delete Vi.animationend.animation, delete Vi.animationiteration.animation, delete Vi.animationstart.animation), "TransitionEvent" in window || delete Vi.transitionend.transition);
  function ri(e) {
    if (Lr[e]) return Lr[e];
    if (!Vi[e]) return e;
    var t = Vi[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in Qo)
        return Lr[e] = t[n];
    return e;
  }
  var Zo = ri("animationend"), Ko = ri("animationiteration"), Po = ri("animationstart"), tp = ri("transitionrun"), np = ri("transitionstart"), ip = ri("transitioncancel"), Jo = ri("transitionend"), Wo = /* @__PURE__ */ new Map(), Hr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Hr.push("scrollEnd");
  function Qt(e, t) {
    Wo.set(e, t), li(t, [e]);
  }
  var Io = /* @__PURE__ */ new WeakMap();
  function Bt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Io.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: ho(t)
      }, Io.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: ho(t)
    };
  }
  var Lt = [], Xi = 0, jr = 0;
  function $a() {
    for (var e = Xi, t = jr = Xi = 0; t < e; ) {
      var n = Lt[t];
      Lt[t++] = null;
      var i = Lt[t];
      Lt[t++] = null;
      var s = Lt[t];
      Lt[t++] = null;
      var u = Lt[t];
      if (Lt[t++] = null, i !== null && s !== null) {
        var h = i.pending;
        h === null ? s.next = s : (s.next = h.next, h.next = s), i.pending = s;
      }
      u !== 0 && $o(n, s, u);
    }
  }
  function Fa(e, t, n, i) {
    Lt[Xi++] = e, Lt[Xi++] = t, Lt[Xi++] = n, Lt[Xi++] = i, jr |= i, e.lanes |= i, e = e.alternate, e !== null && (e.lanes |= i);
  }
  function qr(e, t, n, i) {
    return Fa(e, t, n, i), es(e);
  }
  function Qi(e, t) {
    return Fa(e, null, null, t), es(e);
  }
  function $o(e, t, n) {
    e.lanes |= n;
    var i = e.alternate;
    i !== null && (i.lanes |= n);
    for (var s = !1, u = e.return; u !== null; )
      u.childLanes |= n, i = u.alternate, i !== null && (i.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (s = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, s && t !== null && (s = 31 - ae(n), e = u.hiddenUpdates, i = e[s], i === null ? e[s] = [t] : i.push(t), t.lane = n | 536870912), u) : null;
  }
  function es(e) {
    if (50 < ca)
      throw ca = 0, Zu = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Zi = {};
  function lp(e, t, n, i) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function At(e, t, n, i) {
    return new lp(e, t, n, i);
  }
  function Yr(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function cn(e, t) {
    var n = e.alternate;
    return n === null ? (n = At(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Fo(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ts(e, t, n, i, s, u) {
    var h = 0;
    if (i = e, typeof e == "function") Yr(e) && (h = 1);
    else if (typeof e == "string")
      h = sb(
        e,
        n,
        $.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case ue:
          return e = At(31, n, t, s), e.elementType = ue, e.lanes = u, e;
        case F:
          return ui(n.children, s, u, t);
        case ce:
          h = 8, s |= 24;
          break;
        case se:
          return e = At(12, n, t, s | 2), e.elementType = se, e.lanes = u, e;
        case x:
          return e = At(13, n, t, s), e.elementType = x, e.lanes = u, e;
        case B:
          return e = At(19, n, t, s), e.elementType = B, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case qe:
              case me:
                h = 10;
                break e;
              case lt:
                h = 9;
                break e;
              case N:
                h = 11;
                break e;
              case q:
                h = 14;
                break e;
              case Z:
                h = 16, i = null;
                break e;
            }
          h = 29, n = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), i = null;
      }
    return t = At(h, n, t, s), t.elementType = e, t.type = i, t.lanes = u, t;
  }
  function ui(e, t, n, i) {
    return e = At(7, e, i, t), e.lanes = n, e;
  }
  function Gr(e, t, n) {
    return e = At(6, e, null, t), e.lanes = n, e;
  }
  function Vr(e, t, n) {
    return t = At(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Ki = [], Pi = 0, ns = null, is = 0, Ht = [], jt = 0, ci = null, on = 1, fn = "";
  function oi(e, t) {
    Ki[Pi++] = is, Ki[Pi++] = ns, ns = e, is = t;
  }
  function ef(e, t, n) {
    Ht[jt++] = on, Ht[jt++] = fn, Ht[jt++] = ci, ci = e;
    var i = on;
    e = fn;
    var s = 32 - ae(i) - 1;
    i &= ~(1 << s), n += 1;
    var u = 32 - ae(t) + s;
    if (30 < u) {
      var h = s - s % 5;
      u = (i & (1 << h) - 1).toString(32), i >>= h, s -= h, on = 1 << 32 - ae(t) + s | n << s | i, fn = u + e;
    } else
      on = 1 << u | n << s | i, fn = e;
  }
  function Xr(e) {
    e.return !== null && (oi(e, 1), ef(e, 1, 0));
  }
  function Qr(e) {
    for (; e === ns; )
      ns = Ki[--Pi], Ki[Pi] = null, is = Ki[--Pi], Ki[Pi] = null;
    for (; e === ci; )
      ci = Ht[--jt], Ht[jt] = null, fn = Ht[--jt], Ht[jt] = null, on = Ht[--jt], Ht[jt] = null;
  }
  var mt = null, Ye = null, Ae = !1, fi = null, en = !1, Zr = Error(r(519));
  function hi(e) {
    var t = Error(r(418, ""));
    throw Yl(Bt(t, e)), Zr;
  }
  function tf(e) {
    var t = e.stateNode, n = e.type, i = e.memoizedProps;
    switch (t[ct] = e, t[_t] = i, n) {
      case "dialog":
        be("cancel", t), be("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        be("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < fa.length; n++)
          be(fa[n], t);
        break;
      case "source":
        be("error", t);
        break;
      case "img":
      case "image":
      case "link":
        be("error", t), be("load", t);
        break;
      case "details":
        be("toggle", t);
        break;
      case "input":
        be("invalid", t), po(
          t,
          i.value,
          i.defaultValue,
          i.checked,
          i.defaultChecked,
          i.type,
          i.name,
          !0
        ), Va(t);
        break;
      case "select":
        be("invalid", t);
        break;
      case "textarea":
        be("invalid", t), _o(t, i.value, i.defaultValue, i.children), Va(t);
    }
    n = i.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || i.suppressHydrationWarning === !0 || yd(t.textContent, n) ? (i.popover != null && (be("beforetoggle", t), be("toggle", t)), i.onScroll != null && be("scroll", t), i.onScrollEnd != null && be("scrollend", t), i.onClick != null && (t.onclick = Ls), t = !0) : t = !1, t || hi(e);
  }
  function nf(e) {
    for (mt = e.return; mt; )
      switch (mt.tag) {
        case 5:
        case 13:
          en = !1;
          return;
        case 27:
        case 3:
          en = !0;
          return;
        default:
          mt = mt.return;
      }
  }
  function jl(e) {
    if (e !== mt) return !1;
    if (!Ae) return nf(e), Ae = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || uc(e.type, e.memoizedProps)), n = !n), n && Ye && hi(e), nf(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (n = e.data, n === "/$") {
              if (t === 0) {
                Ye = Kt(e.nextSibling);
                break e;
              }
              t--;
            } else
              n !== "$" && n !== "$!" && n !== "$?" || t++;
          e = e.nextSibling;
        }
        Ye = null;
      }
    } else
      t === 27 ? (t = Ye, Kn(e.type) ? (e = hc, hc = null, Ye = e) : Ye = t) : Ye = mt ? Kt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ql() {
    Ye = mt = null, Ae = !1;
  }
  function lf() {
    var e = fi;
    return e !== null && (Tt === null ? Tt = e : Tt.push.apply(
      Tt,
      e
    ), fi = null), e;
  }
  function Yl(e) {
    fi === null ? fi = [e] : fi.push(e);
  }
  var Kr = k(null), di = null, hn = null;
  function zn(e, t, n) {
    L(Kr, t._currentValue), t._currentValue = n;
  }
  function dn(e) {
    e._currentValue = Kr.current, j(Kr);
  }
  function Pr(e, t, n) {
    for (; e !== null; ) {
      var i = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, i !== null && (i.childLanes |= t)) : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Jr(e, t, n, i) {
    var s = e.child;
    for (s !== null && (s.return = e); s !== null; ) {
      var u = s.dependencies;
      if (u !== null) {
        var h = s.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var m = u;
          u = s;
          for (var p = 0; p < t.length; p++)
            if (m.context === t[p]) {
              u.lanes |= n, m = u.alternate, m !== null && (m.lanes |= n), Pr(
                u.return,
                n,
                e
              ), i || (h = null);
              break e;
            }
          u = m.next;
        }
      } else if (s.tag === 18) {
        if (h = s.return, h === null) throw Error(r(341));
        h.lanes |= n, u = h.alternate, u !== null && (u.lanes |= n), Pr(h, n, e), h = null;
      } else h = s.child;
      if (h !== null) h.return = s;
      else
        for (h = s; h !== null; ) {
          if (h === e) {
            h = null;
            break;
          }
          if (s = h.sibling, s !== null) {
            s.return = h.return, h = s;
            break;
          }
          h = h.return;
        }
      s = h;
    }
  }
  function Gl(e, t, n, i) {
    e = null;
    for (var s = t, u = !1; s !== null; ) {
      if (!u) {
        if ((s.flags & 524288) !== 0) u = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var h = s.alternate;
        if (h === null) throw Error(r(387));
        if (h = h.memoizedProps, h !== null) {
          var m = s.type;
          Rt(s.pendingProps.value, h.value) || (e !== null ? e.push(m) : e = [m]);
        }
      } else if (s === dt.current) {
        if (h = s.alternate, h === null) throw Error(r(387));
        h.memoizedState.memoizedState !== s.memoizedState.memoizedState && (e !== null ? e.push(ba) : e = [ba]);
      }
      s = s.return;
    }
    e !== null && Jr(
      t,
      e,
      n,
      i
    ), t.flags |= 262144;
  }
  function ls(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Rt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function mi(e) {
    di = e, hn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ot(e) {
    return af(di, e);
  }
  function as(e, t) {
    return di === null && mi(e), af(e, t);
  }
  function af(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, hn === null) {
      if (e === null) throw Error(r(308));
      hn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else hn = hn.next = t;
    return n;
  }
  var ap = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, i) {
        e.push(i);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, sp = c.unstable_scheduleCallback, rp = c.unstable_NormalPriority, We = {
    $$typeof: me,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Wr() {
    return {
      controller: new ap(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Vl(e) {
    e.refCount--, e.refCount === 0 && sp(rp, function() {
      e.controller.abort();
    });
  }
  var Xl = null, Ir = 0, Ji = 0, Wi = null;
  function up(e, t) {
    if (Xl === null) {
      var n = Xl = [];
      Ir = 0, Ji = Fu(), Wi = {
        status: "pending",
        value: void 0,
        then: function(i) {
          n.push(i);
        }
      };
    }
    return Ir++, t.then(sf, sf), t;
  }
  function sf() {
    if (--Ir === 0 && Xl !== null) {
      Wi !== null && (Wi.status = "fulfilled");
      var e = Xl;
      Xl = null, Ji = 0, Wi = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function cp(e, t) {
    var n = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(s) {
        n.push(s);
      }
    };
    return e.then(
      function() {
        i.status = "fulfilled", i.value = t;
        for (var s = 0; s < n.length; s++) (0, n[s])(t);
      },
      function(s) {
        for (i.status = "rejected", i.reason = s, s = 0; s < n.length; s++)
          (0, n[s])(void 0);
      }
    ), i;
  }
  var rf = O.S;
  O.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && up(e, t), rf !== null && rf(e, t);
  };
  var gi = k(null);
  function $r() {
    var e = gi.current;
    return e !== null ? e : Ne.pooledCache;
  }
  function ss(e, t) {
    t === null ? L(gi, gi.current) : L(gi, t.pool);
  }
  function uf() {
    var e = $r();
    return e === null ? null : { parent: We._currentValue, pool: e };
  }
  var Ql = Error(r(460)), cf = Error(r(474)), rs = Error(r(542)), Fr = { then: function() {
  } };
  function of(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function us() {
  }
  function ff(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(us, us), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, df(e), e;
      default:
        if (typeof t.status == "string") t.then(us, us);
        else {
          if (e = Ne, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
          e = t, e.status = "pending", e.then(
            function(i) {
              if (t.status === "pending") {
                var s = t;
                s.status = "fulfilled", s.value = i;
              }
            },
            function(i) {
              if (t.status === "pending") {
                var s = t;
                s.status = "rejected", s.reason = i;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, df(e), e;
        }
        throw Zl = t, Ql;
    }
  }
  var Zl = null;
  function hf() {
    if (Zl === null) throw Error(r(459));
    var e = Zl;
    return Zl = null, e;
  }
  function df(e) {
    if (e === Ql || e === rs)
      throw Error(r(483));
  }
  var Un = !1;
  function eu(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function tu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function kn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Nn(e, t, n) {
    var i = e.updateQueue;
    if (i === null) return null;
    if (i = i.shared, (xe & 2) !== 0) {
      var s = i.pending;
      return s === null ? t.next = t : (t.next = s.next, s.next = t), i.pending = t, t = es(e), $o(e, null, n), t;
    }
    return Fa(e, i, t, n), es(e);
  }
  function Kl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var i = t.lanes;
      i &= e.pendingLanes, n |= i, t.lanes = n, lo(e, n);
    }
  }
  function nu(e, t) {
    var n = e.updateQueue, i = e.alternate;
    if (i !== null && (i = i.updateQueue, n === i)) {
      var s = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var h = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? s = u = h : u = u.next = h, n = n.next;
        } while (n !== null);
        u === null ? s = u = t : u = u.next = t;
      } else s = u = t;
      n = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: u,
        shared: i.shared,
        callbacks: i.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var iu = !1;
  function Pl() {
    if (iu) {
      var e = Wi;
      if (e !== null) throw e;
    }
  }
  function Jl(e, t, n, i) {
    iu = !1;
    var s = e.updateQueue;
    Un = !1;
    var u = s.firstBaseUpdate, h = s.lastBaseUpdate, m = s.shared.pending;
    if (m !== null) {
      s.shared.pending = null;
      var p = m, w = p.next;
      p.next = null, h === null ? u = w : h.next = w, h = p;
      var M = e.alternate;
      M !== null && (M = M.updateQueue, m = M.lastBaseUpdate, m !== h && (m === null ? M.firstBaseUpdate = w : m.next = w, M.lastBaseUpdate = p));
    }
    if (u !== null) {
      var z = s.baseState;
      h = 0, M = w = p = null, m = u;
      do {
        var R = m.lane & -536870913, A = R !== m.lane;
        if (A ? (Te & R) === R : (i & R) === R) {
          R !== 0 && R === Ji && (iu = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: null,
            next: null
          });
          e: {
            var ne = e, ee = m;
            R = t;
            var De = n;
            switch (ee.tag) {
              case 1:
                if (ne = ee.payload, typeof ne == "function") {
                  z = ne.call(De, z, R);
                  break e;
                }
                z = ne;
                break e;
              case 3:
                ne.flags = ne.flags & -65537 | 128;
              case 0:
                if (ne = ee.payload, R = typeof ne == "function" ? ne.call(De, z, R) : ne, R == null) break e;
                z = T({}, z, R);
                break e;
              case 2:
                Un = !0;
            }
          }
          R = m.callback, R !== null && (e.flags |= 64, A && (e.flags |= 8192), A = s.callbacks, A === null ? s.callbacks = [R] : A.push(R));
        } else
          A = {
            lane: R,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          }, M === null ? (w = M = A, p = z) : M = M.next = A, h |= R;
        if (m = m.next, m === null) {
          if (m = s.shared.pending, m === null)
            break;
          A = m, m = A.next, A.next = null, s.lastBaseUpdate = A, s.shared.pending = null;
        }
      } while (!0);
      M === null && (p = z), s.baseState = p, s.firstBaseUpdate = w, s.lastBaseUpdate = M, u === null && (s.shared.lanes = 0), Vn |= h, e.lanes = h, e.memoizedState = z;
    }
  }
  function mf(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function gf(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        mf(n[e], t);
  }
  var Ii = k(null), cs = k(0);
  function pf(e, t) {
    e = vn, L(cs, e), L(Ii, t), vn = e | t.baseLanes;
  }
  function lu() {
    L(cs, vn), L(Ii, Ii.current);
  }
  function au() {
    vn = cs.current, j(Ii), j(cs);
  }
  var Bn = 0, de = null, Me = null, Ze = null, os = !1, $i = !1, pi = !1, fs = 0, Wl = 0, Fi = null, op = 0;
  function Ve() {
    throw Error(r(321));
  }
  function su(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Rt(e[n], t[n])) return !1;
    return !0;
  }
  function ru(e, t, n, i, s, u) {
    return Bn = u, de = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, O.H = e === null || e.memoizedState === null ? Ff : eh, pi = !1, u = n(i, s), pi = !1, $i && (u = _f(
      t,
      n,
      i,
      s
    )), bf(e), u;
  }
  function bf(e) {
    O.H = bs;
    var t = Me !== null && Me.next !== null;
    if (Bn = 0, Ze = Me = de = null, os = !1, Wl = 0, Fi = null, t) throw Error(r(300));
    e === null || tt || (e = e.dependencies, e !== null && ls(e) && (tt = !0));
  }
  function _f(e, t, n, i) {
    de = e;
    var s = 0;
    do {
      if ($i && (Fi = null), Wl = 0, $i = !1, 25 <= s) throw Error(r(301));
      if (s += 1, Ze = Me = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      O.H = bp, u = t(n, i);
    } while ($i);
    return u;
  }
  function fp() {
    var e = O.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Il(t) : t, e = e.useState()[0], (Me !== null ? Me.memoizedState : null) !== e && (de.flags |= 1024), t;
  }
  function uu() {
    var e = fs !== 0;
    return fs = 0, e;
  }
  function cu(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function ou(e) {
    if (os) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      os = !1;
    }
    Bn = 0, Ze = Me = de = null, $i = !1, Wl = fs = 0, Fi = null;
  }
  function vt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ze === null ? de.memoizedState = Ze = e : Ze = Ze.next = e, Ze;
  }
  function Ke() {
    if (Me === null) {
      var e = de.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = Ze === null ? de.memoizedState : Ze.next;
    if (t !== null)
      Ze = t, Me = e;
    else {
      if (e === null)
        throw de.alternate === null ? Error(r(467)) : Error(r(310));
      Me = e, e = {
        memoizedState: Me.memoizedState,
        baseState: Me.baseState,
        baseQueue: Me.baseQueue,
        queue: Me.queue,
        next: null
      }, Ze === null ? de.memoizedState = Ze = e : Ze = Ze.next = e;
    }
    return Ze;
  }
  function fu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Il(e) {
    var t = Wl;
    return Wl += 1, Fi === null && (Fi = []), e = ff(Fi, e, t), t = de, (Ze === null ? t.memoizedState : Ze.next) === null && (t = t.alternate, O.H = t === null || t.memoizedState === null ? Ff : eh), e;
  }
  function hs(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Il(e);
      if (e.$$typeof === me) return ot(e);
    }
    throw Error(r(438, String(e)));
  }
  function hu(e) {
    var t = null, n = de.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var i = de.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (t = {
        data: i.data.map(function(s) {
          return s.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = fu(), de.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), i = 0; i < e; i++)
        n[i] = ie;
    return t.index++, n;
  }
  function mn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ds(e) {
    var t = Ke();
    return du(t, Me, e);
  }
  function du(e, t, n) {
    var i = e.queue;
    if (i === null) throw Error(r(311));
    i.lastRenderedReducer = n;
    var s = e.baseQueue, u = i.pending;
    if (u !== null) {
      if (s !== null) {
        var h = s.next;
        s.next = u.next, u.next = h;
      }
      t.baseQueue = s = u, i.pending = null;
    }
    if (u = e.baseState, s === null) e.memoizedState = u;
    else {
      t = s.next;
      var m = h = null, p = null, w = t, M = !1;
      do {
        var z = w.lane & -536870913;
        if (z !== w.lane ? (Te & z) === z : (Bn & z) === z) {
          var R = w.revertLane;
          if (R === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }), z === Ji && (M = !0);
          else if ((Bn & R) === R) {
            w = w.next, R === Ji && (M = !0);
            continue;
          } else
            z = {
              lane: 0,
              revertLane: w.revertLane,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }, p === null ? (m = p = z, h = u) : p = p.next = z, de.lanes |= R, Vn |= R;
          z = w.action, pi && n(u, z), u = w.hasEagerState ? w.eagerState : n(u, z);
        } else
          R = {
            lane: z,
            revertLane: w.revertLane,
            action: w.action,
            hasEagerState: w.hasEagerState,
            eagerState: w.eagerState,
            next: null
          }, p === null ? (m = p = R, h = u) : p = p.next = R, de.lanes |= z, Vn |= z;
        w = w.next;
      } while (w !== null && w !== t);
      if (p === null ? h = u : p.next = m, !Rt(u, e.memoizedState) && (tt = !0, M && (n = Wi, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = h, e.baseQueue = p, i.lastRenderedState = u;
    }
    return s === null && (i.lanes = 0), [e.memoizedState, i.dispatch];
  }
  function mu(e) {
    var t = Ke(), n = t.queue;
    if (n === null) throw Error(r(311));
    n.lastRenderedReducer = e;
    var i = n.dispatch, s = n.pending, u = t.memoizedState;
    if (s !== null) {
      n.pending = null;
      var h = s = s.next;
      do
        u = e(u, h.action), h = h.next;
      while (h !== s);
      Rt(u, t.memoizedState) || (tt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, i];
  }
  function yf(e, t, n) {
    var i = de, s = Ke(), u = Ae;
    if (u) {
      if (n === void 0) throw Error(r(407));
      n = n();
    } else n = t();
    var h = !Rt(
      (Me || s).memoizedState,
      n
    );
    h && (s.memoizedState = n, tt = !0), s = s.queue;
    var m = Tf.bind(null, i, s, e);
    if ($l(2048, 8, m, [e]), s.getSnapshot !== t || h || Ze !== null && Ze.memoizedState.tag & 1) {
      if (i.flags |= 2048, el(
        9,
        ms(),
        Sf.bind(
          null,
          i,
          s,
          n,
          t
        ),
        null
      ), Ne === null) throw Error(r(349));
      u || (Bn & 124) !== 0 || vf(i, t, n);
    }
    return n;
  }
  function vf(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = de.updateQueue, t === null ? (t = fu(), de.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Sf(e, t, n, i) {
    t.value = n, t.getSnapshot = i, Ef(t) && wf(e);
  }
  function Tf(e, t, n) {
    return n(function() {
      Ef(t) && wf(e);
    });
  }
  function Ef(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Rt(e, n);
    } catch {
      return !0;
    }
  }
  function wf(e) {
    var t = Qi(e, 2);
    t !== null && Dt(t, e, 2);
  }
  function gu(e) {
    var t = vt();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), pi) {
        Se(!0);
        try {
          n();
        } finally {
          Se(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: mn,
      lastRenderedState: e
    }, t;
  }
  function Rf(e, t, n, i) {
    return e.baseState = n, du(
      e,
      Me,
      typeof i == "function" ? i : mn
    );
  }
  function hp(e, t, n, i, s) {
    if (ps(e)) throw Error(r(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: s,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(h) {
          u.listeners.push(h);
        }
      };
      O.T !== null ? n(!0) : u.isTransition = !1, i(u), n = t.pending, n === null ? (u.next = t.pending = u, Af(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function Af(e, t) {
    var n = t.action, i = t.payload, s = e.state;
    if (t.isTransition) {
      var u = O.T, h = {};
      O.T = h;
      try {
        var m = n(s, i), p = O.S;
        p !== null && p(h, m), xf(e, t, m);
      } catch (w) {
        pu(e, t, w);
      } finally {
        O.T = u;
      }
    } else
      try {
        u = n(s, i), xf(e, t, u);
      } catch (w) {
        pu(e, t, w);
      }
  }
  function xf(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(i) {
        Of(e, t, i);
      },
      function(i) {
        return pu(e, t, i);
      }
    ) : Of(e, t, n);
  }
  function Of(e, t, n) {
    t.status = "fulfilled", t.value = n, Mf(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Af(e, n)));
  }
  function pu(e, t, n) {
    var i = e.pending;
    if (e.pending = null, i !== null) {
      i = i.next;
      do
        t.status = "rejected", t.reason = n, Mf(t), t = t.next;
      while (t !== i);
    }
    e.action = null;
  }
  function Mf(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Cf(e, t) {
    return t;
  }
  function Df(e, t) {
    if (Ae) {
      var n = Ne.formState;
      if (n !== null) {
        e: {
          var i = de;
          if (Ae) {
            if (Ye) {
              t: {
                for (var s = Ye, u = en; s.nodeType !== 8; ) {
                  if (!u) {
                    s = null;
                    break t;
                  }
                  if (s = Kt(
                    s.nextSibling
                  ), s === null) {
                    s = null;
                    break t;
                  }
                }
                u = s.data, s = u === "F!" || u === "F" ? s : null;
              }
              if (s) {
                Ye = Kt(
                  s.nextSibling
                ), i = s.data === "F!";
                break e;
              }
            }
            hi(i);
          }
          i = !1;
        }
        i && (t = n[0]);
      }
    }
    return n = vt(), n.memoizedState = n.baseState = t, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Cf,
      lastRenderedState: t
    }, n.queue = i, n = Wf.bind(
      null,
      de,
      i
    ), i.dispatch = n, i = gu(!1), u = Su.bind(
      null,
      de,
      !1,
      i.queue
    ), i = vt(), s = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, i.queue = s, n = hp.bind(
      null,
      de,
      s,
      u,
      n
    ), s.dispatch = n, i.memoizedState = e, [t, n, !1];
  }
  function zf(e) {
    var t = Ke();
    return Uf(t, Me, e);
  }
  function Uf(e, t, n) {
    if (t = du(
      e,
      t,
      Cf
    )[0], e = ds(mn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var i = Il(t);
      } catch (h) {
        throw h === Ql ? rs : h;
      }
    else i = t;
    t = Ke();
    var s = t.queue, u = s.dispatch;
    return n !== t.memoizedState && (de.flags |= 2048, el(
      9,
      ms(),
      dp.bind(null, s, n),
      null
    )), [i, u, e];
  }
  function dp(e, t) {
    e.action = t;
  }
  function kf(e) {
    var t = Ke(), n = Me;
    if (n !== null)
      return Uf(t, n, e);
    Ke(), t = t.memoizedState, n = Ke();
    var i = n.queue.dispatch;
    return n.memoizedState = e, [t, i, !1];
  }
  function el(e, t, n, i) {
    return e = { tag: e, create: n, deps: i, inst: t, next: null }, t = de.updateQueue, t === null && (t = fu(), de.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (i = n.next, n.next = e, e.next = i, t.lastEffect = e), e;
  }
  function ms() {
    return { destroy: void 0, resource: void 0 };
  }
  function Nf() {
    return Ke().memoizedState;
  }
  function gs(e, t, n, i) {
    var s = vt();
    i = i === void 0 ? null : i, de.flags |= e, s.memoizedState = el(
      1 | t,
      ms(),
      n,
      i
    );
  }
  function $l(e, t, n, i) {
    var s = Ke();
    i = i === void 0 ? null : i;
    var u = s.memoizedState.inst;
    Me !== null && i !== null && su(i, Me.memoizedState.deps) ? s.memoizedState = el(t, u, n, i) : (de.flags |= e, s.memoizedState = el(
      1 | t,
      u,
      n,
      i
    ));
  }
  function Bf(e, t) {
    gs(8390656, 8, e, t);
  }
  function Lf(e, t) {
    $l(2048, 8, e, t);
  }
  function Hf(e, t) {
    return $l(4, 2, e, t);
  }
  function jf(e, t) {
    return $l(4, 4, e, t);
  }
  function qf(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function() {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Yf(e, t, n) {
    n = n != null ? n.concat([e]) : null, $l(4, 4, qf.bind(null, t, e), n);
  }
  function bu() {
  }
  function Gf(e, t) {
    var n = Ke();
    t = t === void 0 ? null : t;
    var i = n.memoizedState;
    return t !== null && su(t, i[1]) ? i[0] : (n.memoizedState = [e, t], e);
  }
  function Vf(e, t) {
    var n = Ke();
    t = t === void 0 ? null : t;
    var i = n.memoizedState;
    if (t !== null && su(t, i[1]))
      return i[0];
    if (i = e(), pi) {
      Se(!0);
      try {
        e();
      } finally {
        Se(!1);
      }
    }
    return n.memoizedState = [i, t], i;
  }
  function _u(e, t, n) {
    return n === void 0 || (Bn & 1073741824) !== 0 ? e.memoizedState = t : (e.memoizedState = n, e = Zh(), de.lanes |= e, Vn |= e, n);
  }
  function Xf(e, t, n, i) {
    return Rt(n, t) ? n : Ii.current !== null ? (e = _u(e, n, i), Rt(e, t) || (tt = !0), e) : (Bn & 42) === 0 ? (tt = !0, e.memoizedState = n) : (e = Zh(), de.lanes |= e, Vn |= e, t);
  }
  function Qf(e, t, n, i, s) {
    var u = H.p;
    H.p = u !== 0 && 8 > u ? u : 8;
    var h = O.T, m = {};
    O.T = m, Su(e, !1, t, n);
    try {
      var p = s(), w = O.S;
      if (w !== null && w(m, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var M = cp(
          p,
          i
        );
        Fl(
          e,
          t,
          M,
          Ct(e)
        );
      } else
        Fl(
          e,
          t,
          i,
          Ct(e)
        );
    } catch (z) {
      Fl(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: z },
        Ct()
      );
    } finally {
      H.p = u, O.T = h;
    }
  }
  function mp() {
  }
  function yu(e, t, n, i) {
    if (e.tag !== 5) throw Error(r(476));
    var s = Zf(e).queue;
    Qf(
      e,
      s,
      t,
      I,
      n === null ? mp : function() {
        return Kf(e), n(i);
      }
    );
  }
  function Zf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: I,
      baseState: I,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: mn,
        lastRenderedState: I
      },
      next: null
    };
    var n = {};
    return t.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: mn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Kf(e) {
    var t = Zf(e).next.queue;
    Fl(e, t, {}, Ct());
  }
  function vu() {
    return ot(ba);
  }
  function Pf() {
    return Ke().memoizedState;
  }
  function Jf() {
    return Ke().memoizedState;
  }
  function gp(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Ct();
          e = kn(n);
          var i = Nn(t, e, n);
          i !== null && (Dt(i, t, n), Kl(i, t, n)), t = { cache: Wr() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function pp(e, t, n) {
    var i = Ct();
    n = {
      lane: i,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ps(e) ? If(t, n) : (n = qr(e, t, n, i), n !== null && (Dt(n, e, i), $f(n, t, i)));
  }
  function Wf(e, t, n) {
    var i = Ct();
    Fl(e, t, n, i);
  }
  function Fl(e, t, n, i) {
    var s = {
      lane: i,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ps(e)) If(t, s);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var h = t.lastRenderedState, m = u(h, n);
          if (s.hasEagerState = !0, s.eagerState = m, Rt(m, h))
            return Fa(e, t, s, 0), Ne === null && $a(), !1;
        } catch {
        }
      if (n = qr(e, t, s, i), n !== null)
        return Dt(n, e, i), $f(n, t, i), !0;
    }
    return !1;
  }
  function Su(e, t, n, i) {
    if (i = {
      lane: 2,
      revertLane: Fu(),
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ps(e)) {
      if (t) throw Error(r(479));
    } else
      t = qr(
        e,
        n,
        i,
        2
      ), t !== null && Dt(t, e, 2);
  }
  function ps(e) {
    var t = e.alternate;
    return e === de || t !== null && t === de;
  }
  function If(e, t) {
    $i = os = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function $f(e, t, n) {
    if ((n & 4194048) !== 0) {
      var i = t.lanes;
      i &= e.pendingLanes, n |= i, t.lanes = n, lo(e, n);
    }
  }
  var bs = {
    readContext: ot,
    use: hs,
    useCallback: Ve,
    useContext: Ve,
    useEffect: Ve,
    useImperativeHandle: Ve,
    useLayoutEffect: Ve,
    useInsertionEffect: Ve,
    useMemo: Ve,
    useReducer: Ve,
    useRef: Ve,
    useState: Ve,
    useDebugValue: Ve,
    useDeferredValue: Ve,
    useTransition: Ve,
    useSyncExternalStore: Ve,
    useId: Ve,
    useHostTransitionStatus: Ve,
    useFormState: Ve,
    useActionState: Ve,
    useOptimistic: Ve,
    useMemoCache: Ve,
    useCacheRefresh: Ve
  }, Ff = {
    readContext: ot,
    use: hs,
    useCallback: function(e, t) {
      return vt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ot,
    useEffect: Bf,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, gs(
        4194308,
        4,
        qf.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return gs(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      gs(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = vt();
      t = t === void 0 ? null : t;
      var i = e();
      if (pi) {
        Se(!0);
        try {
          e();
        } finally {
          Se(!1);
        }
      }
      return n.memoizedState = [i, t], i;
    },
    useReducer: function(e, t, n) {
      var i = vt();
      if (n !== void 0) {
        var s = n(t);
        if (pi) {
          Se(!0);
          try {
            n(t);
          } finally {
            Se(!1);
          }
        }
      } else s = t;
      return i.memoizedState = i.baseState = s, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: s
      }, i.queue = e, e = e.dispatch = pp.bind(
        null,
        de,
        e
      ), [i.memoizedState, e];
    },
    useRef: function(e) {
      var t = vt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = gu(e);
      var t = e.queue, n = Wf.bind(null, de, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: bu,
    useDeferredValue: function(e, t) {
      var n = vt();
      return _u(n, e, t);
    },
    useTransition: function() {
      var e = gu(!1);
      return e = Qf.bind(
        null,
        de,
        e.queue,
        !0,
        !1
      ), vt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var i = de, s = vt();
      if (Ae) {
        if (n === void 0)
          throw Error(r(407));
        n = n();
      } else {
        if (n = t(), Ne === null)
          throw Error(r(349));
        (Te & 124) !== 0 || vf(i, t, n);
      }
      s.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return s.queue = u, Bf(Tf.bind(null, i, u, e), [
        e
      ]), i.flags |= 2048, el(
        9,
        ms(),
        Sf.bind(
          null,
          i,
          u,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = vt(), t = Ne.identifierPrefix;
      if (Ae) {
        var n = fn, i = on;
        n = (i & ~(1 << 32 - ae(i) - 1)).toString(32) + n, t = "«" + t + "R" + n, n = fs++, 0 < n && (t += "H" + n.toString(32)), t += "»";
      } else
        n = op++, t = "«" + t + "r" + n.toString(32) + "»";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: vu,
    useFormState: Df,
    useActionState: Df,
    useOptimistic: function(e) {
      var t = vt();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Su.bind(
        null,
        de,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: hu,
    useCacheRefresh: function() {
      return vt().memoizedState = gp.bind(
        null,
        de
      );
    }
  }, eh = {
    readContext: ot,
    use: hs,
    useCallback: Gf,
    useContext: ot,
    useEffect: Lf,
    useImperativeHandle: Yf,
    useInsertionEffect: Hf,
    useLayoutEffect: jf,
    useMemo: Vf,
    useReducer: ds,
    useRef: Nf,
    useState: function() {
      return ds(mn);
    },
    useDebugValue: bu,
    useDeferredValue: function(e, t) {
      var n = Ke();
      return Xf(
        n,
        Me.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ds(mn)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Il(e),
        t
      ];
    },
    useSyncExternalStore: yf,
    useId: Pf,
    useHostTransitionStatus: vu,
    useFormState: zf,
    useActionState: zf,
    useOptimistic: function(e, t) {
      var n = Ke();
      return Rf(n, Me, e, t);
    },
    useMemoCache: hu,
    useCacheRefresh: Jf
  }, bp = {
    readContext: ot,
    use: hs,
    useCallback: Gf,
    useContext: ot,
    useEffect: Lf,
    useImperativeHandle: Yf,
    useInsertionEffect: Hf,
    useLayoutEffect: jf,
    useMemo: Vf,
    useReducer: mu,
    useRef: Nf,
    useState: function() {
      return mu(mn);
    },
    useDebugValue: bu,
    useDeferredValue: function(e, t) {
      var n = Ke();
      return Me === null ? _u(n, e, t) : Xf(
        n,
        Me.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = mu(mn)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Il(e),
        t
      ];
    },
    useSyncExternalStore: yf,
    useId: Pf,
    useHostTransitionStatus: vu,
    useFormState: kf,
    useActionState: kf,
    useOptimistic: function(e, t) {
      var n = Ke();
      return Me !== null ? Rf(n, Me, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: hu,
    useCacheRefresh: Jf
  }, tl = null, ea = 0;
  function _s(e) {
    var t = ea;
    return ea += 1, tl === null && (tl = []), ff(tl, e, t);
  }
  function ta(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ys(e, t) {
    throw t.$$typeof === V ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function th(e) {
    var t = e._init;
    return t(e._payload);
  }
  function nh(e) {
    function t(S, v) {
      if (e) {
        var E = S.deletions;
        E === null ? (S.deletions = [v], S.flags |= 16) : E.push(v);
      }
    }
    function n(S, v) {
      if (!e) return null;
      for (; v !== null; )
        t(S, v), v = v.sibling;
      return null;
    }
    function i(S) {
      for (var v = /* @__PURE__ */ new Map(); S !== null; )
        S.key !== null ? v.set(S.key, S) : v.set(S.index, S), S = S.sibling;
      return v;
    }
    function s(S, v) {
      return S = cn(S, v), S.index = 0, S.sibling = null, S;
    }
    function u(S, v, E) {
      return S.index = E, e ? (E = S.alternate, E !== null ? (E = E.index, E < v ? (S.flags |= 67108866, v) : E) : (S.flags |= 67108866, v)) : (S.flags |= 1048576, v);
    }
    function h(S) {
      return e && S.alternate === null && (S.flags |= 67108866), S;
    }
    function m(S, v, E, C) {
      return v === null || v.tag !== 6 ? (v = Gr(E, S.mode, C), v.return = S, v) : (v = s(v, E), v.return = S, v);
    }
    function p(S, v, E, C) {
      var Q = E.type;
      return Q === F ? M(
        S,
        v,
        E.props.children,
        C,
        E.key
      ) : v !== null && (v.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Z && th(Q) === v.type) ? (v = s(v, E.props), ta(v, E), v.return = S, v) : (v = ts(
        E.type,
        E.key,
        E.props,
        null,
        S.mode,
        C
      ), ta(v, E), v.return = S, v);
    }
    function w(S, v, E, C) {
      return v === null || v.tag !== 4 || v.stateNode.containerInfo !== E.containerInfo || v.stateNode.implementation !== E.implementation ? (v = Vr(E, S.mode, C), v.return = S, v) : (v = s(v, E.children || []), v.return = S, v);
    }
    function M(S, v, E, C, Q) {
      return v === null || v.tag !== 7 ? (v = ui(
        E,
        S.mode,
        C,
        Q
      ), v.return = S, v) : (v = s(v, E), v.return = S, v);
    }
    function z(S, v, E) {
      if (typeof v == "string" && v !== "" || typeof v == "number" || typeof v == "bigint")
        return v = Gr(
          "" + v,
          S.mode,
          E
        ), v.return = S, v;
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case P:
            return E = ts(
              v.type,
              v.key,
              v.props,
              null,
              S.mode,
              E
            ), ta(E, v), E.return = S, E;
          case W:
            return v = Vr(
              v,
              S.mode,
              E
            ), v.return = S, v;
          case Z:
            var C = v._init;
            return v = C(v._payload), z(S, v, E);
        }
        if (Qe(v) || Be(v))
          return v = ui(
            v,
            S.mode,
            E,
            null
          ), v.return = S, v;
        if (typeof v.then == "function")
          return z(S, _s(v), E);
        if (v.$$typeof === me)
          return z(
            S,
            as(S, v),
            E
          );
        ys(S, v);
      }
      return null;
    }
    function R(S, v, E, C) {
      var Q = v !== null ? v.key : null;
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return Q !== null ? null : m(S, v, "" + E, C);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case P:
            return E.key === Q ? p(S, v, E, C) : null;
          case W:
            return E.key === Q ? w(S, v, E, C) : null;
          case Z:
            return Q = E._init, E = Q(E._payload), R(S, v, E, C);
        }
        if (Qe(E) || Be(E))
          return Q !== null ? null : M(S, v, E, C, null);
        if (typeof E.then == "function")
          return R(
            S,
            v,
            _s(E),
            C
          );
        if (E.$$typeof === me)
          return R(
            S,
            v,
            as(S, E),
            C
          );
        ys(S, E);
      }
      return null;
    }
    function A(S, v, E, C, Q) {
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return S = S.get(E) || null, m(v, S, "" + C, Q);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case P:
            return S = S.get(
              C.key === null ? E : C.key
            ) || null, p(v, S, C, Q);
          case W:
            return S = S.get(
              C.key === null ? E : C.key
            ) || null, w(v, S, C, Q);
          case Z:
            var ge = C._init;
            return C = ge(C._payload), A(
              S,
              v,
              E,
              C,
              Q
            );
        }
        if (Qe(C) || Be(C))
          return S = S.get(E) || null, M(v, S, C, Q, null);
        if (typeof C.then == "function")
          return A(
            S,
            v,
            E,
            _s(C),
            Q
          );
        if (C.$$typeof === me)
          return A(
            S,
            v,
            E,
            as(v, C),
            Q
          );
        ys(v, C);
      }
      return null;
    }
    function ne(S, v, E, C) {
      for (var Q = null, ge = null, J = v, te = v = 0, it = null; J !== null && te < E.length; te++) {
        J.index > te ? (it = J, J = null) : it = J.sibling;
        var we = R(
          S,
          J,
          E[te],
          C
        );
        if (we === null) {
          J === null && (J = it);
          break;
        }
        e && J && we.alternate === null && t(S, J), v = u(we, v, te), ge === null ? Q = we : ge.sibling = we, ge = we, J = it;
      }
      if (te === E.length)
        return n(S, J), Ae && oi(S, te), Q;
      if (J === null) {
        for (; te < E.length; te++)
          J = z(S, E[te], C), J !== null && (v = u(
            J,
            v,
            te
          ), ge === null ? Q = J : ge.sibling = J, ge = J);
        return Ae && oi(S, te), Q;
      }
      for (J = i(J); te < E.length; te++)
        it = A(
          J,
          S,
          te,
          E[te],
          C
        ), it !== null && (e && it.alternate !== null && J.delete(
          it.key === null ? te : it.key
        ), v = u(
          it,
          v,
          te
        ), ge === null ? Q = it : ge.sibling = it, ge = it);
      return e && J.forEach(function($n) {
        return t(S, $n);
      }), Ae && oi(S, te), Q;
    }
    function ee(S, v, E, C) {
      if (E == null) throw Error(r(151));
      for (var Q = null, ge = null, J = v, te = v = 0, it = null, we = E.next(); J !== null && !we.done; te++, we = E.next()) {
        J.index > te ? (it = J, J = null) : it = J.sibling;
        var $n = R(S, J, we.value, C);
        if ($n === null) {
          J === null && (J = it);
          break;
        }
        e && J && $n.alternate === null && t(S, J), v = u($n, v, te), ge === null ? Q = $n : ge.sibling = $n, ge = $n, J = it;
      }
      if (we.done)
        return n(S, J), Ae && oi(S, te), Q;
      if (J === null) {
        for (; !we.done; te++, we = E.next())
          we = z(S, we.value, C), we !== null && (v = u(we, v, te), ge === null ? Q = we : ge.sibling = we, ge = we);
        return Ae && oi(S, te), Q;
      }
      for (J = i(J); !we.done; te++, we = E.next())
        we = A(J, S, te, we.value, C), we !== null && (e && we.alternate !== null && J.delete(we.key === null ? te : we.key), v = u(we, v, te), ge === null ? Q = we : ge.sibling = we, ge = we);
      return e && J.forEach(function(_b) {
        return t(S, _b);
      }), Ae && oi(S, te), Q;
    }
    function De(S, v, E, C) {
      if (typeof E == "object" && E !== null && E.type === F && E.key === null && (E = E.props.children), typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case P:
            e: {
              for (var Q = E.key; v !== null; ) {
                if (v.key === Q) {
                  if (Q = E.type, Q === F) {
                    if (v.tag === 7) {
                      n(
                        S,
                        v.sibling
                      ), C = s(
                        v,
                        E.props.children
                      ), C.return = S, S = C;
                      break e;
                    }
                  } else if (v.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Z && th(Q) === v.type) {
                    n(
                      S,
                      v.sibling
                    ), C = s(v, E.props), ta(C, E), C.return = S, S = C;
                    break e;
                  }
                  n(S, v);
                  break;
                } else t(S, v);
                v = v.sibling;
              }
              E.type === F ? (C = ui(
                E.props.children,
                S.mode,
                C,
                E.key
              ), C.return = S, S = C) : (C = ts(
                E.type,
                E.key,
                E.props,
                null,
                S.mode,
                C
              ), ta(C, E), C.return = S, S = C);
            }
            return h(S);
          case W:
            e: {
              for (Q = E.key; v !== null; ) {
                if (v.key === Q)
                  if (v.tag === 4 && v.stateNode.containerInfo === E.containerInfo && v.stateNode.implementation === E.implementation) {
                    n(
                      S,
                      v.sibling
                    ), C = s(v, E.children || []), C.return = S, S = C;
                    break e;
                  } else {
                    n(S, v);
                    break;
                  }
                else t(S, v);
                v = v.sibling;
              }
              C = Vr(E, S.mode, C), C.return = S, S = C;
            }
            return h(S);
          case Z:
            return Q = E._init, E = Q(E._payload), De(
              S,
              v,
              E,
              C
            );
        }
        if (Qe(E))
          return ne(
            S,
            v,
            E,
            C
          );
        if (Be(E)) {
          if (Q = Be(E), typeof Q != "function") throw Error(r(150));
          return E = Q.call(E), ee(
            S,
            v,
            E,
            C
          );
        }
        if (typeof E.then == "function")
          return De(
            S,
            v,
            _s(E),
            C
          );
        if (E.$$typeof === me)
          return De(
            S,
            v,
            as(S, E),
            C
          );
        ys(S, E);
      }
      return typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint" ? (E = "" + E, v !== null && v.tag === 6 ? (n(S, v.sibling), C = s(v, E), C.return = S, S = C) : (n(S, v), C = Gr(E, S.mode, C), C.return = S, S = C), h(S)) : n(S, v);
    }
    return function(S, v, E, C) {
      try {
        ea = 0;
        var Q = De(
          S,
          v,
          E,
          C
        );
        return tl = null, Q;
      } catch (J) {
        if (J === Ql || J === rs) throw J;
        var ge = At(29, J, null, S.mode);
        return ge.lanes = C, ge.return = S, ge;
      }
    };
  }
  var nl = nh(!0), ih = nh(!1), qt = k(null), tn = null;
  function Ln(e) {
    var t = e.alternate;
    L(Ie, Ie.current & 1), L(qt, e), tn === null && (t === null || Ii.current !== null || t.memoizedState !== null) && (tn = e);
  }
  function lh(e) {
    if (e.tag === 22) {
      if (L(Ie, Ie.current), L(qt, e), tn === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (tn = e);
      }
    } else Hn();
  }
  function Hn() {
    L(Ie, Ie.current), L(qt, qt.current);
  }
  function gn(e) {
    j(qt), tn === e && (tn = null), j(Ie);
  }
  var Ie = k(0);
  function vs(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || fc(n)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  function Tu(e, t, n, i) {
    t = e.memoizedState, n = n(i, t), n = n == null ? t : T({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Eu = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var i = Ct(), s = kn(i);
      s.payload = t, n != null && (s.callback = n), t = Nn(e, s, i), t !== null && (Dt(t, e, i), Kl(t, e, i));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var i = Ct(), s = kn(i);
      s.tag = 1, s.payload = t, n != null && (s.callback = n), t = Nn(e, s, i), t !== null && (Dt(t, e, i), Kl(t, e, i));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = Ct(), i = kn(n);
      i.tag = 2, t != null && (i.callback = t), t = Nn(e, i, n), t !== null && (Dt(t, e, n), Kl(t, e, n));
    }
  };
  function ah(e, t, n, i, s, u, h) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(i, u, h) : t.prototype && t.prototype.isPureReactComponent ? !Ll(n, i) || !Ll(s, u) : !0;
  }
  function sh(e, t, n, i) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, i), t.state !== e && Eu.enqueueReplaceState(t, t.state, null);
  }
  function bi(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var i in t)
        i !== "ref" && (n[i] = t[i]);
    }
    if (e = e.defaultProps) {
      n === t && (n = T({}, n));
      for (var s in e)
        n[s] === void 0 && (n[s] = e[s]);
    }
    return n;
  }
  var Ss = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  };
  function rh(e) {
    Ss(e);
  }
  function uh(e) {
    console.error(e);
  }
  function ch(e) {
    Ss(e);
  }
  function Ts(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function oh(e, t, n) {
    try {
      var i = e.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function wu(e, t, n) {
    return n = kn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Ts(e, t);
    }, n;
  }
  function fh(e) {
    return e = kn(e), e.tag = 3, e;
  }
  function hh(e, t, n, i) {
    var s = n.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var u = i.value;
      e.payload = function() {
        return s(u);
      }, e.callback = function() {
        oh(t, n, i);
      };
    }
    var h = n.stateNode;
    h !== null && typeof h.componentDidCatch == "function" && (e.callback = function() {
      oh(t, n, i), typeof s != "function" && (Xn === null ? Xn = /* @__PURE__ */ new Set([this]) : Xn.add(this));
      var m = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: m !== null ? m : ""
      });
    });
  }
  function _p(e, t, n, i, s) {
    if (n.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (t = n.alternate, t !== null && Gl(
        t,
        n,
        s,
        !0
      ), n = qt.current, n !== null) {
        switch (n.tag) {
          case 13:
            return tn === null ? Pu() : n.alternate === null && Ge === 0 && (Ge = 3), n.flags &= -257, n.flags |= 65536, n.lanes = s, i === Fr ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([i]) : t.add(i), Wu(e, i, s)), !1;
          case 22:
            return n.flags |= 65536, i === Fr ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([i])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([i]) : n.add(i)), Wu(e, i, s)), !1;
        }
        throw Error(r(435, n.tag));
      }
      return Wu(e, i, s), Pu(), !1;
    }
    if (Ae)
      return t = qt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = s, i !== Zr && (e = Error(r(422), { cause: i }), Yl(Bt(e, n)))) : (i !== Zr && (t = Error(r(423), {
        cause: i
      }), Yl(
        Bt(t, n)
      )), e = e.current.alternate, e.flags |= 65536, s &= -s, e.lanes |= s, i = Bt(i, n), s = wu(
        e.stateNode,
        i,
        s
      ), nu(e, s), Ge !== 4 && (Ge = 2)), !1;
    var u = Error(r(520), { cause: i });
    if (u = Bt(u, n), ua === null ? ua = [u] : ua.push(u), Ge !== 4 && (Ge = 2), t === null) return !0;
    i = Bt(i, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = s & -s, n.lanes |= e, e = wu(n.stateNode, i, e), nu(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Xn === null || !Xn.has(u))))
            return n.flags |= 65536, s &= -s, n.lanes |= s, s = fh(s), hh(
              s,
              e,
              n,
              i
            ), nu(n, s), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var dh = Error(r(461)), tt = !1;
  function at(e, t, n, i) {
    t.child = e === null ? ih(t, null, n, i) : nl(
      t,
      e.child,
      n,
      i
    );
  }
  function mh(e, t, n, i, s) {
    n = n.render;
    var u = t.ref;
    if ("ref" in i) {
      var h = {};
      for (var m in i)
        m !== "ref" && (h[m] = i[m]);
    } else h = i;
    return mi(t), i = ru(
      e,
      t,
      n,
      h,
      u,
      s
    ), m = uu(), e !== null && !tt ? (cu(e, t, s), pn(e, t, s)) : (Ae && m && Xr(t), t.flags |= 1, at(e, t, i, s), t.child);
  }
  function gh(e, t, n, i, s) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Yr(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, ph(
        e,
        t,
        u,
        i,
        s
      )) : (e = ts(
        n.type,
        null,
        i,
        t,
        t.mode,
        s
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !zu(e, s)) {
      var h = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Ll, n(h, i) && e.ref === t.ref)
        return pn(e, t, s);
    }
    return t.flags |= 1, e = cn(u, i), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ph(e, t, n, i, s) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Ll(u, i) && e.ref === t.ref)
        if (tt = !1, t.pendingProps = i = u, zu(e, s))
          (e.flags & 131072) !== 0 && (tt = !0);
        else
          return t.lanes = e.lanes, pn(e, t, s);
    }
    return Ru(
      e,
      t,
      n,
      i,
      s
    );
  }
  function bh(e, t, n) {
    var i = t.pendingProps, s = i.children, u = e !== null ? e.memoizedState : null;
    if (i.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = u !== null ? u.baseLanes | n : n, e !== null) {
          for (s = t.child = e.child, u = 0; s !== null; )
            u = u | s.lanes | s.childLanes, s = s.sibling;
          t.childLanes = u & ~i;
        } else t.childLanes = 0, t.child = null;
        return _h(
          e,
          t,
          i,
          n
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ss(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? pf(t, u) : lu(), lh(t);
      else
        return t.lanes = t.childLanes = 536870912, _h(
          e,
          t,
          u !== null ? u.baseLanes | n : n,
          n
        );
    } else
      u !== null ? (ss(t, u.cachePool), pf(t, u), Hn(), t.memoizedState = null) : (e !== null && ss(t, null), lu(), Hn());
    return at(e, t, s, n), t.child;
  }
  function _h(e, t, n, i) {
    var s = $r();
    return s = s === null ? null : { parent: We._currentValue, pool: s }, t.memoizedState = {
      baseLanes: n,
      cachePool: s
    }, e !== null && ss(t, null), lu(), lh(t), e !== null && Gl(e, t, i, !0), null;
  }
  function Es(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(r(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Ru(e, t, n, i, s) {
    return mi(t), n = ru(
      e,
      t,
      n,
      i,
      void 0,
      s
    ), i = uu(), e !== null && !tt ? (cu(e, t, s), pn(e, t, s)) : (Ae && i && Xr(t), t.flags |= 1, at(e, t, n, s), t.child);
  }
  function yh(e, t, n, i, s, u) {
    return mi(t), t.updateQueue = null, n = _f(
      t,
      i,
      n,
      s
    ), bf(e), i = uu(), e !== null && !tt ? (cu(e, t, u), pn(e, t, u)) : (Ae && i && Xr(t), t.flags |= 1, at(e, t, n, u), t.child);
  }
  function vh(e, t, n, i, s) {
    if (mi(t), t.stateNode === null) {
      var u = Zi, h = n.contextType;
      typeof h == "object" && h !== null && (u = ot(h)), u = new n(i, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Eu, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = i, u.state = t.memoizedState, u.refs = {}, eu(t), h = n.contextType, u.context = typeof h == "object" && h !== null ? ot(h) : Zi, u.state = t.memoizedState, h = n.getDerivedStateFromProps, typeof h == "function" && (Tu(
        t,
        n,
        h,
        i
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (h = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), h !== u.state && Eu.enqueueReplaceState(u, u.state, null), Jl(t, i, u, s), Pl(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), i = !0;
    } else if (e === null) {
      u = t.stateNode;
      var m = t.memoizedProps, p = bi(n, m);
      u.props = p;
      var w = u.context, M = n.contextType;
      h = Zi, typeof M == "object" && M !== null && (h = ot(M));
      var z = n.getDerivedStateFromProps;
      M = typeof z == "function" || typeof u.getSnapshotBeforeUpdate == "function", m = t.pendingProps !== m, M || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (m || w !== h) && sh(
        t,
        u,
        i,
        h
      ), Un = !1;
      var R = t.memoizedState;
      u.state = R, Jl(t, i, u, s), Pl(), w = t.memoizedState, m || R !== w || Un ? (typeof z == "function" && (Tu(
        t,
        n,
        z,
        i
      ), w = t.memoizedState), (p = Un || ah(
        t,
        n,
        p,
        i,
        R,
        w,
        h
      )) ? (M || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = i, t.memoizedState = w), u.props = i, u.state = w, u.context = h, i = p) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), i = !1);
    } else {
      u = t.stateNode, tu(e, t), h = t.memoizedProps, M = bi(n, h), u.props = M, z = t.pendingProps, R = u.context, w = n.contextType, p = Zi, typeof w == "object" && w !== null && (p = ot(w)), m = n.getDerivedStateFromProps, (w = typeof m == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (h !== z || R !== p) && sh(
        t,
        u,
        i,
        p
      ), Un = !1, R = t.memoizedState, u.state = R, Jl(t, i, u, s), Pl();
      var A = t.memoizedState;
      h !== z || R !== A || Un || e !== null && e.dependencies !== null && ls(e.dependencies) ? (typeof m == "function" && (Tu(
        t,
        n,
        m,
        i
      ), A = t.memoizedState), (M = Un || ah(
        t,
        n,
        M,
        i,
        R,
        A,
        p
      ) || e !== null && e.dependencies !== null && ls(e.dependencies)) ? (w || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(i, A, p), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        i,
        A,
        p
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || h === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = i, t.memoizedState = A), u.props = i, u.state = A, u.context = p, i = M) : (typeof u.componentDidUpdate != "function" || h === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), i = !1);
    }
    return u = i, Es(e, t), i = (t.flags & 128) !== 0, u || i ? (u = t.stateNode, n = i && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && i ? (t.child = nl(
      t,
      e.child,
      null,
      s
    ), t.child = nl(
      t,
      null,
      n,
      s
    )) : at(e, t, n, s), t.memoizedState = u.state, e = t.child) : e = pn(
      e,
      t,
      s
    ), e;
  }
  function Sh(e, t, n, i) {
    return ql(), t.flags |= 256, at(e, t, n, i), t.child;
  }
  var Au = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function xu(e) {
    return { baseLanes: e, cachePool: uf() };
  }
  function Ou(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Yt), e;
  }
  function Th(e, t, n) {
    var i = t.pendingProps, s = !1, u = (t.flags & 128) !== 0, h;
    if ((h = u) || (h = e !== null && e.memoizedState === null ? !1 : (Ie.current & 2) !== 0), h && (s = !0, t.flags &= -129), h = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ae) {
        if (s ? Ln(t) : Hn(), Ae) {
          var m = Ye, p;
          if (p = m) {
            e: {
              for (p = m, m = en; p.nodeType !== 8; ) {
                if (!m) {
                  m = null;
                  break e;
                }
                if (p = Kt(
                  p.nextSibling
                ), p === null) {
                  m = null;
                  break e;
                }
              }
              m = p;
            }
            m !== null ? (t.memoizedState = {
              dehydrated: m,
              treeContext: ci !== null ? { id: on, overflow: fn } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, p = At(
              18,
              null,
              null,
              0
            ), p.stateNode = m, p.return = t, t.child = p, mt = t, Ye = null, p = !0) : p = !1;
          }
          p || hi(t);
        }
        if (m = t.memoizedState, m !== null && (m = m.dehydrated, m !== null))
          return fc(m) ? t.lanes = 32 : t.lanes = 536870912, null;
        gn(t);
      }
      return m = i.children, i = i.fallback, s ? (Hn(), s = t.mode, m = ws(
        { mode: "hidden", children: m },
        s
      ), i = ui(
        i,
        s,
        n,
        null
      ), m.return = t, i.return = t, m.sibling = i, t.child = m, s = t.child, s.memoizedState = xu(n), s.childLanes = Ou(
        e,
        h,
        n
      ), t.memoizedState = Au, i) : (Ln(t), Mu(t, m));
    }
    if (p = e.memoizedState, p !== null && (m = p.dehydrated, m !== null)) {
      if (u)
        t.flags & 256 ? (Ln(t), t.flags &= -257, t = Cu(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (Hn(), t.child = e.child, t.flags |= 128, t = null) : (Hn(), s = i.fallback, m = t.mode, i = ws(
          { mode: "visible", children: i.children },
          m
        ), s = ui(
          s,
          m,
          n,
          null
        ), s.flags |= 2, i.return = t, s.return = t, i.sibling = s, t.child = i, nl(
          t,
          e.child,
          null,
          n
        ), i = t.child, i.memoizedState = xu(n), i.childLanes = Ou(
          e,
          h,
          n
        ), t.memoizedState = Au, t = s);
      else if (Ln(t), fc(m)) {
        if (h = m.nextSibling && m.nextSibling.dataset, h) var w = h.dgst;
        h = w, i = Error(r(419)), i.stack = "", i.digest = h, Yl({ value: i, source: null, stack: null }), t = Cu(
          e,
          t,
          n
        );
      } else if (tt || Gl(e, t, n, !1), h = (n & e.childLanes) !== 0, tt || h) {
        if (h = Ne, h !== null && (i = n & -n, i = (i & 42) !== 0 ? 1 : hr(i), i = (i & (h.suspendedLanes | n)) !== 0 ? 0 : i, i !== 0 && i !== p.retryLane))
          throw p.retryLane = i, Qi(e, i), Dt(h, e, i), dh;
        m.data === "$?" || Pu(), t = Cu(
          e,
          t,
          n
        );
      } else
        m.data === "$?" ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, Ye = Kt(
          m.nextSibling
        ), mt = t, Ae = !0, fi = null, en = !1, e !== null && (Ht[jt++] = on, Ht[jt++] = fn, Ht[jt++] = ci, on = e.id, fn = e.overflow, ci = t), t = Mu(
          t,
          i.children
        ), t.flags |= 4096);
      return t;
    }
    return s ? (Hn(), s = i.fallback, m = t.mode, p = e.child, w = p.sibling, i = cn(p, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = p.subtreeFlags & 65011712, w !== null ? s = cn(w, s) : (s = ui(
      s,
      m,
      n,
      null
    ), s.flags |= 2), s.return = t, i.return = t, i.sibling = s, t.child = i, i = s, s = t.child, m = e.child.memoizedState, m === null ? m = xu(n) : (p = m.cachePool, p !== null ? (w = We._currentValue, p = p.parent !== w ? { parent: w, pool: w } : p) : p = uf(), m = {
      baseLanes: m.baseLanes | n,
      cachePool: p
    }), s.memoizedState = m, s.childLanes = Ou(
      e,
      h,
      n
    ), t.memoizedState = Au, i) : (Ln(t), n = e.child, e = n.sibling, n = cn(n, {
      mode: "visible",
      children: i.children
    }), n.return = t, n.sibling = null, e !== null && (h = t.deletions, h === null ? (t.deletions = [e], t.flags |= 16) : h.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Mu(e, t) {
    return t = ws(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ws(e, t) {
    return e = At(22, e, null, t), e.lanes = 0, e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, e;
  }
  function Cu(e, t, n) {
    return nl(t, e.child, null, n), e = Mu(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Eh(e, t, n) {
    e.lanes |= t;
    var i = e.alternate;
    i !== null && (i.lanes |= t), Pr(e.return, t, n);
  }
  function Du(e, t, n, i, s) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: n,
      tailMode: s
    } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = i, u.tail = n, u.tailMode = s);
  }
  function wh(e, t, n) {
    var i = t.pendingProps, s = i.revealOrder, u = i.tail;
    if (at(e, t, i.children, n), i = Ie.current, (i & 2) !== 0)
      i = i & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Eh(e, n, t);
          else if (e.tag === 19)
            Eh(e, n, t);
          else if (e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t)
              break e;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      i &= 1;
    }
    switch (L(Ie, i), s) {
      case "forwards":
        for (n = t.child, s = null; n !== null; )
          e = n.alternate, e !== null && vs(e) === null && (s = n), n = n.sibling;
        n = s, n === null ? (s = t.child, t.child = null) : (s = n.sibling, n.sibling = null), Du(
          t,
          !1,
          s,
          n,
          u
        );
        break;
      case "backwards":
        for (n = null, s = t.child, t.child = null; s !== null; ) {
          if (e = s.alternate, e !== null && vs(e) === null) {
            t.child = s;
            break;
          }
          e = s.sibling, s.sibling = n, n = s, s = e;
        }
        Du(
          t,
          !0,
          n,
          null,
          u
        );
        break;
      case "together":
        Du(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function pn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Vn |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (Gl(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, n = cn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = cn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function zu(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ls(e)));
  }
  function yp(e, t, n) {
    switch (t.tag) {
      case 3:
        ze(t, t.stateNode.containerInfo), zn(t, We, e.memoizedState.cache), ql();
        break;
      case 27:
      case 5:
        ni(t);
        break;
      case 4:
        ze(t, t.stateNode.containerInfo);
        break;
      case 10:
        zn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var i = t.memoizedState;
        if (i !== null)
          return i.dehydrated !== null ? (Ln(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Th(e, t, n) : (Ln(t), e = pn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        Ln(t);
        break;
      case 19:
        var s = (e.flags & 128) !== 0;
        if (i = (n & t.childLanes) !== 0, i || (Gl(
          e,
          t,
          n,
          !1
        ), i = (n & t.childLanes) !== 0), s) {
          if (i)
            return wh(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (s = t.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), L(Ie, Ie.current), i) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, bh(e, t, n);
      case 24:
        zn(t, We, e.memoizedState.cache);
    }
    return pn(e, t, n);
  }
  function Rh(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        tt = !0;
      else {
        if (!zu(e, n) && (t.flags & 128) === 0)
          return tt = !1, yp(
            e,
            t,
            n
          );
        tt = (e.flags & 131072) !== 0;
      }
    else
      tt = !1, Ae && (t.flags & 1048576) !== 0 && ef(t, is, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var i = t.elementType, s = i._init;
          if (i = s(i._payload), t.type = i, typeof i == "function")
            Yr(i) ? (e = bi(i, e), t.tag = 1, t = vh(
              null,
              t,
              i,
              e,
              n
            )) : (t.tag = 0, t = Ru(
              null,
              t,
              i,
              e,
              n
            ));
          else {
            if (i != null) {
              if (s = i.$$typeof, s === N) {
                t.tag = 11, t = mh(
                  null,
                  t,
                  i,
                  e,
                  n
                );
                break e;
              } else if (s === q) {
                t.tag = 14, t = gh(
                  null,
                  t,
                  i,
                  e,
                  n
                );
                break e;
              }
            }
            throw t = ut(i) || i, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ru(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return i = t.type, s = bi(
          i,
          t.pendingProps
        ), vh(
          e,
          t,
          i,
          s,
          n
        );
      case 3:
        e: {
          if (ze(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          i = t.pendingProps;
          var u = t.memoizedState;
          s = u.element, tu(e, t), Jl(t, i, null, n);
          var h = t.memoizedState;
          if (i = h.cache, zn(t, We, i), i !== u.cache && Jr(
            t,
            [We],
            n,
            !0
          ), Pl(), i = h.element, u.isDehydrated)
            if (u = {
              element: i,
              isDehydrated: !1,
              cache: h.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Sh(
                e,
                t,
                i,
                n
              );
              break e;
            } else if (i !== s) {
              s = Bt(
                Error(r(424)),
                t
              ), Yl(s), t = Sh(
                e,
                t,
                i,
                n
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Ye = Kt(e.firstChild), mt = t, Ae = !0, fi = null, en = !0, n = ih(
                t,
                null,
                i,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (ql(), i === s) {
              t = pn(
                e,
                t,
                n
              );
              break e;
            }
            at(
              e,
              t,
              i,
              n
            );
          }
          t = t.child;
        }
        return t;
      case 26:
        return Es(e, t), e === null ? (n = Md(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ae || (n = t.type, e = t.pendingProps, i = Hs(
          le.current
        ).createElement(n), i[ct] = t, i[_t] = e, rt(i, n, e), et(i), t.stateNode = i) : t.memoizedState = Md(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return ni(t), e === null && Ae && (i = t.stateNode = Ad(
          t.type,
          t.pendingProps,
          le.current
        ), mt = t, en = !0, s = Ye, Kn(t.type) ? (hc = s, Ye = Kt(
          i.firstChild
        )) : Ye = s), at(
          e,
          t,
          t.pendingProps.children,
          n
        ), Es(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ae && ((s = i = Ye) && (i = Kp(
          i,
          t.type,
          t.pendingProps,
          en
        ), i !== null ? (t.stateNode = i, mt = t, Ye = Kt(
          i.firstChild
        ), en = !1, s = !0) : s = !1), s || hi(t)), ni(t), s = t.type, u = t.pendingProps, h = e !== null ? e.memoizedProps : null, i = u.children, uc(s, u) ? i = null : h !== null && uc(s, h) && (t.flags |= 32), t.memoizedState !== null && (s = ru(
          e,
          t,
          fp,
          null,
          null,
          n
        ), ba._currentValue = s), Es(e, t), at(e, t, i, n), t.child;
      case 6:
        return e === null && Ae && ((e = n = Ye) && (n = Pp(
          n,
          t.pendingProps,
          en
        ), n !== null ? (t.stateNode = n, mt = t, Ye = null, e = !0) : e = !1), e || hi(t)), null;
      case 13:
        return Th(e, t, n);
      case 4:
        return ze(
          t,
          t.stateNode.containerInfo
        ), i = t.pendingProps, e === null ? t.child = nl(
          t,
          null,
          i,
          n
        ) : at(
          e,
          t,
          i,
          n
        ), t.child;
      case 11:
        return mh(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return at(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return at(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return at(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return i = t.pendingProps, zn(t, t.type, i.value), at(
          e,
          t,
          i.children,
          n
        ), t.child;
      case 9:
        return s = t.type._context, i = t.pendingProps.children, mi(t), s = ot(s), i = i(s), t.flags |= 1, at(e, t, i, n), t.child;
      case 14:
        return gh(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return ph(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return wh(e, t, n);
      case 31:
        return i = t.pendingProps, n = t.mode, i = {
          mode: i.mode,
          children: i.children
        }, e === null ? (n = ws(
          i,
          n
        ), n.ref = t.ref, t.child = n, n.return = t, t = n) : (n = cn(e.child, i), n.ref = t.ref, t.child = n, n.return = t, t = n), t;
      case 22:
        return bh(e, t, n);
      case 24:
        return mi(t), i = ot(We), e === null ? (s = $r(), s === null && (s = Ne, u = Wr(), s.pooledCache = u, u.refCount++, u !== null && (s.pooledCacheLanes |= n), s = u), t.memoizedState = {
          parent: i,
          cache: s
        }, eu(t), zn(t, We, s)) : ((e.lanes & n) !== 0 && (tu(e, t), Jl(t, null, null, n), Pl()), s = e.memoizedState, u = t.memoizedState, s.parent !== i ? (s = { parent: i, cache: i }, t.memoizedState = s, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = s), zn(t, We, i)) : (i = u.cache, zn(t, We, i), i !== s.cache && Jr(
          t,
          [We],
          n,
          !0
        ))), at(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function bn(e) {
    e.flags |= 4;
  }
  function Ah(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !kd(t)) {
      if (t = qt.current, t !== null && ((Te & 4194048) === Te ? tn !== null : (Te & 62914560) !== Te && (Te & 536870912) === 0 || t !== tn))
        throw Zl = Fr, cf;
      e.flags |= 8192;
    }
  }
  function Rs(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? no() : 536870912, e.lanes |= t, sl |= t);
  }
  function na(e, t) {
    if (!Ae)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = e.tail;
          for (var i = null; n !== null; )
            n.alternate !== null && (i = n), n = n.sibling;
          i === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : i.sibling = null;
      }
  }
  function je(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, i = 0;
    if (t)
      for (var s = e.child; s !== null; )
        n |= s.lanes | s.childLanes, i |= s.subtreeFlags & 65011712, i |= s.flags & 65011712, s.return = e, s = s.sibling;
    else
      for (s = e.child; s !== null; )
        n |= s.lanes | s.childLanes, i |= s.subtreeFlags, i |= s.flags, s.return = e, s = s.sibling;
    return e.subtreeFlags |= i, e.childLanes = n, t;
  }
  function vp(e, t, n) {
    var i = t.pendingProps;
    switch (Qr(t), t.tag) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return je(t), null;
      case 1:
        return je(t), null;
      case 3:
        return n = t.stateNode, i = null, e !== null && (i = e.memoizedState.cache), t.memoizedState.cache !== i && (t.flags |= 2048), dn(We), wt(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (jl(t) ? bn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, lf())), je(t), null;
      case 26:
        return n = t.memoizedState, e === null ? (bn(t), n !== null ? (je(t), Ah(t, n)) : (je(t), t.flags &= -16777217)) : n ? n !== e.memoizedState ? (bn(t), je(t), Ah(t, n)) : (je(t), t.flags &= -16777217) : (e.memoizedProps !== i && bn(t), je(t), t.flags &= -16777217), null;
      case 27:
        sn(t), n = le.current;
        var s = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== i && bn(t);
        else {
          if (!i) {
            if (t.stateNode === null)
              throw Error(r(166));
            return je(t), null;
          }
          e = $.current, jl(t) ? tf(t) : (e = Ad(s, i, n), t.stateNode = e, bn(t));
        }
        return je(t), null;
      case 5:
        if (sn(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== i && bn(t);
        else {
          if (!i) {
            if (t.stateNode === null)
              throw Error(r(166));
            return je(t), null;
          }
          if (e = $.current, jl(t))
            tf(t);
          else {
            switch (s = Hs(
              le.current
            ), e) {
              case 1:
                e = s.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                e = s.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    e = s.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    e = s.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    e = s.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild);
                    break;
                  case "select":
                    e = typeof i.is == "string" ? s.createElement("select", { is: i.is }) : s.createElement("select"), i.multiple ? e.multiple = !0 : i.size && (e.size = i.size);
                    break;
                  default:
                    e = typeof i.is == "string" ? s.createElement(n, { is: i.is }) : s.createElement(n);
                }
            }
            e[ct] = t, e[_t] = i;
            e: for (s = t.child; s !== null; ) {
              if (s.tag === 5 || s.tag === 6)
                e.appendChild(s.stateNode);
              else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                s.child.return = s, s = s.child;
                continue;
              }
              if (s === t) break e;
              for (; s.sibling === null; ) {
                if (s.return === null || s.return === t)
                  break e;
                s = s.return;
              }
              s.sibling.return = s.return, s = s.sibling;
            }
            t.stateNode = e;
            e: switch (rt(e, n, i), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!i.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && bn(t);
          }
        }
        return je(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== i && bn(t);
        else {
          if (typeof i != "string" && t.stateNode === null)
            throw Error(r(166));
          if (e = le.current, jl(t)) {
            if (e = t.stateNode, n = t.memoizedProps, i = null, s = mt, s !== null)
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            e[ct] = t, e = !!(e.nodeValue === n || i !== null && i.suppressHydrationWarning === !0 || yd(e.nodeValue, n)), e || hi(t);
          } else
            e = Hs(e).createTextNode(
              i
            ), e[ct] = t, t.stateNode = e;
        }
        return je(t), null;
      case 13:
        if (i = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (s = jl(t), i !== null && i.dehydrated !== null) {
            if (e === null) {
              if (!s) throw Error(r(318));
              if (s = t.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(r(317));
              s[ct] = t;
            } else
              ql(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            je(t), s = !1;
          } else
            s = lf(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = s), s = !0;
          if (!s)
            return t.flags & 256 ? (gn(t), t) : (gn(t), null);
        }
        if (gn(t), (t.flags & 128) !== 0)
          return t.lanes = n, t;
        if (n = i !== null, e = e !== null && e.memoizedState !== null, n) {
          i = t.child, s = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (s = i.alternate.memoizedState.cachePool.pool);
          var u = null;
          i.memoizedState !== null && i.memoizedState.cachePool !== null && (u = i.memoizedState.cachePool.pool), u !== s && (i.flags |= 2048);
        }
        return n !== e && n && (t.child.flags |= 8192), Rs(t, t.updateQueue), je(t), null;
      case 4:
        return wt(), e === null && ic(t.stateNode.containerInfo), je(t), null;
      case 10:
        return dn(t.type), je(t), null;
      case 19:
        if (j(Ie), s = t.memoizedState, s === null) return je(t), null;
        if (i = (t.flags & 128) !== 0, u = s.rendering, u === null)
          if (i) na(s, !1);
          else {
            if (Ge !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = vs(e), u !== null) {
                  for (t.flags |= 128, na(s, !1), e = u.updateQueue, t.updateQueue = e, Rs(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Fo(n, e), n = n.sibling;
                  return L(
                    Ie,
                    Ie.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            s.tail !== null && Ut() > Os && (t.flags |= 128, i = !0, na(s, !1), t.lanes = 4194304);
          }
        else {
          if (!i)
            if (e = vs(u), e !== null) {
              if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Rs(t, e), na(s, !0), s.tail === null && s.tailMode === "hidden" && !u.alternate && !Ae)
                return je(t), null;
            } else
              2 * Ut() - s.renderingStartTime > Os && n !== 536870912 && (t.flags |= 128, i = !0, na(s, !1), t.lanes = 4194304);
          s.isBackwards ? (u.sibling = t.child, t.child = u) : (e = s.last, e !== null ? e.sibling = u : t.child = u, s.last = u);
        }
        return s.tail !== null ? (t = s.tail, s.rendering = t, s.tail = t.sibling, s.renderingStartTime = Ut(), t.sibling = null, e = Ie.current, L(Ie, i ? e & 1 | 2 : e & 1), t) : (je(t), null);
      case 22:
      case 23:
        return gn(t), au(), i = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== i && (t.flags |= 8192) : i && (t.flags |= 8192), i ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (je(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : je(t), n = t.updateQueue, n !== null && Rs(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), i = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), i !== n && (t.flags |= 2048), e !== null && j(gi), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), dn(We), je(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, t.tag));
  }
  function Sp(e, t) {
    switch (Qr(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return dn(We), wt(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return sn(t), null;
      case 13:
        if (gn(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          ql();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return j(Ie), null;
      case 4:
        return wt(), null;
      case 10:
        return dn(t.type), null;
      case 22:
      case 23:
        return gn(t), au(), e !== null && j(gi), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return dn(We), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function xh(e, t) {
    switch (Qr(t), t.tag) {
      case 3:
        dn(We), wt();
        break;
      case 26:
      case 27:
      case 5:
        sn(t);
        break;
      case 4:
        wt();
        break;
      case 13:
        gn(t);
        break;
      case 19:
        j(Ie);
        break;
      case 10:
        dn(t.type);
        break;
      case 22:
      case 23:
        gn(t), au(), e !== null && j(gi);
        break;
      case 24:
        dn(We);
    }
  }
  function ia(e, t) {
    try {
      var n = t.updateQueue, i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        n = s;
        do {
          if ((n.tag & e) === e) {
            i = void 0;
            var u = n.create, h = n.inst;
            i = u(), h.destroy = i;
          }
          n = n.next;
        } while (n !== s);
      }
    } catch (m) {
      Ue(t, t.return, m);
    }
  }
  function jn(e, t, n) {
    try {
      var i = t.updateQueue, s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var u = s.next;
        i = u;
        do {
          if ((i.tag & e) === e) {
            var h = i.inst, m = h.destroy;
            if (m !== void 0) {
              h.destroy = void 0, s = t;
              var p = n, w = m;
              try {
                w();
              } catch (M) {
                Ue(
                  s,
                  p,
                  M
                );
              }
            }
          }
          i = i.next;
        } while (i !== u);
      }
    } catch (M) {
      Ue(t, t.return, M);
    }
  }
  function Oh(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        gf(t, n);
      } catch (i) {
        Ue(e, e.return, i);
      }
    }
  }
  function Mh(e, t, n) {
    n.props = bi(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (i) {
      Ue(e, t, i);
    }
  }
  function la(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var i = e.stateNode;
            break;
          case 30:
            i = e.stateNode;
            break;
          default:
            i = e.stateNode;
        }
        typeof n == "function" ? e.refCleanup = n(i) : n.current = i;
      }
    } catch (s) {
      Ue(e, t, s);
    }
  }
  function nn(e, t) {
    var n = e.ref, i = e.refCleanup;
    if (n !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (s) {
          Ue(e, t, s);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (s) {
          Ue(e, t, s);
        }
      else n.current = null;
  }
  function Ch(e) {
    var t = e.type, n = e.memoizedProps, i = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break e;
        case "img":
          n.src ? i.src = n.src : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (s) {
      Ue(e, e.return, s);
    }
  }
  function Uu(e, t, n) {
    try {
      var i = e.stateNode;
      Gp(i, e.type, n, t), i[_t] = t;
    } catch (s) {
      Ue(e, e.return, s);
    }
  }
  function Dh(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Kn(e.type) || e.tag === 4;
  }
  function ku(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Dh(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Kn(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Nu(e, t, n) {
    var i = e.tag;
    if (i === 5 || i === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Ls));
    else if (i !== 4 && (i === 27 && Kn(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Nu(e, t, n), e = e.sibling; e !== null; )
        Nu(e, t, n), e = e.sibling;
  }
  function As(e, t, n) {
    var i = e.tag;
    if (i === 5 || i === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (i !== 4 && (i === 27 && Kn(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (As(e, t, n), e = e.sibling; e !== null; )
        As(e, t, n), e = e.sibling;
  }
  function zh(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var i = e.type, s = t.attributes; s.length; )
        t.removeAttributeNode(s[0]);
      rt(t, i, n), t[ct] = e, t[_t] = n;
    } catch (u) {
      Ue(e, e.return, u);
    }
  }
  var _n = !1, Xe = !1, Bu = !1, Uh = typeof WeakSet == "function" ? WeakSet : Set, nt = null;
  function Tp(e, t) {
    if (e = e.containerInfo, sc = Xs, e = Vo(e), kr(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var i = n.getSelection && n.getSelection();
          if (i && i.rangeCount !== 0) {
            n = i.anchorNode;
            var s = i.anchorOffset, u = i.focusNode;
            i = i.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break e;
            }
            var h = 0, m = -1, p = -1, w = 0, M = 0, z = e, R = null;
            t: for (; ; ) {
              for (var A; z !== n || s !== 0 && z.nodeType !== 3 || (m = h + s), z !== u || i !== 0 && z.nodeType !== 3 || (p = h + i), z.nodeType === 3 && (h += z.nodeValue.length), (A = z.firstChild) !== null; )
                R = z, z = A;
              for (; ; ) {
                if (z === e) break t;
                if (R === n && ++w === s && (m = h), R === u && ++M === i && (p = h), (A = z.nextSibling) !== null) break;
                z = R, R = z.parentNode;
              }
              z = A;
            }
            n = m === -1 || p === -1 ? null : { start: m, end: p };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (rc = { focusedElem: e, selectionRange: n }, Xs = !1, nt = t; nt !== null; )
      if (t = nt, e = t.child, (t.subtreeFlags & 1024) !== 0 && e !== null)
        e.return = t, nt = e;
      else
        for (; nt !== null; ) {
          switch (t = nt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, n = t, s = u.memoizedProps, u = u.memoizedState, i = n.stateNode;
                try {
                  var ne = bi(
                    n.type,
                    s,
                    n.elementType === n.type
                  );
                  e = i.getSnapshotBeforeUpdate(
                    ne,
                    u
                  ), i.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ee) {
                  Ue(
                    n,
                    n.return,
                    ee
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  oc(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      oc(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(r(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, nt = e;
            break;
          }
          nt = t.return;
        }
  }
  function kh(e, t, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        qn(e, n), i & 4 && ia(5, n);
        break;
      case 1:
        if (qn(e, n), i & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (h) {
              Ue(n, n.return, h);
            }
          else {
            var s = bi(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                s,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (h) {
              Ue(
                n,
                n.return,
                h
              );
            }
          }
        i & 64 && Oh(n), i & 512 && la(n, n.return);
        break;
      case 3:
        if (qn(e, n), i & 64 && (e = n.updateQueue, e !== null)) {
          if (t = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            gf(e, t);
          } catch (h) {
            Ue(n, n.return, h);
          }
        }
        break;
      case 27:
        t === null && i & 4 && zh(n);
      case 26:
      case 5:
        qn(e, n), t === null && i & 4 && Ch(n), i & 512 && la(n, n.return);
        break;
      case 12:
        qn(e, n);
        break;
      case 13:
        qn(e, n), i & 4 && Lh(e, n), i & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Dp.bind(
          null,
          n
        ), Jp(e, n))));
        break;
      case 22:
        if (i = n.memoizedState !== null || _n, !i) {
          t = t !== null && t.memoizedState !== null || Xe, s = _n;
          var u = Xe;
          _n = i, (Xe = t) && !u ? Yn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : qn(e, n), _n = s, Xe = u;
        }
        break;
      case 30:
        break;
      default:
        qn(e, n);
    }
  }
  function Nh(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Nh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && gr(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Le = null, St = !1;
  function yn(e, t, n) {
    for (n = n.child; n !== null; )
      Bh(e, t, n), n = n.sibling;
  }
  function Bh(e, t, n) {
    if (he && typeof he.onCommitFiberUnmount == "function")
      try {
        he.onCommitFiberUnmount(X, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Xe || nn(n, t), yn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Xe || nn(n, t);
        var i = Le, s = St;
        Kn(n.type) && (Le = n.stateNode, St = !1), yn(
          e,
          t,
          n
        ), da(n.stateNode), Le = i, St = s;
        break;
      case 5:
        Xe || nn(n, t);
      case 6:
        if (i = Le, s = St, Le = null, yn(
          e,
          t,
          n
        ), Le = i, St = s, Le !== null)
          if (St)
            try {
              (Le.nodeType === 9 ? Le.body : Le.nodeName === "HTML" ? Le.ownerDocument.body : Le).removeChild(n.stateNode);
            } catch (u) {
              Ue(
                n,
                t,
                u
              );
            }
          else
            try {
              Le.removeChild(n.stateNode);
            } catch (u) {
              Ue(
                n,
                t,
                u
              );
            }
        break;
      case 18:
        Le !== null && (St ? (e = Le, wd(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Sa(e)) : wd(Le, n.stateNode));
        break;
      case 4:
        i = Le, s = St, Le = n.stateNode.containerInfo, St = !0, yn(
          e,
          t,
          n
        ), Le = i, St = s;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Xe || jn(2, n, t), Xe || jn(4, n, t), yn(
          e,
          t,
          n
        );
        break;
      case 1:
        Xe || (nn(n, t), i = n.stateNode, typeof i.componentWillUnmount == "function" && Mh(
          n,
          t,
          i
        )), yn(
          e,
          t,
          n
        );
        break;
      case 21:
        yn(
          e,
          t,
          n
        );
        break;
      case 22:
        Xe = (i = Xe) || n.memoizedState !== null, yn(
          e,
          t,
          n
        ), Xe = i;
        break;
      default:
        yn(
          e,
          t,
          n
        );
    }
  }
  function Lh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Sa(e);
      } catch (n) {
        Ue(t, t.return, n);
      }
  }
  function Ep(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Uh()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Uh()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function Lu(e, t) {
    var n = Ep(e);
    t.forEach(function(i) {
      var s = zp.bind(null, e, i);
      n.has(i) || (n.add(i), i.then(s, s));
    });
  }
  function xt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var s = n[i], u = e, h = t, m = h;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 27:
              if (Kn(m.type)) {
                Le = m.stateNode, St = !1;
                break e;
              }
              break;
            case 5:
              Le = m.stateNode, St = !1;
              break e;
            case 3:
            case 4:
              Le = m.stateNode.containerInfo, St = !0;
              break e;
          }
          m = m.return;
        }
        if (Le === null) throw Error(r(160));
        Bh(u, h, s), Le = null, St = !1, u = s.alternate, u !== null && (u.return = null), s.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Hh(t, e), t = t.sibling;
  }
  var Zt = null;
  function Hh(e, t) {
    var n = e.alternate, i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        xt(t, e), Ot(e), i & 4 && (jn(3, e, e.return), ia(3, e), jn(5, e, e.return));
        break;
      case 1:
        xt(t, e), Ot(e), i & 512 && (Xe || n === null || nn(n, n.return)), i & 64 && _n && (e = e.updateQueue, e !== null && (i = e.callbacks, i !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? i : n.concat(i))));
        break;
      case 26:
        var s = Zt;
        if (xt(t, e), Ot(e), i & 512 && (Xe || n === null || nn(n, n.return)), i & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (i = e.memoizedState, n === null)
            if (i === null)
              if (e.stateNode === null) {
                e: {
                  i = e.type, n = e.memoizedProps, s = s.ownerDocument || s;
                  t: switch (i) {
                    case "title":
                      u = s.getElementsByTagName("title")[0], (!u || u[Ol] || u[ct] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = s.createElement(i), s.head.insertBefore(
                        u,
                        s.querySelector("head > title")
                      )), rt(u, i, n), u[ct] = e, et(u), i = u;
                      break e;
                    case "link":
                      var h = zd(
                        "link",
                        "href",
                        s
                      ).get(i + (n.href || ""));
                      if (h) {
                        for (var m = 0; m < h.length; m++)
                          if (u = h[m], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            h.splice(m, 1);
                            break t;
                          }
                      }
                      u = s.createElement(i), rt(u, i, n), s.head.appendChild(u);
                      break;
                    case "meta":
                      if (h = zd(
                        "meta",
                        "content",
                        s
                      ).get(i + (n.content || ""))) {
                        for (m = 0; m < h.length; m++)
                          if (u = h[m], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            h.splice(m, 1);
                            break t;
                          }
                      }
                      u = s.createElement(i), rt(u, i, n), s.head.appendChild(u);
                      break;
                    default:
                      throw Error(r(468, i));
                  }
                  u[ct] = e, et(u), i = u;
                }
                e.stateNode = i;
              } else
                Ud(
                  s,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Dd(
                s,
                i,
                e.memoizedProps
              );
          else
            u !== i ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, i === null ? Ud(
              s,
              e.type,
              e.stateNode
            ) : Dd(
              s,
              i,
              e.memoizedProps
            )) : i === null && e.stateNode !== null && Uu(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        xt(t, e), Ot(e), i & 512 && (Xe || n === null || nn(n, n.return)), n !== null && i & 4 && Uu(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (xt(t, e), Ot(e), i & 512 && (Xe || n === null || nn(n, n.return)), e.flags & 32) {
          s = e.stateNode;
          try {
            Hi(s, "");
          } catch (A) {
            Ue(e, e.return, A);
          }
        }
        i & 4 && e.stateNode != null && (s = e.memoizedProps, Uu(
          e,
          s,
          n !== null ? n.memoizedProps : s
        )), i & 1024 && (Bu = !0);
        break;
      case 6:
        if (xt(t, e), Ot(e), i & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          i = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = i;
          } catch (A) {
            Ue(e, e.return, A);
          }
        }
        break;
      case 3:
        if (Ys = null, s = Zt, Zt = js(t.containerInfo), xt(t, e), Zt = s, Ot(e), i & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Sa(t.containerInfo);
          } catch (A) {
            Ue(e, e.return, A);
          }
        Bu && (Bu = !1, jh(e));
        break;
      case 4:
        i = Zt, Zt = js(
          e.stateNode.containerInfo
        ), xt(t, e), Ot(e), Zt = i;
        break;
      case 12:
        xt(t, e), Ot(e);
        break;
      case 13:
        xt(t, e), Ot(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Vu = Ut()), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Lu(e, i)));
        break;
      case 22:
        s = e.memoizedState !== null;
        var p = n !== null && n.memoizedState !== null, w = _n, M = Xe;
        if (_n = w || s, Xe = M || p, xt(t, e), Xe = M, _n = w, Ot(e), i & 8192)
          e: for (t = e.stateNode, t._visibility = s ? t._visibility & -2 : t._visibility | 1, s && (n === null || p || _n || Xe || _i(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                p = n = t;
                try {
                  if (u = p.stateNode, s)
                    h = u.style, typeof h.setProperty == "function" ? h.setProperty("display", "none", "important") : h.display = "none";
                  else {
                    m = p.stateNode;
                    var z = p.memoizedProps.style, R = z != null && z.hasOwnProperty("display") ? z.display : null;
                    m.style.display = R == null || typeof R == "boolean" ? "" : ("" + R).trim();
                  }
                } catch (A) {
                  Ue(p, p.return, A);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                p = t;
                try {
                  p.stateNode.nodeValue = s ? "" : p.memoizedProps;
                } catch (A) {
                  Ue(p, p.return, A);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              n === t && (n = null), t = t.return;
            }
            n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
          }
        i & 4 && (i = e.updateQueue, i !== null && (n = i.retryQueue, n !== null && (i.retryQueue = null, Lu(e, n))));
        break;
      case 19:
        xt(t, e), Ot(e), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Lu(e, i)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        xt(t, e), Ot(e);
    }
  }
  function Ot(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, i = e.return; i !== null; ) {
          if (Dh(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        if (n == null) throw Error(r(160));
        switch (n.tag) {
          case 27:
            var s = n.stateNode, u = ku(e);
            As(e, u, s);
            break;
          case 5:
            var h = n.stateNode;
            n.flags & 32 && (Hi(h, ""), n.flags &= -33);
            var m = ku(e);
            As(e, m, h);
            break;
          case 3:
          case 4:
            var p = n.stateNode.containerInfo, w = ku(e);
            Nu(
              e,
              w,
              p
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (M) {
        Ue(e, e.return, M);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function jh(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        jh(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function qn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        kh(e, t.alternate, t), t = t.sibling;
  }
  function _i(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          jn(4, t, t.return), _i(t);
          break;
        case 1:
          nn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Mh(
            t,
            t.return,
            n
          ), _i(t);
          break;
        case 27:
          da(t.stateNode);
        case 26:
        case 5:
          nn(t, t.return), _i(t);
          break;
        case 22:
          t.memoizedState === null && _i(t);
          break;
        case 30:
          _i(t);
          break;
        default:
          _i(t);
      }
      e = e.sibling;
    }
  }
  function Yn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var i = t.alternate, s = e, u = t, h = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Yn(
            s,
            u,
            n
          ), ia(4, u);
          break;
        case 1:
          if (Yn(
            s,
            u,
            n
          ), i = u, s = i.stateNode, typeof s.componentDidMount == "function")
            try {
              s.componentDidMount();
            } catch (w) {
              Ue(i, i.return, w);
            }
          if (i = u, s = i.updateQueue, s !== null) {
            var m = i.stateNode;
            try {
              var p = s.shared.hiddenCallbacks;
              if (p !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < p.length; s++)
                  mf(p[s], m);
            } catch (w) {
              Ue(i, i.return, w);
            }
          }
          n && h & 64 && Oh(u), la(u, u.return);
          break;
        case 27:
          zh(u);
        case 26:
        case 5:
          Yn(
            s,
            u,
            n
          ), n && i === null && h & 4 && Ch(u), la(u, u.return);
          break;
        case 12:
          Yn(
            s,
            u,
            n
          );
          break;
        case 13:
          Yn(
            s,
            u,
            n
          ), n && h & 4 && Lh(s, u);
          break;
        case 22:
          u.memoizedState === null && Yn(
            s,
            u,
            n
          ), la(u, u.return);
          break;
        case 30:
          break;
        default:
          Yn(
            s,
            u,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Hu(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Vl(n));
  }
  function ju(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Vl(e));
  }
  function ln(e, t, n, i) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        qh(
          e,
          t,
          n,
          i
        ), t = t.sibling;
  }
  function qh(e, t, n, i) {
    var s = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        ln(
          e,
          t,
          n,
          i
        ), s & 2048 && ia(9, t);
        break;
      case 1:
        ln(
          e,
          t,
          n,
          i
        );
        break;
      case 3:
        ln(
          e,
          t,
          n,
          i
        ), s & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Vl(e)));
        break;
      case 12:
        if (s & 2048) {
          ln(
            e,
            t,
            n,
            i
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, h = u.id, m = u.onPostCommit;
            typeof m == "function" && m(
              h,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (p) {
            Ue(t, t.return, p);
          }
        } else
          ln(
            e,
            t,
            n,
            i
          );
        break;
      case 13:
        ln(
          e,
          t,
          n,
          i
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, h = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? ln(
          e,
          t,
          n,
          i
        ) : aa(e, t) : u._visibility & 2 ? ln(
          e,
          t,
          n,
          i
        ) : (u._visibility |= 2, il(
          e,
          t,
          n,
          i,
          (t.subtreeFlags & 10256) !== 0
        )), s & 2048 && Hu(h, t);
        break;
      case 24:
        ln(
          e,
          t,
          n,
          i
        ), s & 2048 && ju(t.alternate, t);
        break;
      default:
        ln(
          e,
          t,
          n,
          i
        );
    }
  }
  function il(e, t, n, i, s) {
    for (s = s && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var u = e, h = t, m = n, p = i, w = h.flags;
      switch (h.tag) {
        case 0:
        case 11:
        case 15:
          il(
            u,
            h,
            m,
            p,
            s
          ), ia(8, h);
          break;
        case 23:
          break;
        case 22:
          var M = h.stateNode;
          h.memoizedState !== null ? M._visibility & 2 ? il(
            u,
            h,
            m,
            p,
            s
          ) : aa(
            u,
            h
          ) : (M._visibility |= 2, il(
            u,
            h,
            m,
            p,
            s
          )), s && w & 2048 && Hu(
            h.alternate,
            h
          );
          break;
        case 24:
          il(
            u,
            h,
            m,
            p,
            s
          ), s && w & 2048 && ju(h.alternate, h);
          break;
        default:
          il(
            u,
            h,
            m,
            p,
            s
          );
      }
      t = t.sibling;
    }
  }
  function aa(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, i = t, s = i.flags;
        switch (i.tag) {
          case 22:
            aa(n, i), s & 2048 && Hu(
              i.alternate,
              i
            );
            break;
          case 24:
            aa(n, i), s & 2048 && ju(i.alternate, i);
            break;
          default:
            aa(n, i);
        }
        t = t.sibling;
      }
  }
  var sa = 8192;
  function ll(e) {
    if (e.subtreeFlags & sa)
      for (e = e.child; e !== null; )
        Yh(e), e = e.sibling;
  }
  function Yh(e) {
    switch (e.tag) {
      case 26:
        ll(e), e.flags & sa && e.memoizedState !== null && ub(
          Zt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ll(e);
        break;
      case 3:
      case 4:
        var t = Zt;
        Zt = js(e.stateNode.containerInfo), ll(e), Zt = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = sa, sa = 16777216, ll(e), sa = t) : ll(e));
        break;
      default:
        ll(e);
    }
  }
  function Gh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ra(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          nt = i, Xh(
            i,
            e
          );
        }
      Gh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Vh(e), e = e.sibling;
  }
  function Vh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ra(e), e.flags & 2048 && jn(9, e, e.return);
        break;
      case 3:
        ra(e);
        break;
      case 12:
        ra(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, xs(e)) : ra(e);
        break;
      default:
        ra(e);
    }
  }
  function xs(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          nt = i, Xh(
            i,
            e
          );
        }
      Gh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          jn(8, t, t.return), xs(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, xs(t));
          break;
        default:
          xs(t);
      }
      e = e.sibling;
    }
  }
  function Xh(e, t) {
    for (; nt !== null; ) {
      var n = nt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          jn(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          Vl(n.memoizedState.cache);
      }
      if (i = n.child, i !== null) i.return = n, nt = i;
      else
        e: for (n = e; nt !== null; ) {
          i = nt;
          var s = i.sibling, u = i.return;
          if (Nh(i), i === n) {
            nt = null;
            break e;
          }
          if (s !== null) {
            s.return = u, nt = s;
            break e;
          }
          nt = u;
        }
    }
  }
  var wp = {
    getCacheForType: function(e) {
      var t = ot(We), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    }
  }, Rp = typeof WeakMap == "function" ? WeakMap : Map, xe = 0, Ne = null, pe = null, Te = 0, Oe = 0, Mt = null, Gn = !1, al = !1, qu = !1, vn = 0, Ge = 0, Vn = 0, yi = 0, Yu = 0, Yt = 0, sl = 0, ua = null, Tt = null, Gu = !1, Vu = 0, Os = 1 / 0, Ms = null, Xn = null, st = 0, Qn = null, rl = null, ul = 0, Xu = 0, Qu = null, Qh = null, ca = 0, Zu = null;
  function Ct() {
    if ((xe & 2) !== 0 && Te !== 0)
      return Te & -Te;
    if (O.T !== null) {
      var e = Ji;
      return e !== 0 ? e : Fu();
    }
    return ao();
  }
  function Zh() {
    Yt === 0 && (Yt = (Te & 536870912) === 0 || Ae ? to() : 536870912);
    var e = qt.current;
    return e !== null && (e.flags |= 32), Yt;
  }
  function Dt(e, t, n) {
    (e === Ne && (Oe === 2 || Oe === 9) || e.cancelPendingCommit !== null) && (cl(e, 0), Zn(
      e,
      Te,
      Yt,
      !1
    )), xl(e, n), ((xe & 2) === 0 || e !== Ne) && (e === Ne && ((xe & 2) === 0 && (yi |= n), Ge === 4 && Zn(
      e,
      Te,
      Yt,
      !1
    )), an(e));
  }
  function Kh(e, t, n) {
    if ((xe & 6) !== 0) throw Error(r(327));
    var i = !n && (t & 124) === 0 && (t & e.expiredLanes) === 0 || Al(e, t), s = i ? Op(e, t) : Ju(e, t, !0), u = i;
    do {
      if (s === 0) {
        al && !i && Zn(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, u && !Ap(n)) {
          s = Ju(e, t, !1), u = !1;
          continue;
        }
        if (s === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var h = 0;
          else
            h = e.pendingLanes & -536870913, h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
          if (h !== 0) {
            t = h;
            e: {
              var m = e;
              s = ua;
              var p = m.current.memoizedState.isDehydrated;
              if (p && (cl(m, h).flags |= 256), h = Ju(
                m,
                h,
                !1
              ), h !== 2) {
                if (qu && !p) {
                  m.errorRecoveryDisabledLanes |= u, yi |= u, s = 4;
                  break e;
                }
                u = Tt, Tt = s, u !== null && (Tt === null ? Tt = u : Tt.push.apply(
                  Tt,
                  u
                ));
              }
              s = h;
            }
            if (u = !1, s !== 2) continue;
          }
        }
        if (s === 1) {
          cl(e, 0), Zn(e, t, 0, !0);
          break;
        }
        e: {
          switch (i = e, u = s, u) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Zn(
                i,
                t,
                Yt,
                !Gn
              );
              break e;
            case 2:
              Tt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (s = Vu + 300 - Ut(), 10 < s)) {
            if (Zn(
              i,
              t,
              Yt,
              !Gn
            ), qa(i, 0, !0) !== 0) break e;
            i.timeoutHandle = Td(
              Ph.bind(
                null,
                i,
                n,
                Tt,
                Ms,
                Gu,
                t,
                Yt,
                yi,
                sl,
                Gn,
                u,
                2,
                -0,
                0
              ),
              s
            );
            break e;
          }
          Ph(
            i,
            n,
            Tt,
            Ms,
            Gu,
            t,
            Yt,
            yi,
            sl,
            Gn,
            u,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    an(e);
  }
  function Ph(e, t, n, i, s, u, h, m, p, w, M, z, R, A) {
    if (e.timeoutHandle = -1, z = t.subtreeFlags, (z & 8192 || (z & 16785408) === 16785408) && (pa = { stylesheets: null, count: 0, unsuspend: rb }, Yh(t), z = cb(), z !== null)) {
      e.cancelPendingCommit = z(
        td.bind(
          null,
          e,
          t,
          u,
          n,
          i,
          s,
          h,
          m,
          p,
          M,
          1,
          R,
          A
        )
      ), Zn(e, u, h, !w);
      return;
    }
    td(
      e,
      t,
      u,
      n,
      i,
      s,
      h,
      m,
      p
    );
  }
  function Ap(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var i = 0; i < n.length; i++) {
          var s = n[i], u = s.getSnapshot;
          s = s.value;
          try {
            if (!Rt(u(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null)
        n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Zn(e, t, n, i) {
    t &= ~Yu, t &= ~yi, e.suspendedLanes |= t, e.pingedLanes &= ~t, i && (e.warmLanes |= t), i = e.expirationTimes;
    for (var s = t; 0 < s; ) {
      var u = 31 - ae(s), h = 1 << u;
      i[u] = -1, s &= ~h;
    }
    n !== 0 && io(e, n, t);
  }
  function Cs() {
    return (xe & 6) === 0 ? (oa(0), !1) : !0;
  }
  function Ku() {
    if (pe !== null) {
      if (Oe === 0)
        var e = pe.return;
      else
        e = pe, hn = di = null, ou(e), tl = null, ea = 0, e = pe;
      for (; e !== null; )
        xh(e.alternate, e), e = e.return;
      pe = null;
    }
  }
  function cl(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, Xp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Ku(), Ne = e, pe = n = cn(e.current, null), Te = t, Oe = 0, Mt = null, Gn = !1, al = Al(e, t), qu = !1, sl = Yt = Yu = yi = Vn = Ge = 0, Tt = ua = null, Gu = !1, (t & 8) !== 0 && (t |= t & 32);
    var i = e.entangledLanes;
    if (i !== 0)
      for (e = e.entanglements, i &= t; 0 < i; ) {
        var s = 31 - ae(i), u = 1 << s;
        t |= e[s], i &= ~u;
      }
    return vn = t, $a(), n;
  }
  function Jh(e, t) {
    de = null, O.H = bs, t === Ql || t === rs ? (t = hf(), Oe = 3) : t === cf ? (t = hf(), Oe = 4) : Oe = t === dh ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Mt = t, pe === null && (Ge = 1, Ts(
      e,
      Bt(t, e.current)
    ));
  }
  function Wh() {
    var e = O.H;
    return O.H = bs, e === null ? bs : e;
  }
  function Ih() {
    var e = O.A;
    return O.A = wp, e;
  }
  function Pu() {
    Ge = 4, Gn || (Te & 4194048) !== Te && qt.current !== null || (al = !0), (Vn & 134217727) === 0 && (yi & 134217727) === 0 || Ne === null || Zn(
      Ne,
      Te,
      Yt,
      !1
    );
  }
  function Ju(e, t, n) {
    var i = xe;
    xe |= 2;
    var s = Wh(), u = Ih();
    (Ne !== e || Te !== t) && (Ms = null, cl(e, t)), t = !1;
    var h = Ge;
    e: do
      try {
        if (Oe !== 0 && pe !== null) {
          var m = pe, p = Mt;
          switch (Oe) {
            case 8:
              Ku(), h = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              qt.current === null && (t = !0);
              var w = Oe;
              if (Oe = 0, Mt = null, ol(e, m, p, w), n && al) {
                h = 0;
                break e;
              }
              break;
            default:
              w = Oe, Oe = 0, Mt = null, ol(e, m, p, w);
          }
        }
        xp(), h = Ge;
        break;
      } catch (M) {
        Jh(e, M);
      }
    while (!0);
    return t && e.shellSuspendCounter++, hn = di = null, xe = i, O.H = s, O.A = u, pe === null && (Ne = null, Te = 0, $a()), h;
  }
  function xp() {
    for (; pe !== null; ) $h(pe);
  }
  function Op(e, t) {
    var n = xe;
    xe |= 2;
    var i = Wh(), s = Ih();
    Ne !== e || Te !== t ? (Ms = null, Os = Ut() + 500, cl(e, t)) : al = Al(
      e,
      t
    );
    e: do
      try {
        if (Oe !== 0 && pe !== null) {
          t = pe;
          var u = Mt;
          t: switch (Oe) {
            case 1:
              Oe = 0, Mt = null, ol(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (of(u)) {
                Oe = 0, Mt = null, Fh(t);
                break;
              }
              t = function() {
                Oe !== 2 && Oe !== 9 || Ne !== e || (Oe = 7), an(e);
              }, u.then(t, t);
              break e;
            case 3:
              Oe = 7;
              break e;
            case 4:
              Oe = 5;
              break e;
            case 7:
              of(u) ? (Oe = 0, Mt = null, Fh(t)) : (Oe = 0, Mt = null, ol(e, t, u, 7));
              break;
            case 5:
              var h = null;
              switch (pe.tag) {
                case 26:
                  h = pe.memoizedState;
                case 5:
                case 27:
                  var m = pe;
                  if (!h || kd(h)) {
                    Oe = 0, Mt = null;
                    var p = m.sibling;
                    if (p !== null) pe = p;
                    else {
                      var w = m.return;
                      w !== null ? (pe = w, Ds(w)) : pe = null;
                    }
                    break t;
                  }
              }
              Oe = 0, Mt = null, ol(e, t, u, 5);
              break;
            case 6:
              Oe = 0, Mt = null, ol(e, t, u, 6);
              break;
            case 8:
              Ku(), Ge = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        Mp();
        break;
      } catch (M) {
        Jh(e, M);
      }
    while (!0);
    return hn = di = null, O.H = i, O.A = s, xe = n, pe !== null ? 0 : (Ne = null, Te = 0, $a(), Ge);
  }
  function Mp() {
    for (; pe !== null && !Na(); )
      $h(pe);
  }
  function $h(e) {
    var t = Rh(e.alternate, e, vn);
    e.memoizedProps = e.pendingProps, t === null ? Ds(e) : pe = t;
  }
  function Fh(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = yh(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Te
        );
        break;
      case 11:
        t = yh(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Te
        );
        break;
      case 5:
        ou(t);
      default:
        xh(n, t), t = pe = Fo(t, vn), t = Rh(n, t, vn);
    }
    e.memoizedProps = e.pendingProps, t === null ? Ds(e) : pe = t;
  }
  function ol(e, t, n, i) {
    hn = di = null, ou(t), tl = null, ea = 0;
    var s = t.return;
    try {
      if (_p(
        e,
        s,
        t,
        n,
        Te
      )) {
        Ge = 1, Ts(
          e,
          Bt(n, e.current)
        ), pe = null;
        return;
      }
    } catch (u) {
      if (s !== null) throw pe = s, u;
      Ge = 1, Ts(
        e,
        Bt(n, e.current)
      ), pe = null;
      return;
    }
    t.flags & 32768 ? (Ae || i === 1 ? e = !0 : al || (Te & 536870912) !== 0 ? e = !1 : (Gn = e = !0, (i === 2 || i === 9 || i === 3 || i === 6) && (i = qt.current, i !== null && i.tag === 13 && (i.flags |= 16384))), ed(t, e)) : Ds(t);
  }
  function Ds(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        ed(
          t,
          Gn
        );
        return;
      }
      e = t.return;
      var n = vp(
        t.alternate,
        t,
        vn
      );
      if (n !== null) {
        pe = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        pe = t;
        return;
      }
      pe = t = e;
    } while (t !== null);
    Ge === 0 && (Ge = 5);
  }
  function ed(e, t) {
    do {
      var n = Sp(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, pe = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        pe = e;
        return;
      }
      pe = e = n;
    } while (e !== null);
    Ge = 6, pe = null;
  }
  function td(e, t, n, i, s, u, h, m, p) {
    e.cancelPendingCommit = null;
    do
      zs();
    while (st !== 0);
    if ((xe & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      if (u = t.lanes | t.childLanes, u |= jr, rg(
        e,
        n,
        u,
        h,
        m,
        p
      ), e === Ne && (pe = Ne = null, Te = 0), rl = t, Qn = e, ul = n, Xu = u, Qu = s, Qh = i, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Up(Ci, function() {
        return sd(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), i = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || i) {
        i = O.T, O.T = null, s = H.p, H.p = 2, h = xe, xe |= 4;
        try {
          Tp(e, t, n);
        } finally {
          xe = h, H.p = s, O.T = i;
        }
      }
      st = 1, nd(), id(), ld();
    }
  }
  function nd() {
    if (st === 1) {
      st = 0;
      var e = Qn, t = rl, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = O.T, O.T = null;
        var i = H.p;
        H.p = 2;
        var s = xe;
        xe |= 4;
        try {
          Hh(t, e);
          var u = rc, h = Vo(e.containerInfo), m = u.focusedElem, p = u.selectionRange;
          if (h !== m && m && m.ownerDocument && Go(
            m.ownerDocument.documentElement,
            m
          )) {
            if (p !== null && kr(m)) {
              var w = p.start, M = p.end;
              if (M === void 0 && (M = w), "selectionStart" in m)
                m.selectionStart = w, m.selectionEnd = Math.min(
                  M,
                  m.value.length
                );
              else {
                var z = m.ownerDocument || document, R = z && z.defaultView || window;
                if (R.getSelection) {
                  var A = R.getSelection(), ne = m.textContent.length, ee = Math.min(p.start, ne), De = p.end === void 0 ? ee : Math.min(p.end, ne);
                  !A.extend && ee > De && (h = De, De = ee, ee = h);
                  var S = Yo(
                    m,
                    ee
                  ), v = Yo(
                    m,
                    De
                  );
                  if (S && v && (A.rangeCount !== 1 || A.anchorNode !== S.node || A.anchorOffset !== S.offset || A.focusNode !== v.node || A.focusOffset !== v.offset)) {
                    var E = z.createRange();
                    E.setStart(S.node, S.offset), A.removeAllRanges(), ee > De ? (A.addRange(E), A.extend(v.node, v.offset)) : (E.setEnd(v.node, v.offset), A.addRange(E));
                  }
                }
              }
            }
            for (z = [], A = m; A = A.parentNode; )
              A.nodeType === 1 && z.push({
                element: A,
                left: A.scrollLeft,
                top: A.scrollTop
              });
            for (typeof m.focus == "function" && m.focus(), m = 0; m < z.length; m++) {
              var C = z[m];
              C.element.scrollLeft = C.left, C.element.scrollTop = C.top;
            }
          }
          Xs = !!sc, rc = sc = null;
        } finally {
          xe = s, H.p = i, O.T = n;
        }
      }
      e.current = t, st = 2;
    }
  }
  function id() {
    if (st === 2) {
      st = 0;
      var e = Qn, t = rl, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = O.T, O.T = null;
        var i = H.p;
        H.p = 2;
        var s = xe;
        xe |= 4;
        try {
          kh(e, t.alternate, t);
        } finally {
          xe = s, H.p = i, O.T = n;
        }
      }
      st = 3;
    }
  }
  function ld() {
    if (st === 4 || st === 3) {
      st = 0, ur();
      var e = Qn, t = rl, n = ul, i = Qh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? st = 5 : (st = 0, rl = Qn = null, ad(e, e.pendingLanes));
      var s = e.pendingLanes;
      if (s === 0 && (Xn = null), dr(n), t = t.stateNode, he && typeof he.onCommitFiberRoot == "function")
        try {
          he.onCommitFiberRoot(
            X,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (i !== null) {
        t = O.T, s = H.p, H.p = 2, O.T = null;
        try {
          for (var u = e.onRecoverableError, h = 0; h < i.length; h++) {
            var m = i[h];
            u(m.value, {
              componentStack: m.stack
            });
          }
        } finally {
          O.T = t, H.p = s;
        }
      }
      (ul & 3) !== 0 && zs(), an(e), s = e.pendingLanes, (n & 4194090) !== 0 && (s & 42) !== 0 ? e === Zu ? ca++ : (ca = 0, Zu = e) : ca = 0, oa(0);
    }
  }
  function ad(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Vl(t)));
  }
  function zs(e) {
    return nd(), id(), ld(), sd();
  }
  function sd() {
    if (st !== 5) return !1;
    var e = Qn, t = Xu;
    Xu = 0;
    var n = dr(ul), i = O.T, s = H.p;
    try {
      H.p = 32 > n ? 32 : n, O.T = null, n = Qu, Qu = null;
      var u = Qn, h = ul;
      if (st = 0, rl = Qn = null, ul = 0, (xe & 6) !== 0) throw Error(r(331));
      var m = xe;
      if (xe |= 4, Vh(u.current), qh(
        u,
        u.current,
        h,
        n
      ), xe = m, oa(0, !1), he && typeof he.onPostCommitFiberRoot == "function")
        try {
          he.onPostCommitFiberRoot(X, u);
        } catch {
        }
      return !0;
    } finally {
      H.p = s, O.T = i, ad(e, t);
    }
  }
  function rd(e, t, n) {
    t = Bt(n, t), t = wu(e.stateNode, t, 2), e = Nn(e, t, 2), e !== null && (xl(e, 2), an(e));
  }
  function Ue(e, t, n) {
    if (e.tag === 3)
      rd(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          rd(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var i = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (Xn === null || !Xn.has(i))) {
            e = Bt(n, e), n = fh(2), i = Nn(t, n, 2), i !== null && (hh(
              n,
              i,
              t,
              e
            ), xl(i, 2), an(i));
            break;
          }
        }
        t = t.return;
      }
  }
  function Wu(e, t, n) {
    var i = e.pingCache;
    if (i === null) {
      i = e.pingCache = new Rp();
      var s = /* @__PURE__ */ new Set();
      i.set(t, s);
    } else
      s = i.get(t), s === void 0 && (s = /* @__PURE__ */ new Set(), i.set(t, s));
    s.has(n) || (qu = !0, s.add(n), e = Cp.bind(null, e, t, n), t.then(e, e));
  }
  function Cp(e, t, n) {
    var i = e.pingCache;
    i !== null && i.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ne === e && (Te & n) === n && (Ge === 4 || Ge === 3 && (Te & 62914560) === Te && 300 > Ut() - Vu ? (xe & 2) === 0 && cl(e, 0) : Yu |= n, sl === Te && (sl = 0)), an(e);
  }
  function ud(e, t) {
    t === 0 && (t = no()), e = Qi(e, t), e !== null && (xl(e, t), an(e));
  }
  function Dp(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), ud(e, n);
  }
  function zp(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var i = e.stateNode, s = e.memoizedState;
        s !== null && (n = s.retryLane);
        break;
      case 19:
        i = e.stateNode;
        break;
      case 22:
        i = e.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    i !== null && i.delete(t), ud(e, n);
  }
  function Up(e, t) {
    return Mn(e, t);
  }
  var Us = null, fl = null, Iu = !1, ks = !1, $u = !1, vi = 0;
  function an(e) {
    e !== fl && e.next === null && (fl === null ? Us = fl = e : fl = fl.next = e), ks = !0, Iu || (Iu = !0, Np());
  }
  function oa(e, t) {
    if (!$u && ks) {
      $u = !0;
      do
        for (var n = !1, i = Us; i !== null; ) {
          if (e !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var u = 0;
            else {
              var h = i.suspendedLanes, m = i.pingedLanes;
              u = (1 << 31 - ae(42 | e) + 1) - 1, u &= s & ~(h & ~m), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, hd(i, u));
          } else
            u = Te, u = qa(
              i,
              i === Ne ? u : 0,
              i.cancelPendingCommit !== null || i.timeoutHandle !== -1
            ), (u & 3) === 0 || Al(i, u) || (n = !0, hd(i, u));
          i = i.next;
        }
      while (n);
      $u = !1;
    }
  }
  function kp() {
    cd();
  }
  function cd() {
    ks = Iu = !1;
    var e = 0;
    vi !== 0 && (Vp() && (e = vi), vi = 0);
    for (var t = Ut(), n = null, i = Us; i !== null; ) {
      var s = i.next, u = od(i, t);
      u === 0 ? (i.next = null, n === null ? Us = s : n.next = s, s === null && (fl = n)) : (n = i, (e !== 0 || (u & 3) !== 0) && (ks = !0)), i = s;
    }
    oa(e);
  }
  function od(e, t) {
    for (var n = e.suspendedLanes, i = e.pingedLanes, s = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var h = 31 - ae(u), m = 1 << h, p = s[h];
      p === -1 ? ((m & n) === 0 || (m & i) !== 0) && (s[h] = sg(m, t)) : p <= t && (e.expiredLanes |= m), u &= ~m;
    }
    if (t = Ne, n = Te, n = qa(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), i = e.callbackNode, n === 0 || e === t && (Oe === 2 || Oe === 9) || e.cancelPendingCommit !== null)
      return i !== null && i !== null && Mi(i), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || Al(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (i !== null && Mi(i), dr(n)) {
        case 2:
        case 8:
          n = La;
          break;
        case 32:
          n = Ci;
          break;
        case 268435456:
          n = D;
          break;
        default:
          n = Ci;
      }
      return i = fd.bind(null, e), n = Mn(n, i), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return i !== null && i !== null && Mi(i), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function fd(e, t) {
    if (st !== 0 && st !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (zs() && e.callbackNode !== n)
      return null;
    var i = Te;
    return i = qa(
      e,
      e === Ne ? i : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), i === 0 ? null : (Kh(e, i, t), od(e, Ut()), e.callbackNode != null && e.callbackNode === n ? fd.bind(null, e) : null);
  }
  function hd(e, t) {
    if (zs()) return null;
    Kh(e, t, !0);
  }
  function Np() {
    Qp(function() {
      (xe & 6) !== 0 ? Mn(
        Ba,
        kp
      ) : cd();
    });
  }
  function Fu() {
    return vi === 0 && (vi = to()), vi;
  }
  function dd(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Qa("" + e);
  }
  function md(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function Bp(e, t, n, i, s) {
    if (t === "submit" && n && n.stateNode === s) {
      var u = dd(
        (s[_t] || null).action
      ), h = i.submitter;
      h && (t = (t = h[_t] || null) ? dd(t.formAction) : h.getAttribute("formAction"), t !== null && (u = t, h = null));
      var m = new Ja(
        "action",
        "action",
        null,
        i,
        s
      );
      e.push({
        event: m,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (vi !== 0) {
                  var p = h ? md(s, h) : new FormData(s);
                  yu(
                    n,
                    {
                      pending: !0,
                      data: p,
                      method: s.method,
                      action: u
                    },
                    null,
                    p
                  );
                }
              } else
                typeof u == "function" && (m.preventDefault(), p = h ? md(s, h) : new FormData(s), yu(
                  n,
                  {
                    pending: !0,
                    data: p,
                    method: s.method,
                    action: u
                  },
                  u,
                  p
                ));
            },
            currentTarget: s
          }
        ]
      });
    }
  }
  for (var ec = 0; ec < Hr.length; ec++) {
    var tc = Hr[ec], Lp = tc.toLowerCase(), Hp = tc[0].toUpperCase() + tc.slice(1);
    Qt(
      Lp,
      "on" + Hp
    );
  }
  Qt(Zo, "onAnimationEnd"), Qt(Ko, "onAnimationIteration"), Qt(Po, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(tp, "onTransitionRun"), Qt(np, "onTransitionStart"), Qt(ip, "onTransitionCancel"), Qt(Jo, "onTransitionEnd"), Ni("onMouseEnter", ["mouseout", "mouseover"]), Ni("onMouseLeave", ["mouseout", "mouseover"]), Ni("onPointerEnter", ["pointerout", "pointerover"]), Ni("onPointerLeave", ["pointerout", "pointerover"]), li(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), li(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), li("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), li(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), li(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), li(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var fa = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), jp = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fa)
  );
  function gd(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var i = e[n], s = i.event;
      i = i.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var h = i.length - 1; 0 <= h; h--) {
            var m = i[h], p = m.instance, w = m.currentTarget;
            if (m = m.listener, p !== u && s.isPropagationStopped())
              break e;
            u = m, s.currentTarget = w;
            try {
              u(s);
            } catch (M) {
              Ss(M);
            }
            s.currentTarget = null, u = p;
          }
        else
          for (h = 0; h < i.length; h++) {
            if (m = i[h], p = m.instance, w = m.currentTarget, m = m.listener, p !== u && s.isPropagationStopped())
              break e;
            u = m, s.currentTarget = w;
            try {
              u(s);
            } catch (M) {
              Ss(M);
            }
            s.currentTarget = null, u = p;
          }
      }
    }
  }
  function be(e, t) {
    var n = t[mr];
    n === void 0 && (n = t[mr] = /* @__PURE__ */ new Set());
    var i = e + "__bubble";
    n.has(i) || (pd(t, e, 2, !1), n.add(i));
  }
  function nc(e, t, n) {
    var i = 0;
    t && (i |= 4), pd(
      n,
      e,
      i,
      t
    );
  }
  var Ns = "_reactListening" + Math.random().toString(36).slice(2);
  function ic(e) {
    if (!e[Ns]) {
      e[Ns] = !0, ro.forEach(function(n) {
        n !== "selectionchange" && (jp.has(n) || nc(n, !1, e), nc(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ns] || (t[Ns] = !0, nc("selectionchange", !1, t));
    }
  }
  function pd(e, t, n, i) {
    switch (qd(t)) {
      case 2:
        var s = hb;
        break;
      case 8:
        s = db;
        break;
      default:
        s = bc;
    }
    n = s.bind(
      null,
      t,
      n,
      e
    ), s = void 0, !Rr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (s = !0), i ? s !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: s
    }) : e.addEventListener(t, n, !0) : s !== void 0 ? e.addEventListener(t, n, {
      passive: s
    }) : e.addEventListener(t, n, !1);
  }
  function lc(e, t, n, i, s) {
    var u = i;
    if ((t & 1) === 0 && (t & 2) === 0 && i !== null)
      e: for (; ; ) {
        if (i === null) return;
        var h = i.tag;
        if (h === 3 || h === 4) {
          var m = i.stateNode.containerInfo;
          if (m === s) break;
          if (h === 4)
            for (h = i.return; h !== null; ) {
              var p = h.tag;
              if ((p === 3 || p === 4) && h.stateNode.containerInfo === s)
                return;
              h = h.return;
            }
          for (; m !== null; ) {
            if (h = zi(m), h === null) return;
            if (p = h.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              i = u = h;
              continue e;
            }
            m = m.parentNode;
          }
        }
        i = i.return;
      }
    To(function() {
      var w = u, M = Er(n), z = [];
      e: {
        var R = Wo.get(e);
        if (R !== void 0) {
          var A = Ja, ne = e;
          switch (e) {
            case "keypress":
              if (Ka(n) === 0) break e;
            case "keydown":
            case "keyup":
              A = Ug;
              break;
            case "focusin":
              ne = "focus", A = Mr;
              break;
            case "focusout":
              ne = "blur", A = Mr;
              break;
            case "beforeblur":
            case "afterblur":
              A = Mr;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              A = Ro;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = Sg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = Bg;
              break;
            case Zo:
            case Ko:
            case Po:
              A = wg;
              break;
            case Jo:
              A = Hg;
              break;
            case "scroll":
            case "scrollend":
              A = yg;
              break;
            case "wheel":
              A = qg;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = Ag;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = xo;
              break;
            case "toggle":
            case "beforetoggle":
              A = Gg;
          }
          var ee = (t & 4) !== 0, De = !ee && (e === "scroll" || e === "scrollend"), S = ee ? R !== null ? R + "Capture" : null : R;
          ee = [];
          for (var v = w, E; v !== null; ) {
            var C = v;
            if (E = C.stateNode, C = C.tag, C !== 5 && C !== 26 && C !== 27 || E === null || S === null || (C = Cl(v, S), C != null && ee.push(
              ha(v, C, E)
            )), De) break;
            v = v.return;
          }
          0 < ee.length && (R = new A(
            R,
            ne,
            null,
            n,
            M
          ), z.push({ event: R, listeners: ee }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", R && n !== Tr && (ne = n.relatedTarget || n.fromElement) && (zi(ne) || ne[Di]))
            break e;
          if ((A || R) && (R = M.window === M ? M : (R = M.ownerDocument) ? R.defaultView || R.parentWindow : window, A ? (ne = n.relatedTarget || n.toElement, A = w, ne = ne ? zi(ne) : null, ne !== null && (De = f(ne), ee = ne.tag, ne !== De || ee !== 5 && ee !== 27 && ee !== 6) && (ne = null)) : (A = null, ne = w), A !== ne)) {
            if (ee = Ro, C = "onMouseLeave", S = "onMouseEnter", v = "mouse", (e === "pointerout" || e === "pointerover") && (ee = xo, C = "onPointerLeave", S = "onPointerEnter", v = "pointer"), De = A == null ? R : Ml(A), E = ne == null ? R : Ml(ne), R = new ee(
              C,
              v + "leave",
              A,
              n,
              M
            ), R.target = De, R.relatedTarget = E, C = null, zi(M) === w && (ee = new ee(
              S,
              v + "enter",
              ne,
              n,
              M
            ), ee.target = E, ee.relatedTarget = De, C = ee), De = C, A && ne)
              t: {
                for (ee = A, S = ne, v = 0, E = ee; E; E = hl(E))
                  v++;
                for (E = 0, C = S; C; C = hl(C))
                  E++;
                for (; 0 < v - E; )
                  ee = hl(ee), v--;
                for (; 0 < E - v; )
                  S = hl(S), E--;
                for (; v--; ) {
                  if (ee === S || S !== null && ee === S.alternate)
                    break t;
                  ee = hl(ee), S = hl(S);
                }
                ee = null;
              }
            else ee = null;
            A !== null && bd(
              z,
              R,
              A,
              ee,
              !1
            ), ne !== null && De !== null && bd(
              z,
              De,
              ne,
              ee,
              !0
            );
          }
        }
        e: {
          if (R = w ? Ml(w) : window, A = R.nodeName && R.nodeName.toLowerCase(), A === "select" || A === "input" && R.type === "file")
            var Q = No;
          else if (Uo(R))
            if (Bo)
              Q = $g;
            else {
              Q = Wg;
              var ge = Jg;
            }
          else
            A = R.nodeName, !A || A.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? w && Sr(w.elementType) && (Q = No) : Q = Ig;
          if (Q && (Q = Q(e, w))) {
            ko(
              z,
              Q,
              n,
              M
            );
            break e;
          }
          ge && ge(e, R, w), e === "focusout" && w && R.type === "number" && w.memoizedProps.value != null && vr(R, "number", R.value);
        }
        switch (ge = w ? Ml(w) : window, e) {
          case "focusin":
            (Uo(ge) || ge.contentEditable === "true") && (Gi = ge, Nr = w, Hl = null);
            break;
          case "focusout":
            Hl = Nr = Gi = null;
            break;
          case "mousedown":
            Br = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Br = !1, Xo(z, n, M);
            break;
          case "selectionchange":
            if (ep) break;
          case "keydown":
          case "keyup":
            Xo(z, n, M);
        }
        var J;
        if (Dr)
          e: {
            switch (e) {
              case "compositionstart":
                var te = "onCompositionStart";
                break e;
              case "compositionend":
                te = "onCompositionEnd";
                break e;
              case "compositionupdate":
                te = "onCompositionUpdate";
                break e;
            }
            te = void 0;
          }
        else
          Yi ? Do(e, n) && (te = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (te = "onCompositionStart");
        te && (Oo && n.locale !== "ko" && (Yi || te !== "onCompositionStart" ? te === "onCompositionEnd" && Yi && (J = Eo()) : (Dn = M, Ar = "value" in Dn ? Dn.value : Dn.textContent, Yi = !0)), ge = Bs(w, te), 0 < ge.length && (te = new Ao(
          te,
          e,
          null,
          n,
          M
        ), z.push({ event: te, listeners: ge }), J ? te.data = J : (J = zo(n), J !== null && (te.data = J)))), (J = Xg ? Qg(e, n) : Zg(e, n)) && (te = Bs(w, "onBeforeInput"), 0 < te.length && (ge = new Ao(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          M
        ), z.push({
          event: ge,
          listeners: te
        }), ge.data = J)), Bp(
          z,
          e,
          w,
          n,
          M
        );
      }
      gd(z, t);
    });
  }
  function ha(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function Bs(e, t) {
    for (var n = t + "Capture", i = []; e !== null; ) {
      var s = e, u = s.stateNode;
      if (s = s.tag, s !== 5 && s !== 26 && s !== 27 || u === null || (s = Cl(e, n), s != null && i.unshift(
        ha(e, s, u)
      ), s = Cl(e, t), s != null && i.push(
        ha(e, s, u)
      )), e.tag === 3) return i;
      e = e.return;
    }
    return [];
  }
  function hl(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function bd(e, t, n, i, s) {
    for (var u = t._reactName, h = []; n !== null && n !== i; ) {
      var m = n, p = m.alternate, w = m.stateNode;
      if (m = m.tag, p !== null && p === i) break;
      m !== 5 && m !== 26 && m !== 27 || w === null || (p = w, s ? (w = Cl(n, u), w != null && h.unshift(
        ha(n, w, p)
      )) : s || (w = Cl(n, u), w != null && h.push(
        ha(n, w, p)
      ))), n = n.return;
    }
    h.length !== 0 && e.push({ event: t, listeners: h });
  }
  var qp = /\r\n?/g, Yp = /\u0000|\uFFFD/g;
  function _d(e) {
    return (typeof e == "string" ? e : "" + e).replace(qp, `
`).replace(Yp, "");
  }
  function yd(e, t) {
    return t = _d(t), _d(e) === t;
  }
  function Ls() {
  }
  function Ce(e, t, n, i, s, u) {
    switch (n) {
      case "children":
        typeof i == "string" ? t === "body" || t === "textarea" && i === "" || Hi(e, i) : (typeof i == "number" || typeof i == "bigint") && t !== "body" && Hi(e, "" + i);
        break;
      case "className":
        Ga(e, "class", i);
        break;
      case "tabIndex":
        Ga(e, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ga(e, n, i);
        break;
      case "style":
        vo(e, i, u);
        break;
      case "data":
        if (t !== "object") {
          Ga(e, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          e.removeAttribute(n);
          break;
        }
        i = Qa("" + i), e.setAttribute(n, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (t !== "input" && Ce(e, t, "name", s.name, s, null), Ce(
            e,
            t,
            "formEncType",
            s.formEncType,
            s,
            null
          ), Ce(
            e,
            t,
            "formMethod",
            s.formMethod,
            s,
            null
          ), Ce(
            e,
            t,
            "formTarget",
            s.formTarget,
            s,
            null
          )) : (Ce(e, t, "encType", s.encType, s, null), Ce(e, t, "method", s.method, s, null), Ce(e, t, "target", s.target, s, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          e.removeAttribute(n);
          break;
        }
        i = Qa("" + i), e.setAttribute(n, i);
        break;
      case "onClick":
        i != null && (e.onclick = Ls);
        break;
      case "onScroll":
        i != null && be("scroll", e);
        break;
      case "onScrollEnd":
        i != null && be("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (s.children != null) throw Error(r(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        e.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = Qa("" + i), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(n, "" + i) : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === !0 ? e.setAttribute(n, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(n, i) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? e.setAttribute(n, i) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? e.removeAttribute(n) : e.setAttribute(n, i);
        break;
      case "popover":
        be("beforetoggle", e), be("toggle", e), Ya(e, "popover", i);
        break;
      case "xlinkActuate":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          i
        );
        break;
      case "xlinkArcrole":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          i
        );
        break;
      case "xlinkRole":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          i
        );
        break;
      case "xlinkShow":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          i
        );
        break;
      case "xlinkTitle":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          i
        );
        break;
      case "xlinkType":
        rn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          i
        );
        break;
      case "xmlBase":
        rn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          i
        );
        break;
      case "xmlLang":
        rn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          i
        );
        break;
      case "xmlSpace":
        rn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          i
        );
        break;
      case "is":
        Ya(e, "is", i);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = bg.get(n) || n, Ya(e, n, i));
    }
  }
  function ac(e, t, n, i, s, u) {
    switch (n) {
      case "style":
        vo(e, i, u);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (s.children != null) throw Error(r(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof i == "string" ? Hi(e, i) : (typeof i == "number" || typeof i == "bigint") && Hi(e, "" + i);
        break;
      case "onScroll":
        i != null && be("scroll", e);
        break;
      case "onScrollEnd":
        i != null && be("scrollend", e);
        break;
      case "onClick":
        i != null && (e.onclick = Ls);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!uo.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (s = n.endsWith("Capture"), t = n.slice(2, s ? n.length - 7 : void 0), u = e[_t] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, s), typeof i == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, i, s);
              break e;
            }
            n in e ? e[n] = i : i === !0 ? e.setAttribute(n, "") : Ya(e, n, i);
          }
    }
  }
  function rt(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        be("error", e), be("load", e);
        var i = !1, s = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var h = n[u];
            if (h != null)
              switch (u) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  s = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  Ce(e, t, u, h, n, null);
              }
          }
        s && Ce(e, t, "srcSet", n.srcSet, n, null), i && Ce(e, t, "src", n.src, n, null);
        return;
      case "input":
        be("invalid", e);
        var m = u = h = s = null, p = null, w = null;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var M = n[i];
            if (M != null)
              switch (i) {
                case "name":
                  s = M;
                  break;
                case "type":
                  h = M;
                  break;
                case "checked":
                  p = M;
                  break;
                case "defaultChecked":
                  w = M;
                  break;
                case "value":
                  u = M;
                  break;
                case "defaultValue":
                  m = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(r(137, t));
                  break;
                default:
                  Ce(e, t, i, M, n, null);
              }
          }
        po(
          e,
          u,
          m,
          p,
          w,
          h,
          s,
          !1
        ), Va(e);
        return;
      case "select":
        be("invalid", e), i = h = u = null;
        for (s in n)
          if (n.hasOwnProperty(s) && (m = n[s], m != null))
            switch (s) {
              case "value":
                u = m;
                break;
              case "defaultValue":
                h = m;
                break;
              case "multiple":
                i = m;
              default:
                Ce(e, t, s, m, n, null);
            }
        t = u, n = h, e.multiple = !!i, t != null ? Li(e, !!i, t, !1) : n != null && Li(e, !!i, n, !0);
        return;
      case "textarea":
        be("invalid", e), u = s = i = null;
        for (h in n)
          if (n.hasOwnProperty(h) && (m = n[h], m != null))
            switch (h) {
              case "value":
                i = m;
                break;
              case "defaultValue":
                s = m;
                break;
              case "children":
                u = m;
                break;
              case "dangerouslySetInnerHTML":
                if (m != null) throw Error(r(91));
                break;
              default:
                Ce(e, t, h, m, n, null);
            }
        _o(e, i, s, u), Va(e);
        return;
      case "option":
        for (p in n)
          n.hasOwnProperty(p) && (i = n[p], i != null) && (p === "selected" ? e.selected = i && typeof i != "function" && typeof i != "symbol" : Ce(e, t, p, i, n, null));
        return;
      case "dialog":
        be("beforetoggle", e), be("toggle", e), be("cancel", e), be("close", e);
        break;
      case "iframe":
      case "object":
        be("load", e);
        break;
      case "video":
      case "audio":
        for (i = 0; i < fa.length; i++)
          be(fa[i], e);
        break;
      case "image":
        be("error", e), be("load", e);
        break;
      case "details":
        be("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        be("error", e), be("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (w in n)
          if (n.hasOwnProperty(w) && (i = n[w], i != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                Ce(e, t, w, i, n, null);
            }
        return;
      default:
        if (Sr(t)) {
          for (M in n)
            n.hasOwnProperty(M) && (i = n[M], i !== void 0 && ac(
              e,
              t,
              M,
              i,
              n,
              void 0
            ));
          return;
        }
    }
    for (m in n)
      n.hasOwnProperty(m) && (i = n[m], i != null && Ce(e, t, m, i, n, null));
  }
  function Gp(e, t, n, i) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var s = null, u = null, h = null, m = null, p = null, w = null, M = null;
        for (A in n) {
          var z = n[A];
          if (n.hasOwnProperty(A) && z != null)
            switch (A) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                p = z;
              default:
                i.hasOwnProperty(A) || Ce(e, t, A, null, i, z);
            }
        }
        for (var R in i) {
          var A = i[R];
          if (z = n[R], i.hasOwnProperty(R) && (A != null || z != null))
            switch (R) {
              case "type":
                u = A;
                break;
              case "name":
                s = A;
                break;
              case "checked":
                w = A;
                break;
              case "defaultChecked":
                M = A;
                break;
              case "value":
                h = A;
                break;
              case "defaultValue":
                m = A;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(r(137, t));
                break;
              default:
                A !== z && Ce(
                  e,
                  t,
                  R,
                  A,
                  i,
                  z
                );
            }
        }
        yr(
          e,
          h,
          m,
          p,
          w,
          M,
          u,
          s
        );
        return;
      case "select":
        A = h = m = R = null;
        for (u in n)
          if (p = n[u], n.hasOwnProperty(u) && p != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                A = p;
              default:
                i.hasOwnProperty(u) || Ce(
                  e,
                  t,
                  u,
                  null,
                  i,
                  p
                );
            }
        for (s in i)
          if (u = i[s], p = n[s], i.hasOwnProperty(s) && (u != null || p != null))
            switch (s) {
              case "value":
                R = u;
                break;
              case "defaultValue":
                m = u;
                break;
              case "multiple":
                h = u;
              default:
                u !== p && Ce(
                  e,
                  t,
                  s,
                  u,
                  i,
                  p
                );
            }
        t = m, n = h, i = A, R != null ? Li(e, !!n, R, !1) : !!i != !!n && (t != null ? Li(e, !!n, t, !0) : Li(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        A = R = null;
        for (m in n)
          if (s = n[m], n.hasOwnProperty(m) && s != null && !i.hasOwnProperty(m))
            switch (m) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ce(e, t, m, null, i, s);
            }
        for (h in i)
          if (s = i[h], u = n[h], i.hasOwnProperty(h) && (s != null || u != null))
            switch (h) {
              case "value":
                R = s;
                break;
              case "defaultValue":
                A = s;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(r(91));
                break;
              default:
                s !== u && Ce(e, t, h, s, i, u);
            }
        bo(e, R, A);
        return;
      case "option":
        for (var ne in n)
          R = n[ne], n.hasOwnProperty(ne) && R != null && !i.hasOwnProperty(ne) && (ne === "selected" ? e.selected = !1 : Ce(
            e,
            t,
            ne,
            null,
            i,
            R
          ));
        for (p in i)
          R = i[p], A = n[p], i.hasOwnProperty(p) && R !== A && (R != null || A != null) && (p === "selected" ? e.selected = R && typeof R != "function" && typeof R != "symbol" : Ce(
            e,
            t,
            p,
            R,
            i,
            A
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ee in n)
          R = n[ee], n.hasOwnProperty(ee) && R != null && !i.hasOwnProperty(ee) && Ce(e, t, ee, null, i, R);
        for (w in i)
          if (R = i[w], A = n[w], i.hasOwnProperty(w) && R !== A && (R != null || A != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(r(137, t));
                break;
              default:
                Ce(
                  e,
                  t,
                  w,
                  R,
                  i,
                  A
                );
            }
        return;
      default:
        if (Sr(t)) {
          for (var De in n)
            R = n[De], n.hasOwnProperty(De) && R !== void 0 && !i.hasOwnProperty(De) && ac(
              e,
              t,
              De,
              void 0,
              i,
              R
            );
          for (M in i)
            R = i[M], A = n[M], !i.hasOwnProperty(M) || R === A || R === void 0 && A === void 0 || ac(
              e,
              t,
              M,
              R,
              i,
              A
            );
          return;
        }
    }
    for (var S in n)
      R = n[S], n.hasOwnProperty(S) && R != null && !i.hasOwnProperty(S) && Ce(e, t, S, null, i, R);
    for (z in i)
      R = i[z], A = n[z], !i.hasOwnProperty(z) || R === A || R == null && A == null || Ce(e, t, z, R, i, A);
  }
  var sc = null, rc = null;
  function Hs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function vd(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Sd(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function uc(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var cc = null;
  function Vp() {
    var e = window.event;
    return e && e.type === "popstate" ? e === cc ? !1 : (cc = e, !0) : (cc = null, !1);
  }
  var Td = typeof setTimeout == "function" ? setTimeout : void 0, Xp = typeof clearTimeout == "function" ? clearTimeout : void 0, Ed = typeof Promise == "function" ? Promise : void 0, Qp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ed < "u" ? function(e) {
    return Ed.resolve(null).then(e).catch(Zp);
  } : Td;
  function Zp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Kn(e) {
    return e === "head";
  }
  function wd(e, t) {
    var n = t, i = 0, s = 0;
    do {
      var u = n.nextSibling;
      if (e.removeChild(n), u && u.nodeType === 8)
        if (n = u.data, n === "/$") {
          if (0 < i && 8 > i) {
            n = i;
            var h = e.ownerDocument;
            if (n & 1 && da(h.documentElement), n & 2 && da(h.body), n & 4)
              for (n = h.head, da(n), h = n.firstChild; h; ) {
                var m = h.nextSibling, p = h.nodeName;
                h[Ol] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && h.rel.toLowerCase() === "stylesheet" || n.removeChild(h), h = m;
              }
          }
          if (s === 0) {
            e.removeChild(u), Sa(t);
            return;
          }
          s--;
        } else
          n === "$" || n === "$?" || n === "$!" ? s++ : i = n.charCodeAt(0) - 48;
      else i = 0;
      n = u;
    } while (n);
    Sa(t);
  }
  function oc(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          oc(n), gr(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function Kp(e, t, n, i) {
    for (; e.nodeType === 1; ) {
      var s = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!i && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (i) {
        if (!e[Ol])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== s.rel || e.getAttribute("href") !== (s.href == null || s.href === "" ? null : s.href) || e.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin) || e.getAttribute("title") !== (s.title == null ? null : s.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (s.src == null ? null : s.src) || e.getAttribute("type") !== (s.type == null ? null : s.type) || e.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = s.name == null ? null : "" + s.name;
        if (s.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Kt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Pp(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Kt(e.nextSibling), e === null)) return null;
    return e;
  }
  function fc(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState === "complete";
  }
  function Jp(e, t) {
    var n = e.ownerDocument;
    if (e.data !== "$?" || n.readyState === "complete")
      t();
    else {
      var i = function() {
        t(), n.removeEventListener("DOMContentLoaded", i);
      };
      n.addEventListener("DOMContentLoaded", i), e._reactRetry = i;
    }
  }
  function Kt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "F!" || t === "F")
          break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  var hc = null;
  function Rd(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Ad(e, t, n) {
    switch (t = Hs(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function da(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    gr(e);
  }
  var Gt = /* @__PURE__ */ new Map(), xd = /* @__PURE__ */ new Set();
  function js(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Sn = H.d;
  H.d = {
    f: Wp,
    r: Ip,
    D: $p,
    C: Fp,
    L: eb,
    m: tb,
    X: ib,
    S: nb,
    M: lb
  };
  function Wp() {
    var e = Sn.f(), t = Cs();
    return e || t;
  }
  function Ip(e) {
    var t = Ui(e);
    t !== null && t.tag === 5 && t.type === "form" ? Kf(t) : Sn.r(e);
  }
  var dl = typeof document > "u" ? null : document;
  function Od(e, t, n) {
    var i = dl;
    if (i && typeof t == "string" && t) {
      var s = Nt(t);
      s = 'link[rel="' + e + '"][href="' + s + '"]', typeof n == "string" && (s += '[crossorigin="' + n + '"]'), xd.has(s) || (xd.add(s), e = { rel: e, crossOrigin: n, href: t }, i.querySelector(s) === null && (t = i.createElement("link"), rt(t, "link", e), et(t), i.head.appendChild(t)));
    }
  }
  function $p(e) {
    Sn.D(e), Od("dns-prefetch", e, null);
  }
  function Fp(e, t) {
    Sn.C(e, t), Od("preconnect", e, t);
  }
  function eb(e, t, n) {
    Sn.L(e, t, n);
    var i = dl;
    if (i && e && t) {
      var s = 'link[rel="preload"][as="' + Nt(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (s += '[imagesrcset="' + Nt(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (s += '[imagesizes="' + Nt(
        n.imageSizes
      ) + '"]')) : s += '[href="' + Nt(e) + '"]';
      var u = s;
      switch (t) {
        case "style":
          u = ml(e);
          break;
        case "script":
          u = gl(e);
      }
      Gt.has(u) || (e = T(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), Gt.set(u, e), i.querySelector(s) !== null || t === "style" && i.querySelector(ma(u)) || t === "script" && i.querySelector(ga(u)) || (t = i.createElement("link"), rt(t, "link", e), et(t), i.head.appendChild(t)));
    }
  }
  function tb(e, t) {
    Sn.m(e, t);
    var n = dl;
    if (n && e) {
      var i = t && typeof t.as == "string" ? t.as : "script", s = 'link[rel="modulepreload"][as="' + Nt(i) + '"][href="' + Nt(e) + '"]', u = s;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = gl(e);
      }
      if (!Gt.has(u) && (e = T({ rel: "modulepreload", href: e }, t), Gt.set(u, e), n.querySelector(s) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(ga(u)))
              return;
        }
        i = n.createElement("link"), rt(i, "link", e), et(i), n.head.appendChild(i);
      }
    }
  }
  function nb(e, t, n) {
    Sn.S(e, t, n);
    var i = dl;
    if (i && e) {
      var s = ki(i).hoistableStyles, u = ml(e);
      t = t || "default";
      var h = s.get(u);
      if (!h) {
        var m = { loading: 0, preload: null };
        if (h = i.querySelector(
          ma(u)
        ))
          m.loading = 5;
        else {
          e = T(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = Gt.get(u)) && dc(e, n);
          var p = h = i.createElement("link");
          et(p), rt(p, "link", e), p._p = new Promise(function(w, M) {
            p.onload = w, p.onerror = M;
          }), p.addEventListener("load", function() {
            m.loading |= 1;
          }), p.addEventListener("error", function() {
            m.loading |= 2;
          }), m.loading |= 4, qs(h, t, i);
        }
        h = {
          type: "stylesheet",
          instance: h,
          count: 1,
          state: m
        }, s.set(u, h);
      }
    }
  }
  function ib(e, t) {
    Sn.X(e, t);
    var n = dl;
    if (n && e) {
      var i = ki(n).hoistableScripts, s = gl(e), u = i.get(s);
      u || (u = n.querySelector(ga(s)), u || (e = T({ src: e, async: !0 }, t), (t = Gt.get(s)) && mc(e, t), u = n.createElement("script"), et(u), rt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, i.set(s, u));
    }
  }
  function lb(e, t) {
    Sn.M(e, t);
    var n = dl;
    if (n && e) {
      var i = ki(n).hoistableScripts, s = gl(e), u = i.get(s);
      u || (u = n.querySelector(ga(s)), u || (e = T({ src: e, async: !0, type: "module" }, t), (t = Gt.get(s)) && mc(e, t), u = n.createElement("script"), et(u), rt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, i.set(s, u));
    }
  }
  function Md(e, t, n, i) {
    var s = (s = le.current) ? js(s) : null;
    if (!s) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = ml(n.href), n = ki(
          s
        ).hoistableStyles, i = n.get(t), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, i)), i) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = ml(n.href);
          var u = ki(
            s
          ).hoistableStyles, h = u.get(e);
          if (h || (s = s.ownerDocument || s, h = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, h), (u = s.querySelector(
            ma(e)
          )) && !u._p && (h.instance = u, h.state.loading = 5), Gt.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Gt.set(e, n), u || ab(
            s,
            e,
            n,
            h.state
          ))), t && i === null)
            throw Error(r(528, ""));
          return h;
        }
        if (t && i !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = gl(n), n = ki(
          s
        ).hoistableScripts, i = n.get(t), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, i)), i) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, e));
    }
  }
  function ml(e) {
    return 'href="' + Nt(e) + '"';
  }
  function ma(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Cd(e) {
    return T({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function ab(e, t, n, i) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? i.loading = 1 : (t = e.createElement("link"), i.preload = t, t.addEventListener("load", function() {
      return i.loading |= 1;
    }), t.addEventListener("error", function() {
      return i.loading |= 2;
    }), rt(t, "link", n), et(t), e.head.appendChild(t));
  }
  function gl(e) {
    return '[src="' + Nt(e) + '"]';
  }
  function ga(e) {
    return "script[async]" + e;
  }
  function Dd(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var i = e.querySelector(
            'style[data-href~="' + Nt(n.href) + '"]'
          );
          if (i)
            return t.instance = i, et(i), i;
          var s = T({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return i = (e.ownerDocument || e).createElement(
            "style"
          ), et(i), rt(i, "style", s), qs(i, n.precedence, e), t.instance = i;
        case "stylesheet":
          s = ml(n.href);
          var u = e.querySelector(
            ma(s)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, et(u), u;
          i = Cd(n), (s = Gt.get(s)) && dc(i, s), u = (e.ownerDocument || e).createElement("link"), et(u);
          var h = u;
          return h._p = new Promise(function(m, p) {
            h.onload = m, h.onerror = p;
          }), rt(u, "link", i), t.state.loading |= 4, qs(u, n.precedence, e), t.instance = u;
        case "script":
          return u = gl(n.src), (s = e.querySelector(
            ga(u)
          )) ? (t.instance = s, et(s), s) : (i = n, (s = Gt.get(u)) && (i = T({}, n), mc(i, s)), e = e.ownerDocument || e, s = e.createElement("script"), et(s), rt(s, "link", i), e.head.appendChild(s), t.instance = s);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (i = t.instance, t.state.loading |= 4, qs(i, n.precedence, e));
    return t.instance;
  }
  function qs(e, t, n) {
    for (var i = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), s = i.length ? i[i.length - 1] : null, u = s, h = 0; h < i.length; h++) {
      var m = i[h];
      if (m.dataset.precedence === t) u = m;
      else if (u !== s) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function dc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function mc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Ys = null;
  function zd(e, t, n) {
    if (Ys === null) {
      var i = /* @__PURE__ */ new Map(), s = Ys = /* @__PURE__ */ new Map();
      s.set(n, i);
    } else
      s = Ys, i = s.get(n), i || (i = /* @__PURE__ */ new Map(), s.set(n, i));
    if (i.has(e)) return i;
    for (i.set(e, null), n = n.getElementsByTagName(e), s = 0; s < n.length; s++) {
      var u = n[s];
      if (!(u[Ol] || u[ct] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var h = u.getAttribute(t) || "";
        h = e + h;
        var m = i.get(h);
        m ? m.push(u) : i.set(h, [u]);
      }
    }
    return i;
  }
  function Ud(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function sb(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function kd(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  var pa = null;
  function rb() {
  }
  function ub(e, t, n) {
    if (pa === null) throw Error(r(475));
    var i = pa;
    if (t.type === "stylesheet" && (typeof n.media != "string" || matchMedia(n.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var s = ml(n.href), u = e.querySelector(
          ma(s)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (i.count++, i = Gs.bind(i), e.then(i, i)), t.state.loading |= 4, t.instance = u, et(u);
          return;
        }
        u = e.ownerDocument || e, n = Cd(n), (s = Gt.get(s)) && dc(n, s), u = u.createElement("link"), et(u);
        var h = u;
        h._p = new Promise(function(m, p) {
          h.onload = m, h.onerror = p;
        }), rt(u, "link", n), t.instance = u;
      }
      i.stylesheets === null && (i.stylesheets = /* @__PURE__ */ new Map()), i.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (i.count++, t = Gs.bind(i), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function cb() {
    if (pa === null) throw Error(r(475));
    var e = pa;
    return e.stylesheets && e.count === 0 && gc(e, e.stylesheets), 0 < e.count ? function(t) {
      var n = setTimeout(function() {
        if (e.stylesheets && gc(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(n);
      };
    } : null;
  }
  function Gs() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) gc(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Vs = null;
  function gc(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Vs = /* @__PURE__ */ new Map(), t.forEach(ob, e), Vs = null, Gs.call(e));
  }
  function ob(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Vs.get(e);
      if (n) var i = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Vs.set(e, n);
        for (var s = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < s.length; u++) {
          var h = s[u];
          (h.nodeName === "LINK" || h.getAttribute("media") !== "not all") && (n.set(h.dataset.precedence, h), i = h);
        }
        i && n.set(null, i);
      }
      s = t.instance, h = s.getAttribute("data-precedence"), u = n.get(h) || i, u === i && n.set(null, s), n.set(h, s), this.count++, i = Gs.bind(this), s.addEventListener("load", i), s.addEventListener("error", i), u ? u.parentNode.insertBefore(s, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(s, e.firstChild)), t.state.loading |= 4;
    }
  }
  var ba = {
    $$typeof: me,
    Provider: null,
    Consumer: null,
    _currentValue: I,
    _currentValue2: I,
    _threadCount: 0
  };
  function fb(e, t, n, i, s, u, h, m) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = fr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = fr(0), this.hiddenUpdates = fr(null), this.identifierPrefix = i, this.onUncaughtError = s, this.onCaughtError = u, this.onRecoverableError = h, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = m, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Nd(e, t, n, i, s, u, h, m, p, w, M, z) {
    return e = new fb(
      e,
      t,
      n,
      h,
      m,
      p,
      w,
      z
    ), t = 1, u === !0 && (t |= 24), u = At(3, null, null, t), e.current = u, u.stateNode = e, t = Wr(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: t
    }, eu(u), e;
  }
  function Bd(e) {
    return e ? (e = Zi, e) : Zi;
  }
  function Ld(e, t, n, i, s, u) {
    s = Bd(s), i.context === null ? i.context = s : i.pendingContext = s, i = kn(t), i.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (i.callback = u), n = Nn(e, i, t), n !== null && (Dt(n, e, t), Kl(n, e, t));
  }
  function Hd(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function pc(e, t) {
    Hd(e, t), (e = e.alternate) && Hd(e, t);
  }
  function jd(e) {
    if (e.tag === 13) {
      var t = Qi(e, 67108864);
      t !== null && Dt(t, e, 67108864), pc(e, 67108864);
    }
  }
  var Xs = !0;
  function hb(e, t, n, i) {
    var s = O.T;
    O.T = null;
    var u = H.p;
    try {
      H.p = 2, bc(e, t, n, i);
    } finally {
      H.p = u, O.T = s;
    }
  }
  function db(e, t, n, i) {
    var s = O.T;
    O.T = null;
    var u = H.p;
    try {
      H.p = 8, bc(e, t, n, i);
    } finally {
      H.p = u, O.T = s;
    }
  }
  function bc(e, t, n, i) {
    if (Xs) {
      var s = _c(i);
      if (s === null)
        lc(
          e,
          t,
          i,
          Qs,
          n
        ), Yd(e, i);
      else if (gb(
        s,
        e,
        t,
        n,
        i
      ))
        i.stopPropagation();
      else if (Yd(e, i), t & 4 && -1 < mb.indexOf(e)) {
        for (; s !== null; ) {
          var u = Ui(s);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var h = ii(u.pendingLanes);
                  if (h !== 0) {
                    var m = u;
                    for (m.pendingLanes |= 2, m.entangledLanes |= 2; h; ) {
                      var p = 1 << 31 - ae(h);
                      m.entanglements[1] |= p, h &= ~p;
                    }
                    an(u), (xe & 6) === 0 && (Os = Ut() + 500, oa(0));
                  }
                }
                break;
              case 13:
                m = Qi(u, 2), m !== null && Dt(m, u, 2), Cs(), pc(u, 2);
            }
          if (u = _c(i), u === null && lc(
            e,
            t,
            i,
            Qs,
            n
          ), u === s) break;
          s = u;
        }
        s !== null && i.stopPropagation();
      } else
        lc(
          e,
          t,
          i,
          null,
          n
        );
    }
  }
  function _c(e) {
    return e = Er(e), yc(e);
  }
  var Qs = null;
  function yc(e) {
    if (Qs = null, e = zi(e), e !== null) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = d(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Qs = e, null;
  }
  function qd(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (cr()) {
          case Ba:
            return 2;
          case La:
            return 8;
          case Ci:
          case or:
            return 32;
          case D:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var vc = !1, Pn = null, Jn = null, Wn = null, _a = /* @__PURE__ */ new Map(), ya = /* @__PURE__ */ new Map(), In = [], mb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Yd(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Pn = null;
        break;
      case "dragenter":
      case "dragleave":
        Jn = null;
        break;
      case "mouseover":
      case "mouseout":
        Wn = null;
        break;
      case "pointerover":
      case "pointerout":
        _a.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ya.delete(t.pointerId);
    }
  }
  function va(e, t, n, i, s, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: i,
      nativeEvent: u,
      targetContainers: [s]
    }, t !== null && (t = Ui(t), t !== null && jd(t)), e) : (e.eventSystemFlags |= i, t = e.targetContainers, s !== null && t.indexOf(s) === -1 && t.push(s), e);
  }
  function gb(e, t, n, i, s) {
    switch (t) {
      case "focusin":
        return Pn = va(
          Pn,
          e,
          t,
          n,
          i,
          s
        ), !0;
      case "dragenter":
        return Jn = va(
          Jn,
          e,
          t,
          n,
          i,
          s
        ), !0;
      case "mouseover":
        return Wn = va(
          Wn,
          e,
          t,
          n,
          i,
          s
        ), !0;
      case "pointerover":
        var u = s.pointerId;
        return _a.set(
          u,
          va(
            _a.get(u) || null,
            e,
            t,
            n,
            i,
            s
          )
        ), !0;
      case "gotpointercapture":
        return u = s.pointerId, ya.set(
          u,
          va(
            ya.get(u) || null,
            e,
            t,
            n,
            i,
            s
          )
        ), !0;
    }
    return !1;
  }
  function Gd(e) {
    var t = zi(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = d(n), t !== null) {
            e.blockedOn = t, ug(e.priority, function() {
              if (n.tag === 13) {
                var i = Ct();
                i = hr(i);
                var s = Qi(n, i);
                s !== null && Dt(s, n, i), pc(n, i);
              }
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Zs(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = _c(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var i = new n.constructor(
          n.type,
          n
        );
        Tr = i, n.target.dispatchEvent(i), Tr = null;
      } else
        return t = Ui(n), t !== null && jd(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Vd(e, t, n) {
    Zs(e) && n.delete(t);
  }
  function pb() {
    vc = !1, Pn !== null && Zs(Pn) && (Pn = null), Jn !== null && Zs(Jn) && (Jn = null), Wn !== null && Zs(Wn) && (Wn = null), _a.forEach(Vd), ya.forEach(Vd);
  }
  function Ks(e, t) {
    e.blockedOn === t && (e.blockedOn = null, vc || (vc = !0, c.unstable_scheduleCallback(
      c.unstable_NormalPriority,
      pb
    )));
  }
  var Ps = null;
  function Xd(e) {
    Ps !== e && (Ps = e, c.unstable_scheduleCallback(
      c.unstable_NormalPriority,
      function() {
        Ps === e && (Ps = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], i = e[t + 1], s = e[t + 2];
          if (typeof i != "function") {
            if (yc(i || n) === null)
              continue;
            break;
          }
          var u = Ui(n);
          u !== null && (e.splice(t, 3), t -= 3, yu(
            u,
            {
              pending: !0,
              data: s,
              method: n.method,
              action: i
            },
            i,
            s
          ));
        }
      }
    ));
  }
  function Sa(e) {
    function t(p) {
      return Ks(p, e);
    }
    Pn !== null && Ks(Pn, e), Jn !== null && Ks(Jn, e), Wn !== null && Ks(Wn, e), _a.forEach(t), ya.forEach(t);
    for (var n = 0; n < In.length; n++) {
      var i = In[n];
      i.blockedOn === e && (i.blockedOn = null);
    }
    for (; 0 < In.length && (n = In[0], n.blockedOn === null); )
      Gd(n), n.blockedOn === null && In.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (i = 0; i < n.length; i += 3) {
        var s = n[i], u = n[i + 1], h = s[_t] || null;
        if (typeof u == "function")
          h || Xd(n);
        else if (h) {
          var m = null;
          if (u && u.hasAttribute("formAction")) {
            if (s = u, h = u[_t] || null)
              m = h.formAction;
            else if (yc(s) !== null) continue;
          } else m = h.action;
          typeof m == "function" ? n[i + 1] = m : (n.splice(i, 3), i -= 3), Xd(n);
        }
      }
  }
  function Sc(e) {
    this._internalRoot = e;
  }
  Js.prototype.render = Sc.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var n = t.current, i = Ct();
    Ld(n, i, e, t, null, null);
  }, Js.prototype.unmount = Sc.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Ld(e.current, 2, null, e, null, null), Cs(), t[Di] = null;
    }
  };
  function Js(e) {
    this._internalRoot = e;
  }
  Js.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ao();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < In.length && t !== 0 && t < In[n].priority; n++) ;
      In.splice(n, 0, e), n === 0 && Gd(e);
    }
  };
  var Qd = l.version;
  if (Qd !== "19.1.8")
    throw Error(
      r(
        527,
        Qd,
        "19.1.8"
      )
    );
  H.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = b(t), e = e !== null ? g(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var bb = {
    bundleType: 0,
    version: "19.1.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: O,
    reconcilerVersion: "19.1.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ws = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ws.isDisabled && Ws.supportsFiber)
      try {
        X = Ws.inject(
          bb
        ), he = Ws;
      } catch {
      }
  }
  return Aa.createRoot = function(e, t) {
    if (!o(e)) throw Error(r(299));
    var n = !1, i = "", s = rh, u = uh, h = ch, m = null;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (i = t.identifierPrefix), t.onUncaughtError !== void 0 && (s = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (h = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (m = t.unstable_transitionCallbacks)), t = Nd(
      e,
      1,
      !1,
      null,
      null,
      n,
      i,
      s,
      u,
      h,
      m,
      null
    ), e[Di] = t.current, ic(e), new Sc(t);
  }, Aa.hydrateRoot = function(e, t, n) {
    if (!o(e)) throw Error(r(299));
    var i = !1, s = "", u = rh, h = uh, m = ch, p = null, w = null;
    return n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (h = n.onCaughtError), n.onRecoverableError !== void 0 && (m = n.onRecoverableError), n.unstable_transitionCallbacks !== void 0 && (p = n.unstable_transitionCallbacks), n.formState !== void 0 && (w = n.formState)), t = Nd(
      e,
      1,
      !0,
      t,
      n ?? null,
      i,
      s,
      u,
      h,
      m,
      p,
      w
    ), t.context = Bd(null), n = t.current, i = Ct(), i = hr(i), s = kn(i), s.callback = null, Nn(n, s, i), n = i, t.current.lanes = n, xl(t, n), an(t), e[Di] = t.current, ic(e), new Js(t);
  }, Aa.version = "19.1.8", Aa;
}
var xm;
function zv() {
  if (xm) return Lc.exports;
  xm = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (l) {
        console.error(l);
      }
  }
  return c(), Lc.exports = Dv(), Lc.exports;
}
var Uv = zv();
function kv({ title: c, subtitle: l, ariaLabel: a, closeLabel: r, onClose: o, children: f }) {
  return Y.jsxs("div", { className: "cwc-panel", role: "dialog", "aria-modal": !1, "aria-label": a || c, children: [Y.jsxs("div", { className: "cwc-panel__header", children: [Y.jsxs("div", { className: "cwc-panel__titles", children: [Y.jsx("span", { className: "cwc-panel__title", children: c }), l ? Y.jsx("span", { className: "cwc-panel__subtitle", children: l }) : null] }), Y.jsx("button", { type: "button", className: "cwc-panel__close", "aria-label": r, onClick: o, children: Y.jsx("span", { "aria-hidden": "true", children: "×" }) })] }), Y.jsx("div", { className: "cwc-panel__body", children: f })] });
}
const Nv = "cwc-panel__transcript fs-mask fs-exclude ph-no-capture";
function Om(c, l) {
  const { config: a, clientKey: r, apiBaseUrl: o, wsUrl: f, labels: d, logLevel: _, onClose: b, onNavigate: g } = l;
  c.render(Y.jsx(kv, { title: a.panel.title, subtitle: a.panel.subtitle, ariaLabel: a.panel.title, closeLabel: (d == null ? void 0 : d.closeButton) ?? km.closeButton, onClose: b, children: Y.jsx("div", { className: Nv, "data-hj-suppress": !0, "data-clarity-mask": "true", children: Y.jsx(by, { clientKey: r, apiBaseUrl: o, wsUrl: f, labels: d, logLevel: _, onNavigate: g, showHeader: !1 }) }) }));
}
function Bv(c) {
  const l = Uv.createRoot(c.container);
  let a = c;
  return Om(l, a), {
    setProps(r) {
      a = { ...a, ...r }, Om(l, a);
    },
    unmount() {
      l.unmount();
    }
  };
}
const Lv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NavigationContext: Wc,
  mountPanel: Bv
}, Symbol.toStringTag, { value: "Module" }));
export {
  Rv as ConnectlyWebchatElement,
  ka as ELEMENT_TAG_NAME,
  eg as WEBCHAT_ELEMENT_VERSION,
  Av as defineConnectlyWebchat
};
