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

    const setShowScrapbook = useCallback((show: boolean) => {
        setModalState(prev => ({ ...prev, showScrapbook: show }));
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
