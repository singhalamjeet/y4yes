import React from 'react';

export default function ContactPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">Contact Us</h1>
                <p className="text-zinc-400">
                    Have questions, suggestions, or found a bug? We'd love to hear from you.
                </p>
            </section>

            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Email Support</h2>
                    <p className="text-zinc-400">
                        For general inquiries and support, please email us at:
                    </p>
                    <a href="mailto:support@y4yes.com" className="text-blue-400 hover:text-blue-300 font-medium text-lg block mt-2">
                        support@y4yes.com
                    </a>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                    <p className="text-sm text-zinc-500">
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
