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

      {/* Extension Promotion Section */}
      <section className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="space-y-4 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New Release
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Get y4yes for Chrome
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Access your favorite network tools instantly from any tab. Check your IP, inspect websites, and run speed tests without leaving your current page.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
              <span>Instant IP Check</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
              <span>Site Inspection</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
              <span>One-click Tools</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <a
            href="#"
            className="group flex items-center gap-3 bg-white text-zinc-950 px-6 py-3.5 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            onClick={(e) => {
              e.preventDefault();
              alert("The extension is currently under review by the Chrome Web Store. Check back soon!");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" x2="12" y1="8" y2="8" /><line x1="3.95" x2="8.54" y1="6.06" y2="14" /><line x1="10.88" x2="15.46" y1="21.94" y2="14" /></svg>
            Add to Chrome
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
          <p className="text-center text-xs text-zinc-500 mt-2">Version 1.0 • Free</p>
        </div>
      </section>
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

