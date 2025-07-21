import { StaticImageData } from 'next/image';

export interface Project {
    id: number;
    image?: string | StaticImageData;
    name: string;
    description: string;
    link: string;
    icon?: string;
    archived?: boolean;
}

export interface Service {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    details?: string[];
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

export interface MenuQuirks {
    fileClicks: number;
    editShake: boolean;
    viewInverted: boolean;
    specialRainbow: boolean;
}

export interface ModalState {
    isOpen: boolean;
    message: string;
    type: "file" | "edit" | "view" | "special";
    showRandomButton: boolean;
}
