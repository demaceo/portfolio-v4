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

// Reloads once per tab session on a chunk load error so a stale client
// self-heals. Guarded by sessionStorage so a persistent failure (e.g. an
// actual outage) can't loop the tab on repeated reloads.
export const recoverFromChunkError = (error: unknown): boolean => {
    if (typeof window === "undefined" || !isChunkLoadError(error)) return false;
    if (window.sessionStorage.getItem(RELOAD_FLAG_KEY)) return false;
    window.sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    window.location.reload();
    return true;
};

// Safety net for chunk load failures that surface as unhandled rejections
// or global errors rather than being caught by a React error boundary
// (e.g. a background preload, or a loader promise no one awaits).
export const initChunkErrorRecovery = () => {
    if (typeof window === "undefined") return () => {};

    const onError = (event: ErrorEvent) => recoverFromChunkError(event.error);
    const onRejection = (event: PromiseRejectionEvent) => recoverFromChunkError(event.reason);

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
        window.removeEventListener("error", onError);
        window.removeEventListener("unhandledrejection", onRejection);
    };
};
