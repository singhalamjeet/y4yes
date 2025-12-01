import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - Network Insights & Tutorials',
    description: 'Read articles, tutorials, and guides about networking, DNS, security, SSL/TLS, and web development from the y4yes team.',
    keywords: ['blog', 'network tutorials', 'dns guides', 'security articles', 'networking'],
};

// Dummy blog data - in a real app this would come from a CMS or MDX files
const posts = [
    {
        slug: 'understanding-dns-records',
        title: 'Understanding DNS Records: A Beginner\'s Guide',
        excerpt: 'Learn the difference between A, AAAA, CNAME, MX, and TXT records and how they control your domain.',
        date: '2025-11-28',
        readTime: '5 min read',
        category: 'DNS'
    },
    {
        slug: 'ipv4-vs-ipv6',
        title: 'IPv4 vs IPv6: What\'s the Difference?',
        excerpt: 'An in-depth look at the two versions of the Internet Protocol and why the transition to IPv6 matters.',
        date: '2025-11-25',
        readTime: '7 min read',
        category: 'Networking'
    },
    {
        slug: 'how-ssl-works',
        title: 'How SSL/TLS Certificates Protect Your Data',
        excerpt: 'Demystifying the handshake process and encryption that keeps your web browsing secure.',
        date: '2025-11-20',
        readTime: '6 min read',
        category: 'Security'
    }
];

export default function BlogPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Network Insights
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Articles, tutorials, and guides about networking, security, and web development.
                </p>
            </section>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                        <article className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                                        {post.category}
                                    </span>
                                    <span className="text-zinc-500">{post.date}</span>
                                    <span className="text-zinc-500">•</span>
                                    <span className="text-zinc-500">{post.readTime}</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {post.excerpt}
                            </p>

                            <div className="mt-4 flex items-center text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                Read Article
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
