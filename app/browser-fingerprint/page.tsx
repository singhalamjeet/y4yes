import { Metadata } from 'next';
import BrowserFingerprintClient from './client';

export const metadata: Metadata = {
    title: 'Browser Fingerprint Test – How Unique Is Your Browser? | y4yes',
    description: 'Test your browser fingerprint uniqueness. See what data websites can track without cookies. Privacy-focused educational tool with transparent methodology. Citation-worthy for researchers.',
    keywords: [
        'browser fingerprint test',
        'browser uniqueness',
        'how unique is my browser',
        'browser fingerprinting',
        'canvas fingerprint',
        'webgl fingerprint',
        'privacy test',
        'browser tracking',
        'fingerprint privacy',
        'anti-tracking'
    ],
    openGraph: {
        title: 'Browser Fingerprint Test – How Unique Is Your Browser?',
        description: 'Test your browser fingerprint uniqueness. Educational tool explaining what websites can track without cookies.',
        url: 'https://y4yes.com/browser-fingerprint',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Browser Fingerprint Test',
        description: 'Test your browser fingerprint uniqueness and learn about online tracking.',
    },
    alternates: {
        canonical: 'https://y4yes.com/browser-fingerprint'
    }
};

export default function BrowserFingerprintPage() {
    // Structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Browser Fingerprint Test",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "description": "Test your browser fingerprint uniqueness and learn about browser tracking techniques."
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is browser fingerprinting?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Browser fingerprinting is a technique that websites use to identify and track users by collecting information about their browser and device configuration, such as screen resolution, installed fonts, and canvas rendering capabilities."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How unique is my browser fingerprint?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Most browser fingerprints are highly unique. Research shows that the average browser fingerprint is unique among millions of users due to the combination of various browser and device characteristics."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can browser fingerprinting track me without cookies?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, browser fingerprinting can identify and track users without cookies by analyzing browser characteristics. This makes it more persistent than cookie-based tracking."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <BrowserFingerprintClient />
        </>
    );
}
