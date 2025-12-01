import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Post metadata for SEO
const postMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
    'understanding-dns-records': {
        title: 'Understanding DNS Records: A Beginner\'s Guide',
        description: 'Learn the difference between A, AAAA, CNAME, MX, and TXT records and how they control your domain. Complete DNS guide for beginners.',
        keywords: ['dns records', 'dns guide', 'a record', 'cname', 'mx record', 'txt record', 'dns explained']
    },
    'ipv4-vs-ipv6': {
        title: 'IPv4 vs IPv6: What\'s the Difference?',
        description: 'An in-depth comparison of IPv4 and IPv6. Learn why the transition to IPv6 matters and understand the key differences between these protocols.',
        keywords: ['ipv4 vs ipv6', 'internet protocol', 'ipv6 transition', 'ip addresses', 'networking']
    },
    'how-ssl-works': {
        title: 'How SSL/TLS Certificates Protect Your Data',
        description: 'Demystifying the SSL/TLS handshake process and encryption that keeps your web browsing secure. Learn how HTTPS protects your data.',
        keywords: ['ssl certificate', 'tls', 'https', 'ssl handshake', 'web security', 'encryption']
    }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const meta = postMetadata[params.slug];

    if (!meta) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'article',
        },
    };
}

// Dummy data store - matching the listing page
const posts: Record<string, { title: string; date: string; category: string; content: React.ReactNode }> = {
    'understanding-dns-records': {
        title: 'Understanding DNS Records: A Beginner\'s Guide',
        date: '2025-11-28',
        category: 'DNS',
        content: (
            <>
                <p>The Domain Name System (DNS) is the phonebook of the Internet. Humans access information online through domain names, like google.com or espn.com. Web browsers interact through Internet Protocol (IP) addresses. DNS translates domain names to IP addresses so browsers can load Internet resources.</p>

                <h3>Common DNS Record Types</h3>
                <ul>
                    <li><strong>A Record:</strong> Maps a domain name to the IP address (IPv4) of the computer hosting the domain.</li>
                    <li><strong>AAAA Record:</strong> Similar to A records but maps to an IPv6 address.</li>
                    <li><strong>CNAME Record:</strong> Canonical Name record. Maps one domain name to another (an alias).</li>
                    <li><strong>MX Record:</strong> Mail Exchange record. Specifies the mail server responsible for accepting email messages on behalf of a domain name.</li>
                    <li><strong>TXT Record:</strong> Text record. Used to verify domain ownership and for email security (SPF, DKIM, DMARC).</li>
                </ul>

                <h3>Why DNS Matters</h3>
                <p>Without DNS, we would have to remember IP addresses for every website we want to visit. DNS makes the internet accessible and user-friendly.</p>

                <p>Want to check DNS records for any domain? Try our <Link href="/dns" className="text-blue-400 hover:text-blue-300 underline">DNS Lookup Tool</Link> to view A, AAAA, MX, TXT, NS, CNAME, and SOA records instantly.</p>
            </>
        )
    },
    'ipv4-vs-ipv6': {
        title: 'IPv4 vs IPv6: What\'s the Difference?',
        date: '2025-11-25',
        category: 'Networking',
        content: (
            <>
                <p>Internet Protocol version 4 (IPv4) and Internet Protocol version 6 (IPv6) are the two versions of the Internet Protocol that are currently in use. They define how devices connect to the internet and communicate with each other.</p>

                <h3>The Address Shortage</h3>
                <p>IPv4 uses 32-bit addresses, which limits the address space to 4.3 billion addresses. With the explosion of internet-connected devices, we have run out of IPv4 addresses.</p>

                <h3>Enter IPv6</h3>
                <p>IPv6 uses 128-bit addresses, allowing for approximately 3.4×10^38 addresses. This is a number so large that we will likely never run out.</p>

                <h3>Key Differences</h3>
                <ul>
                    <li><strong>Address Format:</strong> IPv4 uses numeric dot-decimal notation (192.168.1.1), while IPv6 uses alphanumeric hexadecimal notation (2001:0db8:85a3:0000:0000:8a2e:0370:7334).</li>
                    <li><strong>Header Complexity:</strong> IPv6 has a simpler header format, designed to minimize packet processing.</li>
                    <li><strong>Security:</strong> IPSec was built into the IPv6 specification, whereas it is an add-on for IPv4.</li>
                </ul>

                <p>Check your public IP address and see if you're using IPv4 or IPv6 with our <Link href="/ip" className="text-blue-400 hover:text-blue-300 underline">IP Checker Tool</Link>.</p>
            </>
        )
    },
    'how-ssl-works': {
        title: 'How SSL/TLS Certificates Protect Your Data',
        date: '2025-11-20',
        category: 'Security',
        content: (
            <>
                <p>SSL (Secure Sockets Layer) and its successor, TLS (Transport Layer Security), are protocols for establishing authenticated and encrypted links between networked computers.</p>

                <h3>The Handshake</h3>
                <p>When you visit a secure website (https), your browser and the web server perform an "SSL Handshake":</p>
                <ol>
                    <li><strong>Client Hello:</strong> Browser sends supported encryption methods.</li>
                    <li><strong>Server Hello:</strong> Server chooses a method and sends its SSL certificate.</li>
                    <li><strong>Authentication:</strong> Browser verifies the certificate with a Certificate Authority (CA).</li>
                    <li><strong>Key Exchange:</strong> Browser and server generate a session key to encrypt the data.</li>
                </ol>

                <h3>Why You Need SSL</h3>
                <p>SSL protects sensitive data like passwords and credit card numbers from being intercepted by attackers. It also builds trust with your users and improves your SEO rankings.</p>

                <p>Verify your website's SSL certificate installation and validity with our <Link href="/ssl-check" className="text-blue-400 hover:text-blue-300 underline">SSL Checker Tool</Link>.</p>
            </>
        )
    }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = posts[params.slug];

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Link href="/blog" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Articles
            </Link>

            <article className="space-y-8">
                <header className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                            {post.category}
                        </span>
                        <span className="text-zinc-500">{post.date}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {post.title}
                    </h1>
                </header>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white">
                    {post.content}
                </div>
            </article>
        </div>
    );
}
