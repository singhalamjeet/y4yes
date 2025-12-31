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

export default function PrivacyDashboardClient({ serverData }: { serverData: ServerData }) {
    const [clientData, setClientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Collect client-side data
        const getClientData = () => {
            const screen = window.screen;
            const nav = navigator as any; // Cast to any to access newer properties

            const data = {
                screenResolution: `${screen.width}x${screen.height}`,
                windowSize: `${window.innerWidth}x${window.innerHeight}`,
                pixelRatio: window.devicePixelRatio,
                colorDepth: `${screen.colorDepth}-bit`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                localTime: new Date().toLocaleTimeString(),
                browserLanguage: navigator.language,
                cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
                hardwareConcurrency: nav.hardwareConcurrency || 'Unknown',
                deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown',
                connectionType: nav.connection ? nav.connection.effectiveType : 'Unknown',
                touchSupport: 'ontouchstart' in window || nav.maxTouchPoints > 0 ? 'Yes' : 'No',
                gpuRenderer: 'Unknown'
            };

            // Get WebGL Renderer
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

            setClientData(data);
            setLoading(false);
        };

        getClientData();
    }, []);

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
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-800/30 text-green-400 text-sm font-medium mb-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Privacy Dashboard
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent pb-1">
                    What Websites See About You
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    A real-time demonstration of the data your browser automatically shares with every website you visit.
                    <span className="block mt-2 text-sm text-zinc-500 font-normal">
                        🛡️ No tracking. No cookies. No data storage.
                    </span>
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Network Identity */}
                <SectionCard title="Network Identity" icon="🌐">
                    <DataRow label="Public IP Address" value={serverData.ip}
                        note="Identifies your connection" />
                    <DataRow label="General Location" value="City/Country"
                        note="Derived from IP address" />
                    <DataRow label="Internet Provider" value="Visible via IP"
                        note="ISP or Organization Name" />
                    <DataRow label="Referrer" value={serverData.referer}
                        note="Previous page URL" />
                </SectionCard>

                {/* 2. Device Fingerprint */}
                <SectionCard title="Device Details" icon="💻">
                    <DataRow label="Operating System" value={serverData.platform.replace(/"/g, '')}
                        note="Derived from headers" />
                    <DataRow label="User Agent" value={serverData.userAgent.substring(0, 40) + '...'}
                        note="Full browser ID string" />
                    <DataRow label="Screen Resolution" value={clientData?.screenResolution || '...'} />
                    <DataRow label="GPU Renderer" value={clientData?.gpuRenderer || '...'}
                        note="Specific graphics card model" />
                    <DataRow label="Battery/Hardware" value={clientData?.hardwareConcurrency ? `${clientData.hardwareConcurrency} Cores` : '...'} />
                </SectionCard>

                {/* 3. Browser Settings */}
                <SectionCard title="Browser Settings" icon="⚙️">
                    <DataRow label="Language" value={serverData.acceptLanguage.split(',')[0]} />
                    <DataRow label="Timezone" value={clientData?.timezone || '...'} />
                    <DataRow label="Local Time" value={clientData?.localTime || '...'} />
                    <DataRow label="Cookies Enabled" value={clientData?.cookiesEnabled || '...'} />
                    <DataRow label="Do Not Track" value={serverData.dnt === '1' ? 'Enabled' : 'Disabled / Not Set'}
                        note="Privacy signal header" />
                </SectionCard>

                {/* 4. What is HIDDEN (Important for Trust) */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-zinc-800/30 border-b border-zinc-800 flex items-center gap-2">
                        <span className="text-xl">🔒</span>
                        <h3 className="font-semibold text-zinc-300">What is NOT Visible</h3>
                    </div>
                    <div className="p-2">
                        <DataRow label="Real Name" value="HIDDEN" visible={false} />
                        <DataRow label="Exact Address" value="HIDDEN" visible={false} />
                        <DataRow label="Phone Number" value="HIDDEN" visible={false} />
                        <DataRow label="Files on Device" value="HIDDEN" visible={false} />
                        <DataRow label="Browsing History" value="HIDDEN" visible={false} />
                    </div>
                </div>
            </div>

            {/* Educational Content */}
            <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-blue-400">❓</span> Why can websites see this?
                        </h2>
                        <div className="prose prose-invert text-zinc-300">
                            <p>
                                When you visit any website, your browser engages in a conversation with the website's server.
                                To make sure the website looks right on your device and is delivered in your language, your browser
                                automatically sends a "User-Agent" string and other headers.
                            </p>
                            <p>
                                Additionally, websites can use JavaScript (code running in your browser) to ask for more details,
                                like your screen size or time zone, to improve your experience. While this is necessary for the modern
                                web to function, it can also be combined to create a "fingerprint" primarily used for tracking.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-purple-400">🛡️</span> How to protect your privacy
                        </h2>
                        <ul className="space-y-3 text-zinc-300">
                            <li className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800">
                                <span className="text-xl">🦊</span>
                                <div>
                                    <strong className="text-white block">Use a Privacy Browser</strong>
                                    Firefox, Brave, or Tor Browser resist fingerprinting better than standard browsers.
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800">
                                <span className="text-xl">🛑</span>
                                <div>
                                    <strong className="text-white block">Install Blockers</strong>
                                    uBlock Origin prevents tracking scripts from loading and collecting this data.
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800">
                                <span className="text-xl">🌍</span>
                                <div>
                                    <strong className="text-white block">Use a VPN</strong>
                                    A VPN hides your real IP address and location from websites.
                                </div>
                            </li>
                        </ul>
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
                            <Link href="/dns-error-checker" className="block p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                <div className="font-medium text-blue-400">DNS Leak Check ➜</div>
                                <div className="text-xs text-zinc-400 mt-1">Scan for DNS errors</div>
                            </Link>
                        </div>
                    </div>

                    {/* Citation Box for Researchers */}
                    <div className="p-5 bg-blue-900/10 border border-blue-800/30 rounded-xl">
                        <h3 className="font-semibold text-white mb-3">For Researchers</h3>
                        <p className="text-xs text-zinc-400 mb-3">
                            Cite this tool in your privacy research or articles.
                        </p>
                        <div className="p-3 bg-zinc-900 rounded border border-zinc-800 font-mono text-xs text-zinc-500 break-words select-all">
                            y4yes. (2025). What Websites See About You. Retrieved from https://y4yes.com/what-websites-see-about-you
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
