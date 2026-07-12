// Idle and intent-based preloading to improve INP on first open
import { recoverFromChunkError } from "./chunkErrorRecovery";

type RequestIdleCallback = (cb: () => void) => number | undefined;

const idle: RequestIdleCallback = (cb) => {
    if (typeof window === "undefined") return undefined;
    const w = window as unknown as {
        requestIdleCallback?: (cb: () => void) => number;
    };
    if (typeof w.requestIdleCallback === "function")
        return w.requestIdleCallback(cb);
    return window.setTimeout(cb, 1);
};

// Callers fire these on hover/focus and never await the result, so an
// uncaught rejection (e.g. a stale chunk 404ing after a new deploy) would
// otherwise surface only as an unhandled promise rejection in the console.
// Catch it here, and hand chunk load failures to the reload recovery so the
// tab self-heals instead of leaving preloading permanently broken.
const withRecovery = <T>(loader: () => Promise<T>) => (): Promise<T | void> =>
    loader().catch((error) => {
        if (!recoverFromChunkError(error)) throw error;
    });

// Dynamic import preloaders for code splitting
export const preloadModules = {
    contact: withRecovery(() => import("@/components/features/contact/ContactForm/ContactForm")),
    about: withRecovery(() => import("@/components/features/about/AboutAppView/AboutAppView")),
    skillset: withRecovery(() => import("@/components/features/skills/SkillsetAppView/SkillsetAppView")),
    projects: withRecovery(() =>
        import("@/components/features/portfolio/ProjectsAppView/ProjectsAppView")
    ),
    documentary: withRecovery(() =>
        import("@/components/features/media").then((m) => m.DocumentaryPlayer)
    ),
    resume: withRecovery(() => import("@/components/features/resume/InteractiveResume/InteractiveResume")),
};

// On-intent network warmup for PBS iframe origin
export const ensurePBSPreconnect = () => {
    if (typeof document === "undefined") return;
    const href = "https://player.pbs.org";

    if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const l = document.createElement("link");
        l.rel = "preconnect";
        l.href = href;
        l.crossOrigin = "anonymous";
        document.head.appendChild(l);
    }

    if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
        const d = document.createElement("link");
        d.rel = "dns-prefetch";
        d.href = href;
        document.head.appendChild(d);
    }
};

// Preload the corresponding dynamic chunk when the user shows intent
export const preloadByPath = (path: string) => {
    if (path === "/contact") return preloadModules.contact();
    if (path === "/mindset") return preloadModules.about();
    if (path === "/skillset") return preloadModules.skillset();
    if (path === "/projects") return preloadModules.projects();
    if (path === "/documentary") {
        ensurePBSPreconnect();
        return preloadModules.documentary();
    }
    if (path === "/resume") return preloadModules.resume();
};

// Idle preloading utility for warming up critical modules
export const idlePreload = (modules: Array<keyof typeof preloadModules>) => {
    modules.forEach((module) => {
        idle(() => {
            preloadModules[module]();
        });
    });
};

export { idle };
