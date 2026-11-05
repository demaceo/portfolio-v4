import { StaticImageData } from 'next/image';
import type { ReactNode, RefObject } from "react";

export interface AboutMePill {
    label: string;
    tooltip: string;
    icon?: string;
    link?: string;
    /** Anchor text for `link` in the About strengths index. Falls back to "Open link". */
    linkLabel?: string;
}

export interface Project {
    id: number;
    slug?: string;
    yearRange?: string;
    image?: string | StaticImageData;
    name: string;
    description: string;
    link: string;
    highlights?: string[];
    stackPreview?: string[];
    deepDiveKey?: string;
    icon?: string;
    /** Native pixel dimensions of `icon` when it's an image path — lets callers
     *  reserve a correctly-shaped box instead of assuming square artwork. */
    iconWidth?: number;
    iconHeight?: number;
    /** Multiplier on a caller's base icon size, to compensate for how much
     *  each icon's own canvas is padded around its visible artwork. Only
     *  applied by callers that opt in (see ProjectMedia's applyIconScale). */
    iconScale?: number;
    type?: string;
    duration?: string;
    network?: string;
    archived?: boolean;
    gif?: string; // Optional field for GIFs
    /** Drives the detail modal's primary action button — label, icon, and
     *  style all key off this instead of the generic "Open Project" default.
     *  "appstore" links to an App Store listing, "website" to a live site,
     *  "watch" to a video. Omitted falls back to "Open Project". */
    linkType?: "appstore" | "website" | "watch";
}

export interface ServicePanel {
    label: string;              // eyebrow heading, e.g. "What you get"
    body?: string;              // paragraph copy
    points?: string[];          // bullet list / chip list
    kind?: "list" | "tags";     // "tags" renders points as inline chips (used by Tech & tools)
}

export interface Service {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    icon: string;
    outcome?: string;           // accent one-liner shown on the Overview panel
    panels?: ServicePanel[];    // extra vertical panels; the "Overview" panel is synthesized from outcome + description
}

export interface TimelineItem {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    skills: string[];
}

export interface Principle {
    id: string;
    title: string;
    description: string;
    icon?: string;
}


export interface ModalProps {
    onClose: () => void;
}

export type ModalSize = "sm" | "md" | "lg" | "xl";

/** "window" floats centered; "sheet" docks to the bottom edge. Every modal
 *  renders as a sheet on phones regardless of this prop. */
export type ModalPresentation = "window" | "sheet";

/** Enter/exit motion: "pop" = spring scale-in, "sheet" = slide up from the
 *  bottom edge. Reduced-motion users get a cross-fade for both. */
export type ModalMotionPreset = "pop" | "sheet";

export interface ModalShellProps {
    onClose: () => void;
    children: ReactNode;
    titleId?: string;
    /** Accessible name when there is no visible title element to point at. */
    ariaLabel?: string;
    overlayClassName?: string;
    dialogClassName?: string;
    motionPreset?: ModalMotionPreset;
    /** Element to focus on open instead of the dialog container (e.g. a
     *  search input). */
    initialFocusRef?: RefObject<HTMLElement | null>;
}

export interface ModalFrameProps {
    onClose: () => void;
    title: string;
    size: ModalSize;
    children: ReactNode;
    headerActions?: ReactNode;
    closeAriaLabel?: string;
    titleId?: string;
    /** Defaults to "window". Every modal is a bottom sheet on phones. */
    presentation?: ModalPresentation;
    /** Small line left of the close button (e.g. "Projects › Pinpoint").
     *  Defaults to `title`. */
    eyebrow?: ReactNode;
}

export interface AppViewProps {
    onClose: () => void;
    title: string;
    children: ReactNode;
    headerActions?: ReactNode;
    titleId?: string;
}

export interface ModalState {
    isOpen: boolean;
    message: string;
    type: "file" | "edit" | "view" | "special";
    showRandomButton: boolean;
}

export interface ModalsState {
    showContactForm: boolean;
    showWelcomeWindow: boolean;
    showAboutMe: boolean;
    showResume: boolean;
    showSkillset: boolean;
    showProjects: boolean;
    showDocumentary: boolean;
    showScrapbook: boolean;
    showContactNotification: boolean;
    selectedServiceId: string | null;
    selectedProjectId: number | null;
}

export interface ModalActions {
    setShowContactForm: (show: boolean) => void;
    setShowWelcomeWindow: (show: boolean) => void;
    setShowAboutMe: (show: boolean) => void;
    setShowResume: (show: boolean) => void;
    setShowSkillset: (show: boolean) => void;
    setShowProjects: (show: boolean) => void;
    setShowDocumentary: (show: boolean) => void;
    setShowScrapbook: (show: boolean) => void;
    setShowContactNotification: (show: boolean) => void;
    setSelectedServiceId: (id: string | null) => void;
    setSelectedProjectId: (id: number | null) => void;
    toggleContactForm: () => void;
    toggleWelcomeWindow: () => void;
    closeAllModals: () => void;
}

export interface UseAppActionsProps {
    modalActions: ModalActions;
}

export interface Episode {
    id: string;
    title: string;
    duration: string;
    embedId: string;
    externalUrl: string;
}

export interface EpisodeContent {
    description: string;
    extendedDescription: string;
    production: string;
    series: string;
    topics: string;
}

export interface EpisodeInfoProps {
    selectedEpisode: Episode;
    episodeTitle: string;
    episodeContent: EpisodeContent;
    isContentExpanded: boolean;
    onToggleContentExpansion: () => void;
    onExternalLink: (url: string) => void;
    onDonate: () => void;
}

export interface EpisodeSelectorProps {
    selectedEpisode: Episode;
    onEpisodeSelect: (episode: Episode) => void;
}

export interface DocumentaryHeaderProps {
    onClose: () => void;
    onToggleInfo: (e: React.MouseEvent) => void;
    onToggleEpisodeList: (e: React.MouseEvent) => void;
    showInfoDropdown: boolean;
    showEpisodeList: boolean;
}

export interface DocumentaryPlayerState {
    isVideoLoaded: boolean;
    selectedEpisode: Episode;
    showEpisodeList: boolean;
    showInfoDropdown: boolean;
    isContentExpanded: boolean;
}

export interface DocumentaryPlayerActions {
    setIsVideoLoaded: (loaded: boolean) => void;
    setSelectedEpisode: (episode: Episode) => void;
    setShowEpisodeList: (show: boolean) => void;
    setShowInfoDropdown: (show: boolean) => void;
    setIsContentExpanded: (expanded: boolean) => void;
    toggleEpisodeList: () => void;
    toggleInfoDropdown: () => void;
    toggleContentExpansion: () => void;
    resetVideoLoad: () => void;
}

export interface UseDocumentaryActionsProps {
    actions: DocumentaryPlayerActions;
    onClose: () => void;
}

export interface VideoPlayerProps {
    selectedEpisode: Episode;
    onVideoLoad: () => void;
}
