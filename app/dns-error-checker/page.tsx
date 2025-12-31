import { Metadata } from 'next';
import DNSErrorClient from './client';

export const metadata: Metadata = {
    title: 'DNS_PROBE_FINISHED_NXDOMAIN Explained – Fix DNS Errors | y4yes',
    description: 'Fix DNS_PROBE_FINISHED_NXDOMAIN and other DNS errors. Live DNS checker with step-by-step fixes for Windows, Mac, Linux, and mobile. Clear explanations for all DNS issues.',
    keywords: [
        'dns_probe_finished_nxdomain',
        'dns error',
        'nxdomain',
        'dns lookup failed',
        'domain not found',
        'how to fix dns error',
        'dns server not responding',
        'err_name_not_resolved',
        'flush dns cache',
        'fix dns windows',
        'fix dns mac',
        'dns troubleshooting'
    ],
    openGraph: {
        title: 'DNS_PROBE_FINISHED_NXDOMAIN Explained – Fix DNS Errors',
        description: 'Understand and fix DNS errors with live DNS checker and step-by-step guides for all operating systems.',
        url: 'https://y4yes.com/dns-error-checker',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fix DNS_PROBE_FINISHED_NXDOMAIN Error',
        description: 'Live DNS checker with fixes for Windows, Mac, Linux, and mobile.',
    },
    alternates: {
        canonical: 'https://y4yes.com/dns-error-checker'
    }
};

export default function DNSErrorPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "HowTo",
                "name": "How to Fix DNS_PROBE_FINISHED_NXDOMAIN Error",
                "description": "Step-by-step guide to fix DNS errors on any operating system",
                "step": [
                    {
                        "@type": "HowToStep",
                        "name": "Check Domain Spelling",
                        "text": "Verify the domain name is spelled correctly and exists"
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Flush DNS Cache",
                        "text": "Clear your DNS cache using ipconfig /flushdns on Windows or dscacheutil on Mac"
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Change DNS Server",
                        "text": "Switch to public DNS servers like 1.1.1.1 or 8.8.8.8"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What does DNS_PROBE_FINISHED_NXDOMAIN mean?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "DNS_PROBE_FINISHED_NXDOMAIN means the DNS server returned an NXDOMAIN response, indicating the domain name does not exist or cannot be resolved. This typically happens when a domain is misspelled, doesn't exist, or there's a DNS configuration issue."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I fix DNS_PROBE_FINISHED_NXDOMAIN?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "To fix DNS_PROBE_FINISHED_NXDOMAIN: 1) Check domain spelling, 2) Flush DNS cache (ipconfig /flushdns on Windows), 3) Change to public DNS servers (1.1.1.1 or 8.8.8.8), 4) Restart your router, 5) Disable VPN if active."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What causes NXDOMAIN errors?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "NXDOMAIN errors are caused by: domain not existing, typos in domain name, DNS cache issues, incorrect DNS server settings, domain recently registered (DNS not propagated yet), or domain expired/deleted."
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
            <DNSErrorClient />
        </>
    );
}
