import { NextResponse } from 'next/server';
const nodeWhois = require('node-whois');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        const data = await new Promise<string>((resolve, reject) => {
            nodeWhois.lookup(domain, (err: any, data: string) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        return NextResponse.json({ domain, data });
    } catch (error: any) {
        console.error('WHOIS Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to lookup WHOIS' }, { status: 500 });
    }
}
