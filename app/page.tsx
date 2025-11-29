import { ToolCard } from "@/components/ToolCard";

const tools = [
  {
    title: "🔧 SuperTool",
    description: "All network tools in one place - MX Lookup, DNS, WHOIS, SSL, Ping, and 20+ more tools!",
    href: "/supertool",
  },
  {
    title: "What's My IP",
    description: "Check your public IPv4 and IPv6 address along with ISP and location details.",
    href: "/ip",
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
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Network Tools Suite
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Simple, fast, and secure utilities for developers and network administrators.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}

