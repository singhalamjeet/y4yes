import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-black py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Network Tools</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/dns" className="hover:text-blue-400 transition-colors">DNS Lookup</Link></li>
                            <li><Link href="/ip" className="hover:text-blue-400 transition-colors">IP Lookup</Link></li>
                            <li><Link href="/port-scan" className="hover:text-blue-400 transition-colors">Port Scanner</Link></li>
                            <li><Link href="/ping" className="hover:text-blue-400 transition-colors">Ping Test</Link></li>
                            <li><Link href="/ssl-check" className="hover:text-blue-400 transition-colors">SSL Checker</Link></li>
                            <li><Link href="/whois" className="hover:text-blue-400 transition-colors">WHOIS Lookup</Link></li>
                            <li><Link href="/traceroute" className="hover:text-blue-400 transition-colors">Traceroute</Link></li>
                            <li><Link href="/speed-test" className="hover:text-blue-400 transition-colors">Speed Test</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Product</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/supertool" className="hover:text-blue-400 transition-colors">SuperTool</Link></li>
                            <li><Link href="/sitemap-page" className="hover:text-blue-400 transition-colors">Sitemap</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Legal</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-800 text-center text-zinc-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} y4yes.com. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
