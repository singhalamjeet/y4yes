import { NextResponse } from 'next/server';
import net from 'net';

const COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080];

function checkPort(host: string, port: number): Promise<{ port: number; status: 'open' | 'closed' }> {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let status: 'open' | 'closed' = 'closed';

        socket.setTimeout(2000); // 2s timeout

        socket.on('connect', () => {
            status = 'open';
            socket.destroy();
        });

        socket.on('timeout', () => {
            socket.destroy();
        });

        socket.on('error', () => {
            socket.destroy();
        });

        socket.on('close', () => {
            resolve({ port, status });
        });

        socket.connect(port, host);
    });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const host = searchParams.get('host');
    const portsParam = searchParams.get('ports');

    if (!host) {
        return NextResponse.json({ error: 'Host is required' }, { status: 400 });
    }

    const ports = portsParam
        ? portsParam.split(',').map(Number).filter(p => !isNaN(p))
        : COMMON_PORTS;

    try {
        const results = await Promise.all(ports.map(port => checkPort(host, port)));
        return NextResponse.json({ host, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to scan ports' }, { status: 500 });
    }
}
