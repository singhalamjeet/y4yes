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
            // Windows: tracert -h 15 -w 1000 host
            // Linux: traceroute -m 15 -w 1 host
            const command = isWin ? 'tracert' : 'traceroute';
            const args = isWin
                ? ['-h', '15', '-w', '1000', host]
                : ['-m', '15', '-w', '1', host];

            const child = spawn(command, args);
            let buffer = '';

            child.stdout.on('data', (data) => {
                buffer += data.toString();
                const lines = buffer.split('\n');

                // Keep last incomplete line in buffer
                buffer = lines.pop() || '';

                // Send complete lines immediately
                lines.forEach(line => {
                    if (line.trim()) {
                        controller.enqueue(encoder.encode(line + '\n'));
                    }
                });
            });

            child.stderr.on('data', (data) => {
                controller.enqueue(encoder.encode(data.toString()));
            });

            child.on('close', () => {
                // Send any remaining buffer
                if (buffer.trim()) {
                    controller.enqueue(encoder.encode(buffer));
                }
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
            'X-Content-Type-Options': 'nosniff'
        },
    });
}
