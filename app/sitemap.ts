import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://y4yes.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/faq',
        '/blog',
        '/supertool',
        '/speed-test',
        '/whois',
        '/ping',
        '/dns',
        '/port-scan',
        '/ssl-check',
        '/traceroute',
        '/url-encode',
        '/ip',
        '/sitemap-page',
        '/browser-fingerprint',
        '/dns-error-checker',
        '/ip-location-accuracy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Blog posts
    const posts = [
        'how-to-find-ip-address',
        'ipv4-vs-ipv6-complete-guide',
        'internet-speed-test-guide',
        'dns-explained-simple-guide',
        'network-troubleshooting-commands',
    ].map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...posts];
}
