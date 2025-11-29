import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const resolveA = promisify(dns.resolve4);
const resolveNs = promisify(dns.resolveNs);
const resolveSoa = promisify(dns.resolveSoa);

interface HealthCheckResult {
    status: 'ok' | 'warning' | 'error';
    category: string;
    test: string;
    message: string;
}

async function checkDnsHealth(domain: string): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    // 1. DNS Record Checks
    try {
        const aRecords = await resolveA(domain);
        results.push({
            status: 'ok',
            category: 'DNS',
            test: 'A Record',
            message: `A Record found: ${aRecords.join(', ')}`
        });
    } catch (e) {
        results.push({
            status: 'error',
            category: 'DNS',
            test: 'A Record',
            message: 'No A Record found for domain'
        });
    }

    // 2. MX Record Checks
    try {
        const mxRecords = await resolveMx(domain);
        if (mxRecords.length > 0) {
            results.push({
                status: 'ok',
                category: 'MX',
                test: 'MX Record',
                message: `MX Records found: ${mxRecords.length} records`
            });

            // Check for multiple MX records (redundancy)
            if (mxRecords.length > 1) {
                results.push({
                    status: 'ok',
                    category: 'MX',
                    test: 'MX Redundancy',
                    message: 'Multiple MX records found (Primary + Backup)'
                });
            } else {
                results.push({
                    status: 'warning',
                    category: 'MX',
                    test: 'MX Redundancy',
                    message: 'Only one MX record found. Recommended to have at least two.'
                });
            }
        } else {
            results.push({
                status: 'error',
                category: 'MX',
                test: 'MX Record',
                message: 'No MX Records found'
            });
        }
    } catch (e) {
        results.push({
            status: 'error',
            category: 'MX',
            test: 'MX Record',
            message: 'Failed to fetch MX records'
        });
    }

    // 3. SPF Record Check
    try {
        const txtRecords = await resolveTxt(domain);
        const spfRecord = txtRecords.flat().find(r => r.startsWith('v=spf1'));

        if (spfRecord) {
            results.push({
                status: 'ok',
                category: 'SPF',
                test: 'SPF Record',
                message: `SPF Record found: ${spfRecord}`
            });

            if (spfRecord.includes('-all') || spfRecord.includes('~all')) {
                results.push({
                    status: 'ok',
                    category: 'SPF',
                    test: 'SPF Policy',
                    message: 'SPF Policy is set to enforce (-all or ~all)'
                });
            } else {
                results.push({
                    status: 'warning',
                    category: 'SPF',
                    test: 'SPF Policy',
                    message: 'SPF Policy allows all (+all) or is neutral (?all)'
                });
            }
        } else {
            results.push({
                status: 'error',
                category: 'SPF',
                test: 'SPF Record',
                message: 'No SPF Record found'
            });
        }
    } catch (e) {
        results.push({
            status: 'warning',
            category: 'SPF',
            test: 'SPF Record',
            message: 'Failed to fetch TXT records'
        });
    }

    // 4. DMARC Record Check
    try {
        const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
        const dmarcRecord = dmarcRecords.flat().find(r => r.startsWith('v=DMARC1'));

        if (dmarcRecord) {
            results.push({
                status: 'ok',
                category: 'DMARC',
                test: 'DMARC Record',
                message: `DMARC Record found: ${dmarcRecord}`
            });

            if (dmarcRecord.includes('p=reject') || dmarcRecord.includes('p=quarantine')) {
                results.push({
                    status: 'ok',
                    category: 'DMARC',
                    test: 'DMARC Policy',
                    message: 'DMARC Policy is set to reject or quarantine'
                });
            } else {
                results.push({
                    status: 'warning',
                    category: 'DMARC',
                    test: 'DMARC Policy',
                    message: 'DMARC Policy is set to none (monitoring only)'
                });
            }
        } else {
            results.push({
                status: 'error',
                category: 'DMARC',
                test: 'DMARC Record',
                message: 'No DMARC Record found'
            });
        }
    } catch (e) {
        results.push({
            status: 'error',
            category: 'DMARC',
            test: 'DMARC Record',
            message: 'No DMARC Record found'
        });
    }

    // 5. SOA Record Check
    try {
        const soa = await resolveSoa(domain);
        results.push({
            status: 'ok',
            category: 'DNS',
            test: 'SOA Record',
            message: `SOA Record found. Primary NS: ${soa.nsname}`
        });
    } catch (e) {
        results.push({
            status: 'warning',
            category: 'DNS',
            test: 'SOA Record',
            message: 'Failed to fetch SOA record'
        });
    }

    return results;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        const results = await checkDnsHealth(domain);

        // Calculate overall health score or summary
        const errorCount = results.filter(r => r.status === 'error').length;
        const warningCount = results.filter(r => r.status === 'warning').length;

        return NextResponse.json({
            domain,
            results,
            summary: {
                errors: errorCount,
                warnings: warningCount,
                status: errorCount > 0 ? 'Critical' : warningCount > 0 ? 'Warnings' : 'Healthy'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to perform health check' }, { status: 500 });
    }
}
