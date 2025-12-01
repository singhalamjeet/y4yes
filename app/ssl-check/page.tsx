import { Metadata } from 'next';
import SslClient from './client';

export const metadata: Metadata = {
    title: 'SSL Checker - Verify SSL/TLS Certificate',
    description: 'Free SSL Checker tool to verify your SSL certificate installation, validity, and expiration date. Check chain of trust and security.',
    keywords: ['ssl checker', 'ssl certificate check', 'tls check', 'https check', 'certificate expiry', 'ssl security'],
};

export default function SslPage() {
    return <SslClient />;
}
