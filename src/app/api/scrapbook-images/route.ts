import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSION = /\.(jpe?g)$/i;

// The contents of public/scrapbook only change when the site is redeployed, so
// there's nothing dynamic to serve. Prerendering this at build time turns the
// scrapbook's first paint from "boot a serverless function, stat a directory,
// come back" into a static file read off the CDN — the gallery can't render a
// single tile until this resolves, so it sat directly on that view's critical
// path.
export const dynamic = "force-static";

export async function GET() {
    try {
        const scrapbookDir = path.join(process.cwd(), "public", "scrapbook");
        const entries = await readdir(scrapbookDir, { withFileTypes: true });

        const images = entries
            .filter((entry) => entry.isFile() && IMAGE_EXTENSION.test(entry.name))
            .map((entry) => `/scrapbook/${encodeURIComponent(entry.name)}`)
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        return NextResponse.json({ images });
    } catch {
        return NextResponse.json({ images: [] }, { status: 200 });
    }
}
