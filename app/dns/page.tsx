import { Metadata } from 'next';
import DnsClient from './client';

export const metadata: Metadata = {
    title: 'DNS Lookup Tool – Free & Fast DNS Records Check | y4yes',
    description: 'Query DNS records (A, MX, CNAME, TXT, NS, SOA) instantly. Check DNS propagation for any domain with our free DNS lookup tool.',
    keywords: ['dns lookup', 'dns check', 'mx lookup', 'txt record lookup', 'dns propagation', 'nameserver check'],
};

export default function DnsPage() {
    return <DnsClient />;
}
