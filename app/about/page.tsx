import React from 'react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    About y4yes
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Your comprehensive suite of professional network tools, designed for developers and system administrators.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
                    <p className="text-zinc-400 leading-relaxed">
                        At y4yes, we believe that powerful network diagnostics should be accessible, fast, and easy to use.
                        We're building a centralized platform where developers can find all the essential tools they need
                        to debug, analyze, and optimize their network infrastructure without juggling multiple websites.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Why Choose Us?</h2>
                    <ul className="space-y-3 text-zinc-400">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">✓</span>
                            <span><strong>All-in-One:</strong> From DNS lookups to SSL checks, everything is here.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">✓</span>
                            <span><strong>Privacy First:</strong> We don't log your queries or track your usage.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">✓</span>
                            <span><strong>Developer Friendly:</strong> Clean interface, dark mode, and fast performance.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
