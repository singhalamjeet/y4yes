import { NextResponse } from 'next/server';
import * as tls from 'tls';

interface CertificateInfo {
    valid: boolean;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    issuer: {
        C?: string;
        ST?: string;
        L?: string;
        O?: string;
        CN?: string;
    };
    subject: {
        C?: string;
        ST?: string;
        L?: string;
        O?: string;
        CN?: string;
    };
    subjectaltname?: string;
    bits?: number;
    serialNumber?: string;
}

function getCertificateInfo(domain: string): Promise<CertificateInfo> {
    return new Promise((resolve, reject) => {
        const options = {
            host: domain,
            port: 443,
            servername: domain,
            rejectUnauthorized: false, // We want to check even invalid certs
        };

        const socket = tls.connect(options, () => {
            const cert = socket.getPeerCertificate(true);

            if (!cert || Object.keys(cert).length === 0) {
                socket.destroy();
                reject(new Error('No certificate found'));
                return;
            }

            const validFrom = new Date(cert.valid_from);
            const validTo = new Date(cert.valid_to);
            const now = new Date();

            const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const valid = now >= validFrom && now <= validTo;

            const result: CertificateInfo = {
                valid,
                validFrom: validFrom.toISOString(),
                validTo: validTo.toISOString(),
                daysRemaining,
                issuer: cert.issuer || {},
                subject: cert.subject || {},
                subjectaltname: cert.subjectaltname,
                bits: cert.bits,
                serialNumber: cert.serialNumber,
            };

            socket.destroy();
            resolve(result);
        });

        socket.on('error', (error) => {
            reject(error);
        });

        socket.setTimeout(10000);
        socket.on('timeout', () => {
            socket.destroy();
            reject(new Error('Connection timeout'));
        });
    });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        const data = await getCertificateInfo(domain);
        return NextResponse.json({ domain, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to check SSL' }, { status: 500 });
    }
}
