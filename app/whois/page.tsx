import { Metadata } from 'next';
import WhoisClient from './client';

export const metadata: Metadata = {
    title: 'WHOIS Lookup Tool – Check Domain Registration | y4yes',
    description: 'Find domain registration information, owner details, expiry date, and registrar data with our free WHOIS lookup tool.',
    keywords: ['whois lookup', 'domain owner', 'domain expiry', 'registrar check', 'domain registration', 'whois database'],
};

export default function WhoisPage() {
    return <WhoisClient />;
}
