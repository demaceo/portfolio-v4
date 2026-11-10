'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { ModalsState, ModalActions } from "@/lib/types";
import { APP_PATHS, appKeyForPath, type AppKey } from "@/lib/constants/appRoutes";

// The four full-screen AppViews aren't stored here: whether one is open is read off the URL
// (see `openApp` below), so they can't drift apart from the address bar or the Back button.
type AppShowKey = 'showAboutMe' | 'showSkillset' | 'showProjects' | 'showScrapbook';
type LocalModalState = Omit<ModalsState, AppShowKey>;

const initialModalState: LocalModalState = {
    showContactForm: false,
    showWelcomeWindow: true,
    showResume: false,
    showDocumentary: false,
    showContactNotification: true,
    selectedServiceId: null,
    selectedProjectId: null,
};

// Selection that opening each AppView resets. Opening one app from another used to leave the
// previous app's selection behind (a service id surviving into Projects, etc.); these match
// what each view's own onClose clears, so the state is clean whichever nav path was taken.
const CLEARED_ON_OPEN: Record<AppKey, Partial<Pick<LocalModalState, 'selectedServiceId' | 'selectedProjectId'>>> = {
    mindset: { selectedServiceId: null, selectedProjectId: null },
    skillset: { selectedProjectId: null },
    projects: { selectedServiceId: null },
    scrapbook: { selectedServiceId: null, selectedProjectId: null },
};

// False while rendering on the server and during hydration, true afterwards, with no mismatch
// warning. The AppViews have only ever been client-rendered (they measure the window, run
// d3, etc.), so even when the URL says /projects the overlay must wait until after hydration
// rather than being server-rendered.
const subscribeNever = () => () => {};
const useHydrated = () =>
    useSyncExternalStore(subscribeNever, () => true, () => false);

// A plain history entry, not router.push: Next patches pushState so the router (and
// usePathname) follow it, but without fetching anything from the server, so the overlay
// opens instantly instead of after a network round trip. Reads location rather than a
// closed-over pathname so a stale callback can't push the wrong thing.
function navigateTo(path: string) {
    if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
    }
}

export function useModalState() {
    const [localState, setModalState] = useState<LocalModalState>(initialModalState);
    const pathname = usePathname();
    const hydrated = useHydrated();
    const openApp = hydrated ? appKeyForPath(pathname) : null;

    const modalState = useMemo<ModalsState>(() => ({
        ...localState,
        showAboutMe: openApp === 'mindset',
        showSkillset: openApp === 'skillset',
        showProjects: openApp === 'projects',
        showScrapbook: openApp === 'scrapbook',
    }), [localState, openApp]);

    const setShowContactForm = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showContactForm: show }));
    }, []);

    const setShowWelcomeWindow = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showWelcomeWindow: show }));
    }, []);

    // The four full-screen AppViews (About/Skillset/Projects/Scrapbook) are mutually exclusive —
    // only one takeover is ever "open" at a time. They used to be four independent booleans, so
    // opening one while another was open left both true, and since every AppView shares a
    // z-index the newer one didn't reliably land on top. Now the URL decides: there is one
    // pathname, so at most one is open, and opening one replaces the other.
    const setAppOpen = useCallback((app: AppKey, show: boolean) => {
        if (show) {
            setModalState(prev => ({ ...prev, ...CLEARED_ON_OPEN[app] }));
            navigateTo(APP_PATHS[app]);
        } else if (appKeyForPath(window.location.pathname) === app) {
            // Only leave if this app is the one showing: a late close from an app that has
            // already been replaced must not send the user home from the new one.
            navigateTo('/');
        }
    }, []);

    const setShowAboutMe = useCallback((show: boolean) => setAppOpen('mindset', show), [setAppOpen]);
    const setShowSkillset = useCallback((show: boolean) => setAppOpen('skillset', show), [setAppOpen]);
    const setShowProjects = useCallback((show: boolean) => setAppOpen('projects', show), [setAppOpen]);
    const setShowScrapbook = useCallback((show: boolean) => setAppOpen('scrapbook', show), [setAppOpen]);

    const setShowResume = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showResume: show }));
    }, []);

    const setShowDocumentary = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showDocumentary: show }));
    }, []);

    const setShowContactNotification = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showContactNotification: show }));
    }, []);

    const setSelectedServiceId = useCallback((id: string | null) => {
        setModalState(prev => ({ ...prev, selectedServiceId: id }));
    }, []);

    const setSelectedProjectId = useCallback((id: number | null) => {
        setModalState(prev => ({ ...prev, selectedProjectId: id }));
    }, []);

    const toggleContactForm = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            showContactForm: !prev.showContactForm,
            showContactNotification: false,
        }));
    }, []);

    const toggleWelcomeWindow = useCallback(() => {
        setModalState(prev => ({ ...prev, showWelcomeWindow: !prev.showWelcomeWindow }));
    }, []);

    const closeAllModals = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            showContactForm: false,
            showResume: false,
            showDocumentary: false,
            selectedServiceId: null,
            selectedProjectId: null,
        }));
        if (appKeyForPath(window.location.pathname)) navigateTo('/');
    }, []);

    const actions: ModalActions = {
        setShowContactForm,
        setShowWelcomeWindow,
        setShowAboutMe,
        setShowResume,
        setShowSkillset,
        setShowProjects,
        setShowDocumentary,
        setShowScrapbook,
        setShowContactNotification,
        setSelectedServiceId,
        setSelectedProjectId,
        toggleContactForm,
        toggleWelcomeWindow,
        closeAllModals,
    };

    return {
        modalState,
        actions,
    };
}
