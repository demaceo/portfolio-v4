// Utility function to sanitize embed IDs for PBS player
export const sanitizeEmbedId = (embedId: string): string => {
    return embedId.replace(/[^a-zA-Z0-9]/g, "");
};

// External link handlers
export const openPBSLink = (url: string): void => {
    window.open(url, "_blank");
};

export const openDonateLink = (): void => {
    window.open("https://www.pbs.org/donate", "_blank");
};
