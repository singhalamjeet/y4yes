import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { blogPosts } from '../blogData';
import { blogContent } from '../blogContent';

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.title + ' | y4yes',
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);
    const content = blogContent[params.slug];

    if (!post || !content) {
        notFound();
    }

    // Structured data for blog post
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "datePublished": post.date,
        "author": {
            "@type": "Organization",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "y4yes",
            "logo": {
                "@type": "ImageObject",
                "url": "https://y4yes.com/icon.png"
            }
        },
        "description": post.excerpt
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

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
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-500">{post.readTime}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            {post.excerpt}
                        </p>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-white 
                        prose-a:text-blue-400 hover:prose-a:text-blue-300 
                        prose-strong:text-white
                        prose-code:text-blue-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-table:border-zinc-700
                        prose-th:border-zinc-700 prose-th:bg-zinc-800
                        prose-td:border-zinc-700
                        prose-ul:text-zinc-300
                        prose-ol:text-zinc-300
                        prose-p:text-zinc-300">
                        {content.content}
                    </div>

                    {/* Related Tools CTA */}
                    <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30">
                        <h3 className="text-xl font-bold text-white mb-4">Try Our Network Tools</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Link href="/ip" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                                <div className="text-2xl mb-1">🌐</div>
                                <div className="text-sm font-medium">IP Lookup</div>
                            </Link>
                            <Link href="/speed-test" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                                <div className="text-2xl mb-1">🚀</div>
                                <div className="text-sm font-medium">Speed Test</div>
                            </Link>
                            <Link href="/dns" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                                <div className="text-2xl mb-1">🔍</div>
                                <div className="text-sm font-medium">DNS Lookup</div>
                            </Link>
                            <Link href="/ping" className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-center">
                                <div className="text-2xl mb-1">📡</div>
                                <div className="text-sm font-medium">Ping Test</div>
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
}
