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
  title: "y4yes - Network Tools Suite",
  description: "Simple, fast, and secure network tools: IP Checker, Speed Test, DNS Lookup, WHOIS, Port Scanner, and more.",
  keywords: ["network tools", "ip checker", "speed test", "dns lookup", "whois", "port scanner", "ssl checker", "traceroute", "url encoder"],
  openGraph: {
    title: "y4yes - Network Tools Suite",
    description: "Simple, fast, and secure network tools for developers and admins.",
    type: "website",
    locale: "en_US",
    siteName: "y4yes",
  },
  twitter: {
    card: "summary_large_image",
    title: "y4yes - Network Tools Suite",
    description: "Simple, fast, and secure network tools.",
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
