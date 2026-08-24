// A tab left open across a new deployment still references the previous
// build's content-hashed chunk filenames, which no longer exist on the
// server once the next deploy replaces them — surfacing as 404s and
// "ChunkLoadError". Recovering just means getting the tab onto the current
// deployment.
const RELOAD_FLAG_KEY = "chunk-error-reload-attempted";

export const isChunkLoadError = (error: unknown): boolean => {
    if (!error || typeof error !== "object") return false;
    const { name, message } = error as { name?: unknown; message?: unknown };
    if (name === "ChunkLoadError") return true;
    return typeof message === "string" && /Loading (chunk|CSS chunk) [\w.-]+ failed/i.test(message);
};

// The initial page's own <link rel="stylesheet">/<script src> tags (as
// opposed to a lazily `import()`-ed route chunk) point at the same
// content-hashed /_next/static/ assets, but a 404 on one of those fires a
// plain, non-bubbling Event on the element itself — no thrown Error, no
// rejected promise, so isChunkLoadError's shape check doesn't apply here.
const isStaleStaticAssetFailure = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLLinkElement) && !(target instanceof HTMLScriptElement)) return false;
    const url = target instanceof HTMLLinkElement ? target.href : target.src;
    return url.includes("/_next/static/");
};

// Reloads once per tab session so a stale client self-heals. Guarded by
// sessionStorage so a persistent failure (e.g. an actual outage) can't loop
// the tab on repeated reloads.
const reloadOnce = (): boolean => {
    if (typeof window === "undefined") return false;
    if (window.sessionStorage.getItem(RELOAD_FLAG_KEY)) return false;
    window.sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    window.location.reload();
    return true;
};

export const recoverFromChunkError = (error: unknown): boolean =>
    isChunkLoadError(error) && reloadOnce();

// Safety net for chunk load failures that surface as unhandled rejections
// or global errors rather than being caught by a React error boundary
// (e.g. a background preload, or a loader promise no one awaits) — plus a
// capture-phase listener for a stale initial-load <link>/<script> 404,
// which (being non-bubbling) a bubble-phase window listener never sees.
export const initChunkErrorRecovery = () => {
    if (typeof window === "undefined") return () => {};

    const onError = (event: ErrorEvent) => {
        if (recoverFromChunkError(event.error)) return;
        if (isStaleStaticAssetFailure(event.target)) reloadOnce();
    };
    const onRejection = (event: PromiseRejectionEvent) => recoverFromChunkError(event.reason);

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
        window.removeEventListener("error", onError, true);
        window.removeEventListener("unhandledrejection", onRejection);
    };
};
