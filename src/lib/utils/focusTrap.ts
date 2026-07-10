// Focus-trap helpers shared by the overlay shells (ModalShell + AppView).
// Only the topmost overlay should call trapTabKey (see overlayStack), so a
// modal opened over an AppView traps within the modal while the AppView
// beneath stays untrapped.

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

/** Visible, focusable descendants of `container`, in DOM order. */
export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    // getClientRects() is empty for display:none (and works for position:fixed,
    // unlike offsetParent). Also skip anything explicitly inert.
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]")
  );
}

/**
 * Keep Tab / Shift+Tab focus within `container`, wrapping at the ends. Call
 * from a keydown handler when the Tab key is pressed and this overlay is
 * topmost. Note: focus that enters a nested <iframe> (e.g. the Documentary
 * player) is managed by the iframe's own document until it tabs back out —
 * a browser limitation the parent can't intercept.
 */
export function trapTabKey(event: KeyboardEvent, container: HTMLElement): void {
  const focusables = getFocusable(container);
  if (focusables.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || active === container || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || !container.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}
