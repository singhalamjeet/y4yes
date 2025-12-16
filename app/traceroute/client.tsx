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

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is Traceroute?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        Traceroute is a network diagnostic tool that maps the path data packets take from your location to a destination server. It shows each hop (router/server) along the route, their IP addresses, and response times. This helps identify network bottlenecks, routing issues, and pinpoint where connectivity problems occur in the path.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Network Diagnostics:</strong> Identify where packets are getting delayed or lost</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Routing Analysis:</strong> See what path your data takes to reach a destination</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Performance Issues:</strong> Diagnose high latency by finding slow hops</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Geographic Path:</strong> Discover which countries/networks your data passes through</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
                    <ol className="space-y-2 text-zinc-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Enter a hostname or IP address (e.g., <code className="px-2 py-1 bg-zinc-800 rounded text-blue-400">google.com</code>)</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Click <strong className="text-white">"Trace"</strong> to start mapping the route</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Review each hop, its IP address, and response time in milliseconds</span>
                        </li>
                    </ol>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Understanding Results</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Hop Number:</strong> <span className="text-zinc-400">Each router/server in the path (usually 5-20 hops)</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">IP Address:</strong> <span className="text-zinc-400">The router's address at that hop</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Response Time:</strong> <span className="text-zinc-400">Round-trip time to that hop (lower is better)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
