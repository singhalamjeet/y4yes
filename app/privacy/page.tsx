import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - y4yes',
    description: 'Read the y4yes Privacy Policy. We do not log your queries or track your usage. Your privacy is our priority.',
    keywords: ['privacy policy', 'data protection', 'no logging', 'privacy-first'],
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>

            <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
                    <p>
                        Welcome to y4yes ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy explains how we collect, use, and share your information when you use our website and network tools.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. Information We Collect</h2>
                    <p>
                        We prioritize your privacy. Unlike many other services:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>We do <strong>not</strong> log the DNS queries, IP lookups, or other network checks you perform.</li>
                        <li>We do <strong>not</strong> require account registration to use our core tools.</li>
                        <li>We may collect anonymous usage data (e.g., page views) to improve our site performance.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Cookies</h2>
                    <p>
                        We use essential cookies to ensure the website functions correctly (e.g., remembering your theme preference).
                        We may use third-party analytics cookies to understand how visitors interact with our website.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Third-Party Services</h2>
                    <p>
                        Our tools may interact with third-party APIs (such as WHOIS databases or DNS servers) to provide you with results.
                        These requests are made anonymously where possible.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@y4yes.com" className="text-blue-400 hover:underline">support@y4yes.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
