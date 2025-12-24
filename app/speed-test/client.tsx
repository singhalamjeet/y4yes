'use client';

import { useState, useEffect } from 'react';

// Adaptive Speed Test Configuration
const ADAPTIVE_CONFIG = {
    // File sizes in bytes
    SIZES: {
        SMALL: 1 * 1024 * 1024,   // 1MB
        MEDIUM: 10 * 1024 * 1024,  // 10MB
        LARGE: 25 * 1024 * 1024    // 25MB
    },

    // Timing thresholds (seconds) - if exceeded, don't escalate
    FAST_THRESHOLD_SEC: {
        SMALL: 2.0,   // 1MB should complete in ~2s on good network
        MEDIUM: 6.0,  // 10MB should complete in ~6s on good network
        LARGE: 15.0   // 25MB should complete in ~15s on good network
    },

    // Hard timeouts (milliseconds) - abort if exceeded
    MAX_TIMEOUT_MS: {
        SMALL: 10000,   // 10s timeout for 1MB
        MEDIUM: 20000,  // 20s timeout for 10MB
        LARGE: 45000    // 45s timeout for 25MB
    },

    // Repetitions and validation
    REPS_PER_SIZE: 3,
    MIN_SUCCESS_REPS: 2,  // At least 2 of 3 must succeed
    SLOW_ABORT_FACTOR: 2.5 // If any rep takes >2.5x threshold, treat as slow
};

interface LocationInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
}

interface SizeTestResult {
    size_mb: number;
    rep_speeds_mbps: (number | null)[];
    rep_times_sec: (number | null)[];
    success_count: number;
    timeout_count: number;
    avg_mbps: number | null;
    avg_time_sec: number | null;
    escalated_to_next: boolean;
    stop_reason?: string;
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

    // Adaptive test results
    const [downloadTests, setDownloadTests] = useState<SizeTestResult[]>([]);
    const [uploadTests, setUploadTests] = useState<SizeTestResult[]>([]);
    const [downloadBasisMb, setDownloadBasisMb] = useState<number | null>(null);
    const [uploadBasisMb, setUploadBasisMb] = useState<number | null>(null);

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

    // Latency test
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

    // Single download test with timeout
    const runSingleDownloadTest = async (
        sizeBytes: number,
        timeoutMs: number
    ): Promise<{ speed_mbps: number; time_sec: number } | null> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const cacheBuster = Date.now() + Math.random();
            const url = `https://speed.cloudflare.com/__down?bytes=${sizeBytes}&cb=${cacheBuster}`;

            const t0 = performance.now();
            const response = await fetch(url, {
                cache: 'no-store',
                signal: controller.signal
            });
            await response.blob();
            const duration = (performance.now() - t0) / 1000;

            clearTimeout(timeoutId);

            const speed = (sizeBytes * 8) / (duration * 1000 * 1000);
            return { speed_mbps: speed, time_sec: duration };
        } catch (error) {
            clearTimeout(timeoutId);
            return null; // Timeout or failure
        }
    };

    // Single upload test with timeout
    const runSingleUploadTest = async (
        sizeBytes: number,
        timeoutMs: number
    ): Promise<{ speed_mbps: number; time_sec: number } | null> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            // Generate random payload
            const uploadData = new Uint8Array(sizeBytes)
                .map(() => Math.floor(Math.random() * 256));

            const t0 = performance.now();
            await fetch('https://speed.cloudflare.com/__up', {
                method: 'POST',
                body: uploadData,
                cache: 'no-store',
                signal: controller.signal
            });
            const duration = (performance.now() - t0) / 1000;

            clearTimeout(timeoutId);

            const speed = (sizeBytes * 8) / (duration * 1000 * 1000);
            return { speed_mbps: speed, time_sec: duration };
        } catch (error) {
            clearTimeout(timeoutId);
            return null;
        }
    };

    // Decision logic for escalation
    const shouldEscalate = (
        sizeMb: number,
        repTimes: (number | null)[],
        successCount: number,
        timeoutCount: number,
        thresholdSec: number
    ): { escalate: boolean; reason?: string } => {
        // Need minimum successful reps
        if (successCount < ADAPTIVE_CONFIG.MIN_SUCCESS_REPS) {
            return {
                escalate: false,
                reason: `Only ${successCount}/${ADAPTIVE_CONFIG.REPS_PER_SIZE} successful reps`
            };
        }

        // Too many timeouts
        if (timeoutCount >= 2) {
            return {
                escalate: false,
                reason: `${timeoutCount} timeouts detected`
            };
        }

        // Check average time
        const validTimes = repTimes.filter(t => t !== null) as number[];
        const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

        if (avgTime > thresholdSec) {
            return {
                escalate: false,
                reason: `Avg time ${avgTime.toFixed(1)}s exceeds ${thresholdSec}s threshold`
            };
        }

        // Check if any single rep was too slow (erratic network)
        const maxTime = Math.max(...validTimes);
        if (maxTime > thresholdSec * ADAPTIVE_CONFIG.SLOW_ABORT_FACTOR) {
            return {
                escalate: false,
                reason: `Slowest rep ${maxTime.toFixed(1)}s indicates unstable connection`
            };
        }

        return { escalate: true };
    };

    // Adaptive download test
    const runAdaptiveDownloadTest = async (
        onProgress: (message: string, percent: number) => void
    ): Promise<SizeTestResult[]> => {
        const results: SizeTestResult[] = [];
        const sizes = [
            { bytes: ADAPTIVE_CONFIG.SIZES.SMALL, mb: 1, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.SMALL, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.SMALL },
            { bytes: ADAPTIVE_CONFIG.SIZES.MEDIUM, mb: 10, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.MEDIUM, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.MEDIUM },
            { bytes: ADAPTIVE_CONFIG.SIZES.LARGE, mb: 25, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.LARGE, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.LARGE }
        ];

        for (let i = 0; i < sizes.length; i++) {
            const { bytes, mb, timeout, threshold } = sizes[i];
            onProgress(`Testing download ${mb}MB (${i + 1}/3)...`, 30 + (i * 15));

            const repSpeeds: (number | null)[] = [];
            const repTimes: (number | null)[] = [];
            let successCount = 0;
            let timeoutCount = 0;

            // Run 3 reps for this size
            for (let rep = 0; rep < ADAPTIVE_CONFIG.REPS_PER_SIZE; rep++) {
                const result = await runSingleDownloadTest(bytes, timeout);

                if (result) {
                    repSpeeds.push(result.speed_mbps);
                    repTimes.push(result.time_sec);
                    successCount++;
                } else {
                    repSpeeds.push(null);
                    repTimes.push(null);
                    timeoutCount++;
                }
            }

            // Calculate averages from successful reps
            const validSpeeds = repSpeeds.filter(s => s !== null) as number[];
            const validTimes = repTimes.filter(t => t !== null) as number[];

            const avgSpeed = validSpeeds.length > 0
                ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length
                : null;
            const avgTime = validTimes.length > 0
                ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
                : null;

            // Decide if we should escalate
            const escalation = shouldEscalate(mb, repTimes, successCount, timeoutCount, threshold);

            results.push({
                size_mb: mb,
                rep_speeds_mbps: repSpeeds,
                rep_times_sec: repTimes,
                success_count: successCount,
                timeout_count: timeoutCount,
                avg_mbps: avgSpeed,
                avg_time_sec: avgTime,
                escalated_to_next: escalation.escalate,
                stop_reason: escalation.reason
            });

            // Stop if we shouldn't escalate
            if (!escalation.escalate) {
                break;
            }
        }

        return results;
    };

    // Adaptive upload test
    const runAdaptiveUploadTest = async (
        onProgress: (message: string, percent: number) => void
    ): Promise<SizeTestResult[]> => {
        const results: SizeTestResult[] = [];
        const sizes = [
            { bytes: ADAPTIVE_CONFIG.SIZES.SMALL, mb: 1, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.SMALL, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.SMALL },
            { bytes: ADAPTIVE_CONFIG.SIZES.MEDIUM, mb: 10, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.MEDIUM, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.MEDIUM },
            { bytes: ADAPTIVE_CONFIG.SIZES.LARGE, mb: 25, timeout: ADAPTIVE_CONFIG.MAX_TIMEOUT_MS.LARGE, threshold: ADAPTIVE_CONFIG.FAST_THRESHOLD_SEC.LARGE }
        ];

        for (let i = 0; i < sizes.length; i++) {
            const { bytes, mb, timeout, threshold } = sizes[i];
            onProgress(`Testing upload ${mb}MB (${i + 1}/3)...`, 75 + (i * 7));

            const repSpeeds: (number | null)[] = [];
            const repTimes: (number | null)[] = [];
            let successCount = 0;
            let timeoutCount = 0;

            // Run 3 reps for this size
            for (let rep = 0; rep < ADAPTIVE_CONFIG.REPS_PER_SIZE; rep++) {
                const result = await runSingleUploadTest(bytes, timeout);

                if (result) {
                    repSpeeds.push(result.speed_mbps);
                    repTimes.push(result.time_sec);
                    successCount++;
                } else {
                    repSpeeds.push(null);
                    repTimes.push(null);
                    timeoutCount++;
                }
            }

            // Calculate averages from successful reps
            const validSpeeds = repSpeeds.filter(s => s !== null) as number[];
            const validTimes = repTimes.filter(t => t !== null) as number[];

            const avgSpeed = validSpeeds.length > 0
                ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length
                : null;
            const avgTime = validTimes.length > 0
                ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
                : null;

            // Decide if we should escalate
            const escalation = shouldEscalate(mb, repTimes, successCount, timeoutCount, threshold);

            results.push({
                size_mb: mb,
                rep_speeds_mbps: repSpeeds,
                rep_times_sec: repTimes,
                success_count: successCount,
                timeout_count: timeoutCount,
                avg_mbps: avgSpeed,
                avg_time_sec: avgTime,
                escalated_to_next: escalation.escalate,
                stop_reason: escalation.reason
            });

            // Stop if we shouldn't escalate
            if (!escalation.escalate) {
                break;
            }
        }

        return results;
    };

    // Get final speed from adaptive results
    const getFinalSpeed = (tests: SizeTestResult[]): { speed: number | null; basisMb: number | null } => {
        // Use the last successful test with valid average
        for (let i = tests.length - 1; i >= 0; i--) {
            if (tests[i].avg_mbps !== null && tests[i].success_count >= ADAPTIVE_CONFIG.MIN_SUCCESS_REPS) {
                return { speed: tests[i].avg_mbps, basisMb: tests[i].size_mb };
            }
        }
        return { speed: null, basisMb: null };
    };

    const runTest = async () => {
        setTesting(true);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setIdleLatency(null);
        setIdleJitter(null);
        setPacketLoss(null);
        setDownloadTests([]);
        setUploadTests([]);
        setProgress(0);

        try {
            // 1. Latency & Jitter Test
            setCurrentTest('Testing latency...');
            const latencyResult = await measureLatency(10);

            setIdleLatency(Math.round(latencyResult.latency_ms));
            setIdleJitter(Math.round(latencyResult.jitter_ms * 10) / 10);
            setPacketLoss(latencyResult.packet_loss);
            setProgress(20);

            // 2. Adaptive Download Test
            const downloadResults = await runAdaptiveDownloadTest(
                (msg, pct) => {
                    setCurrentTest(msg);
                    setProgress(pct);
                }
            );

            setDownloadTests(downloadResults);

            // 3. Adaptive Upload Test
            const uploadResults = await runAdaptiveUploadTest(
                (msg, pct) => {
                    setCurrentTest(msg);
                    setProgress(pct);
                }
            );

            setUploadTests(uploadResults);

            // 4. Get final speeds
            const finalDownload = getFinalSpeed(downloadResults);
            const finalUpload = getFinalSpeed(uploadResults);

            setDownloadSpeed(finalDownload.speed);
            setUploadSpeed(finalUpload.speed);
            setDownloadBasisMb(finalDownload.basisMb);
            setUploadBasisMb(finalUpload.basisMb);

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
                                <div className="text-center flex flex-col items-center">
                                    <div className={`text-7xl font-bold mb-2 ${getSpeedColor(downloadSpeed)}`}>
                                        {downloadSpeed?.toFixed(0)}
                                    </div>
                                    <div className="text-lg text-zinc-500 mb-2">Mbps</div>
                                    {downloadBasisMb && (
                                        <div className="text-xs text-zinc-600 mb-4">Based on {downloadBasisMb}MB test</div>
                                    )}
                                    <button
                                        onClick={runTest}
                                        className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        Test Again
                                    </button>
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
                    <div className="text-sm text-zinc-500">
                        {downloadBasisMb ? `Mbps (${downloadBasisMb}MB)` : 'Mbps'}
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Upload</div>
                    <div className={`text-4xl font-bold mb-1 ${getSpeedColor(uploadSpeed)}`}>
                        {uploadSpeed !== null ? uploadSpeed.toFixed(1) : '—'}
                    </div>
                    <div className="text-sm text-zinc-500">
                        {uploadBasisMb ? `Mbps (${uploadBasisMb}MB)` : 'Mbps'}
                    </div>
                </div>
            </div>

            {downloadSpeed && (
                <>
                    {/* Detailed Metrics Table */}
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
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

                        {/* Adaptive Test Breakdown */}
                        {downloadTests.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-white">Download Test Results</h4>
                                {downloadTests.map((test, idx) => (
                                    <div key={idx} className="p-4 bg-zinc-800/30 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-white">{test.size_mb}MB Test</span>
                                            <span className="text-xs text-zinc-400">
                                                {test.success_count}/{ADAPTIVE_CONFIG.REPS_PER_SIZE} successful
                                            </span>
                                        </div>
                                        {test.avg_mbps !== null && (
                                            <div className="text-lg font-bold text-blue-400 mb-1">
                                                {test.avg_mbps.toFixed(1)} Mbps avg
                                            </div>
                                        )}
                                        {test.stop_reason && (
                                            <div className="text-xs text-yellow-400">
                                                ⚠ {test.stop_reason}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadTests.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-white">Upload Test Results</h4>
                                {uploadTests.map((test, idx) => (
                                    <div key={idx} className="p-4 bg-zinc-800/30 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-white">{test.size_mb}MB Test</span>
                                            <span className="text-xs text-zinc-400">
                                                {test.success_count}/{ADAPTIVE_CONFIG.REPS_PER_SIZE} successful
                                            </span>
                                        </div>
                                        {test.avg_mbps !== null && (
                                            <div className="text-lg font-bold text-purple-400 mb-1">
                                                {test.avg_mbps.toFixed(1)} Mbps avg
                                            </div>
                                        )}
                                        {test.stop_reason && (
                                            <div className="text-xs text-yellow-400">
                                                ⚠ {test.stop_reason}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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


                </>
            )}

            <div className="text-center text-sm text-zinc-500">
                <p>Server: Cloudflare • Adaptive testing for optimal speed on all networks</p>
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
                    <h3 className="text-xl font-semibold text-white mb-3">Adaptive Testing Technology</h3>
                    <p className="text-zinc-300 leading-relaxed mb-3">
                        Our adaptive speed test intelligently adjusts to your network conditions. It starts with small 1MB tests and only progresses to larger 10MB and 25MB tests if your connection is fast enough. This means:
                    </p>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span><strong className="text-white">Fast networks</strong> get comprehensive 25MB tests for maximum accuracy</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span><strong className="text-white">Slow networks</strong> complete quickly without wasting time on large transfers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span><strong className="text-white">All results</strong> are based on the optimal file size for your connection</span>
                        </li>
                    </ul>
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
