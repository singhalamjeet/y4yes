'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DNSCheckResult {
    type: 'SUCCESS' | 'NXDOMAIN' | 'SERVFAIL' | 'TIMEOUT' | 'LOADING' | null;
    domain: string;
    message: string;
    records?: {
        A?: string[];
        AAAA?: string[];
        CNAME?: string;
    };
    fixes?: string[];
}

export default function DNSErrorClient() {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState<DNSCheckResult>({ type: null, domain: '', message: '' });

    async function checkDNS(e: React.FormEvent) {
        e.preventDefault();
        if (!domain.trim()) return;

        setResult({ type: 'LOADING', domain, message: 'Checking DNS...' });

        try {
            // Use Cloudflare DNS-over-HTTPS
            const response = await fetch(
                `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
                { headers: { 'accept': 'application/dns-json' } }
            );

            const data = await response.json();

            if (data.Status === 3) {
                // NXDOMAIN
                setResult({
                    type: 'NXDOMAIN',
                    domain,
                    message: `Domain "${domain}" does not exist (NXDOMAIN)`,
                    fixes: [
                        'Check the domain spelling carefully',
                        'Verify the domain is registered and active',
                        'Try accessing the domain without "www" or with "www"',
                        'Clear your DNS cache',
                        'Try a different DNS server (1.1.1.1 or 8.8.8.8)'
                    ]
                });
            } else if (data.Status === 2) {
                // SERVFAIL
                setResult({
                    type: 'SERVFAIL',
                    domain,
                    message: 'DNS server failure (SERVFAIL)',
                    fixes: [
                        'DNS server is experiencing issues',
                        'Change to public DNS (1.1.1.1 or 8.8.8.8)',
                        'Restart your router',
                        'Try again in a few minutes'
                    ]
                });
            } else if (data.Answer && data.Answer.length > 0) {
                // Success
                const aRecords = data.Answer
                    .filter((a: any) => a.type === 1)
                    .map((a: any) => a.data);

                setResult({
                    type: 'SUCCESS',
                    domain,
                    message: `Domain "${domain}" resolves successfully!`,
                    records: {
                        A: aRecords
                    }
                });
            } else {
                setResult({
                    type: 'SERVFAIL',
                    domain,
                    message: 'Unexpected DNS response',
                    fixes: ['Try checking again', 'Contact your ISP if issue persists']
                });
            }
        } catch (error) {
            setResult({
                type: 'TIMEOUT',
                domain,
                message: 'Network error - could not reach DNS server',
                fixes: [
                    'Check your internet connection',
                    'Firewall may be blocking DNS queries',
                    'Try using mobile data to test',
                    'Restart your network connection'
                ]
            });
        }
    }

    const resultColors = {
        SUCCESS: 'bg-green-900/20 border-green-500/30 text-green-300',
        NXDOMAIN: 'bg-red-900/20 border-red-500/30 text-red-300',
        SERVFAIL: 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300',
        TIMEOUT: 'bg-orange-900/20 border-orange-500/30 text-orange-300',
        LOADING: 'bg-blue-900/20 border-blue-500/30 text-blue-300'
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    DNS Error Checker & Guide
                </h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                    Fix DNS_PROBE_FINISHED_NXDOMAIN and other DNS errors. Live checker with step-by-step fixes for all operating systems.
                </p>
            </div>

            {/* Live DNS Checker */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
                <h2 className="text-2xl font-bold text-white">🔍 Live DNS Checker</h2>
                <form onSubmit={checkDNS} className="flex gap-3">
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="Enter domain (e.g., example.com)"
                        className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={result.type === 'LOADING'}
                        className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 transition-colors"
                    >
                        {result.type === 'LOADING' ? 'Checking...' : 'Check DNS'}
                    </button>
                </form>

                {result.type && result.type !== null && (
                    <div className={`p-6 rounded-xl border-2 ${resultColors[result.type]}`}>
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-2xl">
                                {result.type === 'SUCCESS' ? '✅' :
                                    result.type === 'LOADING' ? '⏳' : '❌'}
                            </span>
                            <div className="flex-1">
                                <div className="font-bold text-lg mb-1">{result.message}</div>

                                {result.records?.A && result.records.A.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-sm font-semibold mb-1">IP Addresses:</div>
                                        {result.records.A.map((ip, i) => (
                                            <div key={i} className="text-sm font-mono">{ip}</div>
                                        ))}
                                    </div>
                                )}

                                {result.fixes && result.fixes.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-sm font-semibold mb-2">Suggested Fixes:</div>
                                        <ul className="space-y-1">
                                            {result.fixes.map((fix, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2">
                                                    <span>•</span>
                                                    <span>{fix}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* What is NXDOMAIN */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white" id="what-is-nxdomain">What Does DNS_PROBE_FINISHED_NXDOMAIN Mean?</h2>
                <p className="text-zinc-300 leading-relaxed">
                    <strong>DNS_PROBE_FINISHED_NXDOMAIN</strong> is an error message that appears in Chrome (and other Chromium browsers) when the DNS server returns an <strong>NXDOMAIN</strong> response. This means the domain name you're trying to reach does not exist in the DNS system.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                    Think of it like calling a phone number that doesn't exist - the "phone company" (DNS server) is telling you that number isn't in their directory.
                </p>
            </div>

            {/* Common DNS Errors */}
            <div className=" p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <h2 className="text-2xl font-bold text-white">Common DNS Error Codes</h2>

                <div className="grid gap-4">
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">DNS_PROBE_FINISHED_NXDOMAIN</h3>
                        <p className="text-sm text-zinc-400">Domain doesn't exist or can't be found</p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">DNS_PROBE_FINISHED_NO_INTERNET</h3>
                        <p className="text-sm text-zinc-400">No internet connection detected</p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">ERR_NAME_NOT_RESOLVED</h3>
                        <p className="text-sm text-zinc-400">DNS lookup failed completely</p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">DNS_PROBE_STARTED</h3>
                        <p className="text-sm text-zinc-400">DNS lookup is in progress (usually temporary)</p>
                    </div>
                </div>
            </div>

            {/* OS-Specific Fixes */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <h2 className="text-2xl font-bold text-white">How to Fix DNS Errors (By Operating System)</h2>

                <div className="space-y-6">
                    {/* Windows */}
                    <div id="fix-windows">
                        <h3 className="text-xl font-semibold text-white mb-3">🪟 Windows (10/11)</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-white mb-2">1. Flush DNS Cache</h4>
                                <div className="p-3 bg-zinc-800 rounded-lg">
                                    <code className="text-sm text-green-400">ipconfig /flushdns</code>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">2. Reset Network Stack</h4>
                                <div className="p-3 bg-zinc-800 rounded-lg space-y-1">
                                    <code className="text-sm text-green-400 block">netsh winsock reset</code>
                                    <code className="text-sm text-green-400 block">netsh int ip reset</code>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">3. Change DNS Server</h4>
                                <ul className="text-sm text-zinc-300 space-y-1 ml-4">
                                    <li>• Open Control Panel → Network and Sharing Center</li>
                                    <li>• Click your network → Properties</li>
                                    <li>• Select IPv4 → Properties</li>
                                    <li>• Use: 1.1.1.1 and 1.0.0.1 (Cloudflare)</li>
                                    <li>• Or: 8.8.8.8 and 8.8.4.4 (Google)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* macOS */}
                    <div id="fix-mac">
                        <h3 className="text-xl font-semibold text-white mb-3">🍎 macOS</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-white mb-2">1. Flush DNS Cache</h4>
                                <div className="p-3 bg-zinc-800 rounded-lg space-y-1">
                                    <code className="text-sm text-green-400 block">sudo dscacheutil -flushcache</code>
                                    <code className="text-sm text-green-400 block">sudo killall -HUP mDNSResponder</code>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">2. Change DNS Server</h4>
                                <ul className="text-sm text-zinc-300 space-y-1 ml-4">
                                    <li>• System Preferences → Network</li>
                                    <li>• Select your connection → Advanced</li>
                                    <li>• DNS tab → Add: 1.1.1.1 or 8.8.8.8</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Linux */}
                    <div id="fix-linux">
                        <h3 className="text-xl font-semibold text-white mb-3">🐧 Linux</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-white mb-2">1. Flush DNS Cache (systemd)</h4>
                                <div className="p-3 bg-zinc-800 rounded-lg">
                                    <code className="text-sm text-green-400">sudo systemd-resolve --flush-caches</code>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">2. Change DNS Server</h4>
                                <div className="p-3 bg-zinc-800 rounded-lg">
                                    <code className="text-sm text-green-400">sudo nano /etc/resolv.conf</code>
                                    <div className="text-xs text-zinc-400 mt-2">Add: nameserver 1.1.1.1</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div id="fix-mobile">
                        <h3 className="text-xl font-semibold text-white mb-3">📱 Mobile (iOS/Android)</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-white mb-2">iOS:</h4>
                                <ul className="text-sm text-zinc-300 space-y-1 ml-4">
                                    <li>• Settings → Wi-Fi</li>
                                    <li>• Tap (i) next to network</li>
                                    <li>• Tap "Forget This Network"</li>
                                    <li>• Reconnect and re-enter password</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Android:</h4>
                                <ul className="text-sm text-zinc-300 space-y-1 ml-4">
                                    <li>• Settings → Network & Internet → Wi-Fi</li>
                                    <li>• Long press network → Forget</li>
                                    <li>• Reconnect to network</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Troubleshooting Decision Tree */}
            <div className="p-8 rounded-2xl bg-blue-900/10 border border-blue-800/30 space-y-4">
                <h2 className="text-2xl font-bold text-white">🌳 Troubleshooting Decision Tree</h2>
                <div className="space-y-4 text-zinc-300">
                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <div className="font-semibold mb-2">Step 1: Can you ping 8.8.8.8?</div>
                        <div className="ml-4 space-y-2 text-sm">
                            <div>✅ <strong>YES</strong> → Your internet works, it's a DNS problem (continue below)</div>
                            <div>❌ <strong>NO</strong> → Check your internet connection first</div>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <div className="font-semibold mb-2">Step 2: Flush DNS cache</div>
                        <div className="ml-4 text-sm">Run the flush command for your OS (see above)</div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <div className="font-semibold mb-2">Step 3: Change DNS to 1.1.1.1</div>
                        <div className="ml-4 text-sm">If problem persists, your ISP's DNS may be down</div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <div className="font-semibold mb-2">Step 4: Restart router</div>
                        <div className="ml-4 text-sm">Unplug for 30 seconds, plug back in</div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <div className="font-semibold mb-2">Step 5: Check domain exists</div>
                        <div className="ml-4 text- sm">Use our DNS checker above to verify the domain is valid</div>
                    </div>
                </div>
            </div>

            {/* Related Tools */}
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-4">🔧 Related Network Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🔍</div>
                        <div className="text-sm font-medium">DNS Lookup</div>
                    </Link>
                    <Link href="/ping" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">📡</div>
                        <div className="text-sm font-medium">Ping Test</div>
                    </Link>
                    <Link href="/ip" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🌐</div>
                        <div className="text-sm font-medium">IP Lookup</div>
                    </Link>
                    <Link href="/traceroute" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🛣️</div>
                        <div className="text-sm font-medium">Traceroute</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
