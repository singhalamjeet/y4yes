import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - y4yes',
    description: 'Read the y4yes Terms of Service. Learn about usage guidelines and legal terms for using our network tools.',
    keywords: ['terms of service', 'usage terms', 'legal'],
};

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>

            <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using y4yes.com, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily use the materials (information or software) on y4yes's website for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                    <p>
                        You may not:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Use the tools for any illegal or unauthorized purpose.</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Disclaimer</h2>
                    <p>
                        The materials on y4yes's website are provided "as is". y4yes makes no warranties, expressed or implied, and hereby disclaims
                        and negates all other warranties, including without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Limitations</h2>
                    <p>
                        In no event shall y4yes or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on y4yes's website.
                    </p>
                </section>
            </div>
        </div>
    );
}
