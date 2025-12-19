'use client';

import Script from 'next/script';

interface BreadcrumbSchemaProps {
    toolName: string;
    toolPath: string;
}

export function BreadcrumbSchema({ toolName, toolPath }: BreadcrumbSchemaProps) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://y4yes.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": toolName,
                "item": `https://y4yes.com${toolPath}`
            }
        ]
    };

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    );
}
