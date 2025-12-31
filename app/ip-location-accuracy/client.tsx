'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface GeoLocation {
    source: string;
    country?: string;
    region?: string;
    city?: string;
    isp?: string;
    lat?: number;
    lon?: number;
}

export default function IPLocationClient() {
    const [loading, setLoading] = useState(true);
    const [ip, setIp] = useState('');
    const [locations, setLocations] = useState<GeoLocation[]>([]);
    const [agreement, setAgreement] = useState({ country: 0, city: 0 });

    useEffect(() => {
        detectIPAndLocations();
    }, []);

    async function detectIPAndLocations() {
        setLoading(true);

        try {
            // Get IP first
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            const userIP = ipData.ip;
            setIp(userIP);

            // Query multiple sources
            const results: GeoLocation[] = [];

            // Source 1: ip-api.com
            try {
                const res1 = await fetch(`http://ip-api.com/json/${userIP}`);
                const data1 = await res1.json();
                results.push({
                    source: 'ip-api.com (Free)',
                    country: data1.country,
                    region: data1.regionName,
                    city: data1.city,
                    isp: data1.isp,
                    lat: data1.lat,
                    lon: data1.lon
                });
            } catch (e) {
                results.push({ source: 'ip-api.com (Free)', country: 'Error' });
            }

            // Source 2: ipwhois.app
            try {
                const res2 = await fetch(`https://ipwhois.app/json/${userIP}`);
                const data2 = await res2.json();
                results.push({
                    source: 'ipwhois.app',
                    country: data2.country,
                    region: data2.region,
                    city: data2.city,
                    isp: data2.isp,
                    lat: data2.latitude,
                    lon: data2.longitude
                });
            } catch (e) {
                results.push({ source: 'ipwhois.app', country: 'Error' });
            }

            // Source 3: ipapi.co  
            try {
                const res3 = await fetch(`https://ipapi.co/${userIP}/json/`);
                const data3 = await res3.json();
                results.push({
                    source: 'ipapi.co',
                    country: data3.country_name,
                    region: data3.region,
                    city: data3.city,
                    isp: data3.org,
                    lat: data3.latitude,
                    lon: data3.longitude
                });
            } catch (e) {
                results.push({ source: 'ipapi.co', country: 'Error' });
            }

            setLocations(results);

            // Calculate agreement
            const validResults = results.filter(r => r.country && r.country !== 'Error');
            if (validResults.length > 0) {
                const countryMode = getMostCommon(validResults.map(r => r.country));
                const cityMode = getMostCommon(validResults.map(r => r.city));

                const countryAgreement = validResults.filter(r => r.country === countryMode).length / validResults.length * 100;
                const cityAgreement = validResults.filter(r => r.city === cityMode).length / validResults.length * 100;

                setAgreement({ country: countryAgreement, city: cityAgreement });
            }

        } catch (error) {
            console.error('Error fetching geo data:', error);
        }

        setLoading(false);
    }

    function getMostCommon(arr: (string | undefined)[]): string | undefined {
        const filtered = arr.filter(Boolean);
        if (filtered.length === 0) return undefined;

        const counts: { [key: string]: number } = {};
        filtered.forEach(item => {
            if (item) counts[item] = (counts[item] || 0) + 1;
        });

        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    IP Location Accuracy Test
                </h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                    Compare IP geolocation accuracy across multiple databases. See why city-level IP tracking is unreliable.
                </p>
            </div>

            {loading ? (
                <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="text-lg text-zinc-400">Querying multiple GeoIP databases...</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30">
                        <div className="text-center space-y-2">
                            <div className="text-sm uppercase tracking-wider text-zinc-400">Your IP</div>
                            <div className="text-3xl font-bold text-white">{ip}</div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div>
                                    <div className="text-sm text-zinc-400">Country Agreement</div>
                                    <div className={`text-2xl font-bold ${agreement.country > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {agreement.country.toFixed(0)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-zinc-400">City Agreement</div>
                                    <div className={`text-2xl font-bold ${agreement.city > 70 ? 'text-green-400' : agreement.city > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {agreement.city.toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Comparison Across Databases</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-zinc-700">
                                <thead>
                                    <tr className="bg-zinc-800">
                                        <th className="border border-zinc-700 p-3 text-left">Source</th>
                                        <th className="border border-zinc-700 p-3 text-left">Country</th>
                                        <th className="border border-zinc-700 p-3 text-left">Region</th>
                                        <th className="border border-zinc-700 p-3 text-left">City</th>
                                        <th className="border border-zinc-700 p-3 text-left">ISP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((loc, i) => (
                                        <tr key={i} className="hover:bg-zinc-900/50">
                                            <td className="border border-zinc-700 p-3 font-medium">{loc.source}</td>
                                            <td className="border border-zinc-700 p-3">{loc.country || '—'}</td>
                                            <td className="border border-zinc-700 p-3">{loc.region || '—'}</td>
                                            <td className="border border-zinc-700 p-3">{loc.city || '—'}</td>
                                            <td className="border border-zinc-700 p-3 text-sm">{loc.isp || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Educational Content */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">How IP Geolocation Works</h2>
                <p className="text-zinc-300">
                    IP geolocation databases map IP address ranges to physical locations based on registration data from Regional Internet Registries (RIRs) and ISP information. However, this mapping is imperfect.
                </p>
                <p className="text-zinc-300">
                    ISPs often assign IP addresses from centralized pools, meaning your IP might be registered to a data center location hundreds of miles away from your actual location.
                </p>
            </div>

            <div className=" p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">📊 Real Accuracy Statistics</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                        <div className="text-lg font-semibold text-green-400 mb-1">Country Level</div>
                        <div className="text-3xl font-bold text-white">95-99%</div>
                        <div className="text-sm text-zinc-400 mt-2">Highly reliable for most IPs</div>
                    </div>
                    <div className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                        <div className="text-lg font-semibold text-yellow-400 mb-1">Region/State</div>
                        <div className="text-3xl font-bold text-white">80-95%</div>
                        <div className="text-sm text-zinc-400 mt-2">Generally accurate</div>
                    </div>
                    <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                        <div className="text-lg font-semibold text-red-400 mb-1">City Level</div>
                        <div className="text-3xl font-bold text-white">50-80%</div>
                        <div className="text-sm text-zinc-400 mt-2">Often inaccurate by 100+ miles</div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">❌ Common Myths Debunked</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                            <div className="font-semibold text-white">"Police can find your exact address from IP"</div>
                            <div className="text-sm text-zinc-400">False. They need ISP cooperation (requires legal warrant) to get subscriber info.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                            <div className="font-semibold text-white">"IP shows exact GPS coordinates"</div>
                            <div className="text-sm text-zinc-400">False. Coordinates shown are approximate, usually ISP location or city center.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <div className="font-semibold text-white">"Country is usually correct"</div>
                            <div className="text-sm text-zinc-400">True. Country-level accuracy is 95-99% for most IPs.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <div className="font-semibold text-white">"VPNs change apparent location"</div>
                            <div className="text-sm text-zinc-400">True. VPNs route traffic through servers in different locations.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-4">🔧 Related Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/ip" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🌐</div>
                        <div className="text-sm font-medium">IP Lookup</div>
                    </Link>
                    <Link href="/whois" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">📋</div>
                        <div className="text-sm font-medium">WHOIS</div>
                    </Link>
                    <Link href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🔍</div>
                        <div className="text-sm font-medium">DNS Lookup</div>
                    </Link>
                    <Link href="/browser-fingerprint" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🔐</div>
                        <div className="text-sm font-medium">Fingerprint</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
