'use client';

import { useState } from 'react';

export default function TracerouteClient() {
    const [host, setHost] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrace = async () => {
        if (!host) return;
        setLoading(true);
        setError('');
        setOutput('');

        try {
            const res = await fetch(`/api/traceroute?host=${encodeURIComponent(host)}`);

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Traceroute failed');
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error('Failed to read stream');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                setOutput(prev => prev + text);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Traceroute</h1>
                <p className="text-zinc-400">Trace the path packets take to reach a destination.</p>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="example.com or 8.8.8.8"
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleTrace()}
                />
                <button
                    onClick={handleTrace}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Tracing...' : 'Trace'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {output && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Results for {host}</h2>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-x-auto">
                        <pre className="text-sm text-zinc-400 font-mono whitespace-pre-wrap">
                            {output}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
