// Hooks barrel exports
export { useProjects } from './useProjects';
export { useScrollPosition } from './useScrollPosition';
export { useModalState } from './useModalState';
export { useDropdownState } from './useDropdownState';
export { useAppActions } from './useAppActions';
export { useDesktopInitialization } from './useDesktopInitialization';

export type {
    ModalState,
    ModalActions,
} from './useModalState';

export type {
    SelectedProject,
    SelectedService,
    DropdownState,
    DropdownActions,
} from './useDropdownState';
