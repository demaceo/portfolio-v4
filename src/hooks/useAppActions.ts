'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ModalActions } from './useModalState';
import { preloadByPath, ensurePBSPreconnect } from '@/lib/utils/preload';

export interface UseAppActionsProps {
    modalActions: ModalActions;
}

export function useAppActions({ modalActions }: UseAppActionsProps) {
    const router = useRouter();

    const handleAppClick = useCallback((path: string, isToggle?: boolean): void => {
        if (path === "/contact" || isToggle) {
            modalActions.toggleContactForm();
        } else if (path === "/mindset") {
            modalActions.setShowAboutMe(true);
        } else if (path === "/skillset") {
            modalActions.setShowSkillset(true);
        } else if (path === "/projects") {
            modalActions.setShowProjects(true);
        } else if (path === "/documentary") {
            ensurePBSPreconnect();
            modalActions.setShowDocumentary(true);
        } else if (path === "/resume") {
            modalActions.setShowResume(true);
        } else if (path.startsWith("http")) {
            // External URL - open in new tab
            window.open(path, "_blank");
        } else {
            // Internal navigation
            router.push(path);
        }
    }, [router, modalActions]);

    const handleWelcomeWindowClose = useCallback((): void => {
        modalActions.setShowWelcomeWindow(false);
    }, [modalActions]);

    const maybePreloadByPath = useCallback((path: string) => {
        preloadByPath(path);
    }, []);

    return {
        handleAppClick,
        handleWelcomeWindowClose,
        maybePreloadByPath,
    };
}
