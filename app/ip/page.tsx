import { headers } from 'next/headers';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "What's My IP Address? - Check Public IP & Location",
    description: 'Instantly check your public IP address, ISP, and location details. Fast, secure, and no-logs IP checker tool.',
    keywords: ['my ip', 'what is my ip', 'ip address check', 'ip location', 'isp check', 'public ip'],
};

interface GeoData {
    country?: string;
    regionName?: string;
    city?: string;
    isp?: string;
    org?: string;
}

async function getPublicIp() {
    const headersList = await headers();
    let ip = headersList.get('x-forwarded-for');

    // If no header or local IP, try external service
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
        try {
            const res = await fetch('https://api.ipify.org?format=json', { next: { revalidate: 0 } });
            if (res.ok) {
                const data = await res.json();
                ip = data.ip;
            }
        } catch (e) {
            console.error('Failed to fetch public IP:', e);
        }
    }

    return ip || 'Unknown';
}

async function getGeoData(ip: string): Promise<GeoData> {
    if (ip === 'Unknown') return {};

    try {
        // Using ip-api.com free service (no API key needed)
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success') {
                return {
                    country: data.country,
                    regionName: data.regionName,
                    city: data.city,
                    isp: data.isp,
                    org: data.org,
                };
            }
        }
    } catch (e) {
        console.error('Failed to fetch geo data:', e);
    }

    return {};
}

export default async function IpPage() {
    const ip = await getPublicIp();
    const geoData = await getGeoData(ip);

    const location = geoData.city || geoData.regionName || geoData.country
        ? `${geoData.city ? geoData.city + ', ' : ''}${geoData.regionName ? geoData.regionName + ', ' : ''}${geoData.country || ''}`
        : 'Unknown';

    const isp = geoData.isp || geoData.org || 'Unknown';

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">What's My Public IP?</h1>
                <p className="text-zinc-400">Your public IP address details.</p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
                <div className="text-sm text-zinc-500 uppercase tracking-wider font-medium">Your IP Address</div>
                <div className="text-4xl md:text-6xl font-mono font-bold text-blue-400 break-all">
                    {ip}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <div className="text-sm text-zinc-500 mb-1">Location</div>
                    <div className="text-lg font-medium">{location}</div>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <div className="text-sm text-zinc-500 mb-1">ISP</div>
                    <div className="text-lg font-medium">{isp}</div>
                </div>
            </div>

            <div className="text-center text-sm text-zinc-500">
                <p>Note: We use multiple methods to detect your IP. If you are behind a proxy, this may show the proxy's IP.</p>
            </div>

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is My IP Address?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        Your IP Address (Internet Protocol Address) is a unique numerical identifier assigned to your device when connected to the internet. It serves as your device's address, allowing other computers and servers to send data back to you. This tool instantly displays your public IP address along with your location and Internet Service Provider (ISP) information.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Remote Access Setup:</strong> Need your IP address to configure remote desktop or VPN access</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Troubleshooting:</strong> Verify your IP address when diagnosing network connectivity issues</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Server Configuration:</strong> Whitelist your IP for server access or firewall rules</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Privacy Check:</strong> Verify if your VPN is working by checking if your IP changed</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Understanding Your IP Information</h3>
                    <div className="space-y-2">
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">IP Address:</strong> <span className="text-zinc-400">Your unique identifier on the internet</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">Location:</strong> <span className="text-zinc-400">Approximate geographic location (city/region/country)</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <strong className="text-white">ISP:</strong> <span className="text-zinc-400">Your Internet Service Provider (company providing internet access)</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">IPv4 vs IPv6</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="font-medium text-white mb-2">IPv4</div>
                            <div className="text-sm text-zinc-400">Format: 192.168.1.1 (4 numbers)</div>
                            <div className="text-sm text-zinc-400">Most common address type</div>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="font-medium text-white mb-2">IPv6</div>
                            <div className="text-sm text-zinc-400">Format: 2001:0db8::1 (hexadecimal)</div>
                            <div className="text-sm text-zinc-400">Newer, more addresses available</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
