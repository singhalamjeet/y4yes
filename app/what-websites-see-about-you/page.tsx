import { Metadata } from 'next';
import { headers } from 'next/headers';
import PrivacyDashboardClient from './client';

export const metadata: Metadata = {
    title: 'What Websites See About You? (Live Privacy Check) | y4yes',
    description: 'See exactly what information specific websites can detect about your browser, device, and network. A neutral, educational privacy dashboard with no tracking.',
    keywords: [
        'what websites see about me',
        'browser privacy check',
        'what info do websites collect',
        'ip address visibility',
        'browser fingerprinting test',
        'privacy dashboard'
    ],
    openGraph: {
        title: 'What Websites See About You? (Live Privacy Check)',
        description: 'See exactly what information websites can detect about you. No cookies, no tracking.',
        url: 'https://y4yes.com/what-websites-see-about-you',
        type: 'website',
    },
};

export default async function WhatWebsitesSeePage() {
    const headersList = await headers();

    // Extract server-side visible data
    const serverData = {
        ip: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Detected via Client',
        userAgent: headersList.get('user-agent') || 'Unknown',
        acceptLanguage: headersList.get('accept-language') || 'Unknown',
        referer: headersList.get('referer') || 'Direct / None',
        dnt: headersList.get('dnt') || headersList.get('sec-gpc') || 'Not Set',
        platform: headersList.get('sec-ch-ua-platform') || 'Unknown',
        mobile: headersList.get('sec-ch-ua-mobile') || 'Unknown',
        encoding: headersList.get('accept-encoding') || 'Unknown',
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "What Websites See About You",
        "applicationCategory": "PrivacyTool",
        "operatingSystem": "Any",
        "description": "A privacy dashboard that shows what information websites can detect about your browser and network.",
        "offers": {
            "@type": "Offer",
            "price": "0"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can websites see my exact location?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Websites can typically only see your approximate location (City/Country) based on your IP address. Exact GPS location requires your explicit permission."
                }
            },
            {
                "@type": "Question",
                "name": "Can websites see my real name?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Your real name, address, and phone number are not transmitted by your browser unless you type them into a form or are logged into a specific service."
                }
            },
            {
                "@type": "Question",
                "name": "Does this tool save my data?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. This tool runs entirely in your session. No data is stored, logged, or shared."
                }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <PrivacyDashboardClient serverData={serverData} />
        </>
    );
}
