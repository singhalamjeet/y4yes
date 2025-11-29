import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

// We need to use the raw resolve4 to get TTL, but promisify it carefully or just wrap it
const resolve4 = promisify(dns.resolve4);

interface BlacklistDef {
    name: string;
    host: string;
    type: 'ip' | 'domain';
}

// Comprehensive list of RBLs
const blacklists: BlacklistDef[] = [
    // IP Based Blacklists
    { name: 'Spamhaus ZEN', host: 'zen.spamhaus.org', type: 'ip' },
    { name: 'SORBS', host: 'dnsbl.sorbs.net', type: 'ip' },
    { name: 'SPAMCOP', host: 'bl.spamcop.net', type: 'ip' },
    { name: 'BARRACUDA', host: 'b.barracudacentral.org', type: 'ip' },
    { name: 'PSBL', host: 'psbl.surriel.com', type: 'ip' },
    { name: 'UCEPROTECTL1', host: 'dnsbl-1.uceprotect.net', type: 'ip' },
    { name: 'UCEPROTECTL2', host: 'dnsbl-2.uceprotect.net', type: 'ip' },
    { name: 'UCEPROTECTL3', host: 'dnsbl-3.uceprotect.net', type: 'ip' },
    { name: 'BLOCKLIST.DE', host: 'bl.blocklist.de', type: 'ip' },
    { name: 'BACKSCATTERER', host: 'ips.backscatterer.org', type: 'ip' },
    { name: '0SPAM', host: 'bl.0spam.org', type: 'ip' },
    { name: 'SEM BLACK', host: 'bl.spameatingmonkey.net', type: 'ip' },
    { name: 'SEM BACKSCATTER', host: 'backscatter.spameatingmonkey.net', type: 'ip' },
    { name: 'Nordspam BL', host: 'bl.nordspam.com', type: 'ip' },
    { name: 'RATS Dyna', host: 'dyna.spamrats.com', type: 'ip' },
    { name: 'RATS NoPtr', host: 'noptr.spamrats.com', type: 'ip' },
    { name: 'RATS Spam', host: 'spam.spamrats.com', type: 'ip' },
    { name: 'WPBL', host: 'db.wpbl.info', type: 'ip' },
    { name: 'DRONE BL', host: 'dnsbl.dronebl.org', type: 'ip' },
    { name: 'LASHBACK', host: 'ubl.lashback.com', type: 'ip' },
    { name: 'MAILSPIKE BL', host: 'bl.mailspike.net', type: 'ip' },
    { name: 'MAILSPIKE Z', host: 'z.mailspike.net', type: 'ip' },
    { name: 'NIXSPAM', host: 'ix.dnsbl.manitu.net', type: 'ip' },
    { name: 'KEMPTBL', host: 'bsb.empty.us', type: 'ip' },
    { name: 'GBUdb', host: 'truncate.gbudb.net', type: 'ip' },

    // Domain Based Blacklists
    { name: 'Spamhaus DBL', host: 'dbl.spamhaus.org', type: 'domain' },
    { name: 'SURBL multi', host: 'multi.surbl.org', type: 'domain' },
    { name: 'SEM URI', host: 'uribl.spameatingmonkey.net', type: 'domain' },
    { name: 'SEM FRESH', host: 'fresh.spameatingmonkey.net', type: 'domain' },
    { name: 'Nordspam DBL', host: 'dbl.nordspam.com', type: 'domain' },
];

async function getIpFromDomain(domain: string): Promise<string> {
    try {
        const addresses = await resolve4(domain);
        return addresses[0];
    } catch (e) {
        throw new Error('Failed to resolve domain to IP');
    }
}

function reverseIp(ip: string): string {
    return ip.split('.').reverse().join('.');
}

async function checkBlacklist(target: string, blacklist: BlacklistDef) {
    let query = '';

    if (blacklist.type === 'ip') {
        const reversedIp = reverseIp(target);
        query = `${reversedIp}.${blacklist.host}`;
    } else {
        // For domain blacklists, we query domain.host
        query = `${target}.${blacklist.host}`;
    }

    const startTime = Date.now();

    try {
        // Use raw dns.resolve4 to get TTL if possible, but Node's dns module 
        // promisified resolve4 with {ttl:true} returns object array.
        // Let's use a wrapper.
        const records = await new Promise<any[]>((resolve, reject) => {
            dns.resolve4(query, { ttl: true }, (err, addresses) => {
                if (err) reject(err);
                else resolve(addresses);
            });
        });

        const responseTime = Date.now() - startTime;
        const ttl = records[0]?.ttl || 0;

        return {
            blacklist: blacklist.name,
            status: 'LISTED',
            reason: 'Listed', // RBLs usually return 127.0.0.x codes which map to reasons, but generic "Listed" is safe
            responseTime,
            ttl
        };
    } catch (e: any) {
        const responseTime = Date.now() - startTime;

        // Check if it's a timeout
        if (e.code === 'ETIMEOUT' || responseTime > 5000) {
            return {
                blacklist: blacklist.name,
                status: 'TIMEOUT',
                reason: '',
                responseTime,
                ttl: 0
            };
        }

        // NXDOMAIN means not listed (good)
        if (e.code === 'ENOTFOUND' || e.code === 'ENODATA') {
            return {
                blacklist: blacklist.name,
                status: 'OK',
                reason: 'OK',
                responseTime,
                ttl: 0
            };
        }

        // Other errors
        return {
            blacklist: blacklist.name,
            status: 'ERROR',
            reason: e.message,
            responseTime,
            ttl: 0
        };
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        // Get IP address for IP-based checks
        const ip = await getIpFromDomain(domain);

        // Check all blacklists in parallel
        const results = await Promise.all(
            blacklists.map(bl => {
                const target = bl.type === 'ip' ? ip : domain;
                return checkBlacklist(target, bl);
            })
        );

        const listedCount = results.filter(r => r.status === 'LISTED').length;
        const timeoutCount = results.filter(r => r.status === 'TIMEOUT').length;
        const totalChecked = blacklists.length;

        return NextResponse.json({
            domain,
            ip,
            totalChecked,
            listedCount,
            timeoutCount,
            results,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to check blacklists' }, { status: 500 });
    }
}
