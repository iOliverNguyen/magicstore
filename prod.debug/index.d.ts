import * as React from 'react';

type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';
declare global {
    interface Window {
        connectlyWebchatDefaultLogLevel?: LogLevel;
    }
}

type WebchatWidgetLabels = {
    namePlaceholder: string;
    nameAriaLabel: string;
    visitorLabel: string;
    supportLabel: string;
    typingIndicator: string;
    composerPlaceholder: string;
    sendButton: string;
    retryButton: string;
    messageTooLong: string;
    terminatedPlaceholder: string;
    attachAriaLabel: string;
    attachmentLoading: string;
    attachmentUnavailable: string;
    attachmentImage: string;
    attachmentVideo: string;
    attachmentAudio: string;
    attachmentDocument: string;
    attachmentGeneric: string;
    carouselEmptyCard: string;
    urlButtonFallback: string;
    nonHttpUrlNote: string;
    closeButton: string;
};

type WidgetUiSide = 'left' | 'right';
type WidgetUiLauncherShape = 'circle' | 'pill';
type WidgetUiIconKind = 'default' | 'url' | 'none';
type WidgetUiPanelAnchor = 'launcher' | 'center';
type WidgetUiColorScheme = 'light' | 'dark' | 'auto';
type WidgetUiAutoOpen = 'never' | 'firstVisit' | 'everyVisit';
type WidgetUiLinkTarget = 'host' | 'newTab';
type WidgetUiPathsMode = 'all' | 'include' | 'exclude';
type WidgetUiLauncherIcon = {
    kind: WidgetUiIconKind;
    url: string;
};
type WidgetUiLauncher = {
    side: WidgetUiSide;
    offsetX: number;
    offsetY: number;
    size: number;
    shape: WidgetUiLauncherShape;
    label: string;
    ariaLabel: string;
    icon: WidgetUiLauncherIcon;
    hideOnMobile: boolean;
};
type WidgetUiPanel = {
    width: number;
    height: number;
    radius: number;
    title: string;
    subtitle: string;
    greeting: string;
    showBranding: boolean;
    anchor: WidgetUiPanelAnchor;
};
type WidgetUiTheme = {
    accent: string;
    accentText: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    bubbleVisitor: string;
    bubbleVisitorText: string;
    bubbleAgent: string;
    bubbleAgentText: string;
    bubbleRadius: number;
    fontFamily: string;
    colorScheme: WidgetUiColorScheme;
};
type WidgetUiCollision = {
    bottomOffsetSelectors: string[];
    bottomOffsetPx: number;
    maxBottomOffsetPx: number;
    hideBehindModalDialog: boolean;
};
type WidgetUiMobileLauncher = {
    offsetX: number;
    offsetY: number;
    size: number;
};
type WidgetUiMobilePanel = {
    fullscreen: boolean;
    width: number;
    height: number;
    radius: number;
};
type WidgetUiMobile = {
    breakpointPx: number;
    launcher: WidgetUiMobileLauncher;
    panel: WidgetUiMobilePanel;
};
type WidgetUiBehavior = {
    autoOpen: WidgetUiAutoOpen;
    autoOpenDelayMs: number;
    autoOpenDesktopOnly: boolean;
    prefetchPanel: boolean;
};
type WidgetUiNavigation = {
    linkTarget: WidgetUiLinkTarget;
};
type WidgetUiPaths = {
    mode: WidgetUiPathsMode;
    patterns: string[];
};
type WidgetUiPositionFixed = {
    bottom: number;
    right: number;
};
type WidgetUiPositionRelative = {
    parentElementClass: string;
};
type WidgetUiPosition = {
    fixed?: WidgetUiPositionFixed;
    relative?: WidgetUiPositionRelative;
};
type WidgetUi = {
    schemaVersion: number;
    launcher: WidgetUiLauncher;
    panel: WidgetUiPanel;
    theme: WidgetUiTheme;
    zIndex: number;
    collision: WidgetUiCollision;
    mobile: WidgetUiMobile;
    behavior: WidgetUiBehavior;
    navigation: WidgetUiNavigation;
    paths: WidgetUiPaths;
    position: WidgetUiPosition;
    bundleVersion: string;
};
type WidgetUiLayer = Omit<{
    [K in keyof WidgetUi]?: Partial<WidgetUi[K]>;
}, 'mobile'> & {
    mobile?: Partial<Omit<WidgetUiMobile, 'launcher' | 'panel'>> & {
        launcher?: Partial<WidgetUiMobileLauncher>;
        panel?: Partial<WidgetUiMobilePanel>;
    };
};

type WidgetConfigSource = 'server' | 'cache' | 'default';

declare const ELEMENT_TAG_NAME = "connectly-webchat";
type WebchatElementEventDetail = {
    ready: {
        configSource: WidgetConfigSource;
        version: string;
    };
    open: Record<string, never>;
    close: Record<string, never>;
    error: {
        stage: 'config' | 'panel-load' | 'panel-mount';
        error: unknown;
    };
    'config-warning': {
        warnings: string[];
    };
};
declare class ConnectlyWebchatElement extends HTMLElement {
    #private;
    static get observedAttributes(): readonly string[];
    config: WidgetUiLayer | undefined;
    labels: Partial<WebchatWidgetLabels> | undefined;
    get clientKey(): string;
    set clientKey(value: string);
    get apiBaseUrl(): string | undefined;
    set apiBaseUrl(value: string | undefined);
    get wsUrl(): string | undefined;
    set wsUrl(value: string | undefined);
    get title(): string;
    set title(value: string);
    get logLevel(): LogLevel;
    set logLevel(value: LogLevel);
    get open(): boolean;
    set open(value: boolean);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    openPanel(): void;
    closePanel(): void;
    toggle(): void;
    reload(): void;
    destroy(): void;
    get isOpen(): boolean;
    get resolvedConfig(): WidgetUi;
}
declare function defineConnectlyWebchat(): void;

type WebchatInitOptions = {
    clientKey: string;
    apiBaseUrl?: string;
    wsUrl?: string;
    title?: string;
    width?: number | string;
    height?: number | string;
    logLevel?: LogLevel;
    config?: WidgetUiLayer;
    open?: boolean;
    onMountedChange?: (mounted: boolean) => void;
    onOpenChange?: (open: boolean) => void;
};
type ConnectlyWebchatGlobal = {
    init(options: WebchatInitOptions): ConnectlyWebchatElement | null;
    destroy(): void;
    open(): void;
    close(): void;
    toggle(): void;
    isOpen(): boolean;
    isMounted(): boolean;
    element(): ConnectlyWebchatElement | null;
    version: string;
};
declare global {
    interface Window {
        ConnectlyWebchat?: ConnectlyWebchatGlobal;
    }
}

type EmbedOriginOptions = {
    apiBaseUrl: string;
    forced: boolean;
};
type EmbedOriginRecord = EmbedOriginOptions & {
    warnedIgnoredValues: Set<string>;
};
declare global {
    interface Window {
        connectlyWebchatEmbedOrigin?: EmbedOriginRecord;
    }
}

declare const WEBCHAT_ELEMENT_VERSION = "2026.2.0";
type WebchatRegistry = {
    elements: Set<ConnectlyWebchatElement>;
    pendingAutoMount: boolean;
    version: string;
};
declare global {
    interface Window {
        connectlyWebchatRegistry?: WebchatRegistry;
    }
}

/**
 * `@connectly/webchat` — the package entry. Importing this module DEFINES
 * `<connectly-webchat>` and bakes in the gateway origin this artifact was built for.
 * That is the whole product: a bundler user does `import '@connectly/webchat'` and then
 * writes the element, with no snippet, no page global, and no origin to configure.
 *
 * BROWSER-ONLY. The module-scope side effects are guarded so that importing this module
 * in a runtime with no `window` is inert instead of fatal, but the widget only exists in
 * a browser and the bundle cannot be evaluated on a server at all — see "Server
 * rendering (Next.js, Remix, Nuxt, Astro)" in the README.
 *
 * This entry publishes NO page global, and exports neither `configureEmbedOrigin` /
 * `publishGlobalApi` nor the SDK's internals (`WebchatClient`, `WebchatRest`,
 * `SessionManager`, `WebchatWidget`). Both omissions are deliberate, and one of them is
 * a security property rather than an oversight: the gateway origin is baked in at build
 * time and locked, because a client key is public by design and an overridable origin
 * would let anyone who reads one point that merchant's widget at their own backend.
 *
 * MAINTAINERS: this header is published verbatim inside `index.d.ts` (see "Types" in this
 * package's internal README.md). Keep it to what a consumer benefits from reading; the
 * internal reasoning lives in that README, under "Why this entry exports so little" and
 * "Why the origin is baked and locked".
 */

/**
 * JSX support for `<connectly-webchat>`, so a TSX consumer can write the element
 * directly instead of going through `@connectly/webchat/react`.
 *
 * Augmenting `'react'` rather than declaring a global `JSX` namespace: React 19's types
 * removed the global namespace in favour of `React.JSX`, so a `declare global { namespace
 * JSX }` block compiles cleanly and then does absolutely nothing for a React 19 consumer
 * — the worst failure shape available, since the symptom is a type error in THEIR file
 * about an unknown intrinsic element with no hint that the fix lives here. The cost of
 * the augmentation is that it needs `react`'s types to resolve: a consumer with neither
 * React nor `skipLibCheck` sees `TS2664` from this file. That is the right way round —
 * react/react-dom are optional peers precisely so a Vue or vanilla consumer installs
 * neither, and for them the actionable answer is `skipLibCheck` (which the vast majority
 * of app tsconfigs already set), not a JSX declaration that silently misses.
 *
 * Two collisions with the element's real API are handled below; both are the kind that
 * type-checks and then misbehaves at runtime.
 */
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'connectly-webchat': ConnectlyWebchatJsxAttributes;
        }
    }
}
/**
 * The attributes `<connectly-webchat>` observes, as JSX writes them.
 *
 * Every value is a STRING because that is what an attribute is: the element reads all of
 * these through `getAttribute`, and `Number('380px')` being `NaN` is the reason
 * `width`/`height` are bare pixel counts rather than CSS lengths.
 *
 * `title` is omitted from `HTMLAttributes` and redeclared. Not a type conflict — both are
 * `string` — but a semantic one worth spelling out: on this element `title` is the PANEL
 * HEADING (the accessor shadows `HTMLElement.title`), not the browser tooltip React's
 * `HTMLAttributes['title']` documents. A consumer who reads the React typing's doc
 * comment and passes a tooltip gets it rendered as their chat's header.
 */
type ConnectlyWebchatJsxAttributes = Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'children'> & React.RefAttributes<ConnectlyWebchatElement> & {
    'client-key': string;
    /** The panel heading — NOT a tooltip. See the note above. */
    title?: string;
    /** Panel width in bare pixels, e.g. `"380"`. `"380px"` parses to `NaN` and is ignored. */
    width?: string;
    /** Panel height in bare pixels. */
    height?: string;
    side?: 'left' | 'right';
    'offset-x'?: string;
    'offset-y'?: string;
    'z-index'?: string;
    'bottom-offset-px'?: string;
    'log-level'?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
    'auto-mount'?: string;
    /**
     * REFLECTED BOOLEAN, and typed as the empty string on purpose. The element's `open`
     * state is `hasAttribute('open')`, and React 19 stringifies booleans on custom
     * elements — so `open={false}` renders `open="false"`, which `hasAttribute` reads as
     * TRUE and pops the panel open on first paint. Write `open={isOpen ? '' : undefined}`;
     * `undefined` is the only value React removes the attribute for.
     */
    open?: '';
};

export { ConnectlyWebchatElement, ELEMENT_TAG_NAME, WEBCHAT_ELEMENT_VERSION, defineConnectlyWebchat };
export type { ConnectlyWebchatJsxAttributes, WebchatElementEventDetail, WidgetUi, WidgetUiAutoOpen, WidgetUiBehavior, WidgetUiCollision, WidgetUiColorScheme, WidgetUiIconKind, WidgetUiLauncher, WidgetUiLauncherIcon, WidgetUiLauncherShape, WidgetUiLayer, WidgetUiLinkTarget, WidgetUiMobile, WidgetUiMobileLauncher, WidgetUiMobilePanel, WidgetUiNavigation, WidgetUiPanel, WidgetUiPanelAnchor, WidgetUiPaths, WidgetUiPathsMode, WidgetUiPosition, WidgetUiPositionFixed, WidgetUiPositionRelative, WidgetUiSide, WidgetUiTheme };
