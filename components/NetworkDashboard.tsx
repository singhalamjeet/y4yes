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

export function NetworkDashboard() {
    const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            setScanning(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                // Use the general endpoint that auto-detects IP version
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    setIpInfo(data);
                } else {
                    throw new Error('API failed');
                }
            } catch (e) {
                console.error('Failed to fetch IP info:', e);
                // Fallback: try to at least get the IP address
                try {
                    const ipRes = await fetch('https://api.ipify.org?format=json');
                    if (ipRes.ok) {
                        const ipData = await ipRes.json();
                        setIpInfo({ ip: ipData.ip });
                    }
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                }
            } finally {
                setScanning(false);
            }
        };

        fetchInfo();
    }, []);

    return (
        <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 px-6 py-3">
            {/* Heading */}
            <div className="text-center mb-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Public IP</h3>
            </div>

            {scanning ? (
                <div className="flex items-center justify-center gap-3 py-2">
                    <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-800"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-zinc-400 text-sm">Detecting Network...</div>
                </div>
            ) : ipInfo ? (
                <div className="text-center space-y-2">
                    {/* IP Address */}
                    <div>
                        <span className="text-xs font-semibold text-zinc-500 uppercase">IP: </span>
                        <span className="font-mono font-bold text-white break-all">{ipInfo.ip}</span>
                    </div>

                    {/* Provider */}
                    {ipInfo.org && (
                        <div>
                            <span className="text-xs font-semibold text-zinc-500 uppercase">ISP: </span>
                            <span className="font-medium text-zinc-300">{ipInfo.org.split(' ')[0]}</span>
                        </div>
                    )}

                    {/* Location */}
                    {ipInfo.city && ipInfo.country_name && (
                        <div>
                            <span className="text-xs font-semibold text-zinc-500 uppercase">Location: </span>
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
        </div>
    );
}
