'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServerData {
    ip: string;
    userAgent: string;
    acceptLanguage: string;
    referer: string;
    dnt: string;
    platform: string;
    mobile: string;
    encoding: string;
}

interface ExtendedClientData {
    screenResolution: string;
    windowSize: string;
    pixelRatio: number;
    colorDepth: string;
    timezone: string;
    localTime: string;
    browserLanguage: string;
    cookiesEnabled: string;
    hardwareConcurrency: string;
    deviceMemory: string;
    connectionType: string;
    touchSupport: string;
    gpuRenderer: string;
    // New fields
    isp: string;
    city: string;
    country: string;
    asn: string;
    webrtcIp: string;
    protocol: string;
    tls: string;
}

export default function PrivacyDashboardClient({ serverData }: { serverData: ServerData }) {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') === 'inspect' ? 'inspect-site' : 'check-me';

    const [clientData, setClientData] = useState<ExtendedClientData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'check-me' | 'inspect-site'>(defaultTab);
    const [inspectUrl, setInspectUrl] = useState('');

    useEffect(() => {
        const initData = async () => {
            const screen = window.screen;
            const nav = navigator as any;

            // 1. Basic Browser Data
            const data: ExtendedClientData = {
                screenResolution: `${screen.width}x${screen.height}`,
                windowSize: `${window.innerWidth}x${window.innerHeight}`,
                pixelRatio: window.devicePixelRatio,
                colorDepth: `${screen.colorDepth}-bit`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                localTime: new Date().toLocaleTimeString(),
                browserLanguage: navigator.language,
                cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
                hardwareConcurrency: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Cores` : 'Unknown',
                deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown',
                connectionType: nav.connection ? nav.connection.effectiveType : 'Unknown',
                touchSupport: 'ontouchstart' in window || nav.maxTouchPoints > 0 ? 'Yes' : 'No',
                gpuRenderer: 'Unknown',
                isp: 'Detecting...',
                city: 'Detecting...',
                country: 'Detecting...',
                asn: 'Detecting...',
                webrtcIp: 'Checking...',
                protocol: window.location.protocol.replace(':', '').toUpperCase(),
                tls: window.location.protocol === 'https:' ? 'TLS 1.2+' : 'None'
            };

            // 2. WebGL Renderer
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        data.gpuRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    }
                }
            } catch (e) {
                console.error('WebGL detection failed', e);
            }

            // 3. WebRTC Local IP Leak Check (Safe implementation)
            try {
                const pc = new RTCPeerConnection({ iceServers: [] });
                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                pc.onicecandidate = (ice) => {
                    if (ice && ice.candidate && ice.candidate.candidate) {
                        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                        const match = ice.candidate.candidate.match(ipRegex);
                        if (match && match[1] && match[1] !== serverData.ip) {
                            // Only update if it finds a different IP (likely local)
                            setClientData(prev => prev ? { ...prev, webrtcIp: match[1] + ' (Local)' } : null);
                        }
                    }
                };
                // Timeout WebRTC check
                setTimeout(() => {
                    setClientData(prev => prev && prev.webrtcIp === 'Checking...' ? { ...prev, webrtcIp: 'Not Detected' } : null);
                    pc.close();
                }, 1000);
            } catch (e) {
                data.webrtcIp = 'Blocked/Not Supported';
            }

            // 4. ISP & Location (Client-side fetch)
            try {
                const res = await fetch('https://ipapi.co/json/');
                const geo = await res.json();
                if (!geo.error) {
                    data.isp = geo.org || 'Unknown';
                    data.city = geo.city || 'Unknown';
                    data.country = geo.country_name || 'Unknown';
                    data.asn = geo.asn || 'Unknown';
                } else {
                    data.isp = 'Blocklisted (Privacy)';
                    data.city = 'Hidden';
                }
            } catch (e) {
                data.isp = 'Connection Failed';
            }

            setClientData(data);
            setLoading(false);
        };

        initData();
    }, [serverData.ip]);

    const DataRow = ({ label, value, visible = true, note }: { label: string, value: string, visible?: boolean, note?: string }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
            <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${visible ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                <span className="text-zinc-300 font-medium">{label}</span>
            </div>
            <div className="flex flex-col sm:items-end mt-1 sm:mt-0">
                <span className={`font-mono text-sm ${visible ? 'text-white' : 'text-zinc-500 italic'}`}>
                    {value}
                </span>
                {note && <span className="text-xs text-zinc-500">{note}</span>}
            </div>
        </div>
    );

    const SectionCard = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
            <div className="p-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12">

            {/* Hero Section */}
            <div className="text-center space-y-6 pt-8">
                {activeTab === 'check-me' ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-800/30 text-green-400 text-sm font-medium mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Privacy Check
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-800/30 text-purple-400 text-sm font-medium mb-2">
                        <span className="text-lg">🔍</span>
                        Website Inspector
                    </div>
                )}

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent pb-1">
                    {activeTab === 'check-me' ? 'What Websites See About You' : 'Inspect a Website'}
                </h1>

                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    {activeTab === 'check-me'
                        ? 'This is the information a typical website can see when you visit a page — without logging in and without cookies.'
                        : 'See what information a website exposes publicly (Headers, DNS, Security) without revealing your own data.'
                    }
                </p>

                {/* Tab Controls */}
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setActiveTab('check-me')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'check-me'
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        Check Myself
                    </button>
                    <button
                        onClick={() => setActiveTab('inspect-site')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'inspect-site'
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        Check a Website (Advanced)
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: CHECK ME */}
            {activeTab === 'check-me' && (
                <>
                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 1. Network Identity */}
                        <SectionCard title="Visible: Network & Location" icon="🌐">
                            <DataRow label="Public IP Address" value={serverData.ip}
                                note="Your digital address" />
                            <DataRow label="Internet Provider (ISP)" value={clientData?.isp || 'Detecting...'}
                                note="Owner of this IP" />
                            <DataRow label="Location" value={`${clientData?.city || '...'}, ${clientData?.country || '...'}`}
                                note="Approximate, based on IP" />
                            <DataRow label="ASN" value={clientData?.asn || '...'}
                                note="Autonomous System Number" />
                            <DataRow label="Connection Protocol" value={`${clientData?.protocol || 'HTTPS'} / ${serverData.encoding}`}
                                note="Transport security" />
                        </SectionCard>

                        {/* 2. Device Fingerprint */}
                        <SectionCard title="Visible: Device Details" icon="💻">
                            <DataRow label="Operating System" value={serverData.platform.replace(/"/g, '')}
                                note="Detected OS" />
                            <DataRow label="Screen Resolution" value={clientData?.screenResolution || '...'}
                                note="Monitor size" />
                            <DataRow label="GPU Renderer" value={clientData?.gpuRenderer || 'Refused'}
                                note="Graphics card model" />
                            <DataRow label="Battery/Hardware" value={clientData?.hardwareConcurrency ? `${clientData.hardwareConcurrency} Cores` : '...'}
                                note="Device capabilities" />
                            <DataRow label="User Agent" value={serverData.userAgent.substring(0, 30) + '...'}
                                note="Browser ID string" />
                        </SectionCard>

                        {/* 3. Browser & Privacy Signals */}
                        <SectionCard title="Visible: Browser Settings" icon="⚙️">
                            <DataRow label="Browser Language" value={serverData.acceptLanguage.split(',')[0]}
                                note="Preferred language" />
                            <DataRow label="Local Time" value={clientData?.localTime || '...'}
                                note="Matches your OS clock" />
                            <DataRow label="Timezone" value={clientData?.timezone || '...'}
                                note="System timezone" />
                            <DataRow label="Do Not Track" value={serverData.dnt === '1' ? 'Enabled' : 'Disabled'}
                                note="DNT Header" />
                            <DataRow label="WebRTC Local IP" value={clientData?.webrtcIp || 'Not Detected'}
                                visible={clientData?.webrtcIp !== 'Not Detected'}
                                note={clientData?.webrtcIp !== 'Not Detected' ? '⚠️ Potential Leak' : 'Safe'} />
                        </SectionCard>

                        {/* 4. What is HIDDEN (Section B) */}
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl overflow-hidden h-full">
                            <div className="px-4 py-3 bg-zinc-800/30 border-b border-zinc-800 flex items-center gap-2">
                                <span className="text-xl">🔒</span>
                                <h3 className="font-semibold text-zinc-300">NOT Visible (Private)</h3>
                            </div>
                            <div className="p-2">
                                <DataRow label="Real Name" value="HIDDEN" visible={false} note="Never sent automatically" />
                                <DataRow label="Exact Home Address" value="HIDDEN" visible={false} note="IP is only coarse location" />
                                <DataRow label="Email Address" value="HIDDEN" visible={false} note="Requires explicit input" />
                                <DataRow label="Phone Number" value="HIDDEN" visible={false} note="Not accessible by browser" />
                                <DataRow label="Files on Device" value="HIDDEN" visible={false} note="Sandboxed by browser" />
                                <DataRow label="Browsing History" value="HIDDEN" visible={false} note="Restricted access" />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* TAB CONTENT: INSPECT WEBSITE */}
            {activeTab === 'inspect-site' && (
                <div className="space-y-8 animate-in fade-in duration-300">

                    {/* URL Input */}
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleInspect} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="example.com"
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-6 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                value={inspectUrl}
                                onChange={(e) => setInspectUrl(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={inspecting || !inspectUrl}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {inspecting ? 'Checking...' : 'Inspect'}
                            </button>
                        </form>
                    </div>

                    {/* Disclaimer */}
                    <div className="max-w-2xl mx-auto bg-blue-900/10 border border-blue-800/30 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div className="text-sm text-blue-200">
                            <strong>Public Info Only:</strong> This tool inspects what a website server exposes to the public (DNS, Headers, Security Config).
                            It does NOT track users, access private data, or perform any hacking techniques.
                        </div>
                    </div>

                    {/* Results */}
                    {inspectionResult && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Security Summary */}
                            <SectionCard title="Security Signals" icon="🛡️">
                                <DataRow label="HTTPS" value={inspectionResult.security.https ? 'Yes' : 'No'} visible={inspectionResult.security.https} />
                                <DataRow label="HSTS Header" value={inspectionResult.security.hsts ? 'Present' : 'Missing'} visible={inspectionResult.security.hsts} note="Forces secure connections" />
                                <DataRow label="CSP Header" value={inspectionResult.security.csp ? 'Present' : 'Missing'} visible={inspectionResult.security.csp} note="Prevents XSS attacks" />
                                <DataRow label="X-Frame-Options" value={inspectionResult.security.xFrameOptions ? 'Present' : 'Missing'} visible={inspectionResult.security.xFrameOptions} note="Prevents clickjacking" />
                            </SectionCard>

                            {/* DNS Info */}
                            <SectionCard title="DNS Records" icon="📡">
                                {inspectionResult.dns?.a?.length > 0 ? (
                                    inspectionResult.dns.a.map((ip: string) => (
                                        <DataRow key={ip} label="A Record (IPv4)" value={ip} />
                                    ))
                                ) : (
                                    <DataRow label="A Record" value="None found" visible={false} />
                                )}
                                {inspectionResult.dns?.aaaa?.length > 0 && (
                                    inspectionResult.dns.aaaa.map((ip: string) => (
                                        <DataRow key={ip} label="AAAA Record (IPv6)" value={ip} />
                                    ))
                                )}
                            </SectionCard>

                            {/* HTTP Headers */}
                            <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                                <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">📄</span>
                                        <h3 className="font-semibold text-white">Raw HTTP Headers</h3>
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        Status: <span className={inspectionResult.http?.status === 200 ? 'text-green-400' : 'text-yellow-400'}>{inspectionResult.http?.status}</span>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-sm font-mono text-zinc-400">
                                        <tbody>
                                            {Object.entries(inspectionResult.http?.headers || {}).map(([key, value]) => (
                                                <tr key={key} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                                    <td className="p-3 text-blue-300 w-1/3 whitespace-nowrap">{key}</td>
                                                    <td className="p-3 text-zinc-300 break-all">{value as string}</td>
                                                </tr>
                                            ))}
                                            {Object.keys(inspectionResult.http?.headers || {}).length === 0 && (
                                                <tr><td className="p-4 text-center text-zinc-500" colSpan={2}>No headers retrieved</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}

            {/* Educational Content */}
            <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-blue-400">❓</span> Why can websites see this?
                        </h2>
                        <div className="prose prose-invert text-zinc-300">
                            <p>
                                <strong>It's not magic, it's how the internet works.</strong> When you visit a website, your browser sends a request to the server.
                                Included in that request are "headers"—bits of information like your IP address (so the server knows where to send the page back)
                                and your User-Agent (so the server sends the desktop version instead of mobile).
                            </p>
                            <p>
                                Other details, like your screen size and time zone, are detected using JavaScript to make the website look and function correctly on your specific device.
                                While this data is necessary for functionality, it can also be combined to create a "fingerprint" of your device.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-purple-400">📊</span> IP vs Cookies vs Fingerprinting
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-300 border border-zinc-700">
                                <thead className="bg-zinc-800 text-white font-semibold">
                                    <tr>
                                        <th className="p-3 border-b border-zinc-700">Method</th>
                                        <th className="p-3 border-b border-zinc-700">How it works</th>
                                        <th className="p-3 border-b border-zinc-700">Can you block it?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-zinc-800">
                                        <td className="p-3 font-medium text-white">IP Address</td>
                                        <td className="p-3">Network address assigned by your ISP. Required for connection.</td>
                                        <td className="p-3">Yes, use a VPN.</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800">
                                        <td className="p-3 font-medium text-white">Cookies</td>
                                        <td className="p-3">Small text files saved on your device to remember login/prefs.</td>
                                        <td className="p-3">Yes, clear cookies or use Incognito.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-white">Fingerprinting</td>
                                        <td className="p-3">Combining screen, GPU, font, and version data to identify you.</td>
                                        <td className="p-3">Hard. Use privacy browsers (Brave/Tor).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    {/* Related Tools Widget */}
                    <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <h3 className="font-semibold text-white mb-4">Related Privacy Tools</h3>
                        <div className="space-y-3">
                            <Link href="/browser-fingerprint" className="block p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                <div className="font-medium text-blue-400">Fingerprint Test ➜</div>
                                <div className="text-xs text-zinc-400 mt-1">Check your unique browser ID</div>
                            </Link>
                            <Link href="/ip-location-accuracy" className="block p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                <div className="font-medium text-blue-400">IP Location Test ➜</div>
                                <div className="text-xs text-zinc-400 mt-1">See how accurate your IP is</div>
                            </Link>
                        </div>
                    </div>

                    {/* Citation Box for Researchers */}
                    <div className="p-5 bg-blue-900/10 border border-blue-800/30 rounded-xl" id="cite-this-tool">
                        <h3 className="font-semibold text-white mb-3">How to Cite This Page</h3>
                        <p className="text-xs text-zinc-400 mb-3">
                            For journalists and educators demonstrating web privacy:
                        </p>
                        <div className="p-3 bg-zinc-900 rounded border border-zinc-800 font-mono text-xs text-zinc-500 break-words select-all">
                            y4yes. (2025). What Websites See About You. Retrieved from https://y4yes.com/what-websites-see-about-you
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-zinc-400 mb-2 font-semibold">Embed Snippet:</p>
                            <textarea
                                readOnly
                                title="Embed code"
                                aria-label="Embed code"
                                className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500 font-mono resize-none h-20"
                                value={`<iframe src="https://y4yes.com/what-websites-see-about-you" width="100%" height="600" loading="lazy" style="border:none;"></iframe>`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-zinc-500 pt-8 pb-4">
                Last updated: {new Date().toLocaleDateString()} • Data is processed locally and never stored.
            </div>
        </div>
    );
}
