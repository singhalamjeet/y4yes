import { ToolCard } from "@/components/ToolCard";
import { HomeSpeedTest } from "@/components/HomeSpeedTest";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Network Tools Suite – DNS, IP, Port Scanner | y4yes",
  description: "Access 10+ free network tools: DNS Lookup, IP Checker, Port Scanner, Ping Test, and SSL Checker. Fast, secure, no registration required.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is y4yes Network Tools Suite?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "y4yes is a free, secure, and all-in-one network utility suite designed for developers and network administrators. It combines essential tools like DNS Lookup, Port Scanning, SSL Verification, and Whois Lookup."
            }
          },
          {
            "@type": "Question",
            "name": "How can I check if my DNS records are propagating correctly?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can use the y4yes DNS Lookup tool to instantly query A, MX, CNAME, and TXT records simultaneously to verify global propagation."
            }
          },
          {
            "@type": "Question",
            "name": "Is checking my IP address or scanning ports on y4yes safe?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. y4yes operates as a client-side optimized tool suite. We do not log your sensitive query data during Ping Tests, Traceroutes, or Port Scans."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="text-center space-y-2 py-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Network Tools Suite
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Simple, fast, and secure utilities for developers and network administrators.
        </p>
      </section>

      <HomeSpeedTest />


      <h2 className="sr-only">Available Network Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>

      <section id="faq-section" className="max-w-4xl mx-auto mt-16 mb-8 space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
          Frequently Asked Questions about Network Utilities
        </h2>

        <div className="space-y-6">
          <div className="faq-item space-y-2">
            <h3 className="text-xl font-semibold text-white">What is y4yes Network Tools Suite?</h3>
            <p className="text-zinc-400 leading-relaxed">
              y4yes is a free, secure, and all-in-one network utility suite designed for developers and network administrators. It combines essential tools like <strong className="text-white">DNS Lookup</strong>, <strong className="text-white">Port Scanning</strong>, <strong className="text-white">SSL Verification</strong>, and <strong className="text-white">Whois Lookup</strong> into a single interface, allowing you to diagnose connectivity issues directly from your browser without installing external software.
            </p>
          </div>

          <div className="faq-item space-y-2">
            <h3 className="text-xl font-semibold text-white">How can I check if my DNS records are propagating correctly?</h3>
            <p className="text-zinc-400 leading-relaxed">
              You can use the <strong className="text-white">y4yes DNS Lookup tool</strong> to instantly query A, MX, CNAME, and TXT records. Unlike standard command-line tools, y4yes checks multiple record types simultaneously to verify if your domain changes have propagated across the global internet.
            </p>
          </div>

          <div className="faq-item space-y-2">
            <h3 className="text-xl font-semibold text-white">Is checking my IP address or scanning ports on y4yes safe?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Yes. y4yes operates as a client-side optimized tool suite. Whether you are performing a <strong className="text-white">Ping Test</strong>, <strong className="text-white">Traceroute</strong>, or <strong className="text-white">Port Scan</strong>, we prioritize user privacy and do not log your sensitive query data. It is the safest way to verify your public IP and test firewall security from an external source.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-12 mb-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white mb-6">Why use y4yes?</h3>
        <p className="text-lg leading-relaxed text-zinc-300">
          Developers and System Administrators rely on y4yes to <strong className="text-white">troubleshoot DNS propagation</strong> issues globally, <strong className="text-white">scan for open ports</strong> on firewalls, and <strong className="text-white">verify SSL certificate expiration</strong> without installing external software.
        </p>
        <p className="text-lg leading-relaxed text-zinc-300">
          Whether you need to <strong className="text-white">trace an IP address</strong> location, check if a website is down, or run a reliable <strong className="text-white">ping test</strong> for latency, our suite provides secure, client-side diagnostics instantly.
        </p>
      </section>
    </div>
  );
}

