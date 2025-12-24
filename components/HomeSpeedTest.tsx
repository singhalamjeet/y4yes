'use client';

import { useState, useEffect } from 'react';

// Adaptive Speed Test Configuration (same as main speed test)
const ADAPTIVE_CONFIG = {
    SIZES: {
        SMALL: 1 * 1024 * 1024,
        MEDIUM: 10 * 1024 * 1024,
        LARGE: 25 * 1024 * 1024
    },
    FAST_THRESHOLD_SEC: {
        SMALL: 2.0,
        MEDIUM: 6.0,
        LARGE: 15.0
    },
    MAX_TIMEOUT_MS: {
        SMALL: 10000,
        MEDIUM: 20000,
        LARGE: 45000
    },
    REPS_PER_SIZE: 3,
    MIN_SUCCESS_REPS: 2,
    SLOW_ABORT_FACTOR: 2.5
};

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

interface SpeedTestResults {
    downloadSpeed: number | null;
    uploadSpeed: number | null;
    latency: number | null;
    jitter: number | null;
}

type RatingLabel = 'POOR' | 'BAD' | 'GOOD' | 'EXCELLENT';

interface UseCaseRating {
    label: RatingLabel;
    recommended: string;
}

interface ClassifiedResults {
    streaming: UseCaseRating;
    gaming: UseCaseRating;
    video_calls: UseCaseRating;
}

function classifyResults(download_mbps: number, upload_mbps: number, latency_ms: number): ClassifiedResults {
    let streaming: UseCaseRating;
    if (download_mbps < 3) {
        streaming = { label: 'POOR', recommended: 'SD may struggle' };
    } else if (download_mbps < 5) {
        streaming = { label: 'BAD', recommended: 'SD' };
    } else if (download_mbps < 25) {
        streaming = { label: 'GOOD', recommended: 'HD' };
    } else {
        streaming = { label: 'EXCELLENT', recommended: '4K' };
    }

    let gaming: UseCaseRating;
    const bandwidthTooLow = download_mbps < 3 || upload_mbps < 1;
    if (latency_ms > 150 || bandwidthTooLow) {
        gaming = { label: 'POOR', recommended: 'Not recommended' };
    } else if (latency_ms > 80) {
        gaming = { label: 'BAD', recommended: 'Casual only' };
    } else if (latency_ms > 30) {
        gaming = { label: 'GOOD', recommended: 'Casual' };
    } else {
        gaming = { label: 'EXCELLENT', recommended: 'Competitive' };
    }

    let video_calls: UseCaseRating;
    if (upload_mbps < 1 || latency_ms > 300) {
        video_calls = { label: 'POOR', recommended: 'Audio-only' };
    } else if (upload_mbps < 2 || latency_ms > 150) {
        video_calls = { label: 'BAD', recommended: 'SD' };
    } else if (upload_mbps < 5 || latency_ms > 50) {
        video_calls = { label: 'GOOD', recommended: 'HD' };
    } else {
        video_calls = { label: 'EXCELLENT', recommended: 'HD+' };
    }

    return { streaming, gaming, video_calls };
}

function getLabelColor(label: RatingLabel): string {
    switch (label) {
        case 'EXCELLENT': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'GOOD': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'BAD': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'POOR': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
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
    const [classifiedResults, setClassifiedResults] = useState<ClassifiedResults | null>(null);
    const [testing, setTesting] = useState(false);
    const [currentTest, setCurrentTest] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchInfo = async () => {
            setScanning(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
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
                        return;
                    }
                }
                throw new Error('Primary API failed');
            } catch (e) {
                try {
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
        if (valid.length === 0) return { latency_ms: 0, jitter_ms: 0, packet_loss: 0 };

        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;

        let jitter = 0;
        for (let i = 1; i < valid.length; i++) {
            jitter += Math.abs(valid[i] - valid[i - 1]);
        }
        jitter /= Math.max(1, valid.length - 1);

        const packetLoss = ((samples - valid.length) / samples) * 100;

        return { latency_ms: avg, jitter_ms: jitter, packet_loss: packetLoss };
    };

    // EXACT SAME ADAPTIVE FUNCTIONS AS MAIN SPEED TEST
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
            return null;
        }
    };

    const runSingleUploadTest = async (
        sizeBytes: number,
        timeoutMs: number
    ): Promise<{ speed_mbps: number; time_sec: number } | null> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
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

    const shouldEscalate = (
        sizeMb: number,
        repTimes: (number | null)[],
        successCount: number,
        timeoutCount: number,
        thresholdSec: number
    ): { escalate: boolean; reason?: string } => {
        if (successCount < ADAPTIVE_CONFIG.MIN_SUCCESS_REPS) {
            return {
                escalate: false,
                reason: `Only ${successCount}/${ADAPTIVE_CONFIG.REPS_PER_SIZE} successful reps`
            };
        }

        if (timeoutCount >= 2) {
            return {
                escalate: false,
                reason: `${timeoutCount} timeouts detected`
            };
        }

        const validTimes = repTimes.filter(t => t !== null) as number[];
        const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

        if (avgTime > thresholdSec) {
            return {
                escalate: false,
                reason: `Avg time ${avgTime.toFixed(1)}s exceeds ${thresholdSec}s threshold`
            };
        }

        const maxTime = Math.max(...validTimes);
        if (maxTime > thresholdSec * ADAPTIVE_CONFIG.SLOW_ABORT_FACTOR) {
            return {
                escalate: false,
                reason: `Slowest rep ${maxTime.toFixed(1)}s indicates unstable connection`
            };
        }

        return { escalate: true };
    };

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
            onProgress(`Testing download ${mb}MB...`, 30 + (i * 15));

            const repSpeeds: (number | null)[] = [];
            const repTimes: (number | null)[] = [];
            let successCount = 0;
            let timeoutCount = 0;

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

            const validSpeeds = repSpeeds.filter(s => s !== null) as number[];
            const validTimes = repTimes.filter(t => t !== null) as number[];

            const avgSpeed = validSpeeds.length > 0
                ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length
                : null;
            const avgTime = validTimes.length > 0
                ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
                : null;

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

            if (!escalation.escalate) {
                break;
            }
        }

        return results;
    };

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
            onProgress(`Testing upload ${mb}MB...`, 75 + (i * 7));

            const repSpeeds: (number | null)[] = [];
            const repTimes: (number | null)[] = [];
            let successCount = 0;
            let timeoutCount = 0;

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

            const validSpeeds = repSpeeds.filter(s => s !== null) as number[];
            const validTimes = repTimes.filter(t => t !== null) as number[];

            const avgSpeed = validSpeeds.length > 0
                ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length
                : null;
            const avgTime = validTimes.length > 0
                ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
                : null;

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

            if (!escalation.escalate) {
                break;
            }
        }

        return results;
    };

    const getFinalSpeed = (tests: SizeTestResult[]): { speed: number | null; basisMb: number | null } => {
        for (let i = tests.length - 1; i >= 0; i--) {
            if (tests[i].avg_mbps !== null && tests[i].success_count >= ADAPTIVE_CONFIG.MIN_SUCCESS_REPS) {
                return { speed: tests[i].avg_mbps, basisMb: tests[i].size_mb };
            }
        }
        return { speed: null, basisMb: null };
    };

    const runSpeedTest = async () => {
        setTesting(true);
        setSpeedResults({
            downloadSpeed: null,
            uploadSpeed: null,
            latency: null,
            jitter: null,
        });
        setClassifiedResults(null);
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
            setProgress(20);

            // 2. Adaptive Download Test
            const downloadResults = await runAdaptiveDownloadTest((msg, pct) => {
                setCurrentTest(msg);
                setProgress(pct);
            });

            // 3. Adaptive Upload Test
            const uploadResults = await runAdaptiveUploadTest((msg, pct) => {
                setCurrentTest(msg);
                setProgress(pct);
            });

            // 4. Get final speeds
            const finalDownload = getFinalSpeed(downloadResults);
            const finalUpload = getFinalSpeed(uploadResults);

            setSpeedResults(prev => ({
                ...prev,
                downloadSpeed: finalDownload.speed,
                uploadSpeed: finalUpload.speed
            }));

            // 5. Classify results
            if (finalDownload.speed !== null && finalUpload.speed !== null) {
                const classified = classifyResults(
                    finalDownload.speed,
                    finalUpload.speed,
                    Math.round(latencyResult.latency_ms)
                );
                setClassifiedResults(classified);
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
                    <div className="flex justify-center space-y-1">
                        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-center space-y-1">
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-center space-y-1">
                        <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
            ) : ipInfo ? (
                <div className="text-center space-y-2">
                    <div>
                        <span className="text-xs font-semibold text-zinc-400 uppercase">IP: </span>
                        <span className="font-mono font-bold text-white break-all">{ipInfo.ip}</span>
                    </div>

                    {ipInfo.org && (
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 uppercase">ISP: </span>
                            <span className="font-medium text-zinc-300">{ipInfo.org.split(' ')[0]}</span>
                        </div>
                    )}

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

                            {/* Classification Results */}
                            {classifiedResults && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    <div className="p-2 rounded bg-zinc-800/30 border border-zinc-700">
                                        <div className="text-xs text-zinc-500 mb-1">📺 Streaming</div>
                                        <div className={`text-xs px-1.5 py-0.5 rounded border ${getLabelColor(classifiedResults.streaming.label)} inline-block`}>
                                            {classifiedResults.streaming.label}
                                        </div>
                                        <div className="text-xs text-zinc-400 mt-1">{classifiedResults.streaming.recommended}</div>
                                    </div>
                                    <div className="p-2 rounded bg-zinc-800/30 border border-zinc-700">
                                        <div className="text-xs text-zinc-500 mb-1">🎮 Gaming</div>
                                        <div className={`text-xs px-1.5 py-0.5 rounded border ${getLabelColor(classifiedResults.gaming.label)} inline-block`}>
                                            {classifiedResults.gaming.label}
                                        </div>
                                        <div className="text-xs text-zinc-400 mt-1">{classifiedResults.gaming.recommended}</div>
                                    </div>
                                    <div className="p-2 rounded bg-zinc-800/30 border border-zinc-700">
                                        <div className="text-xs text-zinc-500 mb-1">📞 Calls</div>
                                        <div className={`text-xs px-1.5 py-0.5 rounded border ${getLabelColor(classifiedResults.video_calls.label)} inline-block`}>
                                            {classifiedResults.video_calls.label}
                                        </div>
                                        <div className="text-xs text-zinc-400 mt-1">{classifiedResults.video_calls.recommended}</div>
                                    </div>
                                </div>
                            )}

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
