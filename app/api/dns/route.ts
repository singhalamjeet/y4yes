import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const resolveNs = promisify(dns.resolveNs);
const resolveCname = promisify(dns.resolveCname);
const resolveSoa = promisify(dns.resolveSoa);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        const records: any[] = [];

        // A Records
        try {
            const aRecords = await resolve4(domain, { ttl: true });
            aRecords.forEach((record: any) => {
                records.push({
                    type: 'A',
                    value: record.address,
                    ttl: record.ttl,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // AAAA Records
        try {
            const aaaaRecords = await resolve6(domain, { ttl: true });
            aaaaRecords.forEach((record: any) => {
                records.push({
                    type: 'AAAA',
                    value: record.address,
                    ttl: record.ttl,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // MX Records
        try {
            const mxRecords = await resolveMx(domain);
            mxRecords.forEach((record: any) => {
                records.push({
                    type: 'MX',
                    value: record.exchange,
                    priority: record.priority,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // TXT Records
        try {
            const txtRecords = await resolveTxt(domain);
            txtRecords.forEach((record: any) => {
                records.push({
                    type: 'TXT',
                    value: Array.isArray(record) ? record.join(' ') : record,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // NS Records
        try {
            const nsRecords = await resolveNs(domain);
            nsRecords.forEach((record: any) => {
                records.push({
                    type: 'NS',
                    value: record,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // CNAME Records
        try {
            const cnameRecords = await resolveCname(domain);
            cnameRecords.forEach((record: any) => {
                records.push({
                    type: 'CNAME',
                    value: record,
                });
            });
        } catch (e) { /* Ignore if not found */ }

        // SOA Record
        try {
            const soaRecord = await resolveSoa(domain);
            records.push({
                type: 'SOA',
                value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial}`,
            });
        } catch (e) { /* Ignore if not found */ }

        if (records.length === 0) {
            return NextResponse.json({ error: 'No DNS records found' }, { status: 404 });
        }

        return NextResponse.json({ domain, records });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to resolve DNS' }, { status: 500 });
    }
}
