import { NextResponse } from 'next/server';
import { woozyx3Codes } from '@/data/woozyx3Codes';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const code = body?.code;
        if (!code || typeof code !== 'string') {
            return NextResponse.json({ ok: false, error: 'Missing code' }, { status: 400 });
        }

        const normalized = code.trim().toLowerCase();
        const foundKey = Object.keys(woozyx3Codes).find(k => k.toLowerCase() === normalized);
        if (!foundKey) {
            return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 404 });
        }

        const message = woozyx3Codes[foundKey];
        return NextResponse.json({ ok: true, message });
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }
}
