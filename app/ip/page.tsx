import { headers } from 'next/headers';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "What's My IP Address? Free IP Lookup Tool with Location Map | y4yes",
    description: 'Instantly find your public IP address, location, ISP, and network details. Free IP lookup tool with accurate geolocation map, IPv4/IPv6 support, and real-time detection. Check your IP now!',
    keywords: [
        'what is my ip',
        'my ip address',
        'check my ip',
        'find my ip',
        'ip lookup',
        'ip address lookup',
        'ip location',
        'public ip address',
        'my public ip',
        'show my ip',
        'ip geolocation',
        'ip checker',
        'ip address checker',
        "what's my ip address",
        'ip tracker',
        'ip location finder',
        'find ip address',
        'my ip location',
        'check ip address',
        'ip info',
        'ip address location',
        'ip geolocation lookup'
    ],
    openGraph: {
        title: "What's My IP Address? - Free IP Lookup Tool | y4yes",
        description: 'Instantly find your public IP address, location, and ISP information. Free IP lookup with geolocation map.',
        url: 'https://y4yes.com/ip',
        siteName: 'y4yes',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "What's My IP Address? - Free IP Lookup Tool",
        description: 'Instantly find your public IP address, location, and ISP information.',
    },
    alternates: {
        canonical: 'https://y4yes.com/ip'
    }
};

interface GeoData {
    country?: string;
    regionName?: string;
    city?: string;
    isp?: string;
    org?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    zip?: string;
}

async function getPublicIp() {
    const headersList = await headers();

    // Try multiple headers in order of preference
    let ip = headersList.get('cf-connecting-ip')
        || headersList.get('x-real-ip')
        || headersList.get('x-forwarded-for');

    // If x-forwarded-for contains multiple IPs, take the first one (real client)
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    // If no header or local IP, try external service
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
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
        // Using ip-api.com free service with lat/lon for map
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,org,lat,lon,timezone,zip`, {
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
                    lat: data.lat,
                    lon: data.lon,
                    timezone: data.timezone,
                    zip: data.zip,
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

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "IP Address Lookup Tool",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "description": "Free IP address lookup tool to find your public IP, location, and ISP information instantly."
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://y4yes.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "IP Lookup",
                        "item": "https://y4yes.com/ip"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is my IP address?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Your IP address is a unique numerical identifier assigned to your device when connected to the internet. It allows other computers and servers to communicate with your device."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I find my public IP address?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "You can find your public IP address by visiting this page, which automatically detects and displays your IP address along with location and ISP information."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What information can someone get from my IP address?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "From your IP address, someone can determine your approximate geographic location (city/region), your Internet Service Provider (ISP), and your timezone. However, your exact physical address and personal information cannot be determined from just your IP."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I hide my IP address?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, you can hide your IP address by using a VPN (Virtual Private Network), proxy server, or Tor browser. These tools mask your real IP address by routing your internet traffic through different servers."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What's the difference between IPv4 and IPv6?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "IPv4 uses a 32-bit address format (e.g., 192.168.1.1) providing about 4.3 billion addresses. IPv6 uses a 128-bit format (e.g., 2001:0db8::1) providing virtually unlimited addresses. IPv6 was created to solve IPv4 address exhaustion."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold">What's My IP Address?</h1>
                    <p className="text-zinc-400 text-lg">Instantly find your public IP address, location, and network details</p>
                </div>

                <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
                    <div className="text-sm text-zinc-500 uppercase tracking-wider font-medium">Your Public IP Address</div>
                    <div className="text-4xl md:text-6xl font-mono font-bold text-blue-400 break-all">
                        {ip}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <div className="text-sm text-zinc-500 mb-1">📍 Location</div>
                        <div className="text-lg font-medium">{location}</div>
                        {geoData.timezone && (
                            <div className="text-xs text-zinc-500 mt-1">{geoData.timezone}</div>
                        )}
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <div className="text-sm text-zinc-500 mb-1">🌐 ISP</div>
                        <div className="text-lg font-medium">{isp}</div>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <div className="text-sm text-zinc-500 mb-1">🗺️ IP Type</div>
                        <div className="text-lg font-medium">{ip.includes(':') ? 'IPv6' : 'IPv4'}</div>
                    </div>
                </div>

                {/* Map Display */}
                {geoData.lat && geoData.lon && (
                    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <h2 className="text-xl font-bold mb-4">📍 Your Approximate Location</h2>
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-zinc-700">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoData.lon - 0.5},${geoData.lat - 0.5},${geoData.lon + 0.5},${geoData.lat + 0.5}&layer=mapnik&marker=${geoData.lat},${geoData.lon}`}
                                style={{ border: 0 }}
                                title="IP Location Map"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            Note: Location is approximate based on your IP address and ISP data
                        </p>
                    </div>
                )}

                {/* FAQ Section - SEO Optimized */}
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">What is my IP address?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Your <strong>IP address</strong> (Internet Protocol address) is a unique numerical identifier assigned to your device when connected to the internet. It serves as your device's digital address, allowing other computers and servers to send data back to you. Think of it like a phone number for your internet connection - it identifies where data should be sent.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">How do I find my public IP address?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Finding your <strong>public IP address</strong> is simple - just visit this page and it will automatically detect and display your IP address along with your location and ISP information. You can also use command line tools like "curl ifconfig.me" or check your router's admin panel.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">What information can someone get from my IP address?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                From your IP address, someone can determine your approximate <strong>geographic location</strong> (city/region), your <strong>Internet Service Provider (ISP)</strong>, and your timezone. However, your exact physical address, name, phone number, or other personal information cannot be determined from just your IP address. IP geolocation is approximate and typically accurate to the city level.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Can I hide or change my IP address?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Yes, you can hide your real IP address using a <strong>VPN (Virtual Private Network)</strong>, proxy server, or Tor browser. These tools mask your actual IP by routing your internet traffic through different servers in other locations. <strong>VPNs</strong> are the most popular choice for privacy as they also encrypt your traffic for security.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">What's the difference between IPv4 and IPv6?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                <strong>IPv4</strong> uses a 32-bit address format (e.g., 192.168.1.1) providing about 4.3 billion possible addresses. <strong>IPv6</strong> uses a 128-bit format (e.g., 2001:0db8::1) providing virtually unlimited addresses (340 undecillion). IPv6 was created to solve the IPv4 address exhaustion problem as internet-connected devices multiplied globally.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Why does my IP address sometimes change?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Most home internet connections use <strong>dynamic IP addresses</strong>, which means your ISP assigns you a different IP address periodically or when you restart your router. This is more cost-effective for ISPs. Businesses often use <strong>static IP addresses</strong> that never change, which is useful for hosting servers or remote access.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">How accurate is IP geolocation?</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                <strong>IP geolocation</strong> is typically accurate to the city or region level (about 55-80% accuracy). The exact accuracy depends on the database used and how ISPs allocate IP addresses. Rural areas may show less accurate results. IP geolocation should never be relied upon for precise location tracking - GPS is required for that level of accuracy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Common Use Cases */}
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Common Use Cases for IP Lookup</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-blue-400 font-semibold mb-2">🔒 VPN Testing</div>
                            <p className="text-sm text-zinc-400">Verify if your VPN is working by checking if your IP address has changed to the VPN server's location.</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-blue-400 font-semibold mb-2">🖥️ Remote Access Setup</div>
                            <p className="text-sm text-zinc-400">Need your IP address to configure remote desktop, VPN access, or whitelist your IP for secure services.</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-blue-400 font-semibold mb-2">🔧 Network Troubleshooting</div>
                            <p className="text-sm text-zinc-400">Verify your IP address when diagnosing connectivity issues or configuring DNS settings.</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-blue-400 font-semibold mb-2">🛡️ Security & Firewall</div>
                            <p className="text-sm text-zinc-400">Whitelist your IP for server access, firewall rules, or implement IP-based access control.</p>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                    <h2 className="text-2xl font-bold text-white">IP Address Privacy & Security</h2>
                    <div className="space-y-4 text-zinc-300">
                        <p className="leading-relaxed">
                            Your <strong>IP address privacy</strong> is important for online security. While your IP alone doesn't reveal personal information, it can be used for tracking your browsing activity and approximating your location.
                        </p>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">Best Practices for IP Privacy:</h3>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">✓</span>
                                    <span><strong>Use a VPN</strong> when on public Wi-Fi or accessing sensitive information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">✓</span>
                                    <span><strong>Don't share your IP</strong> publicly on forums or social media</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">✓</span>
                                    <span><strong>Change your IP</strong> if you suspect it's been compromised by restarting your router</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">✓</span>
                                    <span><strong>Use HTTPS websites</strong> to encrypt your data even if your IP is visible</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Understanding IP Addresses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">IPv4 Address</h3>
                            <div className="space-y-2 text-zinc-300">
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Format:</strong> Four numbers (0-255) separated by dots
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Example:</strong> <code className="text-blue-400">192.168.1.1</code>
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Total Addresses:</strong> ~4.3 billion
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Status:</strong> Most common, nearly exhausted
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">IPv6 Address</h3>
                            <div className="space-y-2 text-zinc-300">
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Format:</strong> Eight groups of hexadecimal digits
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Example:</strong> <code className="text-purple-400">2001:0db8::1</code>
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Total Addresses:</strong> 340 undecillion
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <strong>Status:</strong> Future standard, growing adoption
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tools */}
                <div className="p-6 rounded-xl bg-blue-900/10 border border-blue-800/30">
                    <h3 className="text-lg font-semibold text-white mb-3">🔧 Related Network Tools</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a href="/speed-test" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                            <div className="text-2xl mb-1">🚀</div>
                            <div className="text-sm font-medium">Speed Test</div>
                        </a>
                        <a href="/ping" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                            <div className="text-2xl mb-1">📡</div>
                            <div className="text-sm font-medium">Ping Test</div>
                        </a>
                        <a href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                            <div className="text-2xl mb-1">🔍</div>
                            <div className="text-sm font-medium">DNS Lookup</div>
                        </a>
                        <a href="/whois" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                            <div className="text-2xl mb-1">📋</div>
                            <div className="text-sm font-medium">WHOIS</div>
                        </a>
                    </div>
                </div>

                <div className="text-center text-sm text-zinc-500">
                    <p>
                        <strong>Note:</strong> We use multiple detection methods to find your IP address.
                        If you're behind a proxy or VPN, this will show that service's IP address instead of your original IP.
                    </p>
                </div>
            </div>
        </>
    );
}
