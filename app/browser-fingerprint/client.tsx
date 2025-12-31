'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FingerprintData {
    userAgent: string;
    screen: { width: number; height: number; colorDepth: number };
    timezone: string;
    locale: string;
    canvasHash: string;
    webglVendor: string;
    webglRenderer: string;
    fonts: string[];
    audioHash: string;
    platform: string;
    hardwareConcurrency: number;
}

interface EntropyContribution {
    signal: string;
    value: string;
    entropy: number;
    icon: string;
}

export default function BrowserFingerprintClient() {
    const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);
    const [loading, setLoading] = useState(true);
    const [uniqueness, setUniqueness] = useState<string>('');
    const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('low');
    const [entropy, setEntropy] = useState<EntropyContribution[]>([]);

    useEffect(() => {
        generateFingerprint();
    }, []);

    async function generateFingerprint() {
        setLoading(true);

        try {
            const fp: FingerprintData = {
                userAgent: navigator.userAgent,
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                    colorDepth: window.screen.colorDepth
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locale: navigator.language,
                canvasHash: await getCanvasFingerprint(),
                webglVendor: getWebGLFingerprint().vendor,
                webglRenderer: getWebGLFingerprint().renderer,
                fonts: await detectFonts(),
                audioHash: await getAudioFingerprint(),
                platform: navigator.platform,
                hardwareConcurrency: navigator.hardwareConcurrency || 0
            };

            setFingerprint(fp);
            calculateUniqueness(fp);
        } catch (error) {
            console.error('Fingerprint error:', error);
        }

        setLoading(false);
    }

    async function getCanvasFingerprint(): Promise<string> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'unsupported';

        canvas.width = 200;
        canvas.height = 50;

        const text = 'Browser Fingerprint Test 123 !@#';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(text, 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(text, 4, 17);

        const dataURL = canvas.toDataURL();
        return simpleHash(dataURL);
    }

    function getWebGLFingerprint(): { vendor: string; renderer: string } {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return { vendor: 'unsupported', renderer: 'unsupported' };

        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { vendor: 'blocked', renderer: 'blocked' };

        return {
            vendor: (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown',
            renderer: (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown'
        };
    }

    async function detectFonts(): Promise<string[]> {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
            'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
            'Impact', 'Lucida Console', 'Tahoma', 'Helvetica', 'Century Gothic'
        ];

        const detected: string[] = [];
        const baseSizes: { [key: string]: { width: number; height: number } } = {};

        // Measure base fonts
        for (const baseFont of baseFonts) {
            const size = measureText('mmmmmmmmmmlli', baseFont);
            baseSizes[baseFont] = size;
        }

        // Test fonts
        for (const testFont of testFonts) {
            let different = false;
            for (const baseFont of baseFonts) {
                const size = measureText('mmmmmmmmmmlli', `${testFont}, ${baseFont}`);
                if (size.width !== baseSizes[baseFont].width || size.height !== baseSizes[baseFont].height) {
                    different = true;
                    break;
                }
            }
            if (different) detected.push(testFont);
        }

        return detected;
    }

    function measureText(text: string, font: string): { width: number; height: number } {
        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.left = '-9999px';
        span.style.fontSize = '72px';
        span.style.fontFamily = font;
        span.textContent = text;
        document.body.appendChild(span);
        const width = span.offsetWidth;
        const height = span.offsetHeight;
        document.body.removeChild(span);
        return { width, height };
    }

    async function getAudioFingerprint(): Promise<string> {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            gainNode.gain.value = 0; // Mute
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(0);

            return new Promise((resolve) => {
                scriptProcessor.onaudioprocess = (event) => {
                    const output = event.outputBuffer.getChannelData(0);
                    const hash = simpleHash(output.slice(0, 30).join(','));
                    oscillator.stop();
                    audioContext.close();
                    resolve(hash);
                };
            });
        } catch {
            return 'unsupported';
        }
    }

    function simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16).substring(0, 8);
    }

    function calculateUniqueness(fp: FingerprintData) {
        const contributions: EntropyContribution[] = [
            {
                signal: 'User Agent',
                value: fp.userAgent.substring(0, 50) + '...',
                entropy: 8.5,
                icon: '🌐'
            },
            {
                signal: 'Screen Resolution',
                value: `${fp.screen.width}×${fp.screen.height} (${fp.screen.colorDepth}-bit)`,
                entropy: 6.5,
                icon: '🖥️'
            },
            {
                signal: 'Timezone',
                value: fp.timezone,
                entropy: 3.5,
                icon: '🌍'
            },
            {
                signal: 'Language',
                value: fp.locale,
                entropy: 2.5,
                icon: '🗣️'
            },
            {
                signal: 'Canvas Fingerprint',
                value: fp.canvasHash,
                entropy: 17.0,
                icon: '🎨'
            },
            {
                signal: 'WebGL Vendor',
                value: fp.webglVendor.substring(0, 30),
                entropy: 7.5,
                icon: '📊'
            },
            {
                signal: 'WebGL Renderer',
                value: fp.webglRenderer.substring(0, 30),
                entropy: 7.0,
                icon: '🎮'
            },
            {
                signal: 'Installed Fonts',
                value: `${fp.fonts.length} detected`,
                entropy: 13.5,
                icon: '🔤'
            },
            {
                signal: 'Audio Context',
                value: fp.audioHash,
                entropy: 5.0,
                icon: '🔊'
            },
            {
                signal: 'Platform',
                value: fp.platform,
                entropy: 2.0,
                icon: '💻'
            },
            {
                signal: 'CPU Cores',
                value: fp.hardwareConcurrency.toString(),
                entropy: 3.0,
                icon: '⚙️'
            }
        ];

        setEntropy(contributions);

        // Calculate total entropy
        const totalEntropy = contributions.reduce((sum, c) => sum + c.entropy, 0);

        // Calculate uniqueness (2^entropy)
        const uniquenessNumber = Math.pow(2, totalEntropy);

        // Format large numbers
        let formattedUniqueness: string;
        if (uniquenessNumber > 1e12) {
            formattedUniqueness = `1 in ${(uniquenessNumber / 1e12).toFixed(0)} trillion`;
        } else if (uniquenessNumber > 1e9) {
            formattedUniqueness = `1 in ${(uniquenessNumber / 1e9).toFixed(0)} billion`;
        } else if (uniquenessNumber > 1e6) {
            formattedUniqueness = `1 in ${(uniquenessNumber / 1e6).toFixed(0)} million`;
        } else {
            formattedUniqueness = `1 in ${uniquenessNumber.toFixed(0)}`;
        }

        setUniqueness(formattedUniqueness);

        // Determine confidence
        const detectedSignals = contributions.filter(c => c.value !== 'unsupported' && c.value !== 'blocked').length;
        const totalSignals = contributions.length;
        const detectionRate = detectedSignals / totalSignals;

        if (detectionRate > 0.85) setConfidence('high');
        else if (detectionRate > 0.6) setConfidence('medium');
        else setConfidence('low');
    }

    const confidenceColors = {
        low: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        high: 'bg-green-500/10 text-green-400 border-green-500/30'
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Browser Fingerprint Test
                </h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                    Discover how unique your browser is and what websites can track about you without cookies
                </p>
            </div>

            {/* Score Card */}
            {loading ? (
                <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="text-lg text-zinc-400">Analyzing your browser fingerprint...</div>
                        <div className="text-sm text-zinc-500">This may take a few seconds</div>
                    </div>
                </div>
            ) : (
                <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 text-center space-y-6">
                    <div className="space-y-2">
                        <div className="text-sm uppercase tracking-wider text-zinc-400">Your Uniqueness Score</div>
                        <div className="text-5xl md:text-6xl font-bold text-white">
                            {uniqueness}
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <span className={`px-4 py-2 rounded-full border text-sm font-medium ${confidenceColors[confidence]}`}>
                                {confidence.toUpperCase()} Confidence
                            </span>
                        </div>
                    </div>
                    <p className="text-zinc-300 max-w-2xl mx-auto">
                        Your browser configuration is highly unique. Websites can identify and track you based on your fingerprint alone.
                    </p>
                </div>
            )}

            {/* Fingerprint Breakdown */}
            {!loading && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Fingerprint Breakdown</h2>
                    <div className="grid gap-4">
                        {entropy.map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-white">{item.signal}</div>
                                            <div className="text-sm text-zinc-400 truncate">{item.value}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm text-zinc-500">Entropy</div>
                                        <div className="font-bold text-blue-400">{item.entropy} bits</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* What Is Browser Fingerprinting */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">What Is Browser Fingerprinting?</h2>
                <p className="text-zinc-300 leading-relaxed">
                    Browser fingerprinting is a tracking technique that collects information about your browser configuration and device to create a unique identifier. Unlike cookies, which can be deleted, your fingerprint is generated every time you visit a website - making it a more persistent form of tracking.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                    Websites combine multiple data points (screen resolution, installed fonts, canvas rendering, etc.) to create a unique "fingerprint" that can identify you across the web, even if you clear your cookies or browse in incognito mode.
                </p>
            </div>

            {/* How It Works */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">How Browser Fingerprinting Works</h2>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Canvas Fingerprinting</h3>
                    <p className="text-zinc-300">
                        Different devices render text and graphics slightly differently. By drawing text on an invisible canvas element and analyzing the pixel data, websites can create a unique hash that identifies your specific GPU and browser rendering engine.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">WebGL Fingerprinting</h3>
                    <p className="text-zinc-300">
                        WebGL reveals your graphics card vendor and renderer model, which provides hardware-level identification. This is extremely unique as different GPU models produce different rendering outputs.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Font Detection</h3>
                    <p className="text-zinc-300">
                        The specific combination of fonts installed on your system is highly unique. By measuring text rendering differences, websites can detect which fonts you have installed.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Audio Context Fingerprinting</h3>
                    <p className="text-zinc-300">
                        Audio processing varies slightly between devices due to hardware and software differences. By analyzing audio signal processing, websites can add another layer to your fingerprint.
                    </p>
                </div>
            </div>

            {/* Privacy Implications */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">Privacy & Legal Considerations</h2>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Who Uses Fingerprinting?</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Advertisers:</strong> Track users across websites for targeted ads</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Security/Fraud Detection:</strong> Identify suspicious login patterns and bot traffic</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Analytics:</strong> Track user behavior and website interactions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>DRM Systems:</strong> Prevent piracy and unauthorized access</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">GDPR & Legal Status</h3>
                    <p className="text-zinc-300">
                        Under GDPR, browser fingerprinting may require user consent as it can be considered personal data processing. However, enforcement varies by jurisdiction and use case. Legitimate fraud prevention uses are generally permitted.
                    </p>
                </div>
            </div>

            {/* How to Reduce Fingerprint */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">How to Reduce Your Fingerprint</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🌐 Use Privacy-Focused Browsers</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Tor Browser (best privacy)</li>
                            <li>• Brave (built-in fingerprint blocking)</li>
                            <li>• Firefox with privacy extensions</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🔌 Browser Extensions</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Privacy Badger (EFF)</li>
                            <li>• uBlock Origin</li>
                            <li>• CanvasBlocker</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">⚙️ Browser Settings</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Disable JavaScript on untrusted sites</li>
                            <li>• Block third-party cookies</li>
                            <li>• Use private browsing mode</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">⚠️ Tradeoffs</h3>
                        <ul className="text-sm text-zinc-400 space-y-1">
                            <li>• Some websites may break</li>
                            <li>• Reduced functionality</li>
                            <li>• Slower browsing experience</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* For Researchers */}
            <div className="p-8 rounded-2xl bg-blue-900/10 border border-blue-800/30 space-y-6">
                <h2 className="text-2xl font-bold text-white">For Researchers & Journalists</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">How to Cite This Tool</h3>
                        <div className="p-4 bg-zinc-900 rounded-lg">
                            <p className="text-sm text-zinc-400 mb-2">APA Format:</p>
                            <code className="text-xs text-zinc-300 block">
                                y4yes. (2025). Browser Fingerprint Test – How Unique Is Your Browser?
                                Retrieved from https://y4yes.com/browser-fingerprint
                            </code>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Methodology</h3>
                        <p className="text-zinc-300">
                            This tool uses client-side JavaScript to collect browser characteristics including canvas rendering, WebGL parameters, installed fonts, audio context fingerprinting, and system information. Entropy values are based on research from <a href="https://panopticlick.eff.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">EFF's Panopticlick study</a>.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Privacy Commitment</h3>
                        <p className="text-zinc-300">
                            No fingerprint data is stored, transmitted, or logged. All calculations happen locally in your browser. This tool is for educational purposes only.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Authoritative Sources</h3>
                        <ul className="space-y-2 text-zinc-300">
                            <li>• <a href="https://www.eff.org/deeplinks/2018/06/gdpr-and-browser-fingerprinting-how-it-changes-game-sneakiest-web-trackers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">EFF: GDPR and Browser Fingerprinting</a></li>
                            <li>• <a href="https://developer.mozilla.org/en-US/docs/Web/Privacy/  State_Partitioning" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Mozilla: Privacy and Anti-tracking</a></li>
                            <li>• <a href="https://www.w3.org/TR/fingerprinting-guidance/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">W3C: Mitigating Browser Fingerprinting</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Related Tools */}
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-4">🔧 Related Privacy Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/ip" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🌐</div>
                        <div className="text-sm font-medium">IP Lookup</div>
                    </Link>
                    <Link href="/speed-test" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🚀</div>
                        <div className="text-sm font-medium">Speed Test</div>
                    </Link>
                    <Link href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🔍</div>
                        <div className="text-sm font-medium">DNS Lookup</div>
                    </Link>
                    <Link href="/whois" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">📋</div>
                        <div className="text-sm font-medium">WHOIS</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
