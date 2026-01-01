import { Metadata } from 'next';
import IPv6AdoptionClient from './client';

export const metadata: Metadata = {
    title: 'IPv6 Adoption Statistics by Country – Live Internet Data | y4yes',
    description: 'Current IPv6 adoption rates globally and by country. Live data, charts, and expert analysis on IPv6 deployment. Updated regularly. Citation-worthy for researchers.',
    keywords: [
        'ipv6 adoption rate',
        'ipv6 statistics',
        'ipv6 deployment',
        'ipv6 by country',
        'ipv6 vs ipv4',
        'internet protocol statistics',
        'ipv6 rollout',
        'ipv4 exhaustion'
    ],
    openGraph: {
        title: 'IPv6 Adoption Statistics – Live Global Data',
        description: 'Track global IPv6 adoption rates with live statistics and country-level data.',
        url: 'https://y4yes.com/ipv6-adoption',
        type: 'website',
    },
    alternates: {
        canonical: 'https://y4yes.com/ipv6-adoption'
    }
};

export default function IPv6AdoptionPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "IPv6 Adoption Statistics",
        "description": "Global IPv6 adoption rates by country with historical trends",
        "url": "https://y4yes.com/ipv6-adoption",
        "temporalCoverage": "2025",
        "spatialCoverage": {
            "@type": "Place",
            "name": "Global"
        },
        "creator": {
            "@type": "Organization",
            "name": "y4yes",
            "url": "https://y4yes.com"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/"
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <IPv6AdoptionClient />
        </>
    );
}
