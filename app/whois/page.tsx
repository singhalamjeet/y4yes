'use client';

import { useState } from 'react';

export default function WhoisPage() {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async () => {
        if (!domain) return;
        setLoading(true);
        setError('');
        setResult('');

        try {
            const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch WHOIS data');
            }

            setResult(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">WHOIS Lookup</h1>
                <p className="text-zinc-400">Find registration information for any domain name.</p>
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
                    {loading ? 'Searching...' : 'Lookup'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Results for {domain}</h2>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-x-auto">
                        <pre className="text-sm text-zinc-400 font-mono whitespace-pre-wrap">
                            {result}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
