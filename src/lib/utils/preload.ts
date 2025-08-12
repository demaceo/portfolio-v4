// Idle and intent-based preloading to improve INP on first open
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

// Dynamic import preloaders for code splitting
export const preloadModules = {
    contact: () => import("@/features/contact/ContactForm/ContactForm"),
    about: () => import("@/features/about/AboutMeModal/AboutMeModal"),
    skillset: () => import("@/features/skills/SkillsetModal/SkillsetModal"),
    projects: () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
    documentary: () =>
        import("@/components/features/media").then((m) => m.DocumentaryPlayer),
    resume: () => import("@/features/resume/InteractiveResume/InteractiveResume"),
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
