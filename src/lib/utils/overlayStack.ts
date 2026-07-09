// Shared stacking + body-scroll-lock primitives for anything that takes over
// the screen — small floating modals (ModalShell) and full-screen non-modal
// takeovers (AppView) alike. A single shared stack means Escape/overlay-click
// always resolves to whichever of these is genuinely topmost, regardless of
// which of the two presentation styles it is (e.g. a DocumentaryPlayer modal
// opened from within a full-screen AppView must close before the AppView does).

let stack: symbol[] = [];

export function pushOverlay(id: symbol) {
  stack.push(id);
}

export function popOverlay(id: symbol) {
  stack = stack.filter((s) => s !== id);
}

export function isTopmostOverlay(id: symbol) {
  return stack[stack.length - 1] === id;
}

let bodyScrollLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (bodyScrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  bodyScrollLockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  if (bodyScrollLockCount === 0) return;

  bodyScrollLockCount -= 1;

  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  }
}
