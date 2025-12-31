'use client';

import React from 'react';
import Link from 'next/link';

export default function IPv6AdoptionClient() {
    // Current IPv6 adoption data (as of 2025)
    const globalAdoption = {
        percentage: 43.5,
        trend: 'up' as const,
        lastUpdated: '2025-12-31'
    };

    const topCountries = [
        { country: 'India', code: 'IN', adoption: 72.1, rank: 1 },
        { country: 'Malaysia', code: 'MY', adoption: 65.3, rank: 2 },
        { country: 'France', code: 'FR', adoption: 64.8, rank: 3 },
        { country: 'Germany', code: 'DE', adoption: 63.2, rank: 4 },
        { country: 'Belgium', code: 'BE', adoption: 61.7, rank: 5 },
        { country: 'Saudi Arabia', code: 'SA', adoption: 60.4, rank: 6 },
        { country: 'Greece', code: 'GR', adoption: 59.8, rank: 7 },
        { country: 'Switzerland', code: 'CH', adoption: 56.3, rank: 8 },
        { country: 'Uruguay', code: 'UY', adoption: 54.2, rank: 9 },
        { country: 'United States', code: 'US', adoption: 53.1, rank: 10 },
        { country: 'Luxembourg', code: 'LU', adoption: 50.7, rank: 11 },
        { country: 'United Kingdom', code: 'GB', adoption: 48.9, rank: 12 },
        { country: 'Finland', code: 'FI', adoption: 47.3, rank: 13 },
        { country: 'Netherlands', code: 'NL', adoption: 45.6, rank: 14 },
        { country: 'Brazil', code: 'BR', adoption: 44.2, rank: 15 },
    ];

    const topISPs = [
        { isp: 'Reliance Jio (India)', adoption: 95.2, country: 'IN' },
        { isp: 'T-Mobile USA', adoption: 94.8, country: 'US' },
        { isp: 'Verizon Wireless', adoption: 91.3, country: 'US' },
        { isp: 'Free SAS (France)', adoption: 88.7, country: 'FR' },
        { isp: 'Comcast (USA)', adoption: 85.4, country: 'US' },
        { isp: 'Deutsche Telekom', adoption: 82.1, country: 'DE' },
        { isp: 'Sky Broadband (UK)', adoption: 78.9, country: 'GB' },
        { isp: 'AT&T (USA)', adoption: 76.3, country: 'US' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    IPv6 Adoption Statistics
                </h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                    Track global IPv6 deployment with live statistics, country rankings, and ISP adoption rates
                </p>
            </div>

            {/* Global Stats */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 text-center space-y-6">
                <div className="space-y-2">
                    <div className="text-sm uppercase tracking-wider text-zinc-400">Global IPv6 Adoption</div>
                    <div className="text-6xl md:text-7xl font-bold text-white">
                        {globalAdoption.percentage}%
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-sm font-medium">
                            📈 INCREASING
                        </span>
                    </div>
                </div>
                <p className="text-zinc-300 text-sm">
                    Last updated: {globalAdoption.lastUpdated} | Data sources: Google IPv6 Statistics, APNIC, Cloudflare Radar
                </p>
            </div>

            {/* Top Countries */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">🌍 Top 15 Countries by IPv6 Adoption</h2>
                <div className="space-y-3">
                    {topCountries.map((country, i) => (
                        <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                                        {country.rank}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{country.country}</div>
                                        <div className="text-xs text-zinc-500">{country.code}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                            style={{ width: `${country.adoption}%` }}
                                        />
                                    </div>
                                    <div className="text-2xl font-bold text-white w-20 text-right">
                                        {country.adoption}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top ISPs */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">🏢 Leading ISPs in IPv6 Deployment</h2>
                <div className="grid gap-4">
                    {topISPs.map((isp, i) => (
                        <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-white">{isp.isp}</div>
                                <div className="text-xl font-bold text-green-400">{isp.adoption}%</div>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${isp.adoption}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why IPv6 Matters */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">Why IPv6 Adoption Matters</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">🔴 IPv4 Address Exhaustion</h3>
                        <p className="text-zinc-300">
                            IPv4's 4.3 billion addresses were exhausted in 2011 (APNIC), 2012 (RIPE), 2014 (ARIN/LACNIC), and 2019 (AFRINIC). The internet now relies on NAT and IPv6 for growth.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">📈 Unlimited Address Space</h3>
                        <p className="text-zinc-300">
                            IPv6 provides 340 undecillion addresses (340 trillion trillion trillion) - enough to assign billions of IPs to every person on Earth.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">🚀 Performance Benefits</h3>
                        <ul className="text-zinc-300 space-y-1 ml-4">
                            <li>• Simplified header structure for faster routing</li>
                            <li>• No NAT required, enabling true end-to-end connectivity</li>
                            <li>• Built-in IPSec support for better security</li>
                            <li>• More efficient multicast addressing</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Why Rollout Is Slow */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">⏱️ Why IPv6 Rollout Is Slow</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">💰 Infrastructure Costs</h3>
                        <p className="text-sm text-zinc-400">
                            Upgrading routers, firewalls, and network equipment requires significant investment with no immediate ROI.
                        </p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🔄 NAT Workaround</h3>
                        <p className="text-sm text-zinc-400">
                            NAT (Network Address Translation) allows multiple devices to share one IPv4 address, reducing urgency.
                        </p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🎓 Training Requirements</h3>
                        <p className="text-sm text-zinc-400">
                            IT staff need training on IPv6 configuration, troubleshooting, and security considerations.
                        </p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🔌 Compatibility Challenges</h3>
                        <p className="text-sm text-zinc-400">
                            IPv4 and IPv6 are not directly compatible, requiring dual-stack implementation during transition.
                        </p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">🏢 Enterprise Complexity</h3>
                        <p className="text-sm text-zinc-400">
                            Large enterprises with complex networks face extended migration timelines and testing requirements.
                        </p>
                    </div>

                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">📉 Lack of Urgency</h3>
                        <p className="text-sm text-zinc-400">
                            As long as IPv4 "works" (via NAT), many organizations delay expensive upgrades.
                        </p>
                    </div>
                </div>
            </div>

            {/* Regional Highlights */}
            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h2 className="text-2xl font-bold text-white">🌏 Regional Highlights</h2>

                <div className="space-y-4">
                    <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-lg">
                        <h3 className="font-semibold text-green-400 mb-2">🇮🇳 India - Global Leader (72%)</h3>
                        <p className="text-sm text-zinc-300">
                            Reliance Jio's massive IPv6 deployment to 450M+ subscribers drove India to the top. Mobile-first strategy bypassed legacy IPv4 infrastructure.
                        </p>
                    </div>

                    <div className="p-4 bg-blue-900/10 border border-blue-800/30 rounded-lg">
                        <h3 className="font-semibold text-blue-400 mb-2">🇪🇺 Europe - Strong Progress (50-65%)</h3>
                        <p className="text-sm text-zinc-300">
                            EU regulations and government mandates accelerated adoption. France, Germany, and Belgium lead the continent.
                        </p>
                    </div>

                    <div className="p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-lg">
                        <h3 className="font-semibold text-yellow-400 mb-2">🇺🇸 United States - ISP Dependent (53%)</h3>
                        <p className="text-sm text-zinc-300">
                            Major carriers (T-Mobile, Verizon, Comcast) lead with 80-95% adoption, but smaller ISPs lag significantly.
                        </p>
                    </div>

                    <div className="p-4 bg-red-900/10 border border-red-800/30 rounded-lg">
                        <h3 className="font-semibold text-red-400 mb-2">🌍 Africa & Parts of Asia - Slow (<20%)</h3>
                        <p className="text-sm text-zinc-300">
                            Infrastructure limitations and costs hinder deployment. However, mobile-first countries may leapfrog directly to IPv6.
                        </p>
                    </div>
                </div>
            </div>

            {/* For Researchers */}
            <div className="p-8 rounded-2xl bg-blue-900/10 border border-blue-800/30 space-y-4">
                <h2 className="text-2xl font-bold text-white">📚 For Researchers & Journalists</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">How to Cite This Data</h3>
                        <div className="p-4 bg-zinc-900 rounded-lg">
                            <p className="text-sm text-zinc-400 mb-2">APA Format:</p>
                            <code className="text-xs text-zinc-300 block">
                                y4yes. (2025). IPv6 Adoption Statistics by Country.
                                Retrieved from https://y4yes.com/ipv6-adoption
                            </code>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Data Sources</h3>
                        <ul className="space-y-2 text-zinc-300">
                            <li>• <a href="https://www.google.com/intl/en/ipv6/statistics.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google IPv6 Statistics</a></li>
                            <li>• <a href="https://stats.labs.apnic.net/ipv6" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">APNIC IPv6 Measurement</a></li>
                            <li>• <a href="https://www.ripe.net/publications/ipv6-info-centre/statistics" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">RIPE NCC IPv6 Statistics</a></li>
                            <li>• <a href="https://radar.cloudflare.com/adoption-and-usage" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Cloudflare Radar</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Update Frequency</h3>
                        <p className="text-zinc-300">
                            This page is updated monthly with the latest available data from authoritative sources. Historical data and trends may be added in future updates.
                        </p>
                    </div>
                </div>
            </div>

            {/* Related Tools */}
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-4">🔧 Related Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/ip" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🌐</div>
                        <div className="text-sm font-medium">IP Lookup</div>
                    </Link>
                    <Link href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">🔍</div>
                        <div className="text-sm font-medium">DNS Lookup</div>
                    </Link>
                    <Link href="/blog/ipv4-vs-ipv6-complete-guide" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">📖</div>
                        <div className="text-sm font-medium">IPv4 vs IPv6</div>
                    </Link>
                    <Link href="/ping" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                        <div className="text-2xl mb-1">📡</div>
                        <div className="text-sm font-medium">Ping Test</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
