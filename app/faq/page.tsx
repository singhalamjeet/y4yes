import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to common questions about y4yes network tools, privacy, API access, and more.',
    keywords: ['faq', 'help', 'questions', 'support'],
};

export default function FAQPage() {
    const faqs = [
        {
            question: "Is y4yes free to use?",
            answer: "Yes, all our core network tools are completely free to use for developers and system administrators."
        },
        {
            question: "Do you store my search history?",
            answer: "No. We prioritize your privacy and do not log your DNS queries, IP lookups, or other tool usage data."
        },
        {
            question: "Can I use these tools for commercial purposes?",
            answer: "Yes, you are free to use our tools to debug and optimize your commercial projects and infrastructure."
        },
        {
            question: "How accurate is the IP geolocation data?",
            answer: "We use industry-standard databases for IP geolocation. However, accuracy can vary depending on the ISP and region. It should be used for general reference only."
        },
        {
            question: "Do you offer an API?",
            answer: "Not currently, but we are planning to release a developer API in the future. Stay tuned!"
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8">
            <section className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
                <p className="text-zinc-400">
                    Common questions about our network tools and services.
                </p>
            </section>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <details key={index} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                            <h3 className="font-medium text-white">{faq.question}</h3>
                            <span className="transform group-open:rotate-180 transition-transform text-zinc-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 leading-relaxed border-t border-transparent group-open:border-zinc-800">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
