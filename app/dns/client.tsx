'use client';

import { useState } from 'react';

interface DNSRecord {
    type: string;
    value: string;
    priority?: number;
    ttl?: number;
}

export default function DnsClient() {
    const [domain, setDomain] = useState('');
    const [records, setRecords] = useState<DNSRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async () => {
        if (!domain) return;
        setLoading(true);
        setError('');
        setRecords([]);

        try {
            const res = await fetch(`/api/dns?domain=${encodeURIComponent(domain)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to lookup DNS');
            }

            setRecords(data.records || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const groupRecordsByType = () => {
        const grouped: { [key: string]: DNSRecord[] } = {};
        records.forEach(record => {
            if (!grouped[record.type]) {
                grouped[record.type] = [];
            }
            grouped[record.type].push(record);
        });
        return grouped;
    };

    const getRecordIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            'A': '🌐',
            'AAAA': '🌐',
            'MX': '📧',
            'TXT': '📝',
            'NS': '🗄️',
            'CNAME': '🔗',
            'SOA': '⚙️',
            'PTR': '↩️',
        };
        return icons[type] || '📋';
    };

    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">DNS Lookup Tool</h1>
                <p className="text-zinc-400">Query DNS records for any domain - A, MX, TXT, NS, CNAME, SOA and more</p>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
                <button
                    onClick={handleLookup}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Looking up...' : 'DNS Lookup'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {records.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-2xl font-bold">DNS Records for {domain}</h2>
                    </div>

                    {Object.entries(groupRecordsByType()).map(([recordType, typeRecords]) => (
                        <div key={recordType} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">{getRecordIcon(recordType)}</span>
                                <h3 className="text-xl font-semibold">{recordType} Records</h3>
                                <span className="ml-auto text-sm text-zinc-500">{typeRecords.length} record{typeRecords.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Type</th>
                                            {recordType === 'MX' && <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Priority</th>}
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Value</th>
                                            {typeRecords.some(r => r.ttl) && <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">TTL</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {typeRecords.map((record, idx) => (
                                            <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
                                                        {record.type}
                                                    </span>
                                                </td>
                                                {recordType === 'MX' && (
                                                    <td className="py-3 px-4 font-mono text-sm">
                                                        {record.priority || '-'}
                                                    </td>
                                                )}
                                                <td className="py-3 px-4 font-mono text-sm break-all">
                                                    {record.value}
                                                </td>
                                                {typeRecords.some(r => r.ttl) && (
                                                    <td className="py-3 px-4 text-sm text-zinc-400">
                                                        {record.ttl ? `${record.ttl}s` : '-'}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {/* Quick Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recordTypes.map(type => {
                            const count = groupRecordsByType()[type]?.length || 0;
                            return (
                                <div key={type} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                                    <div className="text-2xl mb-1">{getRecordIcon(type)}</div>
                                    <div className="text-2xl font-bold">{count}</div>
                                    <div className="text-sm text-zinc-500">{type}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is DNS Lookup?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        DNS Lookup is a network diagnostic tool that queries Domain Name System (DNS) servers to retrieve all DNS records associated with a domain name. It helps you verify DNS configuration, troubleshoot DNS propagation issues, and inspect email routing (MX records), domain ownership verification (TXT records), and more.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Verify DNS Changes:</strong> Check if your recent DNS updates have propagated globally</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Email Configuration:</strong> View MX records to troubleshoot email delivery issues</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Domain Verification:</strong> Check TXT records for domain ownership validation (SPF, DKIM, DMARC)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Find Nameservers:</strong> Identify which DNS servers are authoritative for a domain</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
                    <ol className="space-y-2 text-zinc-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Enter a domain name (e.g., <code className="px-2 py-1 bg-zinc-800 rounded text-blue-400">google.com</code>)</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Click <strong className="text-white">"DNS Lookup"</strong> or press Enter</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>View all DNS records organized by type (A, MX, TXT, etc.)</span>
                        </li>
                    </ol>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Example Queries</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <code className="text-blue-400">google.com</code>
                                <span className="text-zinc-500">→</span>
                                <span className="text-sm text-zinc-400">Returns A records (IP addresses), MX records (mail servers), and more</span>
                            </div>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <code className="text-blue-400">github.com</code>
                                <span className="text-zinc-500">→</span>
                                <span className="text-sm text-zinc-400">Check nameservers, IP addresses, and email configuration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
