import { headers } from 'next/headers';

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
        </div>
    );
}
