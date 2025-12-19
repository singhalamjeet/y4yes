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
        <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 px-6 py-3 min-h-[160px]">
            {/* Heading */}
            <div className="text-center mb-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Public IP</h3>
            </div>

            {scanning ? (
                <div className="space-y-3 py-1">
                    {/* Skeleton for IP */}
                    <div className="space-y-1">
                        <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    {/* Skeleton for ISP */}
                    <div className="space-y-1">
                        <div className="h-3 w-10 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    {/* Skeleton for Location */}
                    <div className="space-y-1">
                        <div className="h-3 w-14 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
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
