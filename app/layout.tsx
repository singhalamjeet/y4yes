import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
