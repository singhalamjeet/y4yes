import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Site Map – All Network Tools & Pages | y4yes',
    description: 'Complete sitemap of y4yes network tools and pages. Browse all DNS, IP, security, and diagnostic tools available on our platform.',
};

export default function SitemapPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Site Map</h1>
                <p className="text-zinc-400">Browse all tools and pages available on y4yes</p>
            </div>

            {/* Network Tools Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Network Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dns" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">DNS Lookup</h3>
                        <p className="text-sm text-zinc-400 mt-1">Query DNS records (A, MX, CNAME, TXT, NS, SOA)</p>
                    </Link>
                    <Link href="/ip" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">IP Lookup</h3>
                        <p className="text-sm text-zinc-400 mt-1">Discover your public IP address and geolocation</p>
                    </Link>
                    <Link href="/port-scan" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Port Scanner</h3>
                        <p className="text-sm text-zinc-400 mt-1">Scan ports to identify open services</p>
                    </Link>
                    <Link href="/ping" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Ping Test</h3>
                        <p className="text-sm text-zinc-400 mt-1">Test server reachability and response times</p>
                    </Link>
                    <Link href="/ssl-check" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">SSL Checker</h3>
                        <p className="text-sm text-zinc-400 mt-1">Verify SSL certificate validity and expiration</p>
                    </Link>
                    <Link href="/whois" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">WHOIS Lookup</h3>
                        <p className="text-sm text-zinc-400 mt-1">Check domain registration information</p>
                    </Link>
                    <Link href="/traceroute" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Traceroute</h3>
                        <p className="text-sm text-zinc-400 mt-1">Trace the network path to a destination</p>
                    </Link>
                    <Link href="/speed-test" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Speed Test</h3>
                        <p className="text-sm text-zinc-400 mt-1">Test your download and upload speeds</p>
                    </Link>
                    <Link href="/url-encode" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">URL Encoder/Decoder</h3>
                        <p className="text-sm text-zinc-400 mt-1">Encode or decode URLs for safe transmission</p>
                    </Link>
                    <Link href="/supertool" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">SuperTool (All-in-One)</h3>
                        <p className="text-sm text-zinc-400 mt-1">Access 20+ network tools from one interface</p>
                    </Link>
                </div>
            </section>

            {/* Research & Privacy Tools Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Research & Privacy Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/browser-fingerprint" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Browser Fingerprint Test</h3>
                        <p className="text-sm text-zinc-400 mt-1">Check your browser uniqueness and privacy score</p>
                    </Link>
                    <Link href="/dns-error-checker" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">DNS Error Checker</h3>
                        <p className="text-sm text-zinc-400 mt-1">Fix DNS_PROBE_FINISHED_NXDOMAIN and other errors</p>
                    </Link>
                    <Link href="/ip-location-accuracy" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">IP Location Accuracy</h3>
                        <p className="text-sm text-zinc-400 mt-1">Compare geolocation accuracy across databases</p>
                    </Link>
                    <Link href="/ipv6-adoption" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">IPv6 Adoption Dashboard</h3>
                        <p className="text-sm text-zinc-400 mt-1">Live global and country-level IPv6 statistics</p>
                    </Link>
                    <Link href="/what-websites-see-about-you" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">What Websites See About You</h3>
                        <p className="text-sm text-zinc-400 mt-1">Live privacy check showing exposed browser data</p>
                    </Link>
                    <Link href="/what-websites-see-about-you?tab=inspect" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-purple-400">Website Public Inspector</h3>
                        <p className="text-sm text-zinc-400 mt-1">Analyze any website's HTTP headers, DNS, and security</p>
                    </Link>
                </div>
            </section >

            {/* Company Pages */}
            < section className="space-y-6" >
                <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Company</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/about" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">About Us</h3>
                        <p className="text-sm text-zinc-400 mt-1">Learn about y4yes and our mission</p>
                    </Link>
                    <Link href="/contact" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Contact</h3>
                        <p className="text-sm text-zinc-400 mt-1">Get in touch with our team</p>
                    </Link>
                    <Link href="/faq" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">FAQ</h3>
                        <p className="text-sm text-zinc-400 mt-1">Frequently asked questions</p>
                    </Link>
                    <Link href="/blog" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Blog</h3>
                        <p className="text-sm text-zinc-400 mt-1">Articles and guides about network tools</p>
                    </Link>
                </div>
            </section >

            {/* Legal Pages */}
            < section className="space-y-6" >
                <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Legal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/privacy" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Privacy Policy</h3>
                        <p className="text-sm text-zinc-400 mt-1">How we handle your data</p>
                    </Link>
                    <Link href="/terms" className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
                        <h3 className="font-semibold text-white group-hover:text-blue-400">Terms of Service</h3>
                        <p className="text-sm text-zinc-400 mt-1">Terms and conditions of use</p>
                    </Link>
                </div>
            </section >

            {/* XML Sitemap */}
            < section className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800" >
                <h2 className="text-xl font-bold text-white mb-2">For Search Engines</h2>
                <p className="text-zinc-400 text-sm mb-3">
                    Looking for the XML sitemap? You can find it at:
                </p>
                <a href="/sitemap.xml" className="text-blue-400 hover:text-blue-300 font-mono text-sm">
                    https://y4yes.com/sitemap.xml
                </a>
            </section >
        </div >
    );
}
