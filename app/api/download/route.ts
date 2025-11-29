import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const size = parseInt(searchParams.get('size') || '1000000'); // Default 1MB

    // Generate random data of specified size
    const data = Buffer.alloc(size, 'x');

    return new NextResponse(data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': size.toString(),
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}

export async function POST(request: Request) {
    // Accept upload data and return success
    await request.arrayBuffer(); // Consume the body

    return NextResponse.json({ success: true }, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
