'use server';

import dns from 'dns/promises';

export interface InspectionResult {
    url: string;
    dns?: {
        a: string[];
        aaaa: string[];
        error?: string;
    };
    http?: {
        status: number;
        protocol: string;
        headers: Record<string, string>;
        error?: string;
    };
    security: {
        https: boolean;
        hsts: boolean;
        csp: boolean;
        xFrameOptions: boolean;
    };
}

export async function inspectWebsite(inputUrl: string): Promise<InspectionResult> {
    let url = inputUrl;
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    const result: InspectionResult = {
        url,
        security: {
            https: url.startsWith('https'),
            hsts: false,
            csp: false,
            xFrameOptions: false,
        }
    };

    try {
        // Parse hostname
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // 1. DNS Lookup
        try {
            const [a, aaaa] = await Promise.all([
                dns.resolve4(hostname).catch(() => []),
                dns.resolve6(hostname).catch(() => [])
            ]);
            result.dns = { a, aaaa };
        } catch (e) {
            result.dns = { a: [], aaaa: [], error: 'DNS Lookup Failed' };
        }

        // 2. HTTP/Headers Inspection
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                redirect: 'follow', // Follow redirects to check final destination headers
                headers: {
                    'User-Agent': 'y4yes-inspector/1.0 (Educational Privacy Tool)'
                }
            });

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            result.http = {
                status: response.status,
                protocol: 'HTTP', // Fetch doesn't easily expose protocol version without lower-level agents, defaulting strictly
                headers
            };

            // 3. Security Analysis
            if (headers['strict-transport-security']) result.security.hsts = true;
            if (headers['content-security-policy']) result.security.csp = true;
            if (headers['x-frame-options']) result.security.xFrameOptions = true;

        } catch (e: any) {
            result.http = {
                status: 0,
                protocol: 'Unknown',
                headers: {},
                error: e.message || 'Connection Failed'
            };
        }

    } catch (e) {
        // Invalid URL
        return {
            ...result,
            dns: { a: [], aaaa: [], error: 'Invalid URL' },
            http: { status: 0, protocol: '-', headers: {}, error: 'Invalid URL' }
        };
    }

    return result;
}
