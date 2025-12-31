import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { blogPosts } from './blogData';

export const metadata: Metadata = {
    title: 'Network Tools Blog - Tutorials, Guides & Tips | y4yes',
    description: 'Expert guides on networking, DNS, IP addresses, internet speed, and troubleshooting. Learn from comprehensive tutorials and boost your network knowledge.',
    keywords: [
        'network blog',
        'networking tutorials',
        'dns guides',
        'ip address guide',
        'internet speed tips',
        'network troubleshooting',
        'tech blog'
    ],
};

export default function BlogPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Network Tools Blog
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Expert guides, tutorials, and tips to master networking, DNS, speed testing, and troubleshooting.
                </p>
            </section>

            <div className="grid gap-6">
                {blogPosts.map((post) => (
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

