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
    const [testing, setTesting] = useState(false);
    const [currentTest, setCurrentTest] = useState('');
    const [progress, setProgress] = useState(0);

    // Detailed metrics
    const [idleLatency, setIdleLatency] = useState<number | null>(null);
    const [idleJitter, setIdleJitter] = useState<number | null>(null);
    const [packetLoss, setPacketLoss] = useState<number | null>(null);

    useEffect(() => {
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

    // User-provided latency test logic
    const measureLatency = async (samples = 10) => {
        const url = "https://speed.cloudflare.com/__down?bytes=1";
        const times = [];

        for (let i = 0; i < samples; i++) {
            const t0 = performance.now();
            try {
                await fetch(url, { cache: "no-store" });
                times.push(performance.now() - t0);
            } catch {
                times.push(null);
            }
        }

        const valid = times.filter((t): t is number => t !== null);
        if (valid.length === 0) return { latency_ms: 0, jitter_ms: 0, packet_loss: 100 };

        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;

        let jitter = 0;
        for (let i = 1; i < valid.length; i++) {
            jitter += Math.abs(valid[i] - valid[i - 1]);
        }
        jitter /= Math.max(1, valid.length - 1);

        return {
            latency_ms: avg,
            jitter_ms: jitter,
            packet_loss: ((samples - valid.length) / samples) * 100
        };
    };

    const runTest = async () => {
        setTesting(true);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setIdleLatency(null);
        setIdleJitter(null);
        setPacketLoss(null);
        setProgress(0);

        try {
            // 1. Latency & Jitter Test
            setCurrentTest('Testing latency...');

            // Run latency test twice and average as requested
            const latencyRun1 = await measureLatency(10);
            setProgress(10);
            const latencyRun2 = await measureLatency(10);
            setProgress(20);

            const avgLatency = (latencyRun1.latency_ms + latencyRun2.latency_ms) / 2;
            const avgJitter = (latencyRun1.jitter_ms + latencyRun2.jitter_ms) / 2;
            const avgPacketLoss = (latencyRun1.packet_loss + latencyRun2.packet_loss) / 2;

            setIdleLatency(Math.round(avgLatency));
            setIdleJitter(Math.round(avgJitter * 10) / 10);
            setPacketLoss(avgPacketLoss);

            // 2. Download Speed Test (Run twice and average)
            setCurrentTest('Testing download speed...');
            const downloadSize = 25 * 1024 * 1024; // 25MB
            const downloadSpeeds: number[] = [];

            // Pass 1
            try {
                const t0 = performance.now();
                const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${downloadSize}`, { cache: 'no-store' });
                await response.blob();
                const duration = (performance.now() - t0) / 1000;
                const speed = (downloadSize * 8) / (duration * 1000 * 1000);
                downloadSpeeds.push(speed);
                setDownloadSpeed(speed);
            } catch (e) {
                console.error('Download pass 1 failed', e);
            }
            setProgress(50);

            // Pass 2
            try {
                const t0 = performance.now();
                const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${downloadSize}`, { cache: 'no-store' });
                await response.blob();
                const duration = (performance.now() - t0) / 1000;
                const speed = (downloadSize * 8) / (duration * 1000 * 1000);
                downloadSpeeds.push(speed);
                setDownloadSpeed(speed);
            } catch (e) {
                console.error('Download pass 2 failed', e);
            }
            setProgress(80);

            if (downloadSpeeds.length > 0) {
                const avgDownload = downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length;
                setDownloadSpeed(avgDownload);
            }

            // 3. Upload Speed Test (Run twice and average)
            setCurrentTest('Testing upload speed...');
            const uploadSize = 10 * 1024 * 1024; // 10MB
            const uploadSpeeds: number[] = [];

            // Pass 1
            try {
                const uploadData = new Uint8Array(uploadSize).map(() => Math.floor(Math.random() * 256));
                const t0 = performance.now();
                await fetch('https://speed.cloudflare.com/__up', {
                    method: 'POST',
                    body: uploadData,
                    cache: 'no-store',
                });
                const duration = (performance.now() - t0) / 1000;
                const speed = (uploadSize * 8) / (duration * 1000 * 1000);
                uploadSpeeds.push(speed);
                setUploadSpeed(speed);
            } catch (e) {
                console.error('Upload pass 1 failed', e);
            }
            setProgress(90);

            // Pass 2
            try {
                const uploadData = new Uint8Array(uploadSize).map(() => Math.floor(Math.random() * 256));
                const t0 = performance.now();
                await fetch('https://speed.cloudflare.com/__up', {
                    method: 'POST',
                    body: uploadData,
                    cache: 'no-store',
                });
                const duration = (performance.now() - t0) / 1000;
                const speed = (uploadSize * 8) / (duration * 1000 * 1000);
                uploadSpeeds.push(speed);
                setUploadSpeed(speed);
            } catch (e) {
                console.error('Upload pass 2 failed', e);
            }
            setProgress(100);

            if (uploadSpeeds.length > 0) {
                const avgUpload = uploadSpeeds.reduce((a, b) => a + b, 0) / uploadSpeeds.length;
                setUploadSpeed(avgUpload);
            }

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

    const getQualityScore = (metric: 'streaming' | 'gaming' | 'chatting') => {
        if (!downloadSpeed || !uploadSpeed || !idleLatency || !idleJitter) return { label: '—', color: 'text-zinc-500' };

        if (metric === 'streaming') {
            if (downloadSpeed > 25 && idleLatency! < 100) return { label: 'Excellent', color: 'text-green-400' };
            if (downloadSpeed > 10) return { label: 'Good', color: 'text-blue-400' };
            if (downloadSpeed > 5) return { label: 'Fair', color: 'text-yellow-400' };
            return { label: 'Poor', color: 'text-red-400' };
        } else if (metric === 'gaming') {
            if (idleLatency < 30 && idleJitter < 10) return { label: 'Excellent', color: 'text-green-400' };
            if (idleLatency < 60 && idleJitter < 20) return { label: 'Good', color: 'text-blue-400' };
            if (idleLatency < 100) return { label: 'Fair', color: 'text-yellow-400' };
            return { label: 'Poor', color: 'text-red-400' };
        } else {
            if (uploadSpeed > 5 && idleLatency < 50 && idleJitter < 15) return { label: 'Excellent', color: 'text-green-400' };
            if (uploadSpeed > 2 && idleLatency < 100) return { label: 'Good', color: 'text-blue-400' };
            if (uploadSpeed > 1) return { label: 'Fair', color: 'text-yellow-400' };
            return { label: 'Poor', color: 'text-red-400' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
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
                    <div className="relative w-80 h-80">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-zinc-800"
                            />
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
                                    <div className="text-xs text-zinc-500 mt-1">{progress}%</div>
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

            {/* Quick Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Latency</div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {idleLatency !== null ? idleLatency : '—'}
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
                <>
                    {/* Detailed Metrics Table */}
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                        <h3 className="text-xl font-bold text-white mb-6">Detailed Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase mb-2">Latency</div>
                                <div className="text-2xl font-bold text-white">{idleLatency} ms</div>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase mb-2">Jitter</div>
                                <div className="text-2xl font-bold text-white">{idleJitter} ms</div>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase mb-2">Packet Loss</div>
                                <div className="text-2xl font-bold text-white">{packetLoss?.toFixed(1)}%</div>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <div className="text-xs text-zinc-500 uppercase mb-2">Server</div>
                                <div className="text-lg font-bold text-blue-400">Cloudflare</div>
                            </div>
                        </div>
                    </div>

                    {/* Network Quality Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                            <div className="text-sm text-zinc-400 mb-2">Video Streaming</div>
                            <div className={`text-2xl font-bold ${getQualityScore('streaming').color}`}>
                                {getQualityScore('streaming').label}
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                            <div className="text-sm text-zinc-400 mb-2">Online Gaming</div>
                            <div className={`text-2xl font-bold ${getQualityScore('gaming').color}`}>
                                {getQualityScore('gaming').label}
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                            <div className="text-sm text-zinc-400 mb-2">Video Chatting</div>
                            <div className={`text-2xl font-bold ${getQualityScore('chatting').color}`}>
                                {getQualityScore('chatting').label}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={runTest}
                            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                        >
                            Test Again
                        </button>
                    </div>
                </>
            )}

            <div className="text-center text-sm text-zinc-500">
                <p>Server: Cloudflare • Results may vary based on network conditions</p>
            </div>

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is Internet Speed Test?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        Internet Speed Test measures your current internet connection's download and upload speeds, plus network latency (ping). It tests your bandwidth by transferring data between your device and Cloudflare servers, providing accurate measurements of your real-world internet performance.
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
                    <h3 className="text-xl font-semibold text-white mb-3">Understanding Results</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Latency:</strong> <span className="text-zinc-400">Lower is better (under 30ms excellent for gaming)</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Jitter:</strong> <span className="text-zinc-400">Variation in latency (lower is better for real-time apps)</span>
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
