import { NextResponse } from 'next/server';
import { inspectWebsite } from '../../what-websites-see-about-you/actions';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        const result = await inspectWebsite(url);
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Inspection failed' }, { status: 500 });
    }
}
