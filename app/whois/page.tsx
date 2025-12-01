import { Metadata } from 'next';
import WhoisClient from './client';

export const metadata: Metadata = {
    title: 'WHOIS Lookup - Check Domain Registration Info',
    description: 'Free WHOIS Lookup tool to find domain registration information, owner details, expiry date, and registrar data.',
    keywords: ['whois lookup', 'domain owner', 'domain expiry', 'registrar check', 'domain registration', 'whois database'],
};

export default function WhoisPage() {
    return <WhoisClient />;
}
