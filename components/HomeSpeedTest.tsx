'use client';

import { useState, useEffect } from 'react';

interface IPInfo {
    ip: string;
    version?: string;
    city?: string;
    region?: string;
    region_code?: string;
    country_name?: string;
    org?: string;
    asn?: string;
}

interface SpeedTestResults {
    downloadSpeed: number | null;
    uploadSpeed: number | null;
    latency: number | null;
    jitter: number | null;
}

export function HomeSpeedTest() {
    const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
    const [scanning, setScanning] = useState(true);
    const [speedResults, setSpeedResults] = useState<SpeedTestResults>({
        downloadSpeed: null,
        uploadSpeed: null,
        latency: null,
        jitter: null,
    });
    const [testing, setTesting] = useState(false);
    const [currentTest, setCurrentTest] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchInfo = async () => {
            setScanning(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                // Primary: ipwho.is (Free, no key, generous limits)
                const res = await fetch('https://ipwho.is/');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setIpInfo({
                            ip: data.ip,
                            org: data.connection?.isp || data.connection?.org,
                            city: data.city,
                            country_name: data.country
                        });
                        return; // Success, exit
                    }
                }
                // If primary fails logic (but not network), throw to catch
                throw new Error('Primary API failed');
            } catch (e) {
                // Silently fail primary and try fallback to avoid console error noise
                try {
                    // Fallback: ipify (IP only, very reliable)
                    const ipRes = await fetch('https://api.ipify.org?format=json');
                    if (ipRes.ok) {
                        const ipData = await ipRes.json();
                        setIpInfo({ ip: ipData.ip });
                    }
                } catch (fallbackError) {
                    // Fail silently
                }
            } finally {
                setScanning(false);
            }
        };

        fetchInfo();
    }, []);

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
        if (valid.length === 0) return { latency_ms: 0, jitter_ms: 0 };

        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;

        let jitter = 0;
        for (let i = 1; i < valid.length; i++) {
            jitter += Math.abs(valid[i] - valid[i - 1]);
        }
        jitter /= Math.max(1, valid.length - 1);

        return {
            latency_ms: avg,
            jitter_ms: jitter,
        };
    };

    const runSpeedTest = async () => {
        setTesting(true);
        setSpeedResults({
            downloadSpeed: null,
            uploadSpeed: null,
            latency: null,
            jitter: null,
        });
        setProgress(0);

        try {
            // 1. Latency Test
            setCurrentTest('Testing latency...');
            const latencyResult = await measureLatency(10);
            setSpeedResults(prev => ({
                ...prev,
                latency: Math.round(latencyResult.latency_ms),
                jitter: Math.round(latencyResult.jitter_ms * 10) / 10,
            }));
            setProgress(30);

            // 2. Download Speed Test
            setCurrentTest('Testing download speed...');
            const downloadSize = 10 * 1024 * 1024; // 10MB for faster test
            try {
                const t0 = performance.now();
                const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${downloadSize}`, { cache: 'no-store' });
                await response.blob();
                const duration = (performance.now() - t0) / 1000;
                const speed = (downloadSize * 8) / (duration * 1000 * 1000);
                setSpeedResults(prev => ({ ...prev, downloadSpeed: speed }));
            } catch (e) {
                console.error('Download test failed', e);
            }
            setProgress(70);

            // 3. Upload Speed Test
            setCurrentTest('Testing upload speed...');
            const uploadSize = 5 * 1024 * 1024; // 5MB for faster test
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
                setSpeedResults(prev => ({ ...prev, uploadSpeed: speed }));
            } catch (e) {
                console.error('Upload test failed', e);
            }
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
        <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 px-6 py-4">
            {/* Heading */}
            <div className="text-center mb-3">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your Public IP</div>
            </div>

            {scanning ? (
                <div className="space-y-3 py-1">
                    {/* Skeleton for IP */}
                    <div className="flex justify-center space-y-1">
                        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    {/* Skeleton for ISP */}
                    <div className="flex justify-center space-y-1">
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    {/* Skeleton for Location */}
                    <div className="flex justify-center space-y-1">
                        <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
            ) : ipInfo ? (
                <div className="text-center space-y-2">
                    {/* IP Address */}
                    <div>
                        <span className="text-xs font-semibold text-zinc-400 uppercase">IP: </span>
                        <span className="font-mono font-bold text-white break-all">{ipInfo.ip}</span>
                    </div>

                    {/* Provider */}
                    {ipInfo.org && (
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 uppercase">ISP: </span>
                            <span className="font-medium text-zinc-300">{ipInfo.org.split(' ')[0]}</span>
                        </div>
                    )}

                    {/* Location */}
                    {ipInfo.city && ipInfo.country_name && (
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 uppercase">Location: </span>
                            <span className="font-medium text-zinc-300">
                                {ipInfo.city}, {ipInfo.country_name}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-2 text-red-400 text-sm">
                    Unable to detect network information
                </div>
            )}

            {/* Divider */}
            <div className="my-4 border-t border-zinc-800"></div>

            {/* Speed Test Section */}
            <div className="space-y-4">
                <div className="text-center">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Speed Test</div>

                    {!testing && !speedResults.downloadSpeed ? (
                        <button
                            onClick={runSpeedTest}
                            disabled={scanning}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start Speed Test
                        </button>
                    ) : testing ? (
                        <div className="space-y-2">
                            <div className="text-sm text-blue-400 font-medium">{currentTest}</div>
                            <div className="w-full bg-zinc-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-zinc-500">{progress}%</div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Speed Test Results Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Latency</div>
                                    <div className="text-xl font-bold text-white">
                                        {speedResults.latency !== null ? speedResults.latency : '—'}
                                        {speedResults.latency !== null && <span className="text-sm text-zinc-500 ml-1">ms</span>}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Jitter</div>
                                    <div className="text-xl font-bold text-white">
                                        {speedResults.jitter !== null ? speedResults.jitter : '—'}
                                        {speedResults.jitter !== null && <span className="text-sm text-zinc-500 ml-1">ms</span>}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Download</div>
                                    <div className={`text-xl font-bold ${getSpeedColor(speedResults.downloadSpeed)}`}>
                                        {speedResults.downloadSpeed !== null ? speedResults.downloadSpeed.toFixed(1) : '—'}
                                        {speedResults.downloadSpeed !== null && <span className="text-sm text-zinc-500 ml-1">Mbps</span>}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Upload</div>
                                    <div className={`text-xl font-bold ${getSpeedColor(speedResults.uploadSpeed)}`}>
                                        {speedResults.uploadSpeed !== null ? speedResults.uploadSpeed.toFixed(1) : '—'}
                                        {speedResults.uploadSpeed !== null && <span className="text-sm text-zinc-500 ml-1">Mbps</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Test Again Button */}
                            <button
                                onClick={runSpeedTest}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Test Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
