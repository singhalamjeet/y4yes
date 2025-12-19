import Link from 'next/link';

interface Tool {
    name: string;
    href: string;
    description: string;
}

interface RelatedToolsProps {
    tools: Tool[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
    if (tools.length === 0) return null;

    return (
        <section className="mt-16 pt-8 border-t border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group"
                    >
                        <h3 className="font-semibold text-white group-hover:text-blue-400 mb-2">
                            {tool.name}
                        </h3>
                        <p className="text-sm text-zinc-400">{tool.description}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// Predefined related tools for each page
export const relatedToolsMap: Record<string, Tool[]> = {
    dns: [
        { name: 'WHOIS Lookup', href: '/whois', description: 'Check domain registration details' },
        { name: 'IP Lookup', href: '/ip', description: 'Find your public IP address' },
        { name: 'Ping Test', href: '/ping', description: 'Test server reachability' },
    ],
    ip: [
        { name: 'Port Scanner', href: '/port-scan', description: 'Scan for open ports' },
        { name: 'Ping Test', href: '/ping', description: 'Check server response time' },
        { name: 'Traceroute', href: '/traceroute', description: 'Trace network path' },
    ],
    'port-scan': [
        { name: 'Ping Test', href: '/ping', description: 'Test server connectivity' },
        { name: 'SSL Checker', href: '/ssl-check', description: 'Verify SSL certificates' },
        { name: 'Traceroute', href: '/traceroute', description: 'Track network hops' },
    ],
    ping: [
        { name: 'Traceroute', href: '/traceroute', description: 'Trace packet route' },
        { name: 'Speed Test', href: '/speed-test', description: 'Test internet speed' },
        { name: 'Port Scanner', href: '/port-scan', description: 'Check port status' },
    ],
    'ssl-check': [
        { name: 'DNS Lookup', href: '/dns', description: 'Query DNS records' },
        { name: 'WHOIS Lookup', href: '/whois', description: 'Domain registration info' },
        { name: 'Port Scanner', href: '/port-scan', description: 'Scan open ports' },
    ],
    whois: [
        { name: 'DNS Lookup', href: '/dns', description: 'Check DNS propagation' },
        { name: 'SSL Checker', href: '/ssl-check', description: 'Verify SSL status' },
        { name: 'IP Lookup', href: '/ip', description: 'Check IP geolocation' },
    ],
    traceroute: [
        { name: 'Ping Test', href: '/ping', description: 'Test connectivity' },
        { name: 'DNS Lookup', href: '/dns', description: 'Query DNS records' },
        { name: 'IP Lookup', href: '/ip', description: 'Find IP information' },
    ],
    'speed-test': [
        { name: 'Ping Test', href: '/ping', description: 'Check latency' },
        { name: 'Traceroute', href: '/traceroute', description: 'Analyze route' },
        { name: 'DNS Lookup', href: '/dns', description: 'Test DNS resolution' },
    ],
};
