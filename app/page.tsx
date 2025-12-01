import { ToolCard } from "@/components/ToolCard";
import { NetworkDashboard } from "@/components/NetworkDashboard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Network Tools Suite - DNS, Ping, SSL & More",
  description: "Free online network tools for developers. Check your IP, test internet speed, lookup DNS records, scan ports, and more.",
};

const tools = [
  {
    title: "🔧 SuperTool",
    description: "All network tools in one place - MX Lookup, DNS, WHOIS, SSL, Ping, and 20+ more tools!",
    href: "/supertool",
  },
  {
    title: "Speed Test",
    description: "Measure your internet connection speed, latency, and jitter.",
    href: "/speed-test",
  },
  {
    title: "WHOIS Lookup",
    description: "Find registration information for any domain name.",
    href: "/whois",
  },
  {
    title: "Ping Test",
    description: "Check the reachability and response time of a server or website.",
    href: "/ping",
  },
  {
    title: "DNS Lookup",
    description: "Query DNS records (A, MX, CNAME, TXT) for any domain.",
    href: "/dns",
  },
  {
    title: "Port Scanner",
    description: "Scan a server for open ports to identify running services.",
    href: "/port-scan",
  },
  {
    title: "SSL Checker",
    description: "Verify SSL certificate validity, issuer, and expiration date.",
    href: "/ssl-check",
  },
  {
    title: "Traceroute",
    description: "Trace the path packets take to reach a destination.",
    href: "/traceroute",
  },
  {
    title: "URL Encoder/Decoder",
    description: "Encode or decode URLs to ensure they are safe for transmission.",
    href: "/url-encode",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="text-center space-y-2 py-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Network Tools Suite
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Simple, fast, and secure utilities for developers and network administrators.
        </p>
      </section>

      <NetworkDashboard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}

