'use client';

import { useState } from 'react';

const COMMON_PORTS = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 443, service: 'HTTPS' },
    { port: 3306, service: 'MySQL' },
    { port: 8080, service: 'HTTP-Alt' },
];

export default function PortScanClient() {
    const [host, setHost] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!host) return;
        setLoading(true);
        setError('');
        setResults([]);

        try {
            const ports = COMMON_PORTS.map(p => p.port).join(',');
            const res = await fetch(`/api/port-scan?host=${encodeURIComponent(host)}&ports=${ports}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scan ports');
            }

            setResults(data.results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Port Scanner</h1>
                <p className="text-zinc-400">Scan common ports to check for open services.</p>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="example.com or 192.168.1.1"
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button
                    onClick={handleScan}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Scanning...' : 'Scan'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Results for {host}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.map((result: any) => {
                            const service = COMMON_PORTS.find(p => p.port === result.port)?.service || 'Unknown';
                            return (
                                <div key={result.port} className={`p-4 rounded-xl border ${result.status === 'open' ? 'bg-green-500/10 border-green-500/20' : 'bg-zinc-900/50 border-zinc-800'}`}>
                                    <div className="text-sm text-zinc-500 mb-1">{service} ({result.port})</div>
                                    <div className={`font-medium ${result.status === 'open' ? 'text-green-400' : 'text-zinc-400'}`}>
                                        {result.status.toUpperCase()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
