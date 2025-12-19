import { Metadata } from 'next';
import SslClient from './client';

export const metadata: Metadata = {
    title: 'SSL Certificate Checker – Verify HTTPS Security | y4yes',
    description: 'Check SSL certificate validity, expiration, and issuer for any domain. Free TLS/SSL verification tool.',
    keywords: ['ssl checker', 'ssl certificate check', 'tls check', 'https check', 'certificate expiry', 'ssl security'],
};

export default function SslPage() {
    return <SslClient />;
}
