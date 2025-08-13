'use client';

import { useState, useCallback } from 'react';

export interface ModalState {
    showContactForm: boolean;
    showWelcomeWindow: boolean;
    showAboutMe: boolean;
    showResume: boolean;
    showSkillset: boolean;
    showProjects: boolean;
    showDocumentary: boolean;
    showContactNotification: boolean;
}

export interface ModalActions {
    setShowContactForm: (show: boolean) => void;
    setShowWelcomeWindow: (show: boolean) => void;
    setShowAboutMe: (show: boolean) => void;
    setShowResume: (show: boolean) => void;
    setShowSkillset: (show: boolean) => void;
    setShowProjects: (show: boolean) => void;
    setShowDocumentary: (show: boolean) => void;
    setShowContactNotification: (show: boolean) => void;
    toggleContactForm: () => void;
    closeAllModals: () => void;
}

const initialModalState: ModalState = {
    showContactForm: false,
    showWelcomeWindow: true,
    showAboutMe: false,
    showResume: false,
    showSkillset: false,
    showProjects: false,
    showDocumentary: false,
    showContactNotification: true,
};

export function useModalState() {
    const [modalState, setModalState] = useState<ModalState>(initialModalState);

    const setShowContactForm = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showContactForm: show }));
    }, []);

    const setShowWelcomeWindow = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showWelcomeWindow: show }));
    }, []);

    const setShowAboutMe = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showAboutMe: show }));
    }, []);

    const setShowResume = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showResume: show }));
    }, []);

    const setShowSkillset = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showSkillset: show }));
    }, []);

    const setShowProjects = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showProjects: show }));
    }, []);

    const setShowDocumentary = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showDocumentary: show }));
    }, []);

    const setShowContactNotification = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showContactNotification: show }));
    }, []);

    const toggleContactForm = useCallback(() => {
        setModalState(prev => ({
            ...prev,
            showContactForm: !prev.showContactForm,
            showContactNotification: false,
        }));
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
        setShowContactNotification,
        toggleContactForm,
        closeAllModals,
    };

    return {
        modalState,
        actions,
    };
}
