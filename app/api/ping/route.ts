import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const host = searchParams.get('host');

    if (!host) {
        return NextResponse.json({ error: 'Host is required' }, { status: 400 });
    }

    // Basic validation to prevent command injection
    if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
        return NextResponse.json({ error: 'Invalid host format' }, { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            const isWin = process.platform === 'win32';
            const args = isWin ? ['-n', '4', host] : ['-c', '4', host];
            const command = 'ping';

            const child = spawn(command, args);

            child.stdout.on('data', (data) => {
                controller.enqueue(encoder.encode(data.toString()));
            });

            child.stderr.on('data', (data) => {
                controller.enqueue(encoder.encode(data.toString()));
            });

            child.on('close', () => {
                controller.close();
            });

            child.on('error', (err) => {
                controller.enqueue(encoder.encode(`Error: ${err.message}`));
                controller.close();
            });
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked',
        },
    });
}
