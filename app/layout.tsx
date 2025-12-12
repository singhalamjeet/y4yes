import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://y4yes.com'),
  title: {
    default: "y4yes - Network Tools Suite",
    template: "%s | y4yes"
  },
  description: "Simple, fast, and secure network tools: IP Checker, Speed Test, DNS Lookup, WHOIS, Port Scanner, and more. No logs, no tracking.",
  keywords: ["network tools", "ip checker", "speed test", "dns lookup", "whois", "port scanner", "ssl checker", "traceroute", "url encoder", "developer tools"],
  authors: [{ name: "y4yes Team" }],
  openGraph: {
    title: "y4yes - Network Tools Suite",
    description: "Simple, fast, and secure network tools for developers and system administrators.",
    url: 'https://y4yes.com',
    siteName: 'y4yes',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "y4yes - Network Tools Suite",
    description: "Simple, fast, and secure network tools for developers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "y4yes Network Tools Suite",
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "A free suite of network utilities including DNS Lookup, Speed Test, Ping, and SSL Checker."
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is y4yes Network Tools Suite?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "y4yes is a free, secure, and all-in-one network utility suite designed for developers and network administrators. It includes DNS Lookup, Port Scanning, SSL Verification, and more."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How can I check if my DNS records are propagating?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Use the y4yes DNS Lookup tool to instantly query A, MX, CNAME, and TXT records simultaneously to verify global propagation."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
