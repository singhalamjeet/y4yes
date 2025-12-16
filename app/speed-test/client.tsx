'use client';

import { useState, useEffect } from 'react';

interface LocationInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
}

export default function SpeedTestClient() {
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
    const [ping, setPing] = useState<number | null>(null);
    const [testing, setTesting] = useState(false);
    const [currentTest, setCurrentTest] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fetch location info on mount
        fetchLocationInfo();
    }, []);

    const fetchLocationInfo = async () => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
                const data = await res.json();
                setLocationInfo({
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                    isp: data.org || 'Unknown ISP',
                });
            }
        } catch (e) {
            console.error('Failed to fetch location:', e);
        }
    };

    const runTest = async () => {
        setTesting(true);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setPing(null);
        setProgress(0);

        try {
            // 1. Ping Test
            setCurrentTest('Testing ping...');
            const pingResults: number[] = [];

            for (let i = 0; i < 5; i++) {
                const startPing = performance.now();
                await fetch('/api/dns?domain=google.com', { cache: 'no-store' });
                const endPing = performance.now();
                pingResults.push(endPing - startPing);
                setProgress(i * 4);
            }

            const avgPing = pingResults.reduce((a, b) => a + b, 0) / pingResults.length;
            setPing(Math.round(avgPing));
            setProgress(20);

            // 2. Download Test
            setCurrentTest('Testing download speed...');
            const downloadSize = 5 * 1024 * 1024; // 5MB

            // Warm up
            await fetch(`/api/download?size=100000`);

            const downloadStart = performance.now();
            await fetch(`/api/download?size=${downloadSize}`, { cache: 'no-store' });
            const downloadEnd = performance.now();

            const downloadDuration = (downloadEnd - downloadStart) / 1000;
            const downloadSpeedMbps = (downloadSize * 8) / (downloadDuration * 1000 * 1000);
            setDownloadSpeed(downloadSpeedMbps);
            setProgress(60);

            // 3. Upload Test
            setCurrentTest('Testing upload speed...');
            const uploadData = new Uint8Array(2 * 1024 * 1024); // 2MB
            const uploadStart = performance.now();

            await fetch('/api/download', {
                method: 'POST',
                body: uploadData,
                cache: 'no-store',
            });

            const uploadEnd = performance.now();
            const uploadDuration = (uploadEnd - uploadStart) / 1000;
            const uploadSpeedMbps = (uploadData.length * 8) / (uploadDuration * 1000 * 1000);
            setUploadSpeed(uploadSpeedMbps);
            setProgress(100);

            setCurrentTest('Complete!');
        } catch (e) {
            console.error('Speed test error:', e);
            setCurrentTest('Error occurred');
        } finally {
            setTesting(false);
        }
    };

    const getSpeedColor = (speed: number | null) => {
        if (!speed) return 'text-zinc-400';
        if (speed < 10) return 'text-red-400';
        if (speed < 50) return 'text-yellow-400';
        if (speed < 100) return 'text-blue-400';
        return 'text-green-400';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header with Location Info */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Speed Test</h1>
                {locationInfo && (
                    <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {locationInfo.city}, {locationInfo.region}, {locationInfo.country}
                        </span>
                        <span>•</span>
                        <span>{locationInfo.isp}</span>
                        <span>•</span>
                        <span className="font-mono">{locationInfo.ip}</span>
                    </div>
                )}
            </div>

            {/* Speedometer Gauge */}
            <div className="relative">
                <div className="flex flex-col items-center justify-center py-12">
                    {/* Circular Progress */}
                    <div className="relative w-80 h-80">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-zinc-800"
                            />
                            {/* Progress circle */}
                            {testing && (
                                <circle
                                    cx="160"
                                    cy="160"
                                    r="140"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-blue-500 transition-all duration-300"
                                    strokeDasharray={`${(progress / 100) * 879.6} 879.6`}
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {!testing && !downloadSpeed ? (
                                <button
                                    onClick={runTest}
                                    className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-5xl font-bold transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
                                >
                                    GO
                                </button>
                            ) : testing ? (
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-blue-400 mb-2">
                                        {downloadSpeed ? downloadSpeed.toFixed(1) : '—'}
                                    </div>
                                    <div className="text-sm text-zinc-400">{currentTest}</div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className={`text-7xl font-bold mb-2 ${getSpeedColor(downloadSpeed)}`}>
                                        {downloadSpeed?.toFixed(0)}
                                    </div>
                                    <div className="text-lg text-zinc-500">Mbps</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Ping</div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {ping !== null ? ping : '—'}
                    </div>
                    <div className="text-sm text-zinc-500">ms</div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Download</div>
                    <div className={`text-4xl font-bold mb-1 ${getSpeedColor(downloadSpeed)}`}>
                        {downloadSpeed !== null ? downloadSpeed.toFixed(1) : '—'}
                    </div>
                    <div className="text-sm text-zinc-500">Mbps</div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Upload</div>
                    <div className={`text-4xl font-bold mb-1 ${getSpeedColor(uploadSpeed)}`}>
                        {uploadSpeed !== null ? uploadSpeed.toFixed(1) : '—'}
                    </div>
                    <div className="text-sm text-zinc-500">Mbps</div>
                </div>
            </div>

            {downloadSpeed && (
                <div className="text-center">
                    <button
                        onClick={runTest}
                        className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                    >
                        Test Again
                    </button>
                </div>
            )}

            <div className="text-center text-sm text-zinc-500">
                <p>Server: Localhost • Results may vary based on network conditions</p>
            </div>

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is Internet Speed Test?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        Internet Speed Test measures your current internet connection's download and upload speeds, plus network latency (ping). It tests your bandwidth by transferring data between your device and our servers, providing accurate measurements of your real-world internet performance. This helps diagnose slow connections and verify your ISP is delivering promised speeds.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">ISP Verification:</strong> Check if you're getting the speeds you're paying for</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Troubleshooting:</strong> Diagnose slow connections or streaming buffering issues</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Network Optimization:</strong> Test different WiFi locations or routers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Gaming Performance:</strong> Check latency and bandwidth for online gaming</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
                    <ol className="space-y-2 text-zinc-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Click the <strong className="text-white">"GO"</strong> button to start the speed test</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Wait for ping, download, and upload tests to complete</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Review your results: ping (latency), download & upload speeds</span>
                        </li>
                    </ol>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Understanding Results</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Ping:</strong> <span className="text-zinc-400">Lower is better (under 30ms excellent for gaming)</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Download:</strong> <span className="text-zinc-400">Affects streaming, browsing (25+ Mbps for HD video)</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Upload:</strong> <span className="text-zinc-400">Important for video calls, file sharing (5+ Mbps recommended)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
