'use client';

import { useState, useCallback } from 'react';
import { ModalsState, ModalActions } from "@/lib/types";


const initialModalState: ModalsState = {
    showContactForm: false,
    showWelcomeWindow: true,
    showAboutMe: false,
    showResume: false,
    showSkillset: false,
    showProjects: false,
    showDocumentary: false,
    showScrapbook: false,
    showContactNotification: true,
    selectedServiceId: null,
    selectedProjectId: null,
};

export function useModalState() {
    const [modalState, setModalState] = useState<ModalsState>(initialModalState);

    const setShowContactForm = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showContactForm: show }));
    }, []);

    const setShowWelcomeWindow = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showWelcomeWindow: show }));
    }, []);

    // The four full-screen AppViews (About/Skillset/Projects/Scrapbook) are
    // meant to be mutually exclusive — only one takeover is ever "open" at a
    // time — but each used to be an independent boolean, so opening one while
    // another was already open left both true. Since every AppView shares the
    // same z-index and renders in a fixed DOM order (see AppViews.tsx), the
    // newly opened one didn't reliably land on top; it could paint underneath
    // whichever view happens to sit later in that fixed order. Closing the
    // others here (and clearing their own selection ids, matching what each
    // view's own onClose already does) keeps exactly one AppView open and its
    // state clean, regardless of which nav path the user takes to open it.
    const setShowAboutMe = useCallback((show: boolean) => {
        setModalState(prev => (show
            ? { ...prev, showAboutMe: true, showSkillset: false, showProjects: false, showScrapbook: false, selectedServiceId: null, selectedProjectId: null }
            : { ...prev, showAboutMe: false }));
    }, []);

    const setShowResume = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showResume: show }));
    }, []);

    const setShowSkillset = useCallback((show: boolean) => {
        setModalState(prev => (show
            ? { ...prev, showSkillset: true, showAboutMe: false, showProjects: false, showScrapbook: false, selectedProjectId: null }
            : { ...prev, showSkillset: false }));
    }, []);

    const setShowProjects = useCallback((show: boolean) => {
        setModalState(prev => (show
            ? { ...prev, showProjects: true, showAboutMe: false, showSkillset: false, showScrapbook: false, selectedServiceId: null }
            : { ...prev, showProjects: false }));
    }, []);

    const setShowDocumentary = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showDocumentary: show }));
    }, []);

    const setShowScrapbook = useCallback((show: boolean) => {
        setModalState(prev => (show
            ? { ...prev, showScrapbook: true, showAboutMe: false, showSkillset: false, showProjects: false, selectedServiceId: null, selectedProjectId: null }
            : { ...prev, showScrapbook: false }));
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
            showAboutMe: false,
            showResume: false,
            showSkillset: false,
            showProjects: false,
            showDocumentary: false,
            showScrapbook: false,
            selectedServiceId: null,
            selectedProjectId: null,
        }));
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
