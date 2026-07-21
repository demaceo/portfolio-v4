import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSION = /\.(jpe?g)$/i;

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
