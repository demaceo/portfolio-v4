/**
 * Build a Next.js Image Optimization URL for a raw image path.
 *
 * `<Image>` does this for you, but DomeGallery's enlarge animation builds its
 * full-size `<img>` imperatively (it can't reuse the tile's element — the tile
 * has to stay in the sphere while the copy flies out), and was pointing that
 * `<img>` straight at the raw file in `public/`. For the scrapbook that meant
 * a 400x400 lightbox downloading a 6.5 MB camera original.
 *
 * `/_next/image` is the same public endpoint `<Image>` itself targets, so this
 * gets identical AVIF/WebP negotiation, resizing, and CDN caching.
 *
 * @param src   Path or absolute URL. Absolute URLs must match a
 *              `images.remotePatterns` entry in next.config.ts.
 * @param width Target width in px. Must be one of the widths in
 *              `images.deviceSizes` / `images.imageSizes` (defaults include
 *              16-384 and 640-3840) — the optimizer rejects anything else.
 */
export function optimizedImageSrc(
    src: string,
    width: number,
    quality = 75,
): string {
    // Already-optimized URLs, data/blob URIs and SVGs have nothing to gain
    // (and the optimizer refuses several of them outright).
    if (
        !src ||
        src.startsWith("data:") ||
        src.startsWith("blob:") ||
        // Matches both the relative form and the absolute one an
        // <img>.src property read gives back.
        src.includes("/_next/image?") ||
        /\.svg($|\?)/i.test(src)
    ) {
        return src;
    }

    // Animated GIFs come back from the optimizer as a single still frame, so
    // they're passed through the same way <Image unoptimized> handles them.
    if (/\.gif($|\?)/i.test(src)) return src;

    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/** Width requested for DomeGallery's opened (lightbox) image. Comfortably
 *  covers the ~750px peak of the open animation before it settles to 400px,
 *  and is a member of the default `deviceSizes` list. */
export const DOME_ENLARGED_WIDTH = 1200;
