import { Metadata } from 'next';
import IPLocationClient from './client';

export const metadata: Metadata = {
    title: 'IP Location Accuracy Test – How Precise Is IP Geolocation? | y4yes',
    description: 'Test IP geolocation accuracy across multiple databases. See real data comparing different GeoIP providers. Understand why city-level IP tracking is unreliable.',
    keywords: [
        'ip location accuracy',
        'how accurate is ip address location',
        'ip geolocation accuracy',
        'can ip address show exact location',
        'ip tracking accuracy',
        'geoip accuracy',
        'ip location city accuracy'
    ],
    openGraph: {
        title: 'IP Location Accuracy Test – Real Data Comparison',
        description: 'Compare IP geolocation accuracy across multiple databases. Educational tool debunking IP tracking myths.',
        url: 'https://y4yes.com/ip-location-accuracy',
        type: 'website',
    },
};

export default function IPLocationPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How accurate is IP address location?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "IP geolocation accuracy varies: Country-level is 95-99% accurate, Region/State is 80-95% accurate, but City-level is only 50-80% accurate and can be wrong by hundreds of miles. Exact location tracking via IP alone is impossible."
                }
            },
            {
                "@type": "Question",
                "name": "Can police track exact location from IP address?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. IP addresses only reveal your ISP and approximate location (usually city or region). Police need cooperation from your ISP to get subscriber information and exact address, which requires a legal warrant."
                }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <IPLocationClient />
        </>
    );
}
