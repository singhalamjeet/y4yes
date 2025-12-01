import { Metadata } from 'next';
import DnsClient from './client';

export const metadata: Metadata = {
    title: 'DNS Lookup Tool - Check DNS Records (A, MX, TXT, NS)',
    description: 'Free DNS Lookup tool to check DNS records for any domain. View A, AAAA, MX, TXT, NS, CNAME, SOA, and PTR records instantly.',
    keywords: ['dns lookup', 'dns check', 'mx lookup', 'txt record lookup', 'dns propagation', 'nameserver check'],
};

export default function DnsPage() {
    return <DnsClient />;
}
