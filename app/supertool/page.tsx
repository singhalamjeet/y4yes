'use client';

import { useState } from 'react';

type ToolType = 'mx' | 'dns' | 'whois' | 'ssl' | 'ping' | 'trace' | 'ip' | 'port-scan' |
    'aaaa' | 'cname' | 'txt' | 'ns' | 'soa' | 'srv' | 'spf' | 'dkim' | 'dmarc' |
    'blacklist' | 'reverse' | 'http' | 'https' | 'domain-health';

interface Tool {
    id: ToolType;
    name: string;
    popular?: boolean;
}

const tools: Tool[] = [
    { id: 'aaaa', name: 'AAAA Lookup' },
    { id: 'blacklist', name: 'Blacklist Check', popular: true },
    { id: 'cname', name: 'CNAME Lookup' },
    { id: 'dkim', name: 'DKIM Lookup' },
    { id: 'dmarc', name: 'DMARC Lookup', popular: true },
    { id: 'dns', name: 'DNS Lookup' },
    { id: 'domain-health', name: 'Domain Health', popular: true },
    { id: 'http', name: 'HTTP Lookup' },
    { id: 'https', name: 'HTTPS Lookup' },
    { id: 'ip', name: "What Is My IP?" },
    { id: 'mx', name: 'MX Lookup', popular: true },
    { id: 'ns', name: 'NS Lookup' },
    { id: 'ping', name: 'Ping' },
    { id: 'port-scan', name: 'Port Scanner' },
    { id: 'reverse', name: 'Reverse Lookup' },
    { id: 'soa', name: 'SOA Lookup' },
    { id: 'spf', name: 'SPF Record Lookup' },
    { id: 'srv', name: 'SRV Lookup' },
    { id: 'ssl', name: 'SSL Check' },
    { id: 'trace', name: 'Trace (Traceroute)' },
    { id: 'txt', name: 'TXT Lookup' },
    { id: 'whois', name: 'Whois Lookup' },
];

export default function SuperToolPage() {
    const [domain, setDomain] = useState('');
    const [selectedTool, setSelectedTool] = useState<ToolType>('mx');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLookup = async (toolOverride?: ToolType) => {
        const toolToRun = toolOverride || selectedTool;
        if (toolOverride) {
            setSelectedTool(toolOverride);
        }

        if (!domain && toolToRun !== 'ip') return;

        // Add tool identifier to results
        data.tool = toolToRun;
        setResults(data);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

const getFilteredRecords = (records: any[]) => {
    const typeMap: { [key in ToolType]?: string } = {
        'mx': 'MX',
        'aaaa': 'AAAA',
        'cname': 'CNAME',
        'txt': 'TXT',
        'ns': 'NS',
        'soa': 'SOA',
        'srv': 'SRV',
        'spf': 'TXT',
        'dmarc': 'TXT',
        'dkim': 'TXT',
    };

    const targetType = typeMap[selectedTool];
    if (targetType) {
        return records.filter(r => r.type === targetType);
    }
    return records;
};

const renderResults = () => {
    if (!results) return null;

    // What Is My IP
    if (selectedTool === 'ip') {
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">Your IP Address</div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 p-8 text-center">
                    <div className="text-4xl font-mono font-bold text-blue-600">{results.ip}</div>
                </div>
            </div>
        );
    }

    // Blacklist Check
    if (selectedTool === 'blacklist') {
        const blacklistResults = results.results || [];
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="text-2xl font-bold">blacklist:{domain}</div>
                    <div className="text-zinc-500">
                        Checking {domain} which resolves to {results.ip} against {results.totalChecked} known blacklists...
                        <br />
                        Listed {results.listedCount} times with {results.timeoutCount} timeouts
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Blacklist</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Reason</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm">TTL</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Response Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blacklistResults.map((result: any, idx: number) => (
                                <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {result.status === 'OK' && <span className="text-green-600 font-bold">Status Ok OK</span>}
                                            {result.status === 'LISTED' && <span className="text-red-600 font-bold">Status Listed</span>}
                                            {result.status === 'TIMEOUT' && <span className="text-yellow-600 font-bold">Status Warning TIMEOUT</span>}
                                            {result.status === 'ERROR' && <span className="text-red-400 font-bold">Status Error</span>}
                                            <span className="font-medium">{result.blacklist}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-zinc-500">{result.reason}</td>
                                    <td className="py-3 px-4 text-sm text-zinc-500">{result.ttl || ''}</td>
                                    <td className="py-3 px-4 text-sm text-zinc-500">{result.responseTime}ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Domain Health
    if (selectedTool === 'domain-health') {
        const healthResults = results.results || [];
        const summary = results.summary || { errors: 0, warnings: 0, status: 'Unknown' };

        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="text-2xl font-bold">domain-health:{domain}</div>
                    <div className="flex gap-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                            {summary.errors} Errors
                        </span>
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                            {summary.warnings} Warnings
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${summary.status === 'Healthy' ? 'bg-green-100 text-green-700' :
                            summary.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            Status: {summary.status}
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm w-16">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm w-32">Category</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm w-48">Test</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {healthResults.map((result: any, idx: number) => (
                                <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                                    <td className="py-3 px-4">
                                        {result.status === 'ok' && (
                                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        {result.status === 'warning' && (
                                            <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        )}
                                        {result.status === 'error' && (
                                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-sm text-zinc-600 dark:text-zinc-400">{result.category}</td>
                                    <td className="py-3 px-4 font-medium text-sm">{result.test}</td>
                                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{result.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // DNS-based tools
    if (['mx', 'dns', 'aaaa', 'cname', 'txt', 'ns', 'soa', 'srv', 'spf', 'dmarc', 'dkim', 'http', 'reverse'].includes(selectedTool)) {
        const records = results.records || [];
        const filteredRecords = getFilteredRecords(records);

        const toolPrefix = selectedTool === 'dns' ? 'a' : selectedTool;

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold">
                        {toolPrefix}:{domain}
                    </div>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium">
                        Find Problems
                    </button>
                </div>

                {filteredRecords.length > 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                                    {selectedTool === 'mx' && <th className="text-left py-3 px-4 font-semibold text-sm">Pref</th>}
                                    <th className="text-left py-3 px-4 font-semibold text-sm">{selectedTool === 'mx' ? 'Hostname' : 'Value'}</th>
                                    {filteredRecords.some((r: any) => r.ttl) && <th className="text-left py-3 px-4 font-semibold text-sm">TTL</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((record: any, idx: number) => (
                                    <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                                        <td className="py-3 px-4 font-medium">{record.type}</td>
                                        {selectedTool === 'mx' && <td className="py-3 px-4">{record.priority || '-'}</td>}
                                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400 break-all">{record.value}</td>
                                        {filteredRecords.some((r: any) => r.ttl) && <td className="py-3 px-4 text-zinc-500">{record.ttl || '-'}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-zinc-500 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800">
                        No {tools.find(t => t.id === selectedTool)?.name} records found
                    </div>
                )}
            </div>
        );
    }

    // WHOIS
    if (selectedTool === 'whois') {
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">whois:{domain}</div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 p-6">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{results.data}</pre>
                </div>
            </div>
        );
    }

    // SSL/HTTPS Check
    if (selectedTool === 'ssl' || selectedTool === 'https') {
        const cert = results.data;
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">
                    {selectedTool}:{domain}
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <tbody>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <td className="py-3 px-4 font-semibold bg-zinc-100 dark:bg-zinc-800/50 w-48">Status</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center gap-2 ${cert.valid ? 'text-green-600' : 'text-red-600'}`}>
                                        {cert.valid ? '✓' : '✗'} {cert.valid ? 'Valid' : 'Invalid'}
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <td className="py-3 px-4 font-semibold bg-zinc-100 dark:bg-zinc-800/50">Issuer</td>
                                <td className="py-3 px-4">{cert.issuer?.O || cert.issuer?.CN || 'Unknown'}</td>
                            </tr>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <td className="py-3 px-4 font-semibold bg-zinc-100 dark:bg-zinc-800/50">Valid From</td>
                                <td className="py-3 px-4">{new Date(cert.validFrom).toLocaleDateString()}</td>
                            </tr>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <td className="py-3 px-4 font-semibold bg-zinc-100 dark:bg-zinc-800/50">Valid To</td>
                                <td className="py-3 px-4">{new Date(cert.validTo).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-semibold bg-zinc-100 dark:bg-zinc-800/50">Days Remaining</td>
                                <td className="py-3 px-4">
                                    <span className={cert.daysRemaining > 30 ? 'text-green-600' : cert.daysRemaining > 0 ? 'text-yellow-600' : 'text-red-600'}>
                                        {cert.daysRemaining} days
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Ping
    if (selectedTool === 'ping') {
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">ping:{domain}</div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 p-6">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{results.output}</pre>
                </div>
            </div>
        );
    }

    // Port Scan
    if (selectedTool === 'port-scan') {
        const portResults = results.results || [];
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">port-scan:{domain}</div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Port</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portResults.map((result: any, idx: number) => (
                                <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                                    <td className="py-3 px-4">{result.port}</td>
                                    <td className="py-3 px-4">
                                        <span className={result.status === 'open' ? 'text-green-600' : 'text-zinc-500'}>
                                            {result.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Traceroute
    if (selectedTool === 'trace') {
        return (
            <div className="space-y-4">
                <div className="text-2xl font-bold">trace:{domain}</div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-800 p-6">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{results.output}</pre>
                </div>
            </div>
        );
    }

    return null;
};

return (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
            <h1 className="text-4xl font-bold">SuperTool</h1>
            <p className="text-zinc-400">All of your network tools in one place</p>
        </div>

        {/* Search Bar & Tool Selection */}
        <div className="space-y-4">
            <div className="flex gap-0 relative">
                <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 px-4 py-3 rounded-l-xl bg-zinc-900 border border-zinc-800 border-r-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />

                {/* Split Button */}
                <div className="flex bg-orange-600 rounded-r-xl overflow-hidden">
                    {/* Main Action Button */}
                    <button
                        onClick={() => handleLookup()}
                        disabled={loading}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? 'Running...' : tools.find(t => t.id === selectedTool)?.name}
                    </button>

                    {/* Dropdown Toggle */}
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="px-3 py-3 bg-orange-600 hover:bg-orange-500 text-white border-l border-orange-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">All Tools (A–Z)</div>
                            {tools.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        handleLookup(tool.id);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedTool === tool.id
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    {tool.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Tools Buttons */}
            <div className="flex flex-wrap gap-2">
                {tools.filter(t => t.popular).map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => handleLookup(tool.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTool === tool.id
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                    >
                        {tool.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Error */}
        {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
            </div>
        )}

        {/* Results */}
        {results && renderResults()}
    </div>
);
}
